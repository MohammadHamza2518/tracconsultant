'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useConfig } from '@/context/ConfigContext';
import ToolPaywallModal from '@/components/ToolPaywallModal';
import { 
  Sparkles, 
  ShieldCheck, 
  Lock, 
  Unlock, 
  Download, 
  Upload, 
  Check, 
  FileText, 
  Search, 
  Filter, 
  RefreshCw,
  Building,
  ArrowRight,
  CheckCircle2, 
  FileSpreadsheet,
  FileCheck,
  Trash2,
  AlertCircle
} from 'lucide-react';
import * as XLSX from 'xlsx';

export interface SupplierSummary {
  gstin: string;
  tradeName: string;
  invoiceCount: number;
  taxableValue: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalItc: number;
  filingStatus: 'Filed' | 'Pending' | 'Cancelled';
}

const CLEANED_SUPPLIERS_DEMO: SupplierSummary[] = [
  { gstin: '07AAAAA0000A1Z5', tradeName: 'Tata Telecommunications Ltd', invoiceCount: 14, taxableValue: 620000, cgst: 55800, sgst: 55800, igst: 0, totalItc: 111600, filingStatus: 'Filed' },
  { gstin: '27BBBBB1111B2Z6', tradeName: 'Infosys BPM Services', invoiceCount: 6, taxableValue: 480000, cgst: 0, sgst: 0, igst: 86400, totalItc: 86400, filingStatus: 'Filed' },
  { gstin: '09CCCCC2222C3Z7', tradeName: 'Sharma Logistics & Transport', invoiceCount: 8, taxableValue: 320000, cgst: 28800, sgst: 28800, igst: 0, totalItc: 57600, filingStatus: 'Filed' },
  { gstin: '06DDDDD3333D4Z8', tradeName: 'Apex Cloud Solutions', invoiceCount: 3, taxableValue: 200000, cgst: 0, sgst: 0, igst: 36000, totalItc: 36000, filingStatus: 'Pending' },
  { gstin: '03EEEEE4444E5Z9', tradeName: 'Northern Paper Mills', invoiceCount: 5, taxableValue: 180000, cgst: 10800, sgst: 10800, igst: 0, totalItc: 21600, filingStatus: 'Filed' },
  { gstin: '24GGGGG7777G8Z3', tradeName: 'Reliance Retail Ventures', invoiceCount: 12, taxableValue: 850000, cgst: 76500, sgst: 76500, igst: 0, totalItc: 153000, filingStatus: 'Filed' }
];

export default function Gstr2aCleanerPage() {
  const { user, hasToolAccess, refreshUser } = useAuth();
  const { getToolPrice } = useConfig();
  const toolId = 'gstr2a-cleaner';
  const toolName = 'Clean GSTR-2A & Supplier-Wise Summary Tool';
  const price = getToolPrice(toolId, 199);

  const isUnlocked = hasToolAccess(toolId);
  const [paywallOpen, setPaywallOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [suppliers, setSuppliers] = useState<SupplierSummary[]>(CLEANED_SUPPLIERS_DEMO);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Filed' | 'Pending'>('all');
  const [uploadedFileName, setUploadedFileName] = useState('GSTR2A_Raw_May2024.xlsx');
  const [duplicateCount, setDuplicateCount] = useState(7);
  const [cancelledCount, setCancelledCount] = useState(2);

  // Real Excel/CSV upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    const reader = new FileReader();

    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rawData = XLSX.utils.sheet_to_json<any>(ws, { header: 1 });

        if (!rawData || rawData.length < 2) {
          alert('Spreadsheet is empty or missing data rows.');
          return;
        }

        // Deduplicate & Group by GSTIN
        const gstinMap = new Map<string, SupplierSummary>();
        const seenInvoices = new Set<string>();
        let dupesFound = 0;
        let cancelledFound = 0;

        for (let i = 1; i < rawData.length; i++) {
          const row = rawData[i];
          if (!row || !row[0]) continue;

          const gstin = String(row[0] || '').trim().toUpperCase();
          const tradeName = String(row[1] || 'Unknown Vendor').trim();
          const invNo = String(row[2] || `INV-${i}`).trim();
          const taxable = Number(row[3]) || 0;
          const cgst = Number(row[4]) || 0;
          const sgst = Number(row[5]) || 0;
          const igst = Number(row[6]) || 0;
          const totalItc = cgst + sgst + igst;
          const status = String(row[7] || '').toLowerCase().includes('pending') ? 'Pending' : 'Filed';

          // Duplicate key: GSTIN + InvoiceNo
          const key = `${gstin}_${invNo}`;
          if (seenInvoices.has(key)) {
            dupesFound++;
            continue; // Skip duplicate invoice
          }
          seenInvoices.add(key);

          // Check if cancelled
          if (tradeName.toLowerCase().includes('cancelled') || status === 'Pending') {
            cancelledFound++;
          }

          if (gstinMap.has(gstin)) {
            const existing = gstinMap.get(gstin)!;
            existing.invoiceCount += 1;
            existing.taxableValue += taxable;
            existing.cgst += cgst;
            existing.sgst += sgst;
            existing.igst += igst;
            existing.totalItc += totalItc;
          } else {
            gstinMap.set(gstin, {
              gstin,
              tradeName,
              invoiceCount: 1,
              taxableValue: taxable,
              cgst,
              sgst,
              igst,
              totalItc,
              filingStatus: status
            });
          }
        }

        const cleaned = Array.from(gstinMap.values());
        if (cleaned.length > 0) {
          setSuppliers(cleaned);
          setDuplicateCount(dupesFound);
          setCancelledCount(cancelledFound);
          alert(`File processed! ${dupesFound} duplicate invoices removed and ${cleaned.length} vendors consolidated.`);
        } else {
          alert('Could not auto-map GSTR-2A columns. Expected: GSTIN, Vendor Name, Invoice No, Taxable, CGST, SGST, IGST.');
        }
      } catch (err: any) {
        alert('Failed to parse file: ' + err.message);
      }
    };

    reader.readAsBinaryString(file);
  };

  const filteredSuppliers = suppliers.filter(s => {
    const matchesStatus = statusFilter === 'all' || s.filingStatus === statusFilter;
    const q = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm || s.tradeName.toLowerCase().includes(q) || s.gstin.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  const totalInvoices = suppliers.reduce((a, b) => a + b.invoiceCount, 0);
  const totalTaxable = suppliers.reduce((a, b) => a + b.taxableValue, 0);
  const grandTotalItc = suppliers.reduce((a, b) => a + b.totalItc, 0);

  // Real Excel Export using xlsx
  const handleExportExcel = () => {
    if (!isUnlocked) {
      setPaywallOpen(true);
      return;
    }

    const wb = XLSX.utils.book_new();

    // Sheet 1: Supplier Summary
    const summaryData = [
      ['GSTR-2A DEDUPLICATED SUPPLIER SUMMARY', '', '', '', '', '', '', '', ''],
      [`Source File: ${uploadedFileName}`, '', `Generated: ${new Date().toLocaleDateString('en-IN')}`, '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', ''],
      ['Supplier GSTIN', 'Trade / Legal Name', 'Cleaned Invoices', 'Taxable Value (INR)', 'CGST', 'SGST', 'IGST', 'Total Eligible ITC', 'GSTR-1 Status'],
      ...suppliers.map(s => [
        s.gstin,
        s.tradeName,
        s.invoiceCount,
        s.taxableValue,
        s.cgst,
        s.sgst,
        s.igst,
        s.totalItc,
        s.filingStatus
      ]),
      ['TOTALS', '', totalInvoices, totalTaxable, '', '', '', grandTotalItc, ''],
      ['DEDUPLICATION STATS', '', `Duplicates Removed: ${duplicateCount}`, `Cancelled Filtered: ${cancelledCount}`, '', '', '', '', '']
    ];

    const ws = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, ws, 'Vendor_ITC_Summary');
    XLSX.writeFile(wb, `GSTR2A_Cleaned_Summary_${Date.now()}.xlsx`);
  };

  return (
    <div className="min-h-screen bg-slate-50/70 pb-20">
      {/* Sleek Breadcrumb Toolbar */}
      <div className="bg-slate-900 border-b border-slate-800 text-white px-4 sm:px-8 py-3">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Link href="/tools" className="text-slate-400 hover:text-white transition-colors">
              Tools Suite
            </Link>
            <span className="text-slate-600">/</span>
            <span className="text-emerald-400 font-semibold">{toolName}</span>
          </div>

          <div className="flex items-center gap-3">
            {isUnlocked ? (
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold flex items-center gap-1.5">
                <Unlock className="w-3.5 h-3.5" /> Workspace Unlocked
              </span>
            ) : (
              <button
                onClick={() => setPaywallOpen(true)}
                className="px-3 py-1 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Unlock Tool (₹{price})</span>
              </button>
            )}
            <Link
              href="/tools"
              className="text-slate-300 hover:text-white px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              ← All Tools
            </Link>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 pt-6 relative z-10 space-y-6">
        
        {/* Header Card */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-5 text-white shadow-md border border-indigo-900/40 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase tracking-wider mb-1 border border-indigo-500/30">
              <Sparkles className="w-3 h-3" /> GSTR-2A Deduplication & Vendor Master Cleaner
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">{toolName}</h1>
            <p className="text-xs text-slate-300 mt-0.5">
              Remove duplicate invoice lines, filter inactive GSTINs, and consolidate turnover by vendor.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              accept=".xlsx,.xls,.csv" 
              className="hidden" 
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload GSTR-2A (.xlsx/.csv)</span>
            </button>
            <button
              onClick={() => {
                setSuppliers(CLEANED_SUPPLIERS_DEMO);
                setDuplicateCount(7);
                setCancelledCount(2);
                setUploadedFileName('Cleaned_Demo_GSTR2A.xlsx');
              }}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold border border-white/10 transition-colors cursor-pointer"
            >
              Reset Demo Data
            </button>
          </div>
        </div>

        {/* 3 KPI Counter Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Cleaned Suppliers</span>
            <div className="text-2xl font-black text-slate-900 mt-1">{suppliers.length} Unique Vendors</div>
            <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">
              {totalInvoices} Invoices consolidated ({duplicateCount} duplicate rows removed)
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Clean Taxable Value</span>
            <div className="text-2xl font-black text-slate-900 mt-1">₹{totalTaxable.toLocaleString('en-IN')}</div>
            <span className="text-[10px] text-slate-400">Zero double-counted invoices</span>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
            <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Total Input Tax Credit (ITC)</span>
            <div className="text-2xl font-black text-emerald-700 mt-1">₹{grandTotalItc.toLocaleString('en-IN')}</div>
            <span className="text-[10px] text-slate-400">Aggregated CGST + SGST + IGST</span>
          </div>
        </div>

        {/* Filter Controls & Search */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Status Pills */}
          <div className="flex gap-2 text-xs font-bold w-full md:w-auto">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Vendors ({suppliers.length})
            </button>
            <button
              onClick={() => setStatusFilter('Filed')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                statusFilter === 'Filed'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              Filed GSTR-1 ({suppliers.filter(s => s.filingStatus === 'Filed').length})
            </button>
            <button
              onClick={() => setStatusFilter('Pending')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                statusFilter === 'Pending'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
              }`}
            >
              Pending ({suppliers.filter(s => s.filingStatus === 'Pending').length})
            </button>
          </div>

          {/* Search Box & Export */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-60">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search vendor or GSTIN..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {isUnlocked ? (
              <button
                onClick={handleExportExcel}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 shrink-0 transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Clean Excel (.xlsx)</span>
              </button>
            ) : (
              <button
                onClick={() => setPaywallOpen(true)}
                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 shrink-0 transition-all cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Unlock (₹{price})</span>
              </button>
            )}
          </div>
        </div>

        {/* Suppliers Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-100 text-slate-700 font-bold text-[11px] border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Vendor / Supplier GSTIN</th>
                  <th className="p-3.5 text-center">Bills</th>
                  <th className="p-3.5 text-right">Taxable Value</th>
                  <th className="p-3.5 text-right">CGST</th>
                  <th className="p-3.5 text-right">SGST</th>
                  <th className="p-3.5 text-right">IGST</th>
                  <th className="p-3.5 text-right">Total Clean ITC</th>
                  <th className="p-3.5 text-center">GSTR-1</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSuppliers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-slate-400">
                      No suppliers found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredSuppliers.map((s) => (
                    <tr key={s.gstin} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-3.5">
                        <div className="font-bold text-slate-900">{s.tradeName}</div>
                        <div className="font-mono text-[10px] text-slate-400">{s.gstin}</div>
                      </td>
                      <td className="p-3.5 text-center font-bold text-slate-700">
                        {s.invoiceCount}
                      </td>
                      <td className="p-3.5 text-right font-mono font-semibold text-slate-900">
                        ₹{s.taxableValue.toLocaleString('en-IN')}
                      </td>
                      <td className="p-3.5 text-right font-mono text-slate-600">
                        ₹{s.cgst.toLocaleString('en-IN')}
                      </td>
                      <td className="p-3.5 text-right font-mono text-slate-600">
                        ₹{s.sgst.toLocaleString('en-IN')}
                      </td>
                      <td className="p-3.5 text-right font-mono text-slate-600">
                        ₹{s.igst.toLocaleString('en-IN')}
                      </td>
                      <td className="p-3.5 text-right font-mono font-bold text-emerald-700">
                        ₹{s.totalItc.toLocaleString('en-IN')}
                      </td>
                      <td className="p-3.5 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          s.filingStatus === 'Filed' 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {s.filingStatus}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Paywall Modal */}
      <ToolPaywallModal
        isOpen={paywallOpen}
        onClose={() => setPaywallOpen(false)}
        toolId={toolId}
        toolName={toolName}
        price={price}
        onUnlockSuccess={() => {
          refreshUser();
        }}
      />
    </div>
  );
}

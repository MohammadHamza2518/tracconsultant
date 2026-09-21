'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useConfig } from '@/context/ConfigContext';
import ToolPaywallModal from '@/components/ToolPaywallModal';
import { 
  GitCompare, 
  ShieldCheck, 
  Lock, 
  Unlock, 
  Download, 
  Upload, 
  Check, 
  Sparkles, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Filter,
  ArrowRight,
  Search,
  Plus,
  RefreshCw,
  FileSpreadsheet,
  AlertOctagon,
  Users
} from 'lucide-react';
import * as XLSX from 'xlsx';

export type MatchStatus = 'matched' | 'mismatch' | 'missing_in_2a' | 'missing_in_books';

export interface ReconRow {
  id: string;
  gstin: string;
  vendorName: string;
  invoiceNo: string;
  invoiceDate: string;
  taxableValue: number;
  booksTax: number;
  portalTax: number;
  difference: number;
  status: MatchStatus;
  remarks: string;
}

const DEMO_RECON_DATA: ReconRow[] = [
  { id: '1', gstin: '07AAAAA0000A1Z5', vendorName: 'Tata Telecommunications Ltd', invoiceNo: 'TTL-8819', invoiceDate: '2024-05-12', taxableValue: 100000, booksTax: 18000, portalTax: 18000, difference: 0, status: 'matched', remarks: 'Exact match in 2B (Eligible for 100% ITC)' },
  { id: '2', gstin: '27BBBBB1111B2Z6', vendorName: 'Infosys BPM Technologies', invoiceNo: 'INF-209', invoiceDate: '2024-05-18', taxableValue: 250000, booksTax: 45000, portalTax: 45000, difference: 0, status: 'matched', remarks: 'Exact match in 2B (Eligible for 100% ITC)' },
  { id: '3', gstin: '09CCCCC2222C3Z7', vendorName: 'Sharma Logistics & Transport', invoiceNo: 'SL-402', invoiceDate: '2024-05-22', taxableValue: 133333, booksTax: 24000, portalTax: 20000, difference: 4000, status: 'mismatch', remarks: 'Tax discrepancy: Books claim ₹4,000 higher than portal' },
  { id: '4', gstin: '06DDDDD3333D4Z8', vendorName: 'Apex Cloud Solutions Pvt Ltd', invoiceNo: 'ACS-1092', invoiceDate: '2024-05-25', taxableValue: 200000, booksTax: 36000, portalTax: 0, difference: 36000, status: 'missing_in_2a', remarks: 'Defaulting Vendor: Supplier has not filed GSTR-1' },
  { id: '5', gstin: '03EEEEE4444E5Z9', vendorName: 'Northern Paper Mills', invoiceNo: 'NPM-712', invoiceDate: '2024-05-28', taxableValue: 83333, booksTax: 15000, portalTax: 15000, difference: 0, status: 'matched', remarks: 'Exact match in 2B (Eligible for 100% ITC)' },
  { id: '6', gstin: '08FFFFF5555F6Z1', vendorName: 'Global Packaging Hub', invoiceNo: 'GPH-304', invoiceDate: '2024-05-30', taxableValue: 69444, booksTax: 0, portalTax: 12500, difference: -12500, status: 'missing_in_books', remarks: 'Unavailed ITC: Present in 2A but missed in accounting books' }
];

export default function Gstr2aReconciliationPage() {
  const { user, hasToolAccess, refreshUser } = useAuth();
  const { getToolPrice } = useConfig();
  const toolId = 'gstr2a-reconciliation';
  const toolName = 'GSTR-2A vs Books Reconciliation Engine (Basic)';
  const price = 0;

  const isUnlocked = true;
  const [paywallOpen, setPaywallOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [records, setRecords] = useState<ReconRow[]>(DEMO_RECON_DATA);
  const [activeFilter, setActiveFilter] = useState<'all' | MatchStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [fileName, setFileName] = useState('GSTR2B_Purchase_Register_May2024.xlsx');

  // Real Excel / CSV File Upload & Parsing
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();

    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const firstSheet = wb.Sheets[wb.SheetNames[0]];
        const rawData = XLSX.utils.sheet_to_json<any>(firstSheet, { header: 1 });

        if (!rawData || rawData.length < 2) {
          alert('Spreadsheet is empty or lacks data rows.');
          return;
        }

        // Parse rows
        const parsed: ReconRow[] = [];
        for (let i = 1; i < rawData.length; i++) {
          const r = rawData[i];
          if (!r || (!r[0] && !r[1])) continue;

          const gstin = String(r[0] || '').trim().toUpperCase();
          const vendor = String(r[1] || 'Supplier').trim();
          const invNo = String(r[2] || `INV-${i}`).trim();
          const date = String(r[3] || '2024-05-01').trim();
          const books = Number(r[4]) || 0;
          const portal = Number(r[5]) || 0;
          const diff = books - portal;

          let status: MatchStatus = 'matched';
          let remarks = 'Exact match in 2B';

          if (portal === 0 && books > 0) {
            status = 'missing_in_2a';
            remarks = 'Missing in 2A/2B: Supplier not filed';
          } else if (books === 0 && portal > 0) {
            status = 'missing_in_books';
            remarks = 'Unavailed ITC: Present in 2B, not in books';
          } else if (Math.abs(diff) > 2) {
            status = 'mismatch';
            remarks = `Tax value mismatch: Diff ₹${Math.abs(diff).toLocaleString('en-IN')}`;
          }

          parsed.push({
            id: `row-${i}-${Date.now()}`,
            gstin: gstin || '27XXXXX0000X1Z1',
            vendorName: vendor,
            invoiceNo: invNo,
            invoiceDate: date,
            taxableValue: Math.round((books || portal) * 5.55),
            booksTax: books,
            portalTax: portal,
            difference: diff,
            status,
            remarks
          });
        }

        if (parsed.length > 0) {
          setRecords(parsed);
        } else {
          alert('Could not auto-map columns. Expected: GSTIN, Vendor Name, Invoice No, Date, Books Tax, Portal Tax.');
        }
      } catch (err: any) {
        alert('Failed to parse file: ' + err.message);
      }
    };

    reader.readAsBinaryString(file);
  };

  // Filtered dataset
  const filteredData = records.filter(r => {
    const matchesFilter = activeFilter === 'all' || r.status === activeFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery || 
      r.vendorName.toLowerCase().includes(q) || 
      r.gstin.toLowerCase().includes(q) || 
      r.invoiceNo.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  // KPI Calculations
  const totalBooksTax = records.reduce((acc, r) => acc + (r.booksTax || 0), 0);
  const totalPortalTax = records.reduce((acc, r) => acc + (r.portalTax || 0), 0);
  const matchedList = records.filter(r => r.status === 'matched');
  const matchedTax = matchedList.reduce((acc, r) => acc + r.portalTax, 0);
  const missing2AList = records.filter(r => r.status === 'missing_in_2a');
  const missing2ATax = missing2AList.reduce((acc, r) => acc + r.booksTax, 0);
  const mismatchList = records.filter(r => r.status === 'mismatch');
  const mismatchTaxDiff = mismatchList.reduce((acc, r) => acc + Math.max(0, r.difference), 0);
  const totalIneligibleRisk = missing2ATax + mismatchTaxDiff;

  // Real Multi-Sheet Excel Export using xlsx
  const handleExportExcel = () => {
    if (!isUnlocked) {
      setPaywallOpen(true);
      return;
    }

    const wb = XLSX.utils.book_new();

    // Sheet 1: Executive Summary
    const summaryData = [
      ['GSTR-2A / 2B VS BOOKS RECONCILIATION SUMMARY', ''],
      [`Generated: ${new Date().toLocaleString('en-IN')}`, ''],
      ['', ''],
      ['Audit Metric', 'Amount (INR) / Count'],
      ['Total ITC Recorded in Accounting Books', totalBooksTax],
      ['Total ITC Available on GST Portal (2A/2B)', totalPortalTax],
      ['100% Matched ITC (Eligible for GSTR-3B Claim)', matchedTax],
      ['High Risk ITC: Missing on Portal (Supplier Default)', missing2ATax],
      ['Value Discrepancies (Overclaimed in Books)', mismatchTaxDiff],
      ['TOTAL TAX NOTICE EXPOSURE RISK', totalIneligibleRisk],
      ['', ''],
      ['RULE 36(4) COMPLIANCE VERDICT', totalIneligibleRisk === 0 ? 'CLEAN AUDIT - 0 RISK' : 'ACTION REQUIRED: Issue payment hold notices to defaulting vendors']
    ];
    const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, wsSummary, 'Audit_Executive_Summary');

    // Sheet 2: Reconciled Invoices Matrix
    const matrixData = [
      ['Supplier GSTIN', 'Vendor Legal Name', 'Invoice Number', 'Invoice Date', 'Books ITC (INR)', 'Portal 2A/2B ITC (INR)', 'Difference', 'Audit Status', 'Actionable Recommendation'],
      ...records.map(r => [
        r.gstin,
        r.vendorName,
        r.invoiceNo,
        r.invoiceDate,
        r.booksTax,
        r.portalTax,
        r.difference,
        r.status.toUpperCase(),
        r.remarks
      ])
    ];
    const wsMatrix = XLSX.utils.aoa_to_sheet(matrixData);
    XLSX.utils.book_append_sheet(wb, wsMatrix, 'Reconciliation_Matrix');

    // Sheet 3: Defaulting Vendors Action List
    const defaultData = [
      ['DEFAULTING VENDORS (SUPPLIERS WITH MISSING GSTR-1 FILING)', '', '', ''],
      ['Notice: ITC cannot be claimed under Section 16(2)(aa) until vendor uploads invoice', '', '', ''],
      ['', '', '', ''],
      ['Supplier GSTIN', 'Vendor Legal Name', 'Invoice Number', 'Blocked ITC Amount (INR)'],
      ...missing2AList.map(r => [
        r.gstin,
        r.vendorName,
        r.invoiceNo,
        r.booksTax
      ]),
      ['TOTAL BLOCKED ITC', '', '', missing2ATax]
    ];
    const wsDefault = XLSX.utils.aoa_to_sheet(defaultData);
    XLSX.utils.book_append_sheet(wb, wsDefault, 'Vendor_Notice_List');

    XLSX.writeFile(wb, `GSTR2A_Reconciliation_Audit_${Date.now()}.xlsx`);
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
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Basic Tool • 100% Free
            </span>
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
        
        {/* Header Banner Card */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-5 text-white shadow-md border border-indigo-900/40 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase tracking-wider mb-1 border border-indigo-500/30">
              <GitCompare className="w-3 h-3" /> Section 16(2)(aa) & Rule 36(4) ITC Reconciliation
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">{toolName}</h1>
            <p className="text-xs text-slate-300 mt-0.5">
              Automated 4-way matching of Purchase Register with GST Portal 2A/2B to eliminate ITC notice risks.
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
              <span>Upload Sheets (.xlsx/.csv)</span>
            </button>
            <button
              onClick={() => {
                setRecords(DEMO_RECON_DATA);
                setFileName('Demo_Recon_Dataset.xlsx');
              }}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold border border-white/10 transition-colors cursor-pointer"
            >
              Reset Demo
            </button>
          </div>
        </div>

        {/* 4 KPI Dashboard Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Books ITC</span>
            <div className="text-2xl font-black text-slate-900 mt-1">₹{totalBooksTax.toLocaleString('en-IN')}</div>
            <span className="text-[10px] text-slate-400">Claimed in accounting</span>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Portal 2A/2B ITC</span>
            <div className="text-2xl font-black text-indigo-700 mt-1">₹{totalPortalTax.toLocaleString('en-IN')}</div>
            <span className="text-[10px] text-slate-400">Reflected by GSTN</span>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
            <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">100% Matched ITC</span>
            <div className="text-2xl font-black text-emerald-700 mt-1">₹{matchedTax.toLocaleString('en-IN')}</div>
            <span className="text-[10px] text-emerald-600 font-semibold">{matchedList.length} Invoices safe to claim</span>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
            <span className="text-[11px] font-bold text-red-600 uppercase tracking-wider">Notice Risk Exposure</span>
            <div className="text-2xl font-black text-red-700 mt-1">₹{totalIneligibleRisk.toLocaleString('en-IN')}</div>
            <span className="text-[10px] text-red-600 font-semibold">{missing2AList.length + mismatchList.length} Defaulting invoices</span>
          </div>
        </div>

        {/* Filter Tabs & Search Controls */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Status Filter Pills */}
          <div className="flex flex-wrap gap-1.5 w-full md:w-auto text-xs font-bold">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                activeFilter === 'all' 
                  ? 'bg-slate-900 text-white shadow-xs' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Invoices ({records.length})
            </button>
            <button
              onClick={() => setActiveFilter('matched')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                activeFilter === 'matched' 
                  ? 'bg-emerald-600 text-white shadow-xs' 
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              Matched ({matchedList.length})
            </button>
            <button
              onClick={() => setActiveFilter('mismatch')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                activeFilter === 'mismatch' 
                  ? 'bg-amber-600 text-white shadow-xs' 
                  : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
              }`}
            >
              Mismatch ({mismatchList.length})
            </button>
            <button
              onClick={() => setActiveFilter('missing_in_2a')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                activeFilter === 'missing_in_2a' 
                  ? 'bg-red-600 text-white shadow-xs' 
                  : 'bg-red-50 text-red-700 hover:bg-red-100'
              }`}
            >
              Missing in 2A ({missing2AList.length})
            </button>
          </div>

          {/* Search Box & Export */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-60">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search vendor, GSTIN, invoice..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <button
              onClick={handleExportExcel}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 shrink-0 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Excel (.xlsx)</span>
            </button>
          </div>
        </div>

        {/* Reconciliation Invoices Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-100 text-slate-700 font-bold text-[11px] border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Vendor Name / GSTIN</th>
                  <th className="p-3.5">Invoice Details</th>
                  <th className="p-3.5 text-right">Tax in Books</th>
                  <th className="p-3.5 text-right">Tax in 2A/2B</th>
                  <th className="p-3.5 text-right">Difference</th>
                  <th className="p-3.5 text-center">Status</th>
                  <th className="p-3.5">Audit Remarks & Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-400">
                      No invoices found matching criteria.
                    </td>
                  </tr>
                ) : (
                  filteredData.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-3.5">
                        <div className="font-bold text-slate-900">{row.vendorName}</div>
                        <div className="font-mono text-[10px] text-slate-400">{row.gstin}</div>
                      </td>
                      <td className="p-3.5">
                        <div className="font-mono font-semibold text-slate-800">{row.invoiceNo}</div>
                        <div className="text-[10px] text-slate-400">{row.invoiceDate}</div>
                      </td>
                      <td className="p-3.5 text-right font-mono font-semibold text-slate-900">
                        ₹{row.booksTax.toLocaleString('en-IN')}
                      </td>
                      <td className="p-3.5 text-right font-mono font-semibold text-indigo-900">
                        {row.portalTax > 0 ? `₹${row.portalTax.toLocaleString('en-IN')}` : '—'}
                      </td>
                      <td className="p-3.5 text-right font-mono">
                        {row.difference === 0 ? (
                          <span className="text-slate-400 font-bold">₹0</span>
                        ) : row.difference > 0 ? (
                          <span className="text-red-600 font-bold">+₹{row.difference.toLocaleString('en-IN')}</span>
                        ) : (
                          <span className="text-emerald-600 font-bold">-₹{Math.abs(row.difference).toLocaleString('en-IN')}</span>
                        )}
                      </td>
                      <td className="p-3.5 text-center">
                        {row.status === 'matched' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Matched
                          </span>
                        )}
                        {row.status === 'mismatch' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                            <AlertTriangle className="w-3 h-3 text-amber-600" /> Mismatch
                          </span>
                        )}
                        {row.status === 'missing_in_2a' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800 border border-red-200">
                            <XCircle className="w-3 h-3 text-red-600" /> Missing in 2A
                          </span>
                        )}
                        {row.status === 'missing_in_books' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                            <Sparkles className="w-3 h-3 text-blue-600" /> Unavailed 2A
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 text-[11px] text-slate-600">
                        {row.remarks}
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

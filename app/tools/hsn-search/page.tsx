'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import {
  Search,
  Hash,
  Copy,
  Check,
  Filter,
  ArrowRight,
  Download,
  Info,
  Layers,
  Sparkles,
  ShoppingBag,
  Briefcase,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Calculator,
  Percent,
  RotateCcw,
  FileText,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Building2,
  TrendingUp
} from 'lucide-react';

interface HsnMasterItem {
  c: string; // code
  d: string; // description
  t: 'Goods' | 'Services';
  ch: string; // chapter / heading
  r: number; // estimated GST rate %
}

interface SearchApiResponse {
  success: boolean;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  stats: {
    totalGoods: number;
    totalServices: number;
    total: number;
  };
  items: HsnMasterItem[];
}

export default function HsnSearchPage() {
  // Active Tab: 'directory' | 'calculator'
  const [activeTab, setActiveTab] = useState<'directory' | 'calculator'>('directory');

  // Directory Search State
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'All' | 'Goods' | 'Services'>('All');
  const [rateFilter, setRateFilter] = useState<string>('All');
  const [page, setPage] = useState(1);
  const limit = 50;

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<HsnMasterItem[]>([]);
  const [totalCount, setTotalCount] = useState(22616);
  const [totalPages, setTotalPages] = useState(453);
  const [stats, setStats] = useState({ totalGoods: 21935, totalServices: 681, total: 22616 });
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchTerm);
      setPage(1); // Reset to page 1 on new search
    }, 250);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch from official Master Search API
  const fetchHsnData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (debouncedQuery.trim()) params.set('q', debouncedQuery.trim());
      if (typeFilter !== 'All') params.set('type', typeFilter);
      if (rateFilter !== 'All') params.set('rate', rateFilter);
      params.set('page', String(page));
      params.set('limit', String(limit));

      const res = await fetch(`/api/tools/hsn-search?${params.toString()}`);
      if (res.ok) {
        const data: SearchApiResponse = await res.json();
        setResults(data.items || []);
        setTotalCount(data.total || 0);
        setTotalPages(data.totalPages || 1);
        if (data.stats) setStats(data.stats);
      }
    } catch (err) {
      console.error('Failed to fetch HSN records:', err);
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery, typeFilter, rateFilter, page]);

  useEffect(() => {
    fetchHsnData();
  }, [fetchHsnData]);

  // 1-Click Copy
  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 1800);
  };

  // -------------------------------------------------------------
  // GST CALCULATOR STATE
  // -------------------------------------------------------------
  const [calcAmount, setCalcAmount] = useState<number | string>(10000);
  const [calcRate, setCalcRate] = useState<number>(18);
  const [customRate, setCustomRate] = useState<string>('');
  const [isInclusive, setIsInclusive] = useState<boolean>(false);
  const [supplyType, setSupplyType] = useState<'intra' | 'inter'>('intra');
  const [selectedHsn, setSelectedHsn] = useState<HsnMasterItem | null>(null);

  // Trigger calculator with specific HSN item
  const openCalculatorWithHsn = (item: HsnMasterItem) => {
    setSelectedHsn(item);
    setCalcRate(item.r || 18);
    setCustomRate('');
    setActiveTab('calculator');
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  // GST Computations
  const activeRate = customRate !== '' ? Number(customRate) || 0 : calcRate;
  const numAmount = Math.max(0, Number(calcAmount) || 0);

  let taxableAmount = 0;
  let totalGst = 0;
  let grossAmount = 0;

  if (isInclusive) {
    taxableAmount = numAmount / (1 + (activeRate / 100));
    totalGst = numAmount - taxableAmount;
    grossAmount = numAmount;
  } else {
    taxableAmount = numAmount;
    totalGst = taxableAmount * (activeRate / 100);
    grossAmount = taxableAmount + totalGst;
  }

  const cgstAmount = supplyType === 'intra' ? totalGst / 2 : 0;
  const sgstAmount = supplyType === 'intra' ? totalGst / 2 : 0;
  const igstAmount = supplyType === 'inter' ? totalGst : 0;

  // PDF Export for GST Computation
  const downloadGstPdf = () => {
    try {
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 14;
      const contentWidth = pageWidth - (margin * 2);

      // Header
      doc.setFillColor(11, 37, 69);
      doc.rect(0, 0, pageWidth, 24, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('TRACCONSULTANT', margin, 12);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(201, 147, 59);
      doc.text('Statutory GST Tax Computation & Tax Invoice Estimate', margin, 18);

      const nowStr = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
      doc.setFontSize(7.5);
      doc.setTextColor(220, 230, 242);
      doc.text(`Date: ${nowStr}`, pageWidth - margin, 11, { align: 'right' });

      // Badge
      doc.setFillColor(5, 150, 105);
      doc.roundedRect(pageWidth - margin - 45, 14, 45, 6, 1, 1, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.text(`GST SLAB: ${activeRate}%`, pageWidth - margin - 22.5, 18.2, { align: 'center' });

      let currentY = 32;

      // HSN Reference Box if chosen
      if (selectedHsn) {
        doc.setFillColor(241, 245, 249);
        doc.roundedRect(margin, currentY, contentWidth, 14, 1.5, 1.5, 'F');
        doc.setDrawColor(203, 213, 225);
        doc.roundedRect(margin, currentY, contentWidth, 14, 1.5, 1.5, 'S');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(11, 37, 69);
        doc.text(`REFERENCED HSN/SAC: ${selectedHsn.c} (${selectedHsn.t})`, margin + 3, currentY + 5);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.setTextColor(71, 85, 105);
        const descText = selectedHsn.d.length > 90 ? selectedHsn.d.substring(0, 90) + '...' : selectedHsn.d;
        doc.text(descText, margin + 3, currentY + 10);
        currentY += 18;
      }

      // Section 1: Parameters
      doc.setFillColor(241, 245, 249);
      doc.rect(margin, currentY, contentWidth, 7, 'F');
      doc.setTextColor(11, 37, 69);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text('1. SUPPLY & TAX PARAMETERS', margin + 3, currentY + 4.8);
      currentY += 9;

      const paramRows = [
        ['Supply Type', supplyType === 'intra' ? 'Intra-State (Same State Supply - CGST + SGST)' : 'Inter-State (Out of State Supply - IGST)'],
        ['Calculation Mode', isInclusive ? 'GST Inclusive (Reverse Calculation from Gross Amount)' : 'GST Exclusive (Tax Added on Base Taxable Value)'],
        ['Entered Amount', `Rs. ${numAmount.toLocaleString('en-IN')}`],
        ['Applicable GST Rate', `${activeRate}%`]
      ];

      paramRows.forEach((r, idx) => {
        doc.setFillColor(idx % 2 === 0 ? 255 : 248, idx % 2 === 0 ? 255 : 250, idx % 2 === 0 ? 255 : 252);
        doc.rect(margin, currentY, contentWidth, 6, 'F');
        doc.setDrawColor(226, 232, 240);
        doc.rect(margin, currentY, contentWidth, 6, 'S');

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(71, 85, 105);
        doc.text(r[0], margin + 3, currentY + 4.2);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(15, 23, 42);
        doc.text(r[1], pageWidth - margin - 3, currentY + 4.2, { align: 'right' });
        currentY += 6;
      });

      currentY += 6;

      // Section 2: Computation Breakdown
      doc.setFillColor(241, 245, 249);
      doc.rect(margin, currentY, contentWidth, 7, 'F');
      doc.setTextColor(11, 37, 69);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text('2. TAX INVOICE BREAKDOWN', margin + 3, currentY + 4.8);
      currentY += 9;

      const taxRows = [
        ['Net Taxable Value (Base Price)', `Rs. ${taxableAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`, false],
        ...(supplyType === 'intra'
          ? [
              [`Central GST (CGST @ ${(activeRate / 2).toFixed(1)}%)`, `Rs. ${cgstAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`, false],
              [`State GST (SGST @ ${(activeRate / 2).toFixed(1)}%)`, `Rs. ${sgstAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`, false]
            ]
          : [
              [`Integrated GST (IGST @ ${activeRate}%)`, `Rs. ${igstAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`, false]
            ]),
        ['Total GST Tax Amount', `Rs. ${totalGst.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`, false],
        ['TOTAL INVOICE VALUE (GROSS PAYABLE)', `Rs. ${grossAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`, true]
      ];

      taxRows.forEach((r) => {
        const isHighlight = r[2] as boolean;
        doc.setFillColor(isHighlight ? 236 : 255, isHighlight ? 253 : 255, isHighlight ? 245 : 255);
        doc.rect(margin, currentY, contentWidth, 7.5, 'F');
        doc.setDrawColor(isHighlight ? 16 : 226, isHighlight ? 185 : 232, isHighlight ? 129 : 240);
        doc.rect(margin, currentY, contentWidth, 7.5, 'S');

        doc.setFont('helvetica', isHighlight ? 'bold' : 'normal');
        doc.setFontSize(isHighlight ? 9 : 8);
        doc.setTextColor(isHighlight ? 5 : 51, isHighlight ? 150 : 65, isHighlight ? 105 : 85);
        doc.text(r[0] as string, margin + 3, currentY + 5);
        doc.setFont('helvetica', 'bold');
        doc.text(r[1] as string, pageWidth - margin - 3, currentY + 5, { align: 'right' });
        currentY += 7.5;
      });

      currentY += 8;

      // Note Box
      doc.setFillColor(254, 243, 199);
      doc.roundedRect(margin, currentY, contentWidth, 14, 1.5, 1.5, 'F');
      doc.setDrawColor(245, 158, 11);
      doc.roundedRect(margin, currentY, contentWidth, 14, 1.5, 1.5, 'S');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(146, 64, 14);
      doc.text('STATUTORY GST COMPLIANCE ADVISORY:', margin + 3, currentY + 4.5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.8);
      doc.setTextColor(180, 83, 9);
      doc.text('Mandatory e-Invoice for turnover > Rs. 5 Crore. Ensure HSN / SAC codes are accurately disclosed on tax invoices.', margin + 3, currentY + 8.5);
      doc.text('Avail verified Input Tax Credit (ITC) under Section 16 based strictly on GSTR-2B matching.', margin + 3, currentY + 12);

      currentY += 20;

      // Footer
      doc.setDrawColor(226, 232, 240);
      doc.line(margin, currentY, pageWidth - margin, currentY);
      currentY += 4;
      doc.setFontSize(7);
      doc.setTextColor(148, 163, 184);
      doc.text('TracConsultant Tax Advisory Suite • https://tracconsultant.com', margin, currentY);
      doc.text(`Generated: ${new Date().toLocaleString('en-IN')}`, pageWidth - margin, currentY, { align: 'right' });

      doc.save(`GST_Tax_Computation_${activeRate}percent_${Math.round(grossAmount)}.pdf`);
    } catch (err) {
      console.error('Failed to generate GST PDF:', err);
    }
  };

  // Excel Export for GST Computation
  const downloadGstExcel = () => {
    try {
      const wb = XLSX.utils.book_new();

      const wsData = [
        ['TRAC CONSULTANT - OFFICIAL GST TAX COMPUTATION SHEET'],
        ['Generated via TracConsultant Financial Suite (https://tracconsultant.com)'],
        [`Date of Computation: ${new Date().toLocaleString('en-IN')}`],
        [],
        ...(selectedHsn
          ? [
              ['REFERENCED HSN/SAC CODE', selectedHsn.c],
              ['ITEM DESCRIPTION', selectedHsn.d],
              ['CATEGORY', selectedHsn.t],
              ['CHAPTER / HEADING', selectedHsn.ch],
              []
            ]
          : []),
        ['SUPPLY PARAMETERS', 'VALUE'],
        ['Supply Type', supplyType === 'intra' ? 'Intra-State (Same State Supply)' : 'Inter-State (Out of State Supply)'],
        ['Calculation Mode', isInclusive ? 'GST Inclusive' : 'GST Exclusive'],
        ['Entered Amount (INR)', numAmount],
        ['Applicable GST Rate', `${activeRate}%`],
        [],
        ['TAX INVOICE COMPUTATION BREAKDOWN', 'AMOUNT (INR)'],
        ['Net Taxable Value (Base Price)', Number(taxableAmount.toFixed(2))],
        ...(supplyType === 'intra'
          ? [
              [`Central GST (CGST @ ${(activeRate / 2).toFixed(1)}%)`, Number(cgstAmount.toFixed(2))],
              [`State GST (SGST @ ${(activeRate / 2).toFixed(1)}%)`, Number(sgstAmount.toFixed(2))]
            ]
          : [
              [`Integrated GST (IGST @ ${activeRate}%)`, Number(igstAmount.toFixed(2))]
            ]),
        ['Total GST Tax Amount', Number(totalGst.toFixed(2))],
        ['TOTAL INVOICE VALUE (GROSS PAYABLE)', Number(grossAmount.toFixed(2))],
        [],
        ['LEGAL & COMPLIANCE NOTES:'],
        ['- Generated in accordance with CGST / SGST / IGST Acts 2017.'],
        ['- Input Tax Credit eligibility depends on vendor filing in GSTR-1 and GSTR-3B.'],
        ['- Official HSN & SAC Master dataset sourced from CBIC & GSTN Portal (services.gst.gov.in).']
      ];

      const ws = XLSX.utils.aoa_to_sheet(wsData);
      ws['!cols'] = [{ wch: 45 }, { wch: 30 }];
      XLSX.utils.book_append_sheet(wb, ws, 'GST_Computation');

      XLSX.writeFile(wb, `GST_Computation_${activeRate}percent_${Math.round(grossAmount)}.xlsx`);
    } catch (err) {
      console.error('Failed to generate GST Excel:', err);
    }
  };

  const popularSearches = [
    'Attar',
    'Thobe',
    'Clothing',
    'Accounting 9982',
    'Software 9983',
    'Dates',
    'Mobile 8517',
    'Honey',
    'Transport 9965'
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Hero Banner */}
      <div className="bg-[#0B2545] text-white py-10 sm:py-14 px-4 sm:px-6 lg:px-8 border-b border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#C9933B_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex items-center space-x-2 text-xs text-slate-400 mb-3">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/tools" className="hover:text-white transition-colors">Tools</Link>
            <span>/</span>
            <span className="text-[#C9933B] font-medium">HSN &amp; SAC Master Directory &amp; GST Calculator</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="inline-flex items-center space-x-2 bg-emerald-500/20 text-emerald-300 text-xs px-3.5 py-1.5 rounded-full font-bold border border-emerald-500/30 mb-3">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>OFFICIAL CBIC &amp; GSTN MASTER DATABASE • 22,616 VERIFIED CODES</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
                HSN &amp; SAC Code Search &amp; GST Calculator
              </h1>
              <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                Complete official Goods &amp; Services Tax classification master directory. Search across all 22,616 government HSN &amp; SAC codes, browse the full master list, and compute CGST, SGST &amp; IGST instantly.
              </p>
            </div>

            {/* Live Stats Quick Pill & External Link */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
              <a
                href="https://services.gst.gov.in/services/searchhsnsac"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/15 text-slate-200 border border-slate-700 transition-all"
              >
                <span>Verify on GST Portal (services.gst.gov.in)</span>
                <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
              </a>

              <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-300">
                <div className="flex-1 text-center px-2">
                  <div className="font-bold text-white text-sm">21,935</div>
                  <div className="text-[10px] text-slate-400">Goods (HSN)</div>
                </div>
                <div className="w-px h-6 bg-slate-700" />
                <div className="flex-1 text-center px-2">
                  <div className="font-bold text-white text-sm">681</div>
                  <div className="text-[10px] text-slate-400">Services (SAC)</div>
                </div>
                <div className="w-px h-6 bg-slate-700" />
                <div className="flex-1 text-center px-2">
                  <div className="font-bold text-emerald-400 text-sm">22,616</div>
                  <div className="text-[10px] text-emerald-300">Total Codes</div>
                </div>
              </div>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="mt-8 flex border-b border-slate-700/80 gap-2 sm:gap-4">
            <button
              onClick={() => setActiveTab('directory')}
              className={`pb-3 px-3 sm:px-5 font-bold text-sm flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                activeTab === 'directory'
                  ? 'border-[#C9933B] text-white'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Hash className="w-4 h-4 text-[#C9933B]" />
              <span>HSN / SAC Master Directory (22,616)</span>
            </button>
            <button
              onClick={() => setActiveTab('calculator')}
              className={`pb-3 px-3 sm:px-5 font-bold text-sm flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                activeTab === 'calculator'
                  ? 'border-emerald-400 text-white'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Calculator className="w-4 h-4 text-emerald-400" />
              <span>Interactive GST Tax Calculator</span>
              {selectedHsn && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 font-normal">
                  Code: {selectedHsn.c}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        
        {/* ========================================================= */}
        {/* TAB 1: DIRECTORY & SEARCH                                 */}
        {/* ========================================================= */}
        {activeTab === 'directory' && (
          <div className="space-y-6">
            {/* Search Bar & Filters Card */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200 space-y-4">
              {/* Live Search Input */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search 22,616 codes by HSN/SAC number (e.g. 0101, 6105, 9982) or item description (e.g. shirt, attar, software, tea)..."
                  className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-300 rounded-xl text-sm sm:text-base text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0B2545] focus:bg-white focus:ring-2 focus:ring-[#0B2545]/10 transition-all font-medium"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-700 bg-slate-200 hover:bg-slate-300 px-2.5 py-1 rounded-md transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Popular Searches Pills */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <span className="text-slate-500 font-semibold mr-1">Popular:</span>
                {popularSearches.map((item) => (
                  <button
                    key={item}
                    onClick={() => setSearchTerm(item.split(' ')[0])}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
                  >
                    {item}
                  </button>
                ))}
              </div>

              {/* Filter Tabs */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                {/* Type Filter */}
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-500 mr-1 flex items-center gap-1">
                    <Filter className="w-3.5 h-3.5" /> Type:
                  </span>
                  {(['All', 'Goods', 'Services'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => {
                        setTypeFilter(t);
                        setPage(1);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        typeFilter === t
                          ? 'bg-[#0B2545] text-white shadow-sm'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {t === 'All' ? `All (${stats.total.toLocaleString('en-IN')})` : t === 'Goods' ? `Goods (${stats.totalGoods.toLocaleString('en-IN')})` : `Services (${stats.totalServices.toLocaleString('en-IN')})`}
                    </button>
                  ))}
                </div>

                {/* Rate Filter */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs font-bold text-slate-500 mr-1">Rate:</span>
                  {['All', '0', '5', '12', '18', '28'].map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        setRateFilter(r);
                        setPage(1);
                      }}
                      className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                        rateFilter === r
                          ? 'bg-emerald-600 text-white font-bold'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {r === 'All' ? 'All Rates' : `${r}%`}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results Header with Counts & Complete List Notice */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-1">
              <div>
                <p className="text-sm font-bold text-slate-900">
                  Showing {totalCount > 0 ? ((page - 1) * limit + 1).toLocaleString('en-IN') : 0} – {Math.min(page * limit, totalCount).toLocaleString('en-IN')} of {totalCount.toLocaleString('en-IN')} Official Records
                </p>
                <p className="text-xs text-slate-500">
                  {debouncedQuery
                    ? `Search results for "${debouncedQuery}" from official GSTN/CBIC master directory`
                    : 'Complete master list from GST portal (services.gst.gov.in) with 50 items per page'}
                </p>
              </div>

              {/* Quick Top Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <span className="text-xs text-slate-500">
                    Page <strong className="text-slate-900">{page}</strong> of {totalPages}
                  </span>
                  <button
                    disabled={page <= 1 || loading}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 transition-colors"
                    title="Previous Page"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    disabled={page >= totalPages || loading}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 transition-colors"
                    title="Next Page"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Loading Indicator */}
            {loading ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
                <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-sm font-bold text-slate-800">Searching 22,616 Master Records...</p>
                <p className="text-xs text-slate-500">Fast indexed retrieval from official GST portal dataset</p>
              </div>
            ) : results.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
                <AlertCircle className="w-10 h-10 text-amber-500 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-900">No matching HSN / SAC codes found</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  We could not find any record matching &quot;{debouncedQuery}&quot;. Try searching with fewer words, common synonyms, or 2/4-digit chapter numbers.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setTypeFilter('All');
                    setRateFilter('All');
                  }}
                  className="mt-4 px-4 py-2 bg-[#0B2545] text-white text-xs font-bold rounded-xl"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              /* Records Table / List */
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-900 text-white text-xs uppercase tracking-wider font-bold">
                        <th className="py-3 px-4 sm:px-6 w-36">HSN / SAC Code</th>
                        <th className="py-3 px-4">Classification &amp; Chapter</th>
                        <th className="py-3 px-4 sm:px-6">Description of Goods / Services</th>
                        <th className="py-3 px-4 text-center w-28">GST Rate</th>
                        <th className="py-3 px-4 text-right sm:px-6 w-40">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                      {results.map((item) => (
                        <tr
                          key={`${item.t}-${item.c}`}
                          className="hover:bg-slate-50/80 transition-colors group"
                        >
                          {/* Code */}
                          <td className="py-3.5 px-4 sm:px-6 align-top">
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono font-black text-slate-900 text-sm tracking-wide bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                                {item.c}
                              </span>
                              <button
                                onClick={() => handleCopy(item.c)}
                                className="p-1 text-slate-400 hover:text-emerald-600 transition-colors"
                                title="Copy HSN Code"
                              >
                                {copiedCode === item.c ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                            {copiedCode === item.c && (
                              <span className="text-[10px] font-bold text-emerald-600">Copied!</span>
                            )}
                          </td>

                          {/* Classification */}
                          <td className="py-3.5 px-4 align-top">
                            <div className="space-y-1">
                              <span
                                className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                                  item.t === 'Goods'
                                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                    : 'bg-purple-50 text-purple-700 border border-purple-200'
                                }`}
                              >
                                {item.t === 'Goods' ? (
                                  <ShoppingBag className="w-3 h-3" />
                                ) : (
                                  <Briefcase className="w-3 h-3" />
                                )}
                                <span>{item.t}</span>
                              </span>
                              <div className="text-[11px] text-slate-500 font-mono">
                                {item.ch}
                              </div>
                            </div>
                          </td>

                          {/* Description */}
                          <td className="py-3.5 px-4 sm:px-6 align-top">
                            <p className="text-slate-800 leading-snug font-medium">
                              {item.d}
                            </p>
                          </td>

                          {/* Rate */}
                          <td className="py-3.5 px-4 align-top text-center">
                            <span
                              className={`inline-block font-black text-xs px-2.5 py-1 rounded-lg ${
                                item.r === 0
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : item.r === 5
                                  ? 'bg-blue-100 text-blue-800'
                                  : item.r === 12
                                  ? 'bg-amber-100 text-amber-900'
                                  : item.r === 18
                                  ? 'bg-indigo-100 text-indigo-900'
                                  : 'bg-rose-100 text-rose-900'
                              }`}
                            >
                              {item.r}% GST
                            </span>
                            <div className="text-[10px] text-slate-400 mt-0.5">Approx. Slab</div>
                          </td>

                          {/* Action Buttons */}
                          <td className="py-3.5 px-4 sm:px-6 align-top text-right">
                            <button
                              onClick={() => openCalculatorWithHsn(item)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer"
                            >
                              <Calculator className="w-3.5 h-3.5" />
                              <span>Calculate</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Bottom Pagination Controls */}
                <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <span className="text-slate-600">
                    Showing <strong>{((page - 1) * limit + 1).toLocaleString('en-IN')}</strong> to{' '}
                    <strong>{Math.min(page * limit, totalCount).toLocaleString('en-IN')}</strong> of{' '}
                    <strong>{totalCount.toLocaleString('en-IN')}</strong> items
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      disabled={page <= 1 || loading}
                      onClick={() => setPage(1)}
                      className="px-2.5 py-1 rounded-md border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 font-semibold"
                    >
                      First
                    </button>
                    <button
                      disabled={page <= 1 || loading}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      className="px-3 py-1 rounded-md border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 font-semibold flex items-center gap-1"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" /> Prev
                    </button>

                    <span className="px-3 py-1 font-bold bg-[#0B2545] text-white rounded-md">
                      {page} / {totalPages}
                    </span>

                    <button
                      disabled={page >= totalPages || loading}
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      className="px-3 py-1 rounded-md border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 font-semibold flex items-center gap-1"
                    >
                      Next <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      disabled={page >= totalPages || loading}
                      onClick={() => setPage(totalPages)}
                      className="px-2.5 py-1 rounded-md border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 font-semibold"
                    >
                      Last
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: INTERACTIVE GST CALCULATOR                         */}
        {/* ========================================================= */}
        {activeTab === 'calculator' && (
          <div className="space-y-6">
            {/* Active Selected HSN Banner */}
            {selectedHsn && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-mono font-bold text-sm shrink-0 shadow-sm">
                    {selectedHsn.c}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-emerald-900">
                        Selected HSN: {selectedHsn.c} ({selectedHsn.t})
                      </span>
                      <span className="text-[10px] bg-emerald-200 text-emerald-800 font-bold px-2 py-0.5 rounded">
                        {selectedHsn.r}% Standard Slab
                      </span>
                    </div>
                    <p className="text-xs text-emerald-700 line-clamp-1">{selectedHsn.d}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedHsn(null)}
                  className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 underline shrink-0 cursor-pointer"
                >
                  Clear Selection
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Calculator Controls */}
              <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-emerald-600" />
                    <h2 className="text-base font-bold text-slate-900">GST Input Parameters</h2>
                  </div>
                  <button
                    onClick={() => {
                      setCalcAmount(10000);
                      setCalcRate(18);
                      setCustomRate('');
                      setIsInclusive(false);
                      setSupplyType('intra');
                    }}
                    className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Reset
                  </button>
                </div>

                {/* 1. Amount Input */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {isInclusive ? 'Total Gross Amount (Including GST)' : 'Net Taxable Bill Amount (Before GST)'}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-500 text-sm">
                      ₹
                    </span>
                    <input
                      type="number"
                      value={calcAmount}
                      onChange={(e) => setCalcAmount(e.target.value)}
                      placeholder="e.g. 10000"
                      className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-lg font-bold text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white transition-all font-mono"
                    />
                  </div>
                </div>

                {/* 2. Calculation Mode: Exclusive vs Inclusive */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    GST Calculation Mode
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setIsInclusive(false)}
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        !isInclusive
                          ? 'bg-[#0B2545] text-white shadow-md'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      GST Exclusive (+ Tax)
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsInclusive(true)}
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isInclusive
                          ? 'bg-[#0B2545] text-white shadow-md'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      GST Inclusive (Reverse Tax)
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {isInclusive
                      ? 'Reverses tax from total bill amount to extract original base price & GST split.'
                      : 'Adds GST on top of your product base price.'}
                  </p>
                </div>

                {/* 3. GST Slab Selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Applicable GST Rate (%)
                  </label>
                  <div className="grid grid-cols-5 gap-1.5 mb-2">
                    {[0, 5, 12, 18, 28].map((rate) => (
                      <button
                        key={rate}
                        type="button"
                        onClick={() => {
                          setCalcRate(rate);
                          setCustomRate('');
                        }}
                        className={`py-2 px-1 text-center rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          calcRate === rate && customRate === ''
                            ? 'bg-emerald-600 text-white shadow-md scale-102'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                        }`}
                      >
                        {rate}%
                      </button>
                    ))}
                  </div>

                  {/* Custom Rate Input */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-medium shrink-0">Or Custom Rate:</span>
                    <div className="relative flex-1">
                      <input
                        type="number"
                        value={customRate}
                        onChange={(e) => setCustomRate(e.target.value)}
                        placeholder="e.g. 3 (Gold) or 0.25 (Diamonds)"
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-600 font-mono"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-bold">
                        %
                      </span>
                    </div>
                  </div>
                </div>

                {/* 4. Supply Type: Intra vs Inter State */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Supply Location (Tax Type)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setSupplyType('intra')}
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold text-left transition-all cursor-pointer ${
                        supplyType === 'intra'
                          ? 'bg-emerald-500/20 border-2 border-emerald-600 text-emerald-950 font-black'
                          : 'bg-slate-100 border border-transparent text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Intra-State (Same State)</span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-normal mt-0.5">
                        Split into CGST ({activeRate / 2}%) + SGST ({activeRate / 2}%)
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSupplyType('inter')}
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold text-left transition-all cursor-pointer ${
                        supplyType === 'inter'
                          ? 'bg-emerald-500/20 border-2 border-emerald-600 text-emerald-950 font-black'
                          : 'bg-slate-100 border border-transparent text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Inter-State (Out of State)</span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-normal mt-0.5">
                        Single Integrated IGST ({activeRate}%)
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Computation Summary & Download */}
              <div className="lg:col-span-6 bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-xl flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                        Tax Invoice Computation
                      </h3>
                    </div>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Rate: {activeRate}%
                    </span>
                  </div>

                  {/* Summary Rows */}
                  <div className="mt-4 space-y-3">
                    {/* Net Base Price */}
                    <div className="flex justify-between items-center py-1 text-slate-300 text-xs">
                      <span>Net Taxable Base Price:</span>
                      <span className="font-mono text-sm font-bold text-white">
                        ₹{taxableAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                      </span>
                    </div>

                    {/* Tax Breakdown */}
                    {supplyType === 'intra' ? (
                      <>
                        <div className="flex justify-between items-center py-1 text-slate-300 text-xs pl-2 border-l-2 border-emerald-500">
                          <span>Central GST (CGST @ {(activeRate / 2).toFixed(1)}%):</span>
                          <span className="font-mono text-sm font-bold text-emerald-400">
                            ₹{cgstAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-1 text-slate-300 text-xs pl-2 border-l-2 border-emerald-500">
                          <span>State GST (SGST @ {(activeRate / 2).toFixed(1)}%):</span>
                          <span className="font-mono text-sm font-bold text-emerald-400">
                            ₹{sgstAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="flex justify-between items-center py-1 text-slate-300 text-xs pl-2 border-l-2 border-emerald-500">
                        <span>Integrated GST (IGST @ {activeRate}%):</span>
                        <span className="font-mono text-sm font-bold text-emerald-400">
                          ₹{igstAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                        </span>
                      </div>
                    )}

                    {/* Total GST */}
                    <div className="flex justify-between items-center py-1.5 border-t border-slate-800 text-xs">
                      <span className="text-slate-400 font-semibold">Total GST Amount ({activeRate}%):</span>
                      <span className="font-mono text-sm font-black text-emerald-300">
                        + ₹{totalGst.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                      </span>
                    </div>

                    {/* Final Gross Value */}
                    <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/80 to-slate-800 border border-emerald-500/40 flex justify-between items-center">
                      <div>
                        <div className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider">
                          Total Gross Invoice Amount
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {isInclusive ? 'Original inclusive amount' : 'Base price + Total GST'}
                        </div>
                      </div>
                      <div className="font-mono text-xl sm:text-2xl font-black text-white">
                        ₹{grossAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dual Download Buttons: PDF & Excel */}
                <div className="space-y-2 pt-3 border-t border-slate-800">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider text-center">
                    Download Official Tax Computation
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={downloadGstPdf}
                      className="w-full py-2.5 px-3 bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Download PDF</span>
                    </button>
                    <button
                      type="button"
                      onClick={downloadGstExcel}
                      className="w-full py-2.5 px-3 bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5" />
                      <span>Download Excel</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

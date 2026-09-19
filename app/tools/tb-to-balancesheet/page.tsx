'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useConfig } from '@/context/ConfigContext';
import ToolPaywallModal from '@/components/ToolPaywallModal';
import { 
  FileSpreadsheet, 
  ShieldCheck, 
  Lock, 
  Unlock, 
  Download, 
  Upload, 
  Check, 
  Sparkles, 
  FileText, 
  RefreshCw, 
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Trash2,
  FileCheck,
  Building2,
  Calendar,
  Layers
} from 'lucide-react';
import * as XLSX from 'xlsx';

export type AccountingCategory = 
  | 'equity' 
  | 'non_current_liab' 
  | 'current_liab' 
  | 'fixed_asset' 
  | 'current_asset' 
  | 'revenue' 
  | 'expense';

export interface LedgerRow {
  id: string;
  account: string;
  debit: number;
  credit: number;
  category: AccountingCategory;
}

const BALANCED_SAMPLE_TB: LedgerRow[] = [
  { id: '1', account: 'Capital Account (Equity Shares)', debit: 0, credit: 1500000, category: 'equity' },
  { id: '2', account: 'Term Loan (HDFC Bank Ltd)', debit: 0, credit: 800000, category: 'non_current_liab' },
  { id: '3', account: 'Sundry Creditors (Trade Payables)', debit: 0, credit: 450000, category: 'current_liab' },
  { id: '4', account: 'Plant & Machinery (Computers & Servers)', debit: 650000, credit: 0, category: 'fixed_asset' },
  { id: '5', account: 'Office Furniture & Fixtures', debit: 200000, credit: 0, category: 'fixed_asset' },
  { id: '6', account: 'Inventories / Finished Goods Stock', debit: 1165000, credit: 0, category: 'current_asset' },
  { id: '7', account: 'Sundry Debtors (Receivables)', debit: 780000, credit: 0, category: 'current_asset' },
  { id: '8', account: 'Cash & Bank Balances (Current A/c)', debit: 1120000, credit: 0, category: 'current_asset' },
  { id: '9', account: 'Revenue from Software Services', debit: 0, credit: 2800000, category: 'revenue' },
  { id: '10', account: 'Purchases of Raw Materials / Services', debit: 950000, credit: 0, category: 'expense' },
  { id: '11', account: 'Employee Salaries & Wages', debit: 420000, credit: 0, category: 'expense' },
  { id: '12', account: 'Office Rent & Electricity', debit: 180000, credit: 0, category: 'expense' },
  { id: '13', account: 'Depreciation & Amortization', debit: 35000, credit: 0, category: 'expense' },
  { id: '14', account: 'Audit, Legal & Professional Fees', debit: 50000, credit: 0, category: 'expense' }
];

const CATEGORY_LABELS: Record<AccountingCategory, string> = {
  equity: 'Equity & Share Capital',
  non_current_liab: 'Non-Current Liabilities (Loans)',
  current_liab: 'Current Liabilities (Payables)',
  fixed_asset: 'Fixed Assets (Property & Equipment)',
  current_asset: 'Current Assets (Cash, Stock, Debtors)',
  revenue: 'Revenue from Operations',
  expense: 'Operating & Admin Expenses'
};

export default function TbToBalanceSheetPage() {
  const { user, hasToolAccess, refreshUser } = useAuth();
  const { getToolPrice } = useConfig();
  const toolId = 'tb-to-balancesheet';
  const toolName = 'Trial Balance to Balance Sheet & P&L Formatter';
  const price = getToolPrice(toolId, 299);

  const isUnlocked = hasToolAccess(toolId);
  const [paywallOpen, setPaywallOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [ledgers, setLedgers] = useState<LedgerRow[]>(BALANCED_SAMPLE_TB);
  const [companyName, setCompanyName] = useState('Apex Technologies Pvt Ltd');
  const [financialYear, setFinancialYear] = useState('FY 2024-25');
  const [fileName, setFileName] = useState('Trial_Balance_Apex_2024-25.xlsx');

  // Interactive table actions
  const handleUpdateRow = (id: string, field: keyof LedgerRow, value: any) => {
    setLedgers(prev => prev.map(r => {
      if (r.id === id) {
        return { ...r, [field]: value };
      }
      return r;
    }));
  };

  const handleAddRow = () => {
    const newId = (Date.now() + Math.random()).toString();
    const newRow: LedgerRow = {
      id: newId,
      account: 'New Ledger Account',
      debit: 0,
      credit: 0,
      category: 'current_asset'
    };
    setLedgers(prev => [...prev, newRow]);
  };

  const handleDeleteRow = (id: string) => {
    if (ledgers.length <= 2) {
      alert('Trial balance requires at least 2 ledger rows.');
      return;
    }
    setLedgers(prev => prev.filter(r => r.id !== id));
  };

  // Real Excel File Upload & Parser using xlsx
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();

    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const firstSheetName = wb.SheetNames[0];
        const ws = wb.Sheets[firstSheetName];
        const data = XLSX.utils.sheet_to_json<any>(ws, { header: 1 });

        if (!data || data.length < 2) {
          alert('Spreadsheet appears to be empty or missing rows.');
          return;
        }

        // Process rows (skip header if present)
        const parsedRows: LedgerRow[] = [];
        for (let i = 1; i < data.length; i++) {
          const row = data[i];
          if (!row || !row[0]) continue;
          
          const accName = String(row[0] || '').trim();
          const debitVal = Math.max(0, Number(row[1]) || 0);
          const creditVal = Math.max(0, Number(row[2]) || 0);
          
          // Infer category
          const lower = accName.toLowerCase();
          let cat: AccountingCategory = 'expense';
          if (lower.includes('capital') || lower.includes('equity') || lower.includes('shares')) cat = 'equity';
          else if (lower.includes('loan') || lower.includes('borrowing') || lower.includes('debenture')) cat = 'non_current_liab';
          else if (lower.includes('creditor') || lower.includes('payable') || lower.includes('gst') || lower.includes('tds')) cat = 'current_liab';
          else if (lower.includes('machinery') || lower.includes('furniture') || lower.includes('computer') || lower.includes('building') || lower.includes('equipment')) cat = 'fixed_asset';
          else if (lower.includes('cash') || lower.includes('bank') || lower.includes('debtor') || lower.includes('stock') || lower.includes('inventory')) cat = 'current_asset';
          else if (lower.includes('sale') || lower.includes('revenue') || lower.includes('service') || lower.includes('income')) cat = 'revenue';
          else cat = 'expense';

          parsedRows.push({
            id: `row-${i}-${Date.now()}`,
            account: accName,
            debit: debitVal,
            credit: creditVal,
            category: cat
          });
        }

        if (parsedRows.length > 0) {
          setLedgers(parsedRows);
          setCompanyName(file.name.replace(/\.[^/.]+$/, "").replace(/_/g, ' '));
        } else {
          alert('Could not detect ledger columns. Ensure Column A is Ledger Name, Column B is Debit, Column C is Credit.');
        }
      } catch (err: any) {
        alert('Failed to parse Excel file: ' + err.message);
      }
    };

    reader.readAsBinaryString(file);
  };

  // Calculations
  const totalDebit = ledgers.reduce((acc, row) => acc + (Number(row.debit) || 0), 0);
  const totalCredit = ledgers.reduce((acc, row) => acc + (Number(row.credit) || 0), 0);
  const isTbBalanced = Math.abs(totalDebit - totalCredit) < 1;
  const tbDifference = Math.abs(totalDebit - totalCredit);

  // P&L Calculation
  const totalRevenue = ledgers.filter(r => r.category === 'revenue').reduce((a, b) => a + (Number(b.credit) || 0), 0);
  const totalExpenses = ledgers.filter(r => r.category === 'expense').reduce((a, b) => a + (Number(b.debit) || 0), 0);
  const netProfit = totalRevenue - totalExpenses;

  // Balance Sheet Calculation
  const fixedAssets = ledgers.filter(r => r.category === 'fixed_asset').reduce((a, b) => a + (Number(b.debit) || 0), 0);
  const currentAssets = ledgers.filter(r => r.category === 'current_asset').reduce((a, b) => a + (Number(b.debit) || 0), 0);
  const totalAssets = fixedAssets + currentAssets;

  const equityShareCapital = ledgers.filter(r => r.category === 'equity').reduce((a, b) => a + (Number(b.credit) || 0), 0);
  const totalEquity = equityShareCapital + netProfit; // Net profit transferred to reserves & surplus
  const nonCurrentLiabilities = ledgers.filter(r => r.category === 'non_current_liab').reduce((a, b) => a + (Number(b.credit) || 0), 0);
  const currentLiabilities = ledgers.filter(r => r.category === 'current_liab').reduce((a, b) => a + (Number(b.credit) || 0), 0);
  const totalLiabilities = totalEquity + nonCurrentLiabilities + currentLiabilities;
  const isBsBalanced = Math.abs(totalAssets - totalLiabilities) < 1;

  // Real Excel Export using xlsx workbook
  const handleExportExcel = () => {
    if (!isUnlocked) {
      setPaywallOpen(true);
      return;
    }

    const wb = XLSX.utils.book_new();

    // Sheet 1: Trial Balance
    const tbSheetData = [
      ['TRIAL BALANCE STATEMENT', '', '', ''],
      [`Company: ${companyName}`, '', `Period: ${financialYear}`, ''],
      ['', '', '', ''],
      ['Account Ledger Name', 'Schedule III Category', 'Debit Amount (INR)', 'Credit Amount (INR)'],
      ...ledgers.map(l => [
        l.account,
        CATEGORY_LABELS[l.category],
        l.debit || 0,
        l.credit || 0
      ]),
      ['TOTAL TRIAL BALANCE', '', totalDebit, totalCredit],
      ['BALANCE STATUS', '', isTbBalanced ? 'PERFECTLY BALANCED' : `DIFFERENCE: ${tbDifference}`, '']
    ];
    const wsTB = XLSX.utils.aoa_to_sheet(tbSheetData);
    XLSX.utils.book_append_sheet(wb, wsTB, 'Trial_Balance');

    // Sheet 2: Schedule III Financial Statements
    const bsSheetData = [
      [`SCHEDULE III FINANCIAL STATEMENTS - ${companyName.toUpperCase()}`, '', ''],
      [`Financial Year: ${financialYear}`, '', ''],
      ['', '', ''],
      ['PART II: STATEMENT OF PROFIT AND LOSS', '', 'Amount (INR)'],
      ['I. Revenue from Operations (Gross Sales)', '', totalRevenue],
      ['II. Total Operating, Administrative & Finance Expenses', '', totalExpenses],
      ['III. Net Profit Transferred to Reserves & Surplus', '', netProfit],
      ['', '', ''],
      ['PART I: BALANCE SHEET', '', 'Amount (INR)'],
      ['I. EQUITY AND LIABILITIES', '', ''],
      ['(1) Shareholders Funds (Capital + Reserves & Net Profit)', '', totalEquity],
      ['(2) Non-Current Liabilities (Long-term Term Loans)', '', nonCurrentLiabilities],
      ['(3) Current Liabilities (Trade Payables & Provisions)', '', currentLiabilities],
      ['TOTAL EQUITY & LIABILITIES', '', totalLiabilities],
      ['', '', ''],
      ['II. ASSETS', '', ''],
      ['(1) Non-Current Assets (Property, Plant & Equipment)', '', fixedAssets],
      ['(2) Current Assets (Inventories, Debtors, Bank & Cash)', '', currentAssets],
      ['TOTAL ASSETS', '', totalAssets],
      ['', '', ''],
      ['BALANCE VERIFICATION STATUS', '', isBsBalanced ? 'PERFECTLY BALANCED (Assets = Liabilities)' : `MISMATCH DIFFERENCE: ${Math.abs(totalAssets - totalLiabilities)}`]
    ];
    const wsBS = XLSX.utils.aoa_to_sheet(bsSheetData);
    XLSX.utils.book_append_sheet(wb, wsBS, 'Schedule_III_BalanceSheet');

    const cleanName = companyName.replace(/[^a-zA-Z0-9]/g, '_');
    XLSX.writeFile(wb, `Schedule_III_Statements_${cleanName}_${financialYear.replace(/\s+/g, '')}.xlsx`);
  };

  // Text summary download
  const handleDownloadTextSummary = () => {
    if (!isUnlocked) {
      setPaywallOpen(true);
      return;
    }
    const content = [
      '========================================================================',
      `           SCHEDULE III STATUTORY FINANCIAL STATEMENTS (MCA)           `,
      `           Company: ${companyName} | FY: ${financialYear}              `,
      '========================================================================',
      '',
      'PART II: STATEMENT OF PROFIT AND LOSS',
      '------------------------------------------------------------------------',
      `1. Revenue from Operations (Gross Revenue)    : Rs. ${totalRevenue.toLocaleString('en-IN')}`,
      `2. Operating, Admin, Salary & Finance Expenses: Rs. ${totalExpenses.toLocaleString('en-IN')}`,
      '------------------------------------------------------------------------',
      `NET PROFIT BEFORE TAX (Transferred to Reserves): Rs. ${netProfit.toLocaleString('en-IN')}`,
      '------------------------------------------------------------------------',
      '',
      'PART I: BALANCE SHEET AS AT 31ST MARCH',
      '------------------------------------------------------------------------',
      'I. EQUITY AND LIABILITIES:',
      `   (a) Shareholders' Funds (Capital + Reserves) : Rs. ${totalEquity.toLocaleString('en-IN')}`,
      `   (b) Non-Current Liabilities (Term Loans)     : Rs. ${nonCurrentLiabilities.toLocaleString('en-IN')}`,
      `   (c) Current Liabilities (Trade Payables, GST): Rs. ${currentLiabilities.toLocaleString('en-IN')}`,
      '   ---------------------------------------------------------------------',
      `   TOTAL EQUITY & LIABILITIES                   : Rs. ${totalLiabilities.toLocaleString('en-IN')}`,
      '',
      'II. ASSETS:',
      `   (a) Non-Current Assets (Property, Plant, Equip): Rs. ${fixedAssets.toLocaleString('en-IN')}`,
      `   (b) Current Assets (Stock, Debtors, Bank, Cash): Rs. ${currentAssets.toLocaleString('en-IN')}`,
      '   ---------------------------------------------------------------------',
      `   TOTAL ASSETS                                   : Rs. ${totalAssets.toLocaleString('en-IN')}`,
      '------------------------------------------------------------------------',
      `BALANCE SHEET STATUS : ${isBsBalanced ? 'PERFECTLY BALANCED (Assets = Liabilities)' : `DIFFERENCE: Rs. ${Math.abs(totalAssets - totalLiabilities).toLocaleString('en-IN')}`}`,
      '========================================================================',
      'Generated by Trac Consultant Financial Suite (https://tracconsultant.com)'
    ].join('\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Schedule_III_Report_${companyName.replace(/\s+/g, '_')}_${financialYear}.txt`;
    link.click();
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
        
        {/* Header Banner Card */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-5 text-white shadow-md border border-indigo-900/40 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase tracking-wider mb-1 border border-indigo-500/30">
              <FileSpreadsheet className="w-3 h-3" /> Companies Act 2013 • Schedule III Automation
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">{toolName}</h1>
            <p className="text-xs text-slate-300 mt-0.5">
              Instantly convert raw Trial Balance ledgers into MCA-compliant Balance Sheet and Profit & Loss statements.
            </p>
          </div>

          {/* Quick Action Buttons */}
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
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload TB (.xlsx/.csv)</span>
            </button>
            <button
              onClick={() => {
                setLedgers(BALANCED_SAMPLE_TB);
                setCompanyName('Apex Technologies Pvt Ltd');
                setFileName('Balanced_Demo_TB.xlsx');
              }}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold border border-white/10 transition-colors cursor-pointer"
            >
              Load Balanced Demo
            </button>
          </div>
        </div>

        {/* Entity Metadata Row */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
              <Building2 className="w-4 h-4" />
            </div>
            <div className="flex-1 sm:flex-initial">
              <label className="text-[10px] uppercase font-bold text-slate-400 block leading-tight">Entity Legal Name</label>
              <input 
                type="text" 
                value={companyName} 
                onChange={(e) => setCompanyName(e.target.value)}
                className="font-bold text-slate-900 border-b border-transparent hover:border-slate-300 focus:border-indigo-500 focus:outline-none bg-transparent"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 block leading-tight">Reporting FY</label>
              <input 
                type="text" 
                value={financialYear} 
                onChange={(e) => setFinancialYear(e.target.value)}
                className="font-bold text-slate-900 w-24 border-b border-transparent hover:border-slate-300 focus:border-indigo-500 focus:outline-none bg-transparent"
              />
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
              isTbBalanced 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                : 'bg-red-50 text-red-700 border-red-200'
            }`}>
              {isTbBalanced ? '✓ TB In Balance (Diff: ₹0)' : `⚠️ TB Out of Balance (Diff: ₹${tbDifference.toLocaleString('en-IN')})`}
            </span>
          </div>
        </div>

        {/* 2-Column Split: Interactive TB Ledger on Left, Schedule III Financials on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Interactive Trial Balance Table */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Trial Balance Spreadsheet Editor</h2>
                <p className="text-[11px] text-slate-500">Edit values or add rows; financials update automatically.</p>
              </div>
              <button
                type="button"
                onClick={handleAddRow}
                className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Row</span>
              </button>
            </div>

            {/* Scrollable Spreadsheet Table */}
            <div className="overflow-x-auto max-h-[500px] overflow-y-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-100 text-slate-700 font-bold sticky top-0 z-10 text-[11px]">
                  <tr>
                    <th className="p-2.5">Ledger Name</th>
                    <th className="p-2.5">Category</th>
                    <th className="p-2.5 text-right w-24">Debit (₹)</th>
                    <th className="p-2.5 text-right w-24">Credit (₹)</th>
                    <th className="p-2 text-center w-8"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {ledgers.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-2">
                        <input
                          type="text"
                          value={row.account}
                          onChange={(e) => handleUpdateRow(row.id, 'account', e.target.value)}
                          className="w-full p-1 bg-transparent border border-transparent hover:border-slate-300 focus:border-indigo-500 rounded text-xs font-medium text-slate-900 focus:outline-none"
                        />
                      </td>
                      <td className="p-2">
                        <select
                          value={row.category}
                          onChange={(e) => handleUpdateRow(row.id, 'category', e.target.value as AccountingCategory)}
                          className="w-full p-1 bg-slate-50 border border-slate-200 rounded text-[10px] font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        >
                          <option value="equity">Equity / Capital</option>
                          <option value="non_current_liab">Non-Current Loan</option>
                          <option value="current_liab">Current Liability</option>
                          <option value="fixed_asset">Fixed Asset</option>
                          <option value="current_asset">Current Asset</option>
                          <option value="revenue">Sales Revenue</option>
                          <option value="expense">Operating Expense</option>
                        </select>
                      </td>
                      <td className="p-2 text-right">
                        <input
                          type="number"
                          value={row.debit || ''}
                          onChange={(e) => handleUpdateRow(row.id, 'debit', Number(e.target.value) || 0)}
                          className="w-20 p-1 text-right bg-transparent border border-transparent hover:border-slate-300 focus:border-indigo-500 rounded text-xs font-mono font-semibold text-slate-900 focus:outline-none"
                          placeholder="0"
                        />
                      </td>
                      <td className="p-2 text-right">
                        <input
                          type="number"
                          value={row.credit || ''}
                          onChange={(e) => handleUpdateRow(row.id, 'credit', Number(e.target.value) || 0)}
                          className="w-20 p-1 text-right bg-transparent border border-transparent hover:border-slate-300 focus:border-indigo-500 rounded text-xs font-mono font-semibold text-slate-900 focus:outline-none"
                          placeholder="0"
                        />
                      </td>
                      <td className="p-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleDeleteRow(row.id)}
                          className="text-slate-400 hover:text-red-600 transition-colors p-1"
                          title="Delete row"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Trial Balance Footer Totals */}
            <div className="p-3 bg-slate-100 rounded-xl flex justify-between items-center text-xs font-mono font-bold">
              <span>Total TB:</span>
              <div className="flex gap-4">
                <span className="text-slate-900">Dr: ₹{totalDebit.toLocaleString('en-IN')}</span>
                <span className="text-slate-900">Cr: ₹{totalCredit.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Schedule III Financial Statements Output */}
          <div className="lg:col-span-6 space-y-4">
            
            {/* Profit & Loss Statement Card */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200 space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900">Profit & Loss Statement ({financialYear})</h3>
                <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">
                  Schedule III Part II
                </span>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100 text-slate-700">
                  <span>I. Revenue from Operations (Gross Sales):</span>
                  <span className="font-mono font-bold text-slate-900">₹{totalRevenue.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 text-slate-700">
                  <span>II. Total Operating & Other Expenses:</span>
                  <span className="font-mono font-bold text-slate-900">₹{totalExpenses.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between py-2 font-bold text-emerald-800 bg-emerald-50 px-2.5 rounded-xl">
                  <span>III. Net Profit Transferred to Reserves:</span>
                  <span className="font-mono text-sm">₹{netProfit.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Balance Sheet Card */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200 space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Balance Sheet as at 31st March</h3>
                  <div className="text-[10px] text-slate-400">{companyName}</div>
                </div>
                <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">
                  Schedule III Part I
                </span>
              </div>

              <div className="space-y-2 text-xs">
                {/* Equity & Liabilities */}
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    I. EQUITY & LIABILITIES
                  </div>
                  <div className="space-y-1 pl-2 border-l-2 border-indigo-200 text-slate-700">
                    <div className="flex justify-between py-0.5">
                      <span>(a) Shareholders Funds (Capital + Reserves + Net Profit):</span>
                      <span className="font-mono font-bold">₹{totalEquity.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between py-0.5">
                      <span>(b) Non-Current Liabilities (Term Loans):</span>
                      <span className="font-mono font-bold">₹{nonCurrentLiabilities.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between py-0.5">
                      <span>(c) Current Liabilities (Trade Payables, GST/TDS):</span>
                      <span className="font-mono font-bold">₹{currentLiabilities.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                  <div className="flex justify-between font-bold text-slate-900 mt-1 pt-1 border-t border-slate-200">
                    <span>TOTAL EQUITY & LIABILITIES:</span>
                    <span className="font-mono text-sm text-indigo-900">₹{totalLiabilities.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Assets */}
                <div className="pt-2">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    II. ASSETS
                  </div>
                  <div className="space-y-1 pl-2 border-l-2 border-emerald-200 text-slate-700">
                    <div className="flex justify-between py-0.5">
                      <span>(a) Non-Current Assets (Property, Plant & Equipment):</span>
                      <span className="font-mono font-bold">₹{fixedAssets.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between py-0.5">
                      <span>(b) Current Assets (Receivables, Stock, Bank Balances):</span>
                      <span className="font-mono font-bold">₹{currentAssets.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                  <div className="flex justify-between font-bold text-slate-900 mt-1 pt-1 border-t border-slate-200">
                    <span>TOTAL ASSETS:</span>
                    <span className="font-mono text-sm text-emerald-900">₹{totalAssets.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Export Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row gap-2">
                {isUnlocked ? (
                  <>
                    <button
                      onClick={handleExportExcel}
                      className="flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Schedule III Excel (.xlsx)</span>
                    </button>
                    <button
                      onClick={handleDownloadTextSummary}
                      className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Text Statement</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setPaywallOpen(true)}
                    className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Unlock Full Export (₹{price})</span>
                  </button>
                )}
              </div>
            </div>
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

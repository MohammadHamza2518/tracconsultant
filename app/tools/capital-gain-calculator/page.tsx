'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { jsPDF } from 'jspdf';
import {
  TrendingUp,
  Calculator,
  Download,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Info,
  HelpCircle,
  Calendar,
  Building,
  Coins,
  FileText,
  Percent,
  Check,
  RotateCcw,
  Sliders,
  Scale
} from 'lucide-react';

// Official Cost Inflation Index (CII) notified by CBDT from FY 2001-02 to FY 2024-25
export const CII_MASTER: Record<string, number> = {
  '2001-02': 100,
  '2002-03': 105,
  '2003-04': 109,
  '2004-05': 113,
  '2005-06': 117,
  '2006-07': 122,
  '2007-08': 129,
  '2008-09': 137,
  '2009-10': 148,
  '2010-11': 167,
  '2011-12': 184,
  '2012-13': 200,
  '2013-14': 220,
  '2014-15': 240,
  '2015-16': 254,
  '2016-17': 264,
  '2017-18': 272,
  '2018-19': 280,
  '2019-20': 289,
  '2020-21': 301,
  '2021-22': 317,
  '2022-23': 331,
  '2023-24': 348,
  '2024-25': 363
};

type AssetType = 'equity_shares' | 'property_realestate' | 'gold_jewellery' | 'debt_funds' | 'unlisted_shares';

export default function CapitalGainCalculatorPage() {
  // Asset selection
  const [assetType, setAssetType] = useState<AssetType>('equity_shares');

  // Transaction Inputs
  const [purchasePrice, setPurchasePrice] = useState<number>(500000);
  const [salePrice, setSalePrice] = useState<number>(1200000);
  const [transferExpenses, setTransferExpenses] = useState<number>(15000);
  const [improvementCost, setImprovementCost] = useState<number>(0);

  // Dates / Years
  const [purchaseYear, setPurchaseYear] = useState<string>('2018-19');
  const [saleYear, setSaleYear] = useState<string>('2024-25');
  const [holdingMonths, setHoldingMonths] = useState<number>(36);

  // Was property acquired before 23 July 2024?
  const [acquiredBeforeJuly2024, setAcquiredBeforeJuly2024] = useState<boolean>(true);

  // Exemptions
  const [sec54Deduction, setSec54Deduction] = useState<number>(0); // New residential house
  const [sec54ECDeduction, setSec54ECDeduction] = useState<number>(0); // Capital gain bonds (Max 50L)

  // Taxpayer category
  const [slabRate, setSlabRate] = useState<number>(30); // for debt funds / STCG slab

  // Threshold months for LTCG by asset type
  const ltcgThresholdMonths = useMemo(() => {
    switch (assetType) {
      case 'equity_shares': return 12;
      case 'property_realestate': return 24;
      case 'gold_jewellery': return 24; // Budget 2024 reduced to 24m
      case 'unlisted_shares': return 24;
      case 'debt_funds': return 999; // Always STCG as per Sec 50AA post April 2023
      default: return 24;
    }
  }, [assetType]);

  const isLongTerm = holdingMonths > ltcgThresholdMonths && assetType !== 'debt_funds';
  const gainType = isLongTerm ? 'LTCG (Long-Term Capital Gain)' : 'STCG (Short-Term Capital Gain)';

  // Calculations
  const calculation = useMemo(() => {
    const netConsideration = Math.max(0, salePrice - transferExpenses);

    // Cost of acquisition
    const ciiSale = CII_MASTER[saleYear] || 363;
    const ciiPurchase = CII_MASTER[purchaseYear] || 280;
    const indexMultiplier = ciiPurchase > 0 ? (ciiSale / ciiPurchase) : 1;
    const indexedCost = Math.round(purchasePrice * indexMultiplier);

    // Standard non-indexed gain
    const grossGainNoIndex = netConsideration - purchasePrice - improvementCost;

    // Indexed gain (for property comparison)
    const grossGainWithIndex = netConsideration - indexedCost - Math.round(improvementCost * indexMultiplier);

    // Exemptions total
    const max54EC = Math.min(5000000, sec54ECDeduction);
    const totalClaimedExemptions = sec54Deduction + max54EC;

    // Logic based on Asset Type & Budget 2024:
    let taxRate = 0;
    let netTaxableGain = 0;
    let taxBeforeCess = 0;
    let optionComparison: {
      optionAName: string;
      optionATax: number;
      optionBName: string;
      optionBTax: number;
      recommended: 'A' | 'B';
      taxSaved: number;
    } | null = null;

    if (assetType === 'equity_shares') {
      if (isLongTerm) {
        // LTCG 112A: 12.5% on gains exceeding Rs 1,25,000 (Budget 2024)
        const exemption112A = 125000;
        const taxableAfter112A = Math.max(0, grossGainNoIndex - exemption112A - totalClaimedExemptions);
        netTaxableGain = taxableAfter112A;
        taxRate = 12.5;
        taxBeforeCess = (netTaxableGain * 12.5) / 100;
      } else {
        // STCG 111A: 20% flat (Budget 2024 increased from 15%)
        netTaxableGain = Math.max(0, grossGainNoIndex - totalClaimedExemptions);
        taxRate = 20;
        taxBeforeCess = (netTaxableGain * 20) / 100;
      }
    } else if (assetType === 'property_realestate') {
      if (isLongTerm) {
        // Budget 2024 Dual Choice for Pre-July 2024 Properties
        const gainOptA = Math.max(0, grossGainNoIndex - totalClaimedExemptions);
        const taxOptA = (gainOptA * 12.5) / 100; // 12.5% without indexation

        const gainOptB = Math.max(0, grossGainWithIndex - totalClaimedExemptions);
        const taxOptB = (gainOptB * 20) / 100; // 20% with indexation

        if (acquiredBeforeJuly2024) {
          const isBOptimal = taxOptB < taxOptA;
          optionComparison = {
            optionAName: 'New Regime: 12.5% without Indexation',
            optionATax: Math.round(taxOptA * 1.04),
            optionBName: 'Grandfathered Option: 20% with CII Indexation',
            optionBTax: Math.round(taxOptB * 1.04),
            recommended: isBOptimal ? 'B' : 'A',
            taxSaved: Math.round(Math.abs(taxOptA - taxOptB) * 1.04)
          };

          // Pick optimal choice
          if (isBOptimal) {
            netTaxableGain = gainOptB;
            taxRate = 20;
            taxBeforeCess = taxOptB;
          } else {
            netTaxableGain = gainOptA;
            taxRate = 12.5;
            taxBeforeCess = taxOptA;
          }
        } else {
          // Post July 2024: Flat 12.5% without indexation
          netTaxableGain = gainOptA;
          taxRate = 12.5;
          taxBeforeCess = taxOptA;
        }
      } else {
        // STCG: Slab rates
        netTaxableGain = Math.max(0, grossGainNoIndex - totalClaimedExemptions);
        taxRate = slabRate;
        taxBeforeCess = (netTaxableGain * slabRate) / 100;
      }
    } else if (assetType === 'gold_jewellery' || assetType === 'unlisted_shares') {
      if (isLongTerm) {
        // LTCG: 12.5% without indexation (Budget 2024)
        netTaxableGain = Math.max(0, grossGainNoIndex - totalClaimedExemptions);
        taxRate = 12.5;
        taxBeforeCess = (netTaxableGain * 12.5) / 100;
      } else {
        netTaxableGain = Math.max(0, grossGainNoIndex - totalClaimedExemptions);
        taxRate = slabRate;
        taxBeforeCess = (netTaxableGain * slabRate) / 100;
      }
    } else if (assetType === 'debt_funds') {
      // Debt MFs post April 2023: Section 50AA - Always taxed at slab rates
      netTaxableGain = Math.max(0, grossGainNoIndex - totalClaimedExemptions);
      taxRate = slabRate;
      taxBeforeCess = (netTaxableGain * slabRate) / 100;
    }

    const cess = (taxBeforeCess * 4) / 100; // 4% Health & Education Cess
    const totalTaxPayable = Math.round(taxBeforeCess + cess);

    return {
      netConsideration,
      indexedCost,
      grossGain: grossGainNoIndex,
      grossGainWithIndex,
      netTaxableGain: Math.round(netTaxableGain),
      taxRate,
      taxBeforeCess: Math.round(taxBeforeCess),
      cess: Math.round(cess),
      totalTaxPayable: Math.max(0, totalTaxPayable),
      optionComparison
    };
  }, [
    assetType,
    purchasePrice,
    salePrice,
    transferExpenses,
    improvementCost,
    purchaseYear,
    saleYear,
    isLongTerm,
    acquiredBeforeJuly2024,
    sec54Deduction,
    sec54ECDeduction,
    slabRate
  ]);

  // PDF Export
  const handleDownloadPdf = () => {
    try {
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 14;
      const contentWidth = pageWidth - (margin * 2);

      // Header Banner
      doc.setFillColor(11, 37, 69);
      doc.rect(0, 0, pageWidth, 24, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('TRACCONSULTANT', margin, 12);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(201, 147, 59);
      doc.text('Capital Gains Tax Computation Statement (Budget FY 2024-25 / AY 2025-26)', margin, 18);

      // Status Stamp
      doc.setFillColor(5, 150, 105);
      doc.roundedRect(pageWidth - margin - 35, 14, 35, 6, 1, 1, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.text(isLongTerm ? 'LTCG VERIFIED' : 'STCG VERIFIED', pageWidth - margin - 17.5, 18.2, { align: 'center' });

      let currentY = 32;

      // Section 1: Asset Details Box
      doc.setFillColor(241, 245, 249);
      doc.rect(margin, currentY, contentWidth, 6, 'F');
      doc.setTextColor(11, 37, 69);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.text('1. CAPITAL ASSET TRANSACTION SPECIFICATION', margin + 3, currentY + 4.2);

      currentY += 9;
      const assetLabels = [
        ['Asset Classification:', assetType.replace('_', ' ').toUpperCase(), 'Holding Classification:', gainType],
        ['Acquisition Year:', purchaseYear, 'Transfer Year:', saleYear],
        ['Holding Period:', `${holdingMonths} Months`, 'Applicable Tax Rate:', `${calculation.taxRate}% + 4% Cess`]
      ];

      doc.setFontSize(8);
      assetLabels.forEach(row => {
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(71, 85, 105);
        doc.text(row[0], margin + 2, currentY);
        doc.setTextColor(15, 23, 42);
        doc.text(row[1], margin + 45, currentY);

        doc.setTextColor(71, 85, 105);
        doc.text(row[2], margin + (contentWidth / 2) + 2, currentY);
        doc.setTextColor(15, 23, 42);
        doc.text(row[3], margin + (contentWidth / 2) + 45, currentY);
        currentY += 6;
      });

      currentY += 4;

      // Section 2: Financial Breakdown Table
      doc.setFillColor(241, 245, 249);
      doc.rect(margin, currentY, contentWidth, 6, 'F');
      doc.setTextColor(11, 37, 69);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.text('2. DETAILED CAPITAL GAIN / LOSS COMPUTATION', margin + 3, currentY + 4.2);

      currentY += 8;

      const compRows: [string, string, boolean][] = [
        ['A. Full Value of Consideration (Gross Sale Price)', `₹${salePrice.toLocaleString('en-IN')}`, false],
        ['Less: Brokerage & Transfer Expenses', `₹${transferExpenses.toLocaleString('en-IN')}`, false],
        ['B. Net Sale Consideration', `₹${calculation.netConsideration.toLocaleString('en-IN')}`, true],
        ['Less: Cost of Acquisition', `₹${purchasePrice.toLocaleString('en-IN')}`, false],
        ...(assetType === 'property_realestate' && isLongTerm ? [['   Indexed Cost of Acquisition (CII Applied)', `₹${calculation.indexedCost.toLocaleString('en-IN')}`, false] as [string, string, boolean]] : []),
        ['Less: Cost of Improvement / Renovation', `₹${improvementCost.toLocaleString('en-IN')}`, false],
        ['C. Gross Capital Gain / (Loss)', `₹${calculation.grossGain.toLocaleString('en-IN')}`, true],
        ...(assetType === 'equity_shares' && isLongTerm ? [['Less: Statutory Exemption u/s 112A (Budget 2024)', '₹1,25,000', false] as [string, string, boolean]] : []),
        ...(sec54Deduction > 0 ? [['Less: Section 54 Exemption (Residential Property Investment)', `₹${sec54Deduction.toLocaleString('en-IN')}`, false] as [string, string, boolean]] : []),
        ...(sec54ECDeduction > 0 ? [['Less: Section 54EC Exemption (Capital Gain Bonds)', `₹${sec54ECDeduction.toLocaleString('en-IN')}`, false] as [string, string, boolean]] : []),
        ['D. Net Taxable Capital Gain', `₹${calculation.netTaxableGain.toLocaleString('en-IN')}`, true],
        [`E. Capital Gains Tax (${calculation.taxRate}%)`, `₹${calculation.taxBeforeCess.toLocaleString('en-IN')}`, false],
        ['Add: Health & Education Cess (4%)', `₹${calculation.cess.toLocaleString('en-IN')}`, false],
        ['TOTAL TAX LIABILITY PAYABLE', `₹${calculation.totalTaxPayable.toLocaleString('en-IN')}`, true]
      ];

      compRows.forEach(([desc, amt, isBold]: [string, string, boolean], idx) => {
        const bg = isBold ? 245 : (idx % 2 === 0 ? 255 : 250);
        doc.setFillColor(bg, bg, bg);
        doc.rect(margin, currentY, contentWidth, 6, 'F');
        doc.setDrawColor(226, 232, 240);
        doc.rect(margin, currentY, contentWidth, 6, 'S');

        doc.setFont('helvetica', isBold ? 'bold' : 'normal');
        doc.setFontSize(8);
        doc.setTextColor(isBold ? 11 : 51, isBold ? 37 : 65, isBold ? 69 : 85);
        doc.text(desc, margin + 3, currentY + 4.2);

        doc.setFont('helvetica', 'bold');
        doc.setTextColor(isBold ? 5 : 15, isBold ? 150 : 23, isBold ? 105 : 42);
        doc.text(amt, pageWidth - margin - 3, currentY + 4.2, { align: 'right' });

        currentY += 6;
      });

      // Property Dual Choice Recommendation Note (if applicable)
      if (calculation.optionComparison) {
        currentY += 5;
        doc.setFillColor(236, 253, 245);
        doc.rect(margin, currentY, contentWidth, 14, 'F');
        doc.setDrawColor(167, 243, 208);
        doc.rect(margin, currentY, contentWidth, 14, 'S');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.setTextColor(6, 95, 70);
        doc.text('BUDGET 2024 PROPERTY TAX OPTIMIZATION ANALYSIS:', margin + 3, currentY + 4);

        doc.setFont('helvetica', 'normal');
        doc.text(`Option A (12.5% without indexation): ${calculation.optionComparison.optionATax.toLocaleString('en-IN')} | Option B (20% with CII indexation): ${calculation.optionComparison.optionBTax.toLocaleString('en-IN')}`, margin + 3, currentY + 8);
        doc.setFont('helvetica', 'bold');
        doc.text(`RECOMMENDATION: Choose ${calculation.optionComparison.recommended === 'B' ? 'Option B (with Indexation)' : 'Option A (12.5% Flat)'} to save ₹${calculation.optionComparison.taxSaved.toLocaleString('en-IN')} in tax!`, margin + 3, currentY + 12);
        currentY += 15;
      }

      // Footer
      const footerY = 282;
      doc.setDrawColor(203, 213, 225);
      doc.line(margin, footerY, pageWidth - margin, footerY);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      doc.text('Official calculation statement generated via TracConsultant platform. Tax laws subject to Finance Act 2024 amendments.', margin, footerY + 5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(11, 37, 69);
      doc.text('https://tracconsultant.com', pageWidth - margin, footerY + 5, { align: 'right' });

      doc.save(`Capital_Gains_Computation_${assetType}.pdf`);
    } catch (e) {
      console.error(e);
      alert('Error generating computation statement PDF.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Top Hero Banner */}
      <div className="bg-[#0B2545] text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#C9933B_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex items-center space-x-2 text-sm text-slate-400 mb-4">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/tools" className="hover:text-white transition-colors">Tools</Link>
            <span>/</span>
            <span className="text-[#C9933B] font-medium">Capital Gain Calculator</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="inline-flex items-center space-x-2 bg-emerald-500/20 text-emerald-400 text-xs px-3 py-1 rounded-full font-semibold border border-emerald-500/30 mb-3">
                <Sparkles className="w-4 h-4" />
                <span>UNION BUDGET 2024 UPDATED • AY 2025-26 &amp; 2026-27</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
                Capital Gain Tax Calculator (LTCG &amp; STCG)
              </h1>
              <p className="mt-2 text-base text-slate-300 max-w-2xl leading-relaxed">
                Compute Long-Term &amp; Short-Term capital gains on Shares, Real Estate Property, Gold, Mutual Funds &amp; Bonds. Reflects latest 12.5% LTCG, 20% STCG, ₹1.25L exemption &amp; Property Dual Option comparison.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleDownloadPdf}
                className="inline-flex items-center gap-2 bg-[#C9933B] hover:bg-[#b07e2c] text-white px-5 py-3 rounded-xl font-bold shadow-lg shadow-[#C9933B]/20 transition-all hover:scale-105 active:scale-95 shrink-0"
              >
                <Download className="w-5 h-5" />
                <span>Download Statement (PDF)</span>
              </button>
            </div>
          </div>

          {/* Asset Type Selector Tabs */}
          <div className="mt-8 flex flex-wrap items-center gap-2">
            {[
              { id: 'equity_shares', label: 'Shares & Equity MFs', icon: TrendingUp },
              { id: 'property_realestate', label: 'Real Estate / Property', icon: Building },
              { id: 'gold_jewellery', label: 'Gold & Jewellery', icon: Coins },
              { id: 'debt_funds', label: 'Debt Mutual Funds', icon: Scale },
              { id: 'unlisted_shares', label: 'Unlisted / Private Equity', icon: FileText }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setAssetType(tab.id as AssetType)}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
                  assetType === tab.id
                    ? 'bg-white text-slate-900 shadow-md scale-105'
                    : 'bg-white/10 hover:bg-white/20 text-slate-200 border border-slate-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Input Form (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Asset Specific Alert Banner */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-emerald-600" />
                  <span>Transaction &amp; Cost Details</span>
                </h3>
                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                  isLongTerm
                    ? 'bg-purple-50 text-purple-700 border-purple-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}>
                  {gainType}
                </span>
              </div>

              {/* Input Fields */}
              <div className="space-y-4 text-sm">
                
                {/* Purchase & Sale Consideration */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Purchase Price (Cost of Acquisition)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                      <input
                        type="number"
                        value={purchasePrice}
                        onChange={(e) => setPurchasePrice(Math.max(0, Number(e.target.value)))}
                        className="w-full pl-8 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Sale Price (Full Consideration)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                      <input
                        type="number"
                        value={salePrice}
                        onChange={(e) => setSalePrice(Math.max(0, Number(e.target.value)))}
                        className="w-full pl-8 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Transfer Expenses & Holding Period */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Brokerage / Transfer Expenses
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                      <input
                        type="number"
                        value={transferExpenses}
                        onChange={(e) => setTransferExpenses(Math.max(0, Number(e.target.value)))}
                        className="w-full pl-8 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
                      />
                    </div>
                    <span className="text-[11px] text-slate-400 mt-1 block">Stamp duty, registry fees or brokerage</span>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Holding Period (Months)
                    </label>
                    <input
                      type="number"
                      value={holdingMonths}
                      onChange={(e) => setHoldingMonths(Math.max(1, Number(e.target.value)))}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
                    />
                    <span className="text-[11px] text-slate-500 mt-1 block">
                      Threshold for LTCG: &gt;{ltcgThresholdMonths} Months
                    </span>
                  </div>
                </div>

                {/* Years & Improvement for Real Estate / Property */}
                {assetType === 'property_realestate' && (
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                    <div className="text-xs font-bold uppercase text-slate-600 tracking-wider">
                      Real Estate CII Indexation &amp; Improvement Inputs
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Purchase FY (CII)</label>
                        <select
                          value={purchaseYear}
                          onChange={(e) => setPurchaseYear(e.target.value)}
                          className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
                        >
                          {Object.keys(CII_MASTER).map(yr => (
                            <option key={yr} value={yr}>{yr} (CII: {CII_MASTER[yr]})</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Sale FY (CII)</label>
                        <select
                          value={saleYear}
                          onChange={(e) => setSaleYear(e.target.value)}
                          className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
                        >
                          {Object.keys(CII_MASTER).map(yr => (
                            <option key={yr} value={yr}>{yr} (CII: {CII_MASTER[yr]})</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Cost of Improvement / Renovation</label>
                      <input
                        type="number"
                        value={improvementCost}
                        onChange={(e) => setImprovementCost(Math.max(0, Number(e.target.value)))}
                        placeholder="Cost of construction / renovations"
                        className="w-full p-2 bg-white border border-slate-300 rounded-xl font-mono text-xs font-bold text-slate-900"
                      />
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <input
                        type="checkbox"
                        id="preJuly2024"
                        checked={acquiredBeforeJuly2024}
                        onChange={(e) => setAcquiredBeforeJuly2024(e.target.checked)}
                        className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
                      />
                      <label htmlFor="preJuly2024" className="text-xs font-bold text-slate-800 cursor-pointer">
                        Property purchased before 23rd July 2024? (Enables 20% with Indexation Option)
                      </label>
                    </div>
                  </div>
                )}

                {/* Section 54 / 54EC Exemptions */}
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
                    Tax Saving Reinvestment Exemptions (Optional)
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Section 54 / 54F (New House Investment)
                      </label>
                      <input
                        type="number"
                        value={sec54Deduction}
                        onChange={(e) => setSec54Deduction(Math.max(0, Number(e.target.value)))}
                        placeholder="Amount invested in new residential house"
                        className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-xs font-bold text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Section 54EC (Capital Gain Bonds - Max ₹50L)
                      </label>
                      <input
                        type="number"
                        value={sec54ECDeduction}
                        onChange={(e) => setSec54ECDeduction(Math.max(0, Number(e.target.value)))}
                        placeholder="NHAI / REC / PFC Bonds (Up to 50 Lakhs)"
                        className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-xs font-bold text-slate-900"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Property Dual Option Comparison Card (Budget 2024 Special Feature) */}
            {calculation.optionComparison && (
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-6 border-2 border-emerald-300 shadow-md space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-sm sm:text-base">
                    <Scale className="w-5 h-5 text-emerald-600" />
                    <span>Budget 2024 Real Estate Dual Option Analysis</span>
                  </div>
                  <span className="px-2.5 py-0.5 bg-emerald-600 text-white font-bold text-[10px] uppercase rounded-full">
                    Saves ₹{calculation.optionComparison.taxSaved.toLocaleString('en-IN')}
                  </span>
                </div>

                <p className="text-xs text-emerald-800 leading-relaxed">
                  For properties bought before 23 July 2024, the Income Tax Act allows you to choose between 12.5% without indexation and 20% with indexation. Our engine calculated both for you:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className={`p-4 rounded-2xl border transition-all ${
                    calculation.optionComparison.recommended === 'A'
                      ? 'bg-white border-emerald-500 shadow-sm ring-2 ring-emerald-500/20'
                      : 'bg-white/60 border-slate-200'
                  }`}>
                    <div className="font-bold text-slate-900">Option A: 12.5% without Indexation</div>
                    <div className="text-lg font-black text-slate-900 font-mono mt-2">
                      ₹{calculation.optionComparison.optionATax.toLocaleString('en-IN')}
                    </div>
                    <span className="text-[11px] text-slate-500 block mt-1">Tax payable under new standard rule</span>
                  </div>

                  <div className={`p-4 rounded-2xl border transition-all ${
                    calculation.optionComparison.recommended === 'B'
                      ? 'bg-white border-emerald-500 shadow-sm ring-2 ring-emerald-500/20'
                      : 'bg-white/60 border-slate-200'
                  }`}>
                    <div className="font-bold text-slate-900">Option B: 20% with CII Indexation</div>
                    <div className="text-lg font-black text-emerald-700 font-mono mt-2">
                      ₹{calculation.optionComparison.optionBTax.toLocaleString('en-IN')}
                    </div>
                    <span className="text-[11px] text-slate-500 block mt-1">
                      {calculation.optionComparison.recommended === 'B' ? '🌟 RECOMMENDED (Minimum Tax)' : 'Alternative grandfathered option'}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-emerald-200 text-xs font-bold text-emerald-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    Recommendation: Elect {calculation.optionComparison.recommended === 'B' ? 'Option B (20% with Indexation)' : 'Option A (12.5% Flat)'} in your ITR to save ₹{calculation.optionComparison.taxSaved.toLocaleString('en-IN')} in tax payout!
                  </span>
                </div>
              </div>
            )}

            {/* Budget 2024 Rule Summary Explainer */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-600" />
                <span>Key Budget 2024 Capital Gain Tax Rules</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <strong className="text-slate-900 block mb-1">Equity Shares LTCG (Sec 112A)</strong>
                  <span>Tax rate is 12.5% (was 10%). Exemption limit increased to ₹1,25,000 per financial year.</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <strong className="text-slate-900 block mb-1">Equity Shares STCG (Sec 111A)</strong>
                  <span>Tax rate is increased to flat 20% (was 15%) for transfers on or after 23 July 2024.</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <strong className="text-slate-900 block mb-1">Gold &amp; Unlisted Equity LTCG</strong>
                  <span>Holding period reduced to 24 months. Taxed at 12.5% without indexation benefit.</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <strong className="text-slate-900 block mb-1">Debt Mutual Funds (Sec 50AA)</strong>
                  <span>Gains on pure debt MFs bought post April 2023 are deemed STCG &amp; taxed at income slab rates.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Tax Output Summary Card (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Primary KPI Card */}
            <div className="bg-gradient-to-br from-[#0B2545] to-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-xl space-y-6 border border-slate-800">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Estimated Tax Liability</span>
                  <div className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono mt-1">
                    ₹{calculation.totalTaxPayable.toLocaleString('en-IN')}
                  </div>
                </div>
                <span className="text-xs font-extrabold uppercase bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/30">
                  {calculation.taxRate}% + Cess
                </span>
              </div>

              {/* Financial Computation Ledger */}
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                  <span className="text-slate-400">Full Sale Consideration:</span>
                  <span className="font-bold text-white font-mono">₹{salePrice.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                  <span className="text-slate-400">Less: Transfer Expenses:</span>
                  <span className="font-bold text-rose-300 font-mono">-₹{transferExpenses.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                  <span className="text-slate-400">Net Consideration:</span>
                  <span className="font-bold text-white font-mono">₹{calculation.netConsideration.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                  <span className="text-slate-400">Cost of Acquisition:</span>
                  <span className="font-bold text-rose-300 font-mono">-₹{purchasePrice.toLocaleString('en-IN')}</span>
                </div>
                {assetType === 'property_realestate' && isLongTerm && (
                  <div className="flex justify-between py-1.5 border-b border-slate-800/80 text-emerald-300">
                    <span>Indexed Cost (CII {CII_MASTER[saleYear]}/{CII_MASTER[purchaseYear]}):</span>
                    <span className="font-bold font-mono">₹{calculation.indexedCost.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                  <span className="text-slate-400">Gross Capital Gain:</span>
                  <span className="font-black text-emerald-400 font-mono">₹{calculation.grossGain.toLocaleString('en-IN')}</span>
                </div>

                {assetType === 'equity_shares' && isLongTerm && (
                  <div className="flex justify-between py-1.5 border-b border-slate-800/80 text-emerald-300">
                    <span>Sec 112A Exemption (Budget 2024):</span>
                    <span className="font-bold font-mono">-₹1,25,000</span>
                  </div>
                )}

                <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                  <span className="text-slate-400">Net Taxable Gain:</span>
                  <span className="font-black text-white font-mono">₹{calculation.netTaxableGain.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                  <span className="text-slate-400">Basic Capital Gains Tax ({calculation.taxRate}%):</span>
                  <span className="font-bold text-white font-mono">₹{calculation.taxBeforeCess.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                  <span className="text-slate-400">Health &amp; Education Cess (4%):</span>
                  <span className="font-bold text-white font-mono">₹{calculation.cess.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between pt-2 text-sm font-black">
                  <span className="text-emerald-400">Total Tax Payable:</span>
                  <span className="text-emerald-400 font-mono">₹{calculation.totalTaxPayable.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-2.5">
                <button
                  onClick={handleDownloadPdf}
                  className="w-full py-3 bg-[#C9933B] hover:bg-[#b07e2c] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Computation PDF</span>
                </button>

                <Link
                  href="/consult-ca"
                  className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 border border-white/20"
                >
                  <span>Consult a CA for Tax Planning</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* CA Advice Teaser */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Save Tax with CA Section 54 Planning</span>
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Selling high-value property or shares? Our Senior Chartered Accountants help you structure Section 54, 54EC and 54F capital gains exemptions before the deadline to legally reduce your tax liability to zero.
              </p>
              <Link
                href="/services/tax-planning"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B2545] hover:text-emerald-600 transition-colors pt-1"
              >
                <span>Explore Capital Gain Tax Planning</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useId } from 'react';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import { 
  Calculator, 
  ArrowRight, 
  CheckCircle2, 
  TrendingDown, 
  Percent, 
  Home, 
  AlertCircle, 
  Download,
  FileText,
  FileSpreadsheet
} from 'lucide-react';
import Link from 'next/link';
import { useConfig } from '@/context/ConfigContext';

export default function TaxCalculator() {
  const { taxRates } = useConfig();
  const [activeTab, setActiveTab] = useState<'income_tax' | 'hra' | 'gst'>('income_tax');

  // Income Tax State
  const [grossIncome, setGrossIncome] = useState<number>(950000);
  const [isSalaried, setIsSalaried] = useState<boolean>(true);
  const [sec80C, setSec80C] = useState<number>(150000);
  const [sec80D, setSec80D] = useState<number>(25000);
  const [homeLoanInterest, setHomeLoanInterest] = useState<number>(0);
  const [otherDeductions, setOtherDeductions] = useState<number>(0);

  // HRA State
  const [basicSalary, setBasicSalary] = useState<number>(600000);
  const [hraReceived, setHraReceived] = useState<number>(240000);
  const [rentPaidAnnual, setRentPaidAnnual] = useState<number>(240000);
  const [isMetro, setIsMetro] = useState<boolean>(true);

  // GST State
  const [gstAmount, setGstAmount] = useState<number>(10000);
  const [gstRate, setGstRate] = useState<number>(18);
  const [gstMode, setGstMode] = useState<'exclusive' | 'inclusive'>('exclusive');

  // Dynamic values with fallbacks
  const standardDeductionAmount = taxRates.standardDeduction || 75000;
  const rebateCeiling = taxRates.rebate87ALimit || 700000;
  const cessRate = (taxRates.cessPercent !== undefined ? taxRates.cessPercent : 4) / 100;
  const metroRate = (taxRates.hraMetroPercent || 50) / 100;
  const nonMetroRate = (taxRates.hraNonMetroPercent || 40) / 100;

  // --- INCOME TAX CALCULATION LOGIC ---
  const calculateTax = () => {
    // 1. New Regime Calculation (Union Budget dynamic slabs)
    const newStdDeduction = isSalaried ? standardDeductionAmount : 0;
    const newTaxableIncome = Math.max(0, grossIncome - newStdDeduction);
    let newTax = 0;

    if (newTaxableIncome <= rebateCeiling) {
      // 87A rebate makes tax 0 if taxable income <= rebate limit
      newTax = 0;
    } else {
      if (newTaxableIncome > 300000) {
        newTax += Math.min(newTaxableIncome - 300000, 400000) * 0.05;
      }
      if (newTaxableIncome > 700000) {
        newTax += Math.min(newTaxableIncome - 700000, 300000) * 0.10;
      }
      if (newTaxableIncome > 1000000) {
        newTax += Math.min(newTaxableIncome - 1000000, 200000) * 0.15;
      }
      if (newTaxableIncome > 1200000) {
        newTax += Math.min(newTaxableIncome - 1200000, 300000) * 0.20;
      }
      if (newTaxableIncome > 1500000) {
        newTax += (newTaxableIncome - 1500000) * 0.30;
      }
    }
    const newCess = newTax * cessRate;
    const totalNewTax = Math.round(newTax + newCess);

    // 2. Old Regime Calculation
    const oldStdDeduction = isSalaried ? 50000 : 0;
    const capped80C = Math.min(sec80C, 150000);
    const capped80D = Math.min(sec80D, 100000);
    const cappedHomeLoan = Math.min(homeLoanInterest, 200000);
    const totalOldDeductions = oldStdDeduction + capped80C + capped80D + cappedHomeLoan + otherDeductions;
    const oldTaxableIncome = Math.max(0, grossIncome - totalOldDeductions);
    let oldTax = 0;

    if (oldTaxableIncome <= 500000) {
      // 87A rebate for old regime
      oldTax = 0;
    } else {
      if (oldTaxableIncome > 250000) {
        oldTax += Math.min(oldTaxableIncome - 250000, 250000) * 0.05;
      }
      if (oldTaxableIncome > 500000) {
        oldTax += Math.min(oldTaxableIncome - 500000, 500000) * 0.20;
      }
      if (oldTaxableIncome > 1000000) {
        oldTax += (oldTaxableIncome - 1000000) * 0.30;
      }
    }
    const oldCess = oldTax * cessRate;
    const totalOldTax = Math.round(oldTax + oldCess);

    const savings = Math.abs(totalOldTax - totalNewTax);
    const recommendedRegime = totalNewTax <= totalOldTax ? 'New Tax Regime' : 'Old Tax Regime';

    return {
      newTaxableIncome,
      totalNewTax,
      newStdDeduction,
      oldTaxableIncome,
      totalOldTax,
      totalOldDeductions,
      savings,
      recommendedRegime
    };
  };

  const taxResult = calculateTax();

  const downloadTaxPdf = () => {
    try {
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 14;
      const contentWidth = pageWidth - (margin * 2);

      // Top Banner
      doc.setFillColor(11, 37, 69); // #0B2545
      doc.rect(0, 0, pageWidth, 24, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('TRACCONSULTANT', margin, 12);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(201, 147, 59); // Gold
      doc.text('Certified Chartered Accountant Tax Advisory & Computation Engine', margin, 18);

      const nowStr = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
      doc.setFontSize(7.5);
      doc.setTextColor(220, 230, 242);
      doc.text(`Date: ${nowStr}`, pageWidth - margin, 11, { align: 'right' });

      // Badge: Recommended Regime
      doc.setFillColor(5, 150, 105); // Emerald
      doc.roundedRect(pageWidth - margin - 45, 14, 45, 6, 1, 1, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.text(`RECOMMENDED: ${taxResult.recommendedRegime.toUpperCase()}`, pageWidth - margin - 22.5, 18.2, { align: 'center' });

      let currentY = 32;

      // Section 1: Profile & Slabs Header
      doc.setFillColor(241, 245, 249);
      doc.rect(margin, currentY, contentWidth, 7, 'F');
      doc.setTextColor(11, 37, 69);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text('1. TAXPAYER & FINANCIAL YEAR PROFILE', margin + 3, currentY + 4.8);
      currentY += 9;

      const profileItems = [
        [
          { label: 'Financial Year', value: taxRates.financialYear || 'FY 2024-25' },
          { label: 'Assessment Year', value: taxRates.assessmentYear || 'AY 2025-26' }
        ],
        [
          { label: 'Taxpayer Category', value: isSalaried ? 'Salaried Professional' : 'Self-Employed / Business' },
          { label: 'Gross Annual Income', value: `Rs. ${grossIncome.toLocaleString('en-IN')}` }
        ]
      ];

      profileItems.forEach(row => {
        doc.setFillColor(255, 255, 255);
        doc.rect(margin, currentY, contentWidth, 6.5, 'F');
        doc.setDrawColor(226, 232, 240);
        doc.rect(margin, currentY, contentWidth, 6.5, 'S');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.setTextColor(71, 85, 105);
        doc.text(row[0].label + ':', margin + 3, currentY + 4.5);
        doc.setTextColor(15, 23, 42);
        doc.text(row[0].value, margin + 42, currentY + 4.5);

        doc.setTextColor(71, 85, 105);
        doc.text(row[1].label + ':', margin + (contentWidth / 2) + 3, currentY + 4.5);
        doc.setTextColor(15, 23, 42);
        doc.text(row[1].value, margin + (contentWidth / 2) + 42, currentY + 4.5);

        currentY += 6.5;
      });

      currentY += 4;

      // Section 2: Regime Comparison Table
      doc.setFillColor(241, 245, 249);
      doc.rect(margin, currentY, contentWidth, 7, 'F');
      doc.setTextColor(11, 37, 69);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text('2. COMPARATIVE COMPUTATION (NEW vs OLD REGIME)', margin + 3, currentY + 4.8);
      currentY += 9;

      // Table Header
      doc.setFillColor(11, 37, 69);
      doc.rect(margin, currentY, contentWidth, 7, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.text('Particulars / Tax Heads', margin + 3, currentY + 4.8);
      doc.text('New Regime (Sec 115BAC)', margin + 85, currentY + 4.8);
      doc.text('Old Tax Regime', margin + 140, currentY + 4.8);
      currentY += 7;

      const compRows = [
        ['Gross Annual Income', `Rs. ${grossIncome.toLocaleString('en-IN')}`, `Rs. ${grossIncome.toLocaleString('en-IN')}`],
        ['Standard Deduction', `Rs. ${taxResult.newStdDeduction.toLocaleString('en-IN')}`, `Rs. ${(isSalaried ? 50000 : 0).toLocaleString('en-IN')}`],
        ['Section 80C (PPF, ELSS, EPF, LIC)', 'N/A (Not Allowed)', `Rs. ${Math.min(sec80C, 150000).toLocaleString('en-IN')}`],
        ['Section 80D (Health Insurance)', 'N/A (Not Allowed)', `Rs. ${Math.min(sec80D, 100000).toLocaleString('en-IN')}`],
        ['Home Loan Interest (Section 24b)', 'N/A (Not Allowed)', `Rs. ${Math.min(homeLoanInterest, 200000).toLocaleString('en-IN')}`],
        ['Other Deductions', 'N/A (Not Allowed)', `Rs. ${otherDeductions.toLocaleString('en-IN')}`],
        ['Total Deductions Allowed', `Rs. ${taxResult.newStdDeduction.toLocaleString('en-IN')}`, `Rs. ${taxResult.totalOldDeductions.toLocaleString('en-IN')}`],
        ['Taxable Net Income', `Rs. ${taxResult.newTaxableIncome.toLocaleString('en-IN')}`, `Rs. ${taxResult.oldTaxableIncome.toLocaleString('en-IN')}`],
        ['Section 87A Rebate', taxResult.newTaxableIncome <= rebateCeiling ? 'Full Rebate (Rs. 0 Tax)' : 'N/A (> Rs. 7.00L)', taxResult.oldTaxableIncome <= 500000 ? 'Full Rebate (Rs. 0 Tax)' : 'N/A (> Rs. 5.00L)'],
        ['Health & Education Cess (4%)', `Rs. ${(taxResult.totalNewTax - Math.round(taxResult.totalNewTax / 1.04)).toLocaleString('en-IN')}`, `Rs. ${(taxResult.totalOldTax - Math.round(taxResult.totalOldTax / 1.04)).toLocaleString('en-IN')}`],
        ['FINAL TAX PAYABLE', `Rs. ${taxResult.totalNewTax.toLocaleString('en-IN')}`, `Rs. ${taxResult.totalOldTax.toLocaleString('en-IN')}`]
      ];

      compRows.forEach((r, idx) => {
        const isHighlight = idx === compRows.length - 1;
        doc.setFillColor(isHighlight ? 236 : (idx % 2 === 0 ? 255 : 248), isHighlight ? 253 : (idx % 2 === 0 ? 255 : 250), isHighlight ? 245 : (idx % 2 === 0 ? 255 : 252));
        doc.rect(margin, currentY, contentWidth, 6.5, 'F');
        doc.setDrawColor(226, 232, 240);
        doc.rect(margin, currentY, contentWidth, 6.5, 'S');

        doc.setFont('helvetica', isHighlight ? 'bold' : 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(isHighlight ? 5 : 51, isHighlight ? 150 : 65, isHighlight ? 105 : 85);
        doc.text(r[0], margin + 3, currentY + 4.5);

        doc.setFont('helvetica', isHighlight ? 'bold' : 'normal');
        doc.text(r[1], margin + 85, currentY + 4.5);
        doc.text(r[2], margin + 140, currentY + 4.5);

        currentY += 6.5;
      });

      currentY += 5;

      // Recommendation Box
      doc.setFillColor(236, 253, 245);
      doc.roundedRect(margin, currentY, contentWidth, 14, 2, 2, 'F');
      doc.setDrawColor(167, 243, 208);
      doc.roundedRect(margin, currentY, contentWidth, 14, 2, 2, 'S');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(6, 95, 70);
      doc.text(`Tax Advisory Recommendation: Choose ${taxResult.recommendedRegime.toUpperCase()}`, margin + 4, currentY + 5.5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(4, 120, 87);
      doc.text(`By opting for ${taxResult.recommendedRegime}, you save approximately Rs. ${taxResult.savings.toLocaleString('en-IN')} in taxes for ${taxRates.financialYear || 'FY 2024-25'}.`, margin + 4, currentY + 10.5);

      currentY += 19;

      // Footer Notes
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      doc.setTextColor(148, 163, 184);
      doc.text('* Notes: Computed under Indian Income Tax Act 1961 as amended by Union Budget Finance Act.', margin, currentY);
      doc.text('* Consult TracConsultant FCA tax experts for official ITR preparation, foreign income, capital gains & CIT appeals.', margin, currentY + 3.2);
      doc.text('Official Platform: https://tracconsultant.com | Helpline: +91 7275922162', margin, currentY + 6.4);

      doc.save(`Tax_Computation_${(taxRates.financialYear || 'FY2024-25').replace(/\s+/g, '')}.pdf`);
    } catch (err) {
      console.error('PDF generation error:', err);
      alert('Error generating PDF. Please try again.');
    }
  };

  const downloadTaxExcel = () => {
    try {
      const wb = XLSX.utils.book_new();

      const data = [
        ['TRACCONSULTANT - INCOME TAX COMPUTATION & REGIME COMPARISON'],
        ['Official Chartered Accountant Tax Advisory Engine (https://tracconsultant.com)'],
        [],
        ['Client Profile & Parameters', ''],
        ['Date of Computation', new Date().toLocaleDateString('en-IN')],
        ['Financial Year', taxRates.financialYear || 'FY 2024-25'],
        ['Assessment Year', taxRates.assessmentYear || 'AY 2025-26'],
        ['Employment Category', isSalaried ? 'Salaried Employee' : 'Self-Employed / Business'],
        ['Gross Annual Income (Rs.)', grossIncome],
        [],
        ['Comparative Computation', 'New Tax Regime (Sec 115BAC)', 'Old Tax Regime'],
        ['Gross Total Income', grossIncome, grossIncome],
        ['Standard Deduction', taxResult.newStdDeduction, isSalaried ? 50000 : 0],
        ['Section 80C Deductions', 0, Math.min(sec80C, 150000)],
        ['Section 80D Health Insurance', 0, Math.min(sec80D, 100000)],
        ['Home Loan Interest (Sec 24b)', 0, Math.min(homeLoanInterest, 200000)],
        ['Other Deductions Claimed', 0, otherDeductions],
        ['Total Deductions Allowed', taxResult.newStdDeduction, taxResult.totalOldDeductions],
        ['Net Taxable Income', taxResult.newTaxableIncome, taxResult.oldTaxableIncome],
        ['Final Tax Payable (incl Cess)', taxResult.totalNewTax, taxResult.totalOldTax],
        [],
        ['Advisory Recommendation', taxResult.recommendedRegime.toUpperCase()],
        ['Estimated Tax Savings (Rs.)', taxResult.savings],
        [],
        ['Compliance Notes:'],
        ['1. New Tax Regime under Section 115BAC is the default regime under the Finance Act.'],
        ['2. Standard deduction under New Regime is Rs. 75,000 for salaried employees.'],
        ['3. Section 87A rebate provides full tax waiver up to Rs. 7,00,000 taxable income under New Regime.']
      ];

      const ws = XLSX.utils.aoa_to_sheet(data);
      ws['!cols'] = [{ wch: 38 }, { wch: 30 }, { wch: 25 }];

      XLSX.utils.book_append_sheet(wb, ws, 'Tax Computation');
      XLSX.writeFile(wb, `Tax_Computation_${(taxRates.financialYear || 'FY2024-25').replace(/\s+/g, '')}.xlsx`);
    } catch (err) {
      console.error('Excel generation error:', err);
      alert('Error generating Excel file. Please try again.');
    }
  };

  // --- HRA EXEMPTION LOGIC ---
  const calculateHRA = () => {
    const cond1 = hraReceived;
    const cond2 = (isMetro ? metroRate : nonMetroRate) * basicSalary;
    const cond3 = Math.max(0, rentPaidAnnual - (0.10 * basicSalary));
    const exemptHRA = Math.min(cond1, cond2, cond3);
    const taxableHRA = Math.max(0, hraReceived - exemptHRA);
    return { exemptHRA, taxableHRA };
  };

  const hraResult = calculateHRA();

  // --- GST CALCULATION LOGIC ---
  const calculateGST = () => {
    if (gstMode === 'exclusive') {
      const tax = (gstAmount * gstRate) / 100;
      const total = gstAmount + tax;
      const cgst = tax / 2;
      const sgst = tax / 2;
      return { netAmount: gstAmount, tax, cgst, sgst, total };
    } else {
      const netAmount = (gstAmount * 100) / (100 + gstRate);
      const tax = gstAmount - netAmount;
      const cgst = tax / 2;
      const sgst = tax / 2;
      return { netAmount, tax, cgst, sgst, total: gstAmount };
    }
  };

  const gstResult = calculateGST();

  const isSalariedId = useId();
  const isMetroId = useId();

  return (
    <div className="w-full bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
      {/* Tab Navigation Header */}
      <div className="bg-[#0B2545] p-2 flex flex-wrap gap-2 border-b border-[#133b6b]">
        <button
          onClick={() => setActiveTab('income_tax')}
          className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'income_tax'
              ? 'bg-emerald-500 text-white shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span>Old vs New Tax Regime</span>
        </button>

        <button
          onClick={() => setActiveTab('hra')}
          className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'hra'
              ? 'bg-emerald-500 text-white shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <Home className="w-4 h-4" />
          <span>HRA Exemption Tool</span>
        </button>

        <button
          onClick={() => setActiveTab('gst')}
          className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'gst'
              ? 'bg-emerald-500 text-white shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <Percent className="w-4 h-4" />
          <span>GST Calculator</span>
        </button>
      </div>

      {/* TAB CONTENT: 1. INCOME TAX */}
      {activeTab === 'income_tax' && (
        <div className="p-6 sm:p-8">
          <div className="mb-6">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
              {taxRates.financialYear || 'FY 2024-25'} & {taxRates.assessmentYear || 'AY 2025-26'} Budget Slabs
            </span>
            <h3 className="text-xl font-bold text-slate-900 mt-0.5">
              Income Tax Comparison Calculator
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Controls Left Column */}
            <div className="lg:col-span-6 space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Gross Annual Income (Salary + Other)</span>
                  <span className="text-emerald-700 font-bold text-sm">₹{grossIncome.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min={300000}
                  max={5000000}
                  step={25000}
                  value={grossIncome}
                  onChange={(e) => setGrossIncome(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>₹3 Lakh</span>
                  <span>₹25 Lakh</span>
                  <span>₹50 Lakh</span>
                </div>
              </div>

              {/* Salaried Employee Checkbox in logical flow */}
              <div className="flex items-center gap-2.5 p-3 bg-emerald-50/50 border border-emerald-200/60 rounded-xl">
                <input
                  type="checkbox"
                  id={isSalariedId}
                  checked={isSalaried}
                  onChange={(e) => setIsSalaried(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
                />
                <label htmlFor={isSalariedId} className="text-xs font-semibold text-slate-800 cursor-pointer select-none">
                  Salaried Employee (Includes ₹{standardDeductionAmount.toLocaleString('en-IN')} Standard Deduction)
                </label>
              </div>

              {/* Deductions for Old Regime */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Old Regime Deductions (Optional)
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-600 mb-1">
                    <span>Section 80C (PPF, ELSS, EPF, LIC - Max 1.5L)</span>
                    <span className="font-semibold text-slate-900">₹{sec80C.toLocaleString('en-IN')}</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={150000}
                    step={10000}
                    value={sec80C}
                    onChange={(e) => setSec80C(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0B2545]"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-600 mb-1">
                    <span>Section 80D (Health Insurance)</span>
                    <span className="font-semibold text-slate-900">₹{sec80D.toLocaleString('en-IN')}</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={75000}
                    step={5000}
                    value={sec80D}
                    onChange={(e) => setSec80D(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0B2545]"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-600 mb-1">
                    <span>Home Loan Interest (Sec 24b - Max 2L)</span>
                    <span className="font-semibold text-slate-900">₹{homeLoanInterest.toLocaleString('en-IN')}</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={200000}
                    step={10000}
                    value={homeLoanInterest}
                    onChange={(e) => setHomeLoanInterest(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0B2545]"
                  />
                </div>
              </div>
            </div>

            {/* Results Right Column */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
              {/* Recommendation Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg flex items-center justify-between">
                <div>
                  <div className="text-xs font-medium uppercase tracking-wider text-emerald-100">Best Regime for You</div>
                  <div className="text-lg font-extrabold">{taxResult.recommendedRegime}</div>
                  <div className="text-xs text-emerald-50 mt-1">
                    You save <strong className="font-bold text-white bg-white/20 px-2 py-0.5 rounded">₹{taxResult.savings.toLocaleString('en-IN')}</strong> extra tax!
                  </div>
                </div>
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <TrendingDown className="w-6 h-6 text-white" />
                </div>
              </div>

              {/* Side by side comparison cards */}
              <div className="grid grid-cols-2 gap-4">
                {/* New Regime Card */}
                <div className={`p-4 rounded-2xl border transition-all ${
                  taxResult.totalNewTax <= taxResult.totalOldTax
                    ? 'border-emerald-500 bg-emerald-50/40 shadow-md ring-1 ring-emerald-400'
                    : 'border-slate-200 bg-white'
                }`}>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-2">
                    <span>NEW REGIME</span>
                    {taxResult.totalNewTax <= taxResult.totalOldTax && (
                      <span className="text-xs font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-full">Recommended</span>
                    )}
                  </div>
                  <div className="text-2xl font-black text-slate-900">
                    ₹{taxResult.totalNewTax.toLocaleString('en-IN')}
                  </div>
                  <div className="text-xs text-slate-500 mt-2 space-y-1">
                    <div>Std Deduction: ₹{taxResult.newStdDeduction.toLocaleString('en-IN')}</div>
                    <div>Taxable: ₹{taxResult.newTaxableIncome.toLocaleString('en-IN')}</div>
                    <div className="text-emerald-700 font-medium">Rebate up to ₹7.75L: Applied</div>
                  </div>
                </div>

                {/* Old Regime Card */}
                <div className={`p-4 rounded-2xl border transition-all ${
                  taxResult.totalOldTax < taxResult.totalNewTax
                    ? 'border-emerald-500 bg-emerald-50/40 shadow-md ring-1 ring-emerald-400'
                    : 'border-slate-200 bg-white'
                }`}>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-2">
                    <span>OLD REGIME</span>
                    {taxResult.totalOldTax < taxResult.totalNewTax && (
                      <span className="text-xs font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-full">Recommended</span>
                    )}
                  </div>
                  <div className="text-2xl font-black text-slate-900">
                    ₹{taxResult.totalOldTax.toLocaleString('en-IN')}
                  </div>
                  <div className="text-xs text-slate-500 mt-2 space-y-1">
                    <div>Total Deductions: ₹{taxResult.totalOldDeductions.toLocaleString('en-IN')}</div>
                    <div>Taxable: ₹{taxResult.oldTaxableIncome.toLocaleString('en-IN')}</div>
                    <div>80C + 80D claimed</div>
                  </div>
                </div>
              </div>

              {/* Actions: Primary CA Filing CTA & Secondary Download */}
              <div className="space-y-2.5 pt-2">
                <Link
                  href="/#file-now"
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#00a859] hover:bg-[#008f4c] text-white rounded-xl text-sm font-bold shadow-md transition-all cursor-pointer"
                >
                  <span>File with CA & Claim Max Refund</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={downloadTaxPdf}
                    className="flex items-center justify-center gap-1.5 py-2.5 bg-rose-50 hover:bg-rose-100 active:bg-rose-200 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
                    title="Download Official PDF Computation Report"
                  >
                    <FileText className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>Download PDF</span>
                  </button>
                  <button
                    type="button"
                    onClick={downloadTaxExcel}
                    className="flex items-center justify-center gap-1.5 py-2.5 bg-emerald-50 hover:bg-emerald-100 active:bg-emerald-200 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
                    title="Download Formatted Excel (.xlsx) Computation"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Download Excel</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 2. HRA EXEMPTION */}
      {activeTab === 'hra' && (
        <div className="p-6 sm:p-8">
          <div className="mb-6">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
              Section 10(13A) Tax Benefit
            </span>
            <h3 className="text-xl font-bold text-slate-900">
              House Rent Allowance (HRA) Calculator
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Annual Basic Salary (₹)
                </label>
                <input
                  type="number"
                  value={basicSalary}
                  onChange={(e) => setBasicSalary(Number(e.target.value))}
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Annual HRA Received from Employer (₹)
                </label>
                <input
                  type="number"
                  value={hraReceived}
                  onChange={(e) => setHraReceived(Number(e.target.value))}
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Total Annual Rent Paid (₹)
                </label>
                <input
                  type="number"
                  value={rentPaidAnnual}
                  onChange={(e) => setRentPaidAnnual(Number(e.target.value))}
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 bg-white"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id={isMetroId}
                  checked={isMetro}
                  onChange={(e) => setIsMetro(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                />
                <label htmlFor={isMetroId} className="text-xs font-semibold text-slate-700 cursor-pointer">
                  Living in Metro City (Delhi, Mumbai, Kolkata, Chennai - 50% rule)
                </label>
              </div>
            </div>

            {/* Results Column */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col justify-between space-y-4">
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">HRA Calculation Output</div>
                
                <div className="mt-4 space-y-4">
                  <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                    <div className="text-xs text-emerald-800 font-semibold">Exempted HRA (Tax Free)</div>
                    <div className="text-3xl font-extrabold text-emerald-700 mt-1">
                      ₹{Math.round(hraResult.exemptHRA).toLocaleString('en-IN')}
                    </div>
                  </div>

                  <div className="p-4 bg-slate-100 rounded-xl border border-slate-200">
                    <div className="text-xs text-slate-600 font-semibold">Taxable HRA Component</div>
                    <div className="text-xl font-bold text-slate-800 mt-1">
                      ₹{Math.round(hraResult.taxableHRA).toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-500 leading-relaxed border-t border-slate-200 pt-3">
                💡 <em>Tip: Under Section 10(13A), exemption is calculated as the lowest of: actual HRA received, rent paid excess over 10% basic, or 50%/40% of basic salary.</em>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 3. GST CALCULATOR */}
      {activeTab === 'gst' && (
        <div className="p-6 sm:p-8">
          <div className="mb-6">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
              Goods and Services Tax
            </span>
            <h3 className="text-xl font-bold text-slate-900">
              GST Inclusive & Exclusive Calculator
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              {/* Mode Toggle */}
              <div className="flex gap-2 p-1 bg-slate-100 rounded-xl border border-slate-200">
                <button
                  onClick={() => setGstMode('exclusive')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    gstMode === 'exclusive' ? 'bg-[#0B2545] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  GST Exclusive (Add GST)
                </button>
                <button
                  onClick={() => setGstMode('inclusive')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    gstMode === 'inclusive' ? 'bg-[#0B2545] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  GST Inclusive (Extract Tax)
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {gstMode === 'exclusive' ? 'Base Amount (₹)' : 'Total Invoice Amount including GST (₹)'}
                </label>
                <input
                  type="number"
                  value={gstAmount}
                  onChange={(e) => setGstAmount(Number(e.target.value))}
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 bg-white"
                />
              </div>

              {/* Rate buttons */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Select GST Slab Rate (%)
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[5, 12, 18, 28].map(rate => (
                    <button
                      key={rate}
                      onClick={() => setGstRate(rate)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        gstRate === rate
                          ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {rate}%
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* GST Output */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Invoice Tax Breakdown</div>
                
                <div className="flex justify-between items-center py-2 border-b border-slate-200 text-xs">
                  <span className="text-slate-600">Net / Pre-Tax Amount:</span>
                  <span className="font-bold text-slate-900">₹{Math.round(gstResult.netAmount).toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-slate-200 text-xs">
                  <span className="text-slate-600">CGST ({gstRate / 2}%):</span>
                  <span className="font-bold text-slate-900">₹{Math.round(gstResult.cgst).toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-slate-200 text-xs">
                  <span className="text-slate-600">SGST ({gstRate / 2}%):</span>
                  <span className="font-bold text-slate-900">₹{Math.round(gstResult.sgst).toLocaleString('en-IN')}</span>
                </div>

                <div className="p-4 bg-slate-900 text-white rounded-xl flex items-center justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-wider text-emerald-400 font-bold">Total Payable / Invoice</div>
                    <div className="text-2xl font-black">₹{Math.round(gstResult.total).toLocaleString('en-IN')}</div>
                  </div>
                  <div className="text-right text-xs text-slate-400">
                    Total Tax: <strong className="text-white">₹{Math.round(gstResult.tax).toLocaleString('en-IN')}</strong>
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-500">
                Need to file your monthly GSTR-1 and 3B? <Link href="/#file-now" className="text-emerald-600 font-semibold hover:underline">Get CA assistance here</Link>.
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

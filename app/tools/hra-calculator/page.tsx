'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import { Calculator, ShieldCheck, Download, ArrowRight, CheckCircle2, Sparkles, AlertCircle, FileText, FileSpreadsheet } from 'lucide-react';
import { useConfig } from '@/context/ConfigContext';

export default function HraCalculatorPage() {
  const { taxRates } = useConfig();
  const metroPercentNum = taxRates.hraMetroPercent || 50;
  const nonMetroPercentNum = taxRates.hraNonMetroPercent || 40;
  const metroRate = metroPercentNum / 100;
  const nonMetroRate = nonMetroPercentNum / 100;

  const [period, setPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [basicSalary, setBasicSalary] = useState(50000);
  const [da, setDa] = useState(0);
  const [hraReceived, setHraReceived] = useState(25000);
  const [rentPaid, setRentPaid] = useState(20000);
  const [isMetro, setIsMetro] = useState(true); // Metro vs non-metro percentage
  const [taxBracket, setTaxBracket] = useState(0.20); // 20% or 30%

  // Multiplier if monthly
  const mult = period === 'monthly' ? 12 : 1;
  const annualSalary = (Number(basicSalary) + Number(da)) * mult;
  const annualHra = Number(hraReceived) * mult;
  const annualRent = Number(rentPaid) * mult;

  // Rule 1: Actual HRA received
  const rule1 = annualHra;
  // Rule 2: 50% or 40% (dynamic) of salary
  const rule2 = annualSalary * (isMetro ? metroRate : nonMetroRate);
  // Rule 3: Rent paid - 10% of salary
  const rule3 = Math.max(0, annualRent - (0.10 * annualSalary));

  // Exemption is minimum of the three
  const exemptHraAnnual = Math.min(rule1, rule2, rule3);
  const taxableHraAnnual = Math.max(0, annualHra - exemptHraAnnual);
  const taxSaved = exemptHraAnnual * taxBracket;

  const downloadHraPdf = () => {
    try {
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 14;
      const contentWidth = pageWidth - (margin * 2);

      // Top Banner
      doc.setFillColor(11, 37, 69);
      doc.rect(0, 0, pageWidth, 24, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('TRACCONSULTANT', margin, 12);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(201, 147, 59);
      doc.text('HRA Exemption Computation • Section 10(13A) & Rule 2A', margin, 18);

      const nowStr = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
      doc.setFontSize(7.5);
      doc.setTextColor(220, 230, 242);
      doc.text(`Date: ${nowStr}`, pageWidth - margin, 11, { align: 'right' });

      // Badge: Exempt Amount
      doc.setFillColor(5, 150, 105);
      doc.roundedRect(pageWidth - margin - 50, 14, 50, 6, 1, 1, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.text(`EXEMPT HRA: Rs. ${Math.round(exemptHraAnnual).toLocaleString('en-IN')}`, pageWidth - margin - 25, 18.2, { align: 'center' });

      let currentY = 32;

      // Section 1: Salaried Profile & Inputs
      doc.setFillColor(241, 245, 249);
      doc.rect(margin, currentY, contentWidth, 7, 'F');
      doc.setTextColor(11, 37, 69);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text('1. SALARY & RENT PARAMETERS', margin + 3, currentY + 4.8);
      currentY += 9;

      const inputRows = [
        ['Assessment Year / Financial Year', `${taxRates.assessmentYear || 'AY 2025-26'} (${taxRates.financialYear || 'FY 2024-25'})`],
        ['Calculation Frequency Mode', period === 'monthly' ? 'Monthly Entry' : 'Annual Entry'],
        [`Basic Salary (${period})`, `Rs. ${Number(basicSalary).toLocaleString('en-IN')}`],
        [`Dearness Allowance (${period})`, `Rs. ${Number(da).toLocaleString('en-IN')}`],
        ['Total Annual Basic + DA Salary', `Rs. ${annualSalary.toLocaleString('en-IN')}`],
        [`HRA Received from Employer (${period})`, `Rs. ${Number(hraReceived).toLocaleString('en-IN')} (Annual: Rs. ${annualHra.toLocaleString('en-IN')})`],
        [`Actual Rent Paid to Landlord (${period})`, `Rs. ${Number(rentPaid).toLocaleString('en-IN')} (Annual: Rs. ${annualRent.toLocaleString('en-IN')})`],
        ['Accommodation City Classification', isMetro ? `Metro City (${metroPercentNum}% Rule - Delhi, Mumbai, Kolkata, Chennai)` : `Non-Metro City (${nonMetroPercentNum}% Rule)`],
        ['Applicable Tax Slab Bracket', `${(taxBracket * 100).toFixed(0)}% Tax Bracket`]
      ];

      inputRows.forEach((r, idx) => {
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

      // Section 2: Statutory 3-Condition Test (Least is Exempt)
      doc.setFillColor(241, 245, 249);
      doc.rect(margin, currentY, contentWidth, 7, 'F');
      doc.setTextColor(11, 37, 69);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text('2. STATUTORY 3-CONDITION COMPUTATION (Least of 3 is Exempt)', margin + 3, currentY + 4.8);
      currentY += 9;

      const conditionRows: [string, string, boolean][] = [
        ['Condition 1: Actual Annual HRA Received', `Rs. ${Math.round(rule1).toLocaleString('en-IN')}`, exemptHraAnnual === rule1],
        [`Condition 2: ${isMetro ? metroPercentNum : nonMetroPercentNum}% of Annual Salary (Basic + DA)`, `Rs. ${Math.round(rule2).toLocaleString('en-IN')}`, exemptHraAnnual === rule2],
        ['Condition 3: Rent Paid in excess of 10% of Annual Salary', `Rs. ${Math.round(rule3).toLocaleString('en-IN')}`, exemptHraAnnual === rule3]
      ];

      conditionRows.forEach((c) => {
        const isWinner = c[2];
        doc.setFillColor(isWinner ? 236 : 255, isWinner ? 253 : 255, isWinner ? 245 : 255);
        doc.rect(margin, currentY, contentWidth, 7, 'F');
        doc.setDrawColor(isWinner ? 16 : 226, isWinner ? 185 : 232, isWinner ? 129 : 240);
        doc.rect(margin, currentY, contentWidth, 7, 'S');

        doc.setFont('helvetica', isWinner ? 'bold' : 'normal');
        doc.setFontSize(8);
        doc.setTextColor(isWinner ? 4 : 51, isWinner ? 120 : 65, isWinner ? 87 : 85);
        doc.text(`${c[0]} ${isWinner ? '  * [EXEMPT - LEAST]' : ''}`, margin + 3, currentY + 4.8);
        doc.setFont('helvetica', 'bold');
        doc.text(c[1], pageWidth - margin - 3, currentY + 4.8, { align: 'right' });
        currentY += 7;
      });

      currentY += 6;

      // Section 3: Final Exemption Summary & Tax Savings
      doc.setFillColor(241, 245, 249);
      doc.rect(margin, currentY, contentWidth, 7, 'F');
      doc.setTextColor(11, 37, 69);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text('3. FINAL EXEMPTION SUMMARY & TAX IMPACT', margin + 3, currentY + 4.8);
      currentY += 9;

      const summaryRows: [string, string, number[]][] = [
        ['TOTAL EXEMPT HRA UNDER SECTION 10(13A)', `Rs. ${Math.round(exemptHraAnnual).toLocaleString('en-IN')}`, [5, 150, 105]],
        ['TAXABLE HRA (Added to Salary Income)', `Rs. ${Math.round(taxableHraAnnual).toLocaleString('en-IN')}`, [225, 29, 72]],
        ['ESTIMATED ANNUAL TAX SAVINGS (at chosen slab)', `Rs. ${Math.round(taxSaved).toLocaleString('en-IN')}`, [37, 99, 235]]
      ];

      summaryRows.forEach((s) => {
        doc.setFillColor(255, 255, 255);
        doc.rect(margin, currentY, contentWidth, 7.5, 'F');
        doc.setDrawColor(226, 232, 240);
        doc.rect(margin, currentY, contentWidth, 7.5, 'S');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        const col = s[2];
        doc.setTextColor(col[0], col[1], col[2]);
        doc.text(s[0], margin + 3, currentY + 5);
        doc.text(s[1], pageWidth - margin - 3, currentY + 5, { align: 'right' });
        currentY += 7.5;
      });

      currentY += 7;

      // Section 4: Legal & Form 12BB Compliance Notes
      doc.setFillColor(254, 243, 199);
      doc.roundedRect(margin, currentY, contentWidth, 22, 1.5, 1.5, 'F');
      doc.setDrawColor(245, 158, 11);
      doc.roundedRect(margin, currentY, contentWidth, 22, 1.5, 1.5, 'S');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(146, 64, 14);
      doc.text('STATUTORY COMPLIANCE & VERIFICATION GUIDELINES (FORM 12BB):', margin + 3, currentY + 4.5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(180, 83, 9);
      doc.text('1. If total rent paid exceeds Rs. 1,00,000 per annum, reporting landlord PAN to employer is statutory mandatory.', margin + 3, currentY + 9);
      doc.text('2. Keep stamped rent receipts, registered tenancy contract, and digital banking trail ready for notice audit defense.', margin + 3, currentY + 13.5);
      doc.text('3. Exemption applies only under Old Tax Regime; under New Tax Regime Section 115BAC, HRA exemption is forgone.', margin + 3, currentY + 18);

      currentY += 26;

      // Footer
      doc.setDrawColor(226, 232, 240);
      doc.line(margin, currentY, pageWidth - margin, currentY);
      currentY += 4;
      doc.setFontSize(7);
      doc.setTextColor(148, 163, 184);
      doc.text('TracConsultant Tax Advisory • 100% Verified CA Tax Computation Suite • https://tracconsultant.com', margin, currentY);
      doc.text(`Generated: ${new Date().toLocaleString('en-IN')}`, pageWidth - margin, currentY, { align: 'right' });

      doc.save(`HRA_Exemption_Computation_${(taxRates.financialYear || 'FY2024-25').replace(/\s+/g, '')}.pdf`);
    } catch (err) {
      console.error('Failed to generate HRA PDF:', err);
    }
  };

  const downloadHraExcel = () => {
    try {
      const wb = XLSX.utils.book_new();

      const wsData = [
        ['TRAC CONSULTANT - HOUSE RENT ALLOWANCE (HRA) EXEMPTION STATEMENT'],
        ['Section 10(13A) of Income Tax Act 1961 • Rule 2A of IT Rules 1962'],
        [`Financial Year: ${taxRates.financialYear || 'FY 2024-25'} | Assessment Year: ${taxRates.assessmentYear || 'AY 2025-26'}`],
        [`Generated On: ${new Date().toLocaleString('en-IN')}`],
        [],
        ['1. EMPLOYEE SALARY & ACCOMMODATION INPUTS', ''],
        ['Frequency Mode', period === 'monthly' ? 'Monthly' : 'Annual'],
        [`Basic Salary (${period})`, Number(basicSalary)],
        [`Dearness Allowance (${period})`, Number(da)],
        ['Total Annual Salary (Basic + DA)', annualSalary],
        [`HRA Received (${period})`, Number(hraReceived)],
        ['Total Annual HRA Received', annualHra],
        [`Rent Paid (${period})`, Number(rentPaid)],
        ['Total Annual Rent Paid', annualRent],
        ['Accommodation City Type', isMetro ? `Metro City (${metroPercentNum}% Rule)` : `Non-Metro City (${nonMetroPercentNum}% Rule)`],
        ['Tax Bracket', `${(taxBracket * 100).toFixed(0)}%`],
        [],
        ['2. STATUTORY 3-CONDITION COMPUTATION (Least is Exempt)', 'Amount (INR)', 'Applicable as Exemption?'],
        ['Condition 1: Actual Annual HRA Received', Math.round(rule1), exemptHraAnnual === rule1 ? 'YES (LEAST)' : 'NO'],
        [`Condition 2: ${isMetro ? metroPercentNum : nonMetroPercentNum}% of Annual Salary (Basic + DA)`, Math.round(rule2), exemptHraAnnual === rule2 ? 'YES (LEAST)' : 'NO'],
        ['Condition 3: Rent Paid in excess of 10% of Annual Salary', Math.round(rule3), exemptHraAnnual === rule3 ? 'YES (LEAST)' : 'NO'],
        [],
        ['3. FINAL TAX IMPACT & SAVINGS', 'Amount (INR)'],
        ['TOTAL EXEMPT HRA UNDER SEC 10(13A) (ANNUAL)', Math.round(exemptHraAnnual)],
        ['TAXABLE HRA (Added to Salary Income)', Math.round(taxableHraAnnual)],
        ['ESTIMATED ANNUAL TAX SAVINGS', Math.round(taxSaved)],
        [],
        ['COMPLIANCE & AUDIT CHECKLIST:'],
        ['- Mandatory Landlord PAN: If annual rent exceeds Rs. 1,00,000, report Landlord PAN in Form 12BB to employer.'],
        ['- Documentation Required: Valid rent agreement, signed monthly rent receipts with revenue stamp, and bank transaction trail.'],
        ['- Regime Note: HRA exemption under Section 10(13A) is available under Old Tax Regime.'],
        [],
        ['Generated by Trac Consultant Financial Suite (https://tracconsultant.com)']
      ];

      const ws = XLSX.utils.aoa_to_sheet(wsData);
      ws['!cols'] = [{ wch: 45 }, { wch: 22 }, { wch: 25 }];
      XLSX.utils.book_append_sheet(wb, ws, 'HRA_Computation');

      XLSX.writeFile(wb, `HRA_Exemption_Computation_${(taxRates.financialYear || 'FY2024-25').replace(/\s+/g, '')}.xlsx`);
    } catch (err) {
      console.error('Failed to generate HRA Excel:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70 pb-20">
      {/* Top Banner - FinTech Gradient */}
      <div className="bg-gradient-to-b from-[#07152B] via-[#0B1E3B] to-[#0D2447] text-white pt-10 pb-10 sm:pt-12 sm:pb-12 px-4 sm:px-8 border-b border-[#143258] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2 border border-emerald-500/30">
              <Calculator className="w-3.5 h-3.5" /> Section 10(13A) • Rule 2A
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">HRA Exemption Tool</h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Accurate legal calculation of House Rent Allowance exemption with maximum tax savings.
            </p>
          </div>
          <Link
            href="/tools"
            className="text-xs font-bold text-slate-200 hover:text-white bg-white/10 hover:bg-white/15 px-4 py-2.5 rounded-xl border border-white/10 transition-colors backdrop-blur-sm"
          >
            ← Back to All Tools
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-8 pt-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Calculator Inputs */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">Salary & Rent Parameters</h2>
              <div className="flex p-1 bg-slate-100 rounded-xl text-xs font-bold text-slate-600">
                <button
                  type="button"
                  onClick={() => setPeriod('monthly')}
                  className={`px-3 py-1 rounded-lg transition-all ${period === 'monthly' ? 'bg-white text-slate-900 shadow-sm' : ''}`}
                >
                  Monthly
                </button>
                <button
                  type="button"
                  onClick={() => setPeriod('yearly')}
                  className={`px-3 py-1 rounded-lg transition-all ${period === 'yearly' ? 'bg-white text-slate-900 shadow-sm' : ''}`}
                >
                  Annual (Yearly)
                </button>
              </div>
            </div>

            {/* Basic Salary */}
            <div>
              <div className="flex justify-between items-center mb-1 text-xs font-semibold text-slate-700">
                <label>Basic Salary ({period}):</label>
                <span className="font-mono font-bold text-emerald-700">₹{Number(basicSalary).toLocaleString('en-IN')}</span>
              </div>
              <input
                type="number"
                value={basicSalary}
                onChange={(e) => setBasicSalary(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* DA */}
            <div>
              <div className="flex justify-between items-center mb-1 text-xs font-semibold text-slate-700">
                <label>Dearness Allowance (DA forming part of salary):</label>
                <span className="font-mono font-bold text-slate-600">₹{Number(da).toLocaleString('en-IN')}</span>
              </div>
              <input
                type="number"
                value={da}
                onChange={(e) => setDa(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* HRA Received */}
            <div>
              <div className="flex justify-between items-center mb-1 text-xs font-semibold text-slate-700">
                <label>HRA Received from Employer ({period}):</label>
                <span className="font-mono font-bold text-emerald-700">₹{Number(hraReceived).toLocaleString('en-IN')}</span>
              </div>
              <input
                type="number"
                value={hraReceived}
                onChange={(e) => setHraReceived(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Total Rent Paid */}
            <div>
              <div className="flex justify-between items-center mb-1 text-xs font-semibold text-slate-700">
                <label>Total Actual Rent Paid ({period}):</label>
                <span className="font-mono font-bold text-indigo-700">₹{Number(rentPaid).toLocaleString('en-IN')}</span>
              </div>
              <input
                type="number"
                value={rentPaid}
                onChange={(e) => setRentPaid(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* City Type */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">City of Rented Accommodation:</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setIsMetro(true)}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    isMetro
                      ? 'border-emerald-600 bg-emerald-50/50 shadow-sm text-emerald-900 font-bold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="text-xs">Metro City ({metroPercentNum}%)</div>
                  <div className="text-[10px] text-slate-400 font-normal">Delhi, Mumbai, Kolkata, Chennai</div>
                </button>
                <button
                  type="button"
                  onClick={() => setIsMetro(false)}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    !isMetro
                      ? 'border-emerald-600 bg-emerald-50/50 shadow-sm text-emerald-900 font-bold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="text-xs">Non-Metro ({nonMetroPercentNum}%)</div>
                  <div className="text-[10px] text-slate-400 font-normal">Bengaluru, Pune, Hyderabad, Kanpur, etc.</div>
                </button>
              </div>
            </div>

            {/* Tax Bracket */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">Your Applicable Tax Bracket:</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: '5% Bracket', val: 0.05 },
                  { label: '20% Bracket', val: 0.20 },
                  { label: '30% Bracket', val: 0.30 }
                ].map(b => (
                  <button
                    key={b.val}
                    type="button"
                    onClick={() => setTaxBracket(b.val)}
                    className={`p-2 rounded-xl border text-center text-xs font-bold transition-all ${
                      taxBracket === b.val
                        ? 'border-emerald-600 bg-emerald-600 text-white shadow-sm'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Statutory Rules & Results */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-gradient-to-br from-emerald-900 via-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                Exemption Result (Annual)
              </span>

              <div className="mt-3 pb-4 border-b border-slate-800">
                <div className="text-xs text-slate-400">Total HRA Exempt u/s 10(13A):</div>
                <div className="text-3xl sm:text-4xl font-black text-emerald-400 mt-1">
                  ₹{Math.round(exemptHraAnnual).toLocaleString('en-IN')}
                </div>
                <div className="text-xs text-slate-300 mt-2 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>Estimated Tax Saved: <strong className="text-white">₹{Math.round(taxSaved).toLocaleString('en-IN')}</strong></span>
                </div>
              </div>

              {/* Taxable HRA */}
              <div className="py-4 border-b border-slate-800 flex justify-between items-center text-xs">
                <span className="text-slate-400">Taxable HRA (Added to Salary):</span>
                <span className="font-bold text-white font-mono">₹{Math.round(taxableHraAnnual).toLocaleString('en-IN')}</span>
              </div>

              {/* 3 Statutory Rules Breakdown */}
              <div className="pt-4 space-y-2.5">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Least of the 3 is exempt:</p>
                <div className={`p-2.5 rounded-xl border text-xs flex justify-between items-center ${
                  exemptHraAnnual === rule1 ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-200 font-bold' : 'bg-slate-800/60 border-slate-700 text-slate-300'
                }`}>
                  <span>1. Actual HRA Received</span>
                  <span className="font-mono">₹{Math.round(rule1).toLocaleString('en-IN')}</span>
                </div>
                <div className={`p-2.5 rounded-xl border text-xs flex justify-between items-center ${
                  exemptHraAnnual === rule2 ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-200 font-bold' : 'bg-slate-800/60 border-slate-700 text-slate-300'
                }`}>
                  <span>2. {isMetro ? '50%' : '40%'} of Salary</span>
                  <span className="font-mono">₹{Math.round(rule2).toLocaleString('en-IN')}</span>
                </div>
                <div className={`p-2.5 rounded-xl border text-xs flex justify-between items-center ${
                  exemptHraAnnual === rule3 ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-200 font-bold' : 'bg-slate-800/60 border-slate-700 text-slate-300'
                }`}>
                  <span>3. Rent Paid - 10% Salary</span>
                  <span className="font-mono">₹{Math.round(rule3).toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Dual Download Buttons: PDF & Excel */}
              <div className="mt-5 pt-4 border-t border-slate-800 space-y-2">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider text-center">
                  Export Official Computation Report
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={downloadHraPdf}
                    className="w-full py-2.5 px-3 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </button>
                  <button
                    type="button"
                    onClick={downloadHraExcel}
                    className="w-full py-2.5 px-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    <span>Download Excel</span>
                  </button>
                </div>
              </div>
            </div>

            {/* CTA Box */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>Claim HRA Exemption in your ITR</span>
              </div>
              <p className="text-xs text-slate-500">
                Submit rent receipts and landlord PAN directly to our Chartered Accountants for 100% verified notice-free filing.
              </p>
              <Link
                href="/services/itr-filing"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-center font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-all"
              >
                <span>File ITR with HRA Exemption</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

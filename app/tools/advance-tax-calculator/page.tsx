'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Calendar, AlertTriangle, ShieldCheck, CheckCircle2, ArrowRight, Info, Download, FileText, Share2 } from 'lucide-react';
import { useConfig } from '@/context/ConfigContext';

export default function AdvanceTaxCalculatorPage() {
  const { taxRates } = useConfig();
  const [businessIncome, setBusinessIncome] = useState(1200000);
  const [otherIncome, setOtherIncome] = useState(150000);
  const [deductions, setDeductions] = useState(150000);
  const [tdsDeducted, setTdsDeducted] = useState(50000);
  const [isPresumptive, setIsPresumptive] = useState(false); // 44AD / 44ADA single installment on Mar 15

  const cessPercent = taxRates.cessPercent !== undefined ? taxRates.cessPercent : 4;
  const rebate87ALimit = taxRates.rebate87ALimit || 700000;

  // Rough estimation of tax liability under New vs Old regime (simplified for advance tax estimation)
  const grossIncome = Math.max(0, Number(businessIncome) + Number(otherIncome));
  const taxableIncome = Math.max(0, grossIncome - (isPresumptive ? 0 : Number(deductions)));

  // Simplified tax computation (New Tax Regime slabs)
  let grossTax = 0;
  if (taxableIncome <= 300000) {
    grossTax = 0;
  } else if (taxableIncome <= 700000) {
    grossTax = (taxableIncome - 300000) * 0.05;
  } else if (taxableIncome <= 1000000) {
    grossTax = 20000 + (taxableIncome - 700000) * 0.10;
  } else if (taxableIncome <= 1200000) {
    grossTax = 50000 + (taxableIncome - 1000000) * 0.15;
  } else if (taxableIncome <= 1500000) {
    grossTax = 80000 + (taxableIncome - 1200000) * 0.20;
  } else {
    grossTax = 140000 + (taxableIncome - 1500000) * 0.30;
  }

  // 87A rebate if taxable income is within rebate limit
  if (taxableIncome <= rebate87ALimit) {
    grossTax = 0;
  }

  // Add Health & Education Cess
  const cessMultiplier = 1 + (cessPercent / 100);
  const totalTaxLiability = Math.round(grossTax * cessMultiplier);
  const netAdvanceTaxPayable = Math.max(0, totalTaxLiability - Number(tdsDeducted));
  const isAdvanceTaxApplicable = netAdvanceTaxPayable >= 10000;

  // 4 Installments
  const q1Due = Math.round(netAdvanceTaxPayable * 0.15);
  const q2Due = Math.round(netAdvanceTaxPayable * 0.45) - q1Due;
  const q3Due = Math.round(netAdvanceTaxPayable * 0.75) - (q1Due + q2Due);
  const q4Due = netAdvanceTaxPayable - (q1Due + q2Due + q3Due);

  const downloadSchedule = () => {
    const lines = [
      '========================================================================',
      '               TRAC CONSULTANT - ADVANCE TAX ESTIMATION SCHEDULE        ',
      `               Financial Year: ${taxRates.financialYear || 'FY 2024-25'} | AY: ${taxRates.assessmentYear || 'AY 2025-26'}                `,
      '========================================================================',
      '',
      `1. Estimated Business / Freelance Profit : Rs. ${Number(businessIncome).toLocaleString('en-IN')}`,
      `2. Other Income (FD / Cap Gains / Rent)  : Rs. ${Number(otherIncome).toLocaleString('en-IN')}`,
      `3. Gross Total Estimated Income          : Rs. ${grossIncome.toLocaleString('en-IN')}`,
      `4. Deductions Claimed                    : Rs. ${(isPresumptive ? 0 : Number(deductions)).toLocaleString('en-IN')}`,
      `5. Net Taxable Income                    : Rs. ${taxableIncome.toLocaleString('en-IN')}`,
      `6. Estimated Gross Income Tax            : Rs. ${Math.round(grossTax).toLocaleString('en-IN')}`,
      `7. Health & Education Cess (${cessPercent}%)         : Rs. ${Math.round(totalTaxLiability - grossTax).toLocaleString('en-IN')}`,
      `8. Total Tax Liability                   : Rs. ${totalTaxLiability.toLocaleString('en-IN')}`,
      `9. Less: TDS / TCS Credits Deducted      : Rs. ${Number(tdsDeducted).toLocaleString('en-IN')}`,
      '------------------------------------------------------------------------',
      `NET ADVANCE TAX PAYABLE                  : Rs. ${netAdvanceTaxPayable.toLocaleString('en-IN')}`,
      `Advance Tax Mandate Status               : ${isAdvanceTaxApplicable ? 'APPLICABLE (Tax >= Rs. 10,000)' : 'EXEMPT (Tax < Rs. 10,000)'}`,
      '------------------------------------------------------------------------',
      '',
      'PAYMENT DUE DATES & BREAKDOWN:',
      ...(isPresumptive ? [
        `* 100% on or before 15 March: Rs. ${netAdvanceTaxPayable.toLocaleString('en-IN')} (Eligible under Sec 44AD/44ADA)`
      ] : [
        `* 1st Installment (15 June)  - 15% : Rs. ${q1Due.toLocaleString('en-IN')}`,
        `* 2nd Installment (15 Sept)  - 45% : Rs. ${q2Due.toLocaleString('en-IN')} (Cumulative: Rs. ${(q1Due + q2Due).toLocaleString('en-IN')})`,
        `* 3rd Installment (15 Dec)   - 75% : Rs. ${q3Due.toLocaleString('en-IN')} (Cumulative: Rs. ${(q1Due + q2Due + q3Due).toLocaleString('en-IN')})`,
        `* 4th Installment (15 March) - 100%: Rs. ${q4Due.toLocaleString('en-IN')} (Full Balance)`
      ]),
      '',
      'IMPORTANT COMPLIANCE NOTES:',
      '- Failure to pay installments by due dates attracts Section 234C interest @ 1% per month.',
      '- Failure to pay at least 90% of total tax by 31st March attracts Section 234B interest.',
      '- Payment can be made online at the Income Tax e-Filing portal using Challan ITNS 280 (Major Head 0021, Minor Head 100).',
      '',
      'Generated by Trac Consultant Tax Suite (https://tracconsultant.com)',
      '========================================================================'
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Advance_Tax_Schedule_${(taxRates.financialYear || 'FY2024-25').replace(/\s+/g, '')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-50/70 pb-20">
      {/* Top Header - FinTech Gradient */}
      <div className="bg-gradient-to-b from-[#07152B] via-[#0B1E3B] to-[#0D2447] text-white pt-10 pb-10 sm:pt-12 sm:pb-12 px-4 sm:px-8 border-b border-[#143258] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2 border border-emerald-500/30">
              <Calendar className="w-3.5 h-3.5" /> Section 208, 234B & 234C
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">Advance Tax Tool</h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Quarterly schedule calculator for Freelancers, Traders, Business Owners & Professionals.
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
          {/* Inputs Column */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-4">
            <h2 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
              Estimated Income & Taxes Paid
            </h2>

            {/* Business / Professional / Capital Gains */}
            <div>
              <div className="flex justify-between items-center mb-1 text-xs font-semibold text-slate-700">
                <label>Estimated Business / Professional / Freelance Profit:</label>
                <span className="font-mono font-bold text-emerald-700">₹{Number(businessIncome).toLocaleString('en-IN')}</span>
              </div>
              <input
                type="number"
                value={businessIncome}
                onChange={(e) => setBusinessIncome(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Other Income */}
            <div>
              <div className="flex justify-between items-center mb-1 text-xs font-semibold text-slate-700">
                <label>Other Income (FD Interest, Capital Gains, Rental):</label>
                <span className="font-mono font-bold text-slate-700">₹{Number(otherIncome).toLocaleString('en-IN')}</span>
              </div>
              <input
                type="number"
                value={otherIncome}
                onChange={(e) => setOtherIncome(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Deductions */}
            <div>
              <div className="flex justify-between items-center mb-1 text-xs font-semibold text-slate-700">
                <label>Deductions (80C, 80D, etc.):</label>
                <span className="font-mono font-bold text-slate-700">₹{Number(deductions).toLocaleString('en-IN')}</span>
              </div>
              <input
                type="number"
                value={deductions}
                onChange={(e) => setDeductions(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* TDS Deducted */}
            <div>
              <div className="flex justify-between items-center mb-1 text-xs font-semibold text-slate-700">
                <label>TDS / TCS Already Deducted by Clients/Bank:</label>
                <span className="font-mono font-bold text-indigo-700">₹{Number(tdsDeducted).toLocaleString('en-IN')}</span>
              </div>
              <input
                type="number"
                value={tdsDeducted}
                onChange={(e) => setTdsDeducted(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Presumptive taxation toggle */}
            <div className="pt-2">
              <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPresumptive}
                  onChange={(e) => setIsPresumptive(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
                <div className="text-xs">
                  <span className="font-bold text-slate-800">Presumptive Taxation Scheme (Section 44AD / 44ADA)</span>
                  <p className="text-[11px] text-slate-400">Eligible to pay 100% advance tax in a single installment on or before March 15.</p>
                </div>
              </label>
            </div>
          </div>

          {/* Results Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                Advance Tax Liability
              </span>

              <div className="mt-3 pb-4 border-b border-slate-800">
                <div className="text-xs text-slate-400">Net Advance Tax Payable:</div>
                <div className="text-3xl sm:text-4xl font-black text-emerald-400 mt-1">
                  ₹{netAdvanceTaxPayable.toLocaleString('en-IN')}
                </div>

                {!isAdvanceTaxApplicable ? (
                  <div className="mt-2 text-xs text-emerald-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Tax is under ₹10,000. No Advance Tax obligation!</span>
                  </div>
                ) : (
                  <div className="mt-2 text-xs text-amber-300 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <span>Advance Tax applies (Threshold: ₹10,000+).</span>
                  </div>
                )}
              </div>

              {/* Installment Table */}
              <div className="pt-4 space-y-2">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  {isPresumptive ? 'Single Installment (44AD/ADA)' : '4-Quarter Due Dates:'}
                </p>

                {isPresumptive ? (
                  <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-xs flex justify-between items-center">
                    <div>
                      <div className="font-bold text-white">On or before 15 March</div>
                      <div className="text-[10px] text-emerald-300">100% of Advance Tax</div>
                    </div>
                    <div className="font-mono font-bold text-emerald-400 text-sm">
                      ₹{netAdvanceTaxPayable.toLocaleString('en-IN')}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1.5 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700 flex justify-between items-center">
                      <div>
                        <span className="font-semibold text-slate-200">1. On or before 15 June</span>
                        <span className="text-[10px] text-slate-400 ml-2">(15%)</span>
                      </div>
                      <span className="font-mono font-bold text-emerald-400">₹{q1Due.toLocaleString('en-IN')}</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700 flex justify-between items-center">
                      <div>
                        <span className="font-semibold text-slate-200">2. On or before 15 Sept</span>
                        <span className="text-[10px] text-slate-400 ml-2">(Cumulative 45%)</span>
                      </div>
                      <span className="font-mono font-bold text-emerald-400">₹{q2Due.toLocaleString('en-IN')}</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700 flex justify-between items-center">
                      <div>
                        <span className="font-semibold text-slate-200">3. On or before 15 Dec</span>
                        <span className="text-[10px] text-slate-400 ml-2">(Cumulative 75%)</span>
                      </div>
                      <span className="font-mono font-bold text-emerald-400">₹{q3Due.toLocaleString('en-IN')}</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700 flex justify-between items-center">
                      <div>
                        <span className="font-semibold text-slate-200">4. On or before 15 March</span>
                        <span className="text-[10px] text-slate-400 ml-2">(100%)</span>
                      </div>
                      <span className="font-mono font-bold text-emerald-400">₹{q4Due.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Download & Export Schedule */}
              <div className="mt-5 pt-4 border-t border-slate-800 flex gap-2">
                <button
                  type="button"
                  onClick={downloadSchedule}
                  className="flex-1 py-2.5 px-4 bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Schedule (.txt)</span>
                </button>
              </div>
            </div>

            {/* CA Advisory Box */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>Avoid Section 234B & 234C Interest</span>
              </div>
              <p className="text-xs text-slate-500">
                Failing to pay advance tax attracts 1% monthly interest penalties. Our CAs calculate and prepare your direct online challan (ITNS 280) instantly.
              </p>
              <Link
                href="/services/tax-planning"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-center font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-all"
              >
                <span>Get CA Advance Tax Assistance</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

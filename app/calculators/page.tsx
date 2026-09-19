import React from 'react';
import TaxCalculator from '@/components/TaxCalculator';
import Link from 'next/link';
import { Calculator, ArrowRight, ShieldCheck, HelpCircle, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'Free Tax Calculators FY 2024-25 & 2025-26 | Tracconsultant',
  description: 'Compare Old vs New Tax Regime with latest Budget updates (₹75k Standard Deduction, 87A Rebate), calculate HRA Exemption, and compute GST invoices online.'
};

export default function CalculatorsPage() {
  return (
    <div className="py-12 sm:py-16 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
            <Calculator className="w-3.5 h-3.5 text-emerald-600" />
            <span>Updated with Latest Union Budget</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#0B2545] tracking-tight">
            Free Online Tax & GST Calculators
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto">
            Accurately evaluate your income tax liability for FY 2024-25 (AY 2025-26), check your HRA exemption eligibility, and compute GST invoices.
          </p>
        </div>

        {/* Main Interactive Calculators Component */}
        <div className="max-w-5xl mx-auto mb-16">
          <TaxCalculator />
        </div>

        {/* Informative Tax Slabs Guide */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* New Regime Slabs Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-slate-900">New Tax Regime Slabs</h3>
              <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full">Default Regime</span>
            </div>
            <p className="text-xs text-slate-500">
              Under Section 115BAC, includes ₹75,000 standard deduction for salaried individuals and full Section 87A rebate for taxable income up to ₹7,00,000.
            </p>
            <div className="border border-slate-100 rounded-2xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Income Slab</th>
                    <th className="p-3 text-right">Tax Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  <tr><td className="p-3">Up to ₹3,00,000</td><td className="p-3 text-right font-bold text-emerald-700">NIL</td></tr>
                  <tr><td className="p-3">₹3,00,001 – ₹7,00,000</td><td className="p-3 text-right font-bold">5%</td></tr>
                  <tr><td className="p-3">₹7,00,001 – ₹10,00,000</td><td className="p-3 text-right font-bold">10%</td></tr>
                  <tr><td className="p-3">₹10,00,001 – ₹12,00,000</td><td className="p-3 text-right font-bold">15%</td></tr>
                  <tr><td className="p-3">₹12,00,001 – ₹15,00,000</td><td className="p-3 text-right font-bold">20%</td></tr>
                  <tr><td className="p-3">Above ₹15,00,000</td><td className="p-3 text-right font-bold text-red-600">30%</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Old Regime Slabs Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-slate-900">Old Tax Regime Slabs</h3>
              <span className="text-xs font-bold bg-slate-100 text-slate-800 px-2.5 py-1 rounded-full">Deductions Allowed</span>
            </div>
            <p className="text-xs text-slate-500">
              Allows full deduction under Section 80C (₹1.5L), 80D (₹25k-1L), HRA, LTA, and home loan interest (₹2L).
            </p>
            <div className="border border-slate-100 rounded-2xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Income Slab</th>
                    <th className="p-3 text-right">Tax Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  <tr><td className="p-3">Up to ₹2,50,000</td><td className="p-3 text-right font-bold text-emerald-700">NIL</td></tr>
                  <tr><td className="p-3">₹2,50,001 – ₹5,00,000</td><td className="p-3 text-right font-bold">5% (87A Rebate)</td></tr>
                  <tr><td className="p-3">₹5,00,001 – ₹10,00,000</td><td className="p-3 text-right font-bold">20%</td></tr>
                  <tr><td className="p-3">Above ₹10,00,000</td><td className="p-3 text-right font-bold text-red-600">30%</td></tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* CTA Strip */}
        <div className="mt-12 max-w-5xl mx-auto p-8 rounded-3xl bg-[#0B2545] text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div>
            <h3 className="text-xl font-bold">Confused which regime saves you maximum tax?</h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Let our Chartered Accountants evaluate both options with your actual payslips and investment proofs.
            </p>
          </div>
          <Link
            href="/#file-now"
            className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-colors flex-shrink-0"
          >
            File with Personal CA &rarr;
          </Link>
        </div>

      </div>
    </div>
  );
}

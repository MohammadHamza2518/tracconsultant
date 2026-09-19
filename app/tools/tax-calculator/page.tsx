import React from 'react';
import TaxCalculator from '@/components/TaxCalculator';
import Link from 'next/link';
import { Calculator, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export const metadata = {
  title: 'Income Tax Calculator FY 2024-25 & 2025-26 | Tracconsultant',
  description: 'Side-by-side comparison of Old vs New Tax Regime with updated ₹75,000 Standard Deduction and Budget 2024-25 slabs.'
};

export default function TaxCalculatorPage() {
  return (
    <div className="min-h-screen bg-slate-50/70 pb-20">
      {/* Header Banner - FinTech Gradient */}
      <div className="bg-gradient-to-b from-[#07152B] via-[#0B1E3B] to-[#0D2447] text-white pt-10 pb-10 sm:pt-12 sm:pb-12 px-4 sm:px-8 border-b border-[#143258] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2 border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5" /> Budget 2024-25 / 2025-26 Ready
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">Income Tax Calculator</h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Side-by-side Old vs New Tax Regime calculation with dynamic standard deduction & 87A rebate.
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
        <TaxCalculator />
      </div>
    </div>
  );
}

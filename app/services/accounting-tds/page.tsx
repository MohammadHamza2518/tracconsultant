import React from 'react';
import Link from 'next/link';
import { 
  BookOpenCheck, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Phone, 
  MessageCircle, 
  ArrowRight, 
  Calculator, 
  FileSpreadsheet 
} from 'lucide-react';
import FilingWizard from '@/components/FilingWizard';

export const metadata = {
  title: 'Accounting, Bookkeeping, TDS & Tax Audit Services | Tracconsultant',
  description: 'Monthly bookkeeping on Tally/Zoho, quarterly TDS returns (24Q/26Q), Section 44AB Tax Audits, and MCA annual ROC compliance by practicing Chartered Accountants.'
};

const ACCOUNTING_PLANS = [
  {
    name: 'Monthly Bookkeeping Retainer',
    price: 'From ₹1,999/mo',
    turnaround: 'Monthly',
    popular: true,
    desc: 'Full ledger posting, bank reconciliations, and monthly financial statements.',
    features: [
      'Tally Prime, Zoho Books, or QuickBooks maintenance',
      'Bank statement reconciliation & expense categorization',
      'Monthly Profit & Loss, Balance Sheet, and Trial Balance',
      'Accounts receivable & vendor payables aging report',
      'Quarterly CA review meeting'
    ]
  },
  {
    name: 'Quarterly TDS Returns (24Q & 26Q)',
    price: '₹999/qtr',
    turnaround: 'Before 31st',
    desc: 'Mandatory TDS return filing for employee salaries and vendor payments.',
    features: [
      'TDS challan verification on OLTAS',
      'Filing Form 24Q (Salary) & 26Q (Non-salary) on TRACES',
      'Generation of digitally signed Form 16 / 16A certificates',
      'Zero late fee / 234E penalty guarantee',
      'TDS default justification and correction returns'
    ]
  },
  {
    name: 'Tax Audit (Section 44AB)',
    price: 'Custom Quote',
    turnaround: 'Before Sep 30',
    desc: 'Statutory requirement for businesses with turnover exceeding ₹1 Crore (or ₹10 Cr digital) and professionals exceeding ₹50 Lakhs.',
    features: [
      'Form 3CA / 3CB audit report preparation',
      'Comprehensive Form 3CD particulars verification',
      'Inventory valuation, depreciation schedule & disallowances check',
      'Direct sign-off & UDIN generation by practicing CA',
      'Government e-filing upload & verification'
    ]
  },
  {
    name: 'Annual ROC Compliance (AOC-4 & MGT-7)',
    price: '₹4,999',
    turnaround: 'Annual',
    desc: 'Mandatory MCA filings for Private Limited companies and LLPs to avoid ₹100/day penalties.',
    features: [
      'Drafting Board Resolution & AGM minutes',
      'Filing Financial Statements (Form AOC-4)',
      'Filing Annual Return (Form MGT-7 / 7A)',
      'LLP Form 11 & Form 8 compliance',
      'Director KYC (DIR-3 KYC) update'
    ]
  }
];

export default function AccountingTdsPage() {
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-b from-[#0B2545] via-[#07172B] to-[#040e1b] text-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/30">
              Corporate Accounting & Audit Suite
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Stress-Free Bookkeeping, TDS & Corporate Audits
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Focus on growing your core business while Tracconsultant&apos;s financial team manages your day-to-day accounts, vendor TDS, statutory tax audits, and MCA annual compliances.
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <a
                href="#accounting-plans"
                className="px-6 py-3.5 bg-[#00a859] hover:bg-[#008f4c] text-white font-bold text-sm rounded-xl shadow-lg transition-all"
              >
                View Accounting Retainers
              </a>
              <a
                href="tel:+917275922162"
                className="flex items-center gap-2 px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm rounded-xl border border-white/20 transition-all"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>Accounts Helpline: +91 7275922162</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Plans */}
      <section id="accounting-plans" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Financial Management</span>
          <h2 className="text-3xl font-black text-[#0B2545] mt-1">Bookkeeping, TDS & Audit Plans</h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">Full compliance coverage tailored for MSMEs, startups, and growing firms.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ACCOUNTING_PLANS.map((plan, idx) => (
            <div 
              key={idx} 
              className={`bg-white rounded-3xl p-6 sm:p-8 border transition-all flex flex-col justify-between relative shadow-sm hover:shadow-xl ${
                plan.popular ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-200'
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 right-6 bg-emerald-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                  Most Popular
                </span>
              )}

              <div>
                <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                <p className="text-xs text-slate-500 mt-1 min-h-[32px]">{plan.desc}</p>

                <div className="my-5 pb-4 border-b border-slate-100 flex items-baseline justify-between">
                  <div>
                    <span className="text-3xl font-black text-[#0B2545]">{plan.price}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                    <Clock className="w-3 h-3 text-emerald-600" />
                    <span>{plan.turnaround}</span>
                  </div>
                </div>

                <div className="space-y-2.5 mb-6">
                  {plan.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2 text-xs text-slate-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <Link
                  href={`/pay?plan=${encodeURIComponent(plan.name)}&price=${plan.price.replace(/[^0-9]/g, '')}`}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-[#0B2545] hover:bg-[#133b6b] text-white text-xs font-bold rounded-xl transition-colors shadow-md"
                >
                  <span>Book This Service</span>
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                </Link>

                <a
                  href={`https://wa.me/917275922162?text=${encodeURIComponent(`Hello Tracconsultant! I am interested in: ${plan.name}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-1.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-xl transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Discuss with CA on WhatsApp</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Submission Form */}
      <section className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-black text-[#0B2545]">Request Accounting & Audit Consultation</h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">Get an assessment of your books and customized monthly retainer quote.</p>
        </div>
        <FilingWizard initialService="Accounting & TDS" />
      </section>
    </div>
  );
}

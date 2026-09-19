import React from 'react';
import Link from 'next/link';
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  HelpCircle, 
  ArrowRight, 
  Phone, 
  MessageCircle, 
  Upload, 
  TrendingUp, 
  Award,
  Sparkles
} from 'lucide-react';
import FilingWizard from '@/components/FilingWizard';

export const metadata = {
  title: 'Income Tax Return (ITR) Filing Online AY 2025-26 | Tracconsultant',
  description: 'Expert CA-assisted ITR filing for salaried, multiple Form 16, capital gains, crypto, business & NRIs. 100% Notice Protection & Maximum Refund Guarantee.'
};

const ITR_PLANS = [
  {
    name: 'Salaried Basic (ITR-1)',
    price: '₹499',
    popular: true,
    turnaround: '24 Hours',
    description: 'For individuals with single Form 16, interest income, and one house property.',
    features: [
      'Form 16 & AIS/TIS Reconciliation',
      'New ₹75,000 Standard Deduction applied',
      'Section 87A rebate optimization up to ₹7.75L',
      'Govt ITR-V Acknowledgement',
      'Dedicated CA WhatsApp support'
    ]
  },
  {
    name: 'Salaried Multi-Job & HRA',
    price: '₹999',
    turnaround: '24 Hours',
    description: 'Switched jobs, multiple Form 16s, HRA claims, or loss from housing loan.',
    features: [
      'Multi-employer TDS & 26AS alignment',
      'HRA rent receipts & landlord PAN verification',
      'Section 80C, 80D, 80E, 80TTA deductions',
      'Loss adjustment from house property',
      'Direct call with senior CA'
    ]
  },
  {
    name: 'Capital Gains & Crypto (ITR-2)',
    price: '₹1,999',
    turnaround: '24-48 Hours',
    description: 'Trading in stocks, mutual funds, F&O, crypto/VDA, or sale of real estate.',
    features: [
      'Zerodha, Groww, AngelOne P&L statement import',
      'STCG (20%) & LTCG (12.5%) computation',
      'Set-off & carry-forward of trading losses (8 yrs)',
      'Section 54/54EC real estate capital gain exemption',
      'Crypto 30% flat tax calculation & TDS matching'
    ]
  },
  {
    name: 'Business & Freelancers (ITR-3/4)',
    price: '₹2,499',
    turnaround: '48 Hours',
    description: 'Proprietorships, consultants, doctors, lawyers, and tech freelancers.',
    features: [
      'Section 44ADA (50% profit) presumptive filing',
      'Section 44AD presumptive business scheme',
      'P&L statement & Balance sheet drafting',
      'GST sales turnover cross-reconciliation',
      'Advance tax estimation & filing'
    ]
  },
  {
    name: 'NRI & Foreign Assets Filing',
    price: '₹3,999',
    turnaround: '48-72 Hours',
    description: 'NRIs, foreign income, US stocks, ESOPs, and DTAA tax relief.',
    features: [
      'Schedule FA foreign assets disclosure',
      'DTAA Section 90/91 foreign tax credit relief',
      'NRE / NRO bank interest taxation',
      'FBAR / FATCA compliant filings',
      'Senior Cross-Border CA consultation'
    ]
  }
];

const DOCUMENTS_CHECKLIST = [
  { name: 'Form 16 (Part A & B)', desc: 'Issued by current and previous employer(s)' },
  { name: 'Annual Information Statement (AIS / TIS)', desc: 'We can also auto-fetch this with your PAN' },
  { name: 'Bank Account Statements', desc: 'All active savings/current accounts for interest income' },
  { name: 'Capital Gains P&L Statements', desc: 'From Zerodha, Groww, Upstox, CAMS, or KFintech' },
  { name: 'Rent Receipts & Landlord PAN', desc: 'If claiming HRA exemption exceeding ₹1 Lakh' },
  { name: 'Home Loan Interest Certificate', desc: 'Issued by your bank/lender for Section 24(b)' }
];

export default function ItrFilingPage() {
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-b from-[#0B2545] via-[#07172B] to-[#040e1b] text-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AY 2025-26 CA-Assisted ITR Service</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              File Your Income Tax Return with 100% Notice Protection
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Never let an automated algorithm guess your deductions. At Tracconsultant, our qualified Chartered Accountants review your Form 16, AIS, and investments to ensure zero errors, zero notices, and maximum refunds.
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <a
                href="#filing-plans"
                className="px-6 py-3.5 bg-[#00a859] hover:bg-[#008f4c] text-white font-bold text-sm rounded-xl shadow-lg transition-all"
              >
                Choose Filing Plan
              </a>
              <a
                href="tel:+917275922162"
                className="flex items-center gap-2 px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm rounded-xl border border-white/20 transition-all"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>Call CA: +91 7275922162</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section id="filing-plans" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Transparent Pricing</span>
          <h2 className="text-3xl font-black text-[#0B2545] mt-1">Select Your ITR Filing Plan</h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">Every plan includes human CA review, max deduction optimization, and free notice defense.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ITR_PLANS.map((plan, idx) => (
            <div 
              key={idx} 
              className={`bg-white rounded-3xl p-6 border transition-all flex flex-col justify-between relative shadow-sm hover:shadow-xl ${
                plan.popular ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-200'
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 right-6 bg-emerald-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                  Most Popular
                </span>
              )}

              <div>
                <h3 className="text-lg font-bold text-slate-900">{plan.name}</h3>
                <p className="text-xs text-slate-500 mt-1 min-h-[32px]">{plan.description}</p>

                <div className="my-5 pb-4 border-b border-slate-100 flex items-baseline justify-between">
                  <div>
                    <span className="text-3xl font-black text-[#0B2545]">{plan.price}</span>
                    <span className="text-xs text-slate-400 ml-1">all-inclusive</span>
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
                  <span>Book & Pay Online</span>
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                </Link>

                <a
                  href={`https://wa.me/917275922162?text=${encodeURIComponent(`Hello Tracconsultant! I want to file under plan: ${plan.name}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-1.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-xl transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Discuss on WhatsApp</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Documents Needed Checklist */}
      <section className="py-16 bg-white border-t border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Document Preparation</span>
            <h2 className="text-3xl font-black text-[#0B2545] mt-1">What Documents Do You Need?</h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              You can simply upload PDFs or take photos and send them directly on WhatsApp.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {DOCUMENTS_CHECKLIST.map((doc, idx) => (
              <div key={idx} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                  <div className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs">
                    {idx + 1}
                  </div>
                  <span>{doc.name}</span>
                </div>
                <p className="text-xs text-slate-500 pl-8">{doc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Embedded Filing Form */}
      <section className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-black text-[#0B2545]">Ready to File? Submit Your File Online</h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">Get an instant Tracking ID and your CA will reach out within 15 minutes.</p>
        </div>
        <FilingWizard initialService="ITR Filing" />
      </section>
    </div>
  );
}

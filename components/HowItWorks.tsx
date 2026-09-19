import React from 'react';
import { UploadCloud, FileSpreadsheet, CheckCheck, Award, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const STEPS = [
  {
    step: '01',
    title: 'Submit Details & Upload Docs',
    desc: 'Take 2 minutes to select your plan and upload your Form 16, Bank statement, or Notice PDF.',
    icon: UploadCloud,
    badge: 'Quick & Secure'
  },
  {
    step: '02',
    title: 'CA Reconciles & Prepares Draft',
    desc: 'Your personal Chartered Accountant cross-checks AIS, TIS, 26AS, and maximizes all eligible deductions.',
    icon: FileSpreadsheet,
    badge: '100% Notice Free'
  },
  {
    step: '03',
    title: 'Approve Tax Computation',
    desc: 'We share the tax draft and refund calculation with you on WhatsApp or call for your final review.',
    icon: CheckCheck,
    badge: 'Transparent Review'
  },
  {
    step: '04',
    title: 'Instant E-Filing & ITR-V',
    desc: 'Return is submitted to the Govt IT Department. ITR-V and tax computation memo delivered instantly.',
    icon: Award,
    badge: 'Filed in 24 Hrs'
  }
];

export default function HowItWorks() {
  return (
    <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#00a859_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
            <span>Simple 4-Step Process</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            How It Works
          </h2>
          <p className="text-sm sm:text-base text-slate-300">
            We have stripped out all the legal jargon and complexity. Filing your taxes with a real Chartered Accountant is now as easy as sending a WhatsApp message.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {STEPS.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div 
                key={idx} 
                className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 relative flex flex-col justify-between hover:border-emerald-500/50 transition-all hover:shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl font-black text-emerald-400/30 font-mono">{s.step}</span>
                    <span className="text-xs font-bold px-2.5 py-1 bg-emerald-500/10 text-emerald-300 rounded-full border border-emerald-500/20">
                      {s.badge}
                    </span>
                  </div>

                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2">{s.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{s.desc}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-700/60 text-xs text-emerald-400 font-medium">
                  {idx === 0 && '⚡ Zero physical visit required'}
                  {idx === 1 && '🛡️ Cross-checked with Income Tax API'}
                  {idx === 2 && '💬 Instant WhatsApp communication'}
                  {idx === 3 && '📄 Official Government ITR-V delivered'}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="#file-now"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#00a859] hover:bg-[#008f4c] text-white rounded-xl font-bold text-sm shadow-xl shadow-emerald-500/30 transition-all cursor-pointer"
          >
            <span>Start Your Filing Now</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}

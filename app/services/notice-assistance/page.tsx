import React from 'react';
import Link from 'next/link';
import { 
  AlertTriangle, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Phone, 
  MessageCircle, 
  ArrowRight, 
  FileWarning, 
  Scale, 
  Lock 
} from 'lucide-react';
import FilingWizard from '@/components/FilingWizard';

export const metadata = {
  title: 'Income Tax Notice Scrutiny & Appeal Assistance | Tracconsultant',
  description: 'Received Notice 143(1), 139(9) Defective, 148 Reassessment, or Tax Demand? Get immediate legal CA response drafting and penalty protection.'
};

const NOTICE_TYPES = [
  {
    code: 'Section 143(1)',
    title: 'Intimation Order / Demand Notice',
    risk: 'High',
    desc: 'Issued when CPC calculates tax mismatch with employer TDS or rejects deductions.',
    solution: 'We examine the calculation sheet, cross-verify Form 26AS/AIS, and submit online response or rectification.',
    fee: '₹999'
  },
  {
    code: 'Section 139(9)',
    title: 'Defective Return Notice',
    risk: 'Critical (15 Days limit)',
    desc: 'Issued due to missing schedules, incorrect balance sheet figures, or schema validation failures.',
    solution: 'We identify the specific defect, prepare the revised computation, and file a corrected response within 15 days.',
    fee: '₹1,499'
  },
  {
    code: 'Section 148 / 148A',
    title: 'Income Escaping Assessment (Scrutiny)',
    risk: 'Severe',
    desc: 'Issued when the department suspects unexplained bank deposits, cash transactions, or high-value property sales.',
    solution: 'Senior Tax Advocate drafts formal objections under 148A(b), reconciles cash-flows, and represents your case.',
    fee: '₹4,999'
  },
  {
    code: 'Section 154',
    title: 'Rectification Application',
    risk: 'Moderate',
    desc: 'For claiming excess tax refunds stuck with the department due to clerical or portal processing errors.',
    solution: 'We lodge a formal rectification petition on the IT portal with documentary evidence to release pending refunds.',
    fee: '₹1,299'
  }
];

export default function NoticeAssistancePage() {
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-b from-amber-950 via-[#0B2545] to-[#040e1b] text-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Emergency Tax Scrutiny Cell</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Received an Income Tax Notice? Don&apos;t Panic.
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Our Senior Chartered Accountants and Tax Advocates draft solid legal replies to CPC intimations, defective returns, and scrutiny notices to safeguard you from heavy penalties.
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <a
                href="https://wa.me/917275922162?text=Hello%20Tracconsultant!%20I%20have%20an%20urgent%20Income%20Tax%20Notice.%20Need%20immediate%20review."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm rounded-xl shadow-lg transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Send Notice on WhatsApp (7275922162)</span>
              </a>

              <a
                href="tel:+917275922162"
                className="flex items-center gap-2 px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm rounded-xl border border-white/20 transition-all"
              >
                <Phone className="w-4 h-4 text-amber-400" />
                <span>Urgent Helpline: 7275922162</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Notice Types Breakdown */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">Notice Categories</span>
          <h2 className="text-3xl font-black text-[#0B2545] mt-1">Common Notices Handled by Our Legal Team</h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Every notice has a strict response deadline (typically 15 to 30 days). Act immediately to avoid bank attachment or ex-parte demand orders.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {NOTICE_TYPES.map((item, idx) => (
            <div key={idx} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-all space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm font-black text-amber-600 bg-amber-50 px-3 py-1 rounded-lg border border-amber-200">
                  {item.code}
                </span>
                <span className="text-xs font-bold text-red-600 bg-red-50 px-2.5 py-0.5 rounded-full">
                  Risk: {item.risk}
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 space-y-1">
                <strong className="text-emerald-800 font-semibold block">Our Defense Action:</strong>
                <p>{item.solution}</p>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                <div>
                  <span className="text-xl font-black text-[#0B2545]">{item.fee}</span>
                  <span className="text-xs text-slate-400 ml-1">all-inclusive</span>
                </div>
                <Link
                  href={`/pay?plan=${encodeURIComponent('Notice Defense - ' + item.code)}&price=${item.fee.replace(/[^0-9]/g, '')}`}
                  className="px-5 py-2.5 bg-[#0B2545] hover:bg-[#133b6b] text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
                >
                  Hire CA Defense
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-black text-[#0B2545]">Submit Your Notice for Free Initial Evaluation</h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">Our Senior CA team will analyze the demand within 30 minutes.</p>
        </div>
        <FilingWizard initialService="Notice Assistance" />
      </section>
    </div>
  );
}

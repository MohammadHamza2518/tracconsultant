import React from 'react';
import { Check, X, ShieldCheck, Zap, Award, PhoneCall } from 'lucide-react';
import Link from 'next/link';

const COMPARISON_ROWS = [
  {
    feature: 'Dedicated CA on Direct WhatsApp & Call',
    trac: 'Yes, Direct Mobile (7275922162)',
    taxbuddy: 'Generic chatbot / ticket queue',
    localCA: 'Must visit office / slow replies',
    highlight: true
  },
  {
    feature: 'Turnaround Time for Salaried & Capital Gains',
    trac: 'Guaranteed 24 Hours',
    taxbuddy: '3 to 5 Working Days',
    localCA: '1 to 2 Weeks',
    highlight: true
  },
  {
    feature: '100% Notice Protection & Defense',
    trac: 'Included Free with Senior CA',
    taxbuddy: 'Expensive Add-on Subscription',
    localCA: 'High Hourly Billing (₹2,500+)',
    highlight: true
  },
  {
    feature: 'Live Application Tracking (By Mobile / ID)',
    trac: 'Yes, Real-Time Online Portal',
    taxbuddy: 'Basic Dashboard',
    localCA: 'None (Repeated Phone Calls)',
    highlight: false
  },
  {
    feature: 'AIS / TIS & Form 26AS Multi-Source Match',
    trac: 'Triple-Verification by Human CA',
    taxbuddy: 'Automated Bot Extraction',
    localCA: 'Manual & Error Prone',
    highlight: false
  },
  {
    feature: 'Maximum Refund Guarantee (80C, 80D, HRA)',
    trac: 'Guaranteed Deep Optimization',
    taxbuddy: 'Basic automated deductions',
    localCA: 'Depends on individual skill',
    highlight: true
  },
  {
    feature: 'Pricing Transparency',
    trac: '100% Flat & All-Inclusive',
    taxbuddy: 'Frequent upsells & add-ons',
    localCA: 'Arbitrary & Unpredictable',
    highlight: false
  }
];

export default function ComparisonTable() {
  return (
    <section id="comparison" className="py-20 bg-white border-t border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
            <Award className="w-3.5 h-3.5 text-emerald-600" />
            <span>Market Leadership</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B2545] tracking-tight">
            Why Choose Tracconsultant Over Others?
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Big automated platforms rely on robotic algorithms that trigger notices. Traditional CAs are slow and costly. We give you the best of both worlds: modern technology with personal human CA touch.
          </p>
        </div>

        {/* Comparison Table Card */}
        <div className="overflow-x-auto rounded-3xl border border-slate-200 shadow-xl bg-white">
          <table className="w-full text-left border-collapse min-w-[650px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="py-5 px-6 text-sm font-bold text-slate-900 w-2/5">
                  Key Deliverables
                </th>
                <th className="py-4 px-6 text-sm font-black text-white bg-[#0B2545] w-1/4 rounded-t-2xl shadow-lg align-top">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                    <span>Tracconsultant</span>
                  </div>
                  <div className="mt-1.5">
                    <span className="inline-block text-xs text-emerald-300 font-bold tracking-wider uppercase bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                      Our Promise
                    </span>
                  </div>
                </th>
                <th className="py-5 px-6 text-xs sm:text-sm font-semibold text-slate-600 w-1/5">
                  TaxBuddy / Cleartax
                </th>
                <th className="py-5 px-6 text-xs sm:text-sm font-semibold text-slate-600 w-1/5">
                  Traditional Local CA
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
              {COMPARISON_ROWS.map((row, idx) => (
                <tr key={idx} className={`min-h-[56px] ${row.highlight ? 'bg-emerald-50/20' : 'hover:bg-slate-50/50'}`}>
                  <td className="py-4 px-6 font-semibold text-slate-800 align-middle">
                    {row.feature}
                  </td>
                  <td className="py-4 px-6 font-bold text-emerald-800 bg-emerald-50/50 border-l border-r border-emerald-100 align-middle">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>{row.trac}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-slate-600 align-middle">
                    {row.taxbuddy}
                  </td>
                  <td className="py-4 px-6 text-slate-600 align-middle">
                    {row.localCA}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 text-center flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="#file-now"
            className="w-full sm:w-auto px-8 py-3.5 bg-[#00a859] hover:bg-[#008f4c] text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
          >
            Experience the Tracconsultant Advantage &rarr;
          </Link>
          <a
            href="tel:+917275922162"
            className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-900 font-bold text-sm rounded-xl border-2 border-slate-300 hover:border-slate-400 shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2"
          >
            <PhoneCall className="w-4 h-4 text-emerald-600" />
            <span>Speak with Lead CA: +91 7275922162</span>
          </a>
        </div>

      </div>
    </section>
  );
}

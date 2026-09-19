import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Users, 
  Award, 
  TrendingUp, 
  Phone, 
  Mail, 
  CheckCircle2, 
  Building, 
  FileText, 
  Lock, 
  ArrowRight 
} from 'lucide-react';

export const metadata = {
  title: 'About Us | Tracconsultant Tax Filing, Compliance & Business Support',
  description: 'Learn about Tracconsultant, India’s leading CA-assisted tax consultancy network. Trusted by 15,000+ taxpayers, freelancers, and businesses across India.'
};

const VALUES = [
  {
    title: 'Human CA Touch Over Robotic Bots',
    desc: 'Automated algorithms miss nuanced deductions like HRA, 80D parents health cover, and loss carry-forward. Every file at Tracconsultant is personally crafted by a qualified CA.',
    icon: Users
  },
  {
    title: '100% Notice Defense Guarantee',
    desc: 'We stand behind our computations. If any intimation or scrutiny notice is received from the IT Department on a return we filed, our senior CA will defend it at zero extra cost.',
    icon: ShieldCheck
  },
  {
    title: 'Bank-Grade Data Confidentiality',
    desc: 'Your PAN, Aadhaar, salary slips, and financial balance sheets are protected with 256-bit AES encryption. We never share or sell client data to third parties.',
    icon: Lock
  },
  {
    title: 'Speed & Transparent Turnaround',
    desc: 'We know tax deadlines create anxiety. That is why our team guarantees 24-hour turnaround on salaried filings and direct WhatsApp access to your assigned CA.',
    icon: Award
  }
];

export default function AboutPage() {
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-b from-[#0B2545] via-[#07172B] to-[#040e1b] text-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/30">
              About Tracconsultant
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Pioneering Modern Tax Advisory & Corporate Compliance
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              <strong>Tracconsultant</strong> was founded with a singular mission: to liberate taxpayers, freelancers, and business owners from the stress of tax notices, complex legal jargon, and exorbitant local consultancy fees.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl sm:text-4xl font-black text-[#0B2545]">15,000+</div>
            <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mt-1">Returns Filed</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-emerald-600">₹4.5 Cr+</div>
            <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mt-1">Tax Refunds Claimed</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-[#0B2545]">99.8%</div>
            <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mt-1">Accuracy Ratio</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-emerald-600">24 Hours</div>
            <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mt-1">Average Turnaround</div>
          </div>
        </div>
      </section>

      {/* Story & Philosophy */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-5">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Our Vision</span>
            <h2 className="text-3xl font-black text-[#0B2545] tracking-tight">
              Why We Built Tracconsultant to Be Better Than Traditional Bots
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              When automated DIY tax platforms emerged in India, taxpayers initially celebrated the speed. But within 2-3 years, a surge of demand notices (Section 143(1) and 139(9)) hit millions of individuals because bots could not understand complex salary restructurings, multi-employer TDS mismatches, or capital gain set-offs.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              At <strong>Tracconsultant</strong>, we solved this by blending <em>smart modern workflows</em> with <em>human Chartered Accountant precision</em>. You get the convenience of uploading documents from your phone or WhatsApp, combined with the safety of a senior CA double-checking every single line before submitting to the Government of India.
            </p>

            <div className="pt-2 flex items-center gap-4">
              <Link
                href="/#file-now"
                className="px-6 py-3 bg-[#00a859] hover:bg-[#008f4c] text-white font-bold text-xs rounded-xl shadow-md transition-colors"
              >
                Start Filing with Us &rarr;
              </Link>
              <Link
                href="/contact"
                className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl transition-colors"
              >
                Contact Our Team
              </Link>
            </div>
          </div>

          <div className="relative bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-4">
            <div className="relative h-20 w-64 mx-auto mb-4">
              <Image 
                src="/logo-banner-light.png" 
                alt="Tracconsultant" 
                fill 
                className="object-contain"
              />
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs text-slate-700">
              <div className="font-bold text-slate-900 text-sm">Tracconsultant Advisory Network</div>
              <p>Corporate Office: Lucknow, Uttar Pradesh & Pan-India Virtual CA Network</p>
              <p>Helplines: <strong>+91 7275922162</strong> | <strong>+91 8052171196</strong></p>
              <p>Official Email: <strong>contact@tracconsultant.com</strong></p>
              <p>Specialization: <em>Income Tax Filing, GST Compliance, Notice Scrutiny, Startup Incorporation</em></p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Grid */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Our Guiding Principles</span>
            <h2 className="text-3xl font-black text-[#0B2545] mt-1">What Sets Tracconsultant Apart</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {VALUES.map((val, idx) => {
              const Icon = val.icon;
              return (
                <div key={idx} className="p-8 bg-slate-50 rounded-3xl border border-slate-200 space-y-3 hover:shadow-lg transition-all">
                  <div className="w-12 h-12 rounded-2xl bg-[#0B2545] text-emerald-400 flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{val.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{val.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

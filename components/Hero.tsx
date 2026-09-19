'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Phone, 
  MessageCircle, 
  FileText, 
  TrendingUp, 
  Star, 
  Award, 
  Lock,
  ChevronRight,
  Briefcase,
  AlertTriangle,
  Building,
  Check,
  Headphones,
  Sparkles,
  BadgeCheck,
  Clock
} from 'lucide-react';

const HERO_SERVICES = [
  {
    id: 'salaried',
    name: 'Salaried & Professionals',
    badge: 'ITR-1 / ITR-2',
    icon: FileText,
    price: '₹499',
    tat: '24-Hour Delivery',
    feature: 'Form 16 + New ₹75,000 Standard Deduction + 87A rebate up to ₹7.75L max savings.',
    ctaLink: '#file-now',
    waText: 'Hello Tracconsultant! I want to file my Salaried Income Tax Return (ITR-1).'
  },
  {
    id: 'capital-gains',
    name: 'Stocks, Crypto & F&O',
    badge: 'ITR-2 / ITR-3',
    icon: TrendingUp,
    price: '₹1,999',
    tat: '24-48 Hours',
    feature: 'Direct Zerodha / Groww P&L import, STCG/LTCG set-offs, F&O balance sheets & 30% crypto tax.',
    ctaLink: '#file-now',
    waText: 'Hello Tracconsultant! I have Capital Gains from Stocks/Mutual Funds/Crypto to file.'
  },
  {
    id: 'notice',
    name: 'Notice Resolution',
    badge: 'Section 143(1) / 148',
    icon: AlertTriangle,
    price: '₹999',
    tat: 'Same Day Review',
    feature: 'Official rectification response for defective returns, demand notices & AIS mismatches drafted by Senior CAs.',
    ctaLink: '#file-now',
    waText: 'Hello Tracconsultant! I received an Income Tax Notice 143(1). Need urgent review.'
  },
  {
    id: 'gst',
    name: 'GST Monthly Filing',
    badge: 'GSTR-1 & 3B',
    icon: Briefcase,
    price: '₹799/mo',
    tat: 'Guaranteed by 20th',
    feature: 'Automated GSTR-2B Input Tax Credit reconciliation to ensure maximum credit and zero penalty.',
    ctaLink: '#file-now',
    waText: 'Hello Tracconsultant! Need help with monthly GST returns and GSTR-2B matching.'
  },
  {
    id: 'company',
    name: 'Business Incorporation',
    badge: 'Pvt Ltd / LLP',
    icon: Building,
    price: '₹5,999',
    tat: '7–10 Business Days',
    feature: 'Complete incorporation package: Name approval, MOA/AOA, PAN, TAN, GST, and MSME certificate.',
    ctaLink: '#file-now',
    waText: 'Hello Tracconsultant! I want to incorporate a new Private Limited Company / MSME.'
  }
];

export default function Hero() {
  const [selectedService, setSelectedService] = useState(HERO_SERVICES[0]);

  return (
    <section className="relative bg-gradient-to-b from-slate-50 via-white to-slate-50/80 text-slate-900 pt-8 pb-14 lg:pt-14 lg:pb-20 overflow-hidden border-b border-slate-200/90">
      
      {/* Subtle Institutional Ambient Glow & Delicate Pattern */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[380px] bg-gradient-to-b from-emerald-100/40 via-blue-50/30 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute top-20 right-0 w-[450px] h-[450px] bg-emerald-100/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Institutional Trust Pill */}
        <div className="flex justify-center lg:justify-start mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-xs backdrop-blur-sm">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
            </span>
            <span className="font-bold text-slate-900">AY 2025–26 Tax Filing Active</span>
            <span className="text-slate-300 hidden sm:inline">•</span>
            <span className="text-emerald-700 font-medium hidden sm:inline">New ₹75,000 Standard Deduction Applicable</span>
            <span className="text-slate-300 hidden md:inline">•</span>
            <span className="hidden md:inline-flex items-center gap-1 text-slate-500 font-normal">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              ICAI Compliant
            </span>
          </div>
        </div>

        {/* Main 2-Column Corporate Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Column: Authoritative Copy & Segment Selector */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-md border border-emerald-200/80">
                <BadgeCheck className="w-3.5 h-3.5 text-emerald-600" />
                Senior Chartered Accountant Advisory
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-[50px] font-black tracking-tight text-[#0B2545] leading-[1.14]">
                India&apos;s Trusted CA Firm For{' '}
                <span className="text-emerald-600">
                  Tax Filing & Corporate Advisory.
                </span>
              </h1>

              <p className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
                Zero Notice Anxiety. Maximum Legal Refund.
              </p>
            </div>

            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Don&apos;t risk algorithmic DIY portals that miscalculate AIS deductions and trigger scrutiny notices. At <strong className="text-slate-900 font-bold">Tracconsultant</strong>, your return is manually prepared, verified, and filed by qualified Chartered Accountants with <strong className="text-slate-900 font-bold">100% Notice Protection</strong> and maximum legal refund guarantee.
            </p>

            {/* Value Guarantees Row */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-semibold text-slate-700 pt-1">
              <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>100% Notice Protection</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-2xs">
                <Clock className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Guaranteed 24-Hour Filing</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-2xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Double-Checked by Practicing CAs</span>
              </div>
            </div>

            {/* Segment Selector - Clean Financial Segmented Tabs */}
            <div className="pt-2 space-y-3">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center justify-center lg:justify-start gap-2">
                <span>Select Your Filing Category:</span>
              </div>

              {/* Service Tab Pills */}
              <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                {HERO_SERVICES.map((srv) => {
                  const Icon = srv.icon;
                  const isActive = selectedService.id === srv.id;
                  return (
                    <button
                      key={srv.id}
                      type="button"
                      onClick={() => setSelectedService(srv)}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#0B2545] text-white font-bold shadow-md shadow-slate-900/10 ring-2 ring-emerald-500/50'
                          : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-2xs'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                      <span>{srv.name}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                        isActive ? 'bg-white/20 text-emerald-300' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {srv.badge}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Selected Service Dynamic Snapshot Bar */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-md shadow-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#0B2545]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>{selectedService.name} ({selectedService.badge})</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full text-[11px] font-semibold border border-emerald-200/60">
                      {selectedService.tat}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2 sm:line-clamp-1">
                    {selectedService.feature}
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 flex-shrink-0">
                  <div className="text-left sm:text-right">
                    <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Starting At</div>
                    <div className="text-lg font-black text-[#0B2545]">{selectedService.price}</div>
                  </div>
                  <a
                    href="#file-now"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all hover:shadow-emerald-600/20"
                  >
                    Start Filing
                  </a>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                href="#file-now"
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-3.5 bg-[#00a859] hover:bg-[#008f4c] text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/30 transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Submit Details in 30 Seconds</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href={`https://wa.me/917275922162?text=${encodeURIComponent(selectedService.waText)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 hover:border-slate-400 rounded-xl font-semibold text-xs sm:text-sm transition-all shadow-2xs"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>Consult Senior CA on WhatsApp</span>
              </a>
            </div>

            {/* Trust Metrics Strip */}
            <div className="pt-6 border-t border-slate-200 grid grid-cols-3 gap-4 text-center lg:text-left">
              <div>
                <div className="text-2xl sm:text-3xl font-black text-[#0B2545]">15,000+</div>
                <div className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider mt-0.5">Returns Filed</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-600">₹4.5 Cr+</div>
                <div className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider mt-0.5">Tax Saved for Clients</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-[#0B2545] flex items-center justify-center lg:justify-start gap-1">
                  <span>4.9</span>
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                </div>
                <div className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider mt-0.5">Client Rating (ICAI Compliant)</div>
              </div>
            </div>

          </div>

          {/* Right Column: Executive CA Advisory Dossier Card (Pristine Light Theme) */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-xl shadow-slate-200/70 space-y-5">
              
              {/* Header: Verified Institutional Advisory Panel */}
              <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-11 h-11 rounded-xl bg-slate-50 border border-slate-200 p-1 flex items-center justify-center shrink-0 shadow-2xs">
                    <Image 
                      src="/logo.png" 
                      alt="Tracconsultant CA Emblem" 
                      width={36} 
                      height={36} 
                      className="object-contain" 
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm text-[#0B2545] flex items-center gap-1.5 truncate">
                      <span>Senior CA Panel</span>
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium truncate">
                      ICAI Standards • Notice Proof
                    </p>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold whitespace-nowrap">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  <span>Live Desk</span>
                </div>
              </div>

              {/* Tax Savings Metric Box */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50/70 to-teal-50/40 border border-emerald-200/70 flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Average Tax Saved Per Return</div>
                  <div className="text-2xl sm:text-3xl font-black text-[#0B2545] mt-0.5">₹34,800</div>
                  <div className="text-[11px] text-emerald-800 font-semibold mt-0.5">Via AIS/TIS reconciliations & Chapter VI-A</div>
                </div>
                <div className="w-11 h-11 rounded-xl bg-white border border-emerald-200 shadow-2xs flex items-center justify-center text-emerald-600">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>

              {/* 3-Step Professional Workflow */}
              <div className="space-y-2.5">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  How Your Taxes Are Handled:
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                    <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                      1
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">Secure Document Upload</div>
                      <div className="text-[11px] text-slate-500">Form 16, AIS, or Bank Statements uploaded to encrypted vault.</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                    <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                      2
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">Senior CA Manual Computation</div>
                      <div className="text-[11px] text-slate-500">Chartered Accountant calculates Old vs New regime for maximum refund.</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                    <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                      3
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">Approval & Guaranteed E-Filing</div>
                      <div className="text-[11px] text-slate-500">Draft reviewed with you on WhatsApp prior to portal upload and ITR-V ack.</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1 border-t border-slate-100">
                <a
                  href="https://wa.me/917275922162?text=Hello%20Tracconsultant%20Senior%20CA%20Desk!%20I%20would%20like%20to%20consult%20regarding%20my%20tax%20filing."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold rounded-xl shadow-sm transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Direct WhatsApp CA Consultation (+91 7275922162)</span>
                </a>

                <div className="flex items-center justify-between text-xs text-slate-500 px-1 pt-1">
                  <span className="flex items-center gap-1">
                    <Headphones className="w-3.5 h-3.5 text-slate-400" />
                    <span>Direct Helpline:</span>
                  </span>
                  <a href="tel:+918052171196" className="text-emerald-700 font-bold hover:underline">
                    +91 8052171196
                  </a>
                </div>
              </div>

              {/* Security Badge */}
              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 pt-1">
                <Lock className="w-3.5 h-3.5 text-emerald-600" />
                <span>256-Bit Bank-Grade Encryption • Zero Data Sharing</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

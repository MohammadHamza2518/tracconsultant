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
  Headphones
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
    <section className="relative bg-[#071324] text-white pt-10 pb-16 lg:pt-16 lg:pb-24 overflow-hidden border-b border-slate-800">
      
      {/* Subtle Professional Ambient Gradients (No gaming grid lines) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-b from-blue-600/10 via-emerald-600/5 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute top-20 right-0 w-[450px] h-[450px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Institutional Badge */}
        <div className="flex justify-center lg:justify-start mb-6">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/80 text-xs font-medium text-slate-200 shadow-sm backdrop-blur-md">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="font-semibold text-white">AY 2025–26 Tax Filing Active</span>
            <span className="text-slate-500 hidden sm:inline">•</span>
            <span className="text-emerald-400 hidden sm:inline">New ₹75,000 Standard Deduction Applicable</span>
          </div>
        </div>

        {/* Main 2-Column Corporate Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Authoritative Copy & Segment Selector */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            <h1 className="text-3xl sm:text-5xl lg:text-[52px] font-extrabold tracking-tight text-white leading-[1.12]">
              Expert CA-Assisted <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200">
                Tax Filing & Corporate Advisory
              </span>
              <br />
              <span className="text-slate-100">Zero Notice Anxiety.</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Don&apos;t risk algorithmic DIY tax portals that miscalculate AIS deductions and trigger scrutiny notices. At <strong>Tracconsultant</strong>, your return is manually prepared, double-checked, and filed by qualified Chartered Accountants with <strong>100% Notice Protection</strong> and maximum legal refund guarantee.
            </p>

            {/* Segment Selector - Sleek Financial Tabs */}
            <div className="pt-2 space-y-3">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-center lg:justify-start gap-2">
                <span>Select Your Filing Category:</span>
              </div>

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
                          ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20 ring-2 ring-emerald-400/50'
                          : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{srv.name}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                        isActive ? 'bg-slate-950 text-emerald-300' : 'bg-slate-700 text-slate-300'
                      }`}>
                        {srv.badge}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Service Feature Snapshot Bar */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-700/80 backdrop-blur-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left shadow-lg">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>{selectedService.name} ({selectedService.badge}) • {selectedService.tat}</span>
                  </div>
                  <p className="text-xs text-slate-300 line-clamp-2 sm:line-clamp-1">
                    {selectedService.feature}
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800 flex-shrink-0">
                  <div className="text-left sm:text-right">
                    <div className="text-[10px] text-slate-400 uppercase font-medium">Starting At</div>
                    <div className="text-lg font-black text-white">{selectedService.price}</div>
                  </div>
                  <a
                    href="#file-now"
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all hover:shadow-emerald-500/20"
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
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-7 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-xl font-bold text-sm shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Submit Details in 30 Seconds</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href={`https://wa.me/917275922162?text=${encodeURIComponent(selectedService.waText)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3.5 bg-slate-800 hover:bg-slate-750 text-white border border-slate-700 rounded-xl font-semibold text-xs sm:text-sm transition-all shadow-sm hover:border-slate-600"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>Consult Senior CA on WhatsApp</span>
              </a>
            </div>

            {/* Trust Metrics Strip */}
            <div className="pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-4 text-center lg:text-left">
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white">15,000+</div>
                <div className="text-[11px] text-slate-400 font-medium uppercase tracking-wider mt-0.5">Returns Filed</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">₹4.5 Cr+</div>
                <div className="text-[11px] text-slate-400 font-medium uppercase tracking-wider mt-0.5">Tax Saved for Clients</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white flex items-center justify-center lg:justify-start gap-1">
                  <span>4.9</span>
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                </div>
                <div className="text-[11px] text-slate-400 font-medium uppercase tracking-wider mt-0.5">Client Rating (ICAI Compliant)</div>
              </div>
            </div>

          </div>

          {/* Right Column: Executive CA Advisory Dossier Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6">
              
              {/* Header: Verified Institutional Advisory Panel */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-2xl bg-slate-950 border border-emerald-500/40 p-1.5 flex items-center justify-center shadow-inner">
                    <Image 
                      src="/logo.png" 
                      alt="Tracconsultant Official Emblem" 
                      width={40} 
                      height={40} 
                      className="object-contain" 
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                      <span>Senior Chartered Accountant Panel</span>
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    </h3>
                    <p className="text-[11px] text-slate-400 font-medium">ICAI Standards • 100% Notice Protection</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Active Desk</span>
                </div>
              </div>

              {/* Tax Savings Metric Box */}
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Average Tax Saved Per Return</div>
                  <div className="text-2xl sm:text-3xl font-black text-white mt-0.5">₹34,800</div>
                  <div className="text-[11px] text-emerald-400 font-medium mt-0.5">Via AIS/TIS reconciliations & Chapter VI-A</div>
                </div>
                <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>

              {/* 3-Step Professional Workflow */}
              <div className="space-y-2.5">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  How Your Taxes Are Handled:
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/50 border border-slate-800">
                    <div className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                      1
                    </div>
                    <div>
                      <div className="font-semibold text-slate-200">Secure Document Upload</div>
                      <div className="text-[11px] text-slate-400">Form 16, AIS, or Bank Statements uploaded to encrypted vault.</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/50 border border-slate-800">
                    <div className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                      2
                    </div>
                    <div>
                      <div className="font-semibold text-slate-200">Senior CA Manual Computation</div>
                      <div className="text-[11px] text-slate-400">Chartered Accountant calculates Old vs New regime for maximum refund.</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/50 border border-slate-800">
                    <div className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                      3
                    </div>
                    <div>
                      <div className="font-semibold text-slate-200">Approval & Guaranteed E-Filing</div>
                      <div className="text-[11px] text-slate-400">Draft reviewed with you on WhatsApp prior to portal upload and ITR-V ack.</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1 border-t border-slate-800">
                <a
                  href="https://wa.me/917275922162?text=Hello%20Tracconsultant%20Senior%20CA%20Desk!%20I%20would%20like%20to%20consult%20regarding%20my%20tax%20filing."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold rounded-xl shadow-md transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Direct WhatsApp CA Consultation (+91 7275922162)</span>
                </a>

                <div className="flex items-center justify-between text-xs text-slate-400 px-1 pt-1">
                  <span className="flex items-center gap-1">
                    <Headphones className="w-3.5 h-3.5 text-slate-400" />
                    <span>Direct Helpline:</span>
                  </span>
                  <a href="tel:+918052171196" className="text-emerald-400 font-bold hover:underline">
                    +91 8052171196
                  </a>
                </div>
              </div>

              {/* Security Badge */}
              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 pt-1">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>256-Bit Bank-Grade Encryption • Zero Data Sharing</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

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
  Zap, 
  Award, 
  Sparkles, 
  Clock, 
  Lock,
  ChevronRight,
  Briefcase,
  AlertTriangle,
  Building
} from 'lucide-react';

const HERO_TABS = [
  {
    id: 'salaried',
    name: 'Salaried ITR',
    tag: 'Popular',
    icon: FileText,
    price: '₹499',
    turnaround: '24 Hours',
    highlight: 'Form 16 + New ₹75k Standard Deduction + 87A rebate up to ₹7.75 Lakhs',
    ctaLink: '#file-now',
    waText: 'Hello Tracconsultant! I want to file my Salaried Income Tax Return (ITR-1).'
  },
  {
    id: 'capital-gains',
    name: 'Stocks & Crypto',
    tag: 'Save Tax',
    icon: TrendingUp,
    price: '₹1,999',
    turnaround: '24-48 Hours',
    highlight: 'Zerodha/Groww P&L import + STCG/LTCG set-off & crypto 30% calculation',
    ctaLink: '#file-now',
    waText: 'Hello Tracconsultant! I have Capital Gains from Stocks/Mutual Funds/Crypto to file.'
  },
  {
    id: 'notice',
    name: 'Notice 143(1)',
    tag: 'Urgent',
    icon: AlertTriangle,
    price: '₹999',
    turnaround: 'Same Day',
    highlight: 'Defective 139(9), 143(1) mismatch & 148 scrutiny reply drafted by Senior CA',
    ctaLink: '#file-now',
    waText: 'Hello Tracconsultant! I received an Income Tax Notice 143(1). Need urgent review.'
  },
  {
    id: 'gst',
    name: 'GST Returns',
    tag: 'Zero Late Fee',
    icon: Briefcase,
    price: '₹799/mo',
    turnaround: 'Before 20th',
    highlight: 'Monthly GSTR-1, 3B & 2B Input Tax Credit reconciliation with zero penalties',
    ctaLink: '#file-now',
    waText: 'Hello Tracconsultant! Need help with monthly GST returns and GSTR-2B matching.'
  },
  {
    id: 'company',
    name: 'Company Setup',
    tag: 'Startups',
    icon: Building,
    price: '₹5,999',
    turnaround: '7-10 Days',
    highlight: 'Pvt Ltd, LLP, MSME Udyam certificate & Trademark TM-A registration',
    ctaLink: '#file-now',
    waText: 'Hello Tracconsultant! I want to incorporate a new Private Limited Company / MSME.'
  }
];

export default function Hero() {
  const [activeTab, setActiveTab] = useState(HERO_TABS[0]);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#07172B] via-[#0B2545] to-[#040e1b] text-white pt-10 pb-20 lg:pt-16 lg:pb-28">
      
      {/* Background Decorative Lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Tagline Pill */}
        <div className="text-center lg:text-left mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold shadow-xs backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>AY 2025-26 Live: Claim ₹75,000 New Standard Deduction & ₹7.75L Rebate</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headlines & Tab Switcher */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            <h1 className="text-3xl sm:text-5xl xl:text-6xl font-black tracking-tight leading-[1.15]">
              India&apos;s Most Trusted <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-200 to-green-400">
                CA-Assisted Tax Filing
              </span> <br className="hidden sm:inline" />
              & Compliance Partner
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Don&apos;t risk algorithmic DIY bots that trigger tax notices. At <strong>Tracconsultant</strong>, your taxes are hand-crafted and verified by a dedicated Chartered Accountant for <strong>100% Notice Protection</strong> and <strong>Maximum Refund Guarantee</strong>.
            </p>

            {/* Interactive Hero Quick-Tabs */}
            <div className="pt-2">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                Choose Your Filing Category:
              </div>
              <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                {HERO_TABS.map((tab) => {
                  const Icon = tab.icon;
                  const isSelected = activeTab.id === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab)}
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/25 scale-105 ring-2 ring-emerald-400/40'
                          : 'bg-white/10 text-slate-300 hover:bg-white/15 hover:text-white border border-white/10'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{tab.name}</span>
                      {tab.tag && (
                        <span className={`text-[9px] px-1.5 py-0.2 rounded font-extrabold uppercase ${
                          isSelected ? 'bg-slate-950 text-emerald-300' : 'bg-emerald-500/20 text-emerald-300'
                        }`}>
                          {tab.tag}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Dynamic Active Tab Summary Bar */}
              <div className="mt-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
                <div>
                  <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>{activeTab.name} • {activeTab.turnaround} Turnaround</span>
                  </div>
                  <div className="text-xs text-slate-300 mt-1 line-clamp-1">{activeTab.highlight}</div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="text-left sm:text-right">
                    <div className="text-[10px] text-slate-400 uppercase">Starting at</div>
                    <div className="text-lg font-black text-white">{activeTab.price}</div>
                  </div>
                  <a
                    href="#file-now"
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-colors"
                  >
                    File Now
                  </a>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                href="#file-now"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-[#00a859] to-[#059669] hover:from-[#008f4c] hover:to-[#047857] text-white rounded-2xl font-black text-sm shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Start Filing in 30 Seconds</span>
                <ArrowRight className="w-5 h-5" />
              </Link>

              <a
                href={`https://wa.me/917275922162?text=${encodeURIComponent(activeTab.waText)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-4 bg-white/10 hover:bg-white/15 text-white border border-white/20 rounded-2xl font-bold text-xs sm:text-sm transition-all shadow-md"
              >
                <MessageCircle className="w-5 h-5 text-emerald-400" />
                <span>Chat with CA on WhatsApp</span>
              </a>
            </div>

            {/* Trust Counters Row */}
            <div className="pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-4 text-center lg:text-left">
              <div>
                <div className="text-2xl sm:text-3xl font-black text-white">15,000+</div>
                <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Tax Returns Filed</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-400">₹4.5 Cr+</div>
                <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Refunds Claimed</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-white flex items-center justify-center lg:justify-start gap-1">
                  <span>4.9</span>
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                </div>
                <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Google Rating</div>
              </div>
            </div>

          </div>

          {/* Right Column: Premium Interactive CA Consultation Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md bg-gradient-to-b from-slate-900/90 to-[#0B2545]/95 border border-slate-700/80 rounded-3xl p-6 sm:p-7 shadow-2xl backdrop-blur-xl space-y-6">
              
              {/* Card Header with Verified CA Avatar */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-2xl bg-[#07172B] border-2 border-emerald-400 p-1 flex items-center justify-center">
                    <Image 
                      src="/logo.png" 
                      alt="Tracconsultant CA" 
                      width={42} 
                      height={42} 
                      className="object-contain" 
                    />
                    <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-900 rounded-full"></span>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                      <span>CA Anjan Agarwal</span>
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    </h3>
                    <p className="text-[11px] text-emerald-400 font-medium">Fellow Chartered Accountant (ICAI)</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-500/30">
                  Online Now
                </span>
              </div>

              {/* Tax Savings Metric Highlight */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase font-bold text-emerald-300 tracking-wider">Average Tax Saved Per Client</div>
                  <div className="text-2xl font-black text-white mt-0.5">₹34,800</div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-300">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>

              {/* 3 Step Workflow inside Card */}
              <div className="space-y-2.5 text-xs">
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 border border-white/5">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500 text-slate-950 font-black text-xs flex items-center justify-center flex-shrink-0">
                    1
                  </div>
                  <span className="text-slate-200 font-medium">Upload Form 16 / Bank Statement</span>
                </div>

                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 border border-white/5">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500 text-slate-950 font-black text-xs flex items-center justify-center flex-shrink-0">
                    2
                  </div>
                  <span className="text-slate-200 font-medium">Senior CA Reconciles AIS/TIS & Deductions</span>
                </div>

                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 border border-white/5">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500 text-slate-950 font-black text-xs flex items-center justify-center flex-shrink-0">
                    3
                  </div>
                  <span className="text-slate-200 font-medium">Review Draft on WhatsApp & E-Verify in 24 Hrs</span>
                </div>
              </div>

              {/* Action Buttons inside Card */}
              <div className="space-y-2 pt-1">
                <a
                  href="https://wa.me/917275922162?text=Hello%20CA%20Anjan!%20I%20need%20help%20with%20my%20Income%20Tax%20Return."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 bg-[#00a859] hover:bg-[#008f4c] text-white text-xs font-bold rounded-xl shadow-md transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Connect with CA on WhatsApp (7275922162)</span>
                </a>

                <div className="flex items-center justify-between text-xs text-slate-400 px-1 pt-1">
                  <span>Alternate Helpline:</span>
                  <a href="tel:+918052171196" className="text-emerald-400 font-bold hover:underline">
                    +91 8052171196
                  </a>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

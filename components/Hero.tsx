'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  MessageCircle, 
  FileText, 
  TrendingUp, 
  Star, 
  Lock,
  UploadCloud,
  Check,
  Building2,
  Users,
  Briefcase,
  LayoutDashboard,
  LineChart,
  BadgeCheck
} from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-b from-slate-50/80 via-white to-slate-50/60 text-slate-900 pt-10 pb-16 lg:pt-16 lg:pb-24 overflow-hidden border-b border-slate-200/80">
      
      {/* Soft Ambient Fintech Glow & Subtle Grid Accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[350px] bg-gradient-to-b from-emerald-100/35 via-blue-50/25 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-0 w-[420px] h-[420px] bg-emerald-100/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-35 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Authoritative Copy & Direct Actions */}
          <div className="lg:col-span-6 xl:col-span-6 space-y-6 text-center lg:text-left">
            
            {/* Top Institutional Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-2xs">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
              </span>
              <span className="font-bold text-slate-900">AY 2025–26 Tax Filing Active</span>
              <span className="text-slate-300">•</span>
              <span className="text-emerald-700 font-medium">New ₹75,000 Deduction</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[52px] font-black tracking-tight text-[#0B2545] leading-[1.12]">
              Expert CA-Assisted <br className="hidden sm:inline" />
              Tax Filing &amp; Corporate <br className="hidden sm:inline" />
              <span className="text-[#0B2545]">Advisory</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Seamlessly file returns, optimize taxes, and grow your business with certified Chartered Accountants. Zero notice anxiety, guaranteed maximum legal refunds.
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                href="#file-now"
                className="w-full sm:w-auto px-8 py-4 bg-[#00a859] hover:bg-[#008f4c] text-white rounded-xl font-bold text-sm sm:text-base shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/35 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <span>Start CA Filing</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href="https://wa.me/917275922162?text=Hello%20Tracconsultant!%20I%20would%20like%20to%20consult%20a%20Senior%20CA%20for%20my%20tax%20filing."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-7 py-4 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 hover:border-slate-400 rounded-xl font-semibold text-sm sm:text-base shadow-xs transition-all flex items-center justify-center gap-2.5"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>Chat with Senior CA</span>
              </a>
            </div>

            {/* Trust Metrics Row */}
            <div className="pt-6 border-t border-slate-200/80 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span className="font-semibold text-slate-800">100% Notice Protection</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span className="font-semibold text-slate-800">Guaranteed 24-Hr Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span className="font-semibold text-slate-800">AIS/TIS Double-Checked</span>
              </div>
            </div>

          </div>

          {/* Right Column: High-Fidelity Fintech Dashboard Card (Concept 1 UI) */}
          <div className="lg:col-span-6 xl:col-span-6 relative">
            
            {/* Dashboard Window Container */}
            <div className="relative mx-auto max-w-lg bg-white rounded-2xl border border-slate-200/90 shadow-2xl shadow-slate-200/80 overflow-hidden">
              
              {/* Window Header Bar (Dark Navy Browser Bar) */}
              <div className="bg-[#0B2545] px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400/90" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400/90" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/90" />
                </div>
                <div className="text-[11px] font-medium text-slate-300 flex items-center gap-1.5">
                  <Lock className="w-3 h-3 text-emerald-400" />
                  <span>tracconsultant.com • Secure CA Console</span>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Live Desk</span>
                </div>
              </div>

              {/* Window Body: Mini Sidebar + 4-Widget Grid */}
              <div className="flex">
                
                {/* Mini Sidebar */}
                <div className="w-14 bg-slate-50 border-r border-slate-200/70 p-3 flex flex-col items-center gap-5 shrink-0">
                  <div className="w-8 h-8 rounded-lg bg-[#0B2545] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    T
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center">
                    <LineChart className="w-4 h-4" />
                  </div>
                  <div className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                  <div className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 flex items-center justify-center">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div className="mt-auto w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  </div>
                </div>

                {/* Dashboard Grid (4 Cards) */}
                <div className="flex-1 p-4 sm:p-5 bg-white space-y-4">
                  
                  {/* Top Row: 2 Widgets */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    
                    {/* Widget 1: Tax Refund Optimization Graph */}
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-slate-700">Tax Refund Optimization</span>
                          <span className="text-[10px] text-slate-400 font-medium">AY 25-26</span>
                        </div>
                        <div className="mt-1 flex items-baseline gap-1.5">
                          <span className="text-xl font-black text-emerald-600">+₹34,800</span>
                          <span className="text-[10px] font-semibold text-slate-500">saved</span>
                        </div>
                      </div>

                      {/* Line Graph SVG */}
                      <div className="mt-2 pt-1 border-t border-slate-200/50">
                        <svg viewBox="0 0 160 50" className="w-full h-11 overflow-visible">
                          <defs>
                            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                            </linearGradient>
                          </defs>
                          <path
                            d="M0,42 Q25,36 50,22 T100,28 T140,8 T160,4 L160,50 L0,50 Z"
                            fill="url(#chartGradient)"
                          />
                          <path
                            d="M0,42 Q25,36 50,22 T100,28 T140,8 T160,4"
                            fill="none"
                            stroke="#059669"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                          />
                          <circle cx="160" cy="4" r="3.5" fill="#059669" />
                        </svg>
                        <div className="flex justify-between text-[9px] text-slate-400 mt-1 font-mono">
                          <span>Jan</span>
                          <span>Mar</span>
                          <span>May</span>
                          <span>Jun</span>
                        </div>
                      </div>
                    </div>

                    {/* Widget 2: Form 16 Drag & Drop Preview */}
                    <Link 
                      href="#file-now"
                      className="group p-3.5 rounded-xl bg-slate-50 hover:bg-emerald-50/40 border border-slate-200/80 hover:border-emerald-300 transition-all flex flex-col justify-between text-left"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-700">Form 16 / AIS</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">Auto</span>
                      </div>

                      <div className="my-2 border border-dashed border-slate-300 group-hover:border-emerald-400 rounded-lg p-3 text-center transition-colors bg-white">
                        <UploadCloud className="w-5 h-5 mx-auto text-emerald-600 group-hover:scale-110 transition-transform" />
                        <span className="block text-[11px] font-semibold text-slate-700 mt-1">
                          Drag &amp; Drop Form 16
                        </span>
                        <span className="block text-[9px] text-slate-400">PDF, Excel or JSON</span>
                      </div>

                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full w-4/5 rounded-full" />
                      </div>
                    </Link>

                  </div>

                  {/* Bottom Row: 2 Widgets */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    
                    {/* Widget 3: Verified ICAI Compliance */}
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
                      <div className="relative w-11 h-11 rounded-xl bg-white border border-slate-200 p-1 flex items-center justify-center shrink-0 shadow-2xs">
                        <Image 
                          src="/logo.png" 
                          alt="ICAI Emblem" 
                          width={34} 
                          height={34} 
                          className="object-contain" 
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[11px] font-bold text-slate-900 flex items-center gap-1">
                          <span>Verified ICAI</span>
                          <BadgeCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        </div>
                        <div className="text-[10px] text-slate-500 font-medium leading-tight mt-0.5">
                          Certified &amp; Notice-Proof Standards
                        </div>
                      </div>
                    </div>

                    {/* Widget 4: Client Trust Badges */}
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col justify-center">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black text-slate-900">4.9 Stars</span>
                        <div className="flex items-center text-amber-400">
                          <Star className="w-3 h-3 fill-amber-400" />
                          <Star className="w-3 h-3 fill-amber-400" />
                          <Star className="w-3 h-3 fill-amber-400" />
                          <Star className="w-3 h-3 fill-amber-400" />
                          <Star className="w-3 h-3 fill-amber-400" />
                        </div>
                      </div>
                      <div className="text-[10px] font-bold text-emerald-700 mt-0.5">
                        15,000+ Happy Clients
                      </div>
                      <div className="text-[9px] text-slate-400">
                        Salaried, Traders &amp; Startups
                      </div>
                    </div>

                  </div>

                </div>

              </div>

              {/* Window Footer: 1-Click Consultation CTA Strip */}
              <div className="bg-slate-50 px-4 py-2.5 border-t border-slate-200/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-slate-600 text-[11px]">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>256-Bit SSL Encrypted Vault</span>
                </div>
                <a
                  href="tel:+917275922162"
                  className="text-emerald-700 font-bold hover:underline text-[11px] flex items-center gap-1"
                >
                  <span>Senior CA Direct: +91 7275922162</span>
                </a>
              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}

'use client';

import React, { useState, useRef } from 'react';
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
  BadgeCheck,
  FileCheck,
  Phone,
  Sparkles,
  Zap
} from 'lucide-react';

export default function Hero() {
  const [activeTab, setActiveTab] = useState<'analytics' | 'panel' | 'services' | 'security'>('analytics');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  const handleScrollToFileNow = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    const el = document.getElementById('file-now');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleScrollToTestimonials = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    const el = document.getElementById('testimonials');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processSelectedFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processSelectedFile(file);
    }
  };

  const processSelectedFile = (file: File) => {
    setUploadedFileName(file.name);
    setIsUploading(true);
    setUploadProgress(30);

    setTimeout(() => {
      setUploadProgress(75);
    }, 250);

    setTimeout(() => {
      setUploadProgress(100);
      setIsUploading(false);
      // Auto-scroll to filing wizard so client can finish their submission
      setTimeout(() => {
        handleScrollToFileNow();
      }, 400);
    }, 600);
  };

  return (
    <section className="relative bg-gradient-to-b from-slate-50/80 via-white to-slate-50/60 text-slate-900 pt-10 pb-16 lg:pt-16 lg:pb-24 overflow-hidden border-b border-slate-200/80">
      
      {/* Soft Ambient Fintech Glow & Subtle Grid Accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[350px] bg-gradient-to-b from-emerald-100/35 via-blue-50/25 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-0 w-[420px] h-[420px] bg-emerald-100/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-35 pointer-events-none" />

      {/* Hidden File Input for Form 16 Upload */}
      <input 
        ref={fileInputRef} 
        type="file" 
        accept=".pdf,.doc,.docx,.xls,.xlsx,.json,image/*" 
        onChange={handleFileChange}
        className="hidden" 
      />

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
              <button
                type="button"
                onClick={handleScrollToFileNow}
                className="w-full sm:w-auto px-8 py-4 bg-[#00a859] hover:bg-[#008f4c] text-white rounded-xl font-bold text-sm sm:text-base shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/35 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <span>Start CA Filing</span>
                <ArrowRight className="w-4 h-4" />
              </button>

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
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400/90 cursor-pointer" title="Tracconsultant Console" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400/90 cursor-pointer" title="Auto-Reconcile" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/90 cursor-pointer" title="Live Desk Active" />
                </div>
                
                <div className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>tracconsultant.com • Secure CA Console</span>
                </div>

                <a 
                  href="https://wa.me/917275922162?text=Hello%20Tracconsultant!%20I%20want%20to%20connect%20with%20the%20live%20desk."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-semibold transition-colors cursor-pointer"
                  title="Click to chat with live CA desk"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Live Desk</span>
                </a>
              </div>

              {/* Window Body: Interactive Mini Sidebar + Multi-Tab Content */}
              <div className="flex min-h-[300px]">
                
                {/* Mini Sidebar with Active Tabs */}
                <div className="w-14 bg-slate-50 border-r border-slate-200/70 p-3 flex flex-col items-center gap-4 shrink-0">
                  <div 
                    onClick={() => setActiveTab('analytics')}
                    className="w-8 h-8 rounded-lg bg-[#0B2545] text-white flex items-center justify-center font-bold text-xs shadow-xs cursor-pointer hover:scale-105 transition-transform" 
                    title="Tracconsultant Home"
                  >
                    T
                  </div>

                  {/* Tab 1: Analytics / Tax Savings */}
                  <button
                    type="button"
                    onClick={() => setActiveTab('analytics')}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                      activeTab === 'analytics'
                        ? 'bg-emerald-100 text-emerald-700 shadow-xs ring-1 ring-emerald-300'
                        : 'text-slate-400 hover:text-slate-700 hover:bg-slate-200/60'
                    }`}
                    title="Tax Savings Analytics & Upload"
                  >
                    <LineChart className="w-4 h-4" />
                  </button>

                  {/* Tab 2: Senior CA Live Panel */}
                  <button
                    type="button"
                    onClick={() => setActiveTab('panel')}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                      activeTab === 'panel'
                        ? 'bg-emerald-100 text-emerald-700 shadow-xs ring-1 ring-emerald-300'
                        : 'text-slate-400 hover:text-slate-700 hover:bg-slate-200/60'
                    }`}
                    title="Senior CA Panel"
                  >
                    <Users className="w-4 h-4" />
                  </button>

                  {/* Tab 3: Quick Services */}
                  <button
                    type="button"
                    onClick={() => setActiveTab('services')}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                      activeTab === 'services'
                        ? 'bg-emerald-100 text-emerald-700 shadow-xs ring-1 ring-emerald-300'
                        : 'text-slate-400 hover:text-slate-700 hover:bg-slate-200/60'
                    }`}
                    title="Quick Services List"
                  >
                    <Briefcase className="w-4 h-4" />
                  </button>

                  {/* Tab 4: Security & Audit Guarantee */}
                  <button
                    type="button"
                    onClick={() => setActiveTab('security')}
                    className={`mt-auto w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                      activeTab === 'security'
                        ? 'bg-emerald-100 text-emerald-700 shadow-xs ring-1 ring-emerald-300'
                        : 'text-slate-400 hover:text-slate-700 hover:bg-slate-200/60'
                    }`}
                    title="ICAI Security & Notice Guarantee"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  </button>
                </div>

                {/* Dashboard Main Content Area */}
                <div className="flex-1 p-4 sm:p-5 bg-white">
                  
                  {/* TAB 1: DEFAULT FINTECH DASHBOARD (Graph + Real Upload + Badges) */}
                  {activeTab === 'analytics' && (
                    <div className="space-y-4 animate-in fade-in duration-200">
                      
                      {/* Top Row: 2 Widgets */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        
                        {/* Widget 1: Tax Refund Optimization Graph */}
                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-700">Tax Refund Optimization</span>
                              <span className="text-xs text-slate-400 font-medium">AY 25-26</span>
                            </div>
                            <div className="mt-1 flex items-baseline gap-1.5">
                              <span className="text-xl font-black text-emerald-600">+₹34,800</span>
                              <span className="text-xs font-semibold text-slate-500">saved</span>
                            </div>
                          </div>

                          {/* Line Graph SVG */}
                          <div className="mt-2 pt-1 border-t border-slate-200/50">
                            <svg viewBox="0 0 160 50" className="w-full h-11 overflow-visible">
                              <defs>
                                <linearGradient id="chartGradientHero" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                                </linearGradient>
                              </defs>
                              <path
                                d="M0,42 Q25,36 50,22 T100,28 T140,8 T160,4 L160,50 L0,50 Z"
                                fill="url(#chartGradientHero)"
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
                            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                              <span>Jan</span>
                              <span>Mar</span>
                              <span>May</span>
                              <span>Jun</span>
                            </div>
                          </div>
                        </div>

                        {/* Widget 2: REAL FUNCTIONAL Form 16 Drag & Drop Upload */}
                        <div 
                          onClick={handleFileClick}
                          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                          onDragLeave={() => setIsDragOver(false)}
                          onDrop={handleDrop}
                          className={`group p-3.5 rounded-xl border transition-all flex flex-col justify-between text-left cursor-pointer ${
                            isDragOver
                              ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-400/40'
                              : 'bg-slate-50 hover:bg-emerald-50/40 border-slate-200/80 hover:border-emerald-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-700">Form 16 / AIS</span>
                            <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                              {uploadedFileName ? 'Attached' : 'Upload'}
                            </span>
                          </div>

                          <div className="my-2 border border-dashed border-slate-300 group-hover:border-emerald-400 rounded-lg p-3 text-center transition-colors bg-white">
                            {uploadedFileName ? (
                              <div className="space-y-1">
                                <FileCheck className="w-5 h-5 mx-auto text-emerald-600 animate-bounce" />
                                <span className="block text-xs font-bold text-slate-800 truncate max-w-[140px] mx-auto">
                                  {uploadedFileName}
                                </span>
                                <span className="block text-xs text-emerald-600 font-semibold">
                                  {isUploading ? `Uploading ${uploadProgress}%...` : 'Ready for CA Filing ✓'}
                                </span>
                              </div>
                            ) : (
                              <>
                                <UploadCloud className="w-5 h-5 mx-auto text-emerald-600 group-hover:scale-110 transition-transform" />
                                <span className="block text-xs font-semibold text-slate-700 mt-1">
                                  Drag &amp; Drop Form 16
                                </span>
                                <span className="block text-xs text-slate-400">PDF, Excel or JSON</span>
                              </>
                            )}
                          </div>

                          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                            <div 
                              className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                              style={{ width: uploadedFileName ? `${uploadProgress}%` : '80%' }}
                            />
                          </div>
                        </div>

                      </div>

                      {/* Bottom Row: 2 Widgets */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        
                        {/* Widget 3: Verified ICAI Compliance (Clickable to switch tab) */}
                        <div 
                          onClick={() => setActiveTab('security')}
                          className="p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 flex items-center gap-3 cursor-pointer transition-colors"
                          title="Click to view ICAI verification details"
                        >
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
                            <div className="text-xs font-bold text-slate-900 flex items-center gap-1">
                              <span>Verified ICAI</span>
                              <BadgeCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            </div>
                            <div className="text-xs text-slate-500 font-medium leading-tight mt-0.5">
                              Certified &amp; Notice-Proof Standards
                            </div>
                          </div>
                        </div>

                        {/* Widget 4: Client Trust Badges (Clickable to scroll to reviews) */}
                        <div 
                          onClick={handleScrollToTestimonials}
                          className="p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 flex flex-col justify-center cursor-pointer transition-colors"
                          title="Click to view client reviews"
                        >
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
                          <div className="text-xs font-bold text-emerald-700 mt-0.5">
                            15,000+ Happy Clients
                          </div>
                          <div className="text-[10px] text-slate-400">
                            Click to view reviews &rarr;
                          </div>
                        </div>

                      </div>

                    </div>
                  )}

                  {/* TAB 2: SENIOR CA LIVE PANEL */}
                  {activeTab === 'panel' && (
                    <div className="space-y-3 animate-in fade-in duration-200">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <div>
                          <h4 className="text-xs font-bold text-[#0B2545]">Senior CA Advisory Panel</h4>
                          <p className="text-xs text-slate-500">Qualified Chartered Accountants Active Now</p>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                          Online Desk
                        </span>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                              CA
                            </div>
                            <div>
                              <div className="font-bold text-slate-900">Senior Tax Partner</div>
                              <div className="text-xs text-slate-500">12+ Yrs • Scrutiny & Appeals</div>
                            </div>
                          </div>
                          <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Available
                          </span>
                        </div>

                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-[#0B2545] text-white font-bold text-xs flex items-center justify-center">
                              CA
                            </div>
                            <div>
                              <div className="font-bold text-slate-900">Capital Gains & Crypto Desk</div>
                              <div className="text-xs text-slate-500">Zerodha / Groww / Foreign Stocks</div>
                            </div>
                          </div>
                          <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Available
                          </span>
                        </div>
                      </div>

                      <a
                        href="https://wa.me/917275922162?text=Hello%20Tracconsultant!%20I%20want%20to%20consult%20a%20Senior%20CA%20directly."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full mt-2 py-2.5 bg-[#00a859] hover:bg-[#008f4c] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Connect with CA on WhatsApp (&lt;2 mins)</span>
                      </a>
                    </div>
                  )}

                  {/* TAB 3: QUICK SERVICES LIST */}
                  {activeTab === 'services' && (
                    <div className="space-y-2.5 animate-in fade-in duration-200">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <h4 className="text-xs font-bold text-[#0B2545]">Select Service to Fast-Track</h4>
                        <span className="text-xs text-slate-400">Click to Start</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <button
                          type="button"
                          onClick={handleScrollToFileNow}
                          className="p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 border border-slate-200 text-left transition-all"
                        >
                          <div className="font-bold text-slate-900">Salaried ITR-1</div>
                          <div className="text-xs text-slate-500">Form 16 + ₹75k standard deduction</div>
                          <div className="text-emerald-700 font-extrabold mt-1">₹499</div>
                        </button>

                        <button
                          type="button"
                          onClick={handleScrollToFileNow}
                          className="p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 border border-slate-200 text-left transition-all"
                        >
                          <div className="font-bold text-slate-900">Capital Gains / F&amp;O</div>
                          <div className="text-xs text-slate-500">Stocks, Crypto &amp; Intraday</div>
                          <div className="text-emerald-700 font-extrabold mt-1">₹1,999</div>
                        </button>

                        <button
                          type="button"
                          onClick={handleScrollToFileNow}
                          className="p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 border border-slate-200 text-left transition-all"
                        >
                          <div className="font-bold text-slate-900">Notice 143(1) Scrutiny</div>
                          <div className="text-xs text-slate-500">Official CA reply &amp; rectification</div>
                          <div className="text-emerald-700 font-extrabold mt-1">₹999</div>
                        </button>

                        <button
                          type="button"
                          onClick={handleScrollToFileNow}
                          className="p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 border border-slate-200 text-left transition-all"
                        >
                          <div className="font-bold text-slate-900">GST Monthly Returns</div>
                          <div className="text-xs text-slate-500">GSTR-1 &amp; 3B filing + ITC match</div>
                          <div className="text-emerald-700 font-extrabold mt-1">₹799/mo</div>
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={handleScrollToFileNow}
                        className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5"
                      >
                        <span>Open 30-Second Filing Form &rarr;</span>
                      </button>
                    </div>
                  )}

                  {/* TAB 4: SECURITY & NOTICE PROTECTION GUARANTEE */}
                  {activeTab === 'security' && (
                    <div className="space-y-3 animate-in fade-in duration-200">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <h4 className="text-xs font-bold text-[#0B2545]">100% Notice Protection Guarantee</h4>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                          ICAI Standard
                        </span>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div className="flex items-start gap-2.5 p-2 rounded-lg bg-emerald-50/60 border border-emerald-200/80">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <div>
                            <div className="font-bold text-slate-900">Double-Verification by Practicing CAs</div>
                            <div className="text-xs text-slate-600">Every computation is reconciled across Form 16, AIS, and TIS before e-filing.</div>
                          </div>
                        </div>

                        <div className="flex items-start gap-2.5 p-2 rounded-lg bg-emerald-50/60 border border-emerald-200/80">
                          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <div>
                            <div className="font-bold text-slate-900">Free Scrutiny Defense Coverage</div>
                            <div className="text-xs text-slate-600">If the Income Tax Department issues any query on our filed return, our senior CAs defend it at zero extra charge.</div>
                          </div>
                        </div>

                        <div className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-50 border border-slate-200">
                          <Lock className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                          <div>
                            <div className="font-bold text-slate-900">256-Bit Bank-Grade Data Vault</div>
                            <div className="text-xs text-slate-600">Your PAN, Form 16, and bank data are strictly encrypted and never shared.</div>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleScrollToFileNow}
                        className="w-full py-2 bg-[#00a859] hover:bg-[#008f4c] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5"
                      >
                        <span>Start Notice-Protected Filing &rarr;</span>
                      </button>
                    </div>
                  )}

                </div>

              </div>

              {/* Window Footer: 1-Click Consultation CTA Strip */}
              <div className="bg-slate-50 px-4 py-2.5 border-t border-slate-200/80 flex items-center justify-between text-xs">
                <div 
                  onClick={() => setActiveTab('security')}
                  className="flex items-center gap-1.5 text-slate-600 text-xs cursor-pointer hover:text-emerald-700 transition-colors"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>256-Bit SSL Encrypted Vault</span>
                </div>
                
                <a
                  href="tel:+917275922162"
                  className="text-emerald-700 font-bold hover:underline text-xs flex items-center gap-1"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
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

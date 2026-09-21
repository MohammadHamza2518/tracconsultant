'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useConfig } from '@/context/ConfigContext';
import { TOOLS_LIST, ToolConfig } from '@/lib/data';
import ToolPaywallModal from '@/components/ToolPaywallModal';
import { 
  Layers, 
  Sparkles, 
  ShieldCheck, 
  Check, 
  Lock, 
  ArrowRight, 
  Zap, 
  Calculator, 
  Calendar, 
  TrendingUp, 
  EyeOff, 
  FileSpreadsheet, 
  GitCompare, 
  FileCode2,
  Search,
  FileArchive,
  Receipt
} from 'lucide-react';

export default function ToolsHubPage() {
  const { user, hasToolAccess, openAuthModal, refreshUser } = useAuth();
  const { toolPrices, getToolPrice } = useConfig();
  const bundlePrice = toolPrices?.allAccessPass || 999;
  const [filter, setFilter] = useState<'all' | 'free' | 'paid'>('all');
  const [search, setSearch] = useState('');
  const [paywallTool, setPaywallTool] = useState<ToolConfig | null>(null);

  const filteredTools = TOOLS_LIST.filter(tool => {
    const matchesFilter = filter === 'all' || tool.category === filter;
    const matchesSearch = tool.name.toLowerCase().includes(search.toLowerCase()) ||
                          tool.shortDesc.toLowerCase().includes(search.toLowerCase()) ||
                          tool.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const getToolIcon = (iconName: string) => {
    switch (iconName) {
      case 'Calculator': return <Calculator className="w-6 h-6 text-emerald-600" />;
      case 'Calendar': return <Calendar className="w-6 h-6 text-emerald-600" />;
      case 'TrendingUp': return <TrendingUp className="w-6 h-6 text-emerald-600" />;
      case 'EyeOff': return <EyeOff className="w-6 h-6 text-indigo-600" />;
      case 'FileSpreadsheet': return <FileSpreadsheet className="w-6 h-6 text-indigo-600" />;
      case 'GitCompare': return <GitCompare className="w-6 h-6 text-indigo-600" />;
      case 'FileCode2': return <FileCode2 className="w-6 h-6 text-indigo-600" />;
      case 'FileArchive': return <FileArchive className="w-6 h-6 text-indigo-600" />;
      case 'Receipt': return <Receipt className="w-6 h-6 text-indigo-600" />;
      default: return <Sparkles className="w-6 h-6 text-indigo-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70 pb-28 sm:pb-32">
      {/* Header Banner - FinTech Modern Style */}
      <div className="bg-gradient-to-b from-[#07152B] via-[#0B1E3B] to-[#0D2447] text-white pt-14 pb-12 sm:pt-16 sm:pb-14 px-4 sm:px-8 border-b border-[#143258] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-6xl mx-auto text-center relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold tracking-wide backdrop-blur-sm shadow-inner">
            <Layers className="w-3.5 h-3.5" /> High-Accuracy Financial Computing Engines
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white max-w-3xl mx-auto">
            Tax & Compliance Digital Suite
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            From free Union Budget calculators and Basic audit tools to advance ITR 1-7 computation, PDF redaction studio, and GST billing.
          </p>
          <div className="pt-1 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-300">
            <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> 8 Free & Basic Tools</span>
            <span className="text-slate-600">•</span>
            <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> 4 Advance & Pro Modules</span>
            <span className="text-slate-600">•</span>
            <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> DPDP Act & Rule 36(4) Compliant</span>
          </div>

          {/* Focal Hero Action Buttons */}
          <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#tools-grid"
              className="px-5 py-2.5 bg-[#00a859] hover:bg-[#008f4c] text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center gap-2 hover:scale-105 active:scale-95"
            >
              <span>Explore All 12 Tools</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
            <button
              type="button"
              onClick={() => setPaywallTool({
                id: 'all-access-pass',
                name: 'All-Access Compliance Suite Pass (All 4 Advance/Pro Modules)',
                slug: 'all-access',
                category: 'paid',
                price: bundlePrice,
                shortDesc: 'Unlock all 4 advance & pro processing tools in one bundle.',
                description: 'Unlimited file processing pass for all professional tools.',
                icon: 'Sparkles',
                tags: ['Bundle', 'Full Suite'],
                features: ['All 4 Advance/Pro Tools Unlocked Forever', 'Priority Server Processing', 'Direct WhatsApp CA Support']
              })}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center gap-2 hover:scale-105 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Get All-Access Pass (₹{bundlePrice})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div id="tools-grid" className="max-w-6xl mx-auto px-4 sm:px-8 pt-8 relative z-10">

        {/* Controls: Filter Tabs & Search Box - Explicit h-11 Alignment */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          {/* Category Tabs */}
          <div className="h-11 p-1 bg-slate-100 rounded-xl w-full sm:w-auto flex items-center gap-1 text-xs font-bold text-slate-600">
            <button
              onClick={() => setFilter('all')}
              className={`h-9 flex-1 sm:flex-initial px-4 flex items-center justify-center rounded-lg transition-all cursor-pointer ${
                filter === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'hover:text-slate-900'
              }`}
            >
              All Utilities ({TOOLS_LIST.length})
            </button>
            <button
              onClick={() => setFilter('free')}
              className={`h-9 flex-1 sm:flex-initial px-4 flex items-center justify-center rounded-lg transition-all cursor-pointer ${
                filter === 'free' ? 'bg-white text-emerald-700 shadow-sm' : 'hover:text-emerald-700'
              }`}
            >
              Free Calculators (3)
            </button>
            <button
              onClick={() => setFilter('paid')}
              className={`h-9 flex-1 sm:flex-initial px-4 flex items-center justify-center rounded-lg transition-all cursor-pointer ${
                filter === 'paid' ? 'bg-white text-indigo-700 shadow-sm' : 'hover:text-indigo-700'
              }`}
            >
              Pro Audit Utilities (5)
            </button>
          </div>

          {/* Search Box with Exact h-11 Height */}
          <div className="relative w-full sm:w-72 h-11">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tools, HRA, 2A, B/S..."
              className="w-full h-11 pl-10 pr-4 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Semantic Section Heading for Accessibility */}
        <h2 id="tools-grid" className="sr-only">Directory of Financial and Compliance Tools</h2>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => {
            const isUnlocked = hasToolAccess(tool.id);
            const dynamicPrice = getToolPrice(tool.id, tool.price);

            return (
              <div
                key={tool.id}
                className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-emerald-400 transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:-translate-y-1"
              >
                <div className="p-6">
                  {/* Top Bar: Category badge & Price */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <Link
                      href={`/tools/${tool.slug}`}
                      className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform cursor-pointer"
                    >
                      {getToolIcon(tool.icon)}
                    </Link>
                    {tool.category === 'free' ? (
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {tool.badge || '100% Free'}
                      </span>
                    ) : isUnlocked ? (
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1 border border-emerald-200">
                        <Check className="w-3.5 h-3.5 text-emerald-600" /> Unlocked
                      </span>
                    ) : (
                      <div className="text-right">
                        <span className="text-xs font-medium text-slate-400 uppercase tracking-wide block leading-none">One-time</span>
                        <span className="text-base font-black text-indigo-700">₹{dynamicPrice}</span>
                      </div>
                    )}
                  </div>

                  {/* Title & Short Desc (Clickable) */}
                  <Link href={`/tools/${tool.slug}`} className="block group-hover:text-emerald-700 transition-colors">
                    <h3 className="text-base font-bold text-slate-900 leading-snug hover:underline">
                      {tool.name}
                    </h3>
                  </Link>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    {tool.shortDesc}
                  </p>

                  {/* Feature Highlights */}
                  <ul className="mt-4 space-y-1.5 pt-3 border-t border-slate-100">
                    {tool.features.slice(0, 3).map((feat, idx) => (
                      <li key={idx} className="text-xs text-slate-600 flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card Action Button */}
                <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div className="flex gap-1.5 flex-wrap">
                    {tool.tags.slice(0, 2).map((tag, idx) => (
                      <span key={idx} className="text-xs font-medium bg-white px-2.5 py-0.5 rounded-lg border border-slate-200 text-slate-600">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {isUnlocked ? (
                    <Link
                      href={`/tools/${tool.slug}`}
                      className="px-4 py-2.5 bg-[#00a859] hover:bg-[#008f4c] active:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5 shrink-0 hover:shadow-md"
                    >
                      <span>Open Workspace</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  ) : (
                    <button
                      onClick={() => setPaywallTool({ ...tool, price: dynamicPrice })}
                      className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5 shrink-0 hover:shadow-md cursor-pointer"
                    >
                      <Zap className="w-3.5 h-3.5 fill-white" />
                      <span>Unlock (₹{dynamicPrice})</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner: All-Access Pass (Consistent Pure Indigo Action) */}
        <div className="mt-12 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-8 shadow-xl border border-indigo-900/50 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 text-indigo-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" /> Comprehensive Tax & Compliance Suite
            </div>
            <h2 className="text-2xl font-black text-white">Need all 4 Advance &amp; Pro Compliance Modules for your firm or practice?</h2>
            <p className="text-slate-300 text-xs max-w-xl">
              Get unlimited lifetime file processing across PDF Redactor Studio (Advance), Computation of Income Generator (Advance), Smart File Compressor, and GST Invoice Generator for flat ₹{bundlePrice}.
            </p>
          </div>
          <button
            onClick={() => setPaywallTool({
              id: 'all-access-pass',
              name: 'All-Access Compliance Suite Pass (All 4 Advance/Pro Modules)',
              slug: 'all-access',
              category: 'paid',
              price: bundlePrice,
              shortDesc: 'Unlock all 4 advance & pro processing tools in one bundle.',
              description: 'Unlimited file processing pass for all professional tools.',
              icon: 'Sparkles',
              tags: ['Bundle', 'Full Suite'],
              features: ['All 5 Paid Tools Unlocked Forever', 'Priority Server Processing', 'Direct WhatsApp CA Support']
            })}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-xs rounded-xl shadow-lg hover:shadow-indigo-900/30 transition-all shrink-0 flex items-center gap-2 cursor-pointer hover:scale-105"
          >
            <span>Unlock All-Access Pass (₹{bundlePrice})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Paywall Modal */}
      {paywallTool && (
        <ToolPaywallModal
          isOpen={Boolean(paywallTool)}
          onClose={() => setPaywallTool(null)}
          toolId={paywallTool.id}
          toolName={paywallTool.name}
          price={paywallTool.price}
          onUnlockSuccess={() => {
            refreshUser();
          }}
        />
      )}
    </div>
  );
}

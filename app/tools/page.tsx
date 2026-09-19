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
  Search
} from 'lucide-react';

export default function ToolsHubPage() {
  const { user, hasToolAccess, openAuthModal, refreshUser } = useAuth();
  const { toolPrices, getToolPrice } = useConfig();
  const bundlePrice = toolPrices?.allAccessPass || 999;
  const [filter, setFilter] = useState<'all' | 'free' | 'paid'>('all');
  const [search, setSearch] = useState('');
  const [paywallTool, setPaywallTool] = useState<ToolConfig | null>(null);
  const [isAllTestingUnlocked, setIsAllTestingUnlocked] = useState<boolean>(false);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsAllTestingUnlocked(localStorage.getItem('trac_test_all_access') === 'true');
    }
  }, []);

  const handleUnlockAllForTesting = () => {
    localStorage.setItem('trac_test_all_access', 'true');
    const allTools = ['pdf-redactor', 'tb-to-balancesheet', 'gstr2a-reconciliation', 'json-to-computation', 'gstr2a-cleaner', 'all-access-pass'];
    localStorage.setItem('trac_unlocked_tools', JSON.stringify(allTools));
    // Also add to active user profile if logged in
    const session = localStorage.getItem('trac_user_session');
    if (session) {
      try {
        const u = JSON.parse(session);
        u.unlockedTools = allTools;
        localStorage.setItem('trac_user_session', JSON.stringify(u));
      } catch {}
    }
    setIsAllTestingUnlocked(true);
    refreshUser();
  };

  const handleResetTesting = () => {
    localStorage.removeItem('trac_test_all_access');
    localStorage.removeItem('trac_unlocked_tools');
    const session = localStorage.getItem('trac_user_session');
    if (session) {
      try {
        const u = JSON.parse(session);
        u.unlockedTools = [];
        localStorage.setItem('trac_user_session', JSON.stringify(u));
      } catch {}
    }
    setIsAllTestingUnlocked(false);
    refreshUser();
  };

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
      default: return <Sparkles className="w-6 h-6 text-indigo-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70 pb-20">
      {/* Header Banner - FinTech Modern Style */}
      <div className="bg-gradient-to-b from-[#07152B] via-[#0B1E3B] to-[#0D2447] text-white pt-14 pb-12 sm:pt-16 sm:pb-14 px-4 sm:px-8 border-b border-[#143258] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-6xl mx-auto text-center relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider backdrop-blur-sm shadow-inner">
            <Layers className="w-3.5 h-3.5" /> High-Accuracy Financial Computing Engines
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white max-w-3xl mx-auto">
            Tax & Compliance Digital Suite
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            From free Union Budget tax calculators to enterprise-level GSTR-2A automated reconciliation and Schedule III balance sheet formatters.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-300">
            <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> 3 Free Calculators</span>
            <span className="text-slate-600">•</span>
            <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> 5 Pro Audit SaaS Utilities</span>
            <span className="text-slate-600">•</span>
            <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> DPDP Act & Rule 36(4) Compliant</span>
          </div>
        </div>
      </div>

      {/* Main Content Area (Clean spacing without negative margin overlap) */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 pt-8 relative z-10">
        {/* Full Access Testing Bar */}
        <div className={`rounded-2xl p-4 sm:p-5 mb-8 shadow-md border transition-all flex flex-col sm:flex-row items-center justify-between gap-4 ${
          isAllTestingUnlocked 
            ? 'bg-gradient-to-r from-emerald-950/60 via-slate-900 to-emerald-950/60 border-emerald-500/40 text-white' 
            : 'bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-indigo-500/30 text-white'
        }`}>
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
              isAllTestingUnlocked 
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' 
                : 'bg-indigo-500/20 border-indigo-500/40 text-amber-300'
            }`}>
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="text-xs font-bold flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="text-sm font-extrabold tracking-tight">Evaluation & Client Test Mode</span>
                <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                  isAllTestingUnlocked 
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                }`}>
                  {isAllTestingUnlocked ? '● All 8 Tools 100% Unlocked' : 'Paywall Demo Mode'}
                </span>
              </div>
              <div className="text-xs text-slate-300 mt-1">
                {isAllTestingUnlocked 
                  ? 'All 5 Pro tools are unlocked! Click "Open Workspace" on any tool to test full calculation, parsing & report downloads.'
                  : 'Click the button to test all 5 Pro tools without real payment, or click "Unlock" on any tool to preview the checkout paywall.'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {!isAllTestingUnlocked ? (
              <button
                type="button"
                onClick={handleUnlockAllForTesting}
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black rounded-xl text-xs shadow-lg transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer hover:scale-105 active:scale-95"
              >
                <Zap className="w-4 h-4 fill-slate-950" />
                <span>1-Click Unlock All Tools</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleResetTesting}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white font-semibold rounded-xl text-xs border border-white/10 transition-colors whitespace-nowrap cursor-pointer"
              >
                Reset (Test Paywall Flow)
              </button>
            )}
          </div>
        </div>

        {/* Controls: Filter Tabs & Search Box */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          {/* Category Tabs */}
          <div className="flex p-1 bg-slate-100 rounded-xl w-full sm:w-auto text-xs font-bold text-slate-600">
            <button
              onClick={() => setFilter('all')}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg transition-all cursor-pointer ${
                filter === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'hover:text-slate-900'
              }`}
            >
              All Utilities ({TOOLS_LIST.length})
            </button>
            <button
              onClick={() => setFilter('free')}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg transition-all cursor-pointer ${
                filter === 'free' ? 'bg-white text-emerald-700 shadow-sm' : 'hover:text-emerald-700'
              }`}
            >
              Free Calculators (3)
            </button>
            <button
              onClick={() => setFilter('paid')}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg transition-all cursor-pointer ${
                filter === 'paid' ? 'bg-white text-indigo-700 shadow-sm' : 'hover:text-indigo-700'
              }`}
            >
              Pro Audit Utilities (5)
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tools, HRA, 2A, B/S..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
            />
          </div>
        </div>

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
                      <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {tool.badge || '100% Free'}
                      </span>
                    ) : isUnlocked ? (
                      <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1 border border-emerald-200">
                        <Check className="w-3.5 h-3.5 text-emerald-600" /> Unlocked
                      </span>
                    ) : (
                      <div className="text-right">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block leading-none">One-time</span>
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
                      <li key={idx} className="text-[11px] text-slate-600 flex items-center gap-1.5">
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
                      <span key={idx} className="text-[10px] font-semibold bg-white px-2.5 py-0.5 rounded-lg border border-slate-200 text-slate-600">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {isUnlocked ? (
                    <Link
                      href={`/tools/${tool.slug}`}
                      className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5 shrink-0 hover:shadow-md"
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

        {/* Bottom Banner: All-Access Pass */}
        <div className="mt-12 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-8 shadow-xl border border-indigo-900/50 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 text-indigo-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" /> Comprehensive Tax & Compliance Suite
            </div>
            <h3 className="text-2xl font-black text-white">Need all 5 Paid Compliance Modules for your firm or practice?</h3>
            <p className="text-slate-300 text-xs max-w-xl">
              Get unlimited lifetime file processing across GSTR-2A reconciliation, PDF sensitive data masking, Schedule III Balance Sheets, and JSON tax computations for flat ₹{bundlePrice}.
            </p>
          </div>
          <button
            onClick={() => setPaywallTool({
              id: 'all-access-pass',
              name: 'All-Access Compliance Suite Pass (All 5 Paid Modules)',
              slug: 'all-access',
              category: 'paid',
              price: bundlePrice,
              shortDesc: 'Unlock all 5 paid CA processing tools in one bundle.',
              description: 'Unlimited file processing pass for all 5 professional tools.',
              icon: 'Sparkles',
              tags: ['Bundle', 'Full Suite'],
              features: ['All 5 Paid Tools Unlocked Forever', 'Priority Server Processing', 'Direct WhatsApp CA Support']
            })}
            className="px-6 py-3.5 bg-gradient-to-r from-indigo-500 to-teal-500 hover:from-indigo-600 hover:to-teal-600 text-white font-extrabold text-sm rounded-xl shadow-lg transition-all shrink-0 flex items-center gap-2"
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

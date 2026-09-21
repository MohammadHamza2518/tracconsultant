'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useConfig } from '@/context/ConfigContext';
import ToolPaywallModal from '@/components/ToolPaywallModal';
import { 
  FileCode2, 
  ShieldCheck, 
  Lock, 
  Unlock, 
  Sparkles, 
  Maximize2, 
  Minimize2,
  CheckCircle2
} from 'lucide-react';

export default function AdvancedComputationGeneratorPage() {
  const { user, hasToolAccess, refreshUser } = useAuth();
  const { getToolPrice } = useConfig();
  const toolId = 'advanced-computation-generator';
  const toolName = 'Computation of Income Generator (Advance)';
  const price = getToolPrice(toolId, 299);

  const isUnlocked = hasToolAccess(toolId);
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50/70 pb-20">
      {/* Breadcrumb Toolbar */}
      <div className="bg-slate-900 border-b border-slate-800 text-white px-4 sm:px-8 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Link href="/tools" className="text-slate-400 hover:text-white transition-colors">
              Tools Suite
            </Link>
            <span className="text-slate-600">/</span>
            <span className="text-emerald-400 font-semibold">{toolName}</span>
          </div>

          <div className="flex items-center gap-3">
            {isUnlocked ? (
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold flex items-center gap-1.5">
                <Unlock className="w-3.5 h-3.5" /> Workspace Unlocked
              </span>
            ) : (
              <button
                onClick={() => setPaywallOpen(true)}
                className="px-3.5 py-1 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm hover:scale-105"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Unlock Tool (₹{price})</span>
              </button>
            )}
            <Link
              href="/tools"
              className="text-slate-300 hover:text-white px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              ← All Tools
            </Link>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-6 relative z-10 space-y-6">
        
        {/* Header Card */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-5 text-white shadow-md border border-indigo-900/40 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase tracking-wider mb-1 border border-indigo-500/30">
              <Sparkles className="w-3 h-3" /> Advance Tax Utility • ITR 1-7 Deep Scan &amp; Vector PDF
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">{toolName}</h1>
            <p className="text-xs text-slate-300 mt-0.5">
              Automated Bank, Loan &amp; Visa submission statement generator. In-depth deduction tables, Chapter VI-A verification &amp; vector jsPDF export.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold border border-white/10 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              <span>{isFullscreen ? 'Exit Fullscreen' : 'Full Screen'}</span>
            </button>
            {!isUnlocked && (
              <button
                onClick={() => setPaywallOpen(true)}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer hover:scale-105"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Instant Unlock (₹{price})</span>
              </button>
            )}
          </div>
        </div>

        {/* Lock Banner if not unlocked */}
        {!isUnlocked && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-3.5 text-amber-900 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-700 shrink-0" />
              <span>
                <strong>Advance Module:</strong> Full computation of income generator for ITR 1 to 7 with live preview. Unlock for <strong>₹{price}</strong> to permanently enable unlimited vector PDF exports.
              </span>
            </div>
            <button
              onClick={() => setPaywallOpen(true)}
              className="px-3.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-xs shrink-0 cursor-pointer"
            >
              Unlock Now
            </button>
          </div>
        )}

        {/* Embedded Workstation */}
        <div className={`bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden transition-all duration-300 ${
          isFullscreen ? 'fixed inset-0 z-50 rounded-none h-screen' : 'h-[900px]'
        }`}>
          <iframe
            src="/tools-embed/computation-generator-advance.html"
            title="Computation of Income Generator (Advance)"
            className="w-full h-full border-0"
          />
        </div>
      </div>

      {/* Paywall Modal */}
      <ToolPaywallModal
        isOpen={paywallOpen}
        onClose={() => setPaywallOpen(false)}
        toolId={toolId}
        toolName={toolName}
        price={price}
        onUnlockSuccess={() => {
          refreshUser();
        }}
      />
    </div>
  );
}

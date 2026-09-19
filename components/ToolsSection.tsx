'use client';

import React from 'react';
import Link from 'next/link';
import { TOOLS_LIST } from '@/lib/data';
import { useConfig } from '@/context/ConfigContext';
import { 
  Layers, 
  Sparkles, 
  ArrowRight, 
  Calculator, 
  Calendar, 
  TrendingUp, 
  EyeOff, 
  FileSpreadsheet, 
  GitCompare, 
  FileCode2, 
  Check, 
  Lock 
} from 'lucide-react';

export default function ToolsSection() {
  const { getToolPrice } = useConfig();
  const getToolIcon = (iconName: string) => {
    switch (iconName) {
      case 'Calculator': return <Calculator className="w-5 h-5 text-emerald-600" />;
      case 'Calendar': return <Calendar className="w-5 h-5 text-emerald-600" />;
      case 'TrendingUp': return <TrendingUp className="w-5 h-5 text-emerald-600" />;
      case 'EyeOff': return <EyeOff className="w-5 h-5 text-indigo-600" />;
      case 'FileSpreadsheet': return <FileSpreadsheet className="w-5 h-5 text-indigo-600" />;
      case 'GitCompare': return <GitCompare className="w-5 h-5 text-indigo-600" />;
      case 'FileCode2': return <FileCode2 className="w-5 h-5 text-indigo-600" />;
      default: return <Sparkles className="w-5 h-5 text-indigo-600" />;
    }
  };

  return (
    <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3 border border-emerald-500/30">
              <Layers className="w-3.5 h-3.5" /> High-Accuracy Financial Engines
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Tax & Compliance Digital Suite
            </h2>
            <p className="text-sm text-slate-400 max-w-2xl mt-2">
              Free Union Budget calculators for taxpayers, plus enterprise-grade tools for GSTR-2A reconciliation, PDF sensitive data masking, and Schedule III Balance Sheets.
            </p>
          </div>

          <Link
            href="/tools"
            className="px-5 py-2.5 bg-white text-slate-900 hover:bg-slate-100 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-md shrink-0"
          >
            <span>Explore Complete Suite (8)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Tools Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {TOOLS_LIST.map((tool) => (
            <Link
              key={tool.id}
              href={`/tools/${tool.slug}`}
              className="bg-slate-800/80 hover:bg-slate-800 rounded-2xl p-5 border border-slate-700/80 hover:border-emerald-500/50 transition-all flex flex-col justify-between group hover:shadow-xl hover:-translate-y-0.5"
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                    {getToolIcon(tool.icon)}
                  </div>
                  {tool.category === 'free' ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      FREE
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      ₹{getToolPrice(tool.id, tool.price)}
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-sm text-white group-hover:text-emerald-400 transition-colors leading-snug">
                  {tool.name}
                </h3>
                <p className="text-[11px] text-slate-400 mt-1.5 line-clamp-2">
                  {tool.shortDesc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between text-[11px]">
                <span className="text-slate-500">{tool.category === 'free' ? 'No Paywall' : 'One-time unlock'}</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  Launch →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

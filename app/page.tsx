import React from 'react';
import Hero from '@/components/Hero';
import FilingWizard from '@/components/FilingWizard';
import ServicesSection from '@/components/ServicesSection';
import ToolsSection from '@/components/ToolsSection';
import TaxCalculator from '@/components/TaxCalculator';
import ComparisonTable from '@/components/ComparisonTable';
import HowItWorks from '@/components/HowItWorks';
import Testimonials from '@/components/Testimonials';
import FaqSection from '@/components/FaqSection';
import Link from 'next/link';
import { ShieldCheck, Phone, CheckCircle2, ArrowRight, Zap, Calculator } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Fast Filing Submission Wizard Section */}
      <section id="file-now" className="py-12 sm:py-16 bg-slate-100 relative z-10 scroll-mt-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <FilingWizard />
        </div>
      </section>

      {/* 3. Comprehensive Services Grid */}
      <ServicesSection />

      {/* 4. Professional CA Tools Suite (Free & Paid) */}
      <ToolsSection />

      {/* 5. Interactive Tax Calculators Section */}
      <section className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
              <Calculator className="w-3.5 h-3.5 text-emerald-600" />
              <span>Free Financial Tools</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B2545] tracking-tight">
              Instant Tax & Compliance Calculators
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Calculate your Old vs New Regime income tax under the latest budget slabs, evaluate your HRA exemptions, or compute GST invoices in seconds.
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <TaxCalculator />
          </div>
        </div>
      </section>

      {/* 5. Why Tracconsultant Comparison Matrix */}
      <ComparisonTable />

      {/* 6. How It Works 4-Step Process */}
      <HowItWorks />

      {/* 7. Client Reviews & Testimonials */}
      <Testimonials />

      {/* 8. Frequently Asked Questions */}
      <FaqSection />

      {/* Final Pre-Footer Call to Action */}
      <section className="py-16 bg-gradient-to-r from-[#0B2545] via-[#07172B] to-[#040e1b] text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
            Don&apos;t wait for the deadline
          </span>
          <h2 className="text-3xl sm:text-4xl font-black">
            Ready to File Your Taxes with Zero Stress?
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
            Get your ITR filed with maximum deductions, verified by a qualified Chartered Accountant, and covered by our 100% Notice Protection guarantee.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="#file-now"
              className="w-full sm:w-auto px-8 py-4 bg-[#00a859] hover:bg-[#008f4c] text-white rounded-xl font-bold text-sm shadow-xl shadow-emerald-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Start Filing with CA Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="tel:+917275922162"
              className="w-full sm:w-auto px-6 py-4 bg-white/10 hover:bg-white/15 text-white border border-white/20 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4 text-emerald-400" />
              <span>Direct CA Call: +91 7275922162</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

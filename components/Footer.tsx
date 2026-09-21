'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Phone, Mail, ShieldCheck, CheckCircle2, Lock, FileText, ArrowRight } from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-[#07172B] text-slate-300 border-t border-[#133b6b]">
      {/* Top Value Strip */}
      <div className="border-b border-slate-800 py-8 bg-[#0B2545]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="flex flex-col justify-center">
                <h4 className="text-white font-semibold text-sm leading-snug">100% Notice Protection</h4>
                <p className="text-xs text-slate-400 mt-0.5">Complete legal CA backing on every filing</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="flex flex-col justify-center">
                <h4 className="text-white font-semibold text-sm leading-snug">Maximum Refund Claimed</h4>
                <p className="text-xs text-slate-400 mt-0.5">Full 80C, 80D, HRA & 87A rebate optimization</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
                <Lock className="w-6 h-6" />
              </div>
              <div className="flex flex-col justify-center">
                <h4 className="text-white font-semibold text-sm leading-snug">Bank-Grade Encryption</h4>
                <p className="text-xs text-slate-400 mt-0.5">256-bit SSL secured confidential data storage</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div className="flex flex-col justify-center">
                <h4 className="text-white font-semibold text-sm leading-snug">Dedicated Personal CA</h4>
                <p className="text-xs text-slate-400 mt-0.5">Direct WhatsApp & call access on every file</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 xl:gap-10">
          
          {/* Brand & About */}
          <div className="lg:col-span-2 space-y-5">
            <div className="relative h-14 w-60">
              <Image 
                src="/logo-banner.png" 
                alt="Tracconsultant" 
                fill 
                className="object-contain brightness-110"
              />
            </div>
            
            <p className="text-sm text-slate-400 leading-relaxed pr-4">
              <strong>Tracconsultant</strong> is India&apos;s premier online tax advisory, GST compliance, and corporate legal facilitation platform. We combine cutting-edge technology with qualified Chartered Accountants to provide error-free filings, notice defense, and end-to-end corporate support.
            </p>

            <div className="space-y-2 pt-1 text-sm">
              <div className="flex items-center gap-2.5 text-slate-300">
                <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Primary Helpline: <a href="tel:+917275922162" className="text-white hover:text-emerald-400 font-medium">+91 7275922162</a></span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-300">
                <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Alternate Support: <a href="tel:+918052171196" className="text-white hover:text-emerald-400 font-medium">+91 8052171196</a></span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-300">
                <Mail className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Email: <a href="mailto:contact@tracconsultant.com" className="text-white hover:text-emerald-400 font-medium">contact@tracconsultant.com</a></span>
              </div>
            </div>
          </div>

          {/* Column 1: ITR Services */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 border-b border-slate-800 pb-2.5">
              Income Tax Filing
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link href="/services/itr-filing" className="hover:text-white transition-colors">Salaried Individuals (ITR-1)</Link></li>
              <li><Link href="/services/itr-filing" className="hover:text-white transition-colors">Multiple Form 16 & HRA</Link></li>
              <li><Link href="/services/itr-filing" className="hover:text-white transition-colors">Capital Gains (Stocks & MF)</Link></li>
              <li><Link href="/services/itr-filing" className="hover:text-white transition-colors">Crypto & Foreign Assets</Link></li>
              <li><Link href="/services/itr-filing" className="hover:text-white transition-colors">Business & Freelancers (ITR-3/4)</Link></li>
              <li><Link href="/services/itr-filing" className="hover:text-white transition-colors">NRI Tax Filing</Link></li>
              <li><Link href="/services/itr-filing" className="hover:text-white transition-colors">Revised / Belated Return</Link></li>
            </ul>
          </div>

          {/* Column 2: GST & Notices */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 border-b border-slate-800 pb-2.5">
              GST & Tax Notices
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link href="/services/gst-filing" className="hover:text-white transition-colors">New GST Registration</Link></li>
              <li><Link href="/services/gst-filing" className="hover:text-white transition-colors">Monthly GSTR-1 & 3B Returns</Link></li>
              <li><Link href="/services/gst-filing" className="hover:text-white transition-colors">Annual GSTR-9 Filing</Link></li>
              <li><Link href="/services/gst-filing" className="hover:text-white transition-colors">GST LUT for Exporters</Link></li>
              <li><Link href="/services/notice-assistance" className="hover:text-white transition-colors">Notice 143(1) Intimation</Link></li>
              <li><Link href="/services/notice-assistance" className="hover:text-white transition-colors">Defective Return 139(9)</Link></li>
              <li><Link href="/services/notice-assistance" className="hover:text-white transition-colors">Section 148 Reassessment</Link></li>
            </ul>
          </div>

          {/* Column 3: Tax & Compliance Suite */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 border-b border-slate-800 pb-2.5">
              Tax & Compliance Suite
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link href="/calculators" className="text-emerald-400 font-bold hover:underline">19 Free Calculators Hub &rarr;</Link></li>
              <li><Link href="/tools" className="hover:text-white transition-colors font-bold text-slate-200">Compliance Suite Hub (15 Tools) &rarr;</Link></li>
              <li><Link href="/tools/ecommerce-gst-converter" className="text-emerald-400 hover:text-emerald-300 transition-colors">E-Commerce GSTR-1 & TCS (Free)</Link></li>
              <li><Link href="/tools/gstin-search" className="text-emerald-400 hover:text-emerald-300 transition-colors">GSTIN Search & Verified PDF (Free)</Link></li>
              <li><Link href="/tools/hsn-search" className="text-emerald-400 hover:text-emerald-300 transition-colors">HSN & SAC Code Finder (Free)</Link></li>
              <li><Link href="/tools/tax-calculator" className="hover:text-white transition-colors">Income Tax Calc FY 2024-25 (Free)</Link></li>
              <li><Link href="/tools/advance-tax-calculator" className="hover:text-white transition-colors">Advance Tax Calc (Free)</Link></li>
              <li><Link href="/tools/gst-invoice-generator" className="hover:text-white transition-colors">GST Tax Invoice Pro (Paid)</Link></li>
              <li><Link href="/services" className="text-teal-400 font-bold hover:underline mt-1 block">20 Services Directory &rarr;</Link></li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Copyright & Legal Links */}
      <div className="border-t border-slate-800/80 py-6 bg-[#040e1b]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <p className="text-center md:text-left">© {new Date().getFullYear()} Tracconsultant Advisory. All rights reserved. Registered Tax & Corporate Legal Consultants.</p>
            <div className="flex items-center gap-4 sm:gap-6 flex-wrap justify-center md:justify-end font-medium">
              <Link href="/privacy-policy" className="hover:text-emerald-400 transition-colors">Privacy Policy</Link>
              <Link href="/terms-of-service" className="hover:text-emerald-400 transition-colors">Terms of Service</Link>
              <Link href="/refund-policy" className="hover:text-emerald-400 transition-colors">Refund & Cancellation</Link>
              <Link href="/shipping-policy" className="hover:text-emerald-400 transition-colors">Shipping & Delivery</Link>
              <Link href="/contact" className="hover:text-emerald-400 transition-colors">Contact Us</Link>
              <Link href="/about" className="hover:text-emerald-400 transition-colors">About Us</Link>
            </div>
          </div>
          
          {/* Regulatory & Payment Gateway Compliance Strip */}
          <div className="pt-3 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400 text-center sm:text-left">
            <span>
              🔒 Payments processed securely via <strong>RBI Authorized Payment Gateways (Razorpay / UPI / NetBanking / Cards)</strong>. 256-Bit SSL Encrypted.
            </span>
            <span className="shrink-0 text-slate-400">
              Office: 2nd Floor, Civil Lines, Kanpur, Uttar Pradesh - 208001 | Tel: +91 7275922162
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

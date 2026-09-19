'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Phone, MessageCircle } from 'lucide-react';

const FAQS = [
  {
    q: 'Which tax regime is better for me in FY 2024-25 / AY 2025-26?',
    a: 'In the latest budget, the New Tax Regime offers a higher standard deduction of ₹75,000 for salaried employees and complete tax rebate under Section 87A for taxable income up to ₹7,00,000 (effectively up to ₹7,75,000 with standard deduction). If you have deductions over ₹3,75,000 (80C, 80D, home loan interest, HRA), the Old Regime might still save you more. Our CAs calculate both regimes side-by-side and choose the one that gives you maximum refund.'
  },
  {
    q: 'How does Tracconsultant protect me from Income Tax Notices?',
    a: 'Unlike automated DIY websites that simply upload whatever is typed, our Chartered Accountants cross-reconcile your salary slips, Form 16, Form 26AS, AIS (Annual Information Statement), and TIS (Taxpayer Information Summary). If there is any discrepancy in employer TDS or bank interest, we fix it before filing. We provide a 100% Notice Guarantee — if any notice arrives, our Senior CA will respond to it free of cost.'
  },
  {
    q: 'Can I send my Form 16 or documents directly on WhatsApp?',
    a: 'Yes! We understand you are busy. You can simply send your Form 16 PDF, bank statement, or notice copy to our official WhatsApp helpline (+91 7275922162). Your assigned CA will acknowledge receipt within 15 minutes and begin preparation.'
  },
  {
    q: 'What is the turnaround time for my ITR filing?',
    a: 'For salaried and basic capital gains returns, we guarantee completion within 24 hours of receiving all necessary documents. For complex business returns (ITR-3/4) or multiple trading accounts, it typically takes 24 to 48 hours.'
  },
  {
    q: 'I received a demand notice under Section 143(1) or 139(9). Can you resolve it?',
    a: 'Yes! We have a specialized Notice & Legal Scrutiny cell. Send us your notice copy immediately. We will diagnose the CPC mismatch, draft a formal reply or Section 154 rectification, and submit it on the e-filing portal to safeguard you from penalties.'
  },
  {
    q: 'How can I track the live status of my application?',
    a: 'You can visit our "Track Application" page anytime, enter your 10-digit mobile number or unique Reference ID (e.g. TRAC-2025-XXXX), and see the live status (e.g. Documents Under Review, CA Assigned, Draft Computation Shared, or Successfully Filed with ITR-V).'
  }
];

export default function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 bg-white border-t border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-bold border border-slate-200">
            <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B2545] tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Everything you need to know about CA-assisted tax filing, notice resolution, and Tracconsultant guarantees.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="border border-slate-200 rounded-2xl overflow-hidden transition-all bg-white"
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  <span className="font-bold text-sm sm:text-base text-slate-900">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-emerald-600 transition-transform duration-200 flex-shrink-0 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-6 sm:px-6 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still Have Questions Box */}
        <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-[#0B2545] text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div>
            <h3 className="text-lg font-bold">Have a specific or complex tax question?</h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Talk directly to our Senior Chartered Accountants right now. No bots, zero wait time.
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <a
              href="tel:+917275922162"
              className="flex items-center gap-2 px-5 py-3 bg-white text-[#0B2545] rounded-xl text-xs font-bold hover:bg-slate-100 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span>Call: 7275922162</span>
            </a>
            <a
              href="https://wa.me/917275922162?text=Hello%20Tracconsultant,%20I%20have%20a%20tax%20question."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-xl text-xs font-bold transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp Us</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}

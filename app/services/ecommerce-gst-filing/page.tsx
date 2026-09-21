import React from 'react';
import Link from 'next/link';
import { 
  ShoppingCart, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  PhoneCall, 
  MessageCircle, 
  ArrowRight, 
  FileSpreadsheet, 
  Sparkles,
  TrendingUp,
  Percent,
  RefreshCw,
  Lock,
  Layers,
  Check,
  AlertCircle,
  Calculator
} from 'lucide-react';
import FilingWizard from '@/components/FilingWizard';

export const metadata = {
  title: 'E-Commerce Seller GST Filing & MTR Automation (Amazon, Flipkart, Meesho) | Tracconsultant',
  description: 'Automated GST filing for Amazon MTR, Flipkart, Meesho, Shopify & Myntra sellers. Table 7 B2CS consolidation, 1% Section 52 TCS credit claim, return netting & Senior CA certification.'
};

const PLANS = [
  {
    name: 'Starter Marketplace',
    price: '₹499',
    period: '/month',
    badge: 'Single Marketplace',
    popular: false,
    desc: 'Perfect for budding sellers on Amazon, Flipkart or Meesho scaling their store.',
    features: [
      '1 Marketplace Channel (Amazon MTR / Flipkart / Meesho)',
      'Up to 500 Monthly Orders consolidated',
      'Table 7 B2CS State-wise Place of Supply netting',
      'Sales Return / RTO orders auto-deducted',
      'Section 52 TCS 1% cash credit claim in GSTR-3B',
      'Monthly GSTR-1 & GSTR-3B filing acknowledgment',
      'Dedicated GST CA Specialist Support'
    ]
  },
  {
    name: 'Multi-Channel Pro',
    price: '₹899',
    period: '/month',
    badge: 'Most Popular',
    popular: true,
    desc: 'Comprehensive multi-platform compliance for high-growth e-commerce brands.',
    features: [
      'All Marketplaces (Amazon + Flipkart + Meesho + Shopify + Quick Commerce)',
      'Up to 3,000 Monthly Orders processed',
      'Automated MTR & GSTR report script ingestion',
      'Full RTO / Return cancellation reconciliation (zero tax leakage)',
      'Section 52 TCS passbook matching against GSTR-2B ITC',
      'Both Monthly GSTR-1 & GSTR-3B filed with Challan assistance',
      'VPOB / APOB (FBA / Flipkart Hub) State GST advisory',
      'Priority WhatsApp Senior CA desk'
    ]
  },
  {
    name: 'Enterprise / Multi-State',
    price: '₹1,799',
    period: '/month',
    badge: 'High Volume & Multi-GSTIN',
    popular: false,
    desc: 'For multi-warehouse sellers registered across multiple Indian States/UTs.',
    features: [
      'Unlimited Orders & Multi-State GSTIN compliance',
      'Inter-warehouse stock transfer (FBA / FC transfers) invoicing',
      'Annual GSTR-9 & GSTR-9C CA reconciliation included',
      'Defective return & notice protection under Sec 139(9)/143(1)',
      'B2B marketplace buyer invoice verification (GSTR-1 Table 4A)',
      'Assigned Partner Chartered Accountant (FCA)'
    ]
  }
];

const COMPARISON = [
  {
    feature: 'Marketplace MTR / CSV parsing',
    trac: 'Automated script algorithm',
    local: 'Manual Excel copy-paste (prone to errors)'
  },
  {
    feature: 'Section 52 TCS 1% Credit Claim',
    trac: '100% matched to reduce your cash tax payout',
    local: 'Frequently overlooked, costing thousands in lost credit'
  },
  {
    feature: 'Return Orders & RTO Reversals',
    trac: 'Accurately netted out per State & Tax Slab',
    local: 'Tax often paid on returned/cancelled orders'
  },
  {
    feature: 'Place of Supply (PoS 37 States/UTs)',
    trac: 'Standard 2-digit Indian State code mapping',
    local: 'Inter-state IGST vs CGST/SGST errors'
  },
  {
    feature: 'Marketplace Password Requirement',
    trac: 'ZERO passwords needed (only tax report CSVs)',
    local: 'Ask for passwords, risking account suspensions'
  },
  {
    feature: 'Supervision & Filing Certification',
    trac: 'ICAI Senior Chartered Accountant panel',
    local: 'Uncertified local data entry operators'
  }
];

const FAQS = [
  {
    q: 'Do I need to share my Amazon or Flipkart seller password?',
    a: 'NEVER! We strictly prioritize your account security. You only need to download your Monthly Tax Report (MTR from Amazon Seller Central > Reports > Tax Document Library) or Flipkart GSTR Report CSV and upload it to our secure portal. We never ask for marketplace credentials.'
  },
  {
    q: 'What is Section 52 TCS and how do you claim it?',
    a: 'Under Section 52 of the CGST Act, e-commerce operators like Amazon and Flipkart deduct 1% TCS (0.5% CGST + 0.5% SGST or 1% IGST) from your net sales value and deposit it to the government against your GSTIN. We file the TCS credit form on your GST portal so this money is transferred directly into your Electronic Cash Ledger, which you can use to pay your GSTR-3B tax liability or claim as refund!'
  },
  {
    q: 'How do you handle customer returns, cancellations, and RTOs?',
    a: 'Marketplaces often process returns weeks after the original order. If an order was shipped in May but returned in June, our automated engine computes negative net taxable value or offsets it against June sales for that specific Place of Supply state and tax rate, preventing you from ever paying GST on returned goods.'
  },
  {
    q: 'Can I test my marketplace report right now for free?',
    a: 'Yes! We have created a 100% free in-browser E-Commerce GSTR-1 & TCS Generator tool right here on Tracconsultant. It runs entirely inside your browser (zero data leaves your computer) and converts your Amazon MTR, Flipkart, or Meesho CSV into official GST portal Table 7 JSON in 3 seconds.'
  }
];

export default function EcommerceGstFilingPage() {
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#0B2545] via-[#091D36] to-[#040e1b] text-white py-16 lg:py-24 relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-[#C9933B]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Specialized E-Commerce Seller Desk</span>
              </span>
              <span className="px-3 py-1 rounded-full bg-white/10 text-slate-300 text-xs font-semibold">
                Amazon • Flipkart • Meesho • Shopify • Myntra
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              Automated GST Filing for <br />
              <span className="text-[#C9933B]">E-Commerce Sellers</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              Stop struggling with messy Amazon MTR, Flipkart sales sheets, and Meesho reports. 
              Our senior Chartered Accountants convert thousands of marketplace orders into 
              <strong> Table 7 B2CS</strong>, claim your <strong>1% Section 52 TCS cash refund</strong>, 
              and deduct all RTO returns — guaranteed 100% error-free.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
              <a
                href="#pricing-plans"
                className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl shadow-lg shadow-emerald-950/40 text-sm flex items-center gap-2 transition-all"
              >
                <span>View Monthly Plans (from ₹499)</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <Link
                href="/tools/ecommerce-gst-converter"
                className="px-6 py-3.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold rounded-2xl text-sm flex items-center gap-2 transition-all backdrop-blur"
              >
                <Calculator className="w-4 h-4 text-emerald-400" />
                <span>Try Free GSTR-1 Generator</span>
              </Link>
            </div>

            {/* Trust badges */}
            <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-300 border-t border-white/10">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero Password Needed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>1% TCS Cash Credit</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Return & RTO Netting</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Senior CA Supervised</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The 4 Major E-Commerce Seller Headaches We Solve */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs uppercase font-bold tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Why Marketplace Sellers Choose Us
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              E-Commerce GST is totally different from offline business
            </h2>
            <p className="text-sm text-slate-500">
              Traditional accountants fail with multi-state place of supply, TCS Section 52, and high return ratios. Here is how we protect your profits:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-3 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <Percent className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Section 52 TCS Credit Claim</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Marketplaces deduct 1% from your sales. Most sellers leave this unclaimed! We pull your TCS credit directly into your Electronic Cash Ledger so you can offset your 3B tax.
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-3 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                <RefreshCw className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Customer Return & RTO Netting</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Returns average 15-30% on Meesho and Amazon. We dynamically adjust returns against outward supply so you never pay tax on products that were cancelled or sent back.
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-3 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">37 States Place of Supply</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Table 7 B2CS requires state-by-state segregation with proper 2-digit Indian State Codes. Our automated algorithm batches orders by recipient pincode and state instantly.
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-3 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Zero Password Sharing</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Sharing marketplace passwords risks OTP triggers and Amazon account deactivations. We strictly work off downloaded CSV/Excel tax reports. Your store stays 100% secure.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section id="pricing-plans" className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs uppercase font-bold tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Transparent Fixed Retainership
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Select Your Monthly E-Commerce GST Plan
          </h2>
          <p className="text-sm text-slate-500">
            No hidden fees. Every plan includes GSTR-1, GSTR-3B, and Section 52 TCS claim certification by Senior Chartered Accountants.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {PLANS.map((plan, idx) => (
            <div 
              key={idx}
              className={`rounded-3xl p-7 sm:p-8 flex flex-col justify-between transition-all relative ${
                plan.popular 
                  ? 'bg-slate-900 text-white ring-4 ring-emerald-500/50 shadow-2xl scale-105' 
                  : 'bg-white text-slate-900 border border-slate-200 shadow-md'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 bg-emerald-500 text-slate-950 font-black text-[11px] uppercase tracking-wider rounded-full shadow-md">
                  Most Popular for Sellers
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                    plan.popular ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {plan.badge}
                  </span>
                  <h3 className="text-xl font-black mt-2">{plan.name}</h3>
                  <p className={`text-xs mt-1 ${plan.popular ? 'text-slate-300' : 'text-slate-500'}`}>
                    {plan.desc}
                  </p>
                </div>

                <div className="flex items-baseline gap-1 pt-2 border-t border-slate-200/20">
                  <span className="text-4xl font-black">{plan.price}</span>
                  <span className={`text-xs ${plan.popular ? 'text-slate-300' : 'text-slate-500'}`}>{plan.period}</span>
                </div>

                <div className="space-y-2.5 pt-4">
                  {plan.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2 text-xs">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span className={plan.popular ? 'text-slate-200' : 'text-slate-700'}>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8 mt-6 border-t border-slate-200/20 space-y-2">
                <a
                  href={`https://wa.me/917275922162?text=${encodeURIComponent(`Hello Tracconsultant, I want to subscribe to the E-Commerce GST Plan (${plan.name} - ${plan.price}${plan.period}). My marketplace store is on Amazon/Flipkart/Meesho.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full py-3.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md ${
                    plan.popular
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Subscribe to {plan.name}</span>
                </a>

                <Link
                  href="/consult-ca"
                  className={`w-full py-2.5 rounded-xl text-center text-xs font-semibold block transition-colors ${
                    plan.popular ? 'text-slate-300 hover:text-white' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Ask a Question First
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Free Tool Callout Card */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-[#0B2545] rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-xl space-y-3">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              100% Free Self-Service Tool
            </span>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
              Test Our In-Browser E-Commerce GSTR-1 Generator
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Upload your Amazon MTR, Flipkart GSTR, or Meesho CSV and get instant State-wise Table 7 B2CS consolidation, Section 52 TCS estimation, and download government portal uploadable JSON in seconds. Zero server upload.
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row gap-3">
            <Link
              href="/tools/ecommerce-gst-converter"
              className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl shadow-lg text-xs sm:text-sm flex items-center justify-center gap-2 transition-all"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Launch GSTR-1 Converter</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Tracconsultant vs Traditional Accountants
            </h2>
            <p className="text-xs text-slate-500">
              Why regular accountants make costly mistakes with marketplace reports
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-900 text-white font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-4">Feature / Process</th>
                  <th className="p-4 text-emerald-400">Tracconsultant E-Commerce Hub</th>
                  <th className="p-4 text-slate-400">Regular Local Accountant</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {COMPARISON.map((c, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="p-4 font-bold text-slate-800">{c.feature}</td>
                    <td className="p-4 text-emerald-700 font-semibold flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{c.trac}</span>
                    </td>
                    <td className="p-4 text-slate-500">{c.local}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Frequently Asked Questions</h2>
          <p className="text-xs text-slate-500">Everything e-commerce sellers need to know about GST & TCS</p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{faq.q}</span>
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed pl-6">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-slate-900 text-white py-14">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <h2 className="text-2xl sm:text-4xl font-black">
            Ready to streamline your marketplace GST?
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Get your Amazon, Flipkart, Meesho or Shopify returns filed on time with zero penalties and maximum TCS refund credit.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <a
              href="https://wa.me/917275922162?text=Hello%20Tracconsultant,%20I%20am%20an%20ecommerce%20seller%20and%20want%20to%20file%20my%20GST."
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat with Senior CA on WhatsApp</span>
            </a>
            <Link
              href="/consult-ca"
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs sm:text-sm transition-all"
            >
              <span>Book Formal Notice Advisory</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

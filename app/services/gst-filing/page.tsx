import React from 'react';
import Link from 'next/link';
import { 
  Briefcase, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Phone, 
  MessageCircle, 
  ArrowRight, 
  FileSpreadsheet, 
  AlertCircle 
} from 'lucide-react';
import FilingWizard from '@/components/FilingWizard';

export const metadata = {
  title: 'GST Registration & Monthly Return Filing | Tracconsultant',
  description: 'Fast-track GST Registration ARN in 3-5 days. Monthly GSTR-1, GSTR-3B, GSTR-9 annual filing, and Input Tax Credit reconciliation with expert GST practitioners.'
};

const GST_SERVICES = [
  {
    name: 'New GST Registration',
    price: '₹999',
    turnaround: '3-5 Days',
    desc: 'Proprietorship, Partnership, LLP, or Private Limited Company registration.',
    features: [
      'Document preparation & portal upload',
      'Instant ARN generation',
      'HSN / SAC code consultancy',
      'Biometric / Aadhaar authentication guidance',
      'Free first month GSTR filing'
    ]
  },
  {
    name: 'Monthly GSTR-1 & 3B Filing',
    price: '₹799/mo',
    turnaround: 'Before 20th',
    popular: true,
    desc: 'Complete monthly sales reporting, tax calculation, and ITC offset.',
    features: [
      'Sales invoice data entry & reconciliation',
      'GSTR-2B Input Tax Credit (ITC) matching',
      'Tax challan generation & payment assistance',
      'Zero penalty assurance',
      'Monthly business performance tax memo'
    ]
  },
  {
    name: 'Quarterly QRMP Scheme Returns',
    price: '₹1,499/qtr',
    turnaround: 'Quarterly',
    desc: 'For small taxpayers with turnover up to ₹5 Crores choosing QRMP.',
    features: [
      'Quarterly GSTR-1 & 3B filing',
      'Monthly PMT-06 challan payments',
      'IFF (Invoice Furnishing Facility) uploads',
      'ITC tracking across quarter',
      'Quarterly advisory review'
    ]
  },
  {
    name: 'Annual GSTR-9 & 9C Reconciliation',
    price: '₹3,499',
    turnaround: '3-5 Days',
    desc: 'Mandatory annual GST consolidation and audit certificate.',
    features: [
      'Annual sales books vs portal reconciliation',
      'Reversal of blocked / ineligible ITC',
      'Form GSTR-9C CA reconciliation statement',
      'Protection from GST departmental notices',
      'Complete audit support'
    ]
  },
  {
    name: 'GST LUT for Exporters',
    price: '₹899',
    turnaround: '24 Hours',
    desc: 'Letter of Undertaking to export goods or services without paying IGST.',
    features: [
      'Form RFD-11 filing on GST portal',
      'Valid for full financial year',
      'Zero IGST blocking on working capital',
      'Official ARN acknowledgement',
      'Export compliance checklist'
    ]
  }
];

export default function GstFilingPage() {
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-b from-[#0B2545] via-[#07172B] to-[#040e1b] text-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/30">
              Zero Late Fee Assurance
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              GST Registration & Hassle-Free Monthly Returns
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Never let GST compliances slow down your business. Our certified GST practitioners reconcile your GSTR-2B input credits, calculate offsets, and file before the statutory deadlines.
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <a
                href="#gst-plans"
                className="px-6 py-3.5 bg-[#00a859] hover:bg-[#008f4c] text-white font-bold text-sm rounded-xl shadow-lg transition-all"
              >
                Explore GST Plans
              </a>
              <a
                href="tel:+917275922162"
                className="flex items-center gap-2 px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm rounded-xl border border-white/20 transition-all"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>GST Helpline: +91 7275922162</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Plans */}
      <section id="gst-plans" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">End-to-End Compliance</span>
          <h2 className="text-3xl font-black text-[#0B2545] mt-1">GST Services & Transparent Pricing</h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">Choose one-time registration or regular monthly retainers.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {GST_SERVICES.map((plan, idx) => (
            <div 
              key={idx} 
              className={`bg-white rounded-3xl p-6 border transition-all flex flex-col justify-between relative shadow-sm hover:shadow-xl ${
                plan.popular ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-200'
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 right-6 bg-emerald-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                  Most Popular
                </span>
              )}

              <div>
                <h3 className="text-lg font-bold text-slate-900">{plan.name}</h3>
                <p className="text-xs text-slate-500 mt-1 min-h-[32px]">{plan.desc}</p>

                <div className="my-5 pb-4 border-b border-slate-100 flex items-baseline justify-between">
                  <div>
                    <span className="text-3xl font-black text-[#0B2545]">{plan.price}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                    <Clock className="w-3 h-3 text-emerald-600" />
                    <span>{plan.turnaround}</span>
                  </div>
                </div>

                <div className="space-y-2.5 mb-6">
                  {plan.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2 text-xs text-slate-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <Link
                  href={`/pay?plan=${encodeURIComponent(plan.name)}&price=${plan.price.replace(/[^0-9]/g, '')}`}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-[#0B2545] hover:bg-[#133b6b] text-white text-xs font-bold rounded-xl transition-colors shadow-md"
                >
                  <span>Book This Service</span>
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                </Link>

                <a
                  href={`https://wa.me/917275922162?text=${encodeURIComponent(`Hello Tracconsultant! I am interested in GST service: ${plan.name}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-1.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-xl transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Embedded Filing Form */}
      <section className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-black text-[#0B2545]">Request GST Registration or Filing</h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">Our GST team will verify your invoices and file returns with zero penalties.</p>
        </div>
        <FilingWizard initialService="GST Services" />
      </section>
    </div>
  );
}

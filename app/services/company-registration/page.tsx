import React from 'react';
import Link from 'next/link';
import { 
  Building2, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Phone, 
  MessageCircle, 
  ArrowRight, 
  FileCheck, 
  Award,
  Sparkles
} from 'lucide-react';
import FilingWizard from '@/components/FilingWizard';

export const metadata = {
  title: 'Company Registration & Startup Legal Incorporation | Tracconsultant',
  description: 'Incorporate Private Limited Company, LLP, OPC, MSME Udyam, and Trademark with dedicated Chartered Accountants and Company Secretaries.'
};

const ENTITY_PLANS = [
  {
    name: 'Private Limited Company (Pvt Ltd)',
    price: '₹5,999 + Govt Fees',
    popular: true,
    turnaround: '7-10 Days',
    desc: 'The gold standard for startups raising capital, venture backing, and tech companies.',
    features: [
      'RUN Name reservation & approval',
      '2 Digital Signature Certificates (DSC Class 3)',
      '2 Director Identification Numbers (DIN)',
      'Drafting tailored MOA & AOA',
      'Certificate of Incorporation (SPICe+ Part B)',
      'Company PAN, TAN & Bank Account opening assistance'
    ]
  },
  {
    name: 'Limited Liability Partnership (LLP)',
    price: '₹4,499 + Govt Fees',
    turnaround: '7 Days',
    desc: 'Ideal for consulting firms, agencies, and professional partnerships looking for low compliance.',
    features: [
      'LLP Name approval on MCA',
      '2 Partner DSCs & DPINs',
      'Drafting customized LLP Agreement',
      'Certificate of Incorporation (FiLLiP)',
      'LLP PAN & TAN issue'
    ]
  },
  {
    name: 'MSME / Udyam Registration',
    price: '₹499',
    turnaround: '24 Hours',
    desc: 'Avail priority government subsidies, collateral-free bank loans, and delayed payment protections.',
    features: [
      'Government Udyam Registration Certificate',
      'Priority lending & lower interest rates from banks',
      'Subsidies on ISO certification and patents',
      'Exemption on government tenders EMD',
      'Protection against delayed client payments (MSME Samadhaan)'
    ]
  },
  {
    name: 'Trademark (TM) Registration',
    price: '₹2,999 + Govt Fees',
    turnaround: '24 Hours',
    desc: 'Protect your brand name, logo, and slogan from competitors and counterfeiters.',
    features: [
      'Exhaustive Trademark Search across all 45 classes',
      'Selection of correct Nice Class classification',
      'Filing Form TM-A on IP India Portal',
      'Instant authorization to use ™ symbol',
      'Tracking examination report till Registered (®)'
    ]
  }
];

export default function CompanyRegistrationPage() {
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-b from-[#0B2545] via-[#07172B] to-[#040e1b] text-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/30">
              MCA & Startup India Experts
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Launch Your Business Legally in India
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              From SPICe+ MCA incorporation to Digital Signatures, MOA/AOA drafting, and Trademark protection — our experienced Company Secretaries and Chartered Accountants handle it all.
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <a
                href="#business-plans"
                className="px-6 py-3.5 bg-[#00a859] hover:bg-[#008f4c] text-white font-bold text-sm rounded-xl shadow-lg transition-all"
              >
                View Incorporation Packages
              </a>
              <a
                href="tel:+917275922162"
                className="flex items-center gap-2 px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm rounded-xl border border-white/20 transition-all"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>Incorporation Desk: +91 7275922162</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Plans */}
      <section id="business-plans" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Entity Structures</span>
          <h2 className="text-3xl font-black text-[#0B2545] mt-1">Company Setup & Brand Protection</h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">Select the ideal legal structure for your new venture.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ENTITY_PLANS.map((plan, idx) => (
            <div 
              key={idx} 
              className={`bg-white rounded-3xl p-6 sm:p-8 border transition-all flex flex-col justify-between relative shadow-sm hover:shadow-xl ${
                plan.popular ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-200'
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 right-6 bg-emerald-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                  Most Popular
                </span>
              )}

              <div>
                <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
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
                  <span>Book Incorporation</span>
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                </Link>

                <a
                  href={`https://wa.me/917275922162?text=${encodeURIComponent(`Hello Tracconsultant! I want to incorporate: ${plan.name}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-1.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-xl transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Talk with CS on WhatsApp</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Submission Form */}
      <section className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-black text-[#0B2545]">Start Your Incorporation Request</h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">Submit your name and directors info for fast MCA name approval.</p>
        </div>
        <FilingWizard initialService="Company Registration" />
      </section>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  Briefcase, 
  AlertTriangle, 
  Building2, 
  BookOpenCheck, 
  ArrowRight, 
  Check, 
  Clock, 
  Shield, 
  HelpCircle,
  Sparkles
} from 'lucide-react';

interface ServicesSectionProps {
  onSelectService?: (serviceName: string) => void;
}

const CATEGORIES = [
  { id: 'itr', label: 'Income Tax (ITR)', icon: FileText },
  { id: 'gst', label: 'GST Compliance', icon: Briefcase },
  { id: 'notice', label: 'Notice Scrutiny', icon: AlertTriangle },
  { id: 'business', label: 'Company Setup', icon: Building2 },
  { id: 'accounting', label: 'Accounting & TDS', icon: BookOpenCheck },
];

const SERVICES_DATA: Record<string, {
  title: string;
  badge: string;
  desc: string;
  cards: {
    title: string;
    sub: string;
    price: string;
    turnaround: string;
    features: string[];
    tag?: string;
  }[];
}> = {
  itr: {
    title: 'Income Tax Return (ITR) Filing',
    badge: 'AY 2025-26 Live',
    desc: 'Expert CA assistance for salaried, investors, business owners, and NRIs. 100% Notice Protection included.',
    cards: [
      {
        title: 'Salaried Basic (ITR-1)',
        sub: 'Single Form 16, interest income, house property',
        price: '₹499',
        turnaround: '24 Hours',
        features: [
          'Form 16 & AIS/TIS Reconciliation',
          'Standard Deduction ₹75,000 applied',
          '80C, 80D, 87A Rebate Maximization',
          'ITR-V Govt Acknowledgement',
          'Free WhatsApp CA consultation'
        ],
        tag: 'Most Popular'
      },
      {
        title: 'Salaried Multi-Job & HRA',
        sub: 'Multiple Form 16, switch jobs, rent receipts',
        price: '₹999',
        turnaround: '24 Hours',
        features: [
          'Reconciliation across multiple employers',
          'HRA Exemption & Rent receipts verification',
          'Tax mismatch resolution (Form 26AS)',
          'Loss adjustment from house property',
          'Direct call with senior CA'
        ]
      },
      {
        title: 'Capital Gains & Crypto (ITR-2)',
        sub: 'Stocks, Mutual funds, F&O, Crypto, Real estate',
        price: '₹1,999',
        turnaround: '24-48 Hours',
        features: [
          'Zerodha / Groww / Upstox P&L import',
          'STCG (20%) & LTCG (12.5%) computation',
          'Set-off & carry-forward of trading losses',
          'Crypto / VDA 30% tax calculation',
          'Property sale capital gain tax exemption 54/54EC'
        ]
      },
      {
        title: 'Business & Freelancers (ITR-3/4)',
        sub: 'Section 44AD, 44ADA presumptive & books',
        price: '₹2,499',
        turnaround: '48 Hours',
        features: [
          'Section 44ADA 50% profit declaration',
          'P&L & Balance sheet preparation',
          'GST turnover reconciliation',
          'Advance tax planning',
          'Complete audit support'
        ]
      }
    ]
  },
  gst: {
    title: 'GST Registration & Return Filing',
    badge: 'Government Compliant',
    desc: 'Never miss a filing deadline or pay late fees. Dedicated GST practitioners for your business.',
    cards: [
      {
        title: 'New GST Registration',
        sub: 'Proprietorship, Partnership, LLP & Pvt Ltd',
        price: '₹999',
        turnaround: '3-5 Days',
        features: [
          'Document verification & ARN generation',
          'GST Certificate issuance',
          'HSN/SAC Code advisory',
          'Aadhaar biometric authentication support',
          'Free first monthly return filing'
        ],
        tag: 'Fast-Track ARN'
      },
      {
        title: 'Monthly GSTR-1 & GSTR-3B',
        sub: 'Monthly sales and ITC offset filing',
        price: '₹799/mo',
        turnaround: 'Before 20th',
        features: [
          'Sales invoice data entry & B2B/B2C upload',
          'GSTR-2B Input Tax Credit (ITC) reconciliation',
          'Tax payment challan creation',
          'Zero penalty assurance',
          'Monthly tax summary report'
        ]
      },
      {
        title: 'Annual GSTR-9 & 9C',
        sub: 'Consolidated annual return and reconciliation',
        price: '₹3,499',
        turnaround: '3-5 Days',
        features: [
          'Annual books vs GST portal reconciliation',
          'Reversal of ineligible ITC',
          'Form GSTR-9C CA certification',
          'Full audit defense support',
          'Detailed discrepancy memo'
        ]
      },
      {
        title: 'GST LUT for Exporters',
        sub: 'Letter of Undertaking for zero-rated supply',
        price: '₹899',
        turnaround: '24 Hours',
        features: [
          'LUT Form filing on GST portal',
          'Export of goods/services without IGST',
          'Valid for entire financial year',
          'Official ARN acknowledgement',
          'Export invoice guidance'
        ]
      }
    ]
  },
  notice: {
    title: 'Income Tax Notice Scrutiny & Defense',
    badge: 'Urgent Legal CA Support',
    desc: 'Received a demand or defective notice? Our Senior Tax Advocates and CAs draft formal replies to save you from penalties.',
    cards: [
      {
        title: 'Notice 143(1) Tax Demand',
        sub: 'Intimation order with tax payable or refund reduction',
        price: '₹999',
        turnaround: 'Same Day',
        features: [
          'In-depth notice error diagnosis',
          'Employer TDS mismatch verification',
          'Online response submission on e-portal',
          'Demand stay petition if applicable',
          'Direct telecon with Lead Tax Advocate'
        ],
        tag: 'Emergency Response'
      },
      {
        title: 'Defective Return Notice 139(9)',
        sub: 'Notice issued due to missing schedules or data errors',
        price: '₹1,499',
        turnaround: '24 Hours',
        features: [
          'Diagnosis of defect identified by CPC',
          'Preparation of corrected XML / JSON schema',
          'Filing response within mandatory 15 days',
          'Avoid invalidation of original return',
          'Penalty prevention'
        ]
      },
      {
        title: 'Section 148 Reassessment',
        sub: 'Income escaping assessment & high value transactions',
        price: '₹4,999',
        turnaround: 'Priority',
        features: [
          'Detailed factual & legal analysis',
          'Drafting objections under Section 148A(b)',
          'Bank statement & cash transaction defense',
          'Senior CA representation before AO',
          'Complete scrutiny dossier'
        ]
      },
      {
        title: 'Section 154 Rectification',
        sub: 'Correcting apparent errors on tax records',
        price: '₹1,299',
        turnaround: '24-48 Hours',
        features: [
          'Rectification request for excess tax paid',
          'TDS credit / 26AS mismatch rectification',
          'Release of stuck tax refunds',
          'Status tracking till refund credited',
          'Written legal submission'
        ]
      }
    ]
  },
  business: {
    title: 'Company & Business Registration',
    badge: 'Startup India Registered',
    desc: 'Launch your dream business legally with government registrations, certificates, and compliances.',
    cards: [
      {
        title: 'Private Limited Company',
        sub: 'Most preferred structure for fundraising & startups',
        price: '₹5,999 + Govt Fees',
        turnaround: '7-10 Days',
        features: [
          'Name approval (RUN) & 2 DSC tokens',
          '2 DIN (Director Identification Numbers)',
          'Drafting of MOA & AOA',
          'PAN, TAN & Bank Account opening assistance',
          'Certificate of Incorporation (SPICe+)'
        ],
        tag: 'Best for Startups'
      },
      {
        title: 'Limited Liability Partnership (LLP)',
        sub: 'Low compliance structure for service & tech firms',
        price: '₹4,499 + Govt Fees',
        turnaround: '7 Days',
        features: [
          'LLP Name reservation & 2 DSCs',
          'Drafting tailored LLP Partnership Agreement',
          'Certificate of Incorporation',
          'PAN & TAN for LLP',
          '1st Year compliance roadmap'
        ]
      },
      {
        title: 'MSME / Udyam Certificate',
        sub: 'Avail government subsidies, bank loans & tenders',
        price: '₹499',
        turnaround: '24 Hours',
        features: [
          'Lifetime valid Udyam Registration',
          'Priority sector bank lending benefits',
          'Protection against delayed buyer payments',
          'Subsidy on patent & trademark filing',
          'Official Government Certificate'
        ]
      },
      {
        title: 'Trademark Registration',
        sub: 'Protect your brand name, logo and slogan',
        price: '₹2,999 + Govt Fees',
        turnaround: '24 Hours',
        features: [
          'Comprehensive Trademark Search report',
          'Selection of correct Nice Class (1-45)',
          'Filing TM-A on IP India Portal',
          'Use of ™ symbol immediately upon filing',
          'Tracking till Registered (®) status'
        ]
      }
    ]
  },
  accounting: {
    title: 'Accounting, TDS & Audit Services',
    badge: 'Complete Corporate Peace of Mind',
    desc: 'End-to-end financial book-keeping, TDS deductions, statutory audits, and ROC filing.',
    cards: [
      {
        title: 'Monthly Bookkeeping',
        sub: 'Tally / Zoho / QuickBooks ledger maintenance',
        price: 'From ₹1,999/mo',
        turnaround: 'Monthly',
        features: [
          'Bank reconciliation & ledger posting',
          'Monthly Profit & Loss and Balance Sheet',
          'Accounts payable & receivable tracking',
          'Expense voucher verification',
          'CA review every quarter'
        ]
      },
      {
        title: 'Quarterly TDS Returns',
        sub: 'Form 24Q (Salary) & 26Q (Vendor payments)',
        price: '₹999/qtr',
        turnaround: 'Before 31st',
        features: [
          'TDS challan verification & FVU generation',
          'Filing Form 24Q, 26Q & 27Q on TRACES',
          'Generation of Form 16 / 16A certificates',
          'Zero default / interest penalty guarantee',
          'TDS demand resolution'
        ]
      },
      {
        title: 'Tax Audit (Sec 44AB)',
        sub: 'For turnover > ₹1 Cr (business) / ₹50 L (profession)',
        price: 'Custom Quote',
        turnaround: 'Before Sep 30',
        features: [
          'Form 3CA/3CB and Form 3CD preparation',
          'Comprehensive internal financial check',
          'Stock valuation & depreciation verification',
          'Direct sign-off by practicing CA',
          'Upload to Govt e-filing portal'
        ]
      },
      {
        title: 'ROC Annual Filing (AOC-4 & MGT-7)',
        sub: 'Mandatory annual MCA filing for Pvt Ltd & LLP',
        price: '₹4,999',
        turnaround: 'Annual',
        features: [
          'Preparation of Directors Report & AGM minutes',
          'Filing Financial Statements (Form AOC-4)',
          'Filing Annual Return (Form MGT-7/7A)',
          'LLP Form 11 & Form 8 compliance',
          'Avoid heavy ₹100/day MCA late penalties'
        ]
      }
    ]
  }
};

export default function ServicesSection({ onSelectService }: ServicesSectionProps) {
  const [activeCat, setActiveCat] = useState<string>('itr');
  const activeData = SERVICES_DATA[activeCat] || SERVICES_DATA.itr;

  return (
    <section id="services" className="py-20 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Comprehensive Financial & Legal Suite</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B2545] tracking-tight">
            Tailored Services for Every Taxpayer & Business
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            From quick salaried tax returns to complex GST audits and corporate incorporations — every file is handled by experienced Chartered Accountants.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = activeCat === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCat(cat.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#0B2545] text-white shadow-lg shadow-[#0B2545]/20 scale-105'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-emerald-400' : 'text-slate-500'}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Category Description Banner */}
        <div className="bg-gradient-to-r from-[#0B2545] to-[#133b6b] rounded-3xl p-6 text-white mb-8 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">{activeData.badge}</span>
            <h3 className="text-xl sm:text-2xl font-black mt-1">{activeData.title}</h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">{activeData.desc}</p>
          </div>
          <Link
            href="#file-now"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all flex-shrink-0"
          >
            <span>File in this Category</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {activeData.cards.map((card, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 border border-slate-200 hover:border-emerald-500 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group relative"
            >
              {card.tag && (
                <div className="absolute -top-3 right-6 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md uppercase tracking-wider">
                  {card.tag}
                </div>
              )}

              <div>
                <h4 className="font-bold text-base text-slate-900 group-hover:text-emerald-700 transition-colors">
                  {card.title}
                </h4>
                <p className="text-xs text-slate-500 mt-1 min-h-[32px]">{card.sub}</p>

                <div className="my-5 pb-4 border-b border-slate-100 flex items-baseline justify-between">
                  <div>
                    <span className="text-2xl font-black text-[#0B2545]">{card.price}</span>
                    <span className="text-[11px] text-slate-500 ml-1">all-inclusive</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                    <Clock className="w-3 h-3 text-emerald-600" />
                    <span>{card.turnaround}</span>
                  </div>
                </div>

                <div className="space-y-2.5 mb-6">
                  {card.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2 text-xs text-slate-600">
                      <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span className="leading-snug">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="#file-now"
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold text-[#0B2545] bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 border border-slate-200 transition-colors"
                >
                  <span>Select Plan & File</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

            </div>
          ))}
        </div>

        {/* All 20 Services Directory Banner */}
        <div className="mt-12 p-6 bg-gradient-to-r from-emerald-900 via-slate-900 to-slate-950 text-white rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1.5 text-center md:text-left">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
              Full Spectrum Corporate & Legal Advisory
            </span>
            <h4 className="text-xl font-bold text-white">Need Trademark, FSSAI, ISO, RSUs, or CMA Loan Reports?</h4>
            <p className="text-xs text-slate-300 max-w-2xl">
              We offer 20 specialized professional services spanning Trust Incorporation, Partnership Deeds, MSME Udyam, and Foreign Stock (RSUs) advisory.
            </p>
          </div>
          <Link
            href="/services"
            className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-2 shrink-0"
          >
            <span>View All 20 Services Directory</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Emergency Notice Banner */}
        <div className="mt-8 p-6 sm:p-8 bg-amber-50 border border-amber-200 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-amber-500 text-white rounded-2xl flex-shrink-0">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-amber-950">Received an Income Tax Notice or 143(1) Demand?</h4>
              <p className="text-xs sm:text-sm text-amber-800 mt-1 max-w-2xl">
                Do not ignore statutory notices! Non-response can lead to 200% penalties or bank lien orders. Send us your notice copy right now on WhatsApp for a free 15-minute CA assessment.
              </p>
            </div>
          </div>
          <a
            href="https://wa.me/917275922162?text=Hello%20Tracconsultant!%20I%20have%20received%20an%20Income%20Tax%20Notice.%20Need%20urgent%20CA%20analysis."
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors flex-shrink-0"
          >
            <span>Send Notice on WhatsApp (7275922162)</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

      </div>
    </section>
  );
}

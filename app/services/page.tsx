'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useConfig } from '@/context/ConfigContext';
import { SERVICES_LIST, ServiceConfig } from '@/lib/data';
import { 
  Briefcase, 
  Search, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  FileText, 
  Sparkles, 
  PhoneCall, 
  X,
  Scale,
  TrendingUp,
  Coins,
  Globe,
  Percent,
  Building2,
  Landmark,
  FileSignature,
  Store,
  Rocket,
  FileSpreadsheet,
  BadgeCheck,
  Users,
  KeyRound,
  BarChart3,
  Receipt,
  MessageCircle,
  HelpCircle,
  ChevronRight
} from 'lucide-react';

const SERVICE_ICONS: Record<string, any> = {
  'itr-filing': FileText,
  'company-incorporation': Building2,
  'gst-filing': Receipt,
  'notice-assistance': Scale,
  'income-tax-notices': Scale,
  'trademark-registration': BadgeCheck,
  'tax-planning': TrendingUp,
  'trust-incorporation': Landmark,
  'bookkeeping-accounting': FileSpreadsheet,
  'capital-gain-advisory': Coins,
  'fssai-license': ShieldCheck,
  'iso-certificates': BadgeCheck,
  'rsus-taxation': Globe,
  'epf-esi-consultation': Users,
  'dsc-services': KeyRound,
  'partnership-deeds': FileSignature,
  'msme-udyam-registration': Store,
  'startup-registration': Rocket,
  'tds-return-filing': Percent,
  'cma-report': BarChart3,
  'loans-consultancy': Receipt,
};

export default function ServicesDirectoryPage() {
  const { getService } = useConfig();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [consultModalService, setConsultModalService] = useState<ServiceConfig | null>(null);

  // Booking form state
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const categories = [
    { id: 'all', label: 'All 20 Services', icon: Briefcase },
    { id: 'income_tax', label: 'Income Tax & Appeals', icon: Scale },
    { id: 'corporate_legal', label: 'Business Setup & Corporate', icon: Building2 },
    { id: 'gst', label: 'GST Compliance', icon: Receipt },
    { id: 'accounting_cma', label: 'Accounting & CMA', icon: BarChart3 },
    { id: 'advisory_wealth', label: 'Tax Planning & RSUs', icon: TrendingUp },
    { id: 'licenses_certifications', label: 'Licenses & Certifications', icon: ShieldCheck },
  ];

  const filteredServices = useMemo(() => {
    return SERVICES_LIST.filter(s => {
      const matchesCat = activeCategory === 'all' || s.category === activeCategory;
      const q = search.toLowerCase().trim();
      const matchesSearch = !q || 
        s.title.toLowerCase().includes(q) ||
        s.shortDesc.toLowerCase().includes(q) ||
        s.categoryLabel.toLowerCase().includes(q) ||
        (s.subServices && s.subServices.some(sub => sub.toLowerCase().includes(q)));
      return matchesCat && matchesSearch;
    });
  }, [activeCategory, search]);

  const handleBookConsultation = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          mobile,
          email,
          serviceInterest: consultModalService?.title || 'General CA Consultation',
          message,
          source: 'Services Directory'
        })
      });

      if (res.ok) {
        setBookingSuccess(true);
        setTimeout(() => {
          setBookingSuccess(false);
          setConsultModalService(null);
          setFullName('');
          setMobile('');
          setEmail('');
          setMessage('');
        }, 3000);
      } else {
        alert('Failed to submit consultation request');
      }
    } catch (e: any) {
      alert('Network error: ' + e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pb-24">
      {/* Hero Header */}
      <div className="bg-gradient-to-b from-slate-900 via-[#0B2545] to-slate-900 text-white py-16 px-4 sm:px-8 border-b border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#C9933B]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto text-center relative z-10 space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold tracking-wide">
            <ShieldCheck className="w-3.5 h-3.5" /> Handled by Senior In-House Chartered Accountants
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white max-w-3xl mx-auto">
            All 20 Professional CA Services
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto">
            From ITR filing and Company Incorporation to GST, Trademark, and CMA bank loan projections. Zero notice hassle with maximum legal tax deductions.
          </p>

          {/* Primary Action Path in Hero */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <a
              href="#services-grid"
              className="w-full sm:w-auto px-7 py-3.5 bg-[#00a859] hover:bg-[#008f4c] text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-900/40 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Explore All 20 Services Below</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="https://wa.me/917275922162?text=Hello%20Tracconsultant!%20I%20need%20expert%20CA%20advice%20for%20my%20tax%20or%20business."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3.5 bg-white/10 hover:bg-white/15 text-white border border-white/20 font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>Consult CA on WhatsApp</span>
            </a>
          </div>

          {/* Trust Metrics Bar */}
          <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto text-left">
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <div className="text-xl sm:text-2xl font-black text-emerald-400">15,000+</div>
              <div className="text-xs text-slate-300 font-medium">Filings &amp; Compliances</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <div className="text-xl sm:text-2xl font-black text-[#C9933B]">100%</div>
              <div className="text-xs text-slate-300 font-medium">Notice Protection Guard</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <div className="text-xl sm:text-2xl font-black text-emerald-400">24-48h</div>
              <div className="text-xs text-slate-300 font-medium">Average Turnaround</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <div className="text-xl sm:text-2xl font-black text-[#C9933B]">ICAI Reg.</div>
              <div className="text-xs text-slate-300 font-medium">In-House CA Advisory</div>
            </div>
          </div>
        </div>
      </div>

      <div id="services-grid" className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 relative z-10 scroll-mt-20">
        <h2 className="sr-only">Directory of Chartered Accountant Services</h2>
        
        {/* Controls: Category Filter & Search Bar */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-lg shadow-slate-200/50 border border-slate-200 mb-8 space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Horizontal Scrollable Category Pills */}
            <div className="flex gap-2 overflow-x-auto w-full pb-1 md:pb-0 text-xs font-bold text-slate-600 no-scrollbar">
              {categories.map(cat => {
                const CatIcon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`shrink-0 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                      activeCategory === cat.id
                        ? 'bg-[#00a859] text-white shadow-md shadow-emerald-600/20'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    <CatIcon className="w-3.5 h-3.5 shrink-0" />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-80 shrink-0">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by service or keywords..."
                className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
              />
              {search && (
                <button 
                  onClick={() => setSearch('')}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Results Summary Bar */}
          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span>
              Showing <strong className="text-slate-800">{filteredServices.length}</strong> of 20 services
              {activeCategory !== 'all' && ` in selected category`}
            </span>
            {(activeCategory !== 'all' || search) && (
              <button
                onClick={() => { setActiveCategory('all'); setSearch(''); }}
                className="text-emerald-600 hover:underline font-bold"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>

        {/* Services List Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => {
            const IconComp = SERVICE_ICONS[service.slug] || Briefcase;
            const dynService = getService(service.id);
            const displayPrice = dynService?.startingPrice || service.startingPrice;
            const displayTat = dynService?.tat || service.tat;
            return (
              <div
                key={service.id}
                className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-emerald-400 transition-all flex flex-col justify-between overflow-hidden group hover:-translate-y-1 duration-200"
              >
                <div className="p-6">
                  {/* Header Row: Category Badge, Service Number & Pricing Badge */}
                  <div className="flex items-start justify-between gap-2 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200/60">
                        {service.categoryLabel}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-slate-500 font-semibold block leading-tight">Starting from</span>
                      <span className="font-extrabold text-slate-900 text-base sm:text-lg text-emerald-700">{displayPrice}</span>
                    </div>
                  </div>

                  {/* Title with Matching Icon */}
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      <IconComp className="w-4 h-4" />
                    </div>
                    <Link 
                      href={`/services/${service.slug}`}
                      className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors hover:underline"
                    >
                      {service.title}
                    </Link>
                  </div>

                  {/* Short Description */}
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mt-1">
                    {service.shortDesc}
                  </p>

                  {/* Subservices Pill List (fixed min-height to maintain grid alignment) */}
                  <div className="mt-3 min-h-[32px] flex flex-wrap items-center gap-1">
                    {service.subServices && service.subServices.length > 0 ? (
                      <>
                        {service.subServices.slice(0, 3).map((sub, idx) => (
                          <span key={idx} className="text-xs font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                            {sub}
                          </span>
                        ))}
                        {service.subServices.length > 3 && (
                          <span className="text-xs text-slate-400 px-1 py-0.5 font-medium">
                            +{service.subServices.length - 3} more
                          </span>
                        )}
                      </>
                    ) : null}
                  </div>

                  {/* Turnaround Time & Notice Protection */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Clock className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-xs font-semibold">{displayTat}</span>
                    </div>
                    <div className="text-xs text-emerald-700 font-medium flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Notice Protected</span>
                    </div>
                  </div>

                  {/* Highlights Bullet Points */}
                  <ul className="mt-3 space-y-1.5 pt-3 border-t border-slate-100">
                    {service.highlights.slice(0, 2).map((h, idx) => (
                      <li key={idx} className="text-xs text-slate-600 flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="leading-snug">{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bottom Action Area: Primary Consult & File + WhatsApp + Details Link */}
                <div className="p-4 bg-slate-50/80 border-t border-slate-100 space-y-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setConsultModalService(service)}
                      className="flex-1 py-2.5 px-3 bg-[#00a859] hover:bg-[#008f4c] active:bg-[#007a3e] text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>Consult &amp; File with CA</span>
                    </button>
                    <a
                      href={`https://wa.me/917275922162?text=${encodeURIComponent(
                        `Hello Tracconsultant, I want to inquire about ${service.title}.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2.5 px-3 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-emerald-700 font-semibold text-xs rounded-xl transition-all flex items-center gap-1.5"
                      title="Inquire on WhatsApp"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>WhatsApp</span>
                    </a>
                  </div>

                  <Link
                    href={`/services/${service.slug}`}
                    className="block text-center text-xs font-semibold text-slate-500 hover:text-emerald-700 transition-colors pt-0.5"
                  >
                    View Scope, Documents &amp; Pricing →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredServices.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 shadow-sm p-8 max-w-lg mx-auto space-y-4">
            <HelpCircle className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="text-lg font-bold text-slate-900">No services found matching your search</h3>
            <p className="text-xs text-slate-500">
              Try searching with another keyword like &quot;ITR&quot;, &quot;GST&quot;, &quot;Notice&quot;, &quot;Incorporation&quot;, or &quot;Trademark&quot;.
            </p>
            <button
              onClick={() => { setActiveCategory('all'); setSearch(''); }}
              className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl"
            >
              Show All 20 Services
            </button>
          </div>
        )}
      </div>

      {/* Floating Bottom Contact Assistance Bar for Mobile */}
      <div className="lg:hidden fixed bottom-3 left-4 right-4 z-30">
        <div className="bg-slate-900/95 backdrop-blur-md text-white p-3 rounded-2xl shadow-xl border border-slate-800 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-xs font-semibold text-slate-200">Talk to a CA</span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="https://wa.me/917275922162?text=Hello%20Tracconsultant,%20I%20need%20CA%20advice%20for%20my%20business/tax."
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-xl flex items-center gap-1 shadow-sm"
            >
              <span>WhatsApp</span>
            </a>
            <a
              href="tel:+917275922162"
              className="px-3 py-1.5 bg-white/15 text-white text-xs font-semibold rounded-xl flex items-center gap-1"
            >
              <span>Call</span>
            </a>
          </div>
        </div>
      </div>

      {/* Consultation Booking Modal */}
      {consultModalService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div 
            className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-2 bg-gradient-to-r from-emerald-600 to-teal-600" />

            <button
              onClick={() => setConsultModalService(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-6 sm:p-8">
              {bookingSuccess ? (
                <div className="text-center py-6 space-y-3">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Consultation Request Received!</h3>
                  <p className="text-xs text-slate-600">
                    Our Senior Chartered Accountant will contact you via WhatsApp / Call within 30 minutes.
                  </p>
                </div>
              ) : (
                <>
                  <div className="mb-5">
                    <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {consultModalService.categoryLabel} • {getService(consultModalService.id)?.startingPrice || consultModalService.startingPrice}
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 mt-1">{consultModalService.title}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{consultModalService.shortDesc}</p>
                  </div>

                  <form onSubmit={handleBookConsultation} className="space-y-3.5 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Your Full Name</label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Vikram Sharma"
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Mobile / WhatsApp</label>
                        <input
                          type="tel"
                          required
                          value={mobile}
                          onChange={(e) => setMobile(e.target.value)}
                          placeholder="+91 98765 43210"
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Email Address</label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@example.com"
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Specific Requirements or Query</label>
                      <textarea
                        rows={3}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Provide details (e.g. business type, turnover, or notice details)..."
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md text-xs flex items-center justify-center gap-2 transition-all"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>{isSubmitting ? 'Submitting...' : 'Request Instant Senior CA Callback'}</span>
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

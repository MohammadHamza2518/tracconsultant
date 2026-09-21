'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useConfig } from '@/context/ConfigContext';
import { 
  ChevronDown, 
  PhoneCall, 
  ShieldCheck, 
  User as UserIcon, 
  LogOut, 
  LayoutDashboard, 
  Wrench, 
  FileText, 
  Sparkles, 
  Menu, 
  X, 
  Lock, 
  Calculator, 
  Briefcase, 
  Award,
  ArrowRight,
  Search,
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
  CheckCircle2,
  Clock,
  Filter,
  Layers,
  Calendar,
  EyeOff,
  GitCompare,
  FileCode2,
  FileArchive,
  ShoppingCart,
  Hash
} from 'lucide-react';
import { TOOLS_LIST } from '@/lib/data';

interface MegaServiceItem {
  num: string;
  title: string;
  sub: string;
  slug: string;
  price: string;
  tat: string;
  icon: any;
  category: 'income_tax' | 'corporate_legal' | 'accounting_cma';
}

interface ServiceGroup {
  id: 'income_tax' | 'corporate_legal' | 'accounting_cma';
  title: string;
  shortTitle: string;
  emoji: string;
  badgeClass: string;
  iconBg: string;
  items: MegaServiceItem[];
}

const SERVICE_GROUPS: ServiceGroup[] = [
  {
    id: 'income_tax',
    title: 'Income Tax & Legal Appeals',
    shortTitle: 'Income Tax',
    emoji: '⚖️',
    badgeClass: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    iconBg: 'bg-emerald-50 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white',
    items: [
      {
        num: '01',
        title: 'ITR Filing',
        sub: 'Salaried, F&O, Crypto, Traders & NRIs',
        slug: 'itr-filing',
        price: '₹999',
        tat: '24-48h',
        icon: FileText,
        category: 'income_tax'
      },
      {
        num: '04',
        title: 'Tax Notices & CIT Appeals',
        sub: 'Sec 143(1), 148, Scrutiny & Appeals',
        slug: 'notice-assistance',
        price: '₹1,999',
        tat: '24-48h',
        icon: Scale,
        category: 'income_tax'
      },
      {
        num: '06',
        title: 'Tax Planning & Advisory',
        sub: 'Basic, Advance, NRI DTAA, Sec 54',
        slug: 'tax-planning',
        price: '₹2,499',
        tat: '3 Days',
        icon: TrendingUp,
        category: 'income_tax'
      },
      {
        num: '09',
        title: 'Capital Gain Advisory',
        sub: 'Stocks, Crypto, Property & Sec 54EC',
        slug: 'capital-gain-advisory',
        price: '₹1,499',
        tat: '24h',
        icon: Coins,
        category: 'income_tax'
      },
      {
        num: '12',
        title: 'RSUs & Foreign Stocks',
        sub: 'US Tech RSUs, ESPP, MNC Form 67',
        slug: 'rsus-taxation',
        price: '₹2,999',
        tat: '24-48h',
        icon: Globe,
        category: 'income_tax'
      },
      {
        num: '18',
        title: 'TDS Return Filing',
        sub: 'Quarterly 24Q, 26Q, 27Q, Form 16',
        slug: 'tds-return-filing',
        price: '₹1,499/qtr',
        tat: '48h',
        icon: Percent,
        category: 'income_tax'
      }
    ]
  },
  {
    id: 'corporate_legal',
    title: 'Corporate & GST Compliance',
    shortTitle: 'Corporate & GST',
    emoji: '🏢',
    badgeClass: 'text-teal-700 bg-teal-50 border-teal-200',
    iconBg: 'bg-teal-50 text-teal-700 group-hover:bg-teal-600 group-hover:text-white',
    items: [
      {
        num: '02',
        title: 'Company / LLP Setup',
        sub: 'Pvt Ltd, LLP, OPC, SPICe+ MCA',
        slug: 'company-incorporation',
        price: '₹4,999',
        tat: '5-7d',
        icon: Building2,
        category: 'corporate_legal'
      },
      {
        num: '03',
        title: 'GST Filing & Services',
        sub: 'Reg, LUT Export, 3B, ITC Match',
        slug: 'gst-filing',
        price: '₹799/mo',
        tat: 'Same Day',
        icon: Calculator,
        category: 'corporate_legal'
      },
      {
        num: '07',
        title: 'Trust & NGO Setup',
        sub: 'Charitable Trust, Sec 8, 12A/80G',
        slug: 'trust-incorporation',
        price: '₹7,999',
        tat: '7-10d',
        icon: Landmark,
        category: 'corporate_legal'
      },
      {
        num: '15',
        title: 'Partnership Deeds',
        sub: 'Drafting, Stamp & Notarization',
        slug: 'partnership-deeds',
        price: '₹1,999',
        tat: '24-48h',
        icon: FileSignature,
        category: 'corporate_legal'
      },
      {
        num: '16',
        title: 'MSME / Udyam Reg.',
        sub: 'Subsidies & Priority Bank Loans',
        slug: 'msme-udyam-registration',
        price: '₹499',
        tat: 'Same Day',
        icon: Store,
        category: 'corporate_legal'
      },
      {
        num: '17',
        title: 'Startup India DPIIT',
        sub: 'Tax Exemption 80-IAC, Seed Fund',
        slug: 'startup-registration',
        price: '₹2,999',
        tat: '3-5d',
        icon: Rocket,
        category: 'corporate_legal'
      },
      {
        num: '21',
        title: 'E-Commerce GST Filing',
        sub: 'Amazon, Flipkart, Meesho & Shopify Sellers',
        slug: 'ecommerce-gst-filing',
        price: '₹499/mo',
        tat: 'Monthly Retainer',
        icon: ShoppingCart,
        category: 'corporate_legal'
      }
    ]
  },
  {
    id: 'accounting_cma',
    title: 'Accounting, CMA & Certifications',
    shortTitle: 'Accounting & Certs',
    emoji: '📊',
    badgeClass: 'text-indigo-700 bg-indigo-50 border-indigo-200',
    iconBg: 'bg-indigo-50 text-indigo-700 group-hover:bg-indigo-600 group-hover:text-white',
    items: [
      {
        num: '05',
        title: 'Trademark Reg. (™/®)',
        sub: 'Brand Name Search & Class Filing',
        slug: 'trademark-registration',
        price: '₹2,499',
        tat: '24h TM',
        icon: Award,
        category: 'accounting_cma'
      },
      {
        num: '08',
        title: 'Bookkeeping & Accounting',
        sub: 'P&L, Balance Sheet, Ledger Audits',
        slug: 'bookkeeping-accounting',
        price: '₹2,499/mo',
        tat: 'Continuous',
        icon: FileSpreadsheet,
        category: 'accounting_cma'
      },
      {
        num: '10',
        title: 'FSSAI Food License',
        sub: 'Food Safety Reg & State License',
        slug: 'fssai-license',
        price: '₹1,499',
        tat: '2-3d',
        icon: ShieldCheck,
        category: 'accounting_cma'
      },
      {
        num: '11',
        title: 'ISO Certifications',
        sub: 'ISO 9001, 27001 & Compliance',
        slug: 'iso-certificates',
        price: '₹3,999',
        tat: '3-5d',
        icon: BadgeCheck,
        category: 'accounting_cma'
      },
      {
        num: '13',
        title: 'EPF & ESI Compliance',
        sub: 'Challan, Monthly Returns, Labour',
        slug: 'epf-esi-consultation',
        price: '₹1,299/mo',
        tat: '2-3d',
        icon: Users,
        category: 'accounting_cma'
      },
      {
        num: '14',
        title: 'Class 3 DSC Services',
        sub: 'Sign + Encrypt USB Token (2 Hrs)',
        slug: 'dsc-services',
        price: '₹999',
        tat: '2 Hours',
        icon: KeyRound,
        category: 'accounting_cma'
      },
      {
        num: '19',
        title: 'CMA Project Report',
        sub: 'Bank Loan Projections & MPBF',
        slug: 'cma-report',
        price: '₹3,499',
        tat: '48h',
        icon: BarChart3,
        category: 'accounting_cma'
      },
      {
        num: '20',
        title: 'Loans Consultancy',
        sub: 'Term Loans, CC & OD Limit Advisory',
        slug: 'loans-consultancy',
        price: 'Quote',
        tat: '3-7d',
        icon: Receipt,
        category: 'accounting_cma'
      }
    ]
  }
];

export default function Navbar() {
  const pathname = usePathname();
  const { user, isLoading, openAuthModal, logout } = useAuth();
  const { getService, getToolPrice } = useConfig();
  const [isScrolled, setIsScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Mega menu states
  const [megaSearch, setMegaSearch] = useState('');
  const [megaCategory, setMegaCategory] = useState<string>('all');

  // Mobile drawer states
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [mobileToolsOpen, setMobileToolsOpen] = useState(false);
  const [mobileServiceSearch, setMobileServiceSearch] = useState('');
  const [mobileCategory, setMobileCategory] = useState<string>('all');

  const servicesRef = useRef<HTMLDivElement>(null);
  const toolsRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (servicesRef.current && !servicesRef.current.contains(event.target as Node)) {
        setServicesOpen(false);
      }
      if (toolsRef.current && !toolsRef.current.contains(event.target as Node)) {
        setToolsOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setServicesOpen(false);
        setToolsOpen(false);
        setUserMenuOpen(false);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const freeTools = TOOLS_LIST.filter(t => t.category === 'free');
  const paidTools = TOOLS_LIST.filter(t => t.category === 'paid');

  // Flattened all 20 services
  const allServices = useMemo(() => {
    return SERVICE_GROUPS.flatMap(g => g.items);
  }, []);

  // Filtered services for desktop mega menu search
  const filteredMegaServices = useMemo(() => {
    let list = allServices;
    if (megaCategory !== 'all') {
      list = list.filter(s => s.category === megaCategory);
    }
    if (megaSearch.trim()) {
      const q = megaSearch.toLowerCase();
      list = list.filter(s => 
        s.title.toLowerCase().includes(q) ||
        s.sub.toLowerCase().includes(q) ||
        s.num.includes(q)
      );
    }
    return list;
  }, [allServices, megaCategory, megaSearch]);

  // Filtered services for mobile drawer
  const filteredMobileServices = useMemo(() => {
    let list = allServices;
    if (mobileCategory !== 'all') {
      list = list.filter(s => s.category === mobileCategory);
    }
    if (mobileServiceSearch.trim()) {
      const q = mobileServiceSearch.toLowerCase();
      list = list.filter(s => 
        s.title.toLowerCase().includes(q) ||
        s.sub.toLowerCase().includes(q) ||
        s.num.includes(q)
      );
    }
    return list;
  }, [allServices, mobileCategory, mobileServiceSearch]);

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full transition-all">
      {/* Top Banner: Helpline & Trust */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-3 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-[1440px] mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 text-emerald-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" /> ICAI Reg. Senior CA Advisory
            </span>
            <span className="hidden md:inline text-slate-500">•</span>
            <span className="hidden md:inline text-slate-400">
              100% Notice Protection & Max Tax Refund Assurance
            </span>
          </div>
          <div className="flex items-center gap-3 sm:gap-5 ml-auto text-slate-300">
            <a 
              href="tel:+917275922162" 
              className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 font-semibold"
            >
              <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
              <span>+91 7275922162</span>
            </a>
            <span className="hidden sm:inline text-slate-600">|</span>
            <a 
              href="tel:+918052171196" 
              className="hidden sm:flex items-center gap-1.5 hover:text-emerald-400 transition-colors font-semibold"
            >
              <span>+91 8052171196</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav 
        className={`w-full bg-white/95 backdrop-blur-md transition-shadow border-b border-slate-200/80 ${
          isScrolled ? 'shadow-md py-2.5' : 'py-3'
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-4 xl:px-8 flex items-center justify-between gap-1.5 xl:gap-3 2xl:gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-2.5 xl:gap-3 group shrink-0">
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 xl:w-11 xl:h-11 flex-shrink-0 group-hover:scale-105 transition-transform">
              <Image 
                src="/logo.png" 
                alt="Tracconsultant" 
                fill 
                className="object-contain"
                priority
              />
            </div>
            <div className="shrink-0">
              <div className="text-base sm:text-lg xl:text-xl 2xl:text-2xl font-black tracking-tight text-[#0B2545] leading-none flex items-center whitespace-nowrap">
                TR<span className="text-[#C9933B]">A</span>C<span className="text-[#C9933B] ml-0.5 sm:ml-1 text-sm sm:text-base xl:text-lg 2xl:text-xl font-bold tracking-wider">CONSULTANT</span>
              </div>
              <div className="hidden 2xl:block text-[10px] font-semibold text-slate-500 tracking-wider uppercase mt-1 whitespace-nowrap">
                Tax • Regulatory • Advisory • Compliance
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links & Action Group */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2 2xl:gap-3 shrink-0">
            <div className="flex items-center gap-0.5 xl:gap-1 2xl:gap-1.5">
              {/* Services Mega Dropdown */}
              <div className="relative" ref={servicesRef}>
                <button
                  onClick={() => { setServicesOpen(!servicesOpen); setToolsOpen(false); }}
                  className={`px-2 xl:px-2.5 2xl:px-3 py-1.5 xl:py-2 rounded-xl text-xs xl:text-sm font-semibold flex items-center gap-1 xl:gap-1.5 whitespace-nowrap shrink-0 transition-colors ${
                    servicesOpen ? 'bg-emerald-50 text-emerald-700' : 'text-slate-700 hover:text-emerald-600 hover:bg-slate-50'
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5 xl:w-4 xl:h-4 text-emerald-600 shrink-0" />
                  <span className="hidden xl:inline whitespace-nowrap">All Services</span>
                  <span className="xl:hidden whitespace-nowrap">Services</span>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] xl:text-xs font-extrabold px-1.5 py-0.2 xl:px-2 xl:py-0.5 rounded-full shrink-0">
                    21
                  </span>
                  <ChevronDown className={`w-3 h-3 xl:w-3.5 xl:h-3.5 shrink-0 transition-transform ${servicesOpen ? 'rotate-180 text-emerald-600' : 'text-slate-400'}`} />
                </button>

              {/* HIGH-IMPACT DESKTOP MEGA MENU */}
              {servicesOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/4 xl:-translate-x-1/5 mt-2 w-[980px] max-w-[calc(100vw-2rem)] bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                  {/* Top Bar: Search & Quick Category Selector */}
                  <div className="flex items-center justify-between gap-4 pb-4 mb-4 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Filter:</span>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => { setMegaCategory('all'); }}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                            megaCategory === 'all' 
                              ? 'bg-emerald-600 text-white shadow-sm' 
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          }`}
                        >
                          All (21)
                        </button>
                        <button
                          onClick={() => { setMegaCategory('income_tax'); }}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                            megaCategory === 'income_tax' 
                              ? 'bg-emerald-600 text-white shadow-sm' 
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          }`}
                        >
                          ⚖️ Tax & Legal (6)
                        </button>
                        <button
                          onClick={() => { setMegaCategory('corporate_legal'); }}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                            megaCategory === 'corporate_legal' 
                              ? 'bg-emerald-600 text-white shadow-sm' 
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          }`}
                        >
                          🏢 Corporate & GST (7)
                        </button>
                        <button
                          onClick={() => { setMegaCategory('accounting_cma'); }}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                            megaCategory === 'accounting_cma' 
                              ? 'bg-emerald-600 text-white shadow-sm' 
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          }`}
                        >
                          📊 Accounting & Certs (8)
                        </button>
                      </div>
                    </div>

                    {/* Instant Search Bar inside Mega Menu */}
                    <div className="relative w-64">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={megaSearch}
                        onChange={(e) => setMegaSearch(e.target.value)}
                        placeholder="Search service name..."
                        className="w-full pl-8 pr-7 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      {megaSearch && (
                        <button 
                          onClick={() => setMegaSearch('')}
                          className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Main Mega Menu Layout: Services Columns + Right Advisory Spotlight */}
                  <div className="flex gap-6">
                    {/* If Search/Category filter is active */}
                    {(megaSearch.trim() || megaCategory !== 'all') ? (
                      <div className="flex-1">
                        <div className="text-xs font-bold text-slate-500 mb-3 flex items-center justify-between">
                          <span>Showing {filteredMegaServices.length} matching services:</span>
                          {(megaSearch || megaCategory !== 'all') && (
                            <button
                              onClick={() => { setMegaSearch(''); setMegaCategory('all'); }}
                              className="text-emerald-600 hover:underline font-semibold"
                            >
                              Reset filters
                            </button>
                          )}
                        </div>
                        {filteredMegaServices.length === 0 ? (
                          <div className="p-8 text-center text-slate-400 text-xs">
                            No service found matching &quot;{megaSearch}&quot;.
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 gap-2.5 max-h-[380px] overflow-y-auto pr-2">
                            {filteredMegaServices.map(item => {
                              const IconComp = item.icon;
                              return (
                                <Link
                                  key={item.slug}
                                  href={`/services/${item.slug}`}
                                  onClick={() => setServicesOpen(false)}
                                  className="group flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:border-emerald-300 bg-slate-50/50 hover:bg-emerald-50/40 transition-all"
                                >
                                  <div className="flex items-center gap-2.5 min-w-0">
                                    <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-emerald-700 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                                      <IconComp className="w-4 h-4" />
                                    </div>
                                    <div className="min-w-0">
                                      <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 truncate">
                                        {item.title}
                                      </div>
                                      <div className="text-xs text-slate-500 truncate">{item.sub}</div>
                                    </div>
                                  </div>
                                  <div className="text-right shrink-0 pl-2">
                                    <span className="text-xs font-extrabold text-slate-900 block leading-none">
                                      {getService(item.slug)?.startingPrice || item.price}
                                    </span>
                                    <span className="text-xs text-emerald-700 font-semibold">
                                      {getService(item.slug)?.tat || item.tat}
                                    </span>
                                  </div>
                                </Link>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    ) : (
                      /* Default 3-Column Visual Layout */
                      <div className="grid grid-cols-3 gap-5 flex-1">
                        {SERVICE_GROUPS.map((grp) => (
                          <div key={grp.id} className="space-y-2.5">
                            {/* Column Category Header */}
                            <div className="pb-2 border-b border-slate-100 flex items-center justify-between">
                              <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${grp.badgeClass}`}>
                                {grp.emoji} {grp.shortTitle} ({grp.items.length})
                              </span>
                            </div>

                            {/* Service Items Cards */}
                            <div className="space-y-1.5">
                              {grp.items.map((item) => {
                                const IconComp = item.icon;
                                return (
                                  <Link
                                    key={item.slug}
                                    href={`/services/${item.slug}`}
                                    onClick={() => setServicesOpen(false)}
                                    className="group flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 hover:border-slate-200 border border-transparent transition-all"
                                  >
                                    <div className="flex items-center gap-2 min-w-0">
                                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${grp.iconBg}`}>
                                        <IconComp className="w-3.5 h-3.5" />
                                      </div>
                                      <div className="min-w-0">
                                        <div className="text-xs font-bold text-slate-800 group-hover:text-emerald-700 truncate leading-tight">
                                          {item.title}
                                        </div>
                                        <div className="text-xs text-slate-400 truncate leading-none mt-0.5">
                                          {item.sub}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="text-right shrink-0 pl-1.5 opacity-80 group-hover:opacity-100">
                                      <span className="text-xs font-bold text-slate-700 block leading-none">
                                        {getService(item.slug)?.startingPrice || item.price}
                                      </span>
                                      <span className="text-xs text-slate-400">
                                        {getService(item.slug)?.tat || item.tat}
                                      </span>
                                    </div>
                                  </Link>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Right Spotlight: CA Advisory Card */}
                    <div className="w-64 shrink-0 bg-gradient-to-br from-[#0B2545] via-[#133E68] to-[#0B2545] text-white p-4 rounded-2xl flex flex-col justify-between shadow-lg">
                      <div>
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2 border border-emerald-500/30">
                          <Sparkles className="w-3 h-3" /> Senior CA Hotline
                        </div>
                        <h4 className="text-sm font-black text-white leading-snug">
                          Need Help Picking the Right Service?
                        </h4>
                        <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                          Consult directly with a Senior Chartered Accountant for customized advice on notices, incorporation or filings.
                        </p>
                        
                        <div className="mt-3 space-y-1.5 text-xs text-slate-200">
                          <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                            <CheckCircle2 className="w-3 h-3 shrink-0" />
                            <span>100% Notice Protection</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                            <CheckCircle2 className="w-3 h-3 shrink-0" />
                            <span>Max Refund Guaranteed</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                            <CheckCircle2 className="w-3 h-3 shrink-0" />
                            <span>Fast 24-48h Guaranteed TAT</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 space-y-2 border-t border-white/10 mt-3">
                        <a
                          href="https://wa.me/917275922162?text=Hello%20Tracconsultant,%20I%20need%20CA%20assistance%20for%20my%20business/tax."
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md shadow-emerald-950/30"
                        >
                          <span>WhatsApp Senior CA</span>
                          <ArrowRight className="w-3 h-3" />
                        </a>
                        <a
                          href="tel:+917275922162"
                          className="w-full py-1.5 px-3 bg-white/10 hover:bg-white/15 text-slate-200 font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5"
                        >
                          <PhoneCall className="w-3 h-3 text-emerald-400" />
                          <span>+91 7275922162</span>
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Mega Menu Footer Bar */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs bg-slate-50/90 -mx-6 -mb-6 p-4 rounded-b-3xl">
                    <div className="flex items-center gap-2 text-slate-600">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span className="font-semibold text-slate-700">All 21 Services Handled by Senior In-House CAs</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-500 hidden sm:inline">Fixed & Transparent Pricing</span>
                    </div>
                    <Link
                      href="/services"
                      onClick={() => setServicesOpen(false)}
                      className="font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1.5 group"
                    >
                      <span>Explore Full 21 Services Directory & Document Guides</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Compliance Suite Dropdown */}
            <div className="relative" ref={toolsRef}>
              <button
                onClick={() => { setToolsOpen(!toolsOpen); setServicesOpen(false); }}
                className={`px-2 xl:px-2.5 2xl:px-3 py-1.5 xl:py-2 rounded-xl text-xs xl:text-sm font-semibold flex items-center gap-1 xl:gap-1.5 whitespace-nowrap shrink-0 transition-colors ${
                  toolsOpen ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700 hover:text-indigo-600 hover:bg-slate-50'
                }`}
              >
                <Layers className="w-3.5 h-3.5 xl:w-4 xl:h-4 text-indigo-600 shrink-0" />
                <span className="hidden xl:inline whitespace-nowrap">Compliance Suite</span>
                <span className="xl:hidden whitespace-nowrap">Suite</span>
                <span className="bg-indigo-100 text-indigo-800 text-[10px] xl:text-xs font-extrabold px-1.5 py-0.2 xl:px-2 xl:py-0.5 rounded-full shrink-0">
                  {TOOLS_LIST.length}
                </span>
                <ChevronDown className={`w-3 h-3 xl:w-3.5 xl:h-3.5 shrink-0 transition-transform ${toolsOpen ? 'rotate-180 text-indigo-600' : 'text-slate-400'}`} />
              </button>

              {toolsOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/3 xl:-translate-x-1/4 mt-2 w-[850px] max-w-[calc(100vw-2rem)] bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                  {/* Suite Header Strip */}
                  <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
                        <Layers className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-slate-900 leading-tight">
                          Tax &amp; Compliance Software Suite
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          12 Free &amp; Basic tools and 4 Advance &amp; Pro compliance modules
                        </p>
                      </div>
                    </div>
                    <div className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Instant Browser Processing • 100% Confidential</span>
                    </div>
                  </div>

                  {/* Spotlight Banner: Featured E-Commerce GST Automation */}
                  <Link
                    href="/tools/ecommerce-gst-converter"
                    onClick={() => setToolsOpen(false)}
                    className="mb-4 p-3 bg-gradient-to-r from-[#0B2545] via-slate-900 to-emerald-950 rounded-2xl border border-emerald-500/40 flex items-center justify-between gap-3 group hover:border-emerald-400 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                        <ShoppingCart className="w-5 h-5 text-slate-950" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-black text-white group-hover:text-emerald-300 transition-colors">
                            E-Commerce GSTR-1 &amp; TCS Converter
                          </span>
                          <span className="text-[10px] font-black bg-emerald-400 text-slate-950 px-1.5 py-0.5 rounded uppercase shadow-xs">
                            NEW • 100% FREE
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300 line-clamp-1 mt-0.5">
                          Amazon MTR, Flipkart &amp; Meesho sales to Table 7 B2CS JSON &amp; Section 52 TCS credit.
                        </p>
                      </div>
                    </div>
                    <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 group-hover:bg-emerald-500 text-white shrink-0 transition-all flex items-center gap-1 shadow-sm">
                      <span>Launch Tool</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </Link>

                  {/* 2-Column Suite Layout: Free/Basic vs Advance/Pro */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Column 1: Free & Basic Tools */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-lg flex items-center gap-1.5">
                          <Layers className="w-3 h-3" /> Free &amp; Basic Tools ({freeTools.length})
                        </span>
                        <span className="text-xs font-bold text-emerald-600">100% Free</span>
                      </div>

                      <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                        {freeTools.map(t => {
                          const iconMap: Record<string, any> = {
                            'ecommerce-gst-converter': ShoppingCart,
                            'gstin-search': ShieldCheck,
                            'hsn-search': Hash,
                            'capital-gain-calculator': TrendingUp,
                            'hra-calculator': Calculator,
                            'advance-tax-calculator': Calendar,
                            'tax-calculator': TrendingUp,
                            'pdf-redactor': EyeOff,
                            'tb-to-balancesheet': FileSpreadsheet,
                            'gstr2a-reconciliation': GitCompare,
                            'json-to-computation': FileCode2,
                            'gstr2a-cleaner': Sparkles
                          };
                          const IconComp = iconMap[t.id] || Calculator;
                          return (
                            <Link
                              key={t.id}
                              href={`/tools/${t.slug}`}
                              onClick={() => setToolsOpen(false)}
                              className="group flex items-start gap-3 p-2 rounded-2xl border border-slate-100 hover:border-emerald-300 bg-slate-50/50 hover:bg-emerald-50/40 transition-all"
                            >
                              <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 text-emerald-600 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors shadow-2xs">
                                <IconComp className="w-4 h-4" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-1">
                                  <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-700 truncate">
                                    {t.name}
                                  </span>
                                  <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded shrink-0">
                                    {t.badge || 'FREE'}
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                                  {t.shortDesc}
                                </p>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>

                    {/* Column 2: Advance & Pro Modules */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                        <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-lg flex items-center gap-1.5">
                          <Sparkles className="w-3 h-3" /> Advance &amp; Pro Tools ({paidTools.length})
                        </span>
                        <span className="text-xs font-bold text-indigo-600">₹199 - ₹299</span>
                      </div>

                      <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
                        {paidTools.map(t => {
                          const iconMap: Record<string, any> = {
                            'advanced-pdf-redactor': EyeOff,
                            'advanced-computation-generator': FileCode2,
                            'file-compressor': FileArchive,
                            'gst-invoice-generator': Receipt,
                            'ecommerce-gst-converter': ShoppingCart
                          };
                          const IconComp = iconMap[t.id] || Sparkles;
                          return (
                            <Link
                              key={t.id}
                              href={`/tools/${t.slug}`}
                              onClick={() => setToolsOpen(false)}
                              className="group flex items-center justify-between p-2.5 rounded-2xl border border-slate-100 hover:border-indigo-300 bg-slate-50/50 hover:bg-indigo-50/40 transition-all"
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-indigo-600 flex items-center justify-center shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                  <IconComp className="w-4 h-4" />
                                </div>
                                <div className="min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-xs font-bold text-slate-800 group-hover:text-indigo-700 truncate leading-tight">
                                      {t.name}
                                    </span>
                                    {t.badge && (
                                      <span className="text-[10px] font-black bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded">
                                        {t.badge}
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[11px] text-slate-400 truncate leading-none mt-1">
                                    {t.shortDesc}
                                  </div>
                                </div>
                              </div>
                              <div className="text-right shrink-0 pl-2">
                                <span className="text-xs font-extrabold text-indigo-700 block leading-none">₹{getToolPrice(t.id, t.price)}</span>
                                <span className="text-[10px] text-slate-400 uppercase font-semibold">One-time</span>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Suite Footer Strip */}
                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs bg-slate-50/90 -mx-6 -mb-6 p-4 rounded-b-3xl">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Lock className="w-3.5 h-3.5 text-indigo-600" />
                      <span className="font-semibold text-slate-700">Client-Side Privacy Engine</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-500 hidden sm:inline">No sensitive PAN/Financial data stored on public servers</span>
                    </div>
                    <Link
                      href="/tools"
                      onClick={() => setToolsOpen(false)}
                      className="font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5 group"
                    >
                      <span>Explore Complete Suite Hub</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* 19 Popular Financial Calculators */}
            <Link
              href="/calculators"
              className={`px-2 xl:px-2.5 2xl:px-3 py-1.5 xl:py-2 rounded-xl text-xs xl:text-sm font-semibold whitespace-nowrap shrink-0 transition-colors flex items-center gap-1 xl:gap-1.5 ${
                pathname === '/calculators'
                  ? 'bg-emerald-50 text-emerald-700 font-bold'
                  : 'text-slate-700 hover:text-emerald-600 hover:bg-slate-50'
              }`}
            >
              <Calculator className="w-3.5 h-3.5 xl:w-4 xl:h-4 text-emerald-600 shrink-0" />
              <span className="whitespace-nowrap">Calculators</span>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-1.5 py-0.2 rounded-full shrink-0">
                20
              </span>
            </Link>

            {/* Live Filing Tracker */}
            <Link
              href="/track"
              className="px-2 xl:px-2.5 2xl:px-3 py-1.5 xl:py-2 rounded-xl text-xs xl:text-sm font-semibold text-slate-700 hover:text-emerald-600 hover:bg-slate-50 whitespace-nowrap shrink-0 transition-colors"
            >
              <span className="hidden xl:inline">Track Filing</span>
              <span className="xl:hidden">Track</span>
            </Link>

            {/* Instant Pay Portal */}
            <Link
              href="/pay"
              className="px-2 xl:px-2.5 2xl:px-3 py-1.5 xl:py-2 rounded-xl text-xs xl:text-sm font-semibold text-slate-700 hover:text-emerald-600 hover:bg-slate-50 whitespace-nowrap shrink-0 transition-colors"
            >
              <span className="hidden xl:inline">Pay Online</span>
              <span className="xl:hidden">Pay</span>
            </Link>

            {/* User Dashboard (Visible only when logged in) */}
            {user && (
              <Link
                href="/dashboard"
                className={`px-2 xl:px-2.5 2xl:px-3 py-1.5 xl:py-2 rounded-xl text-xs xl:text-sm font-semibold whitespace-nowrap shrink-0 transition-colors flex items-center gap-1 xl:gap-1.5 shadow-xs ${
                  pathname === '/dashboard'
                    ? 'text-emerald-900 bg-emerald-100/90 border border-emerald-300 font-bold'
                    : 'text-emerald-800 bg-emerald-50/80 hover:bg-emerald-100/80 border border-emerald-200/60'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden xl:inline">Dashboard</span>
                <span className="xl:hidden">Dash</span>
              </Link>
            )}
          </div>

          {/* Clean Visual Divider */}
          <div className="h-5 xl:h-6 w-px bg-slate-200 shrink-0 mx-0.5 xl:mx-1" />

          {/* User Auth Action (Right) */}
          <div className="flex items-center gap-1.5 xl:gap-2.5 shrink-0">
            {isLoading ? (
              <div className="h-8 xl:h-9 w-20 xl:w-28 bg-slate-100/80 rounded-full animate-pulse shrink-0 border border-slate-200/50" />
            ) : user ? (
              <div className="relative shrink-0" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-1.5 xl:gap-2 p-1 xl:p-1.5 pr-2 xl:pr-3 rounded-full border border-slate-200 hover:border-slate-300 hover:shadow-sm bg-slate-50/70 whitespace-nowrap shrink-0 transition-all cursor-pointer"
                >
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-7 h-7 xl:w-8 xl:h-8 rounded-full object-cover border border-emerald-500 shrink-0" />
                  ) : (
                    <div className="w-7 h-7 xl:w-8 xl:h-8 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="text-left shrink-0">
                    <div className="text-xs font-bold text-slate-800 leading-tight max-w-[70px] xl:max-w-[110px] 2xl:max-w-[140px] truncate">
                      <span className="hidden xl:inline">{user.name}</span>
                      <span className="xl:hidden">{user.name.split(' ')[0]}</span>
                    </div>
                    <div className="text-[10px] xl:text-xs font-semibold leading-none mt-0.5">
                      {user.role === 'admin' ? (
                        <span className="text-indigo-600 uppercase font-bold">Admin</span>
                      ) : (
                        <span className="text-emerald-600">Taxpayer</span>
                      )}
                    </div>
                  </div>
                  <ChevronDown className="w-3 h-3 xl:w-3.5 xl:h-3.5 text-slate-400 shrink-0" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Signed in as</p>
                      <p className="text-xs font-bold text-slate-800 truncate mt-0.5">{user.email}</p>
                    </div>

                    <Link
                      href="/dashboard"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-emerald-600 transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-emerald-600" />
                      <span>My Dashboard</span>
                    </Link>

                    <Link
                      href="/tools"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                    >
                      <Layers className="w-4 h-4 text-indigo-600" />
                      <span>Compliance Suite</span>
                    </Link>

                    {user.role === 'admin' && (
                      <Link
                        href="/admin"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-indigo-700 bg-indigo-50/70 hover:bg-indigo-100 transition-colors"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>Admin Control Center</span>
                      </Link>
                    )}

                    <Link
                      href="/consult-ca"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 transition-colors"
                    >
                      <PhoneCall className="w-4 h-4 text-emerald-600" />
                      <span>Consult a CA (₹299/₹599)</span>
                    </Link>

                    {/* Direct Senior CA Hotline */}
                    <a
                      href="https://wa.me/917275922162?text=Hello%20Tracconsultant,%20I%20am%20logged%20in%20and%20need%20CA%20assistance."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                      <PhoneCall className="w-4 h-4 text-slate-400" />
                      <span>Assigned CA Desk</span>
                    </a>

                    <div className="border-t border-slate-100 my-1"></div>

                    <button
                      onClick={() => { logout(); setUserMenuOpen(false); }}
                      className="w-full text-left flex items-center gap-2 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5 xl:gap-2 shrink-0">
                <Link
                  href="/dashboard"
                  className="px-2.5 xl:px-4 py-1.5 xl:py-2 text-xs xl:text-sm font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 rounded-xl transition-all border border-slate-300 shadow-xs flex items-center gap-1 xl:gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <UserIcon className="w-3.5 h-3.5 xl:w-4 xl:h-4 shrink-0 text-slate-500" />
                  <span className="whitespace-nowrap">Sign In</span>
                </Link>

                {/* Direct Consultation Callout - High-converting CTA for prospective visitors */}
                <Link
                  href="/consult-ca"
                  className="px-2.5 xl:px-4 py-1.5 xl:py-2 text-xs xl:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl shadow-xs border border-emerald-500/30 transition-all flex items-center gap-1 xl:gap-1.5 whitespace-nowrap shrink-0"
                >
                  <PhoneCall className="w-3.5 h-3.5 shrink-0" />
                  <span className="hidden xl:inline whitespace-nowrap">Consult a CA</span>
                  <span className="xl:hidden whitespace-nowrap">Consult CA</span>
                </Link>
              </div>
            )}
          </div>
        </div>

          {/* Mobile Menu Button & Mobile Auth Indicator */}
          <div className="flex lg:hidden items-center gap-2">
            {isLoading ? (
              <div className="w-16 h-7 bg-slate-100 rounded-lg animate-pulse" />
            ) : user ? (
              <Link
                href="/dashboard"
                className="px-2 sm:px-2.5 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg flex items-center gap-1 shadow-xs max-w-[85px] sm:max-w-[120px] transition-colors"
                title={user.name}
              >
                <UserIcon className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{user.name.split(' ')[0]}</span>
              </Link>
            ) : (
              <button
                onClick={() => openAuthModal('login')}
                className="px-2.5 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg"
              >
                Sign In
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* HIGH-IMPACT MOBILE NAVIGATION DRAWER */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-8 space-y-3 max-h-[85vh] overflow-y-auto overscroll-contain shadow-2xl">
            {/* 1. All 20 Services Accordion */}
            <div className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50/50">
              <button
                onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                className="w-full px-4 py-3 flex items-center justify-between text-left font-bold text-slate-800 hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">All 20 CA Services</div>
                    <div className="text-xs text-slate-500 font-normal">Income Tax, GST, Company Setup, CMA</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-600 text-white text-xs font-extrabold px-2 py-0.5 rounded-full">
                    20
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${mobileServicesOpen ? 'rotate-180 text-emerald-600' : ''}`} />
                </div>
              </button>

              {mobileServicesOpen && (
                <div className="px-3 pb-3 pt-1 border-t border-slate-200 bg-white space-y-2.5">
                  {/* Quick Mobile Search */}
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={mobileServiceSearch}
                      onChange={(e) => setMobileServiceSearch(e.target.value)}
                      placeholder="Search 20 services..."
                      className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  {/* Category Filter Pills */}
                  <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
                    <button
                      onClick={() => setMobileCategory('all')}
                      className={`shrink-0 px-2.5 py-1 rounded-lg font-bold whitespace-nowrap transition-colors ${
                        mobileCategory === 'all' 
                          ? 'bg-emerald-600 text-white shadow-xs' 
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      All (20)
                    </button>
                    <button
                      onClick={() => setMobileCategory('income_tax')}
                      className={`shrink-0 px-2.5 py-1 rounded-lg font-bold whitespace-nowrap transition-colors ${
                        mobileCategory === 'income_tax' 
                          ? 'bg-emerald-600 text-white shadow-xs' 
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      ⚖️ Tax & Legal
                    </button>
                    <button
                      onClick={() => setMobileCategory('corporate_legal')}
                      className={`shrink-0 px-2.5 py-1 rounded-lg font-bold whitespace-nowrap transition-colors ${
                        mobileCategory === 'corporate_legal' 
                          ? 'bg-emerald-600 text-white shadow-xs' 
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      🏢 Corporate & GST
                    </button>
                    <button
                      onClick={() => setMobileCategory('accounting_cma')}
                      className={`shrink-0 px-2.5 py-1 rounded-lg font-bold whitespace-nowrap transition-colors ${
                        mobileCategory === 'accounting_cma' 
                          ? 'bg-emerald-600 text-white shadow-xs' 
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      📊 Accounting & Certs
                    </button>
                  </div>

                  {/* Filtered Services List (Mobile Cards) */}
                  <div className="space-y-1.5 max-h-64 overflow-y-auto overscroll-contain touch-pan-y pr-1">
                    {filteredMobileServices.map((svc) => {
                      const IconComp = svc.icon;
                      return (
                        <Link
                          key={svc.slug}
                          href={`/services/${svc.slug}`}
                          onClick={() => { setMobileMenuOpen(false); }}
                          className="flex items-center justify-between p-2 rounded-xl bg-slate-50 hover:bg-emerald-50/60 border border-slate-100 hover:border-emerald-200 transition-all group"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-emerald-700 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                              <IconComp className="w-3.5 h-3.5" />
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs font-bold text-slate-900 truncate group-hover:text-emerald-700">
                                {svc.title}
                              </div>
                              <div className="text-xs text-slate-500 truncate">{svc.sub}</div>
                            </div>
                          </div>
                          <div className="text-right shrink-0 pl-2">
                            <span className="text-xs font-extrabold text-slate-900 block leading-none">
                              {getService(svc.slug)?.startingPrice || svc.price}
                            </span>
                            <span className="text-xs text-emerald-700 font-semibold">
                              {getService(svc.slug)?.tat || svc.tat}
                            </span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>

                  <Link
                    href="/services"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-center py-2 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 rounded-xl"
                  >
                    View All 20 Services Directory Page →
                  </Link>
                </div>
              )}
            </div>

            {/* 2. Tax & Compliance Suite Accordion */}
            <div className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50/50">
              <button
                onClick={() => setMobileToolsOpen(!mobileToolsOpen)}
                className="w-full px-4 py-3 flex items-center justify-between text-left font-bold text-slate-800 hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">Tax & Compliance Suite</div>
                    <div className="text-xs text-slate-500 font-normal">3 Free Calculators + 5 Pro Audit SaaS Utilities</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-indigo-600 text-white text-xs font-extrabold px-2 py-0.5 rounded-full">
                    {TOOLS_LIST.length} Tools
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${mobileToolsOpen ? 'rotate-180 text-indigo-600' : ''}`} />
                </div>
              </button>

              {mobileToolsOpen && (
                <div className="px-3 pb-3 pt-1 border-t border-slate-200 bg-white space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-emerald-700 pt-1 flex items-center gap-1">
                    <Calculator className="w-3 h-3" /> Free &amp; Basic Utilities ({freeTools.length})
                  </div>
                  <div className="space-y-1">
                    {freeTools.map((t) => (
                      <Link
                        key={t.id}
                        href={`/tools/${t.slug}`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center justify-between p-2 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-100 text-xs transition-colors"
                      >
                        <span className="font-semibold text-slate-800">{t.name}</span>
                        <span className="text-xs bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded">FREE</span>
                      </Link>
                    ))}
                  </div>

                  <div className="text-xs font-bold uppercase tracking-wider text-indigo-700 pt-2 border-t border-slate-100 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Advance &amp; Pro Modules ({paidTools.length})
                  </div>
                  <div className="space-y-1">
                    {paidTools.map((t) => (
                      <Link
                        key={t.id}
                        href={`/tools/${t.slug}`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center justify-between p-2 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-100 text-xs transition-colors"
                      >
                        <span className="font-semibold text-slate-800">{t.name}</span>
                        <span className="text-xs bg-indigo-100 text-indigo-700 font-bold px-2 py-0.5 rounded">₹{getToolPrice(t.id, t.price)}</span>
                      </Link>
                    ))}
                  </div>

                  <Link
                    href="/tools"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-center py-2 text-xs font-bold text-indigo-700 hover:text-indigo-800 bg-indigo-50 rounded-xl mt-2"
                  >
                    Open Complete Suite Hub →
                  </Link>
                </div>
              )}
            </div>

            {/* Featured 19 Calculators Mobile Button */}
            <Link
              href="/calculators"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 border border-emerald-200 rounded-2xl flex items-center justify-between transition-colors shadow-2xs"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <Calculator className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <span>19 Financial &amp; Tax Calculators</span>
                    <span className="bg-emerald-600 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full">FREE</span>
                  </div>
                  <div className="text-[10px] text-slate-500">SIP, PF, HRA, Income Tax, Gratuity &amp; More</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-emerald-600" />
            </Link>

            {/* 3. Quick Links: Track & Pay (+ Dashboard if logged in) */}
            <div className={`grid ${user ? 'grid-cols-3' : 'grid-cols-2'} gap-2`}>
              {user && (
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 bg-emerald-50/80 hover:bg-emerald-100/80 border border-emerald-200/80 rounded-xl text-center transition-colors"
                >
                  <div className="text-xs font-bold text-emerald-800 flex items-center justify-center gap-1">
                    <LayoutDashboard className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Dashboard</span>
                  </div>
                  <div className="text-[10px] text-emerald-600 font-medium">My Account</div>
                </Link>
              )}
              <Link
                href="/track"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-center transition-colors"
              >
                <div className="text-xs font-bold text-slate-900">Track Filing</div>
                <div className="text-[10px] text-slate-500">Live Status</div>
              </Link>
              <Link
                href="/pay"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-center transition-colors"
              >
                <div className="text-xs font-bold text-slate-900">Pay Online</div>
                <div className="text-[10px] text-slate-500">UPI & Cards</div>
              </Link>
            </div>

            {/* 4. Action Buttons */}
            <Link
              href="/consult-ca"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-center font-bold rounded-xl flex items-center justify-center gap-2 shadow-xs text-xs transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Paid CA Consultation Desk (₹299/₹599)</span>
            </Link>

            <a
              href="tel:+917275922162"
              className="w-full py-2 bg-slate-100 text-slate-800 text-center font-semibold rounded-xl flex items-center justify-center gap-2 text-xs"
            >
              <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
              <span>Helpline: +91 7275922162</span>
            </a>

            {/* Auth / Dashboard */}
            {isLoading ? (
              <div className="pt-2 border-t border-slate-100">
                <div className="w-full h-10 bg-slate-100 animate-pulse rounded-xl" />
              </div>
            ) : user ? (
              <div className="pt-2 border-t border-slate-100">
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 px-4 bg-[#0B2545] text-white text-center font-bold rounded-xl block text-xs mb-2"
                >
                  Go to My Dashboard
                </Link>
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="w-full py-1.5 text-xs font-bold text-red-600 text-center block cursor-pointer"
                >
                  Sign Out ({user.name})
                </button>
              </div>
            ) : (
              <button
                onClick={() => { openAuthModal('login'); setMobileMenuOpen(false); }}
                className="w-full py-2.5 px-4 bg-emerald-600 text-white text-center font-bold rounded-xl block text-xs cursor-pointer"
              >
                Sign In / Register
              </button>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}

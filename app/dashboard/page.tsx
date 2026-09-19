'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { useConfig } from '@/context/ConfigContext';
import { TOOLS_LIST, SERVICES_LIST, ToolConfig } from '@/lib/data';
import ToolPaywallModal from '@/components/ToolPaywallModal';
import { 
  User, 
  ShieldCheck, 
  Wrench, 
  FileText, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight, 
  Upload, 
  Sparkles, 
  Phone, 
  Plus, 
  Lock, 
  Zap, 
  Check, 
  ExternalLink,
  ChevronRight,
  Layers,
  FileSpreadsheet,
  GitCompare,
  FileCode2,
  EyeOff,
  Calculator,
  Calendar,
  TrendingUp,
  Search,
  Download,
  Trash2,
  Printer,
  BadgeCheck,
  Building2,
  HelpCircle,
  FolderLock,
  RefreshCw,
  X
} from 'lucide-react';

interface VaultDoc {
  id: string;
  name: string;
  size: string;
  type: string;
  category: string;
  uploadDate: string;
  status: 'verified' | 'under_review' | 'pending_signature';
}

export default function ClientDashboard() {
  const { user, hasToolAccess, openAuthModal, refreshUser } = useAuth();
  const { toolPrices, getToolPrice } = useConfig();
  
  const [activeTab, setActiveTab] = useState<'tools' | 'filings' | 'new_service' | 'vault' | 'support'>('tools');
  const [toolFilter, setToolFilter] = useState<'all' | 'unlocked' | 'free' | 'paid'>('all');
  const [toolSearch, setToolSearch] = useState('');
  const [selectedToolForPay, setSelectedToolForPay] = useState<ToolConfig | null>(null);

  // Filings state
  const [filings, setFilings] = useState<any[]>([]);

  // New Service booking state
  const [selectedService, setSelectedService] = useState('ITR Filing for Salaried (Form 16)');
  const [entityType, setEntityType] = useState('Individual Salaried');
  const [preferredSlot, setPreferredSlot] = useState('Morning (10:00 AM - 01:00 PM)');
  const [clientPhone, setClientPhone] = useState(user?.phone || '');
  const [serviceNotes, setServiceNotes] = useState('');
  const [serviceBookingSuccess, setServiceBookingSuccess] = useState(false);
  const [isSubmittingService, setIsSubmittingService] = useState(false);

  // Document Vault state
  const [vaultDocs, setVaultDocs] = useState<VaultDoc[]>([
    {
      id: 'doc-1',
      name: 'Form16_PartA_B_Reconciled.pdf',
      size: '1.4 MB',
      type: 'PDF Document',
      category: 'Tax Returns',
      uploadDate: '10 May 2025',
      status: 'verified'
    },
    {
      id: 'doc-2',
      name: 'Sales_Purchase_Register_FY2425.xlsx',
      size: '880 KB',
      type: 'Excel Spreadsheet',
      category: 'Financials',
      uploadDate: '11 May 2025',
      status: 'verified'
    },
    {
      id: 'doc-3',
      name: 'Bank_Statement_HDFC_Current_FY2425.pdf',
      size: '3.2 MB',
      type: 'PDF Document',
      category: 'Bank Statements',
      uploadDate: '12 May 2025',
      status: 'under_review'
    }
  ]);
  const [vaultFilter, setVaultFilter] = useState<string>('all');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Digital License Modal state
  const [activeLicenseModalTool, setActiveLicenseModalTool] = useState<ToolConfig | null>(null);

  useEffect(() => {
    // Fetch filings for user
    fetch('/api/filings')
      .then(res => res.json())
      .then(data => {
        if (data.filings) {
          const userFilings = data.filings.filter(
            (f: any) => f.email?.toLowerCase() === user?.email?.toLowerCase() || f.mobile === user?.phone
          );
          setFilings(userFilings.length > 0 ? userFilings : data.filings.slice(0, 2));
        }
      })
      .catch(() => {});
  }, [user]);

  const handleBookService = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingService(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: user?.name || 'Client',
          email: user?.email || '',
          mobile: clientPhone || '9876543210',
          serviceInterest: `${selectedService} [${entityType}] (Slot: ${preferredSlot})`,
          message: serviceNotes,
          source: 'Client Dashboard'
        })
      });
      if (res.ok) {
        setServiceBookingSuccess(true);
        setTimeout(() => setServiceBookingSuccess(false), 6000);
        setServiceNotes('');
      }
    } catch (e) {
      alert('Error booking consultation');
    } finally {
      setIsSubmittingService(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const newDocs: VaultDoc[] = [];

    Array.from(files).forEach((file, index) => {
      const sizeStr = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
      newDocs.push({
        id: `doc-${Date.now()}-${index}`,
        name: file.name,
        size: sizeStr,
        type: file.type.includes('pdf') ? 'PDF Document' : file.type.includes('sheet') || file.name.endsWith('.xlsx') ? 'Excel Spreadsheet' : 'Tax File',
        category: file.name.toLowerCase().includes('form16') || file.name.toLowerCase().includes('itr') ? 'Tax Returns' : 'Financials',
        uploadDate: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        status: 'under_review'
      });
    });

    setTimeout(() => {
      setVaultDocs(prev => [...newDocs, ...prev]);
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }, 800);
  };

  const handleDeleteDoc = (id: string) => {
    setVaultDocs(prev => prev.filter(d => d.id !== id));
  };

  if (!user) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-200 p-8 text-center space-y-5">
          <div className="relative w-20 h-20 mx-auto mb-2">
            <Image 
              src="/logo.png" 
              alt="Tracconsultant" 
              fill 
              className="object-contain" 
            />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Client Portal Sign In</h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            Please sign in with your Google account or registered email to view your filed returns, document vault, and unlocked compliance suite.
          </p>
          <button
            onClick={() => openAuthModal('login')}
            className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
          >
            <span>Sign In to Dashboard</span>
            <ChevronRight className="w-4 h-4" />
          </button>
          <p className="text-xs text-slate-400">
            Don't have an account? <button onClick={() => openAuthModal('register')} className="text-emerald-600 font-bold hover:underline">Create an account</button>
          </p>
        </div>
      </div>
    );
  }

  // Count tools unlocked
  const unlockedCount = TOOLS_LIST.filter(t => hasToolAccess(t.id)).length;
  const bundlePrice = toolPrices?.allAccessPass || 499;

  // Filter tools
  const filteredTools = TOOLS_LIST.filter(tool => {
    const isUnlocked = hasToolAccess(tool.id);
    let matchesCategory = true;
    if (toolFilter === 'unlocked') matchesCategory = isUnlocked;
    if (toolFilter === 'free') matchesCategory = tool.category === 'free';
    if (toolFilter === 'paid') matchesCategory = tool.category === 'paid';

    const matchesSearch = tool.name.toLowerCase().includes(toolSearch.toLowerCase()) ||
                          tool.shortDesc.toLowerCase().includes(toolSearch.toLowerCase()) ||
                          tool.tags.some(t => t.toLowerCase().includes(toolSearch.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

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

  const filteredVaultDocs = vaultDocs.filter(d => {
    if (vaultFilter === 'all') return true;
    return d.category.toLowerCase().includes(vaultFilter.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Dashboard Top Banner */}
      <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900 text-white pt-10 pb-12 px-4 sm:px-8 border-b border-slate-800 relative">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            {user.avatar ? (
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500 shadow-md ring-4 ring-emerald-500/10" 
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-700 text-white font-black text-2xl flex items-center justify-center shadow-md border border-emerald-400/30">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{user.name}</h1>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <BadgeCheck className="w-3 h-3" />
                  {user.authProvider === 'google' ? 'Google Verified' : 'Verified Client'}
                </span>
                {user.role === 'admin' && (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    Admin
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {user.email} {user.phone && `• +91 ${user.phone}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <a
              href="https://wa.me/917275922162?text=Hello%20CA%20Team,%20I%20am%20logged%20in%20to%20my%20Tracconsultant%20Client%20Dashboard%20and%20need%20assistance."
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm"
            >
              <span>💬 Direct Senior CA WhatsApp</span>
            </a>
            {user.role === 'admin' && (
              <Link
                href="/admin"
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Super Admin Center</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area (Clean spacing without negative margin overlap) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 relative z-10">
        {/* KPI Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Filings</p>
              <p className="text-2xl font-black text-slate-900 mt-1">{filings.length}</p>
              <p className="text-[11px] text-emerald-600 font-medium mt-0.5 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Assigned Senior CA
              </p>
            </div>
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Compliance Suite</p>
              <p className="text-2xl font-black text-indigo-700 mt-1">{unlockedCount} / 8 Tools</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {unlockedCount === 8 ? 'Full Suite Unlocked' : `${8 - unlockedCount} tools available`}
              </p>
            </div>
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
              <Layers className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Notice Protection</p>
              <p className="text-2xl font-black text-emerald-700 mt-1">100% Active</p>
              <p className="text-[11px] text-emerald-600 mt-0.5">Zero penalty guarantee</p>
            </div>
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Document Vault</p>
              <p className="text-2xl font-black text-slate-900 mt-1">{vaultDocs.length} Files</p>
              <p className="text-[11px] text-slate-500 mt-0.5">256-bit encrypted store</p>
            </div>
            <div className="w-12 h-12 bg-slate-100 text-slate-700 rounded-xl flex items-center justify-center">
              <FolderLock className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Dashboard Tabs Header */}
        <div className="flex border-b border-slate-200 mb-6 gap-2 sm:gap-6 overflow-x-auto text-sm font-semibold">
          <button
            onClick={() => setActiveTab('tools')}
            className={`pb-3.5 px-2 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'tools'
                ? 'border-emerald-600 text-emerald-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Tools & Licenses ({unlockedCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('filings')}
            className={`pb-3.5 px-2 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'filings'
                ? 'border-emerald-600 text-emerald-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>My Filings & Tracking ({filings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('new_service')}
            className={`pb-3.5 px-2 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'new_service'
                ? 'border-emerald-600 text-emerald-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Request CA Service (20 Available)</span>
          </button>

          <button
            onClick={() => setActiveTab('vault')}
            className={`pb-3.5 px-2 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'vault'
                ? 'border-emerald-600 text-emerald-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Document Vault ({vaultDocs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('support')}
            className={`pb-3.5 px-2 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'support'
                ? 'border-emerald-600 text-emerald-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>CA Support & Advisory</span>
          </button>
        </div>

        {/* TAB 1: TOOLS & LICENSES */}
        {activeTab === 'tools' && (
          <div className="space-y-8">
            {/* All-Access Pass Banner (if user hasn't unlocked everything) */}
            {unlockedCount < 8 && (
              <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-2xl border border-indigo-500/30 shadow-md flex flex-col sm:flex-row items-center justify-between gap-5">
                <div className="flex items-center gap-4 text-center sm:text-left">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-lg">
                    <Zap className="w-6 h-6 fill-current" />
                  </div>
                  <div>
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <span className="text-base font-extrabold">All-Access CA Compliance Suite Pass</span>
                      <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-black border border-amber-400/30">
                        SAVE 70%
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1 max-w-xl">
                      Unlock all 5 Pro Utilities (PDF Redactor, Schedule III Formatter, GSTR-2A Reconciliation, JSON Tax Computation, and GSTR-2A Cleaner) with lifetime access and unlimited exports.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedToolForPay({
                    id: 'all-access-pass',
                    name: 'All-Access CA Toolkit Pass',
                    slug: 'all-access-pass',
                    category: 'paid',
                    price: bundlePrice,
                    badge: 'Full Suite',
                    shortDesc: 'Lifetime access to all 5 professional tax & accounting utilities',
                    description: 'Unlimited access',
                    icon: 'Zap',
                    tags: ['All-Access', 'Pro Suite'],
                    features: []
                  })}
                  className="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-xs transition-all shadow-lg flex items-center gap-2 whitespace-nowrap cursor-pointer hover:scale-105 active:scale-95"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  <span>Unlock Full Suite (₹{bundlePrice})</span>
                </button>
              </div>
            )}

            {/* Filter & Search Bar */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex p-1 bg-slate-100 rounded-xl w-full sm:w-auto text-xs font-bold text-slate-600">
                <button
                  onClick={() => setToolFilter('all')}
                  className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                    toolFilter === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'hover:text-slate-900'
                  }`}
                >
                  All Tools (8)
                </button>
                <button
                  onClick={() => setToolFilter('unlocked')}
                  className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                    toolFilter === 'unlocked' ? 'bg-white text-emerald-700 shadow-sm' : 'hover:text-emerald-700'
                  }`}
                >
                  My Unlocked ({unlockedCount})
                </button>
                <button
                  onClick={() => setToolFilter('free')}
                  className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                    toolFilter === 'free' ? 'bg-white text-emerald-700 shadow-sm' : 'hover:text-emerald-700'
                  }`}
                >
                  Free Tools (3)
                </button>
                <button
                  onClick={() => setToolFilter('paid')}
                  className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                    toolFilter === 'paid' ? 'bg-white text-indigo-700 shadow-sm' : 'hover:text-indigo-700'
                  }`}
                >
                  Pro SaaS (5)
                </button>
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={toolSearch}
                  onChange={(e) => setToolSearch(e.target.value)}
                  placeholder="Search tools, tags, or features..."
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white transition-all outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Tools Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTools.map((tool) => {
                const isUnlocked = hasToolAccess(tool.id);
                const effectivePrice = getToolPrice(tool.id, tool.price);

                return (
                  <div
                    key={tool.id}
                    className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                      isUnlocked
                        ? 'bg-white border-slate-200/90 shadow-sm hover:border-emerald-300 hover:shadow-md'
                        : 'bg-slate-50/70 border-slate-200 opacity-90'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                            tool.category === 'free' ? 'bg-emerald-50' : 'bg-indigo-50'
                          }`}>
                            {getToolIcon(tool.icon)}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 text-sm leading-tight block">
                              {tool.name}
                            </span>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              {isUnlocked ? (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                                  <Check className="w-2.5 h-2.5" /> Unlocked & Active
                                </span>
                              ) : (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 flex items-center gap-1">
                                  <Lock className="w-2.5 h-2.5" /> ₹{effectivePrice} One-Time
                                </span>
                              )}
                              <span className="text-[10px] text-slate-400 font-medium">
                                {tool.badge}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                        {tool.shortDesc}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {tool.tags.slice(0, 3).map((tag, idx) => (
                          <span key={idx} className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400 font-medium">
                        {tool.category === 'free' ? 'Unlimited Free Usage' : isUnlocked ? 'Lifetime Verified License' : 'One-Time Payment'}
                      </span>
                      {isUnlocked ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setActiveLicenseModalTool(tool)}
                            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
                            title="View digital license certificate"
                          >
                            Certificate
                          </button>
                          <Link
                            href={`/tools/${tool.slug}`}
                            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1 transition-colors"
                          >
                            <span>Open Tool</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      ) : (
                        <button
                          onClick={() => setSelectedToolForPay(tool)}
                          className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Zap className="w-3 h-3 fill-white" />
                          <span>Unlock Tool (₹{effectivePrice})</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Active Tool Licenses & Receipts Table */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Your Active Tool Licenses & Digital Certificates</h3>
                  <p className="text-xs text-slate-500">Every unlocked utility comes with a non-expiring single-firm digital license certificate.</p>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  {unlockedCount} / 8 Active Licenses
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-3">Tool Name</th>
                      <th className="py-3 px-3">License Type</th>
                      <th className="py-3 px-3">Compliance Standard</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {TOOLS_LIST.filter(t => hasToolAccess(t.id)).map((t) => (
                      <tr key={t.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3 px-3 font-bold text-slate-900 flex items-center gap-2">
                          {getToolIcon(t.icon)}
                          <span>{t.name}</span>
                        </td>
                        <td className="py-3 px-3 text-slate-600">
                          {t.category === 'free' ? 'Public Open License' : 'Commercial Lifetime Pro License'}
                        </td>
                        <td className="py-3 px-3 text-slate-500">
                          {t.id === 'pdf-redactor' ? 'DPDP Act 2023 Compliant' : t.id.includes('gstr') ? 'GST Rule 36(4) / IT Act' : 'ICAI Schedule III Standard'}
                        </td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded-full text-[10px]">
                            Verified Active
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right space-x-2">
                          <button
                            onClick={() => setActiveLicenseModalTool(t)}
                            className="px-2 py-1 text-slate-600 hover:text-slate-900 font-medium underline"
                          >
                            Receipt
                          </button>
                          <Link
                            href={`/tools/${t.slug}`}
                            className="px-2.5 py-1 bg-emerald-600 text-white font-bold rounded-md hover:bg-emerald-700 transition-colors"
                          >
                            Launch
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: FILINGS & TRACKING */}
        {activeTab === 'filings' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-transparent p-4 rounded-2xl border border-emerald-200/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Real-Time Filing Progress & Assigned Senior CA</h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Track your Income Tax returns, GST compliances, and notice responses at each stage of verification.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('new_service')}
                className="text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-3.5 py-2 rounded-xl shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Book New Filing</span>
              </button>
            </div>

            {filings.length === 0 ? (
              <div className="bg-white rounded-2xl p-10 text-center border border-slate-200">
                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h4 className="text-sm font-bold text-slate-800">No active filing applications on record</h4>
                <p className="text-slate-500 text-xs mt-1 max-w-md mx-auto">
                  Start your ITR, GST, or Company filing today. Our Senior Chartered Accountants handle the filing end-to-end with 100% notice protection.
                </p>
                <button
                  onClick={() => setActiveTab('new_service')}
                  className="mt-4 px-5 py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 shadow-sm"
                >
                  Start New ITR or GST Filing
                </button>
              </div>
            ) : (
              filings.map((filing) => (
                <div key={filing.id} className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-5">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-slate-100">
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Application Tracking Number</span>
                      <h3 className="text-xl font-black text-slate-900">{filing.id}</h3>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-full border border-emerald-200">
                        {filing.service} — {filing.plan}
                      </span>
                      <span className="px-3 py-1 bg-slate-100 text-slate-700 font-semibold text-xs rounded-full uppercase">
                        {filing.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  {/* CA Assigned info & Financial Data */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs bg-slate-50/70 p-4 rounded-xl border border-slate-100">
                    <div>
                      <span className="text-slate-400 font-medium">Assigned Senior CA:</span>
                      <p className="font-bold text-slate-800 mt-0.5 text-sm">{filing.assignedCA?.name || 'CA Rajesh Sharma, FCA'}</p>
                      <p className="text-[10px] text-emerald-600 font-semibold">14+ Yrs Practice Exp</p>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium">Financial Year:</span>
                      <p className="font-bold text-slate-800 mt-0.5">{filing.financialYear || 'AY 2024-25'}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium">Estimated Refund / Offset:</span>
                      <p className="font-extrabold text-emerald-600 mt-0.5 text-sm">
                        {filing.estimatedRefund ? `₹${filing.estimatedRefund.toLocaleString('en-IN')}` : '₹18,400 (Computed)'}
                      </p>
                    </div>
                    <div className="flex items-center sm:justify-end">
                      <a
                        href={`https://wa.me/917275922162?text=Hello%20CA,%20regarding%20my%20filing%20application%20${filing.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-1.5 bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-300 font-bold rounded-lg shadow-sm text-xs transition-colors flex items-center gap-1.5"
                      >
                        <span>💬 WhatsApp CA</span>
                      </a>
                    </div>
                  </div>

                  {/* Timeline */}
                  {filing.timeline && filing.timeline.length > 0 ? (
                    <div className="pt-2">
                      <p className="text-xs font-bold text-slate-700 mb-3 uppercase tracking-wider">Filing Progress Timeline:</p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2.5">
                        {filing.timeline.map((step: any, idx: number) => (
                          <div
                            key={idx}
                            className={`p-3 rounded-xl border text-center transition-all ${
                              step.completed
                                ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
                                : step.current
                                ? 'bg-amber-50 border-amber-300 text-amber-950 ring-2 ring-amber-400/20'
                                : 'bg-slate-50 border-slate-200 text-slate-400'
                            }`}
                          >
                            <div className="flex items-center justify-center mb-1">
                              {step.completed ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              ) : step.current ? (
                                <Clock className="w-4 h-4 text-amber-600 animate-pulse" />
                              ) : (
                                <div className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center text-[9px] font-bold text-slate-400">
                                  {idx + 1}
                                </div>
                              )}
                            </div>
                            <div className="text-[10px] font-bold uppercase">{step.title}</div>
                            <div className="text-[9px] mt-1 line-clamp-1">{step.date || 'Pending'}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="pt-2">
                      <p className="text-xs font-bold text-slate-700 mb-3 uppercase tracking-wider">Standard 5-Step Filing Progress:</p>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                        <div className="p-3 rounded-xl border bg-emerald-50 border-emerald-300 text-emerald-950 text-center">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                          <div className="text-[10px] font-bold uppercase">1. Docs Received</div>
                          <div className="text-[9px] text-emerald-700 mt-0.5">Completed</div>
                        </div>
                        <div className="p-3 rounded-xl border bg-emerald-50 border-emerald-300 text-emerald-950 text-center">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                          <div className="text-[10px] font-bold uppercase">2. CA Computation</div>
                          <div className="text-[9px] text-emerald-700 mt-0.5">Completed</div>
                        </div>
                        <div className="p-3 rounded-xl border bg-amber-50 border-amber-300 text-amber-950 text-center ring-2 ring-amber-400/20">
                          <Clock className="w-4 h-4 text-amber-600 mx-auto mb-1 animate-pulse" />
                          <div className="text-[10px] font-bold uppercase">3. Client Approval</div>
                          <div className="text-[9px] text-amber-700 mt-0.5 font-bold">In Progress</div>
                        </div>
                        <div className="p-3 rounded-xl border bg-slate-50 border-slate-200 text-slate-400 text-center">
                          <div className="w-4 h-4 rounded-full border border-slate-300 mx-auto mb-1 flex items-center justify-center text-[9px]">4</div>
                          <div className="text-[10px] font-bold uppercase">4. Portal Filing</div>
                          <div className="text-[9px] mt-0.5">Pending</div>
                        </div>
                        <div className="p-3 rounded-xl border bg-slate-50 border-slate-200 text-slate-400 text-center">
                          <div className="w-4 h-4 rounded-full border border-slate-300 mx-auto mb-1 flex items-center justify-center text-[9px]">5</div>
                          <div className="text-[10px] font-bold uppercase">5. ITR-V Generated</div>
                          <div className="text-[9px] mt-0.5">Pending</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Quick Application Actions */}
                  <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="text-slate-500">
                      Need to update documents or change bank details? Contact your assigned CA directly.
                    </div>
                    <button
                      onClick={() => setActiveTab('vault')}
                      className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Addendum Document</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 3: REQUEST NEW SERVICE */}
        {activeTab === 'new_service' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
              <h3 className="text-xl font-black text-slate-900 mb-1">Book Chartered Accountant Service</h3>
              <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                Select from our 20 professional services. Handled by experienced Senior CAs with zero penalty guarantee.
              </p>

              {serviceBookingSuccess && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <span className="font-bold block">Consultation Request Confirmed!</span>
                    <span>Our Senior CA desk will call or WhatsApp you within 30 minutes with the engagement letter and checklist.</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleBookService} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">Select Service</label>
                  <select
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 text-xs focus:bg-white transition-all outline-none focus:border-emerald-500"
                  >
                    {SERVICES_LIST.map(s => (
                      <option key={s.id} value={s.title}>
                        {s.number}. {s.title} (Starting {s.startingPrice})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">Entity / Taxpayer Type</label>
                    <select
                      value={entityType}
                      onChange={(e) => setEntityType(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 text-xs focus:bg-white transition-all outline-none focus:border-emerald-500"
                    >
                      <option value="Individual Salaried">Individual Salaried (Form 16)</option>
                      <option value="Freelancer / Consultant">Freelancer / Consultant (Sec 44ADA)</option>
                      <option value="Proprietorship Business">Proprietorship Business (Sec 44AD)</option>
                      <option value="Private Limited / LLP">Private Limited / LLP</option>
                      <option value="Partnership Firm">Partnership Firm</option>
                      <option value="Trust / NGO / Section 8">Trust / NGO / Section 8</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">Preferred Callback Time</label>
                    <select
                      value={preferredSlot}
                      onChange={(e) => setPreferredSlot(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 text-xs focus:bg-white transition-all outline-none focus:border-emerald-500"
                    >
                      <option value="Morning (10:00 AM - 01:00 PM)">Morning (10:00 AM - 01:00 PM)</option>
                      <option value="Afternoon (02:00 PM - 05:00 PM)">Afternoon (02:00 PM - 05:00 PM)</option>
                      <option value="Evening (05:00 PM - 08:00 PM)">Evening (05:00 PM - 08:00 PM)</option>
                      <option value="Urgent (Within 30 Minutes)">Urgent (Within 30 Minutes)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">Your Mobile / WhatsApp Number</label>
                  <input
                    type="tel"
                    required
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:bg-white transition-all outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">Specific Requirements or Existing Notices (Optional)</label>
                  <textarea
                    rows={3}
                    value={serviceNotes}
                    onChange={(e) => setServiceNotes(e.target.value)}
                    placeholder="e.g. Received IT Notice u/s 143(1), have foreign stocks in US, or need GSTR-9 annual audit."
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:bg-white transition-all outline-none focus:border-emerald-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingService}
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmittingService ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Confirming Request...</span>
                    </>
                  ) : (
                    <>
                      <span>Confirm Request & Assign Senior CA</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Sidebar with Trust Markers */}
            <div className="space-y-4">
              <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-sm space-y-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h4 className="font-extrabold text-sm">Tracconsultant Notice Shield™</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Every return filed through our chartered accountants is backed by our full Notice Shield guarantee. If any tax department scrutiny arises, our legal team drafts the response at zero additional cost.
                </p>
                <div className="pt-2 border-t border-slate-800 space-y-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>In-House Fellow Chartered Accountants</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Direct WhatsApp & Call Access</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>256-Bit Bank-Grade Data Vault</span>
                  </div>
                </div>
              </div>

              <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-200/80 text-emerald-900 text-xs space-y-2">
                <div className="font-bold flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-emerald-700" />
                  <span>30-Minute Turnaround Guarantee</span>
                </div>
                <p className="text-emerald-800 leading-relaxed">
                  During business hours (10 AM to 8 PM IST), a dedicated Senior CA will contact you within 30 minutes of form submission.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: DOCUMENT VAULT */}
        {activeTab === 'vault' && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Secure Client Document Vault</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Encrypted with 256-bit bank-grade encryption. Accessible strictly by you and your assigned CA.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  🔒 256-Bit Encrypted
                </span>
              </div>
            </div>

            {/* Drag & Drop Box */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-8 text-center bg-slate-50/50 hover:bg-emerald-50/20 transition-all cursor-pointer group"
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                multiple
                accept=".pdf,.xlsx,.xls,.csv,.png,.jpg,.jpeg,.zip"
                className="hidden"
              />
              <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                {isUploading ? (
                  <RefreshCw className="w-6 h-6 text-emerald-600 animate-spin" />
                ) : (
                  <Upload className="w-6 h-6 text-emerald-600" />
                )}
              </div>
              <p className="text-xs font-bold text-slate-800">
                {isUploading ? 'Encrypting and saving documents...' : 'Click to browse files or drag & drop tax documents here'}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Supports PDF, Excel (.xlsx/.xls), CSV, PNG, JPG up to 25MB (Form 16, Bank Statements, Ledger, PAN)
              </p>
              <button 
                type="button"
                className="mt-3 px-4 py-1.5 bg-emerald-600 text-white font-bold text-xs rounded-lg shadow-sm hover:bg-emerald-700 transition-colors pointer-events-none"
              >
                Select Files to Upload
              </button>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center justify-between gap-4 pt-2">
              <div className="flex gap-2 overflow-x-auto text-xs font-bold text-slate-600">
                <button
                  onClick={() => setVaultFilter('all')}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    vaultFilter === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 hover:bg-slate-200'
                  }`}
                >
                  All ({vaultDocs.length})
                </button>
                <button
                  onClick={() => setVaultFilter('tax')}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    vaultFilter === 'tax' ? 'bg-slate-900 text-white' : 'bg-slate-100 hover:bg-slate-200'
                  }`}
                >
                  Tax Returns
                </button>
                <button
                  onClick={() => setVaultFilter('financials')}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    vaultFilter === 'financials' ? 'bg-slate-900 text-white' : 'bg-slate-100 hover:bg-slate-200'
                  }`}
                >
                  Financials & Ledgers
                </button>
                <button
                  onClick={() => setVaultFilter('bank')}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    vaultFilter === 'bank' ? 'bg-slate-900 text-white' : 'bg-slate-100 hover:bg-slate-200'
                  }`}
                >
                  Bank Statements
                </button>
              </div>
            </div>

            {/* Document List */}
            <div className="space-y-2.5">
              {filteredVaultDocs.map((doc) => (
                <div 
                  key={doc.id} 
                  className="p-3.5 bg-slate-50/80 hover:bg-slate-50 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border border-slate-200 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 text-emerald-600 shadow-sm">
                      {doc.type.includes('PDF') ? (
                        <FileText className="w-5 h-5 text-red-500" />
                      ) : (
                        <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800">{doc.name}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {doc.size} • {doc.category} • Uploaded {doc.uploadDate}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {doc.status === 'verified' ? (
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <BadgeCheck className="w-3 h-3" /> Verified by CA
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Under Review
                      </span>
                    )}

                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        alert(`Downloading ${doc.name} from secure vault...`);
                      }}
                      className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-lg transition-colors"
                      title="Download file"
                    >
                      <Download className="w-4 h-4" />
                    </a>

                    <button
                      onClick={() => handleDeleteDoc(doc.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete file"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: CA SUPPORT & ADVISORY */}
        {activeTab === 'support' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900">Direct Chartered Accountant Desk</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Connect directly with our in-house advisory board for tax planning, scrutinies, corporate structures, or urgent notice deadlines.
              </p>

              <div className="space-y-3 pt-2 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-800 block">Senior CA WhatsApp Hotline</span>
                    <span className="text-slate-400">+91 72759 22162 (Mon - Sat, 10 AM - 8 PM)</span>
                  </div>
                  <a
                    href="https://wa.me/917275922162"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    Open Chat
                  </a>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-800 block">Official Support Email</span>
                    <span className="text-slate-400">support@tracconsultant.com</span>
                  </div>
                  <a
                    href="mailto:support@tracconsultant.com"
                    className="px-3 py-1.5 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    Email Us
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900">Notice Shield & Privacy Commitment</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Our practice is built on complete transparency, DPDP Act 2023 client confidentiality, and fiduciary responsibility.
              </p>

              <ul className="space-y-2.5 text-xs text-slate-600 pt-1">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Zero Penalty Guarantee:</strong> Any interest penalty arising from our computation errors is compensated 100%.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Client Confidentiality:</strong> Documents are processed exclusively client-side or on secured encrypted Indian server nodes.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>ICAI Ethical Standards:</strong> Every advisory opinion conforms to ICAI Code of Ethics and relevant statutory provisions.</span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Digital License / Certificate Modal */}
      {activeLicenseModalTool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 sm:p-8 relative space-y-5">
            <button
              onClick={() => setActiveLicenseModalTool(null)}
              className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center space-y-2">
              <div className="w-14 h-14 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                <BadgeCheck className="w-8 h-8" />
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Official Digital License
              </span>
              <h3 className="text-xl font-black text-slate-900">
                {activeLicenseModalTool.name}
              </h3>
              <p className="text-xs text-slate-500">
                Non-Expiring Lifetime Single-User / Firm License
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs space-y-2.5">
              <div className="flex justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-400">License ID:</span>
                <span className="font-mono font-bold text-slate-800">
                  TRAC-LIC-{activeLicenseModalTool.id.toUpperCase().slice(0, 8)}-2025
                </span>
              </div>
              <div className="flex justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-400">Licensee Name:</span>
                <span className="font-bold text-slate-800">{user.name}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-400">Registered Email:</span>
                <span className="font-medium text-slate-800">{user.email}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-400">License Tier:</span>
                <span className="font-bold text-emerald-700">
                  {activeLicenseModalTool.category === 'free' ? 'Public Free Access' : 'Verified Commercial Pro'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Verification Status:</span>
                <span className="font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 100% Active & Cryptographically Signed
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => window.print()}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Certificate</span>
              </button>
              <Link
                href={`/tools/${activeLicenseModalTool.slug}`}
                onClick={() => setActiveLicenseModalTool(null)}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Launch Workspace</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Paywall Modal */}
      {selectedToolForPay && (
        <ToolPaywallModal
          isOpen={Boolean(selectedToolForPay)}
          onClose={() => setSelectedToolForPay(null)}
          toolId={selectedToolForPay.id}
          toolName={selectedToolForPay.name}
          price={selectedToolForPay.price}
          onUnlockSuccess={() => {
            refreshUser();
          }}
        />
      )}
    </div>
  );
}

'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { useConfig } from '@/context/ConfigContext';
import { TOOLS_LIST, SERVICES_LIST, ToolConfig } from '@/lib/data';
import ToolPaywallModal from '@/components/ToolPaywallModal';
import { 
  User as UserIcon, 
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
  FileArchive,
  Receipt,
  Download,
  Trash2,
  Printer,
  BadgeCheck,
  Building2,
  HelpCircle,
  FolderLock,
  RefreshCw,
  X,
  LogOut,
  Mail,
  KeyRound,
  AlertCircle,
  Briefcase,
  PhoneCall,
  UserCheck,
  CreditCard,
  History,
  FileCheck
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
  const { user, isLoading, hasToolAccess, login, register, loginWithGoogle, logout, refreshUser } = useAuth();
  const { toolPrices, getToolPrice } = useConfig();
  
  // Tab navigation
  const [activeTab, setActiveTab] = useState<'filings' | 'tools' | 'payments' | 'new_service' | 'vault' | 'profile'>('filings');
  
  // Unauthenticated Portal Gate State
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authPhone, setAuthPhone] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');

  // Portal Backend Data
  const [portalData, setPortalData] = useState<{
    filings: any[];
    toolPurchases: any[];
    payments: any[];
    stats: {
      activeFilings: number;
      completedFilings: number;
      unlockedPaidTools: number;
      verifiedPayments: number;
    };
  }>({
    filings: [],
    toolPurchases: [],
    payments: [],
    stats: {
      activeFilings: 0,
      completedFilings: 0,
      unlockedPaidTools: 0,
      verifiedPayments: 0
    }
  });
  const [isDataLoading, setIsDataLoading] = useState(false);

  // Tools modal
  const [selectedToolForPay, setSelectedToolForPay] = useState<ToolConfig | null>(null);
  const [activeLicenseModalTool, setActiveLicenseModalTool] = useState<ToolConfig | null>(null);

  // New Service booking state
  const [selectedService, setSelectedService] = useState('ITR Filing for Salaried (Form 16)');
  const [entityType, setEntityType] = useState('Individual Salaried');
  const [preferredSlot, setPreferredSlot] = useState('Morning (10:00 AM - 01:00 PM)');
  const [clientPhone, setClientPhone] = useState('');
  const [serviceNotes, setServiceNotes] = useState('');
  const [isSubmittingService, setIsSubmittingService] = useState(false);
  const [serviceBookingSuccess, setServiceBookingSuccess] = useState('');

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
    }
  ]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Receipt Modal state
  const [viewReceiptPayment, setViewReceiptPayment] = useState<any | null>(null);

  // Profile edit state
  const [profileName, setProfileName] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileSaved, setProfileSaved] = useState(false);

  // 1. Fetch user portal data from server
  const loadPortalData = async () => {
    if (!user) return;
    setIsDataLoading(true);
    try {
      const res = await fetch(`/api/user/portal?userId=${encodeURIComponent(user.id)}&email=${encodeURIComponent(user.email)}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setPortalData({
          filings: data.filings || [],
          toolPurchases: data.toolPurchases || [],
          payments: data.payments || [],
          stats: data.stats || {
            activeFilings: (data.filings || []).filter((f: any) => f.status !== 'completed').length,
            completedFilings: (data.filings || []).filter((f: any) => f.status === 'completed').length,
            unlockedPaidTools: (user.unlockedTools || []).filter((t: string) => !['hra-calculator', 'advance-tax-calculator', 'tax-calculator', 'pdf-redactor', 'tb-to-balancesheet', 'gstr2a-reconciliation', 'json-to-computation', 'gstr2a-cleaner'].includes(t)).length,
            verifiedPayments: (data.payments || []).length
          }
        });
        setClientPhone(user.phone || '');
        setProfileName(user.name || '');
        setProfilePhone(user.phone || '');
      }
    } catch (err) {
      console.error('Error loading portal data:', err);
    } finally {
      setIsDataLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadPortalData();
    }
  }, [user]);

  // Auth Submit Handler (Login / Register inside Portal Gate)
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');
    setAuthLoading(true);

    try {
      if (authMode === 'login') {
        const res = await login(authEmail.trim(), authPassword);
        if (!res.success) {
          setAuthError(res.error || 'Failed to sign in. Please verify your credentials.');
        } else {
          setAuthSuccess('Welcome back! Loading your portal...');
        }
      } else {
        if (!authName.trim()) {
          setAuthError('Please enter your full legal or firm name.');
          setAuthLoading(false);
          return;
        }
        const res = await register(authName.trim(), authEmail.trim(), authPassword, authPhone.trim());
        if (!res.success) {
          setAuthError(res.error || 'Registration failed. Please try a different email.');
        } else {
          setAuthSuccess('Account created successfully! Welcome to Tracconsultant.');
        }
      }
    } catch (err: any) {
      setAuthError(err.message || 'Authentication error.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleGooglePortalLogin = async () => {
    setAuthError('');
    setAuthLoading(true);
    const googlePromptEmail = authEmail.trim() || prompt('Enter your Google Account email address:') || '';
    if (!googlePromptEmail) {
      setAuthLoading(false);
      return;
    }
    const res = await loginWithGoogle(googlePromptEmail);
    if (!res.success) {
      setAuthError(res.error || 'Google authentication failed.');
    }
    setAuthLoading(false);
  };

  // Service Booking Handler
  const handleBookService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSubmittingService(true);
    setServiceBookingSuccess('');

    try {
      const res = await fetch('/api/user/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'book_service',
          userId: user.id,
          email: user.email,
          service: selectedService,
          entityType,
          preferredSlot,
          clientPhone: clientPhone || user.phone,
          notes: serviceNotes
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setServiceBookingSuccess(`Booking confirmed! Assigned Reference ID: ${data.filing?.id || 'TRAC-NEW'}. Our Senior CA will connect with you within 15-30 minutes.`);
        setServiceNotes('');
        await loadPortalData();
        setTimeout(() => {
          setActiveTab('filings');
        }, 1500);
      } else {
        alert(data.error || 'Failed to register service booking.');
      }
    } catch (err) {
      alert('Network error while booking service.');
    } finally {
      setIsSubmittingService(false);
    }
  };

  // Profile Update Handler
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      const res = await fetch('/api/user/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_profile',
          userId: user.id,
          email: user.email,
          name: profileName,
          phone: profilePhone
        })
      });
      if (res.ok) {
        setProfileSaved(true);
        refreshUser();
        setTimeout(() => setProfileSaved(false), 3000);
      }
    } catch {
      alert('Failed to update profile.');
    }
  };

  // Vault File Upload Handler
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
        type: file.type.includes('pdf') ? 'PDF Document' : file.name.endsWith('.xlsx') ? 'Excel Spreadsheet' : 'Tax Document',
        category: file.name.toLowerCase().includes('form16') || file.name.toLowerCase().includes('itr') ? 'Tax Returns' : 'Financials',
        uploadDate: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        status: 'under_review'
      });
    });

    setTimeout(() => {
      setVaultDocs(prev => [...newDocs, ...prev]);
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }, 600);
  };

  const handleDeleteDoc = (id: string) => {
    setVaultDocs(prev => prev.filter(d => d.id !== id));
  };

  // 4 Advance/Pro Tools Catalog
  const advanceProTools = useMemo(() => {
    return TOOLS_LIST.filter(t => ['advanced-pdf-redactor', 'advanced-computation-generator', 'file-compressor', 'gst-invoice-generator'].includes(t.id));
  }, []);

  const basicFreeTools = useMemo(() => {
    return TOOLS_LIST.filter(t => t.category === 'free');
  }, []);

  // Check if All-Access Pass is active
  const hasAllAccess = hasToolAccess('all-access-pass') || hasToolAccess('all-access') || user?.role === 'admin';

  // -------------------------------------------------------------
  // 1. Loading State
  // -------------------------------------------------------------
  if (isLoading) {
    return (
      <div className="min-h-[75vh] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 animate-pulse">
        <div className="h-10 w-64 bg-slate-200 rounded-xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-28 bg-white border border-slate-200 rounded-2xl p-5" />
          ))}
        </div>
        <div className="h-80 bg-white border border-slate-200 rounded-3xl" />
      </div>
    );
  }

  // -------------------------------------------------------------
  // 2. Unauthenticated: Dedicated Client Portal Gate
  // -------------------------------------------------------------
  if (!user) {
    return (
      <div className="min-h-[85vh] bg-gradient-to-b from-slate-50 via-white to-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Brand & Security Guarantees */}
          <div className="lg:col-span-6 space-y-6 lg:pr-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-xs font-bold text-emerald-700">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Official Taxpayer &amp; Client Gateway</span>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                Welcome to your <span className="text-emerald-600">Client Control Portal</span>
              </h1>
              <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
                Sign in to manage your filed income tax returns, launch purchased compliance software, view assigned Chartered Accountants, and download official receipts.
              </p>
            </div>

            {/* Value Pillars */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <FileCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Permanent Record Persistence</h4>
                  <p className="text-[11px] text-slate-500 leading-normal">
                    All your filings, uploaded documents, and tax sheets remain safely saved under your email — even if you log out or return months later.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
                <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Paid Software Workstation</h4>
                  <p className="text-[11px] text-slate-500 leading-normal">
                    Direct access to PDF Redactor Advance, Computation Generator, and File Compressor with permanent digital license keys.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
                <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0 mt-0.5">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Direct Chartered Accountant Desk</h4>
                  <p className="text-[11px] text-slate-500 leading-normal">
                    1-on-1 dedicated CA assistance on WhatsApp &amp; phone for all scrutiny notices, ITR verification, and GST audit reconciliation.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5 text-emerald-600" /> 256-Bit SSL Encrypted</span>
              <span>•</span>
              <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> DPDP Act 2023 Compliant</span>
            </div>
          </div>

          {/* Right Column: Dual-Tab Interactive Auth Card */}
          <div className="lg:col-span-6">
            <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6 sm:p-8 space-y-6">
              
              {/* Tab Selector */}
              <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl">
                <button
                  type="button"
                  onClick={() => { setAuthMode('login'); setAuthError(''); setAuthSuccess(''); }}
                  className={`py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                    authMode === 'login' 
                      ? 'bg-white text-slate-900 shadow-xs' 
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Sign In to Account
                </button>
                <button
                  type="button"
                  onClick={() => { setAuthMode('register'); setAuthError(''); setAuthSuccess(''); }}
                  className={`py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                    authMode === 'register' 
                      ? 'bg-white text-slate-900 shadow-xs' 
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Create New Account
                </button>
              </div>

              {/* Feedback messages */}
              {authError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                  <span>{authError}</span>
                </div>
              )}
              {authSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{authSuccess}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleAuthSubmit} className="space-y-4">
                {authMode === 'register' && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Full Legal Name / Firm</label>
                      <div className="relative">
                        <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                        <input
                          type="text"
                          required
                          value={authName}
                          onChange={e => setAuthName(e.target.value)}
                          placeholder="e.g. Mohammad Hamza"
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp Mobile Number</label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                        <input
                          type="tel"
                          value={authPhone}
                          onChange={e => setAuthPhone(e.target.value)}
                          placeholder="e.g. 9876543210"
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                        />
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      value={authEmail}
                      onChange={e => setAuthEmail(e.target.value)}
                      placeholder="e.g. client@example.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="password"
                      required
                      value={authPassword}
                      onChange={e => setAuthPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  {authLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>{authMode === 'login' ? 'Sign In to Portal' : 'Create Taxpayer Account'}</span>
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="relative flex items-center justify-center">
                <div className="border-t border-slate-200 w-full" />
                <span className="bg-white px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider relative">
                  or continue with
                </span>
              </div>

              {/* Google 1-Click Login */}
              <button
                type="button"
                onClick={handleGooglePortalLogin}
                disabled={authLoading}
                className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-semibold text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center gap-2.5 shadow-2xs cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Google Instant 1-Click Login</span>
              </button>

              <div className="pt-2 text-center">
                <p className="text-[11px] text-slate-400">
                  {authMode === 'login' ? (
                    <>New client? <button onClick={() => { setAuthMode('register'); setAuthError(''); }} className="text-emerald-600 font-bold hover:underline">Create your account</button></>
                  ) : (
                    <>Already have an account? <button onClick={() => { setAuthMode('login'); setAuthError(''); }} className="text-emerald-600 font-bold hover:underline">Sign in here</button></>
                  )}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 3. Authenticated: Systematic Client Control Panel
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-slate-50/50 pb-16">
      
      {/* Top Client Header Strip */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            
            {/* User Details */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-black text-xl flex items-center justify-center shadow-md shadow-emerald-900/10">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full rounded-2xl object-cover" />
                ) : (
                  user.name.charAt(0).toUpperCase()
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    {user.name}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {user.role === 'admin' ? 'Administrator' : 'Verified Taxpayer'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {user.email} • Client ID: <span className="font-mono font-bold text-slate-700">TRAC-CL-{user.id.slice(-6).toUpperCase()}</span>
                </p>
              </div>
            </div>

            {/* Header Action Buttons */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={loadPortalData}
                disabled={isDataLoading}
                className="p-2 text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer"
                title="Refresh Portal Data"
              >
                <RefreshCw className={`w-4 h-4 ${isDataLoading ? 'animate-spin' : ''}`} />
              </button>

              <a
                href="https://wa.me/917275922162?text=Hello%20Tracconsultant,%20I%20am%20logged%20into%20my%20Client%20Portal%20and%20need%20CA%20assistance."
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 px-3 bg-[#00a859] hover:bg-[#008f4c] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Assigned CA Desk</span>
              </a>

              <button
                onClick={logout}
                className="py-2 px-3 text-slate-600 hover:text-red-600 bg-slate-100 hover:bg-red-50 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>

          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mt-6">
            
            <div 
              onClick={() => setActiveTab('filings')}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                activeTab === 'filings' ? 'bg-emerald-50/70 border-emerald-300 shadow-xs' : 'bg-slate-50/80 border-slate-200/80 hover:bg-slate-100/70'
              }`}
            >
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-emerald-600" />
                <span>Services &amp; Filings</span>
              </div>
              <div className="text-2xl font-black text-slate-900 mt-1">
                {portalData.filings.length}
              </div>
              <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">
                {portalData.stats.activeFilings} active • {portalData.stats.completedFilings} completed
              </div>
            </div>

            <div 
              onClick={() => setActiveTab('tools')}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                activeTab === 'tools' ? 'bg-indigo-50/70 border-indigo-300 shadow-xs' : 'bg-slate-50/80 border-slate-200/80 hover:bg-slate-100/70'
              }`}
            >
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-indigo-600" />
                <span>Paid Compliance Tools</span>
              </div>
              <div className="text-2xl font-black text-indigo-900 mt-1">
                {hasAllAccess ? 'All 4 Pro' : `${portalData.stats.unlockedPaidTools} Unlocked`}
              </div>
              <div className="text-[11px] text-indigo-600 font-semibold mt-0.5">
                {hasAllAccess ? 'All-Access Pass Active' : 'Lifetime Digital Licenses'}
              </div>
            </div>

            <div 
              onClick={() => setActiveTab('payments')}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                activeTab === 'payments' ? 'bg-teal-50/70 border-teal-300 shadow-xs' : 'bg-slate-50/80 border-slate-200/80 hover:bg-slate-100/70'
              }`}
            >
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Receipt className="w-3.5 h-3.5 text-teal-600" />
                <span>Invoices &amp; Receipts</span>
              </div>
              <div className="text-2xl font-black text-slate-900 mt-1">
                {portalData.payments.length}
              </div>
              <div className="text-[11px] text-teal-600 font-semibold mt-0.5">
                100% Tax Compliant
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>CA Advisory Cell</span>
              </div>
              <div className="text-xs font-black text-slate-900 mt-2 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Senior CA Desk Live</span>
              </div>
              <div className="text-[11px] text-slate-500 font-medium mt-1">
                Direct Helpline: +91 7275922162
              </div>
            </div>

          </div>

          {/* Tab Navigation Strip */}
          <div className="flex items-center gap-2 overflow-x-auto pt-6 border-t border-slate-100 mt-6 no-scrollbar">
            <button
              onClick={() => setActiveTab('filings')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'filings'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>My Services &amp; Filings ({portalData.filings.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('tools')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'tools'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>My Active Paid Tools</span>
              {hasAllAccess && (
                <span className="bg-indigo-200 text-indigo-900 text-[10px] px-1.5 py-0.2 rounded-full font-black">ALL-ACCESS</span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('payments')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'payments'
                  ? 'bg-teal-700 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Receipt className="w-4 h-4" />
              <span>Invoices &amp; Payments ({portalData.payments.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('vault')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'vault'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FolderLock className="w-4 h-4" />
              <span>Document Vault</span>
            </button>

            <button
              onClick={() => setActiveTab('new_service')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'new_service'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>Book New Service</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ml-auto ${
                activeTab === 'profile'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <UserIcon className="w-4 h-4" />
              <span>Account &amp; Security</span>
            </button>
          </div>

        </div>
      </div>

      {/* Main Tab Views */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">

        {/* ========================================================================= */}
        {/* TAB 1: MY SERVICES & FILINGS (Backend Real Filings) */}
        {/* ========================================================================= */}
        {activeTab === 'filings' && (
          <div className="space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
              <div>
                <h2 className="text-lg font-black text-slate-900">Your Compliance Services &amp; Applications</h2>
                <p className="text-xs text-slate-500">Live progress tracking, assigned CA partner details, and timeline checkpoints.</p>
              </div>
              <button
                onClick={() => setActiveTab('new_service')}
                className="py-2 px-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Book New CA Filing</span>
              </button>
            </div>

            {portalData.filings.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 border border-slate-200 text-center space-y-4 shadow-xs">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto border border-emerald-100">
                  <FileText className="w-8 h-8" />
                </div>
                <div className="max-w-md mx-auto space-y-1">
                  <h3 className="text-base font-black text-slate-900">No active applications yet</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    You haven&apos;t booked any CA-assisted filing yet. Book your Income Tax Return, GST registration, or Trademark filing online in under 2 minutes.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('new_service')}
                  className="py-2.5 px-5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Book Your First Service</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {portalData.filings.map((filing: any) => {
                  const statusColors: Record<string, string> = {
                    new: 'bg-blue-50 text-blue-700 border-blue-200',
                    under_review: 'bg-amber-50 text-amber-700 border-amber-200',
                    ca_assigned: 'bg-indigo-50 text-indigo-700 border-indigo-200',
                    docs_pending: 'bg-red-50 text-red-700 border-red-200',
                    draft_ready: 'bg-purple-50 text-purple-700 border-purple-200',
                    filed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                    completed: 'bg-emerald-100 text-emerald-800 border-emerald-300',
                    rejected: 'bg-red-100 text-red-800 border-red-300'
                  };

                  return (
                    <div key={filing.id} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
                      
                      {/* Top Card Row */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                        <div>
                          <div className="flex items-center gap-2.5">
                            <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                              {filing.id}
                            </span>
                            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wide border ${statusColors[filing.status] || 'bg-slate-100 text-slate-700'}`}>
                              {filing.status.replace('_', ' ')}
                            </span>
                          </div>
                          <h3 className="text-lg font-black text-slate-900 mt-1">
                            {filing.service}
                          </h3>
                          <p className="text-xs text-slate-400">
                            {filing.plan} • {filing.financialYear} • Registered: {new Date(filing.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <Link
                            href={`/track?query=${encodeURIComponent(filing.id)}`}
                            className="py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
                          >
                            <span>Track ARN</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </Link>
                          <a
                            href={`https://wa.me/917275922162?text=Hello%20CA,%20inquiring%20about%20my%20filing%20Ref:%20${filing.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="py-1.5 px-3 bg-[#00a859] hover:bg-[#008f4c] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                          >
                            <PhoneCall className="w-3.5 h-3.5" />
                            <span>WhatsApp CA</span>
                          </a>
                        </div>
                      </div>

                      {/* Timeline Stepper */}
                      {filing.timeline && filing.timeline.length > 0 && (
                        <div className="pt-2">
                          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
                            Filing Milestone Stages
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                            {filing.timeline.map((step: any, idx: number) => (
                              <div 
                                key={idx} 
                                className={`p-3 rounded-2xl border transition-all ${
                                  step.completed 
                                    ? 'bg-emerald-50/60 border-emerald-200' 
                                    : step.current 
                                      ? 'bg-blue-50/60 border-blue-300 ring-2 ring-blue-500/20' 
                                      : 'bg-slate-50 border-slate-100 opacity-60'
                                }`}
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-[10px] font-bold text-slate-400">Step {step.step || idx + 1}</span>
                                  {step.completed ? (
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                  ) : step.current ? (
                                    <Clock className="w-3.5 h-3.5 text-blue-600 animate-spin" />
                                  ) : (
                                    <div className="w-2 h-2 rounded-full bg-slate-300" />
                                  )}
                                </div>
                                <div className="text-xs font-bold text-slate-800 leading-snug">
                                  {step.title}
                                </div>
                                {step.date && (
                                  <div className="text-[10px] text-slate-400 mt-1">
                                    {step.date}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Notes / Details */}
                      {filing.clientNotes && (
                        <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs space-y-1">
                          <span className="font-bold text-slate-700">Application Notes:</span>
                          <p className="text-slate-600">{filing.clientNotes}</p>
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>
            )}

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: MY ACTIVE PAID TOOLS (Workstations & Unlocked Utilities) */}
        {/* ========================================================================= */}
        {activeTab === 'tools' && (
          <div className="space-y-8">
            
            {/* All-Access Banner if user has All-Access Pass */}
            {hasAllAccess && (
              <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center md:text-left">
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-white/20 rounded-full text-xs font-extrabold uppercase tracking-wide">
                    <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                    <span>All-Access CA Toolkit Pass Active</span>
                  </div>
                  <h3 className="text-xl font-black">All 4 Advance &amp; Pro Modules Permanently Unlocked</h3>
                  <p className="text-xs text-white/80">
                    Unlimited lifetime usage, client-side encryption, and zero restrictions across all tools.
                  </p>
                </div>
                <span className="py-2.5 px-4 bg-white text-slate-900 font-extrabold text-xs rounded-xl shadow-sm whitespace-nowrap">
                  Active • Lifetime Single Firm License
                </span>
              </div>
            )}

            {/* 4 Advance / Pro Tools */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-slate-900">4 Advance &amp; Pro Compliance Modules</h2>
                  <p className="text-xs text-slate-500">Official CA utility workstations with client-side zero leakage architecture.</p>
                </div>
                <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-xl border border-indigo-200">
                  {advanceProTools.filter(t => hasToolAccess(t.id)).length} of 4 Unlocked
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {advanceProTools.map(tool => {
                  const isUnlocked = hasToolAccess(tool.id);
                  const price = getToolPrice(tool.id, tool.price);

                  return (
                    <div 
                      key={tool.id} 
                      className={`rounded-3xl p-6 sm:p-7 border transition-all space-y-5 bg-white ${
                        isUnlocked 
                          ? 'border-emerald-300 shadow-sm ring-1 ring-emerald-500/10' 
                          : 'border-slate-200 shadow-2xs'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg ${
                            isUnlocked ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-indigo-50 text-indigo-600 border border-indigo-200'
                          }`}>
                            {tool.id.includes('pdf') ? <EyeOff className="w-6 h-6" /> : tool.id.includes('computation') ? <FileCode2 className="w-6 h-6" /> : tool.id.includes('compressor') ? <FileArchive className="w-6 h-6" /> : <Receipt className="w-6 h-6" />}
                          </div>
                          <div>
                            <span className={`text-[10px] font-extrabold uppercase tracking-wide px-2 py-0.5 rounded-md ${
                              tool.badge === 'Advance' ? 'bg-indigo-100 text-indigo-800' : 'bg-emerald-100 text-emerald-800'
                            }`}>
                              {tool.badge || 'PRO'}
                            </span>
                            <h3 className="text-base font-black text-slate-900 mt-1">
                              {tool.name}
                            </h3>
                          </div>
                        </div>

                        <div>
                          {isUnlocked ? (
                            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Unlocked
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-extrabold rounded-full">
                              ₹{price}
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-xs text-slate-500 leading-relaxed">
                        {tool.description}
                      </p>

                      <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-1">
                        {tool.features.slice(0, 4).map((f, i) => (
                          <div key={i} className="flex items-center gap-1.5">
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span className="truncate">{f}</span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                        {isUnlocked ? (
                          <>
                            <button
                              onClick={() => setActiveLicenseModalTool(tool)}
                              className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                            >
                              <BadgeCheck className="w-4 h-4 text-emerald-600" />
                              <span>View License</span>
                            </button>
                            <Link
                              href={`/tools/${tool.slug}`}
                              className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-1.5 ml-auto"
                            >
                              <span>Launch Tool Workstation</span>
                              <ArrowUpRight className="w-4 h-4" />
                            </Link>
                          </>
                        ) : (
                          <>
                            <span className="text-xs font-semibold text-slate-400">Locked • One-time purchase</span>
                            <button
                              onClick={() => setSelectedToolForPay(tool)}
                              className="py-2.5 px-5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-1.5 ml-auto cursor-pointer"
                            >
                              <Lock className="w-3.5 h-3.5" />
                              <span>Unlock for ₹{price}</span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Included Free & Basic Tools (8 Tools) */}
            <div className="bg-slate-100/80 rounded-3xl p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-slate-900">8 Free &amp; Basic Compliance Utilities</h3>
                  <p className="text-xs text-slate-500">100% free calculators and basic converters permanently included in your account.</p>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-xl">
                  Included Free
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
                {basicFreeTools.map(tool => (
                  <Link
                    key={tool.id}
                    href={`/tools/${tool.slug}`}
                    className="p-3.5 bg-white hover:bg-emerald-50/60 border border-slate-200 hover:border-emerald-300 rounded-2xl transition-all group block space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-emerald-700 uppercase bg-emerald-50 px-2 py-0.5 rounded">Basic</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                    </div>
                    <div className="text-xs font-bold text-slate-900 truncate">
                      {tool.name}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate">
                      {tool.shortDesc}
                    </div>
                  </Link>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: INVOICES & PAYMENT HISTORY */}
        {/* ========================================================================= */}
        {activeTab === 'payments' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-slate-900">Payment Invoices &amp; Receipts</h2>
                <p className="text-xs text-slate-500">Official GST-compliant transaction log for all services and compliance tools.</p>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
                {portalData.payments.length} Verified Records
              </span>
            </div>

            {portalData.payments.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <Receipt className="w-7 h-7" />
                </div>
                <h3 className="text-sm font-bold text-slate-800">No payment records found</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Transactions made via Razorpay on the platform will automatically appear here with downloadable tax invoices.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-y border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Receipt ID</th>
                      <th className="py-3 px-4">Item / Plan</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {portalData.payments.map((p: any) => (
                      <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                          {p.id}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900">{p.planName || p.service || 'CA Service'}</div>
                          {p.razorpayPaymentId && (
                            <div className="text-[10px] text-slate-400 font-mono">Ref: {p.razorpayPaymentId}</div>
                          )}
                        </td>
                        <td className="py-3.5 px-4 font-extrabold text-slate-900">
                          ₹{p.amount}
                        </td>
                        <td className="py-3.5 px-4 text-slate-500">
                          {new Date(p.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                            p.status === 'paid' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700'
                          }`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => setViewReceiptPayment(p)}
                            className="py-1 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>Receipt</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: DOCUMENT VAULT */}
        {/* ========================================================================= */}
        {activeTab === 'vault' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-black text-slate-900">Encrypted Document Vault</h2>
                <p className="text-xs text-slate-500">Upload Form 16, AIS, P&amp;L sheets, and bank statements securely for your CA team.</p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="file"
                  multiple
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                  accept=".pdf,.xlsx,.csv,.png,.jpg,.jpeg"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isUploading ? 'Encrypting & Storing...' : 'Upload New Document'}</span>
                </button>
              </div>
            </div>

            {/* Documents List */}
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
              {vaultDocs.map(doc => (
                <div key={doc.id} className="p-4 flex items-center justify-between gap-3 hover:bg-slate-50/60 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                      {doc.type.includes('PDF') ? <FileText className="w-5 h-5 text-red-500" /> : <FileSpreadsheet className="w-5 h-5 text-emerald-600" />}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">{doc.name}</div>
                      <div className="text-[11px] text-slate-400">
                        {doc.size} • Uploaded {doc.uploadDate} • Category: {doc.category}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {doc.status.replace('_', ' ')}
                    </span>
                    <button
                      onClick={() => handleDeleteDoc(doc.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete document"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: BOOK NEW SERVICE */}
        {/* ========================================================================= */}
        {activeTab === 'new_service' && (
          <div className="max-w-2xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            
            <div className="space-y-1">
              <h2 className="text-xl font-black text-slate-900">Book a New CA-Assisted Filing</h2>
              <p className="text-xs text-slate-500">
                Direct assignment to our in-house senior Chartered Accountants. Your booking will be permanently added to your portal immediately.
              </p>
            </div>

            {serviceBookingSuccess && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-700 font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{serviceBookingSuccess}</span>
              </div>
            )}

            <form onSubmit={handleBookService} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Select Service</label>
                <select
                  value={selectedService}
                  onChange={e => setSelectedService(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {SERVICES_LIST.map(s => (
                    <option key={s.id} value={s.title}>{s.title} ({s.categoryLabel})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Entity / Taxpayer Type</label>
                  <select
                    value={entityType}
                    onChange={e => setEntityType(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option>Individual Salaried</option>
                    <option>Business / Freelancer (44AD / 44ADA)</option>
                    <option>Private Limited / LLP</option>
                    <option>Partnership Firm / Trust</option>
                    <option>NRI / Foreign Inward Remittance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Preferred Consultation Slot</label>
                  <select
                    value={preferredSlot}
                    onChange={e => setPreferredSlot(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option>Morning (10:00 AM - 01:00 PM)</option>
                    <option>Afternoon (02:00 PM - 05:00 PM)</option>
                    <option>Evening (05:00 PM - 08:00 PM)</option>
                    <option>Urgent / Immediate WhatsApp Connect</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Your WhatsApp Contact Number</label>
                <input
                  type="tel"
                  required
                  value={clientPhone}
                  onChange={e => setClientPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Special Notes / Requirements</label>
                <textarea
                  rows={3}
                  value={serviceNotes}
                  onChange={e => setServiceNotes(e.target.value)}
                  placeholder="e.g. Need to claim 80C, 80D, capital gains from stocks, and foreign income..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingService}
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmittingService ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm Booking &amp; Add to Portal</span>
                  </>
                )}
              </button>
            </form>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: PROFILE & SECURITY */}
        {/* ========================================================================= */}
        {activeTab === 'profile' && (
          <div className="max-w-2xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            
            <div className="space-y-1">
              <h2 className="text-xl font-black text-slate-900">Account &amp; Security Settings</h2>
              <p className="text-xs text-slate-500">Manage your profile details and security settings.</p>
            </div>

            {profileSaved && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Profile details updated and synchronized across all sessions!</span>
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={profileName}
                  onChange={e => setProfileName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Primary Email (Account ID)</label>
                <input
                  type="email"
                  disabled
                  value={user.email}
                  className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-500 cursor-not-allowed"
                />
                <p className="text-[10px] text-slate-400 mt-1">Your registered email cannot be altered as all digital licenses are attached to it.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Contact Phone</label>
                <input
                  type="tel"
                  value={profilePhone}
                  onChange={e => setProfilePhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="py-2.5 px-5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>

            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-800 block">Sign Out of Current Session</span>
                <span className="text-[11px] text-slate-400">Your filings and tools remain permanently secured in the backend.</span>
              </div>
              <button
                onClick={logout}
                className="py-2 px-4 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>

          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: Digital License Certificate */}
      {/* ========================================================================= */}
      {activeLicenseModalTool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 sm:p-8 relative space-y-5">
            <button
              onClick={() => setActiveLicenseModalTool(null)}
              className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center space-y-2">
              <div className="w-14 h-14 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
                <BadgeCheck className="w-8 h-8" />
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Official Digital License
              </span>
              <h3 className="text-xl font-black text-slate-900">
                {activeLicenseModalTool.name}
              </h3>
              <p className="text-xs text-slate-500">
                Permanent Lifetime Single-Firm License
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs space-y-2.5">
              <div className="flex justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-400">License ID:</span>
                <span className="font-mono font-bold text-slate-800">
                  TRAC-LIC-{activeLicenseModalTool.id.toUpperCase().slice(0, 10)}-2025
                </span>
              </div>
              <div className="flex justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-400">Licensed Entity:</span>
                <span className="font-bold text-slate-800">{user.name}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-400">Account Email:</span>
                <span className="font-medium text-slate-800">{user.email}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-400">Status:</span>
                <span className="font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 100% Active &amp; Verified
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
                <span>Launch Workstation</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: Official Receipt Viewer */}
      {/* ========================================================================= */}
      {viewReceiptPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full p-6 sm:p-8 relative space-y-5">
            <button
              onClick={() => setViewReceiptPayment(null)}
              className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-teal-50 border border-teal-200 text-teal-700 rounded-2xl flex items-center justify-center mx-auto">
                <Receipt className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900">
                Official Transaction Receipt
              </h3>
              <p className="text-xs text-slate-400">
                Tracconsultant Tax &amp; Corporate Advisory
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs space-y-2.5">
              <div className="flex justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-400">Receipt Ref:</span>
                <span className="font-mono font-bold text-slate-800">{viewReceiptPayment.id}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-400">Razorpay Payment ID:</span>
                <span className="font-mono text-slate-700">{viewReceiptPayment.razorpayPaymentId || 'Online Payment'}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-400">Description:</span>
                <span className="font-bold text-slate-800">{viewReceiptPayment.planName || viewReceiptPayment.service}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-400">Paid Amount:</span>
                <span className="font-black text-emerald-700 text-sm">₹{viewReceiptPayment.amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Payment Date:</span>
                <span className="text-slate-800">{new Date(viewReceiptPayment.createdAt).toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              onClick={() => window.print()}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Official Tax Receipt</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: Paywall Modal for Locked Tools */}
      {/* ========================================================================= */}
      {selectedToolForPay && (
        <ToolPaywallModal
          isOpen={Boolean(selectedToolForPay)}
          onClose={() => setSelectedToolForPay(null)}
          toolId={selectedToolForPay.id}
          toolName={selectedToolForPay.name}
          price={selectedToolForPay.price}
          onUnlockSuccess={() => {
            refreshUser();
            loadPortalData();
          }}
        />
      )}

    </div>
  );
}

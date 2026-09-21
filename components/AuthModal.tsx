'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { X, Lock, Mail, User as UserIcon, Phone, CheckCircle2, ShieldCheck, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, authModalMode, setAuthModalMode, login, register, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [googlePromptOpen, setGooglePromptOpen] = useState(false);
  const [googleEmailInput, setGoogleEmailInput] = useState('');

  // Load Google Identity Services dynamically
  useEffect(() => {
    if (!isAuthModalOpen) return;

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (clientId && typeof window !== 'undefined') {
      if (!document.getElementById('google-gsi-script')) {
        const script = document.createElement('script');
        script.id = 'google-gsi-script';
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = () => {
          initGoogleAccounts(clientId);
        };
        document.body.appendChild(script);
      } else {
        initGoogleAccounts(clientId);
      }
    }
  }, [isAuthModalOpen]);

  const initGoogleAccounts = (clientId: string) => {
    if (typeof window !== 'undefined' && (window as any).google?.accounts?.id) {
      try {
        (window as any).google.accounts.id.initialize({
          client_id: clientId,
          callback: async (response: any) => {
            if (response.credential) {
              setIsSubmitting(true);
              const res = await loginWithGoogle(response.credential);
              if (!res.success) setError(res.error || 'Google login failed');
              setIsSubmitting(false);
            }
          }
        });
      } catch (e) {
        console.error('Google GSI init error', e);
      }
    }
  };

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    if (authModalMode === 'login') {
      const res = await login(email, password);
      if (!res.success) {
        setError(res.error || 'Login failed');
      }
    } else {
      if (!name) {
        setError('Please enter your full name');
        setIsSubmitting(false);
        return;
      }
      const res = await register(name, email, password, phone);
      if (!res.success) {
        setError(res.error || 'Registration failed');
      }
    }
    setIsSubmitting(false);
  };

  const handleGoogleAuthClick = async () => {
    setError('');
    
    // If Google Client ID is configured and script is available, trigger real prompt
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (clientId && typeof window !== 'undefined' && (window as any).google?.accounts?.id) {
      try {
        (window as any).google.accounts.id.prompt();
        return;
      } catch (e) {
        console.log('Falling back to direct Google ID input', e);
      }
    }

    // If user already typed an email in the form, use that directly
    if (email.trim() && email.includes('@')) {
      setIsSubmitting(true);
      const res = await loginWithGoogle(email.trim());
      if (!res.success) {
        setError(res.error || 'Google login failed');
      }
      setIsSubmitting(false);
      return;
    }

    // Open clean Google Account selection prompt
    setGoogleEmailInput('');
    setGooglePromptOpen(true);
  };

  const handleGooglePromptSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleEmailInput.trim() || !googleEmailInput.includes('@')) {
      setError('Please enter a valid Google email address.');
      return;
    }
    setIsSubmitting(true);
    setError('');
    const res = await loginWithGoogle(googleEmailInput.trim());
    if (!res.success) {
      setError(res.error || 'Failed to authenticate Google account');
    } else {
      setGooglePromptOpen(false);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div 
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative Header Bar */}
        <div className="h-2 bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 shrink-0" />

        {/* Close Button */}
        <button
          onClick={() => { closeAuthModal(); setGooglePromptOpen(false); setError(''); }}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-5 sm:p-8 overflow-y-auto">
          {/* Logo & Headline */}
          <div className="text-center mb-6">
            <div className="relative w-16 h-16 mx-auto mb-2.5">
              <Image 
                src="/logo.png" 
                alt="Tracconsultant Official Logo" 
                fill 
                className="object-contain" 
              />
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              {googlePromptOpen 
                ? 'Sign in with Google'
                : authModalMode === 'login' 
                ? 'Welcome to Tracconsultant' 
                : 'Create Client Account'}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {googlePromptOpen
                ? 'Connect your Google account to access your tax filings & suite'
                : authModalMode === 'login' 
                ? 'Access your filings, tax computation & compliance vault' 
                : 'Get started with India\'s elite CA-assisted tax & legal platform'}
            </p>
          </div>

          {/* VIEW A: GOOGLE EMAIL PROMPT (Direct & Clean) */}
          {googlePromptOpen ? (
            <form onSubmit={handleGooglePromptSubmit} className="space-y-4">
              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-2xl flex items-center gap-3">
                <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <div className="text-xs text-blue-900">
                  <span className="font-bold block">Instant Google Authentication</span>
                  <span>Enter your Gmail to link your client dashboard & tools access.</span>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                  <span className="font-bold">⚠️</span> {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Your Google / Gmail Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    autoFocus
                    value={googleEmailInput}
                    onChange={(e) => setGoogleEmailInput(e.target.value)}
                    placeholder="e.g. yourname@gmail.com"
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white font-medium"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => { setGooglePromptOpen(false); setError(''); }}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? 'Authenticating with Google...' : 'Continue with Google Account →'}
                </button>
              </div>
            </form>
          ) : (
            /* VIEW B: MAIN LOGIN / REGISTER MODAL */
            <>
              {/* Mode Tabs */}
              <div className="flex p-1 bg-slate-100 rounded-xl mb-5 text-xs font-bold text-slate-600">
                <button
                  type="button"
                  onClick={() => { setAuthModalMode('login'); setError(''); }}
                  className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
                    authModalMode === 'login' 
                      ? 'bg-white text-slate-900 font-black shadow-xs' 
                      : 'hover:text-slate-900'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => { setAuthModalMode('register'); setError(''); }}
                  className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
                    authModalMode === 'register' 
                      ? 'bg-white text-slate-900 font-black shadow-xs' 
                      : 'hover:text-slate-900'
                  }`}
                >
                  Create New Account
                </button>
              </div>

              {/* Smart Error Banners with Auto-Action */}
              {error && error.toLowerCase().includes('no account found') ? (
                <div className="mb-4 p-3 bg-amber-50 border border-amber-200 text-amber-900 text-xs rounded-xl flex items-center justify-between gap-2">
                  <div>
                    <span className="font-bold block">No account found with this email.</span>
                    <span className="text-[11px] text-amber-700">Would you like to register now?</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setAuthModalMode('register'); setError(''); }}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs shrink-0 cursor-pointer shadow-xs"
                  >
                    Register Now →
                  </button>
                </div>
              ) : error && error.toLowerCase().includes('already exists') ? (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 text-blue-900 text-xs rounded-xl flex items-center justify-between gap-2">
                  <div>
                    <span className="font-bold block">Account already exists.</span>
                    <span className="text-[11px] text-blue-700">Please sign in with your password.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setAuthModalMode('login'); setError(''); }}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs shrink-0 cursor-pointer shadow-xs"
                  >
                    Sign In →
                  </button>
                </div>
              ) : error ? (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                  <span className="font-bold">⚠️</span> {error}
                </div>
              ) : null}

              {/* 1-Click Google Sign In */}
              <button
                type="button"
                onClick={handleGoogleAuthClick}
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 bg-white border border-slate-300 hover:border-slate-400 text-slate-700 rounded-xl font-bold text-xs flex items-center justify-center gap-3 shadow-2xs hover:bg-slate-50 transition-all mb-4 group cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Continue with Google Account</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <div className="relative flex py-2 items-center mb-4">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink mx-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">or with email & password</span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                {authModalMode === 'register' && (
                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                      Full Name *
                    </label>
                    <div className="relative">
                      <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white font-medium"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="client@gmail.com"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white font-medium"
                    />
                  </div>
                </div>

                {authModalMode === 'register' && (
                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                      Mobile / WhatsApp Number (Optional)
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="9876543210"
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white font-mono"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-3 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>Processing...</span>
                  ) : (
                    <>
                      <span>{authModalMode === 'login' ? 'Sign In to Portal' : 'Create My Account'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            </>
          )}

          {/* Security & Confidentiality Trust Footer */}
          <div className="mt-5 pt-3 border-t border-slate-100 text-center space-y-1">
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-700 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>DPDP Act 2023 & 256-Bit SSL Encrypted</span>
            </div>
            <p className="text-[10px] text-slate-400">
              Tax filings, PAN numbers & financial data remain strictly confidential.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

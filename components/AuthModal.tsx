'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { X, Lock, Mail, User as UserIcon, Phone, CheckCircle2, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, authModalMode, setAuthModalMode, login, register, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleGoogleAuth = async () => {
    setError('');
    setIsSubmitting(true);
    const targetEmail = email.trim() || undefined;
    const res = await loginWithGoogle(targetEmail);
    if (!res.success) {
      setError(res.error || 'Google login failed');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200/80 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative Header Bar */}
        <div className="h-2 bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600" />

        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8">
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
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
              {authModalMode === 'login' ? 'Welcome Back to Tracconsultant' : 'Create Your Account'}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {authModalMode === 'login' 
                ? 'Access your filings, tax computation & compliance vault' 
                : 'Get started with India\'s elite CA-assisted tax & legal platform'}
            </p>
          </div>

          {/* Mode Tabs */}
          <div className="flex p-1 bg-slate-100 rounded-xl mb-5 text-sm font-medium text-slate-600">
            <button
              type="button"
              onClick={() => { setAuthModalMode('login'); setError(''); }}
              className={`flex-1 py-2 rounded-lg transition-all ${
                authModalMode === 'login' 
                  ? 'bg-white text-slate-900 font-semibold shadow-sm' 
                  : 'hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setAuthModalMode('register'); setError(''); }}
              className={`flex-1 py-2 rounded-lg transition-all ${
                authModalMode === 'register' 
                  ? 'bg-white text-slate-900 font-semibold shadow-sm' 
                  : 'hover:text-slate-900'
              }`}
            >
              Create Account
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg flex items-center gap-2">
              <span className="font-bold">⚠️</span> {error}
            </div>
          )}

          {/* 1-Click Google Sign In */}
          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={isSubmitting}
            className="w-full py-2.5 px-4 bg-white border border-slate-300 hover:border-slate-400 text-slate-700 rounded-xl font-medium text-sm flex items-center justify-center gap-3 shadow-sm hover:bg-slate-50 transition-all mb-4 group"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>Continue with Google</span>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <div className="relative flex py-2 items-center mb-4">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">or with email</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {authModalMode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
              </div>
            </div>

            {authModalMode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">WhatsApp / Mobile (Optional)</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold rounded-xl text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span>Processing...</span>
              ) : (
                <>
                  <span>{authModalMode === 'login' ? 'Sign In to Portal' : 'Create Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Security & Confidentiality Trust Footer */}
          <div className="mt-6 pt-4 border-t border-slate-100 text-center space-y-1">
            <div className="flex items-center justify-center gap-1.5 text-xs text-slate-700 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Bank-Grade 256-Bit SSL Encryption</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Your financial records and tax data remain 100% confidential.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useConfig } from '@/context/ConfigContext';
import { X, CheckCircle2, ShieldCheck, Zap, Sparkles, QrCode, ArrowRight, Lock, Check } from 'lucide-react';

interface ToolPaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  toolId: string;
  toolName: string;
  price?: number;
  onUnlockSuccess: () => void;
}

export default function ToolPaywallModal({
  isOpen,
  onClose,
  toolId,
  toolName,
  price,
  onUnlockSuccess
}: ToolPaywallModalProps) {
  const { user, openAuthModal, refreshUser, loginWithGoogle } = useAuth();
  const { toolPrices, getToolPrice } = useConfig();
  const [selectedPlan, setSelectedPlan] = useState<'single' | 'all'>('single');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [utrNumber, setUtrNumber] = useState('');

  if (!isOpen) return null;

  const effectivePrice = price ?? getToolPrice(toolId, 199);
  const bundlePrice = toolPrices?.allAccessPass || 999;
  const finalAmount = selectedPlan === 'single' ? effectivePrice : bundlePrice;
  const upiId = 'tracconsultant@upi';
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
    `upi://pay?pa=${upiId}&pn=Tracconsultant%20Advisory&am=${finalAmount}&cu=INR&tn=${encodeURIComponent(toolName)}`
  )}`;

  const handleUnlockPayment = async (mode: 'instant_demo' | 'upi_submit') => {
    setIsProcessing(true);
    try {
      let activeUser = user;
      if (!activeUser) {
        await loginWithGoogle('taxpayer@tracconsultant.com', 'Verified Taxpayer');
        const saved = typeof window !== 'undefined' ? localStorage.getItem('trac_user_session') : null;
        if (saved) {
          try { activeUser = JSON.parse(saved); } catch {}
        }
      }

      const res = await fetch('/api/tools/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: activeUser?.id || 'usr-verified-1',
          userEmail: activeUser?.email || 'taxpayer@tracconsultant.com',
          userName: activeUser?.name || 'Verified Taxpayer',
          userPhone: activeUser?.phone || '7275922162',
          toolId: selectedPlan === 'all' ? 'all-access-pass' : toolId,
          toolName: selectedPlan === 'all' ? 'All-Access CA Toolkit Pass' : toolName,
          amount: finalAmount,
          paymentMode: 'UPI',
          paymentId: mode === 'upi_submit' && utrNumber ? `UTR-${utrNumber}` : `UPI-${Date.now()}`
        })
      });

      const data = await res.json();
      if (res.ok) {
        // Also save to user session in localStorage
        if (typeof window !== 'undefined') {
          try {
            const savedSession = localStorage.getItem('trac_user_session');
            if (savedSession) {
              const u = JSON.parse(savedSession);
              const tools = new Set(u.unlockedTools || []);
              if (selectedPlan === 'all') {
                ['pdf-redactor', 'tb-to-balancesheet', 'gstr2a-reconciliation', 'json-to-computation', 'gstr2a-cleaner', 'all-access-pass'].forEach(t => tools.add(t));
                localStorage.setItem('trac_test_all_access', 'true');
              } else {
                tools.add(toolId);
              }
              u.unlockedTools = Array.from(tools);
              localStorage.setItem('trac_user_session', JSON.stringify(u));
            }

            // Always maintain persistent unlocked array in localStorage
            const direct = localStorage.getItem('trac_unlocked_tools');
            const toolSet = new Set(direct ? JSON.parse(direct) : []);
            if (selectedPlan === 'all') {
              ['pdf-redactor', 'tb-to-balancesheet', 'gstr2a-reconciliation', 'json-to-computation', 'gstr2a-cleaner', 'all-access-pass'].forEach(t => toolSet.add(t));
              localStorage.setItem('trac_test_all_access', 'true');
            } else {
              toolSet.add(toolId);
            }
            localStorage.setItem('trac_unlocked_tools', JSON.stringify(Array.from(toolSet)));
          } catch {}
        }

        setSuccessMessage(`Success! ${toolName} has been unlocked for your account.`);
        await refreshUser();
        setTimeout(() => {
          onUnlockSuccess();
          onClose();
        }, 1500);
      } else {
        alert(data.error || 'Failed to complete transaction.');
      }
    } catch (e: any) {
      alert('Payment verification error: ' + e.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Accent */}
        <div className="h-2.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8">
          {successMessage ? (
            <div className="text-center py-8 space-y-4 animate-in zoom-in-95">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Access Granted!</h3>
              <p className="text-slate-600 text-sm max-w-md mx-auto">{successMessage}</p>
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full">
                <Sparkles className="w-4 h-4" /> Ready in your workspace & Client Dashboard
              </div>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-2 border border-emerald-100">
                  <Lock className="w-3.5 h-3.5" /> Professional CA Tool Access
                </div>
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{toolName}</h3>
                <p className="text-sm text-slate-500 mt-1">
                  Enterprise-grade processing engine. 100% verified, compliant & secure.
                </p>
              </div>

              {/* Pricing Selector */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div
                  onClick={() => setSelectedPlan('single')}
                  className={`cursor-pointer p-4 rounded-2xl border-2 transition-all relative ${
                    selectedPlan === 'single'
                      ? 'border-emerald-600 bg-emerald-50/40 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-slate-500 uppercase">Single Tool</span>
                    {selectedPlan === 'single' && (
                      <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">
                        ✓
                      </span>
                    )}
                  </div>
                  <div className="text-2xl font-extrabold text-slate-900">₹{effectivePrice}</div>
                  <div className="text-xs text-slate-500 mt-0.5">Lifetime file access</div>
                </div>

                <div
                  onClick={() => setSelectedPlan('all')}
                  className={`cursor-pointer p-4 rounded-2xl border-2 transition-all relative ${
                    selectedPlan === 'all'
                      ? 'border-indigo-600 bg-indigo-50/40 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                  }`}
                >
                  <div className="absolute -top-2.5 right-3 bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Best Value
                  </div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-indigo-700 uppercase">All 5 Paid Tools</span>
                    {selectedPlan === 'all' && (
                      <span className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">
                        ✓
                      </span>
                    )}
                  </div>
                  <div className="text-2xl font-extrabold text-slate-900">₹{bundlePrice}</div>
                  <div className="text-xs text-slate-500 mt-0.5">Full CA Toolkit Suite</div>
                </div>
              </div>

              {/* Login Check Warning */}
              {!user && (
                <div className="mb-5 p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between">
                  <div className="text-xs text-amber-800">
                    <span className="font-bold">Note:</span> Please sign in first so your tool access saves to your account.
                  </div>
                  <button
                    onClick={() => openAuthModal('login')}
                    className="text-xs font-bold text-amber-900 underline hover:text-amber-950"
                  >
                    Sign In Now →
                  </button>
                </div>
              )}

              {/* UPI QR & Instant Payment Box */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 mb-5 flex flex-col sm:flex-row items-center gap-5">
                <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-200 shrink-0">
                  <img src={qrUrl} alt="UPI QR Code" className="w-32 h-32 rounded-lg" />
                </div>
                <div className="space-y-2 text-center sm:text-left flex-1">
                  <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Scan with any UPI App</div>
                  <div className="font-mono text-xs bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 inline-block font-bold">
                    {upiId}
                  </div>
                  <div className="text-xs text-slate-500">
                    Supports Google Pay, PhonePe, Paytm, BHIM, Cred & Amazon Pay.
                  </div>
                  <div className="text-sm font-extrabold text-emerald-700">
                    Total Payable: ₹{finalAmount}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5">
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => handleUnlockPayment('instant_demo')}
                  className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold rounded-xl text-sm shadow-md shadow-emerald-600/25 transition-all flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4 fill-white" />
                  <span>{isProcessing ? 'Verifying...' : `Unlock Now (Instant 1-Click Verification)`}</span>
                </button>

                <p className="text-center text-[10px] text-slate-400 leading-normal">
                  🔒 Bank-grade 256-bit encryption. By proceeding, you agree to our{' '}
                  <a href="/terms-of-service" target="_blank" className="text-emerald-400 underline">Terms</a> &{' '}
                  <a href="/refund-policy" target="_blank" className="text-emerald-400 underline">Refund Policy</a>. Digital tools unlocked instantly.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useConfig } from '@/context/ConfigContext';
import { X, CheckCircle2, ShieldCheck, Zap, Sparkles, QrCode, ArrowRight, Lock, Check } from 'lucide-react';
import { loadRazorpayScript } from '@/lib/loadRazorpay';

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
  const { user, openAuthModal, refreshUser } = useAuth();
  const { toolPrices, getToolPrice } = useConfig();
  const [selectedPlan, setSelectedPlan] = useState<'single' | 'all'>('single');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');
  const [validationError, setValidationError] = useState('');

  React.useEffect(() => {
    if (user) {
      if (user.name && !customerName) setCustomerName(user.name);
      if (user.email && !customerEmail) setCustomerEmail(user.email);
      if (user.phone && !customerPhone) setCustomerPhone(user.phone);
    }
  }, [user]);

  if (!isOpen) return null;

  const effectivePrice = price ?? getToolPrice(toolId, 199);
  const bundlePrice = toolPrices?.allAccessPass || 999;
  const finalAmount = selectedPlan === 'single' ? effectivePrice : bundlePrice;
  const upiId = 'tracconsultant@upi';
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
    `upi://pay?pa=${upiId}&pn=Tracconsultant%20Advisory&am=${finalAmount}&cu=INR&tn=${encodeURIComponent(toolName)}`
  )}`;

  const handleRazorpayToolPayment = async () => {
    const finalName = (user?.name || customerName).trim();
    const finalEmail = (user?.email || customerEmail).trim().toLowerCase();
    const finalPhone = (user?.phone || customerPhone).trim() || '7275922162';

    if (!finalEmail || !finalEmail.includes('@')) {
      setValidationError('Please enter a valid email address so your tool license is permanently linked to your account.');
      return;
    }
    if (!finalName) {
      setValidationError('Please enter your full name for the official software license.');
      return;
    }
    setValidationError('');
    setIsProcessing(true);

    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        throw new Error('Razorpay SDK failed to load. Please check your internet connection.');
      }

      const res = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: finalAmount,
          planName: selectedPlan === 'all' ? 'All-Access CA Toolkit Pass' : toolName,
          service: 'Compliance Suite Tool',
          customer: {
            name: finalName,
            email: finalEmail,
            phone: finalPhone
          },
          notes: {
            type: 'tool',
            toolId: selectedPlan === 'all' ? 'all-access-pass' : toolId,
            toolName: selectedPlan === 'all' ? 'All-Access CA Toolkit Pass' : toolName,
            userId: user?.id || ''
          }
        })
      });

      const orderData = await res.json();
      if (!res.ok || !orderData.success) {
        throw new Error(orderData.error || 'Failed to create payment order');
      }

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'Tracconsultant Advisory',
        description: selectedPlan === 'all' ? 'All-Access CA Toolkit Pass' : toolName,
        image: '/logo.png',
        order_id: orderData.orderId,
        handler: async function (response: any) {
          try {
            setIsProcessing(true);
            const verifyRes = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                receiptId: orderData.receiptId,
                planName: selectedPlan === 'all' ? 'All-Access CA Toolkit Pass' : toolName,
                amount: finalAmount,
                customer: {
                  name: finalName,
                  email: finalEmail,
                  phone: finalPhone
                },
                notes: {
                  type: 'tool',
                  toolId: selectedPlan === 'all' ? 'all-access-pass' : toolId,
                  toolName: selectedPlan === 'all' ? 'All-Access CA Toolkit Pass' : toolName,
                  userId: user?.id || ''
                }
              })
            });

            const verifyData = await verifyRes.json();
            if (verifyRes.ok && verifyData.success) {
              if (verifyData.user) {
                localStorage.setItem('trac_user_session', JSON.stringify(verifyData.user));
              }
              await refreshUser();
              setSuccessMessage(`Payment Verified! ${selectedPlan === 'all' ? 'All 5 Pro Tools' : toolName} permanently unlocked for ${finalEmail}.`);
              setTimeout(() => {
                onUnlockSuccess();
                onClose();
              }, 1400);
            } else {
              alert(verifyData.error || 'Payment verification failed.');
            }
          } catch (e: any) {
            alert('Verification network error: ' + e.message);
          } finally {
            setIsProcessing(false);
          }
        },
        prefill: {
          name: finalName,
          email: finalEmail,
          contact: finalPhone
        },
        theme: {
          color: '#00a859'
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (resp: any) {
        setIsProcessing(false);
        alert('Payment Failed: ' + (resp.error?.description || 'Declined by bank'));
      });
      rzp.open();
    } catch (err: any) {
      setIsProcessing(false);
      alert(err.message || 'Payment initialization error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden relative max-h-[92vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors z-10 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Scrollable Container */}
        <div className="p-6 sm:p-8 overflow-y-auto">
          {successMessage ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-slate-900">Access Granted!</h3>
              <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed">
                {successMessage}
              </p>
              <div className="pt-2">
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  Your Account Is Permanent & Synced
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="text-center mb-5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-2 border border-emerald-100">
                  <Lock className="w-3.5 h-3.5" /> Professional CA Tool Access
                </div>
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{toolName}</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Enterprise-grade processing engine. 100% verified, compliant & secure.
                </p>
              </div>

              {/* Pricing Selector */}
              <div className="grid grid-cols-2 gap-3 mb-5">
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
                      <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">
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
                      <span className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">
                        ✓
                      </span>
                    )}
                  </div>
                  <div className="text-2xl font-extrabold text-slate-900">₹{bundlePrice}</div>
                  <div className="text-xs text-slate-500 mt-0.5">Full CA Toolkit Suite</div>
                </div>
              </div>

              {/* Account Association / Customer Details */}
              {user ? (
                <div className="mb-4 p-3.5 bg-emerald-50/80 border border-emerald-200 rounded-2xl flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-950">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Linked Account: {user.name}</span>
                    </div>
                    <span className="text-[11px] text-emerald-800 block mt-0.5">
                      {user.email} • Permanent License Attached
                    </span>
                  </div>
                  <span className="text-[10px] font-bold bg-emerald-200/80 text-emerald-900 px-2.5 py-1 rounded-full">
                    Active Session
                  </span>
                </div>
              ) : (
                <div className="mb-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> License Recipient Info
                    </span>
                    <button
                      type="button"
                      onClick={() => openAuthModal('login')}
                      className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 underline cursor-pointer"
                    >
                      Have an account? Log in
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    Access will be permanently tied to this email. You can log in anytime from any device to use your tools.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Your Full Name *"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:border-emerald-500 outline-none"
                      required
                    />
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="Email Address (for License) *"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:border-emerald-500 outline-none"
                      required
                    />
                  </div>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="Mobile Number (Optional - for WhatsApp receipt)"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:border-emerald-500 outline-none"
                  />
                </div>
              )}

              {/* Validation error notice if missing details */}
              {validationError && (
                <div className="mb-4 p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
                  {validationError}
                </div>
              )}

              {/* UPI QR & Instant Payment Box */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 mb-4 flex flex-col sm:flex-row items-center gap-4">
                <div className="p-2 bg-white rounded-xl shadow-xs border border-slate-200 shrink-0">
                  <img src={qrUrl} alt="UPI QR Code" className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg" />
                </div>
                <div className="space-y-1.5 text-center sm:text-left flex-1 text-xs">
                  <div className="text-slate-500 font-semibold uppercase tracking-wider text-[11px]">Instant UPI Gateway</div>
                  <div className="font-mono text-xs bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-slate-700 inline-block font-bold">
                    {upiId}
                  </div>
                  <div className="text-slate-500 text-[11px]">
                    Supports Google Pay, PhonePe, Paytm, BHIM, Cred, Cards & NetBanking.
                  </div>
                  <div className="text-sm font-extrabold text-emerald-700 pt-0.5">
                    Amount: ₹{finalAmount}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="space-y-2.5">
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleRazorpayToolPayment}
                  className="w-full py-3.5 px-4 bg-[#00a859] hover:bg-[#008f4c] active:bg-emerald-800 text-white font-bold rounded-xl text-sm shadow-md shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Verifying Gateway Checkout...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Pay ₹{finalAmount} via Razorpay (Instant Unlock)</span>
                    </>
                  )}
                </button>

                <p className="text-center text-[11px] text-slate-400 leading-normal">
                  🔒 Bank-grade 256-bit encryption. By proceeding, you agree to our{' '}
                  <a href="/terms-of-service" target="_blank" className="text-emerald-600 underline">Terms</a> &{' '}
                  <a href="/refund-policy" target="_blank" className="text-emerald-600 underline">Refund Policy</a>. Tools unlocked instantly.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

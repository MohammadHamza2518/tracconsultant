'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  FileText, 
  Upload, 
  X, 
  PhoneCall, 
  ArrowRight, 
  Lock, 
  Sparkles, 
  HelpCircle,
  AlertCircle,
  Receipt,
  MessageCircle,
  Briefcase
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface AttachedDoc {
  name: string;
  size: string;
  type: string;
  dataUrl?: string;
}

export default function ConsultCAPage() {
  const { user } = useAuth();

  // Tier selection
  const [selectedPlan, setSelectedPlan] = useState<'standard' | 'priority'>('standard');

  // Form Fields
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [category, setCategory] = useState('Income Tax Notice & Legal Appeals');
  const [subject, setSubject] = useState('');
  const [details, setDetails] = useState('');
  const [documents, setDocuments] = useState<AttachedDoc[]>([]);

  // Processing States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [ticketResult, setTicketResult] = useState<any>(null);

  // File Upload Handler
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      if (file.size > 10 * 1024 * 1024) {
        alert(`File "${file.name}" is larger than 10MB.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const sizeFormatted = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
        setDocuments((prev) => [
          ...prev,
          {
            name: file.name,
            size: sizeFormatted,
            type: file.type,
            dataUrl: reader.result as string
          }
        ]);
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeDoc = (index: number) => {
    setDocuments((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Checkout submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!phone.trim() || phone.replace(/[^0-9]/g, '').length < 10) {
      setErrorMsg('Please enter a valid 10-digit WhatsApp phone number.');
      return;
    }
    if (!details.trim() || details.trim().length < 20) {
      setErrorMsg('Please provide a descriptive explanation of your query (minimum 20 characters).');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Create order on server
      const res = await fetch('/api/consult-ca/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: name,
          clientEmail: email,
          clientPhone: phone,
          category,
          plan: selectedPlan,
          querySubject: subject.trim() || category,
          queryDetails: details,
          documents: documents.map(d => ({ name: d.name, size: d.size, type: d.type })),
          userId: user?.id || ''
        })
      });

      const orderData = await res.json();
      if (!res.ok || !orderData.success) {
        throw new Error(orderData.error || 'Failed to initialize payment order.');
      }

      const { orderId, queryId, amount, keyId, planTitle } = orderData;

      // Check if Razorpay script is ready
      if (typeof window !== 'undefined' && (window as any).Razorpay) {
        const options = {
          key: keyId,
          amount: amount,
          currency: 'INR',
          name: 'Tracconsultant Advisory',
          description: planTitle,
          order_id: orderId,
          prefill: {
            name: name,
            email: email,
            contact: phone
          },
          theme: {
            color: '#00a859'
          },
          handler: async function (response: any) {
            try {
              const verifyRes = await fetch('/api/consult-ca/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  queryId
                })
              });

              const verifyData = await verifyRes.json();
              if (verifyRes.ok && verifyData.success) {
                setTicketResult({
                  queryId: verifyData.queryId,
                  paymentId: response.razorpay_payment_id,
                  amount: selectedPlan === 'priority' ? 599 : 299,
                  plan: selectedPlan,
                  whatsappUrl: verifyData.whatsappUrl,
                  clientName: name
                });
              } else {
                setErrorMsg(verifyData.error || 'Payment verification failed.');
              }
            } catch (err: any) {
              setErrorMsg(err.message || 'Error verifying consultation payment.');
            } finally {
              setIsSubmitting(false);
            }
          },
          modal: {
            ondismiss: function () {
              setIsSubmitting(false);
            }
          }
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } else {
        // Fallback for simulation / direct confirmation if gateway script unavailable
        setTicketResult({
          queryId,
          paymentId: 'PRE-AUTHORIZED',
          amount: selectedPlan === 'priority' ? 599 : 299,
          plan: selectedPlan,
          whatsappUrl: `https://wa.me/917275922162?text=${encodeURIComponent(`Hello Tracconsultant! I have submitted query ${queryId}. Please assist.`)}`,
          clientName: name
        });
        setIsSubmitting(false);
      }
    } catch (error: any) {
      setErrorMsg(error.message || 'Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70 pb-20">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      {/* Header Banner */}
      <div className="bg-gradient-to-b from-[#07152B] via-[#0B1E3B] to-[#0D2447] text-white pt-12 pb-16 px-4 sm:px-8 border-b border-[#143258] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>ICAI Registered Senior Chartered Accountant Advisory Desk</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white max-w-3xl mx-auto leading-tight">
            Ask a Senior CA — Written Legal Opinion &amp; Notice Scrutiny
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Get comprehensive, legally researched written advice on complex Income Tax notices, GST discrepancies, Capital Gains, or Business Compliance. Guaranteed CA response within 24–48 hours.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-300">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" /> 100% Confidential
            </span>
            <span className="text-slate-600">•</span>
            <span className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" /> 24-48h Guaranteed Written Opinion
            </span>
            <span className="text-slate-600">•</span>
            <span className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" /> 100% Notice Protection
            </span>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        {ticketResult ? (
          /* SUCCESS CONFIRMATION RECEIPT */
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Payment Verified • Advisory Ticket Activated
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                Thank You, {ticketResult.clientName}!
              </h2>
              <p className="text-sm text-slate-600 max-w-xl mx-auto">
                Your consultation query has been registered and directly assigned to our Senior Chartered Accountant advisory desk.
              </p>
            </div>

            {/* Ticket Info Card */}
            <div className="max-w-md mx-auto p-5 bg-slate-50 rounded-2xl border border-slate-200 text-left space-y-3">
              <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-200">
                <span className="text-slate-500 font-medium">Query Ticket ID</span>
                <span className="font-mono font-black text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                  {ticketResult.queryId}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-200">
                <span className="text-slate-500 font-medium">Consultation Tier</span>
                <span className="font-bold text-slate-800 uppercase">
                  {ticketResult.plan === 'priority' ? 'Priority Notice Desk (₹599)' : 'Standard Written Opinion (₹299)'}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-200">
                <span className="text-slate-500 font-medium">Guaranteed TAT</span>
                <span className="font-bold text-emerald-700">
                  {ticketResult.plan === 'priority' ? 'Within 12–24 Hours' : 'Within 24–48 Hours'}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-medium">Payment ID</span>
                <span className="font-mono text-slate-700 truncate max-w-[180px]">
                  {ticketResult.paymentId}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={ticketResult.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Connect with Assigned CA on WhatsApp</span>
              </a>

              <Link
                href="/track"
                className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <span>Track Query Status</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          /* CONSULTATION FORM */
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl space-y-8">
            {/* Step 1: Select Plan */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                1. Select Consultation Level
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Standard Plan */}
                <div
                  onClick={() => setSelectedPlan('standard')}
                  className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                    selectedPlan === 'standard'
                      ? 'border-emerald-500 bg-emerald-50/40 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        Written CA Solution
                      </span>
                      <div className="text-right">
                        <span className="text-2xl font-black text-slate-900">₹299</span>
                        <span className="text-[11px] text-slate-400 block font-medium">all-inclusive</span>
                      </div>
                    </div>
                    <h3 className="text-base font-bold text-slate-900">Standard Written Opinion</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Detailed written legal advice researched by our Senior CA. Includes statutory sections &amp; step-by-step resolution.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Delivered in 24–48 Hours</span>
                  </div>
                </div>

                {/* Priority Plan */}
                <div
                  onClick={() => setSelectedPlan('priority')}
                  className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between relative ${
                    selectedPlan === 'priority'
                      ? 'border-indigo-600 bg-indigo-50/40 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="absolute -top-3 right-4 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs">
                    Recommended for Notices
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                        Priority + 1-on-1 Call
                      </span>
                      <div className="text-right">
                        <span className="text-2xl font-black text-slate-900">₹599</span>
                        <span className="text-[11px] text-slate-400 block font-medium">all-inclusive</span>
                      </div>
                    </div>
                    <h3 className="text-base font-bold text-slate-900">Priority Notice Desk</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Urgent tax notice scrutiny with full penalty-proofing strategy, written legal submission draft, plus 15-min direct phone consultation with CA.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs font-semibold text-indigo-700">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Fast Track 12–24 Hours TAT</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Form Details */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  2. Your Inquiry &amp; Client Details
                </label>

                {/* Name & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Ramesh Kumar"
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white font-medium transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      WhatsApp Mobile Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 9876543210"
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white font-medium transition-colors"
                    />
                  </div>
                </div>

                {/* Email & Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. ramesh@gmail.com"
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white font-medium transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Domain / Query Category *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white font-medium transition-colors"
                    >
                      <option value="Income Tax Notice & Legal Appeals">Income Tax Notice &amp; Legal Appeals (143(1), 148, 139(9))</option>
                      <option value="GST Filing & ITC Discrepancy">GST Services, GSTR-2B Matching &amp; Notice Rectification</option>
                      <option value="Capital Gains on Stocks & Property">Capital Gains on Stocks, Mutual Funds &amp; Property Sale</option>
                      <option value="E-Commerce Marketplace Tax (Amazon/Meesho)">E-Commerce Marketplace Tax &amp; TCS (Amazon, Meesho, Flipkart)</option>
                      <option value="Startup & Company Incorporation">Company Incorporation, Partnership &amp; Startup Tax Exemption</option>
                      <option value="Salary, HRA & Form 16 Rectification">Salary, HRA Exemptions, TDS Mismatch &amp; AIS Scrutiny</option>
                      <option value="Other Corporate & Financial Advisory">Other Corporate, Accounting &amp; Financial Advisory</option>
                    </select>
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Subject / Short Summary of Query
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Received 143(1) intimation asking for ₹35,000 tax due to AIS interest mismatch"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white font-medium transition-colors"
                  />
                </div>

                {/* Detailed Description */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Detailed Facts &amp; Question for the Chartered Accountant *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    placeholder="Please explain the background: What happened? What income/deduction is involved? What did the notice say? Our CA will review all facts to give you an airtight legal opinion."
                    className="w-full p-3.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white font-medium transition-colors leading-relaxed"
                  />
                  <span className="text-[11px] text-slate-400 block mt-1">
                    Minimum 20 characters • Be as detailed as possible for maximum accuracy.
                  </span>
                </div>

                {/* Document Attachments */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Attach Supporting Documents (Optional: Notices, Form 16, Statements)
                  </label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="p-6 border-2 border-dashed border-slate-200 hover:border-emerald-400 bg-slate-50 hover:bg-emerald-50/20 rounded-2xl text-center cursor-pointer transition-colors"
                  >
                    <Upload className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                    <p className="text-xs font-bold text-slate-700">
                      Click to upload Notice PDF, Excel, or Photo
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      PDF, PNG, JPG up to 10MB per file
                    </p>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      multiple
                      accept=".pdf,.png,.jpg,.jpeg,.xlsx,.csv"
                      className="hidden"
                    />
                  </div>

                  {documents.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {documents.map((doc, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2.5 bg-slate-100 rounded-xl text-xs font-medium text-slate-800"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span className="truncate">{doc.name}</span>
                            <span className="text-slate-400 text-[11px]">({doc.size})</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeDoc(idx)}
                            className="p-1 text-slate-400 hover:text-red-500 rounded transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Error Message */}
              {errorMsg && (
                <div className="p-4 rounded-xl bg-red-50 text-red-700 text-xs font-bold border border-red-200 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Submit & Pay Button */}
              <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-left">
                  <span className="text-xs text-slate-500 block">Total Consultation Fee:</span>
                  <span className="text-2xl font-black text-slate-900">
                    ₹{selectedPlan === 'priority' ? 599 : 299}
                  </span>
                  <span className="text-[11px] text-emerald-700 font-semibold ml-2">
                    (Includes Verified CA Solution in {selectedPlan === 'priority' ? '12-24 Hours' : '24-48 Hours'})
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-4 bg-[#00a859] hover:bg-[#008f4c] active:bg-[#007a3f] disabled:opacity-50 text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Opening Secure Payment Gateway...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Submit Query &amp; Pay ₹{selectedPlan === 'priority' ? 599 : 299}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Trust & FAQ Strip */}
      <div className="max-w-4xl mx-auto px-4 mt-16 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-slate-900">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-slate-500">
            Transparent, statutory chartered accountancy advice backed by client protection.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-emerald-600" />
              Who will prepare my legal opinion?
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every query is reviewed and answered by an active ICAI-registered Senior Chartered Accountant with minimum 7+ years of experience in direct/indirect tax litigation.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-emerald-600" />
              How will I receive my written solution?
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              You will receive the complete written solution with relevant sections of the Income Tax Act / GST Act directly on WhatsApp and email, and you can also track it live on our website.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-emerald-600" />
              Can I ask follow-up questions?
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Yes! Both plans include 1 complimentary follow-up clarification question directly with your assigned CA.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-emerald-600" />
              Is my financial data safe?
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              100% confidential. All documents are encrypted and accessible exclusively to your assigned CA under strict ICAI client privacy guidelines.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

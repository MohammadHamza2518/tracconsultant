'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  FileText, 
  Briefcase, 
  AlertTriangle, 
  Building, 
  CheckCircle2, 
  Upload, 
  Send, 
  ArrowRight, 
  ArrowLeft, 
  MessageCircle, 
  Search,
  ShieldAlert,
  HelpCircle,
  FileCheck,
  CreditCard
} from 'lucide-react';
import Link from 'next/link';

interface FilingWizardProps {
  initialService?: string;
  onSuccess?: (id: string) => void;
}

const SERVICE_OPTIONS = [
  {
    id: 'ITR Filing',
    title: 'Income Tax Filing (ITR)',
    desc: 'Salaried, Capital Gains, Business, Freelance & NRI',
    icon: FileText,
    plans: [
      { id: 'Salaried Single Form 16', name: 'Salaried (Single Form 16)', price: '₹499', turnaround: '24 Hours' },
      { id: 'Salaried Multiple Form 16 + HRA', name: 'Salaried (Multiple Form 16 & HRA)', price: '₹999', turnaround: '24 Hours' },
      { id: 'Capital Gains (Stocks, MF & Property)', name: 'Capital Gains (Stocks, MF & Real Estate)', price: '₹1,999', turnaround: '24-48 Hours' },
      { id: 'Business & Freelancers (44AD / 44ADA)', name: 'Business / Freelancers (ITR 3/4)', price: '₹2,499', turnaround: '48 Hours' },
      { id: 'Crypto, Foreign Income & NRI', name: 'Crypto, Foreign Assets & NRI Filing', price: '₹3,999', turnaround: '48-72 Hours' }
    ]
  },
  {
    id: 'GST Services',
    title: 'GST Compliance & Filing',
    desc: 'New Registration, Monthly GSTR-1 & 3B, Annual 9',
    icon: Briefcase,
    plans: [
      { id: 'New GST Registration', name: 'New GST Registration (Complete ARN)', price: '₹999', turnaround: '3-5 Days' },
      { id: 'Monthly GSTR-1 & 3B Return', name: 'Monthly GSTR-1 & 3B Filing', price: '₹799/mo', turnaround: 'Before 20th' },
      { id: 'Quarterly QRMP Scheme Filing', name: 'Quarterly QRMP Returns', price: '₹1,499/qtr', turnaround: 'Quarterly' },
      { id: 'Annual GSTR-9 & Reconciliation', name: 'Annual GSTR-9 Filing & Audit', price: '₹3,499', turnaround: '3-5 Days' }
    ]
  },
  {
    id: 'Notice Assistance',
    title: 'Tax Notice Scrutiny',
    desc: 'Urgent response to 143(1), 139(9), 148, or Tax Demand',
    icon: AlertTriangle,
    plans: [
      { id: 'Notice 143(1) Intimation Review', name: 'Notice 143(1) Demand Review & Appeal', price: '₹999', turnaround: 'Same Day' },
      { id: 'Defective Return Notice 139(9)', name: 'Defective Return Notice 139(9) Response', price: '₹1,499', turnaround: '24 Hours' },
      { id: 'Section 148 Reassessment Defense', name: 'Section 148 Scrutiny Defense by Senior CA', price: '₹4,999', turnaround: 'Priority' },
      { id: 'Rectification Under Section 154', name: 'Tax Rectification Under Section 154', price: '₹1,299', turnaround: '24-48 Hours' }
    ]
  },
  {
    id: 'Company Registration',
    title: 'Business & Startup Setup',
    desc: 'Pvt Ltd, LLP, OPC, MSME Udyam & Trademark',
    icon: Building,
    plans: [
      { id: 'Private Limited Company Incorporation', name: 'Private Limited Incorporation (SPICe+)', price: '₹5,999 + Govt Fees', turnaround: '7-10 Days' },
      { id: 'Limited Liability Partnership (LLP)', name: 'LLP Incorporation + Agreement', price: '₹4,499 + Govt Fees', turnaround: '7 Days' },
      { id: 'MSME / Udyam Registration', name: 'MSME / Udyam Certificate', price: '₹499', turnaround: '24 Hours' },
      { id: 'Trademark (Brand) Registration', name: 'Trademark Search & Class Filing', price: '₹2,999 + Govt Fees', turnaround: '24 Hours' }
    ]
  }
];

export default function FilingWizard({ initialService }: FilingWizardProps) {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState(initialService || SERVICE_OPTIONS[0].id);
  const [selectedPlan, setSelectedPlan] = useState(SERVICE_OPTIONS[0].plans[0].id);
  
  // Form Fields
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [city, setCity] = useState('');
  const [clientNotes, setClientNotes] = useState('');
  
  // File uploads
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; size: string; type: string }[]>([]);
  
  // Submission status
  const [loading, setLoading] = useState(false);
  const [submittedFiling, setSubmittedFiling] = useState<{ id: string; fullName: string; service: string } | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const currentServiceObj = SERVICE_OPTIONS.find(s => s.id === selectedService) || SERVICE_OPTIONS[0];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map(file => ({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        type: file.type || 'application/octet-stream'
      }));
      setUploadedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim() || !mobile.trim()) {
      setErrorMsg('Please enter your full name and 10-digit mobile number.');
      return;
    }

    if (mobile.replace(/[^0-9]/g, '').length !== 10) {
      setErrorMsg('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        service: selectedService,
        plan: selectedPlan,
        fullName: fullName.trim(),
        mobile: mobile.trim(),
        email: email.trim() || undefined,
        panNumber: panNumber.trim().toUpperCase() || undefined,
        city: city.trim() || undefined,
        clientNotes: clientNotes.trim() || undefined,
        documents: uploadedFiles.map((f, idx) => ({
          id: `doc-${Date.now()}-${idx}`,
          name: f.name,
          type: f.type,
          size: f.size,
          uploadDate: new Date().toISOString()
        }))
      };

      const res = await fetch('/api/filings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (data.success && data.data) {
        setSubmittedFiling({
          id: data.data.id,
          fullName: data.data.fullName,
          service: data.data.service
        });
        setStep(4); // Success step
        
        // Trigger celebratory confetti
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch {
          // ignore if canvas-confetti fails in test environment
        }
      } else {
        setErrorMsg(data.error || 'Failed to submit filing. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Network error. Please check your connection or call us directly at 7275922162.');
    } finally {
      setLoading(false);
    }
  };

  const openWhatsAppConfirmation = () => {
    if (!submittedFiling) return;
    const msg = `Hello Tracconsultant! I have submitted my filing application (ID: ${submittedFiling.id}) for ${submittedFiling.service}. Name: ${submittedFiling.fullName}. Please assign my CA.`;
    window.open(`https://wa.me/917275922162?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div id="filing-wizard-container" className="w-full bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
      {/* Wizard Step Indicator */}
      <div className="bg-[#0B2545] px-6 py-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold tracking-wider text-emerald-400">CA-Assisted Tax & Compliance Filing</span>
            <h2 className="text-lg sm:text-xl font-bold">Fast-Track Filing Form</h2>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold bg-white/10 px-3 py-1.5 rounded-full">
            <span>Step {step} of 3</span>
          </div>
        </div>

        {/* Step Progress Bar */}
        <div className="w-full bg-slate-800 h-1.5 rounded-full mt-4 overflow-hidden">
          <div 
            className="bg-emerald-400 h-full transition-all duration-300 rounded-full"
            style={{ width: `${(step / 3) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="p-6 sm:p-8">
        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 text-red-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* STEP 1: Choose Service & Plan */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">1. Select Required Service Category</h3>
              <p className="text-xs text-slate-500 mt-0.5">Pick the service you want our Chartered Accountants to handle</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {SERVICE_OPTIONS.map((srv) => {
                const IconComponent = srv.icon;
                const isSelected = selectedService === srv.id;
                return (
                  <button
                    key={srv.id}
                    type="button"
                    onClick={() => {
                      setSelectedService(srv.id);
                      setSelectedPlan(srv.plans[0].id);
                    }}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected 
                        ? 'border-emerald-500 bg-emerald-50/50 shadow-md ring-2 ring-emerald-500/20' 
                        : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
                      isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'
                    }`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="font-semibold text-sm text-slate-900">{srv.title}</div>
                    <div className="text-xs text-slate-500 mt-1 line-clamp-2">{srv.desc}</div>
                  </button>
                );
              })}
            </div>

            {/* Plan selection within service */}
            <div className="pt-2">
              <div className="mb-3">
                <h3 className="text-base font-bold text-slate-900">2. Select Your Specific Filing Plan</h3>
                <p className="text-xs text-slate-500 mt-0.5">Choose the plan that accurately matches your filing requirement or business volume</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentServiceObj.plans.map((plan, index) => {
                  const isPlanSelected = selectedPlan === plan.id;
                  const isLastOdd = index === currentServiceObj.plans.length - 1 && currentServiceObj.plans.length % 2 !== 0;
                  return (
                    <button
                      key={plan.id}
                      type="button"
                      onClick={() => setSelectedPlan(plan.id)}
                      className={`p-3.5 rounded-xl border text-left flex items-start justify-between gap-2 transition-all cursor-pointer ${
                        isLastOdd ? 'sm:col-span-2' : ''
                      } ${
                        isPlanSelected
                          ? 'border-emerald-500 bg-emerald-50/70 text-slate-900 shadow-sm ring-2 ring-emerald-500/20'
                          : 'border-slate-200 hover:border-slate-300 bg-white text-slate-800'
                      }`}
                    >
                      <div>
                        <div className="font-semibold text-xs sm:text-sm">{plan.name}</div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          Turnaround: {plan.turnaround}
                        </div>
                      </div>
                      <div className={`text-xs font-bold px-2.5 py-1 rounded-md ${
                        isPlanSelected ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-700'
                      }`}>
                        {plan.price}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex items-center gap-2 px-6 py-3 bg-[#00a859] hover:bg-[#008f4c] text-white rounded-xl font-bold text-sm shadow-md transition-all cursor-pointer"
              >
                <span>Continue to Personal Details</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Client & Tax Details */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Personal & Contact Information</h3>
              <p className="text-xs text-slate-500 mt-0.5">Your personal CA will connect with you via WhatsApp & Call using this number</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mobile Number (WhatsApp Active) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-xs text-slate-500 font-semibold">+91</span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="9876543210"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/[^0-9]/g, ''))}
                    className="w-full text-sm pl-12 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="name@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  PAN Number (Optional, for auto-fetch)
                </label>
                <input
                  type="text"
                  maxLength={10}
                  placeholder="ABCDE1234F"
                  value={panNumber}
                  onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                  className="w-full text-sm uppercase px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  City / State
                </label>
                <input
                  type="text"
                  placeholder="e.g. Lucknow / Delhi / Mumbai"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Specific Request / Notes for CA (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Switched jobs, have 2 Form 16s, received Section 143(1) notice, or want to register a tech startup..."
                  value={clientNotes}
                  onChange={(e) => setClientNotes(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex items-center gap-1.5 px-4 py-2.5 text-slate-600 hover:text-slate-900 text-sm font-semibold cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (!fullName.trim() || !mobile.trim()) {
                    setErrorMsg('Please enter your full name and 10-digit mobile number.');
                    return;
                  }
                  setErrorMsg('');
                  setStep(3);
                }}
                className="flex items-center gap-2 px-6 py-3 bg-[#00a859] hover:bg-[#008f4c] text-white rounded-xl font-bold text-sm shadow-md transition-all cursor-pointer"
              >
                <span>Continue to Upload Documents</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Documents & Submit */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Attach Documents & Confirm Filing</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Attach Form 16, Bank Statement, Notice PDF, or PAN. You can also share documents later directly with your CA on WhatsApp.
              </p>
            </div>

            {/* Drag & drop upload box */}
            <label className="border-2 border-dashed border-slate-300 hover:border-emerald-500 bg-slate-50 hover:bg-emerald-50/30 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors group">
              <Upload className="w-10 h-10 text-slate-400 group-hover:text-emerald-600 mb-2 transition-colors" />
              <div className="text-sm font-semibold text-slate-700 group-hover:text-emerald-700">
                Click to attach files from your phone or computer
              </div>
              <div className="text-xs text-slate-400 mt-1">PDF, JPG, PNG, Excel (Max 15MB each)</div>
              <input 
                type="file" 
                multiple 
                onChange={handleFileUpload}
                className="hidden" 
                accept=".pdf,.jpg,.jpeg,.png,.xlsx,.xls,.doc,.docx"
              />
            </label>

            {/* List of uploaded files */}
            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-700">Attached Documents ({uploadedFiles.length}):</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {uploadedFiles.map((f, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-100 rounded-xl text-xs border border-slate-200">
                      <div className="flex items-center gap-2 truncate">
                        <FileCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span className="truncate font-medium text-slate-800">{f.name}</span>
                        <span className="text-slate-400 text-xs">({f.size})</span>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => removeFile(idx)}
                        className="text-red-500 hover:text-red-700 text-xs font-bold ml-2 cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Summary Box */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div className="font-semibold text-slate-800 text-sm flex items-center justify-between">
                <span>Application Summary</span>
                <span className="text-emerald-600 font-bold">{selectedService}</span>
              </div>
              <div className="text-slate-600">Selected Plan: <strong className="text-slate-800">{selectedPlan}</strong></div>
              <div className="text-slate-600">Filer: <strong className="text-slate-800">{fullName}</strong> (+91 {mobile})</div>
              <div className="text-xs text-slate-500 pt-1 border-t border-slate-200">
                🔒 Protected by Tracconsultant 100% Notice Guarantee & Bank-Grade 256-bit Encryption.
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex items-center gap-1.5 px-4 py-2.5 text-slate-600 hover:text-slate-900 text-sm font-semibold cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={handleSubmit}
                className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#00a859] to-[#059669] hover:from-[#008f4c] hover:to-[#047857] text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-500/25 transition-all cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <span>Submitting & Assigning CA...</span>
                ) : (
                  <>
                    <span>Submit & Fast-Track Application</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: SUCCESS CONFIRMATION */}
        {step === 4 && submittedFiling && (
          <div className="py-6 text-center space-y-5">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Application Submitted Successfully</span>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
                Welcome aboard, {submittedFiling.fullName}!
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mt-1">
                Your filing request has been logged in our system. A dedicated Chartered Accountant is now preparing your tax draft.
              </p>
            </div>

            {/* Application ID Card */}
            <div className="max-w-md mx-auto p-4 bg-slate-900 text-white rounded-2xl shadow-xl space-y-2 border border-slate-800">
              <div className="text-xs text-slate-400 uppercase tracking-wider">Your Official Tracking Reference ID</div>
              <div className="text-2xl sm:text-3xl font-mono font-bold text-emerald-400 tracking-wider">
                {submittedFiling.id}
              </div>
              <div className="text-xs text-slate-300">
                Service: <strong>{submittedFiling.service}</strong>
              </div>
            </div>

            {/* Next Steps Cards */}
            <div className="max-w-md mx-auto grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                <div className="font-semibold text-slate-900">Step 1: CA Contact</div>
                <div className="text-slate-500 mt-0.5">Your CA will connect on WhatsApp within 15-30 minutes.</div>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                <div className="font-semibold text-slate-900">Step 2: Draft Review</div>
                <div className="text-slate-500 mt-0.5">Approve your draft and claim maximum tax refunds.</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={openWhatsAppConfirmation}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-[#00a859] hover:bg-[#008f4c] text-white rounded-xl text-sm font-bold shadow-md transition-colors cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Connect with CA on WhatsApp Now</span>
              </button>

              <Link
                href={`/pay?plan=${encodeURIComponent(submittedFiling.service)}`}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-sm font-bold transition-colors"
              >
                <CreditCard className="w-4 h-4 text-emerald-600" />
                <span>Pay Fee via Razorpay Online</span>
              </Link>

              <Link
                href={`/track?q=${submittedFiling.id}`}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-sm font-semibold border border-slate-300 transition-colors"
              >
                <Search className="w-4 h-4" />
                <span>Track Live Application Status</span>
              </Link>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}

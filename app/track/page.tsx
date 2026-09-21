'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Search, 
  CheckCircle2, 
  Clock, 
  UserCheck, 
  FileText, 
  MessageCircle, 
  Phone, 
  AlertCircle, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import Link from 'next/link';

interface FilingTrackItem {
  id: string;
  service: string;
  plan: string;
  fullName: string;
  maskedMobile: string;
  status: string;
  financialYear: string;
  estimatedRefund?: number;
  assignedCA?: {
    name: string;
    phone: string;
    email: string;
    membershipNumber?: string;
  };
  timeline: {
    step: string;
    title: string;
    description: string;
    date: string | null;
    completed: boolean;
    current: boolean;
  }[];
  createdAt: string;
  updatedAt: string;
}

function TrackContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || searchParams.get('query') || '';

  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<FilingTrackItem[] | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchTracking = async (searchVal: string) => {
    if (!searchVal || searchVal.trim().length < 4) {
      setErrorMsg('Please enter at least 4 characters of your Application ID or 10-digit Phone Number.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch(`/api/track?q=${encodeURIComponent(searchVal.trim())}`);
      const data = await res.json();

      if (data.success) {
        setResults(data.data);
        if (data.data.length === 0) {
          setErrorMsg('No application found with this reference. Please verify your Application ID or Phone number.');
        }
      } else {
        setErrorMsg(data.error || 'Failed to search application status.');
        setResults(null);
      }
    } catch {
      setErrorMsg('Network error while searching status. Please try again.');
      setResults(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      fetchTracking(initialQuery);
    }
  }, [initialQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTracking(query);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-bold text-xs">New Submission</span>;
      case 'under_review':
        return <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full font-bold text-xs">Under Document Review</span>;
      case 'ca_assigned':
        return <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full font-bold text-xs">Dedicated CA Assigned</span>;
      case 'draft_ready':
        return <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold text-xs">Draft Computation Ready</span>;
      case 'filed':
      case 'completed':
        return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full font-bold text-xs">Successfully Filed with Govt</span>;
      default:
        return <span className="px-3 py-1 bg-slate-100 text-slate-800 rounded-full font-bold text-xs">In Progress</span>;
    }
  };

  return (
    <div className="py-12 sm:py-16 bg-slate-50 min-h-[80vh]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center space-y-3 mb-10">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Real-Time Portal</span>
          <h1 className="text-3xl sm:text-4xl font-black text-[#0B2545] tracking-tight">
            Track Your Filing & Compliance Status
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
            Enter your 10-digit mobile number or your Tracconsultant Application ID (e.g. <code>TRAC-2025-0814</code>) to view live progress.
          </p>
        </div>

        {/* Search Box */}
        <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto mb-10">
          <div className="flex flex-col sm:flex-row gap-2 bg-white p-2 rounded-2xl shadow-lg border border-slate-200">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter Mobile Number or Ref ID (TRAC-...)"
                className="w-full pl-12 pr-4 py-3 text-sm rounded-xl focus:outline-hidden text-slate-800 font-medium"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-[#0B2545] hover:bg-[#133b6b] text-white text-sm font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span>Searching...</span>
              ) : (
                <>
                  <span>Track Status</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          <div className="flex items-center justify-center gap-3 text-xs text-slate-500 mt-2">
            <span>Try sample ID:</span>
            <button
              type="button"
              onClick={() => {
                setQuery('TRAC-2025-0814');
                fetchTracking('TRAC-2025-0814');
              }}
              className="text-emerald-700 font-mono font-bold hover:underline cursor-pointer"
            >
              TRAC-2025-0814
            </button>
            <span>or phone:</span>
            <button
              type="button"
              onClick={() => {
                setQuery('9876543210');
                fetchTracking('9876543210');
              }}
              className="text-emerald-700 font-mono font-bold hover:underline cursor-pointer"
            >
              9876543210
            </button>
          </div>
        </form>

        {/* Error Alert */}
        {errorMsg && (
          <div className="max-w-2xl mx-auto mb-8 p-4 bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm rounded-2xl flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Results Display */}
        {results && results.length > 0 && (
          <div className="space-y-8">
            {results.map((filing) => (
              <div 
                key={filing.id} 
                className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl overflow-hidden"
              >
                {/* Result Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-mono text-xl sm:text-2xl font-black text-[#0B2545]">
                        {filing.id}
                      </span>
                      {getStatusBadge(filing.status)}
                    </div>
                    <div className="text-xs text-slate-500 mt-1 flex items-center gap-3 flex-wrap">
                      <span>Filer: <strong className="text-slate-800">{filing.fullName}</strong></span>
                      <span>•</span>
                      <span>Mobile: <strong className="text-slate-800">{filing.maskedMobile}</strong></span>
                      <span>•</span>
                      <span>Financial Year: <strong className="text-slate-800">{filing.financialYear}</strong></span>
                    </div>
                  </div>

                  {filing.estimatedRefund !== undefined && (
                    <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-left sm:text-right">
                      <div className="text-[11px] text-emerald-800 font-semibold uppercase tracking-wider">Estimated Tax Refund</div>
                      <div className="text-xl font-black text-emerald-700">₹{filing.estimatedRefund.toLocaleString('en-IN')}</div>
                    </div>
                  )}
                </div>

                {/* Assigned CA Info Card */}
                {filing.assignedCA ? (
                  <div className="my-6 p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-[#0B2545] text-white flex items-center justify-center font-bold text-sm">
                        CA
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 font-semibold">Assigned Chartered Accountant:</div>
                        <div className="text-sm font-bold text-slate-900">{filing.assignedCA.name}</div>
                        {filing.assignedCA.membershipNumber && (
                          <div className="text-[11px] text-slate-400">Membership: {filing.assignedCA.membershipNumber}</div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={`https://wa.me/91${filing.assignedCA.phone}?text=${encodeURIComponent(`Hello ${filing.assignedCA.name}, I am following up on my application ${filing.id}.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-4 py-2 bg-[#00a859] hover:bg-[#008f4c] text-white rounded-xl text-xs font-bold transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Chat on WhatsApp</span>
                      </a>
                      <a
                        href={`tel:+91${filing.assignedCA.phone}`}
                        className="p-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl transition-colors"
                        title="Call CA"
                      >
                        <Phone className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="my-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <span>Your application is currently queued for CA assignment. You will receive an SMS/WhatsApp notification shortly.</span>
                  </div>
                )}

                {/* Visual Timeline */}
                <div className="mt-8">
                  <h4 className="text-sm font-bold text-slate-900 mb-6 uppercase tracking-wider">
                    Application Milestone Progress
                  </h4>

                  <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                    {filing.timeline.map((step, idx) => (
                      <div key={idx} className="relative">
                        {/* Step Marker Dot */}
                        <div 
                          className={`absolute -left-6 sm:-left-8 top-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                            step.completed
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : step.current
                              ? 'bg-[#0B2545] text-white ring-4 ring-emerald-400/30'
                              : 'bg-slate-200 text-slate-500'
                          }`}
                        >
                          {step.completed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                        </div>

                        {/* Step Details */}
                        <div>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                            <h5 className={`text-sm font-bold ${step.completed || step.current ? 'text-slate-900' : 'text-slate-400'}`}>
                              {step.title}
                            </h5>
                            {step.date && (
                              <span className="text-[11px] font-semibold text-slate-400">
                                {step.date}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Help */}
                <div className="mt-8 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Protected by 100% Notice Guarantee</span>
                  </div>
                  <div>
                    Need immediate assistance? Call <a href="tel:+917275922162" className="text-slate-800 font-bold hover:underline">+91 7275922162</a>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-500">Loading tracking portal...</div>}>
      <TrackContent />
    </Suspense>
  );
}

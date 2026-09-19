'use client';

import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  MessageCircle, 
  Send, 
  CheckCircle2, 
  ShieldCheck, 
  AlertCircle 
} from 'lucide-react';

export default function ContactPage() {
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [service, setService] = useState('ITR Filing');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !mobile.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/filings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          mobile,
          email,
          service,
          plan: 'Contact Inquiry / Callback Request',
          clientNotes: message || 'Submitted via Contact Us page'
        })
      });

      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
      }
    } catch {
      alert('Network error. Please call us directly at 7275922162.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Get In Touch</span>
          <h1 className="text-3xl sm:text-5xl font-black text-[#0B2545] tracking-tight">
            We&apos;re Here to Assist Your Taxes & Business
          </h1>
          <p className="text-sm sm:text-base text-slate-600">
            Have questions about an income tax notice, GST filing, or company registration? Connect with our Senior Chartered Accountants right now.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Direct Contact Info Cards */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Phone Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Direct Phone Helplines</h3>
                  <p className="text-xs text-slate-400">Speak directly with practicing CAs</p>
                </div>
              </div>
              <div className="pt-2 space-y-2 border-t border-slate-100 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Primary Desk:</span>
                  <a href="tel:+917275922162" className="text-[#0B2545] font-bold hover:text-emerald-600">
                    +91 7275922162
                  </a>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Alternate Line:</span>
                  <a href="tel:+918052171196" className="text-[#0B2545] font-bold hover:text-emerald-600">
                    +91 8052171196
                  </a>
                </div>
              </div>
            </div>

            {/* WhatsApp Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Instant WhatsApp Support</h3>
                  <p className="text-xs text-slate-400">Reply time: under 2 minutes</p>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-100">
                <a
                  href="https://wa.me/917275922162?text=Hello%20Tracconsultant!%20I%20have%20an%20inquiry."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 bg-[#00a859] hover:bg-[#008f4c] text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Start WhatsApp Chat (+91 7275922162)</span>
                </a>
              </div>
            </div>

            {/* Email & Working Hours */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 text-xs text-slate-600">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#0B2545] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 block">Official Support Email</span>
                  <a href="mailto:contact@tracconsultant.com" className="text-emerald-700 font-semibold hover:underline">
                    contact@tracconsultant.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-3 border-t border-slate-100">
                <Clock className="w-5 h-5 text-[#0B2545] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 block">Consultation Hours</span>
                  <span>Monday – Saturday: 9:00 AM – 8:00 PM IST</span>
                  <span className="text-[11px] text-emerald-700 block mt-0.5 font-medium">Emergency Notice Help: 24/7 on WhatsApp</span>
                </div>
              </div>
            </div>

            {/* Registered & Physical Operating Address (Mandatory for Payment Gateway) */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Registered Office</h3>
                  <p className="text-xs text-slate-400">Operating Entity & CA Chambers</p>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-100 text-xs text-slate-700 space-y-1 leading-relaxed">
                <p className="font-bold text-slate-900">Tracconsultant Advisory</p>
                <p>2nd Floor, Civil Lines, Kanpur, Uttar Pradesh - 208001, India</p>
                <p className="text-slate-500 pt-1 text-[11px]">Regional Branch: Gomti Nagar, Lucknow, Uttar Pradesh - 226010, India</p>
              </div>
            </div>

          </div>

          {/* Right Column: Contact Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-6">
              <div>
                <h3 className="text-xl font-black text-[#0B2545]">Request a Dedicated CA Callback</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Fill in your query and a Senior Chartered Accountant will call you back within 30 minutes.
                </p>
              </div>

              {submitted ? (
                <div className="py-10 text-center space-y-3">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900">Message Received!</h4>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto">
                    Thank you, {fullName}. Our tax team has logged your inquiry and will call you on +91 {mobile} shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="mt-4 px-5 py-2 bg-slate-100 text-slate-800 text-xs font-semibold rounded-xl"
                  >
                    Send Another Query
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Priyanshu Saxena"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Number (10 digits) *</label>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        placeholder="9876543210"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value.replace(/[^0-9]/g, ''))}
                        className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                      <input
                        type="email"
                        placeholder="name@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Service Required</label>
                      <select
                        value={service}
                        onChange={(e) => setService(e.target.value)}
                        className="w-full text-xs p-3 rounded-xl border border-slate-300 bg-white font-medium"
                      >
                        <option value="ITR Filing">Income Tax Return (ITR)</option>
                        <option value="GST Services">GST Registration & Return</option>
                        <option value="Notice Assistance">Tax Notice & Scrutiny 143(1)</option>
                        <option value="Company Registration">Company / MSME Setup</option>
                        <option value="Accounting & TDS">Accounting, TDS & Audits</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Your Specific Tax / Business Query</label>
                    <textarea
                      rows={4}
                      placeholder="Please describe your requirements, e.g. I have 2 Form 16s, received a demand notice, or need advice on starting an LLP..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 bg-white"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-[#0B2545] hover:bg-[#133b6b] text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-4 h-4 text-emerald-400" />
                    <span>{loading ? 'Submitting...' : 'Request Callback from Senior CA'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

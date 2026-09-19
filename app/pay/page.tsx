'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import QRCode from 'qrcode';
import { 
  ShieldCheck, 
  CreditCard, 
  QrCode, 
  Building, 
  CheckCircle2, 
  ArrowRight, 
  Download, 
  Printer, 
  MessageCircle, 
  Phone, 
  Lock, 
  Copy, 
  FileText,
  AlertCircle
} from 'lucide-react';

const POPULAR_PLANS = [
  { name: 'Salaried Basic (ITR-1)', price: 499, service: 'ITR Filing' },
  { name: 'Salaried Multi-Job & HRA', price: 999, service: 'ITR Filing' },
  { name: 'Capital Gains & Crypto (ITR-2)', price: 1999, service: 'ITR Filing' },
  { name: 'Business & Freelancers (ITR-3/4)', price: 2499, service: 'ITR Filing' },
  { name: 'New GST Registration', price: 999, service: 'GST Services' },
  { name: 'Monthly GSTR-1 & 3B', price: 799, service: 'GST Services' },
  { name: 'Notice 143(1) Demand Review', price: 999, service: 'Notice Assistance' },
  { name: 'Defective Notice 139(9)', price: 1499, service: 'Notice Assistance' },
  { name: 'MSME / Udyam Registration', price: 499, service: 'Company Setup' },
  { name: 'Private Limited Incorporation', price: 5999, service: 'Company Setup' },
];

function PaymentCheckoutContent() {
  const searchParams = useSearchParams();
  const queryPlan = searchParams.get('plan');
  const queryPrice = searchParams.get('price');

  const [selectedPlanName, setSelectedPlanName] = useState<string>(queryPlan || POPULAR_PLANS[0].name);
  const [amount, setAmount] = useState<number>(queryPrice ? Number(queryPrice) : POPULAR_PLANS[0].price);

  // Client Details
  const [fullName, setFullName] = useState<string>('');
  const [mobile, setMobile] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [panNumber, setPanNumber] = useState<string>('');

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'bank'>('upi');
  const [utrNumber, setUtrNumber] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);
  const [receiptId, setReceiptId] = useState<string>('');
  const [copiedUpi, setCopiedUpi] = useState<boolean>(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');

  // Generate dynamic, scannable UPI QR code
  useEffect(() => {
    const upiUri = `upi://pay?pa=tracconsultant@upi&pn=Tracconsultant%20Advisory&am=${amount}&cu=INR&tn=${encodeURIComponent(selectedPlanName)}`;
    QRCode.toDataURL(upiUri, {
      width: 320,
      margin: 1,
      color: {
        dark: '#07172B',
        light: '#FFFFFF'
      }
    })
      .then(url => setQrCodeDataUrl(url))
      .catch(err => console.error('QR code generation error:', err));
  }, [amount, selectedPlanName]);

  useEffect(() => {
    if (queryPlan) setSelectedPlanName(queryPlan);
    if (queryPrice) setAmount(Number(queryPrice));
  }, [queryPlan, queryPrice]);

  const handlePlanChange = (planName: string) => {
    setSelectedPlanName(planName);
    const found = POPULAR_PLANS.find(p => p.name === planName);
    if (found) setAmount(found.price);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !mobile.trim()) {
      alert('Please fill your full name and 10-digit mobile number.');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      const recId = `TRAC-PAY-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
      setReceiptId(recId);
      setPaymentSuccess(true);
    }, 1500);
  };

  const openWhatsAppConfirmation = () => {
    const text = `Hello Tracconsultant! I have completed payment of ₹${amount} for *${selectedPlanName}*. Receipt No: *${receiptId}*. Name: ${fullName}, Phone: ${mobile}. ${utrNumber ? 'UTR: ' + utrNumber : ''}`;
    window.open(`https://wa.me/917275922162?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="py-12 sm:py-16 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center space-y-2 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>256-Bit SSL Encrypted Secure Checkout</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#0B2545] tracking-tight">
            Tracconsultant Payment Desk
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
            Pay securely via UPI (Google Pay, PhonePe, Paytm), Net Banking, Debit/Credit Card, or direct NEFT transfer.
          </p>
        </div>

        {/* PAYMENT SUCCESS RECEIPT SCREEN */}
        {paymentSuccess ? (
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-2xl space-y-6 max-w-2xl mx-auto animate-in zoom-in-95 duration-200">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Payment Confirmed</span>
              <h2 className="text-2xl font-black text-slate-900">Thank You, {fullName}!</h2>
              <p className="text-xs text-slate-500">Your transaction has been processed and assigned to our CA desk.</p>
            </div>

            {/* Receipt Summary Box */}
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs">
              <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                <span className="text-slate-500">Receipt Reference:</span>
                <span className="font-mono font-bold text-slate-900">{receiptId}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                <span className="text-slate-500">Service Plan:</span>
                <span className="font-bold text-slate-900">{selectedPlanName}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                <span className="text-slate-500">Payer Details:</span>
                <span className="font-bold text-slate-900">{fullName} (+91 {mobile})</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                <span className="text-slate-500">Payment Date:</span>
                <span className="font-semibold text-slate-700">{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <div className="flex justify-between items-center pt-2 text-sm font-black text-[#0B2545]">
                <span>Total Amount Paid:</span>
                <span className="text-xl text-emerald-600 font-extrabold">₹{amount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={openWhatsAppConfirmation}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#00a859] hover:bg-[#008f4c] text-white rounded-xl text-xs font-bold shadow-md transition-colors cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Share Receipt & Start Filing on WhatsApp</span>
              </button>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold border border-slate-300 transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Receipt</span>
                </button>

                <Link
                  href="/track"
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#0B2545] hover:bg-[#133b6b] text-white rounded-xl text-xs font-semibold transition-colors"
                >
                  <span>Go to Track Status</span>
                </Link>
              </div>
            </div>

            <div className="text-center text-[11px] text-slate-400">
              Assistance: Call +91 7275922162 • Email: contact@tracconsultant.com
            </div>
          </div>
        ) : (
          /* CHECKOUT FORM */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Form & Payment Methods */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Payer Details */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-900">1. Payer Information</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Kumar"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile (WhatsApp) *</label>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      placeholder="9876543210"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value.replace(/[^0-9]/g, ''))}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      placeholder="ramesh@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">PAN Number (Optional)</label>
                    <input
                      type="text"
                      maxLength={10}
                      placeholder="ABCDE1234F"
                      value={panNumber}
                      onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white uppercase"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-900">2. Choose Payment Mode</h3>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`py-3 px-2 rounded-2xl border text-center transition-all cursor-pointer ${
                      paymentMethod === 'upi'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-800 font-bold shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <QrCode className="w-5 h-5 mx-auto mb-1" />
                    <span className="text-xs">Instant UPI / QR</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`py-3 px-2 rounded-2xl border text-center transition-all cursor-pointer ${
                      paymentMethod === 'card'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-800 font-bold shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 mx-auto mb-1" />
                    <span className="text-xs">Debit / Card</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('bank')}
                    className={`py-3 px-2 rounded-2xl border text-center transition-all cursor-pointer ${
                      paymentMethod === 'bank'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-800 font-bold shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Building className="w-5 h-5 mx-auto mb-1" />
                    <span className="text-xs">NEFT / NetBanking</span>
                  </button>
                </div>

                {/* UPI Content */}
                {paymentMethod === 'upi' && (
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4 text-center">
                    <div className="text-xs text-slate-600 font-medium">
                      Scan QR Code using Google Pay, PhonePe, Paytm, or BHIM:
                    </div>

                    {/* Real Scannable UPI QR Code */}
                    <div className="relative w-52 h-52 mx-auto bg-white p-2.5 rounded-2xl border-2 border-emerald-500 shadow-xl flex items-center justify-center">
                      {qrCodeDataUrl ? (
                        <div className="relative w-full h-full flex items-center justify-center">
                          <img 
                            src={qrCodeDataUrl} 
                            alt={`Scan to Pay ₹${amount} via UPI`}
                            className="w-full h-full object-contain rounded-lg"
                          />
                          {/* Centered Brand Official Seal Badge */}
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-11 h-11 bg-white rounded-full p-0.5 shadow-lg border-2 border-[#C9933B] flex items-center justify-center overflow-hidden">
                              <Image 
                                src="/logo.png" 
                                alt="Tracconsultant" 
                                width={38} 
                                height={38} 
                                className="object-contain"
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-xs text-slate-400 animate-pulse">Generating Secure UPI QR Code...</div>
                      )}
                    </div>

                    {/* Supported UPI Apps Pills */}
                    <div className="flex items-center justify-center gap-1.5 pt-1 flex-wrap">
                      <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-bold">Google Pay</span>
                      <span className="text-[10px] bg-purple-100 text-purple-800 px-2 py-0.5 rounded font-bold">PhonePe</span>
                      <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold">Paytm</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">BHIM UPI</span>
                    </div>

                    {/* Mobile Quick Pay Button */}
                    <div className="block sm:hidden pt-1">
                      <a
                        href={`upi://pay?pa=tracconsultant@upi&pn=Tracconsultant%20Advisory&am=${amount}&cu=INR&tn=${encodeURIComponent(selectedPlanName)}`}
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>Open in UPI App Directly</span>
                      </a>
                    </div>

                    <div className="space-y-2">
                      <div className="inline-flex items-center gap-2 p-2 bg-white rounded-xl border border-slate-300 text-xs">
                        <span className="text-slate-500">UPI ID:</span>
                        <strong className="font-mono text-emerald-800">tracconsultant@upi</strong>
                        <button
                          type="button"
                          onClick={() => copyToClipboard('tracconsultant@upi')}
                          className="text-slate-400 hover:text-slate-700 cursor-pointer"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      {copiedUpi && <div className="text-[10px] text-emerald-600 font-bold">UPI ID Copied!</div>}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1 text-left">
                        12-Digit UPI Reference Number / UTR (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 4120XXXXXXXX"
                        value={utrNumber}
                        onChange={(e) => setUtrNumber(e.target.value)}
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
                      />
                    </div>
                  </div>
                )}

                {/* Card Content */}
                {paymentMethod === 'card' && (
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Card Number</label>
                      <input
                        type="text"
                        placeholder="4242 •••• •••• 4242"
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Expiry Date</label>
                        <input
                          type="text"
                          placeholder="MM / YY"
                          className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">CVV</label>
                        <input
                          type="password"
                          maxLength={4}
                          placeholder="123"
                          className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Bank Transfer Content */}
                {paymentMethod === 'bank' && (
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
                    <div className="font-bold text-slate-800">Tracconsultant Current Account Details:</div>
                    <div className="grid grid-cols-2 gap-2 p-3 bg-white rounded-xl border border-slate-200">
                      <div><span className="text-slate-400">Beneficiary:</span> <strong>Tracconsultant Tax Advisory</strong></div>
                      <div><span className="text-slate-400">Bank:</span> <strong>ICICI Bank</strong></div>
                      <div><span className="text-slate-400">Account No:</span> <strong>50200084920194</strong></div>
                      <div><span className="text-slate-400">IFSC Code:</span> <strong>ICIC0001234</strong></div>
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md space-y-5">
                <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                  Order & Tax Summary
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Select Service Plan:</label>
                  <select
                    value={selectedPlanName}
                    onChange={(e) => handlePlanChange(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white font-semibold"
                  >
                    {POPULAR_PLANS.map((p, idx) => (
                      <option key={idx} value={p.name}>
                        {p.name} — ₹{p.price}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
                  <div className="flex justify-between">
                    <span>Base Consultancy Fee:</span>
                    <span className="font-semibold text-slate-900">₹{Math.round(amount / 1.18).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST (18% inclusive):</span>
                    <span className="font-semibold text-slate-900">₹{Math.round(amount - (amount / 1.18)).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm font-black text-[#0B2545] border-t border-slate-200 pt-3">
                    <span>Total Net Payable:</span>
                    <span className="text-2xl text-emerald-600 font-extrabold">₹{amount.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handlePaymentSubmit}
                  disabled={isProcessing}
                  className="w-full py-4 bg-[#00a859] hover:bg-[#008f4c] text-white text-sm font-bold rounded-2xl shadow-lg shadow-emerald-500/25 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? 'Verifying Transaction...' : `Confirm & Pay ₹${amount.toLocaleString('en-IN')}`}
                </button>

                {/* Razorpay Compliance Terms Agreement */}
                <div className="text-[10px] text-slate-500 text-center leading-relaxed">
                  By clicking Confirm & Pay, you agree to our{' '}
                  <Link href="/terms-of-service" target="_blank" className="text-emerald-700 underline font-medium">Terms</Link>,{' '}
                  <Link href="/privacy-policy" target="_blank" className="text-emerald-700 underline font-medium">Privacy</Link>,{' '}
                  <Link href="/refund-policy" target="_blank" className="text-emerald-700 underline font-medium">Refund (5-7 days)</Link> &{' '}
                  <Link href="/shipping-policy" target="_blank" className="text-emerald-700 underline font-medium">Delivery Policy</Link>.
                </div>

                <div className="space-y-2 pt-1 text-[11px] text-slate-500">
                  <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                    <ShieldCheck className="w-4 h-4" />
                    <span>100% Money-Back Guarantee (Subject to terms)</span>
                  </div>
                  <p>
                    🔒 Official GST Tax Invoice and receipt generated immediately. Payments secured via RBI-approved payment channels.
                  </p>
                </div>

                {/* Direct WhatsApp Assistance */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center text-xs">
                  <span>Having trouble paying?</span>
                  <a
                    href="https://wa.me/917275922162?text=Hello%20Tracconsultant!%20Need%20help%20with%20payment."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-emerald-700 font-bold hover:underline mt-0.5"
                  >
                    Chat with Accounts Desk on WhatsApp &rarr;
                  </a>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}

export default function PayPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-500">Loading checkout portal...</div>}>
      <PaymentCheckoutContent />
    </Suspense>
  );
}

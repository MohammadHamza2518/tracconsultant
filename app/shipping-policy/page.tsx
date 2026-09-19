import React from 'react';
import Link from 'next/link';
import { Truck, ShieldCheck, Clock, CheckCircle2, FileText, Download, Laptop } from 'lucide-react';

export const metadata = {
  title: 'Shipping & Delivery Policy | Tracconsultant Tax & Compliance Advisory',
  description: 'Understand the electronic delivery timelines, digital fulfillment process, and turnaround times for Tracconsultant CA services and tax tools.'
};

export default function ShippingPolicyPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-md space-y-8">
        
        {/* Header */}
        <div className="border-b border-slate-200 pb-6 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
            <Truck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Digital Fulfillment & Service Delivery Standard</span>
          </div>
          <h1 className="text-3xl font-black text-[#0B2545]">Shipping & Delivery Policy</h1>
          <p className="text-xs text-slate-500">Effective Date: May 2025 | Last Updated: Recent</p>
        </div>

        {/* Content */}
        <div className="space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
          
          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">1. Nature of Deliverables (100% Digital Delivery)</h2>
            <p>
              <strong>Tracconsultant</strong> (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) specializes exclusively in professional Chartered Accountant (CA) advisory, government tax filing, business incorporation, and fintech productivity software tools.
            </p>
            <p>
              Since all our offerings consist of <strong>professional services, consultancy, digital government acknowledgements, and software utilities</strong>, there is <strong>NO physical shipping of tangible merchandise</strong>. No physical courier or postal dispatch is involved. All deliverables are dispatched electronically.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900">2. Modes of Electronic Delivery</h2>
            <p>Upon order placement and successful payment verification, your services and deliverables are fulfilled via the following digital channels:</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Laptop className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-xs text-slate-900">1. Client Dashboard</h4>
                <p className="text-[11px] text-slate-600">Instant access to paid tax tools, live tracking status, and downloadable receipts.</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-xs text-slate-900">2. Registered Email</h4>
                <p className="text-[11px] text-slate-600">Official ITR-V acknowledgements, MCA incorporation certificates, and tax invoices.</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                <div className="w-8 h-8 rounded-lg bg-green-100 text-green-700 flex items-center justify-center">
                  <Download className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-xs text-slate-900">3. WhatsApp Helpline</h4>
                <p className="text-[11px] text-slate-600">Draft computation sheets, CA advisory call summaries, and real-time status alerts.</p>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900">3. Turnaround Time (TAT) & Delivery Schedules</h2>
            <p>
              Delivery timelines commence once the customer has provided all necessary statutory information and valid documents (e.g., Form 16, PAN, Aadhaar, Bank Statements, or DSC credentials):
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                <thead className="bg-[#0B2545] text-white">
                  <tr>
                    <th className="p-3">Category of Service</th>
                    <th className="p-3">Deliverable Item</th>
                    <th className="p-3">Delivery Timeline (TAT)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr className="bg-white">
                    <td className="p-3 font-semibold text-slate-900">Digital Compliance Suite</td>
                    <td className="p-3 text-slate-600">Full Access to Paid Tool Workspace</td>
                    <td className="p-3 font-bold text-emerald-600">Immediate / Instantaneous (0 Mins)</td>
                  </tr>
                  <tr className="bg-slate-50">
                    <td className="p-3 font-semibold text-slate-900">Income Tax Return (Salaried)</td>
                    <td className="p-3 text-slate-600">Draft Tax Computation & ITR-V Ack</td>
                    <td className="p-3 font-bold text-slate-800">24 to 48 Business Hours</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="p-3 font-semibold text-slate-900">Business / Capital Gains ITR</td>
                    <td className="p-3 text-slate-600">Financial P&L, B/S & E-filing Receipt</td>
                    <td className="p-3 font-bold text-slate-800">48 to 72 Business Hours</td>
                  </tr>
                  <tr className="bg-slate-50">
                    <td className="p-3 font-semibold text-slate-900">GST Registration & Returns</td>
                    <td className="p-3 text-slate-600">GSTIN Certificate / GSTR-3B ARN</td>
                    <td className="p-3 font-bold text-slate-800">Same Day to 48 Hours</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="p-3 font-semibold text-slate-900">Company Incorporation / LLP</td>
                    <td className="p-3 text-slate-600">MCA Certificate of Incorporation (COI), DIN & PAN/TAN</td>
                    <td className="p-3 font-bold text-slate-800">5 to 7 Business Days (Subject to MCA)</td>
                  </tr>
                  <tr className="bg-slate-50">
                    <td className="p-3 font-semibold text-slate-900">Tax Notice Scrutiny Reply</td>
                    <td className="p-3 text-slate-600">Draft Rectification / Appeal Filing Doc</td>
                    <td className="p-3 font-bold text-slate-800">24 to 48 Business Hours</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-slate-500">
              * Note: Delays occurring due to downtime or scheduled maintenance on official government servers (such as <code>incometax.gov.in</code>, <code>gst.gov.in</code>, or <code>mca.gov.in</code>) are beyond our direct control, though our team will e-file your return immediately once government portals normalize.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">4. Shipping & Delivery Charges</h2>
            <p>
              Since all deliverables and services are fulfilled electronically over high-speed encrypted channels, <strong>there are ZERO (₹0) shipping or courier charges</strong> applicable to any of our services. The pricing displayed on our checkout and service pages represents the full professional advisory fee.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">5. Confirmation & Tracking of Delivery</h2>
            <p>
              Clients can track the real-time fulfillment status of their filings 24x7 on our public tracking portal at{' '}
              <Link href="/track" className="text-emerald-700 font-bold underline">
                tracconsultant.com/track
              </Link>{' '}
              using their 10-digit mobile number or Application Reference ID (e.g. <code>TRAC-2025-XXXX</code>).
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">6. Non-Receipt of Digital Deliverables</h2>
            <p>
              In the unlikely event that you do not receive your digital filing confirmation, tax computation draft, or tool access within the stipulated turnaround time:
            </p>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
              <p><strong>Tracconsultant Delivery & Support Desk:</strong></p>
              <p>Email: <a href="mailto:contact@tracconsultant.com" className="text-emerald-700 font-medium">contact@tracconsultant.com</a></p>
              <p>Primary Helpline: +91 7275922162</p>
              <p>Alternate Helpline: +91 8052171196</p>
              <p>Operating Hours: Monday – Saturday: 9:30 AM to 7:30 PM IST</p>
            </div>
          </section>

        </div>

        {/* Footer Navigation */}
        <div className="pt-4 border-t border-slate-200 flex justify-between items-center text-xs">
          <Link href="/refund-policy" className="text-slate-600 hover:text-slate-900">&larr; Refund Policy</Link>
          <Link href="/terms-of-service" className="text-emerald-700 font-bold hover:underline">Terms of Service &rarr;</Link>
        </div>

      </div>
    </div>
  );
}

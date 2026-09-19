import React from 'react';
import Link from 'next/link';
import { ShieldCheck, CheckCircle2, AlertCircle, RefreshCw, Clock, Phone, Mail } from 'lucide-react';

export const metadata = {
  title: 'Refund & Cancellation Policy | Tracconsultant Tax Advisory',
  description: 'Understand Tracconsultant customer-friendly cancellation policy, 5-7 working days refund timelines, and money-back guarantees.'
};

export default function RefundPolicyPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-md space-y-8">
        
        {/* Header */}
        <div className="border-b border-slate-200 pb-6 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
            <RefreshCw className="w-3.5 h-3.5 text-emerald-600" />
            <span>Fair Business & Consumer Protection Guarantee</span>
          </div>
          <h1 className="text-3xl font-black text-[#0B2545]">Refund & Cancellation Policy</h1>
          <p className="text-xs text-slate-500">Effective Date: May 2025 | Last Reviewed: September 2026</p>
        </div>

        {/* Content */}
        <div className="space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
          
          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">1. Commitment to Customer Satisfaction</h2>
            <p>
              At <strong>Tracconsultant</strong> (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;), we take pride in the quality and precision of our Chartered Accountant (CA) assisted tax, GST, and corporate legal services. We strive to provide transparent, hassle-free compliance. If for any valid reason you are not satisfied with our service, this Policy outlines our cancellation and refund procedures in accordance with Indian consumer protection standards.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900">2. Cancellation Policy & Procedure</h2>
            <p>
              Clients may request cancellation of their service application by notifying our team in writing or via telephone before the execution of the filing.
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li><strong>Prior to CA Examination (Within 24 Hours of Order):</strong> If you cancel your order before our assigned Chartered Accountant has commenced the review of your documents or prepared computations, you are eligible for a <strong>100% full refund</strong> of the advisory fee paid.</li>
              <li><strong>After Initial Draft Preparation:</strong> If our CA has already examined your Form 16, AIS, and prepared a preliminary computation sheet, a nominal administrative and drafting fee of ₹250 will be retained to cover professional man-hours, and the remainder will be refunded.</li>
              <li><strong>Cancellation of Paid Software Tools:</strong> For paid digital utilities (e.g. PDF Redactor, GSTR-2A Recon), cancellation and refund requests can be made within <strong>48 hours</strong> of purchase provided the utility has not been extensively utilized for batch commercial outputs.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900">3. Eligibility for 100% Money-Back Refund</h2>
            <p>You are entitled to a full 100% refund of professional consultancy charges under any of the following circumstances:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200/80 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-emerald-900 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Service Inability</span>
                </div>
                <p className="text-[11px] text-slate-600">If Tracconsultant is unable to complete your filing due to internal operational or technical failure.</p>
              </div>

              <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200/80 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-emerald-900 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Duplicate Charges</span>
                </div>
                <p className="text-[11px] text-slate-600">If you were charged multiple times for the same transaction reference due to a payment gateway timeout.</p>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900">4. Non-Refundable Items & Government Fees</h2>
            <p>Please note that refunds <strong>CANNOT</strong> be issued under the following conditions:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li><strong>Government & Statutory Statutory Fees:</strong> Any statutory fees remitted to government portals on your behalf (e.g., MCA name reservation fees, Ministry incorporation stamp duties, GST registration challans, or Income Tax late filing fees under Section 234F) are non-refundable as they are paid directly to the Government of India.</li>
              <li><strong>Executed Filings (ITR-V / ARN Generated):</strong> Once an official Income Tax Return Acknowledgement (ITR-V), GST ARN, or MCA Certificate of Incorporation has been officially submitted and generated from the government portal, professional fees cannot be refunded as the service has been fully fulfilled.</li>
              <li><strong>Incorrect Information Supplied by Client:</strong> Delays or rejections arising from false or forged documents, undisclosed bank accounts, or non-cooperation by the client are not eligible for a refund.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>5. Refund Processing Timelines & Method (5-7 Working Days)</span>
            </h2>
            <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-200/80 space-y-2 text-xs text-amber-950">
              <p className="font-bold">
                * Statutory Mandatory Timeline:
              </p>
              <p>
                Once your refund request is verified and approved by our Accounts Desk, the refund will be initiated within <strong>24 to 48 business hours</strong>.
              </p>
              <p>
                The refund amount will be credited back to the <strong>original source of payment</strong> (e.g. UPI, Net Banking, Debit Card, or Credit Card) within <strong>5 to 7 working days</strong>, subject to standard inter-bank clearing and card-issuing bank settlement cycles.
              </p>
            </div>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">6. How to Initiate a Refund Request</h2>
            <p>
              To request a cancellation or refund, please send an email to <a href="mailto:contact@tracconsultant.com" className="text-emerald-700 font-bold underline">contact@tracconsultant.com</a> with the subject line: <code>&ldquo;Refund Request - [Your Application ID]&rdquo;</code> containing:
            </p>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1 text-slate-700">
              <p>1. <strong>Application Reference ID:</strong> (e.g. <code>TRAC-2025-XXXX</code> or <code>TRAC-TOOL-XXXX</code>)</p>
              <p>2. <strong>Client Name & Registered Mobile:</strong> (used during filing)</p>
              <p>3. <strong>Payment Transaction ID / UTR Number:</strong> (from UPI / Card receipt)</p>
              <p>4. <strong>Reason for Refund / Cancellation:</strong> (to help us improve our service)</p>
            </div>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">7. Customer Support Helpdesk</h2>
            <p>For any inquiries or dispute resolution regarding your payments, reach out to our billing desk:</p>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1 text-slate-700">
              <p><strong>Tracconsultant Accounts & Billing Desk:</strong></p>
              <p>Email: <a href="mailto:contact@tracconsultant.com" className="text-emerald-700 font-medium">contact@tracconsultant.com</a></p>
              <p>Primary Helpline: +91 7275922162 | Alternate Helpline: +91 8052171196</p>
              <p>Address: Tracconsultant Advisory, 2nd Floor, Civil Lines, Kanpur, UP - 208001, India</p>
            </div>
          </section>

        </div>

        {/* Footer Navigation */}
        <div className="pt-4 border-t border-slate-200 flex justify-between items-center text-xs">
          <Link href="/terms-of-service" className="text-slate-600 hover:text-slate-900">&larr; Terms of Service</Link>
          <div className="flex gap-4">
            <Link href="/shipping-policy" className="text-slate-600 hover:text-slate-900">Shipping Policy</Link>
            <Link href="/" className="text-emerald-700 font-bold hover:underline">Return to Homepage &rarr;</Link>
          </div>
        </div>

      </div>
    </div>
  );
}

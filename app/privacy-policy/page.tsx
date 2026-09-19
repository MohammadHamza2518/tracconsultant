import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, Eye, FileText, CheckCircle2, UserCheck, AlertCircle } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy | Tracconsultant Tax & Compliance Advisory',
  description: 'Our commitment to data privacy, bank-grade 256-bit encryption, and statutory compliance under the Information Technology Act 2000 and Digital Personal Data Protection (DPDP) Act 2023.'
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-md space-y-8">
        
        {/* Header */}
        <div className="border-b border-slate-200 pb-6 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>DPDP Act 2023 & IT Act 2000 Statutory Compliance</span>
          </div>
          <h1 className="text-3xl font-black text-[#0B2545]">Privacy Policy</h1>
          <p className="text-xs text-slate-500">Effective Date: May 2025 | Last Reviewed: September 2026</p>
        </div>

        {/* Content */}
        <div className="space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
          
          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">1. Introduction & Overview</h2>
            <p>
              <strong>Tracconsultant</strong> (&ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;us&rdquo;, or the &ldquo;Platform&rdquo;) is an Indian tax consultancy, CA-assisted filing, and corporate legal advisory service. We are committed to safeguarding the confidentiality and privacy of the personal and financial data you provide to us in accordance with the <strong>Information Technology Act, 2000</strong>, the <strong>Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011</strong>, and the <strong>Digital Personal Data Protection (DPDP) Act, 2023</strong>.
            </p>
            <p>
              This Privacy Policy explains how your information is collected, processed, utilized, protected, and shared when you interact with our website, use our tax calculation tools, subscribe to software utilities, or engage our Chartered Accountant services.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">2. Information We Collect</h2>
            <p>To accurately compute your tax liabilities, process statutory government e-filings, and provide business registrations, we collect the following categories of data:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li><strong>Contact Information:</strong> Full name, telephone/WhatsApp mobile number, residential address, and email address.</li>
              <li><strong>Identity & Statutory Credentials:</strong> Permanent Account Number (PAN), masked Aadhaar number, Date of Birth, Father&apos;s name, and Director Identification Number (DIN).</li>
              <li><strong>Income & Tax Documentation:</strong> Form 16, Form 26AS, Annual Information Statement (AIS), Taxpayer Information Summary (TIS), salary registers, rent receipts for HRA, bank account statements, capital gains statements, foreign stock holdings, and expense vouchers.</li>
              <li><strong>Corporate & Business Details:</strong> Trade name, GSTIN credentials, Certificate of Incorporation, Memorandum and Articles of Association (MOA/AOA), and business turnover sheets.</li>
              <li><strong>Technical & Usage Data:</strong> IP address, browser type, device identifiers, and session timestamps used solely to maintain platform security and prevent unauthorized access.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">3. Purpose of Processing and Data Utilization</h2>
            <p>We process your personal and sensitive data solely for legitimate and explicitly authorized purposes:</p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li>Preparing accurate income tax computations and e-filing statutory returns on the official Income Tax Department portal (<code>incometax.gov.in</code>).</li>
              <li>Submitting monthly, quarterly, and annual GST returns on the GSTN Portal (<code>gst.gov.in</code>).</li>
              <li>Processing company name approvals, incorporation forms, and DIN filings with the Ministry of Corporate Affairs (MCA).</li>
              <li>Responding to statutory notices, demand intimations under Section 143(1), defective return notices under Section 139(9), and audit inquiries.</li>
              <li>Communicating filing status, draft computation sheets, and official government ITR-V acknowledgements via WhatsApp, SMS, and Email.</li>
              <li>Issuing tax invoices, transaction receipts, and processing client refund requests.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">4. Payment Information & Security</h2>
            <p>
              When you purchase professional services or software tools on Tracconsultant, your financial transactions are handled with the highest standards of safety:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li><strong>No Storage of Sensitive Card Credentials:</strong> Tracconsultant does <strong>NOT store, capture, or retain</strong> your Credit/Debit Card CVV numbers, PINs, or Net Banking passwords on our servers.</li>
              <li><strong>RBI Authorized Gateways:</strong> Payments are processed directly through <strong>Reserve Bank of India (RBI) authorized, PCI-DSS Level 1 certified payment aggregators (such as Razorpay, UPI, and verified banking channels)</strong> utilizing end-to-end 256-bit encryption.</li>
              <li>Official tax receipts and transaction IDs are generated and logged in your secure dashboard upon transaction completion.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">5. Strict Non-Disclosure & Data Confidentiality</h2>
            <p>
              <strong>We maintain a zero-tolerance policy against the unauthorized sharing of client data.</strong> We will <strong>NEVER sell, lease, rent, monetize, or trade</strong> your personal or financial data to third-party marketing companies, insurance agencies, or data brokers.
            </p>
            <p>
              Data is disclosed strictly on a need-to-know basis to:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li>Assigned certified Chartered Accountants (ICAI members) bound by professional secrecy and confidentiality obligations.</li>
              <li>Government of India statutory portals (Income Tax Department, GSTN, MCA, Trademark Registry) solely for the purpose of executing the filing authorized by you.</li>
              <li>Law enforcement or judicial authorities only when explicitly required by a statutory court order or applicable law.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">6. Data Retention & Erasure Rights</h2>
            <p>
              We retain your tax and financial records for the statutory retention period mandated by Indian tax laws (typically 6-8 assessment years under the Income Tax Act, 1961). Upon expiration of this statutory period or upon client request (where permitted by law), documents are purged using secure digital shredding protocols.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">7. Cookies & Tracking Technologies</h2>
            <p>
              We use essential session cookies to authenticate logged-in users, maintain security during active filing workflows, and remember user preferences. We do not use intrusive cross-site tracking cookies. You may disable cookies in your browser settings, though certain interactive features of the client dashboard may function sub-optimally.
            </p>
          </section>

          {/* Grievance Officer Section - MANDATORY for Razorpay & Indian Law */}
          <section className="space-y-3 pt-2">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-emerald-600" />
              <span>8. Statutory Grievance Redressal Officer</span>
            </h2>
            <p>
              In accordance with the <strong>Information Technology Act, 2000</strong> and the Rules made thereunder, and the <strong>DPDP Act, 2023</strong>, the details of the designated Grievance Officer for Tracconsultant are provided below:
            </p>
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2 text-slate-800">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-500 block">Name of Grievance Officer:</span>
                  <strong className="text-slate-900 text-sm">CA Anjan Agarwal</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Designation:</span>
                  <strong className="text-slate-900">Principal Compliance Head & Grievance Officer</strong>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-500 block">Email Address:</span>
                  <a href="mailto:contact@tracconsultant.com" className="text-emerald-700 font-bold hover:underline">
                    contact@tracconsultant.com
                  </a>
                </div>
                <div>
                  <span className="text-slate-500 block">Direct Telephone:</span>
                  <a href="tel:+917275922162" className="text-slate-900 font-bold">
                    +91 7275922162
                  </a>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-200">
                <span className="text-slate-500 block">Registered Office Address:</span>
                <span className="text-slate-800 font-medium">
                  Tracconsultant Advisory, 2nd Floor, Civil Lines, Kanpur, Uttar Pradesh - 208001, India
                </span>
              </div>
              <p className="text-[11px] text-slate-500 pt-1">
                * Timelines: As per statutory requirements, grievances will be acknowledged within <strong>48 hours</strong> of receipt and resolved within <strong>30 days</strong>.
              </p>
            </div>
          </section>

        </div>

        {/* Footer Navigation */}
        <div className="pt-4 border-t border-slate-200 flex justify-between items-center text-xs">
          <Link href="/" className="text-emerald-700 font-bold hover:underline">&larr; Back to Home</Link>
          <div className="flex gap-4">
            <Link href="/terms-of-service" className="text-slate-600 hover:text-slate-900">Terms of Service</Link>
            <Link href="/refund-policy" className="text-slate-600 hover:text-slate-900">Refund Policy &rarr;</Link>
          </div>
        </div>

      </div>
    </div>
  );
}

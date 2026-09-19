import React from 'react';
import Link from 'next/link';
import { FileText, ShieldCheck, CreditCard, Scale, AlertCircle } from 'lucide-react';

export const metadata = {
  title: 'Terms of Service | Tracconsultant Tax Advisory & Compliance',
  description: 'Terms and conditions governing CA-assisted tax filing, notice scrutiny, business registration, and software utilities provided by Tracconsultant.'
};

export default function TermsOfServicePage() {
  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-md space-y-8">
        
        {/* Header */}
        <div className="border-b border-slate-200 pb-6 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">
            <Scale className="w-3.5 h-3.5 text-blue-600" />
            <span>Statutory Service Agreement & User Terms</span>
          </div>
          <h1 className="text-3xl font-black text-[#0B2545]">Terms of Service</h1>
          <p className="text-xs text-slate-500">Effective Date: May 2025 | Last Reviewed: September 2026</p>
        </div>

        {/* Content */}
        <div className="space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
          
          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">1. Acceptance of Terms</h2>
            <p>
              These Terms of Service (&ldquo;Terms&rdquo;) constitute a legally binding agreement between you (&ldquo;User&rdquo;, &ldquo;Client&rdquo;, or &ldquo;You&rdquo;) and <strong>Tracconsultant</strong> (&ldquo;Company&rdquo;, &ldquo;Platform&rdquo;, &ldquo;we&rdquo;, or &ldquo;us&rdquo;). By accessing our website, creating an account, engaging our Chartered Accountants for tax filings, or subscribing to our software tools, you agree to be bound by these Terms and our Privacy Policy, Refund Policy, and Shipping Policy.
            </p>
            <p>
              If you do not agree with any provision of these Terms, you must immediately refrain from utilizing our services.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">2. Scope of Services Offered</h2>
            <p>Tracconsultant operates an online technology platform facilitating professional corporate and tax compliance services, including:</p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li><strong>Income Tax Return (ITR) Filing:</strong> Preparation, review, computation optimization, and e-filing for salaried persons, freelancers, capital gains, crypto traders, and corporate entities.</li>
              <li><strong>GST Compliance:</strong> GST registration, monthly GSTR-1 and 3B returns, annual GSTR-9 returns, and LUT filings.</li>
              <li><strong>Tax Notices & Litigation:</strong> Analysis, advisory, and response drafting for intimations under Section 143(1), defective notices under 139(9), and reassessments under Section 148.</li>
              <li><strong>Corporate & Legal Registration:</strong> Company incorporation (Private Limited, OPC, LLP), Section 8 NGO trust registration, trademark filing, MSME/Udyam, and startup DPIIT registration.</li>
              <li><strong>SaaS Tax Utilities:</strong> Access to digital tools including PDF Redactor, Trial Balance to Balance Sheet generator, GSTR-2A reconciler, and JSON computation parsers.</li>
            </ul>
          </section>

          {/* Pricing & Payments clause - MANDATORY FOR PAYMENT GATEWAY */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-600" />
              <span>3. Pricing, Currency & Payment Terms</span>
            </h2>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li><strong>Currency Denomination:</strong> All prices, quotes, and subscriptions listed across our platform are denominated and billed in <strong>Indian Rupees (INR ₹)</strong>.</li>
              <li><strong>Transparent Pricing:</strong> The professional fees shown on service checkout include standard advisory fees. Any statutory government fees (such as MCA stamp duty, DIN approval fee, or GST challans) will be clearly bifurcated prior to payment.</li>
              <li><strong>Authorized Payment Gateways:</strong> You agree to remit payments solely through our secure payment channels, which include <strong>RBI-authorized payment gateways (e.g. Razorpay, UPI, BHIM, Net Banking, and Debit/Credit Cards)</strong>.</li>
              <li><strong>Taxes:</strong> Fees are subject to applicable Goods and Services Tax (GST at 18%) as required under Indian taxation laws. Official tax invoices with GSTIN details are generated upon successful payment.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">4. Client Responsibilities & Truthful Disclosures</h2>
            <p>
              To enable our Chartered Accountants to calculate accurate tax liabilities and claim maximum legitimate deductions:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li>You agree to provide true, current, and complete documents (Form 16, AIS, bank statements, ledger books).</li>
              <li>You acknowledge that Tracconsultant and its assigned CAs rely entirely on the veracity of the documents furnished by you.</li>
              <li>Tracconsultant shall not be held liable for tax penalties, interest, or prosecution arising from undisclosed income, concealed bank accounts, or fraudulent documentation supplied by the client.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">5. 100% Notice Protection Guarantee Scope</h2>
            <p>
              Our &ldquo;100% Notice Defense Guarantee&rdquo; applies exclusively to returns prepared and directly e-filed by Tracconsultant. If a clarification order under Section 143(1) or 139(9) arises due to computational discrepancies in a return we filed, our senior CA team will draft the formal rectification response at no additional advisory cost.
            </p>
            <p className="text-[11px] text-slate-500">
              * Exclusion: This protection does not apply to notices arising from undisclosed cash transactions, high-value purchases (SFT disclosures) not informed to us during filing, or returns filed by third parties.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">6. Third-Party Portals & Government Downtime</h2>
            <p>
              While we guarantee rapid turnaround times (such as 24-hour draft turnaround on salaried ITR), we are not responsible for delays caused by downtime, server crashes, or scheduled maintenance on official government portals (such as <code>incometax.gov.in</code>, <code>gst.gov.in</code>, or <code>mca.gov.in</code>).
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">7. Intellectual Property Rights</h2>
            <p>
              All proprietary algorithms, tax calculators, user interface designs, visual layouts, content, and software utilities on this website are the exclusive intellectual property of Tracconsultant. Unauthorized copying, scraping, reverse engineering, or resale of our interactive tools is strictly prohibited.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">8. Limitation of Liability</h2>
            <p>
              In no event shall Tracconsultant, its partners, Chartered Accountants, or affiliates be liable for indirect, incidental, or consequential damages resulting from your use of the platform. Our maximum cumulative liability for any claim arising under these terms shall not exceed the total advisory fee paid by the customer for that specific service order.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">9. Governing Law & Jurisdiction</h2>
            <p>
              These Terms of Service and any contractual transactions shall be governed by, interpreted, and construed in accordance with the laws of India. Any legal dispute or claim arising hereunder shall be subject to the exclusive jurisdiction of the competent courts located in <strong>Kanpur / Lucknow, Uttar Pradesh, India</strong>.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">10. Contact Information</h2>
            <p>For inquiries regarding these Terms of Service, contact our Legal Cell:</p>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1 text-slate-700">
              <p><strong>Tracconsultant Legal & Compliance Division</strong></p>
              <p>Email: <a href="mailto:contact@tracconsultant.com" className="text-emerald-700 font-medium">contact@tracconsultant.com</a></p>
              <p>Helpline: +91 7275922162 / +91 8052171196</p>
              <p>Registered Address: 2nd Floor, Civil Lines, Kanpur, Uttar Pradesh - 208001, India</p>
            </div>
          </section>

        </div>

        {/* Footer Navigation */}
        <div className="pt-4 border-t border-slate-200 flex justify-between items-center text-xs">
          <Link href="/privacy-policy" className="text-slate-600 hover:text-slate-900">&larr; Privacy Policy</Link>
          <div className="flex gap-4">
            <Link href="/shipping-policy" className="text-slate-600 hover:text-slate-900">Shipping Policy</Link>
            <Link href="/refund-policy" className="text-emerald-700 font-bold hover:underline">Refund Policy &rarr;</Link>
          </div>
        </div>

      </div>
    </div>
  );
}

const { jsPDF } = require('jspdf');
const fs = require('fs');
const path = require('path');

const doc = new jsPDF({
  orientation: 'portrait',
  unit: 'mm',
  format: 'a4'
});

const pageWidth = doc.internal.pageSize.getWidth();
const pageHeight = doc.internal.pageSize.getHeight();
const margin = 15;
const contentWidth = pageWidth - margin * 2;

function drawHeader(pageNum) {
  doc.setFillColor(11, 37, 69); // #0B2545 Deep Navy
  doc.rect(0, 0, pageWidth, 12, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text('TRACCONSULTANT — COMPLETE SYSTEM & OPERATIONS MANUAL', margin, 8);
  doc.text('CONFIDENTIAL & PROPRIETARY', pageWidth - margin - 45, 8);

  // Footer
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('https://tracconsultant.com  |  Senior CA Desk: +91 7275922162', margin, pageHeight - 7);
  doc.text(`Page ${pageNum}`, pageWidth - margin - 12, pageHeight - 7);
}

// -------------------------------------------------------------
// PAGE 1: COVER PAGE
// -------------------------------------------------------------
doc.setFillColor(11, 37, 69); // Deep Navy background
doc.rect(0, 0, pageWidth, pageHeight, 'F');

// Gold accent bar
doc.setFillColor(201, 147, 59); // #C9933B Gold
doc.rect(0, 0, 8, pageHeight, 'F');

// Subtle top tag
doc.setFont('helvetica', 'bold');
doc.setFontSize(10);
doc.setTextColor(5, 150, 105); // Emerald
doc.text('CHARTERED ACCOUNTANT COMPLIANCE & ADVISORY PLATFORM', 25, 45);

// Title
doc.setFont('helvetica', 'bold');
doc.setFontSize(28);
doc.setTextColor(255, 255, 255);
doc.text('TRACCONSULTANT', 25, 60);

doc.setFont('helvetica', 'bold');
doc.setFontSize(18);
doc.setTextColor(201, 147, 59); // Gold
doc.text('Complete System & Operations Manual', 25, 72);

doc.setFont('helvetica', 'normal');
doc.setFontSize(11);
doc.setTextColor(203, 213, 225); // Slate-300
doc.text('Comprehensive Guide to User Journeys, 20+ CA Services, Tools Suite,', 25, 84);
doc.text('Real-Time Filing Tracking, and Admin Control Center Operations.', 25, 90);

// Key Metric Boxes on Cover
doc.setFillColor(15, 23, 42); // Slate-900
doc.roundedRect(25, 110, 75, 32, 3, 3, 'F');
doc.setFont('helvetica', 'bold');
doc.setFontSize(8);
doc.setTextColor(148, 163, 184);
doc.text('APPLICABLE ASSESSMENT YEAR', 30, 120);
doc.setFontSize(13);
doc.setTextColor(255, 255, 255);
doc.text('AY 2025–26 / FY 2024–25', 30, 129);
doc.setFontSize(8);
doc.setTextColor(16, 185, 129);
doc.text('New Rs 75,000 Standard Deduction', 30, 136);

doc.setFillColor(15, 23, 42);
doc.roundedRect(105, 110, 75, 32, 3, 3, 'F');
doc.setFont('helvetica', 'bold');
doc.setFontSize(8);
doc.setTextColor(148, 163, 184);
doc.text('INSTITUTIONAL STANDARD', 110, 120);
doc.setFontSize(13);
doc.setTextColor(255, 255, 255);
doc.text('ICAI Code of Ethics', 110, 129);
doc.setFontSize(8);
doc.setTextColor(16, 185, 129);
doc.text('100% Notice Protection Guarantee', 110, 136);

// Table of Contents Preview
doc.setFillColor(15, 23, 42);
doc.roundedRect(25, 155, 155, 80, 3, 3, 'F');
doc.setFont('helvetica', 'bold');
doc.setFontSize(10);
doc.setTextColor(201, 147, 59);
doc.text('DOCUMENT INDEX & SECTION OUTLINE:', 32, 167);

const sections = [
  '1. Executive Positioning & Hybrid CA Model',
  '2. Customer Journey & 30-Second Fast Filing Form',
  '3. Real-Time Application Tracking System (/track)',
  '4. Complete Directory of All 20 CA Services',
  '5. Professional Compliance Tools Suite (Free & Paid)',
  '6. Executive Admin Control Center Manual (/admin)',
  '7. Technical Architecture, Security & Production Deployment'
];

doc.setFont('helvetica', 'normal');
doc.setFontSize(9);
doc.setTextColor(226, 232, 240);
sections.forEach((sec, idx) => {
  doc.text(sec, 32, 178 + idx * 7.5);
});

// Footer info on cover
doc.setFont('helvetica', 'normal');
doc.setFontSize(8);
doc.setTextColor(148, 163, 184);
doc.text('Live Domain: https://tracconsultant.com  |  Admin Portal: /admin', 25, 260);
doc.text('Prepared for Client Presentation & Internal Management', 25, 266);
doc.text('Version 2.4 | Updated September 2026', 25, 272);


// -------------------------------------------------------------
// PAGE 2: EXECUTIVE POSITIONING & USER JOURNEY
// -------------------------------------------------------------
doc.addPage();
drawHeader(2);

let y = 22;
doc.setFont('helvetica', 'bold');
doc.setFontSize(14);
doc.setTextColor(11, 37, 69);
doc.text('1. Executive Positioning & The Hybrid CA Model', margin, y);
y += 6;

doc.setFont('helvetica', 'normal');
doc.setFontSize(9);
doc.setTextColor(51, 65, 85);
const p1 = "Tracconsultant (tracconsultant.com) is an institutional-grade, Chartered Accountant-assisted tax and regulatory advisory portal. Traditional DIY tax apps use automated bots that frequently miscalculate complex capital gains, omit HRA/80D deductions, and trigger scrutiny notices. Tracconsultant combines modern fintech speed (30-second intake, encrypted vault) with manual double-verification by qualified Chartered Accountants adhering to ICAI standards and offering 100% Notice Protection.";
doc.text(doc.splitTextToSize(p1, contentWidth), margin, y);
y += 18;

doc.setFont('helvetica', 'bold');
doc.setFontSize(14);
doc.setTextColor(11, 37, 69);
doc.text('2. End-to-End Customer Flow & Filing Wizard', margin, y);
y += 6;

const steps = [
  {
    title: 'Step 1: Elite Fintech Landing & Service Discovery',
    desc: 'The client lands on the homepage with clean typography and an interactive console showing live tax savings (+Rs 34,800), live CA desk availability, and Form 16 drag-and-drop. Client can start filing in 1-click or chat directly on WhatsApp.'
  },
  {
    title: 'Step 2: 30-Second Fast-Track Filing Form (#file-now)',
    desc: 'Clients choose their exact service (ITR-1 Salaried Rs 499, Stocks/Crypto Rs 1,999, Notice Rs 999, GST Rs 799/mo). They enter basic contact details (Name, WhatsApp Mobile, Email, PAN) and securely upload Form 16/AIS to the encrypted vault.'
  },
  {
    title: 'Step 3: Instant Tracconsultant Reference ID & WhatsApp Handshake',
    desc: 'Upon submission, the client receives a unique Reference ID (e.g. TRAC-2026-4819). An automated WhatsApp confirmation message connects them to the Senior CA Panel within 15 minutes.'
  },
  {
    title: 'Step 4: Manual Senior CA Computation & Draft Approval',
    desc: 'A qualified Chartered Accountant reconciles Form 16 against AIS, TIS, and Form 26AS, optimizes Old vs New regime, and prepares a draft calculation sheet. The draft is sent to the client on WhatsApp for review.'
  },
  {
    title: 'Step 5: Government Portal E-Filing & Guaranteed ITR-V Delivery',
    desc: 'Once approved, the return is filed directly on the Income Tax Department portal. Official ITR-V acknowledgment is generated and archived in the client dossier with zero scrutiny anxiety.'
  }
];

steps.forEach((s) => {
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(margin, y, contentWidth, 18, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(11, 37, 69);
  doc.text(s.title, margin + 4, y + 5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text(doc.splitTextToSize(s.desc, contentWidth - 8), margin + 4, y + 10);
  y += 21;
});

// Real-Time Tracking section
y += 3;
doc.setFont('helvetica', 'bold');
doc.setFontSize(14);
doc.setTextColor(11, 37, 69);
doc.text('3. Real-Time Application Tracking System (/track)', margin, y);
y += 6;

doc.setFont('helvetica', 'normal');
doc.setFontSize(8.5);
doc.setTextColor(51, 65, 85);
const pTrack = "Clients can track their live status 24/7 by simply entering their 10-digit mobile number or Application ID (e.g. TRAC-2026-4819). The system displays masked privacy details (e.g. Rahul S***, 98******10), estimated tax refund amount, assigned CA profile with direct WhatsApp button, and a real-time 5-stage milestone timeline updated dynamically from the Admin Portal.";
doc.text(doc.splitTextToSize(pTrack, contentWidth), margin, y);


// -------------------------------------------------------------
// PAGE 3: ALL 20 CA SERVICES DIRECTORY
// -------------------------------------------------------------
doc.addPage();
drawHeader(3);

y = 22;
doc.setFont('helvetica', 'bold');
doc.setFontSize(14);
doc.setTextColor(11, 37, 69);
doc.text('4. Directory of All 20 Chartered Accountant Services', margin, y);
y += 5;

doc.setFont('helvetica', 'normal');
doc.setFontSize(8);
doc.setTextColor(71, 85, 105);
doc.text('All services are fully documented with dedicated pages, dynamic SEO metadata, and admin CRM routing.', margin, y);
y += 6;

const servicesTable = [
  ['#', 'Service Name', 'Category', 'TAT', 'Price', 'Core Deliverable'],
  ['1', 'ITR Filing', 'Tax', '24-48h', 'Rs 999', 'Salaried, Traders, Crypto, NRIs, 100% Notice Defense'],
  ['2', 'Company / LLP Setup', 'Corporate', '5-7 Days', 'Rs 4,999', 'SPICe+ MCA filing, 2 DSC, DIN, MOA/AOA, PAN, TAN, MSME'],
  ['3', 'GST Services & Filing', 'GST', 'Same Day', 'Rs 799/mo', 'GSTR-1, 3B, GSTR-2B ITC matching, LUT Export Filing'],
  ['4', 'Tax Notice & Scrutiny', 'Tax', '24-48h', 'Rs 1,999', 'Legal response to 143(1), 148, 139(9), CIT Appeals'],
  ['5', 'Trademark (TM/R)', 'Legal', '24h to TM', 'Rs 2,499', 'Brand name & logo IP India filing, 50% MSME rebate'],
  ['6', 'Tax Planning & Advisory', 'Wealth', '3 Days', 'Rs 2,499', 'Legitimate tax restructuring under 80C, 80D, 54EC, 115BAC'],
  ['7', 'Trust & NGO Incorporation', 'Corporate', '10-15 Days', 'Rs 7,999', 'Charitable Trust deed, Sub-Registrar execution, 12A/80G'],
  ['8', 'Bookkeeping & Accounts', 'Accounting', 'Monthly', 'Rs 2,999/mo', 'Tally/Zoho ledger maintenance, P&L, Balance Sheet sync'],
  ['9', 'Capital Gains Advisory', 'Wealth', '24-48h', 'Rs 2,499', 'Property sales, Stocks, Crypto, Sec 54/54EC exemptions'],
  ['10', 'FSSAI Food License', 'Licenses', '3-5 Days', 'Rs 1,499', 'FoSCoS 14-digit license for FMCG, Swiggy, Zomato'],
  ['11', 'ISO Certifications', 'Licenses', '4-7 Days', 'Rs 4,999', 'ISO 9001, 27001, 14001 SOP documentation & IAF audit'],
  ['12', 'RSU & Foreign Stock Tax', 'Wealth', '48 Hours', 'Rs 2,999', 'Schedule FA, Form 67 FTC, US stock double-tax relief'],
  ['13', 'EPF & ESI Compliance', 'Payroll', '2-3 Days', 'Rs 1,999/mo', 'EPFO/ESIC registrations, monthly ECR challans, UAN link'],
  ['14', 'Class 3 DSC Services', 'Licenses', '30 Mins', 'Rs 1,299', 'FIPS cryptographic USB token, paperless Video KYC'],
  ['15', 'Partnership Deeds', 'Corporate', '2-3 Days', 'Rs 3,499', 'Remuneration clause 40(b), ROF filing, Partnership PAN'],
  ['16', 'MSME / Udyam Certificate', 'Corporate', 'Same Day', 'Rs 799', 'Lifetime valid certificate, collateral-free loan eligibility'],
  ['17', 'Startup India DPIIT', 'Corporate', '5-7 Days', 'Rs 4,999', 'DPIIT recognition, 3-year Section 80-IAC tax holiday'],
  ['18', 'TDS Return Filing', 'Tax', '24-48h', 'Rs 1,499/qtr', 'Form 24Q, 26Q, 27Q, FVU token, TRACES Form 16 download'],
  ['19', 'CMA Bank Reports', 'Finance', '3-5 Days', 'Rs 4,999', '5-7 yr projections, MPBF, DSCR bank-compliant models'],
  ['20', 'Business Loans Advisory', 'Finance', '7-14 Days', '1% Success', 'CC, OD, Term loans, lowest interest rate bank negotiation']
];

// Draw Table
const colWidths = [8, 42, 22, 18, 22, 68];
servicesTable.forEach((row, rIdx) => {
  const isHeader = rIdx === 0;
  doc.setFillColor(isHeader ? 11 : (rIdx % 2 === 0 ? 248 : 255), isHeader ? 37 : (rIdx % 2 === 0 ? 250 : 255), isHeader ? 69 : (rIdx % 2 === 0 ? 252 : 255));
  doc.rect(margin, y, contentWidth, 8, 'F');
  
  doc.setFont('helvetica', isHeader ? 'bold' : 'normal');
  doc.setFontSize(isHeader ? 7.5 : 7);
  doc.setTextColor(isHeader ? 255 : 30, isHeader ? 255 : 41, isHeader ? 255 : 59);
  
  let curX = margin;
  row.forEach((cell, cIdx) => {
    doc.text(cell, curX + 2, y + 5.5);
    curX += colWidths[cIdx];
  });
  y += 8.2;
});


// -------------------------------------------------------------
// PAGE 4: PROFESSIONAL TOOLS SUITE (FREE & PAID)
// -------------------------------------------------------------
doc.addPage();
drawHeader(4);

y = 22;
doc.setFont('helvetica', 'bold');
doc.setFontSize(14);
doc.setTextColor(11, 37, 69);
doc.text('5. Professional Compliance Tools Suite (/tools)', margin, y);
y += 6;

doc.setFont('helvetica', 'normal');
doc.setFontSize(8.5);
doc.setTextColor(51, 65, 85);
doc.text('Tracconsultant includes 8 specialized financial and audit engines divided into 3 Free Tools and 5 Paid Professional Utilities.', margin, y);
y += 10;

// Free tools block
doc.setFillColor(236, 253, 245); // Emerald-50
doc.roundedRect(margin, y, contentWidth, 48, 3, 3, 'F');
doc.setFont('helvetica', 'bold');
doc.setFontSize(11);
doc.setTextColor(5, 150, 105);
doc.text('A. Free Financial Calculators (Zero Login / Public Access)', margin + 5, y + 8);

const freeTools = [
  { name: '1. HRA Exemption Calculator (/tools/hra-calculator)', desc: 'Calculates maximum tax exemption under Section 10(13A). Metro (50%) vs Non-Metro (40%) side-by-side comparison with instant printable summary.' },
  { name: '2. Advance Tax Calculator (/tools/advance-tax-calculator)', desc: 'Estimates 4 quarterly advance tax installment deadlines (June, Sept, Dec, March) and guards against Section 234B & 234C interest penalties.' },
  { name: '3. Old vs New Tax Regime Comparison (/tools/tax-calculator)', desc: 'Updated for AY 2025-26 Budget. Side-by-side comparison with Rs 75,000 standard deduction, Section 87A rebate, and optimal regime recommendation.' }
];

let toolY = y + 16;
freeTools.forEach(t => {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text(t.name, margin + 5, toolY);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text(t.desc, margin + 5, toolY + 4);
  toolY += 10;
});

y += 56;

// Paid tools block
doc.setFillColor(238, 242, 255); // Indigo-50
doc.roundedRect(margin, y, contentWidth, 80, 3, 3, 'F');
doc.setFont('helvetica', 'bold');
doc.setFontSize(11);
doc.setTextColor(67, 56, 202);
doc.text('B. Paid Professional Utilities (Auditor & CA Grade)', margin + 5, y + 8);

const paidTools = [
  { name: '4. PDF Redact & Sensitive Data Masking (/tools/pdf-redactor) - Rs 199', desc: 'DPDP Act 2023 compliant. Automatically masks PAN, first 8 digits of Aadhaar, bank account numbers, and signatures before sharing PDFs.' },
  { name: '5. Trial Balance to Schedule III Balance Sheet & P&L (/tools/tb-to-balancesheet) - Rs 299', desc: 'Automated grouping engine converting raw ledger Excel/CSV into Schedule III Balance Sheet and Profit & Loss statement with variance control.' },
  { name: '6. GSTR-2A vs Books Reconciliation Engine (/tools/gstr2a-reconciliation) - Rs 299', desc: '4-way automated matching of purchase registers with GST 2A/2B portal records. Detects missing invoices, vendor defaults, and ITC leakage.' },
  { name: '7. JSON to Tax Computation Sheet Formatter (/tools/json-to-computation) - Rs 199', desc: 'Converts official Income Tax Department JSON utilities into clean, executive tax computation sheets formatted for clients and bank loan files.' },
  { name: '8. GSTR-2A Cleaner & Supplier Summary (/tools/gstr2a-cleaner) - Rs 199', desc: 'Consolidates messy multi-sheet GST downloads into single-sheet vendor-wise summaries showing GSTIN, trade name, and filing compliance.' }
];

let pToolY = y + 16;
paidTools.forEach(t => {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text(t.name, margin + 5, pToolY);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text(t.desc, margin + 5, pToolY + 4);
  pToolY += 12;
});


// -------------------------------------------------------------
// PAGE 5: ADMIN CONTROL CENTER OPERATING MANUAL
// -------------------------------------------------------------
doc.addPage();
drawHeader(5);

y = 22;
doc.setFont('helvetica', 'bold');
doc.setFontSize(14);
doc.setTextColor(11, 37, 69);
doc.text('6. Executive Admin Control Center Manual (/admin)', margin, y);
y += 6;

doc.setFont('helvetica', 'normal');
doc.setFontSize(8.5);
doc.setTextColor(51, 65, 85);
doc.text('The Admin Portal (https://tracconsultant.com/admin) is a dedicated command center for managing CAs, operations, orders, and clients.', margin, y);
y += 10;

const adminSections = [
  {
    title: 'A. Authentication & Security Gate',
    text: 'Access at /admin requires PIN verification (default passcodes: admin123, trac2025, admin, tracconsultant). Sessions are protected by 256-Bit SSL with automatic token persistence.'
  },
  {
    title: 'B. Real-Time Executive KPI Metric Cards',
    text: 'Top summary cards display: Total Filings (active cases), Registered Clients (Google/Email accounts), Paid Tool Revenue (gross rupee sales), Service Inquiries (CRM leads), and Completed/Filed (ITR-V verified returns).'
  },
  {
    title: 'C. Tab 1: 20 Services Filings Management',
    text: 'Comprehensive table of all client submissions. Filter by service or status (New, Under Review, CA Assigned, Draft Ready, Filed). Click any row to open the Lead Drawer: download uploaded Form 16/docs, assign lead CA, update estimated tax refund, and log internal notes. Includes 1-click Export to CSV.'
  },
  {
    title: 'D. Tab 2: Paid Tools & Subscriptions Control',
    text: 'Monitors all digital tool orders with transaction ID, client details, amount, and payment mode. Admins can toggle access (active/revoked) or grant free tool licenses to any client manually.'
  },
  {
    title: 'E. Tab 3: Client Accounts Management',
    text: 'Lists registered user accounts, authentication providers (Email or Google OAuth), and active unlocked tools per user.'
  },
  {
    title: 'F. Tab 4: Consultation Leads CRM',
    text: 'Captures inquiries from contact forms and service pages. Track status from New to Contacted and Converted with internal sales notes.'
  },
  {
    title: 'G. Tab 5: WhatsApp Automation & Message Templates',
    text: 'Pre-configured templates with dynamic placeholders ({client_name}, {service}, {application_id}) for Welcome, Missing Docs, Draft Ready, and Filing Complete alerts.'
  },
  {
    title: 'H. Tab 6: Rates & Annual Pricing Engine',
    text: 'Allows instant adjustment of Union Budget tax rates, standard deductions, and base pricing across all 20 services without modifying code.'
  }
];

adminSections.forEach(sec => {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(11, 37, 69);
  doc.text(sec.title, margin, y);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text(doc.splitTextToSize(sec.text, contentWidth), margin, y + 4.5);
  y += 18;
});


// -------------------------------------------------------------
// PAGE 6: TECHNICAL STACK & PRODUCTION DEPLOYMENT
// -------------------------------------------------------------
doc.addPage();
drawHeader(6);

y = 22;
doc.setFont('helvetica', 'bold');
doc.setFontSize(14);
doc.setTextColor(11, 37, 69);
doc.text('7. Technical Architecture, Security & Production Deployment', margin, y);
y += 8;

const techItems = [
  { label: 'Frontend Framework', val: 'Next.js 16.3.4 (App Router, Turbopack, React 19, Tailwind CSS v4)' },
  { label: 'Language & Typing', val: 'TypeScript 5 (Strict Mode, 100% typechecked on production builds)' },
  { label: 'Database Architecture', val: 'High-speed encrypted JSON store with automatic UTF-8 BOM sanitization (safeReadJSON)' },
  { label: 'Security & Privacy', val: '256-Bit SSL/TLS bank-grade encryption, DPDP Act 2023 compliance, public tracking data masking' },
  { label: 'Live Server & Hosting', val: 'Hostinger Node.js Application / hPanel with Node.js v24 runtime' },
  { label: 'Continuous Delivery', val: 'GitHub Repository: https://github.com/MohammadHamza2518/tracconsultant (branch: main)' },
  { label: 'Standalone Deploy Bundle', val: 'hostinger-deploy.zip (~13 MB) pre-bundled with static chunks and zero external dependencies' },
  { label: 'SEO & Search Engine Index', val: 'Dynamic sitemap.xml, robots.txt, Google Search Console verified, rich JSON-LD schemas' }
];

techItems.forEach(item => {
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, y, contentWidth, 12, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(11, 37, 69);
  doc.text(item.label + ':', margin + 4, y + 5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text(item.val, margin + 4, y + 9.5);
  y += 15;
});

y += 10;
// Sign-off box
doc.setFillColor(11, 37, 69);
doc.roundedRect(margin, y, contentWidth, 45, 3, 3, 'F');
doc.setFont('helvetica', 'bold');
doc.setFontSize(11);
doc.setTextColor(201, 147, 59); // Gold
doc.text('TRACCONSULTANT OPERATIONS & EXECUTIVE SIGN-OFF', margin + 8, y + 10);

doc.setFont('helvetica', 'normal');
doc.setFontSize(8.5);
doc.setTextColor(226, 232, 240);
doc.text('This manual constitutes the complete architectural and operational specification of Tracconsultant.', margin + 8, y + 18);
doc.text('For client demonstrations, platform administration, or technical inquiries:', margin + 8, y + 24);

doc.setFont('helvetica', 'bold');
doc.setFontSize(9);
doc.setTextColor(16, 185, 129); // Emerald
doc.text('Direct CA Helpline: +91 7275922162  |  Support: +91 8052171196  |  contact@tracconsultant.com', margin + 8, y + 33);
doc.text('Live Production URL: https://tracconsultant.com  |  Admin Console: /admin', margin + 8, y + 39);

// Save PDF
const outPath = path.join(__dirname, '..', 'public', 'Tracconsultant_Platform_Manual.pdf');
doc.save(outPath);
console.log('✅ PDF generated successfully at:', outPath);

export interface ToolConfig {
  id: string;
  name: string;
  slug: string;
  category: 'free' | 'paid';
  price: number;
  badge?: string;
  description: string;
  shortDesc: string;
  icon: string;
  tags: string[];
  features: string[];
}

export interface ServiceConfig {
  id: string;
  number: number;
  title: string;
  slug: string;
  category: 'income_tax' | 'gst' | 'corporate_legal' | 'accounting_cma' | 'advisory_wealth' | 'licenses_certifications';
  categoryLabel: string;
  shortDesc: string;
  longDesc: string;
  subServices?: string[];
  startingPrice: string;
  tat: string; // Turnaround time
  documentsRequired: string[];
  highlights: string[];
}

export const TOOLS_LIST: ToolConfig[] = [
  // 1. E-Commerce GSTR-1 & TCS Generator (Featured)
  {
    id: 'ecommerce-gst-converter',
    name: 'E-Commerce GSTR-1 & TCS Generator',
    slug: 'ecommerce-gst-converter',
    category: 'free',
    price: 0,
    badge: 'NEW FREE',
    shortDesc: 'Instant Amazon MTR, Flipkart, Meesho sales to Table 7 B2CS JSON & Sec 52 TCS audit.',
    description: 'Convert messy marketplace order sheets into official government portal uploadable Table 7 B2CS JSON. Automatic Place of Supply aggregation, sales return deductions, and 1% TCS Section 52 audit.',
    icon: 'ShoppingCart',
    tags: ['E-Commerce', 'Amazon MTR', 'Flipkart GSTR', 'Meesho', 'GSTR-1 JSON', 'TCS Sec 52'],
    features: [
      'Multi-Marketplace: Amazon MTR, Flipkart, Meesho & CSV',
      'Table 7 B2CS State-wise Place of Supply consolidation',
      'Automatic deduction of return & cancelled orders',
      'Section 52 TCS 1% reconciliation ledger',
      'Direct Gov GST Portal offline JSON export',
      '100% Client-side local processing — zero data leaves browser'
    ]
  },

  // 2. GSTIN Search & Verification (Taxpayer Profile & Compliance PDF)
  {
    id: 'gstin-search',
    name: 'GSTIN Search & Verification Tool',
    slug: 'gstin-search',
    category: 'free',
    price: 0,
    badge: 'FREE PDF',
    shortDesc: 'Verify any 15-digit GSTIN, legal name, trade name, PAN breakdown & download verified A4 PDF report.',
    description: 'Instant taxpayer verification engine. Validate 15-digit GSTIN structure, business registration details, 6-month GSTR-1/3B filing compliance, and export official stamped A4 compliance report.',
    icon: 'ShieldCheck',
    tags: ['GSTIN Search', 'GST Verification', 'Taxpayer Profile', 'PDF Report', 'Compliance'],
    features: [
      '15-digit GSTIN structural breakdown & state code lookup',
      'PAN extraction & entity constitution classification',
      'Legal Business Name, Trade Name & Principal Address',
      '6-Month GSTR-1 & GSTR-3B return compliance history',
      '1-Click Official Taxpayer Verification A4 PDF download',
      'Complete 38 State & Union Territory GST directory'
    ]
  },

  // 3. HSN & SAC Code Search Tool
  {
    id: 'hsn-search',
    name: 'HSN & SAC Code Search Tool',
    slug: 'hsn-search',
    category: 'free',
    price: 0,
    badge: 'UPDATED',
    shortDesc: 'Fast search across 150+ Goods HSN & Services SAC codes with applicable GST tax slabs.',
    description: 'Find official 2, 4, 6 or 8-digit HSN codes for goods and 99-series SAC codes for services. Filter by GST tax rates (0%, 5%, 12%, 18%, 28%) and copy codes instantly.',
    icon: 'Hash',
    tags: ['HSN Codes', 'SAC Codes', 'GST Rates', 'Tax Slabs', 'E-Commerce'],
    features: [
      'Fast keyword & code search across Goods & Services',
      'Accurate GST rates: 0%, 5%, 12%, 18% & 28%',
      'Chapter & Heading categorization',
      'Popular keywords tagging for e-commerce products',
      '1-Click copy code with instant confirmation',
      'Direct link to E-Commerce GST converter & invoicing'
    ]
  },

  // 4. Capital Gain Calculator (LTCG & STCG - Budget 2024 Updated)
  {
    id: 'capital-gain-calculator',
    name: 'Capital Gain Tax Calculator (LTCG & STCG)',
    slug: 'capital-gain-calculator',
    category: 'free',
    price: 0,
    badge: 'BUDGET 2024',
    shortDesc: 'Compute LTCG & STCG on Shares, Property, Gold & Mutual Funds with latest 12.5% & 20% rates.',
    description: 'Advanced Capital Gains Tax calculator reflecting Union Budget 2024 amendments. Features listed equity 12.5% LTCG & 20% STCG, ₹1.25L exemption, real estate 12.5% vs 20% with CII dual comparison, Section 54/54EC exemptions & instant computation PDF.',
    icon: 'TrendingUp',
    tags: ['Capital Gains', 'LTCG', 'STCG', 'Budget 2024', 'Shares', 'Real Estate', 'Section 54'],
    features: [
      'Union Budget 2024 updated: 12.5% LTCG & 20% STCG',
      'Increased ₹1,25,000 equity exemption u/s 112A',
      'Real Estate Dual Option: 12.5% without indexation vs 20% with CII comparison',
      'Section 54, 54EC (Bonds) & 54F tax reinvestment deductions',
      'Complete CBDT Cost Inflation Index (CII) table (2001 to 2025)',
      '1-Click Official Capital Gains Computation PDF export'
    ]
  },

  // 8 FREE & BASIC TOOLS
  {
    id: 'hra-calculator',
    name: 'HRA Exemption Tool',
    slug: 'hra-calculator',
    category: 'free',
    price: 0,
    badge: '100% Free',
    shortDesc: 'Calculate maximum tax exemption on House Rent Allowance under Section 10(13A).',
    description: 'Instant legal calculation comparing Metro (50%) vs Non-Metro (40%), rent paid minus 10% basic salary, and actual HRA received with printable summary.',
    icon: 'Calculator',
    tags: ['Salaried', 'Section 10(13A)', 'Tax Exemption'],
    features: ['Instant calculation u/s 10(13A)', 'Metro vs Non-Metro switch', 'Tax slab savings estimate', 'Zero registration required']
  },
  {
    id: 'advance-tax-calculator',
    name: 'Advance Tax Tool',
    slug: 'advance-tax-calculator',
    category: 'free',
    price: 0,
    badge: '100% Free',
    shortDesc: 'Quarterly Advance Tax payment schedule & interest penalty estimator u/s 234B & 234C.',
    description: 'Determine your 4-installment tax liability (June 15, Sept 15, Dec 15, March 15) to avoid hefty interest penalties.',
    icon: 'Calendar',
    tags: ['Business', 'Freelancers', 'Section 208'],
    features: ['All 4 quarterly deadlines', 'Section 234B & 234C interest guard', 'Net tax liability breakdown', 'Direct IT challan link guidance']
  },
  {
    id: 'tax-calculator',
    name: 'Income Tax Computation Tool (Budget FY 2024–25)',
    slug: 'tax-calculator',
    category: 'free',
    price: 0,
    badge: 'Budget Updated',
    shortDesc: 'Side-by-side comparison of Old vs New Tax Regime with ₹75,000 standard deduction.',
    description: 'Live tax comparison reflecting the latest Union Budget updates including new slabs, Section 87A rebate, 80C/80D deductions, and optimal regime recommendation.',
    icon: 'TrendingUp',
    tags: ['Income Tax', 'Budget 2024-25', 'Regime Comparison'],
    features: ['Side-by-side comparison', 'Updated ₹75,000 standard deduction', 'Rebate u/s 87A up to ₹7.75 Lakhs', 'Instant PDF tax summary']
  },
  {
    id: 'pdf-redactor',
    name: 'PDF Redact & Sensitive Data Masking Tool',
    slug: 'pdf-redactor',
    category: 'free',
    price: 0,
    badge: 'Basic',
    shortDesc: 'Mask PAN, Aadhaar (first 8 digits), bank account numbers & signatures before sharing tax PDFs.',
    description: 'Compliant with DPDP Act 2023. Client-side privacy tool enabling CA firms, businesses, and individuals to safely sanitize Form 16, Bank Statements, and ITR acknowledgments.',
    icon: 'EyeOff',
    tags: ['Basic', 'Data Privacy', 'DPDP Act', 'PDF Masking'],
    features: ['Auto-detects PAN & Aadhaar numbers', 'Preset Form 16 & Bank templates', 'Irreversible data masking (no leak)', 'Watermark protection']
  },
  {
    id: 'tb-to-balancesheet',
    name: 'Trial Balance to Balance Sheet & P&L Formatter',
    slug: 'tb-to-balancesheet',
    category: 'free',
    price: 0,
    badge: 'Basic',
    shortDesc: 'Convert raw Trial Balance ledger Excel/CSV directly into Schedule III Balance Sheet and P&L.',
    description: 'Automated grouping engine that maps ledgers into Current/Non-Current Assets, Liabilities, Revenue from Operations, and Depreciation with balanced accounting controls.',
    icon: 'FileSpreadsheet',
    tags: ['Basic', 'Schedule III', 'Accounting', 'Balance Sheet'],
    features: ['Excel/CSV drag-and-drop', 'Automatic Schedule III grouping', 'Variance & Balance verification', 'Downloadable formatted Excel & PDF']
  },
  {
    id: 'gstr2a-reconciliation',
    name: 'GSTR-2A vs Books Reconciliation Engine',
    slug: 'gstr2a-reconciliation',
    category: 'free',
    price: 0,
    badge: 'Basic',
    shortDesc: '4-way automated matching of Books Purchase Register with GST Portal 2A/2B records.',
    description: 'Eliminate ITC leakage. Identifies exact matches, invoice number/date mismatches, missing in 2A (supplier defaulting), and excess claims with an audit-ready summary.',
    icon: 'GitCompare',
    tags: ['Basic', 'GST Audit', 'ITC Leakage', 'Rule 36(4)'],
    features: ['Matches JSON & Excel files', 'Flags defaulting vendors missing in 2A', 'Tax amount discrepancy detection', 'Audit reconciliation report download']
  },
  {
    id: 'json-to-computation',
    name: 'Upload JSON & Get Tax Computation Sheet',
    slug: 'json-to-computation',
    category: 'free',
    price: 0,
    badge: 'Basic',
    shortDesc: 'Extract and format official ITR JSON utility files into a clean executive computation report.',
    description: 'Upload your government utility JSON file and instantly receive an executive Tax Computation Sheet with income heads, deductions, TDS verification, and refund calculation.',
    icon: 'FileCode2',
    tags: ['Basic', 'ITR JSON', 'Computation Sheet', 'Tax Audit'],
    features: ['Parses ITR-1, 2, 3, 4 JSON', 'Clean client-facing layout', 'TDS & 26AS matching breakdown', 'Printable & exportable computation']
  },
  {
    id: 'gstr2a-cleaner',
    name: 'Clean GSTR-2A & Supplier-Wise Summary',
    slug: 'gstr2a-cleaner',
    category: 'free',
    price: 0,
    badge: 'Basic',
    shortDesc: 'Filter duplicates, organize messy 2A records, and build consolidated supplier ITC sheets.',
    description: 'Transforms multi-sheet, clunky government portal files into clean, supplier-wise aggregated summaries showing GSTIN, trade name, eligible tax, and filing status.',
    icon: 'Sparkles',
    tags: ['Basic', 'GSTR-2A', 'Supplier Summary', 'Excel Automation'],
    features: ['Removes duplicate & cancelled records', 'Aggregates by Vendor GSTIN', 'Calculates eligible vs ineligible ITC', 'Export clean single-sheet Excel']
  },

  // 4 NEW PAID / ADVANCE / PRO TOOLS
  {
    id: 'advanced-pdf-redactor',
    name: 'PDF Redactor Studio (Advance)',
    slug: 'advanced-pdf-redactor',
    category: 'paid',
    price: 299,
    badge: 'Advance',
    shortDesc: 'Advanced local PDF redactor with "Redact Selected" & "Keep Selected" modes, auto-search text, and page batching.',
    description: 'Professional browser-based redaction workstation. Supports inverse redaction (black out everything except kept boxes), keyword search & auto-mark, per-page controls, zoom, and vector flattening.',
    icon: 'EyeOff',
    tags: ['Advance', 'DPDP Act', 'Keep & Redact', 'PDF Security'],
    features: ['Redact Selected & Keep Selected modes', 'Auto-search & highlight sensitive text', 'Per-page undo & clear controls', 'Permanent rasterized vector flattening']
  },
  {
    id: 'advanced-computation-generator',
    name: 'Computation of Income Generator (Advance)',
    slug: 'advanced-computation-generator',
    category: 'paid',
    price: 299,
    badge: 'Advance',
    shortDesc: 'Bank / Visa / Loan submission computation sheet generator with deep ITR 1-7 JSON parser.',
    description: 'Executive Tax Computation Sheet generator with deep JSON scanning for ITR-1 through ITR-7, head-wise deduction breakdown, Chapter VI-A verification, and audit-ready vector PDF export.',
    icon: 'FileCode2',
    tags: ['Advance', 'ITR 1-7', 'Loan Proof', 'Tax Computation'],
    features: ['Full ITR 1 to 7 JSON deep scanning', 'All 5 heads with deduction sub-tables', 'Vector PDF download with auto-tables', 'Save & load draft configurations']
  },
  {
    id: 'file-compressor',
    name: 'Smart PDF & Image Compressor',
    slug: 'file-compressor',
    category: 'paid',
    price: 199,
    badge: 'Pro',
    shortDesc: 'Local compression bench for PDF, JPEG, PNG, WebP with in-place embedded photo downscale.',
    description: 'Compress large tax documents and scans to meet government portal upload limits. In-place re-encoding of embedded images in PDFs, multi-threaded Web Workers, and bulk ZIP download.',
    icon: 'FileArchive',
    tags: ['Pro', 'PDF Compressor', 'Image Bench', 'Portal Ready'],
    features: ['In-place PDF photo downscaling', 'Lossless WebP & JPEG image optimizer', 'Batch queue with live savings gauge', 'Bulk ZIP archive export']
  },
  {
    id: 'gst-invoice-generator',
    name: 'GST Tax Invoice & E-Way Generator',
    slug: 'gst-invoice-generator',
    category: 'paid',
    price: 299,
    badge: 'Pro',
    shortDesc: 'Professional Indian GST Invoice Generator with automated CGST/SGST/IGST inter/intra-state engine.',
    description: 'Complete Indian GST compliant billing software with HSN/SAC summary, reverse charge support, client/product directory, round-off calculation, and crisp A4 PDF generation.',
    icon: 'Receipt',
    tags: ['Pro', 'GST Compliance', 'E-Way Ready', 'Tax Invoice'],
    features: ['Auto Inter-State (IGST) vs Intra-State (CGST+SGST)', 'HSN summary & Indian number-to-words', 'Client & product master directory in browser', 'Instant A4 vector print & PDF export']
  }
];

export const SERVICES_LIST: ServiceConfig[] = [
  // 1. ITR Filing
  {
    id: 'itr-filing',
    number: 1,
    title: 'ITR Filing',
    slug: 'itr-filing',
    category: 'income_tax',
    categoryLabel: 'Income Tax & Legal Appeals',
    shortDesc: 'Expert CA filing for Salaried, Freelancers, Capital Gains (Stocks/Crypto), Business (44AD), and NRIs.',
    longDesc: 'Complete tax computation with 100% maximum refund assurance, AIS/TIS reconciliation, Chapter VI-A deduction optimization, and post-filing e-verification.',
    startingPrice: '₹999',
    tat: '24-48 Hours',
    documentsRequired: ['PAN Card & Aadhaar Card', 'Form 16 / 16A', 'Bank Account Statements (all active)', 'Capital Gain statements (Zerodha/Groww/CAMS if applicable)'],
    highlights: ['100% Notice Protection guarantee', 'Senior CA supervised computation', 'Max refund calculation with AIS match', 'Instant ITR-V acknowledgment']
  },

  // 2. Company Incorporation / LLP
  {
    id: 'company-incorporation',
    number: 2,
    title: 'Company Incorporation / LLP',
    slug: 'company-incorporation',
    category: 'corporate_legal',
    categoryLabel: 'Business Setup & Corporate',
    shortDesc: 'Register your Private Limited Company, One Person Company (OPC), or Limited Liability Partnership (LLP).',
    longDesc: 'Complete end-to-end MCA filing including Name Approval (RUN/SPICe+), DSC issuance, DIN allocation, MOA & AOA drafting, Certificate of Incorporation, PAN & TAN.',
    startingPrice: '₹4,999',
    tat: '5-7 Working Days',
    documentsRequired: ['PAN & Aadhaar of all Directors', 'Passport size photographs', 'Electricity Bill / NOC of registered office', 'Bank Statement / Voter ID for address proof'],
    highlights: ['2 Digital Signatures (DSC) included', 'Government SPICe+ MCA filing', 'Complimentary PAN, TAN & MSME registration', 'Bank Current Account opening assistance']
  },

  // 3. GST Filing
  {
    id: 'gst-filing',
    number: 3,
    title: 'GST Services & Filings',
    slug: 'gst-filing',
    category: 'gst',
    categoryLabel: 'GST Services & Compliance',
    shortDesc: 'Registration, Composition Scheme, Freelancers, LUT Export filing, Traders, and Monthly GSTR-1 / 3B.',
    subServices: ['GST Registration ARN', 'Composition Tax Scheme', 'Freelancers GST', 'LUT Filing for zero-rated exports', 'Traders Compliance', 'Annual Return GSTR-9'],
    longDesc: 'Comprehensive GST management ensuring accurate Input Tax Credit (ITC) reconciliation with GSTR-2B, on-time monthly filings without late fee penalties, and export compliance.',
    startingPrice: '₹799/mo',
    tat: 'Same Day Filing',
    documentsRequired: ['PAN & Aadhaar of Proprietor/Partners', 'Business address proof (Rent deed/Electricity bill)', 'Cancelled Cheque / Bank Statement', 'Trade Name & HSN/SAC codes'],
    highlights: ['Zero late fee assurance', '100% GSTR-2B ITC reconciliation', 'Export LUT generation within 24 hours', 'Dedicated GST compliance manager']
  },

  // 4. Income Tax Notice, Scrutiny & Appeals
  {
    id: 'income-tax-notices',
    number: 4,
    title: 'Income Tax Notice & Legal Appeals',
    slug: 'notice-assistance',
    category: 'income_tax',
    categoryLabel: 'Income Tax & Legal Appeals',
    shortDesc: 'Defective Return 139(9), Intimation 143(1), Scrutiny 148, Rectification 154, and CIT Appeals.',
    subServices: ['Return Filing', 'Scrutiny Cases (Sec 143(3), 147, 148)', 'CIT Appeals & Tribunal representation', 'Rectification / Revised / Defective returns', 'Notice seeking clarification'],
    longDesc: 'Specialized legal tax representation by veteran Chartered Accountants and High Court tax advocates to overturn unfair tax demands, rectify AIS mismatches, and present appellate submissions.',
    startingPrice: '₹1,999',
    tat: '24-48 Hours Legal Review',
    documentsRequired: ['Copy of Notice / Intimation received', 'Filed ITR acknowledgment & Computation', 'Supporting proofs for deductions/incomes questioned', 'AIS & 26AS reports'],
    highlights: ['Handled by Senior CA & Tax Advocates', 'Thorough legal grounds preparation', 'Online e-proceedings response submission', 'Over 94% tax demand relief rate']
  },

  // 5. Trademark Registration
  {
    id: 'trademark-registration',
    number: 5,
    title: 'Trademark Registration (™ / ®)',
    slug: 'trademark-registration',
    category: 'licenses_certifications',
    categoryLabel: 'Licenses, EPF/ESI & DSC',
    shortDesc: 'Protect your brand name, logo, and slogan with government IP India filing under proper Nice classes.',
    longDesc: 'Complete trademark search report, Class consultation (1 to 45), TM application drafting, Vienna code classification, and objection handling until registered status ®.',
    startingPrice: '₹2,499 + Govt Fee',
    tat: '24 Hours to ™ status',
    documentsRequired: ['Logo / Brand Name image file', 'Applicant Identity & Address Proof', 'MSME / Udyam Certificate (for 50% govt fee rebate)', 'Power of Attorney (TM-48)'],
    highlights: ['Immediate legal right to use ™ symbol', 'Pre-filing availability search report', '50% government fee discount via MSME', 'Complete tracking up to Registration Certificate']
  },

  // 6. Tax Planning
  {
    id: 'tax-planning',
    number: 6,
    title: 'Tax Planning & Advisory',
    slug: 'tax-planning',
    category: 'advisory_wealth',
    categoryLabel: 'Advisory, Capital Gains & RSU',
    shortDesc: 'Basic, Advance, NRI, and Advance Tax planning to legitimately minimize tax liability.',
    subServices: ['Basic Tax Planning (Salaried & HUF)', 'Advance Corporate & Business Tax Planning', 'NRI Tax Optimization & DTAA', 'Advance Tax Calculation & Quarterly Schedules'],
    longDesc: 'Strategic tax restructuring utilizing all legal provisions under the Income Tax Act (80C, 80D, 80CCD, 54, 54EC, 54F, 115BAC) to maximize in-hand wealth legally.',
    startingPrice: '₹2,499',
    tat: '3 Working Days',
    documentsRequired: ['Last 2 years filed ITRs', 'Current investment portfolio details', 'Expected annual revenues / income breakdown', 'Existing loan and insurance proofs'],
    highlights: ['Customized Tax Strategy Blueprint', 'Zero aggressive tax positions (audit safe)', 'NRI Double Taxation Avoidance (DTAA)', 'Quarterly review check-ins']
  },

  // 7. Trust Incorporation
  {
    id: 'trust-incorporation',
    number: 7,
    title: 'Trust & NGO Incorporation',
    slug: 'trust-incorporation',
    category: 'corporate_legal',
    categoryLabel: 'Business Setup & Corporate',
    shortDesc: 'Register Charitable Trusts, Societies, Section 8 Non-Profit Companies, and 12A/80G approvals.',
    longDesc: 'Comprehensive formation of Public/Private Trusts, drafting of water-tight Trust Deeds, registration with the Sub-Registrar, PAN/TAN issuance, and Section 12A/80G tax exemption applications.',
    startingPrice: '₹7,999',
    tat: '10-15 Working Days',
    documentsRequired: ['Trust deed draft / objectives', 'ID & Address proof of Settlor and Trustees', 'Electricity bill and NOC of trust registered address', 'Two witness identity documents'],
    highlights: ['Certified Trust Deed drafting', 'Sub-registrar liaison and physical execution', 'Section 12A & 80G tax holiday guidance', 'CSR-1 filing support for corporate grants']
  },

  // 8. Bookkeeping / Accounting Services
  {
    id: 'bookkeeping-accounting',
    number: 8,
    title: 'Bookkeeping & Accounting Services',
    slug: 'bookkeeping-accounting',
    category: 'accounting_cma',
    categoryLabel: 'Accounting, Audit & CMA',
    shortDesc: 'Day-to-day bookkeeping, automated ledger maintenance, and Schedule III P&L and Balance Sheet.',
    longDesc: 'End-to-end bookkeeping on Tally Prime, Zoho Books, QuickBooks, or Excel. Includes bank reconciliations, vendor payables/receivables, depreciation schedules, and monthly financial statements.',
    startingPrice: '₹2,999/mo',
    tat: 'Ongoing Monthly Support',
    documentsRequired: ['Bank statements of all business accounts', 'Sales invoices & Purchase bills', 'Expense vouchers & payroll sheets', 'Previous year audited balance sheet'],
    highlights: ['Real-time monthly P&L and Balance Sheet', 'Bank and credit card reconciliation', 'Year-end CA audit readiness', 'GST & TDS liability sync']
  },

  // 9. Capital Gain Taxation Advisory
  {
    id: 'capital-gain-advisory',
    number: 9,
    title: 'Capital Gain Taxation Advisory',
    slug: 'capital-gain-advisory',
    category: 'advisory_wealth',
    categoryLabel: 'Advisory, Capital Gains & RSU',
    shortDesc: 'Property sales, stock market trading, mutual funds, crypto, and Section 54/54EC/54F exemptions.',
    longDesc: 'Comprehensive advisory on Long Term (LTCG) vs Short Term (STCG) capital gains under recent budget amendments, indexation grandfathering clauses, Capital Gains Account Scheme (CGAS), and 54EC bonds.',
    startingPrice: '₹2,499',
    tat: '24-48 Hours',
    documentsRequired: ['Property purchase deed & sale agreement', 'Improvement expenses proofs / bills', 'Zerodha/Groww tax P&L statement', 'Bank receipt proof of proceeds'],
    highlights: ['Section 54, 54EC & 54F tax savings plan', 'Grandfathering clause benefit calculation', 'Capital Gains Account Scheme (CGAS) setup', 'CA certified net gain computation']
  },

  // 10. FSSAI License
  {
    id: 'fssai-license',
    number: 10,
    title: 'FSSAI Food License',
    slug: 'fssai-license',
    category: 'licenses_certifications',
    categoryLabel: 'Licenses, EPF/ESI & DSC',
    shortDesc: 'Basic Registration, State License, and Central FSSAI License for restaurants, cloud kitchens & FMCG.',
    longDesc: 'FoSCoS portal application management, food category selection, inspection response handling, and issuance of 14-digit FSSAI registration number.',
    startingPrice: '₹1,499 + Govt Fee',
    tat: '3-5 Working Days',
    documentsRequired: ['Photo of applicant / partners', 'Business address proof (Rent deed/Electricity)', 'Food category & product list', 'NOC from municipality (if applicable)'],
    highlights: ['1 to 5 years validity options', 'FoSCoS compliance documentation', 'Fast-track issuance with government follow-up', 'Mandatory for Zomato, Swiggy, Blinkit onboarding']
  },

  // 11. ISO Certificates
  {
    id: 'iso-certificates',
    number: 11,
    title: 'ISO Certification Services',
    slug: 'iso-certificates',
    category: 'licenses_certifications',
    categoryLabel: 'Licenses, EPF/ESI & DSC',
    shortDesc: 'ISO 9001:2015 (Quality), ISO 27001 (Information Security), ISO 14001, and CE Marking.',
    longDesc: 'End-to-end management from gap analysis, documentation of standard operating procedures (SOPs), internal audit, and certification through accredited IAF bodies.',
    startingPrice: '₹4,999',
    tat: '4-7 Working Days',
    documentsRequired: ['Company PAN and Certificate of Incorporation', 'Business activity / workflow profile', 'Sample sales & purchase invoices', 'Letterhead and logo of enterprise'],
    highlights: ['IAF & Non-IAF accredited options', 'Valid for government tenders & enterprise clients', 'Complete SOP documentation provided', '3 years validity with annual surveillance support']
  },

  // 12. RSUs Advisory & Taxation
  {
    id: 'rsus-advisory-taxation',
    number: 12,
    title: 'RSUs & Foreign Stock Taxation',
    slug: 'rsus-taxation',
    category: 'advisory_wealth',
    categoryLabel: 'Advisory, Capital Gains & RSU',
    shortDesc: 'US Stocks, Google/Amazon/Meta RSUs, ESPP, Section 90/91 DTAA relief, and Schedule FA/FSI compliance.',
    longDesc: 'Specialized compliance for tech professionals holding foreign shares (E*TRADE, Morgan Stanley, Charles Schwab). Strict reporting under Schedule FA (Foreign Assets) to avert black money act notices.',
    startingPrice: '₹2,999',
    tat: '48 Hours',
    documentsRequired: ['Foreign brokerage account statement (E*TRADE/Charles Schwab)', 'Form 16 showing perquisite tax deducted', 'Vest reports and sale transaction confirmations', 'SBI TT Buying Rate references'],
    highlights: ['Schedule FA & Schedule FSI compliance', 'Perquisite double-tax prevention', 'Foreign Tax Credit (FTC) Form 67 filing', 'Zero notice risk for US/EU equity holdings']
  },

  // 13. EPF / ESI Consultation
  {
    id: 'epf-esi-consultation',
    number: 13,
    title: 'EPF & ESI Consultation & Compliance',
    slug: 'epf-esi-consultation',
    category: 'licenses_certifications',
    categoryLabel: 'Licenses, EPF/ESI & DSC',
    shortDesc: 'EPFO & ESIC registration, monthly challan generation (ECR), employee onboarding, and inspections.',
    longDesc: 'Complete payroll statutory compliance: threshold evaluations (20 employees for PF, 10 for ESI), UAN generation, monthly return submissions, and withdrawal assistance.',
    startingPrice: '₹1,999/mo',
    tat: '2-3 Working Days',
    documentsRequired: ['Company PAN, COI & GST certificate', 'Directors / Partners ID & Address proofs', 'Employee salary sheet with Basic + DA split', 'Cancelled business cheque'],
    highlights: ['Monthly ECR return & challan generation', 'New employee UAN generation and KYC link', 'Statutory audit compliance report', 'Notice and inspection resolution']
  },

  // 14. DSC Services
  {
    id: 'dsc-services',
    number: 14,
    title: 'Digital Signature Certificate (DSC)',
    slug: 'dsc-services',
    category: 'licenses_certifications',
    categoryLabel: 'Licenses, EPF/ESI & DSC',
    shortDesc: 'Class 3 Digital Signatures with secure FIPS cryptographic USB token for MCA, ITR, GST, and e-Tenders.',
    longDesc: 'Paperless video verification issuance of Class 3 Signing & Encryption DSC from certified authorities (eMudhra / Capricorn / VSign) with 2-year or 3-year validity.',
    startingPrice: '₹1,299',
    tat: '30 Minutes Online Issuance',
    documentsRequired: ['Aadhaar linked with active mobile number', 'PAN Card copy', 'Applicant passport size photo', 'Video KYC (takes 2 minutes on phone)'],
    highlights: ['Class 3 with high-security crypto USB token', 'Compatible with MCA V3, Income Tax, GST, EPFO & e-Procurement', 'Fastest 30-min doorstep or courier dispatch', '2 or 3 years validity options']
  },

  // 15. Partnership Deeds
  {
    id: 'partnership-deeds',
    number: 15,
    title: 'Partnership Deeds & Registration',
    slug: 'partnership-deeds',
    category: 'corporate_legal',
    categoryLabel: 'Business Setup & Corporate',
    shortDesc: 'Drafting of legal Partnership Deeds, capital ratios, profit-sharing, and Registrar of Firms (ROF) registration.',
    longDesc: 'Customized legal drafting covering partner remuneration clauses (Section 40(b) Income Tax deduction), dispute resolution, dissolution, and stamp duty franking.',
    startingPrice: '₹3,499',
    tat: '2-3 Working Days',
    documentsRequired: ['PAN and Aadhaar of all partners', 'Business address proof and ownership/rent agreement', 'Firm name and mutual capital contribution ratio', 'Two witness identity documents'],
    highlights: ['Section 40(b) optimized for maximum tax savings', 'Stamp duty legal franking guidance', 'Registrar of Firms (ROF) filing support', 'Complimentary Partnership Firm PAN application']
  },

  // 16. MSME / Udyam Registration
  {
    id: 'msme-udyam-registration',
    number: 16,
    title: 'MSME / Udyam Registration',
    slug: 'msme-udyam-registration',
    category: 'corporate_legal',
    categoryLabel: 'Business Setup & Corporate',
    shortDesc: 'Government Udyam certificate for micro, small & medium enterprises with collateral-free bank loan eligibility.',
    longDesc: 'Unlock priority sector bank lending, 50% patent/trademark government fee subsidy, protection against delayed payments (MSME Samadhaan), and electricity bill concessions.',
    startingPrice: '₹799',
    tat: 'Same Day Issuance',
    documentsRequired: ['Aadhaar of proprietor/director', 'PAN card of enterprise / proprietor', 'Bank account number and IFSC', 'Enterprise NIC business activity code'],
    highlights: ['Instant lifetime valid government certificate', 'Eligible for 50% trademark fee discount', 'Protection against delayed client payments (Sec 43B(h))', 'Collateral-free CGTMSE bank loans']
  },

  // 17. Startup Registration
  {
    id: 'startup-registration',
    number: 17,
    title: 'Startup India DPIIT Recognition',
    slug: 'startup-registration',
    category: 'corporate_legal',
    categoryLabel: 'Business Setup & Corporate',
    shortDesc: 'DPIIT certificate, Section 80-IAC 3-year 100% tax holiday, and Section 56 Angel Tax exemption.',
    longDesc: 'Complete pitch deck review, business innovation write-up, DPIIT application filing, and Inter-Ministerial Board (IMB) documentation for Section 80-IAC tax exemption.',
    startingPrice: '₹4,999',
    tat: '5-7 Working Days',
    documentsRequired: ['Certificate of Incorporation (Pvt Ltd / LLP)', 'Brief pitch deck / product innovation writeup', 'Website or mobile app link / demo video', 'Directors / Founders resume and KYC'],
    highlights: ['DPIIT Startup India certificate', 'Section 80-IAC 3-year consecutive tax exemption eligibility', 'Fast-track patent & trademark clearance', 'Exemption from prior turnover in govt tenders']
  },

  // 18. TDS Return Filing
  {
    id: 'tds-return-filing',
    number: 18,
    title: 'TDS Return Filing (Form 24Q, 26Q, 27Q)',
    slug: 'tds-return-filing',
    category: 'income_tax',
    categoryLabel: 'Income Tax & Legal Appeals',
    shortDesc: 'Quarterly TDS returns for salaries (24Q), vendors/contractors (26Q), and Form 16/16A generation.',
    longDesc: 'TDS challan verification, PAN verification to avoid 20% higher deduction notices, NSDL validation through government File Validation Utility (FVU), and TRACES Form 16 download.',
    startingPrice: '₹1,499/qtr',
    tat: '24-48 Hours',
    documentsRequired: ['Challan ITNS 281 payment receipts (BSR code, CIN)', 'Deductee-wise payment and deduction register', 'Deductee PAN numbers', 'TAN registration details of deductor'],
    highlights: ['Zero Section 234E late filing fee guarantee', 'TDS error / PAN mismatch correction', 'Instant FVU generated token generation', 'Automated bulk Form 16/16A generation from TRACES']
  },

  // 19. CMA Report / Financial Projections
  {
    id: 'cma-report-projections',
    number: 19,
    title: 'CMA Report & Financial Projections',
    slug: 'cma-report',
    category: 'accounting_cma',
    categoryLabel: 'Accounting, Audit & CMA',
    shortDesc: 'Bank-ready Credit Monitoring Arrangement (CMA) reports for CC limits, Term Loans & Working Capital.',
    longDesc: 'Detailed 5 to 7 years projected financial statements: Maximum Permissible Bank Finance (MPBF), Debt Service Coverage Ratio (DSCR), Current Ratio, Fund Flow and Sensitivity analysis strictly compliant with RBI norms.',
    startingPrice: '₹4,999',
    tat: '3-5 Working Days',
    documentsRequired: ['Last 2-3 years audited financial statements', 'Sanction letters of existing bank loans', 'Proposed project cost & quotation estimates', 'Projected sales growth and margins'],
    highlights: ['Strict compliance with RBI & Bank credit formats', 'High DSCR & Bankability score optimization', 'Direct coordination with Bank Credit Managers', 'Includes Projected P&L, Balance Sheet & Cash Flows']
  },

  // 20. Loans Consultancy
  {
    id: 'loans-consultancy',
    number: 20,
    title: 'Business & Project Loans Consultancy',
    slug: 'loans-consultancy',
    category: 'accounting_cma',
    categoryLabel: 'Accounting, Audit & CMA',
    shortDesc: 'SME Business Loans, Working Capital (CC/OD), Machinery Term Loans, and Loan Against Property (LAP).',
    longDesc: 'Holistic banking advisory to secure the lowest possible interest rates, credit score enhancement, debt restructuring, and documentation coordination with top public/private banks and NBFCs.',
    startingPrice: 'Starting at 1% Success Fee',
    tat: '7-14 Working Days',
    documentsRequired: ['Last 3 years filed ITRs & Audited Reports', 'Past 12 months primary bank statements', 'CMA Report and financial projections', 'Property / collateral documents (for secured loans)'],
    highlights: ['Tie-ups with leading Public, Private Banks & NBFCs', 'Lowest interest rate negotiation', 'Credit rating & CIBIL optimization advice', 'High sanction approval track record']
  },

  // 21. E-Commerce Seller GST Filing & TCS Management
  {
    id: 'ecommerce-gst-filing',
    number: 21,
    title: 'E-Commerce Seller GST Filing & TCS Management',
    slug: 'ecommerce-gst-filing',
    category: 'gst',
    categoryLabel: 'GST Services & Compliance',
    shortDesc: 'Automated MTR reconciliation & monthly GST filing for Amazon, Flipkart, Meesho, Shopify & Myntra sellers.',
    subServices: [
      'Amazon MTR & Flipkart Sales Reconciliation',
      'Table 7 B2CS State-Wise Aggregation',
      'Section 52 TCS Credit Claim against 3B Liability',
      'Sales Return / RTO Reversals & Netting',
      'Multi-State GST Compliance (APOB/VPOB)',
      'Monthly GSTR-1 & GSTR-3B CA Certification'
    ],
    longDesc: 'Complete automated GST compliance built specifically for e-commerce marketplace sellers. We ingest messy Amazon MTR, Flipkart GSTR reports, and Meesho sales sheets, consolidate intra/inter-state supplies, claim your 1% Section 52 TCS cash credit, deduct RTO returns, and file accurate GSTR-1 and GSTR-3B without errors.',
    startingPrice: '₹499/mo',
    tat: '24-48 Hours',
    documentsRequired: [
      'Monthly Tax Report (MTR from Amazon Seller Central)',
      'Flipkart Sales & GSTR Report CSV',
      'Meesho Payment / GST Report',
      'GST Portal Credentials / OTP Access',
      'Purchase / Expense Invoices for ITC'
    ],
    highlights: [
      'Zero manual data entry: automated script processing',
      '100% Section 52 TCS credit claimed to reduce cash tax',
      'State-wise Place of Supply compliance across all 37 States/UTs',
      'RTO & Return deduction safeguard against over-taxation'
    ]
  }
];

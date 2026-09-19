import fs from 'fs';
import path from 'path';
import { FilingItem, WhatsAppTemplate, WhatsAppSettings, FilingStatus, TimelineStep, User, ToolPurchase, LeadItem } from './types';

const DATA_DIR = path.join(process.cwd(), 'data');
const FILINGS_FILE = path.join(DATA_DIR, 'filings.json');
const TEMPLATES_FILE = path.join(DATA_DIR, 'templates.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'whatsapp_settings.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const TOOL_PURCHASES_FILE = path.join(DATA_DIR, 'tool_purchases.json');
const LEADS_FILE = path.join(DATA_DIR, 'leads.json');

// Ensure data directory exists
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// Default Seed Data
const DEFAULT_FILINGS: FilingItem[] = [
  {
    id: 'TRAC-2025-0814',
    service: 'ITR Filing',
    plan: 'Salaried + Stock/Crypto Gains',
    fullName: 'Amitabh Sharma',
    mobile: '9876543210',
    email: 'amitabh.sharma@example.com',
    panNumber: 'ABCPS1234D',
    city: 'Mumbai',
    financialYear: 'FY 2024-25 (AY 2025-26)',
    status: 'draft_ready',
    estimatedRefund: 24850,
    assignedCA: {
      name: 'Senior Tax Expert (CA)',
      phone: '7275922162',
      email: 'contact@tracconsultant.com',
      membershipNumber: 'ICAI-512948'
    },
    clientNotes: 'Switched 2 jobs this year, have 2 Form 16s and Zerodha P&L statement.',
    notes: [
      {
        id: 'n-1',
        date: '2025-05-12T10:30:00Z',
        author: 'Senior CA Desk',
        message: 'Both Form 16s reconciled with AIS/TIS. Claimed Section 80C (1.5L) and 80D (25k). Net refund computed at Rs 24,850.'
      }
    ],
    documents: [
      {
        id: 'doc-1',
        name: 'Form16_PartA_B.pdf',
        type: 'application/pdf',
        size: '1.4 MB',
        uploadDate: '2025-05-10T14:20:00Z'
      },
      {
        id: 'doc-2',
        name: 'Zerodha_TaxPnl_FY2425.xlsx',
        type: 'application/vnd.ms-excel',
        size: '420 KB',
        uploadDate: '2025-05-10T14:22:00Z'
      }
    ],
    timeline: [
      { step: '1', title: 'Application Received', description: 'Application submitted online with documents.', date: '10 May 2025, 02:25 PM', completed: true, current: false },
      { step: '2', title: 'CA Assigned', description: 'Senior Chartered Accountant assigned for tax computation.', date: '11 May 2025, 10:00 AM', completed: true, current: false },
      { step: '3', title: 'Data Reconciliation', description: 'Form 16 verified with AIS, TIS & Form 26AS.', date: '12 May 2025, 11:30 AM', completed: true, current: false },
      { step: '4', title: 'Draft Computation Ready', description: 'Draft tax sheet ready with estimated refund ₹24,850.', date: '12 May 2025, 04:15 PM', completed: true, current: true },
      { step: '5', title: 'Client E-Verification & Filing', description: 'Filing with Govt Income Tax Portal and ITR-V generation.', date: null, completed: false, current: false }
    ],
    createdAt: '2025-05-10T14:25:00Z',
    updatedAt: '2025-05-12T16:15:00Z'
  },
  {
    id: 'TRAC-2025-0815',
    service: 'GST Services',
    plan: 'Monthly GSTR-1 & 3B Filing',
    fullName: 'Pooja Verma',
    mobile: '9812345678',
    email: 'pooja.verma@apexretail.in',
    panNumber: 'AAACV4492K',
    city: 'New Delhi',
    financialYear: 'FY 2024-25',
    status: 'ca_assigned',
    assignedCA: {
      name: 'CA Sneha Gupta',
      phone: '8052171196',
      email: 'contact@tracconsultant.com',
      membershipNumber: 'ICAI-604123'
    },
    clientNotes: 'Need GST returns filed before 20th to avoid late fees. E-way bill reconciliations needed.',
    notes: [
      {
        id: 'n-2',
        date: '2025-05-11T12:00:00Z',
        author: 'CA Sneha Gupta',
        message: 'Sales register received. Awaiting purchase invoice breakdown for GSTR-2B ITC match.'
      }
    ],
    documents: [
      {
        id: 'doc-3',
        name: 'Sales_Register_April2025.xlsx',
        type: 'application/vnd.ms-excel',
        size: '880 KB',
        uploadDate: '2025-05-11T11:45:00Z'
      }
    ],
    timeline: [
      { step: '1', title: 'Request Submitted', description: 'GST filing request initiated.', date: '11 May 2025, 11:40 AM', completed: true, current: false },
      { step: '2', title: 'GST Specialist Assigned', description: 'CA Sneha Gupta assigned.', date: '11 May 2025, 12:00 PM', completed: true, current: true },
      { step: '3', title: 'ITC & 2B Matching', description: 'Reconciling eligible input tax credits.', date: null, completed: false, current: false },
      { step: '4', title: 'Challan Payment & GSTR-3B Filing', description: 'Tax offset & government filing.', date: null, completed: false, current: false }
    ],
    createdAt: '2025-05-11T11:40:00Z',
    updatedAt: '2025-05-11T12:05:00Z'
  },
  {
    id: 'TRAC-2025-0816',
    service: 'Notice Assistance',
    plan: 'Notice 143(1) Scrutiny & Appeal',
    fullName: 'Vikram Singhania',
    mobile: '9765432109',
    email: 'vikram.singhania@gmail.com',
    panNumber: 'BKLPS9910F',
    city: 'Bengaluru',
    financialYear: 'AY 2024-25',
    status: 'under_review',
    clientNotes: 'Received intimation order under 143(1) with Rs 42,000 tax demand due to TDS mismatch by employer.',
    notes: [
      {
        id: 'n-3',
        date: '2025-05-12T09:15:00Z',
        author: 'Support Desk',
        message: 'High priority legal review. Notice uploaded. Assigned to Senior Tax Advocate team.'
      }
    ],
    documents: [
      {
        id: 'doc-4',
        name: 'Intimation_Order_Sec143_1.pdf',
        type: 'application/pdf',
        size: '2.1 MB',
        uploadDate: '2025-05-12T09:10:00Z'
      }
    ],
    timeline: [
      { step: '1', title: 'Notice Uploaded', description: 'Client submitted demand intimation.', date: '12 May 2025, 09:10 AM', completed: true, current: true },
      { step: '2', title: 'Legal & CA Analysis', description: 'Comparing Form 26AS with employer revised TDS.', date: null, completed: false, current: false },
      { step: '3', title: 'Rectification 154 / Response Drafting', description: 'Submitting formal response on IT portal.', date: null, completed: false, current: false }
    ],
    createdAt: '2025-05-12T09:10:00Z',
    updatedAt: '2025-05-12T09:20:00Z'
  },
  {
    id: 'TRAC-2025-0817',
    service: 'Company Registration',
    plan: 'Private Limited Company Incorporation',
    fullName: 'Neha Reddy',
    mobile: '9988776655',
    email: 'neha@nextgenfin.co',
    city: 'Hyderabad',
    financialYear: 'FY 2025-26',
    status: 'under_review',
    clientNotes: 'Starting a FinTech venture with 2 directors. Need Name reservation, DSC, DIN, MOA/AOA, and PAN/TAN.',
    notes: [],
    documents: [
      {
        id: 'doc-5',
        name: 'Director_PAN_Aadhaar.pdf',
        type: 'application/pdf',
        size: '1.1 MB',
        uploadDate: '2025-05-12T15:00:00Z'
      }
    ],
    timeline: [
      { step: '1', title: 'Incorporation Request', description: 'Application filed online.', date: '12 May 2025, 03:00 PM', completed: true, current: true },
      { step: '2', title: 'RUN Name Approval', description: 'MCA Name check & approval.', date: null, completed: false, current: false },
      { step: '3', title: 'SPICe+ Part B Filing', description: 'Incorporation & Certificate issue.', date: null, completed: false, current: false }
    ],
    createdAt: '2025-05-12T15:00:00Z',
    updatedAt: '2025-05-12T15:00:00Z'
  },
  {
    id: 'TRAC-2025-0818',
    service: 'ITR Filing',
    plan: 'Presumptive Business 44AD / 44ADA',
    fullName: 'Rajesh Kumar Patel',
    mobile: '9822001144',
    email: 'rajesh.patel@consulting.in',
    panNumber: 'AZOPK6631Q',
    city: 'Ahmedabad',
    financialYear: 'FY 2024-25 (AY 2025-26)',
    status: 'completed',
    estimatedRefund: 18200,
    assignedCA: {
      name: 'Senior Tax Expert (CA)',
      phone: '7275922162',
      email: 'contact@tracconsultant.com'
    },
    clientNotes: 'Software consultant working on contracts. Gross receipts Rs 32 Lakhs under 44ADA.',
    notes: [
      {
        id: 'n-4',
        date: '2025-05-08T16:00:00Z',
        author: 'Senior CA Desk',
        message: 'Successfully e-filed on Govt portal. Acknowledgement number #9218491823. Sent ITR-V to client on WhatsApp.'
      }
    ],
    documents: [
      {
        id: 'doc-6',
        name: 'ITR_V_Acknowledgement_FY2425.pdf',
        type: 'application/pdf',
        size: '310 KB',
        uploadDate: '2025-05-08T15:45:00Z'
      }
    ],
    timeline: [
      { step: '1', title: 'Application Received', description: 'Documents uploaded.', date: '06 May 2025', completed: true, current: false },
      { step: '2', title: 'CA Review & Computation', description: 'Section 44ADA 50% profit computation done.', date: '07 May 2025', completed: true, current: false },
      { step: '3', title: 'Client Approved', description: 'Client gave approval on WhatsApp.', date: '08 May 2025', completed: true, current: false },
      { step: '4', title: 'Successfully Filed', description: 'ITR-V generated & delivered.', date: '08 May 2025, 04:00 PM', completed: true, current: true }
    ],
    createdAt: '2025-05-06T10:00:00Z',
    updatedAt: '2025-05-08T16:00:00Z'
  }
];

const DEFAULT_TEMPLATES: WhatsAppTemplate[] = [
  {
    id: 'tpl-welcome',
    title: 'Welcome & File Confirmation',
    category: 'welcome',
    description: 'Sent automatically when a client registers or files an application online.',
    content: `Hello {client_name}! 🚀\n\nThank you for choosing *Tracconsultant* for your *{service}* (Application Ref: *{application_id}*).\n\nYour file has been assigned to our Chartered Accountant team. We are examining your details and will connect with you right here on WhatsApp within 15-30 minutes.\n\n📞 Direct CA Helpline: +91 7275922162 / 8052171196\n📧 Email: contact@tracconsultant.com\n\n*Tracconsultant — Tax Filing | Compliance | Business Support*`
  },
  {
    id: 'tpl-docs-pending',
    title: 'Missing Documents Reminder',
    category: 'docs_pending',
    description: 'Requests Form 16, Bank statements, or GST sales sheets from the client.',
    content: `Hi {client_name},\n\nThis is regarding your pending application *{application_id}* with *Tracconsultant*.\n\nOur CA needs the following document(s) to finalize your computation and claim your maximum tax refund:\n👉 Form 16 / Bank Statement / AIS Summary\n\nYou can simply reply and attach the PDF here on WhatsApp!\n\nNeed assistance? Call CA Desk: +91 7275922162.`
  },
  {
    id: 'tpl-draft-ready',
    title: 'Tax Draft Ready For Review',
    category: 'draft_ready',
    description: 'Informs the client that their tax draft is calculated with refunds.',
    content: `Great news {client_name}! 🎉\n\nYour tax computation for *{application_id}* is ready.\n\n💰 *Estimated Refund Claimed:* ₹{refund_amount}\n🛡️ Deductions Optimized: 80C, 80D, HRA & 87A rebate applied\n\nPlease confirm if we should proceed with instant Govt e-filing. Reply *'YES'* to approve.`
  },
  {
    id: 'tpl-filed',
    title: 'ITR Successfully Filed (ITR-V)',
    category: 'filed',
    description: 'Delivery of filing acknowledgement and confirmation.',
    content: `Congratulations {client_name}! 🏆\n\nYour *{service}* has been successfully filed with the Govt Income Tax Department (Ref: *{application_id}*).\n\nYour official ITR-V acknowledgement has been generated. Thank you for choosing *Tracconsultant*!\n\nSave our number (+91 7275922162) for year-round tax advisory & notices protection.`
  },
  {
    id: 'tpl-notice',
    title: 'Tax Notice Scrutiny Advisory',
    category: 'notice',
    description: 'Immediate consultation response for Income Tax Notice cases.',
    content: `Hello {client_name},\n\nOur Legal Tax Cell has analyzed your Income Tax Notice under Ref: *{application_id}*.\n\nDon't worry — we have identified the discrepancy and prepared a solid rectification strategy to avoid any penalty.\n\nLet's discuss on call today: +91 7275922162 / 8052171196.`
  }
];

const DEFAULT_SETTINGS: WhatsAppSettings = {
  enabled: true,
  apiProvider: 'web_direct',
  businessPhone: '917275922162',
  autoSendOnSubmission: true
};

// Database Operations
export function getFilings(): FilingItem[] {
  ensureDataDir();
  if (!fs.existsSync(FILINGS_FILE)) {
    fs.writeFileSync(FILINGS_FILE, JSON.stringify(DEFAULT_FILINGS, null, 2), 'utf-8');
    return DEFAULT_FILINGS;
  }
  try {
    const raw = fs.readFileSync(FILINGS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading filings file:', err);
    return DEFAULT_FILINGS;
  }
}

export function saveFilings(filings: FilingItem[]): void {
  ensureDataDir();
  fs.writeFileSync(FILINGS_FILE, JSON.stringify(filings, null, 2), 'utf-8');
}

export function getFilingById(id: string): FilingItem | undefined {
  const filings = getFilings();
  const searchId = id.trim().toUpperCase();
  return filings.find(f => f.id.toUpperCase() === searchId);
}

export function findFilingsByPhoneOrId(query: string): FilingItem[] {
  const filings = getFilings();
  const clean = query.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
  return filings.filter(f => {
    const idMatch = f.id.toLowerCase().replace(/[^a-z0-9]/g, '').includes(clean);
    const phoneMatch = f.mobile.replace(/[^0-9]/g, '').includes(clean);
    const panMatch = f.panNumber ? f.panNumber.toLowerCase().includes(clean) : false;
    return idMatch || phoneMatch || panMatch;
  });
}

export function createFiling(data: Partial<FilingItem>): FilingItem {
  const filings = getFilings();
  const year = new Date().getFullYear();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const newId = `TRAC-${year}-${randomNum}`;

  const newFiling: FilingItem = {
    id: newId,
    service: data.service || 'ITR Filing',
    plan: data.plan || 'Standard CA Assisted Filing',
    fullName: data.fullName || 'Anonymous Client',
    mobile: data.mobile || '',
    email: data.email || '',
    panNumber: data.panNumber ? data.panNumber.toUpperCase() : undefined,
    city: data.city || 'India',
    financialYear: data.financialYear || 'FY 2024-25 (AY 2025-26)',
    status: 'new',
    clientNotes: data.clientNotes || '',
    notes: [
      {
        id: `note-${Date.now()}`,
        date: new Date().toISOString(),
        author: 'System',
        message: `Application created online via Tracconsultant Portal. Assigned Ref ID: ${newId}`
      }
    ],
    documents: data.documents || [],
    timeline: [
      {
        step: '1',
        title: 'Application Received',
        description: 'Application successfully registered with Tracconsultant.',
        date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        completed: true,
        current: true
      },
      {
        step: '2',
        title: 'CA Review & Assignment',
        description: 'Dedicated Chartered Accountant is being matched.',
        date: null,
        completed: false,
        current: false
      },
      {
        step: '3',
        title: 'Draft Preparation & Deduction Optimization',
        description: 'Maximizing deductions under 80C, 80D, HRA & new tax regime benefits.',
        date: null,
        completed: false,
        current: false
      },
      {
        step: '4',
        title: 'Draft Approval & E-Verification',
        description: 'Client review and approval of tax computation.',
        date: null,
        completed: false,
        current: false
      },
      {
        step: '5',
        title: 'Govt Filing & ITR-V Generated',
        description: 'Filing completed with Income Tax Department.',
        date: null,
        completed: false,
        current: false
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  filings.unshift(newFiling);
  saveFilings(filings);
  return newFiling;
}

export function updateFiling(id: string, updates: Partial<FilingItem>): FilingItem | null {
  const filings = getFilings();
  const index = filings.findIndex(f => f.id.toUpperCase() === id.toUpperCase());
  if (index === -1) return null;

  const current = filings[index];
  
  // If status changed, update timeline automatically
  let timeline = current.timeline;
  if (updates.status && updates.status !== current.status) {
    timeline = updateTimelineForStatus(current.timeline, updates.status);
  }

  const updated: FilingItem = {
    ...current,
    ...updates,
    timeline: updates.timeline || timeline,
    updatedAt: new Date().toISOString()
  };

  filings[index] = updated;
  saveFilings(filings);
  return updated;
}

function updateTimelineForStatus(timeline: TimelineStep[], newStatus: FilingStatus): TimelineStep[] {
  const cloned = [...timeline];
  const nowStr = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  if (newStatus === 'ca_assigned' || newStatus === 'under_review') {
    if (cloned[1]) {
      cloned[1].completed = true;
      cloned[1].current = true;
      if (!cloned[1].date) cloned[1].date = nowStr;
    }
  } else if (newStatus === 'draft_ready') {
    if (cloned[1]) cloned[1].completed = true;
    if (cloned[2]) {
      cloned[2].completed = true;
      cloned[2].current = true;
      if (!cloned[2].date) cloned[2].date = nowStr;
    }
  } else if (newStatus === 'filed' || newStatus === 'completed') {
    cloned.forEach(t => {
      t.completed = true;
      t.current = false;
      if (!t.date) t.date = nowStr;
    });
    if (cloned[cloned.length - 1]) {
      cloned[cloned.length - 1].current = true;
    }
  }

  return cloned;
}

export function deleteFiling(id: string): boolean {
  const filings = getFilings();
  const filtered = filings.filter(f => f.id.toUpperCase() !== id.toUpperCase());
  if (filtered.length === filings.length) return false;
  saveFilings(filtered);
  return true;
}

// Templates
export function getTemplates(): WhatsAppTemplate[] {
  ensureDataDir();
  if (!fs.existsSync(TEMPLATES_FILE)) {
    fs.writeFileSync(TEMPLATES_FILE, JSON.stringify(DEFAULT_TEMPLATES, null, 2), 'utf-8');
    return DEFAULT_TEMPLATES;
  }
  try {
    return JSON.parse(fs.readFileSync(TEMPLATES_FILE, 'utf-8'));
  } catch {
    return DEFAULT_TEMPLATES;
  }
}

export function saveTemplates(templates: WhatsAppTemplate[]): void {
  ensureDataDir();
  fs.writeFileSync(TEMPLATES_FILE, JSON.stringify(templates, null, 2), 'utf-8');
}

// Settings
export function getWhatsAppSettings(): WhatsAppSettings {
  ensureDataDir();
  if (!fs.existsSync(SETTINGS_FILE)) {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(DEFAULT_SETTINGS, null, 2), 'utf-8');
    return DEFAULT_SETTINGS;
  }
  try {
    return JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf-8'));
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveWhatsAppSettings(settings: WhatsAppSettings): void {
  ensureDataDir();
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2), 'utf-8');
}

// ----------------------------------------------------
// Users DB
// ----------------------------------------------------
const DEFAULT_USERS: User[] = [
  {
    id: 'usr-admin-1',
    name: 'Senior CA Partner',
    email: 'admin@tracconsultant.com',
    phone: '+91 7275922162',
    role: 'admin',
    authProvider: 'email',
    unlockedTools: [
      'hra-calculator',
      'advance-tax-calculator',
      'tax-calculator',
      'pdf-redactor',
      'tb-to-balancesheet',
      'gstr2a-reconciliation',
      'json-to-computation',
      'gstr2a-cleaner'
    ],
    createdAt: '2025-01-15T09:00:00Z'
  },
  {
    id: 'usr-client-1',
    name: 'Amitabh Sharma',
    email: 'amitabh.sharma@example.com',
    phone: '9876543210',
    role: 'client',
    authProvider: 'google',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    unlockedTools: ['pdf-redactor', 'tax-calculator', 'hra-calculator'],
    createdAt: '2025-05-10T14:20:00Z'
  },
  {
    id: 'usr-client-2',
    name: 'Pooja Verma',
    email: 'pooja.verma@apexretail.in',
    phone: '9812345678',
    role: 'client',
    authProvider: 'email',
    unlockedTools: ['gstr2a-reconciliation', 'gstr2a-cleaner'],
    createdAt: '2025-05-11T11:30:00Z'
  },
  {
    id: 'usr-client-3',
    name: 'Vikram Singhania',
    email: 'vikram.singhania@gmail.com',
    phone: '9765432109',
    role: 'client',
    authProvider: 'google',
    unlockedTools: ['advance-tax-calculator', 'tax-calculator'],
    createdAt: '2025-05-12T09:10:00Z'
  }
];

export function getUsers(): User[] {
  ensureDataDir();
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify(DEFAULT_USERS, null, 2), 'utf-8');
    return DEFAULT_USERS;
  }
  try {
    return JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
  } catch {
    return DEFAULT_USERS;
  }
}

export function saveUsers(users: User[]): void {
  ensureDataDir();
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
}

export function findUserByEmail(email: string): User | undefined {
  const users = getUsers();
  return users.find(u => u.email.toLowerCase() === email.toLowerCase());
}

export function findUserById(id: string): User | undefined {
  const users = getUsers();
  return users.find(u => u.id === id);
}

export function createUser(userData: Partial<User> & { email: string; name: string }): User {
  const users = getUsers();
  const existing = users.find(u => u.email.toLowerCase() === userData.email.toLowerCase());
  if (existing) {
    return existing;
  }

  const newUser: User = {
    id: `usr-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    name: userData.name,
    email: userData.email,
    phone: userData.phone || '',
    role: userData.role || 'client',
    authProvider: userData.authProvider || 'email',
    avatar: userData.avatar,
    unlockedTools: userData.unlockedTools || ['hra-calculator', 'advance-tax-calculator', 'tax-calculator'],
    createdAt: new Date().toISOString(),
    password: userData.password
  };

  users.push(newUser);
  saveUsers(users);
  return newUser;
}

export function updateUser(id: string, updates: Partial<User>): User | null {
  const users = getUsers();
  const idx = users.findIndex(u => u.id === id);
  if (idx === -1) return null;

  users[idx] = { ...users[idx], ...updates };
  saveUsers(users);
  return users[idx];
}

export function toggleUserToolAccess(userId: string, toolId: string, grant: boolean): boolean {
  const users = getUsers();
  const idx = users.findIndex(u => u.id === userId);
  if (idx === -1) return false;

  const current = new Set(users[idx].unlockedTools || []);
  if (grant) {
    current.add(toolId);
  } else {
    current.delete(toolId);
  }

  users[idx].unlockedTools = Array.from(current);
  saveUsers(users);
  return true;
}

// ----------------------------------------------------
// Tool Purchases DB
// ----------------------------------------------------
const DEFAULT_TOOL_PURCHASES: ToolPurchase[] = [
  {
    id: 'TRAC-TOOL-1081',
    userId: 'usr-client-1',
    userName: 'Amitabh Sharma',
    userEmail: 'amitabh.sharma@example.com',
    userPhone: '9876543210',
    toolId: 'pdf-redactor',
    toolName: 'PDF Redact & Sensitive Data Masking Tool',
    amount: 199,
    paymentMode: 'UPI',
    paymentId: 'upi_ref_918237461298',
    status: 'active',
    createdAt: '2025-05-11T16:30:00Z'
  },
  {
    id: 'TRAC-TOOL-1082',
    userId: 'usr-client-2',
    userName: 'Pooja Verma',
    userEmail: 'pooja.verma@apexretail.in',
    userPhone: '9812345678',
    toolId: 'gstr2a-reconciliation',
    toolName: 'GSTR-2A vs Books Reconciliation Engine',
    amount: 299,
    paymentMode: 'UPI',
    paymentId: 'upi_ref_882910293812',
    status: 'active',
    createdAt: '2025-05-12T10:15:00Z'
  },
  {
    id: 'TRAC-TOOL-1083',
    userId: 'usr-client-2',
    userName: 'Pooja Verma',
    userEmail: 'pooja.verma@apexretail.in',
    userPhone: '9812345678',
    toolId: 'gstr2a-cleaner',
    toolName: 'GSTR-2A Cleaner & Supplier Summary Tool',
    amount: 199,
    paymentMode: 'Admin_Grant',
    paymentId: 'admin_promo_free',
    status: 'active',
    createdAt: '2025-05-12T12:00:00Z'
  }
];

export function getToolPurchases(): ToolPurchase[] {
  ensureDataDir();
  if (!fs.existsSync(TOOL_PURCHASES_FILE)) {
    fs.writeFileSync(TOOL_PURCHASES_FILE, JSON.stringify(DEFAULT_TOOL_PURCHASES, null, 2), 'utf-8');
    return DEFAULT_TOOL_PURCHASES;
  }
  try {
    return JSON.parse(fs.readFileSync(TOOL_PURCHASES_FILE, 'utf-8'));
  } catch {
    return DEFAULT_TOOL_PURCHASES;
  }
}

export function saveToolPurchases(purchases: ToolPurchase[]): void {
  ensureDataDir();
  fs.writeFileSync(TOOL_PURCHASES_FILE, JSON.stringify(purchases, null, 2), 'utf-8');
}

export function recordToolPurchase(purchaseData: Omit<ToolPurchase, 'id' | 'createdAt' | 'status'> & { status?: 'active' | 'revoked' }): ToolPurchase {
  const purchases = getToolPurchases();
  const id = `TRAC-TOOL-${Math.floor(1000 + Math.random() * 9000)}`;

  const newPurchase: ToolPurchase = {
    ...purchaseData,
    id,
    status: purchaseData.status || 'active',
    createdAt: new Date().toISOString()
  };

  purchases.unshift(newPurchase);
  saveToolPurchases(purchases);

  // Automatically grant access in user profile
  toggleUserToolAccess(purchaseData.userId, purchaseData.toolId, true);

  return newPurchase;
}

export function togglePurchaseStatus(purchaseId: string): ToolPurchase | null {
  const purchases = getToolPurchases();
  const idx = purchases.findIndex(p => p.id === purchaseId);
  if (idx === -1) return null;

  purchases[idx].status = purchases[idx].status === 'active' ? 'revoked' : 'active';
  saveToolPurchases(purchases);

  // Sync with user unlockedTools
  toggleUserToolAccess(
    purchases[idx].userId,
    purchases[idx].toolId,
    purchases[idx].status === 'active'
  );

  return purchases[idx];
}

// ----------------------------------------------------
// Leads CRM DB
// ----------------------------------------------------
const DEFAULT_LEADS: LeadItem[] = [
  {
    id: 'lead-1',
    fullName: 'Rajesh Mehra',
    mobile: '9820012345',
    email: 'rajesh.mehra@techcorp.in',
    serviceInterest: 'Company Incorporation / LLP',
    message: 'Want to incorporate a private limited software development agency in Kanpur/Noida.',
    city: 'Kanpur',
    source: 'Services Page',
    status: 'new',
    createdAt: '2025-05-12T14:30:00Z'
  },
  {
    id: 'lead-2',
    fullName: 'Sunita Jain',
    mobile: '9845098765',
    email: 'sunita.jain@gmail.com',
    serviceInterest: 'Trademark Registration',
    message: 'Brand name registration needed under Class 35 and Class 25.',
    city: 'Lucknow',
    source: 'Contact Form',
    status: 'contacted',
    createdAt: '2025-05-11T16:00:00Z'
  },
  {
    id: 'lead-3',
    fullName: 'Harish Chawla',
    mobile: '9871122334',
    email: 'harish@chawlaexports.com',
    serviceInterest: 'GST LUT Filing & Export Compliance',
    message: 'Need LUT filing renewal for FY 2025-26 zero-rated export of services.',
    city: 'Delhi',
    source: 'Mega Menu Banner',
    status: 'converted',
    createdAt: '2025-05-10T10:45:00Z'
  }
];

export function getLeads(): LeadItem[] {
  ensureDataDir();
  if (!fs.existsSync(LEADS_FILE)) {
    fs.writeFileSync(LEADS_FILE, JSON.stringify(DEFAULT_LEADS, null, 2), 'utf-8');
    return DEFAULT_LEADS;
  }
  try {
    return JSON.parse(fs.readFileSync(LEADS_FILE, 'utf-8'));
  } catch {
    return DEFAULT_LEADS;
  }
}

export function saveLeads(leads: LeadItem[]): void {
  ensureDataDir();
  fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), 'utf-8');
}

export function createLead(leadData: Omit<LeadItem, 'id' | 'createdAt' | 'status'>): LeadItem {
  const leads = getLeads();
  const newLead: LeadItem = {
    ...leadData,
    id: `lead-${Date.now()}`,
    status: 'new',
    createdAt: new Date().toISOString()
  };
  leads.unshift(newLead);
  saveLeads(leads);
  return newLead;
}

export function updateLeadStatus(leadId: string, status: LeadItem['status']): boolean {
  const leads = getLeads();
  const idx = leads.findIndex(l => l.id === leadId);
  if (idx === -1) return false;
  leads[idx].status = status;
  saveLeads(leads);
  return true;
}

export function deleteLead(leadId: string): boolean {
  const leads = getLeads();
  const filtered = leads.filter(l => l.id !== leadId);
  if (filtered.length === leads.length) return false;
  saveLeads(filtered);
  return true;
}

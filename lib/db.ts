import fs from 'fs';
import path from 'path';
import { FilingItem, WhatsAppTemplate, WhatsAppSettings, FilingStatus, TimelineStep, User, ToolPurchase, LeadItem, PaymentTransaction } from './types';

const DATA_DIR = path.join(process.cwd(), 'data');
const FILINGS_FILE = path.join(DATA_DIR, 'filings.json');
const TEMPLATES_FILE = path.join(DATA_DIR, 'templates.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'whatsapp_settings.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const TOOL_PURCHASES_FILE = path.join(DATA_DIR, 'tool_purchases.json');
const LEADS_FILE = path.join(DATA_DIR, 'leads.json');
const PAYMENTS_FILE = path.join(DATA_DIR, 'payments.json');

// Ensure data directory exists
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// Default Seed Data
const DEFAULT_FILINGS: FilingItem[] = [];

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

function safeReadJSON<T>(filePath: string, fallback: T): T {
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw.replace(/^\uFEFF/, ''));
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
    return fallback;
  }
}

// Database Operations
export function getFilings(): FilingItem[] {
  ensureDataDir();
  if (!fs.existsSync(FILINGS_FILE)) {
    fs.writeFileSync(FILINGS_FILE, JSON.stringify(DEFAULT_FILINGS, null, 2), 'utf-8');
    return DEFAULT_FILINGS;
  }
  return safeReadJSON<FilingItem[]>(FILINGS_FILE, DEFAULT_FILINGS);
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
  return safeReadJSON<WhatsAppTemplate[]>(TEMPLATES_FILE, DEFAULT_TEMPLATES);
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
  return safeReadJSON<WhatsAppSettings>(SETTINGS_FILE, DEFAULT_SETTINGS);
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
  }
];

export function getUsers(): User[] {
  ensureDataDir();
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify(DEFAULT_USERS, null, 2), 'utf-8');
    return DEFAULT_USERS;
  }
  return safeReadJSON<User[]>(USERS_FILE, DEFAULT_USERS);
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
const DEFAULT_TOOL_PURCHASES: ToolPurchase[] = [];

export function getToolPurchases(): ToolPurchase[] {
  ensureDataDir();
  if (!fs.existsSync(TOOL_PURCHASES_FILE)) {
    fs.writeFileSync(TOOL_PURCHASES_FILE, JSON.stringify(DEFAULT_TOOL_PURCHASES, null, 2), 'utf-8');
    return DEFAULT_TOOL_PURCHASES;
  }
  return safeReadJSON<ToolPurchase[]>(TOOL_PURCHASES_FILE, DEFAULT_TOOL_PURCHASES);
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
const DEFAULT_LEADS: LeadItem[] = [];

export function getLeads(): LeadItem[] {
  ensureDataDir();
  if (!fs.existsSync(LEADS_FILE)) {
    fs.writeFileSync(LEADS_FILE, JSON.stringify(DEFAULT_LEADS, null, 2), 'utf-8');
    return DEFAULT_LEADS;
  }
  return safeReadJSON<LeadItem[]>(LEADS_FILE, DEFAULT_LEADS);
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

// ----------------------------------------------------
// Payment Gateway Transactions DB
// ----------------------------------------------------
const DEFAULT_PAYMENTS: PaymentTransaction[] = [];

export function getPayments(): PaymentTransaction[] {
  ensureDataDir();
  if (!fs.existsSync(PAYMENTS_FILE)) {
    fs.writeFileSync(PAYMENTS_FILE, JSON.stringify(DEFAULT_PAYMENTS, null, 2), 'utf-8');
    return DEFAULT_PAYMENTS;
  }
  return safeReadJSON<PaymentTransaction[]>(PAYMENTS_FILE, DEFAULT_PAYMENTS);
}

export function savePayments(payments: PaymentTransaction[]): void {
  ensureDataDir();
  fs.writeFileSync(PAYMENTS_FILE, JSON.stringify(payments, null, 2), 'utf-8');
}

export function recordPayment(paymentData: Omit<PaymentTransaction, 'id' | 'createdAt'> & { id?: string }): PaymentTransaction {
  const payments = getPayments();
  const year = new Date().getFullYear();
  const randomSuffix = Math.floor(10000 + Math.random() * 90000);
  const id = paymentData.id || `TRAC-PAY-${year}-${randomSuffix}`;

  const newPayment: PaymentTransaction = {
    ...paymentData,
    id,
    createdAt: new Date().toISOString()
  };

  payments.unshift(newPayment);
  savePayments(payments);
  return newPayment;
}

export function findPaymentById(id: string): PaymentTransaction | null {
  const payments = getPayments();
  return payments.find(p => p.id === id) || null;
}

export function findPaymentByOrderId(orderId: string): PaymentTransaction | null {
  const payments = getPayments();
  return payments.find(p => p.razorpayOrderId === orderId) || null;
}

export function updatePaymentStatus(idOrOrderId: string, update: Partial<PaymentTransaction>): PaymentTransaction | null {
  const payments = getPayments();
  const idx = payments.findIndex(p => p.id === idOrOrderId || p.razorpayOrderId === idOrOrderId);
  if (idx === -1) return null;

  payments[idx] = {
    ...payments[idx],
    ...update
  };

  savePayments(payments);
  return payments[idx];
}


export type FilingStatus = 
  | 'new'
  | 'under_review'
  | 'ca_assigned'
  | 'docs_pending'
  | 'draft_ready'
  | 'filed'
  | 'completed'
  | 'rejected';

export type ServiceCategory = 
  | 'income_tax'
  | 'gst'
  | 'corporate_legal'
  | 'accounting_cma'
  | 'advisory_wealth'
  | 'licenses_certifications';

export type ServiceType = 
  | 'ITR Filing'
  | 'Company Incorporation / LLP'
  | 'GST Filing'
  | 'Income Tax Notice & Appeals'
  | 'Trademark Registration'
  | 'Tax Planning'
  | 'Trust Incorporation'
  | 'Bookkeeping & Accounting'
  | 'Capital Gain Advisory'
  | 'FSSAI License'
  | 'ISO Certification'
  | 'RSUs Advisory & Taxation'
  | 'EPF / ESI Consultation'
  | 'DSC Services'
  | 'Partnership Deeds'
  | 'MSME / Udyam Registration'
  | 'Startup Registration'
  | 'TDS Return Filing'
  | 'CMA Report & Projections'
  | 'Loans Consultancy';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'client' | 'admin';
  authProvider: 'email' | 'google';
  avatar?: string;
  unlockedTools: string[]; // e.g. ['pdf-redactor', 'tb-to-balancesheet']
  createdAt: string;
  password?: string; // hashed or simulated
}

export interface ToolItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: 'free' | 'paid';
  price: number;
  badge?: string;
  icon: string;
  features: string[];
}

export interface ToolPurchase {
  id: string; // e.g. TRAC-TOOL-8921
  userId: string;
  userName: string;
  userEmail: string;
  userPhone?: string;
  toolId: string;
  toolName: string;
  amount: number;
  paymentMode: 'UPI' | 'Card' | 'NetBanking' | 'Admin_Grant';
  paymentId: string;
  status: 'active' | 'revoked';
  createdAt: string;
}

export interface LeadItem {
  id: string;
  fullName: string;
  mobile: string;
  email?: string;
  serviceInterest: string;
  message?: string;
  city?: string;
  source: string;
  status: 'new' | 'contacted' | 'converted' | 'closed';
  createdAt: string;
}

export interface DocumentItem {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadDate: string;
  url?: string;
}

export interface NoteItem {
  id: string;
  date: string;
  author: string;
  message: string;
}

export interface TimelineStep {
  step: string;
  title: string;
  description: string;
  date: string | null;
  completed: boolean;
  current: boolean;
}

export interface FilingItem {
  id: string; // e.g. TRAC-2025-0814
  userId?: string;
  service: string;
  plan: string;
  fullName: string;
  mobile: string;
  email: string;
  panNumber?: string;
  city?: string;
  financialYear: string;
  status: FilingStatus;
  estimatedRefund?: number;
  assignedCA?: {
    name: string;
    phone: string;
    email: string;
    membershipNumber?: string;
  };
  notes: NoteItem[];
  documents: DocumentItem[];
  timeline: TimelineStep[];
  clientNotes?: string;
  createdAt: string;
  updatedAt: string;
  whatsappLogs?: {
    lastSentAt: string;
    templateId: string;
    status: 'sent' | 'failed' | 'queued';
  }[];
}

export interface WhatsAppTemplate {
  id: string;
  title: string;
  category: 'welcome' | 'docs_pending' | 'draft_ready' | 'filed' | 'notice' | 'custom';
  content: string;
  description: string;
}

export interface WhatsAppSettings {
  enabled: boolean;
  apiProvider: 'cloud_api' | 'twilio' | 'web_direct';
  businessPhone: string;
  apiKey?: string;
  phoneNumberId?: string;
  autoSendOnSubmission: boolean;
}

export interface PaymentTransaction {
  id: string; // e.g. TRAC-PAY-2025-12345
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  amount: number; // in rupees
  currency: string;
  planName: string;
  service?: string;
  payerName: string;
  payerEmail?: string;
  payerPhone: string;
  panNumber?: string;
  status: 'created' | 'paid' | 'failed';
  method?: string; // upi, card, netbanking, wallet
  createdAt: string;
  verifiedAt?: string;
  notes?: Record<string, any>;
}

export interface CAQueryItem {
  id: string; // e.g. TRAC-QRY-2025-89102
  userId?: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  category: string; // e.g. 'Income Tax Notice Scrutiny', 'GST & Input Tax Credit', etc.
  plan: 'standard' | 'priority'; // Standard Written ₹299 vs Priority Notice Desk ₹599
  amount: number; // 299 or 599
  paymentId?: string;
  orderId?: string;
  paymentStatus: 'paid' | 'pending' | 'failed';
  querySubject: string;
  queryDetails: string;
  documents?: { name: string; size: string; type?: string; dataUrl?: string }[];
  status: 'pending' | 'in_review' | 'resolved';
  assignedCA?: {
    name: string;
    membershipNumber?: string;
    phone?: string;
  };
  caResponse?: {
    caName: string;
    membershipNumber?: string;
    opinion: string;
    legalSectionsCited?: string;
    actionSteps?: string[];
    respondedAt: string;
  };
  createdAt: string;
  updatedAt: string;
}


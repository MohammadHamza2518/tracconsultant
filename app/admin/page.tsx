'use client';

import React, { useState, useEffect, useId, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Users, 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Search, 
  Filter, 
  Download, 
  Plus, 
  MessageCircle, 
  Send, 
  Phone, 
  Mail, 
  Eye, 
  Trash2, 
  Lock, 
  LogOut, 
  Settings, 
  RefreshCw,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  FileCheck,
  ShieldCheck,
  Building,
  Briefcase,
  Wrench,
  Zap,
  Check,
  X,
  Sparkles,
  DollarSign,
  Upload,
  Camera,
  Receipt
} from 'lucide-react';
import { FilingItem, FilingStatus, WhatsAppTemplate, WhatsAppSettings, User, ToolPurchase, LeadItem, PaymentTransaction, CAQueryItem } from '@/lib/types';
import { TOOLS_LIST, SERVICES_LIST } from '@/lib/data';
import { SystemConfig, DEFAULT_SYSTEM_CONFIG } from '@/lib/systemConfigDefaults';
import { compressAvatarImage } from '@/lib/imageUtils';

export default function AdminPage() {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);
  const [passcode, setPasscode] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');

  // Active Tab: filings, queries, tool_purchases, users, leads, whatsapp, pricing_config, analytics
  const [activeTab, setActiveTab] = useState<'filings' | 'queries' | 'tool_purchases' | 'users' | 'leads' | 'whatsapp' | 'pricing_config' | 'analytics'>('filings');

  // Dynamic Pricing & Tax Config State
  const [config, setConfig] = useState<SystemConfig>(DEFAULT_SYSTEM_CONFIG);
  const [savingConfig, setSavingConfig] = useState<boolean>(false);
  const [configSaveSuccess, setConfigSaveSuccess] = useState<string>('');

  // Data state
  const [filings, setFilings] = useState<FilingItem[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [toolPurchases, setToolPurchases] = useState<ToolPurchase[]>([]);
  const [payments, setPayments] = useState<PaymentTransaction[]>([]);
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [templates, setTemplates] = useState<WhatsAppTemplate[]>([]);
  const [settings, setSettings] = useState<WhatsAppSettings | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [toolsSubTab, setToolsSubTab] = useState<'tools' | 'transactions'>('tools');
  const [transactionSearchQuery, setTransactionSearchQuery] = useState<string>('');

  // CA Advisory Queries State
  const [queries, setQueries] = useState<CAQueryItem[]>([]);
  const [selectedQuery, setSelectedQuery] = useState<CAQueryItem | null>(null);
  const [queryStatusFilter, setQueryStatusFilter] = useState<'all' | 'pending' | 'in_review' | 'resolved'>('all');
  const [queryPlanFilter, setQueryPlanFilter] = useState<'all' | 'standard' | 'priority'>('all');
  const [querySearchText, setQuerySearchText] = useState<string>('');
  const [caOpinionText, setCaOpinionText] = useState<string>('');
  const [caLegalSections, setCaLegalSections] = useState<string>('');
  const [caActionSteps, setCaActionSteps] = useState<string>('');
  const [caAssignedName, setCaAssignedName] = useState<string>('Senior Chartered Accountant (FCA)');
  const [caMembershipNumber, setCaMembershipNumber] = useState<string>('ICAI #514298');
  const [isSavingQueryResponse, setIsSavingQueryResponse] = useState<boolean>(false);
  const [queryResponseSuccess, setQueryResponseSuccess] = useState<string>('');
  const [queryResponseError, setQueryResponseError] = useState<string>('');

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [serviceFilter, setServiceFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Selected Filing for Drawer / Modal
  const [selectedFiling, setSelectedFiling] = useState<FilingItem | null>(null);
  const [editStatus, setEditStatus] = useState<FilingStatus>('new');
  const [editCAName, setEditCAName] = useState<string>('');
  const [editCAPhone, setEditCAPhone] = useState<string>('');
  const [editEstimatedRefund, setEditEstimatedRefund] = useState<number | ''>('');
  const [newNote, setNewNote] = useState<string>('');
  const [savingDetails, setSavingDetails] = useState<boolean>(false);

  // Manual Grant Tool Modal
  const [grantModalOpen, setGrantModalOpen] = useState(false);
  const [grantUserId, setGrantUserId] = useState('');
  const [grantToolId, setGrantToolId] = useState('advanced-pdf-redactor');
  const [isGranting, setIsGranting] = useState(false);

  // WhatsApp Quick Action Modal
  const [waModalOpen, setWaModalOpen] = useState<boolean>(false);
  const [waTargetMobile, setWaTargetMobile] = useState<string>('');
  const [waTargetName, setWaTargetName] = useState<string>('');
  const [waSelectedTemplateId, setWaSelectedTemplateId] = useState<string>('tpl-welcome');
  const [waPreviewMessage, setWaPreviewMessage] = useState<string>('');

  // Add Manual Lead Modal
  const [addLeadModalOpen, setAddLeadModalOpen] = useState<boolean>(false);
  const [newLeadName, setNewLeadName] = useState('');
  const [newLeadMobile, setNewLeadMobile] = useState('');
  const [newLeadEmail, setNewLeadEmail] = useState('');
  const [newLeadService, setNewLeadService] = useState('ITR Filing');
  const [newLeadNotes, setNewLeadNotes] = useState('');

  // Add Manual Filing Modal
  const [addFilingModalOpen, setAddFilingModalOpen] = useState<boolean>(false);
  const [newFilingName, setNewFilingName] = useState('');
  const [newFilingMobile, setNewFilingMobile] = useState('');
  const [newFilingEmail, setNewFilingEmail] = useState('');
  const [newFilingPan, setNewFilingPan] = useState('');
  const [newFilingCity, setNewFilingCity] = useState('');
  const [newFilingService, setNewFilingService] = useState('ITR Filing');
  const [newFilingPlan, setNewFilingPlan] = useState('Salaried Basic (ITR-1)');
  const [newFilingYear, setNewFilingYear] = useState('AY 2025-26');
  const [newFilingStatus, setNewFilingStatus] = useState<FilingStatus>('new');
  const [newFilingCAName, setNewFilingCAName] = useState('Senior Tax Expert (CA)');
  const [newFilingRefund, setNewFilingRefund] = useState<number | ''>('');
  const [newFilingNotes, setNewFilingNotes] = useState('');
  const [isCreatingFiling, setIsCreatingFiling] = useState(false);

  // Search & Filter in other tabs
  const [purchaseSearchQuery, setPurchaseSearchQuery] = useState('');
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<'all' | 'clients' | 'admins'>('all');
  const [leadStatusFilter, setLeadStatusFilter] = useState('all');
  const [leadSearchQuery, setLeadSearchQuery] = useState('');

  // Edit User & DP Modal State
  const [editUserModalOpen, setEditUserModalOpen] = useState(false);
  const [selectedUserForEdit, setSelectedUserForEdit] = useState<User | null>(null);
  const [editUserName, setEditUserName] = useState('');
  const [editUserPhone, setEditUserPhone] = useState('');
  const [editUserRole, setEditUserRole] = useState<'client' | 'admin'>('client');
  const [editUserAvatar, setEditUserAvatar] = useState('');
  const [isSavingUser, setIsSavingUser] = useState(false);
  const [isUploadingAdminAvatar, setIsUploadingAdminAvatar] = useState(false);
  const [userEditSuccess, setUserEditSuccess] = useState('');
  const [userEditError, setUserEditError] = useState('');
  const adminAvatarInputRef = useRef<HTMLInputElement>(null);

  const openEditUserModal = (userToEdit: User) => {
    setSelectedUserForEdit(userToEdit);
    setEditUserName(userToEdit.name);
    setEditUserPhone(userToEdit.phone || '');
    setEditUserRole(userToEdit.role || 'client');
    setEditUserAvatar(userToEdit.avatar || '');
    setUserEditSuccess('');
    setUserEditError('');
    setEditUserModalOpen(true);
  };

  const handleAdminAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUserEditError('Please select a valid image file (JPG, PNG, WEBP).');
      return;
    }

    setIsUploadingAdminAvatar(true);
    setUserEditError('');
    try {
      const compressedDataUrl = await compressAvatarImage(file, 320, 0.82);
      setEditUserAvatar(compressedDataUrl);
    } catch (err: any) {
      setUserEditError(err.message || 'Failed to process image.');
    } finally {
      setIsUploadingAdminAvatar(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleAdminRemoveAvatar = () => {
    setEditUserAvatar('');
  };

  const handleSaveUserDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserForEdit) return;

    setIsSavingUser(true);
    setUserEditError('');
    setUserEditSuccess('');

    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selectedUserForEdit.id,
          email: selectedUserForEdit.email,
          name: editUserName.trim(),
          phone: editUserPhone.trim(),
          role: editUserRole,
          avatar: editUserAvatar
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setUserEditError(data.error || 'Failed to update user.');
        setIsSavingUser(false);
        return;
      }

      setUserEditSuccess('Client profile and DP successfully updated!');
      setUsers(prev => prev.map(u => 
        (u.id === selectedUserForEdit.id || (u.email && selectedUserForEdit.email && u.email.toLowerCase() === selectedUserForEdit.email.toLowerCase()))
          ? { ...u, name: editUserName.trim(), phone: editUserPhone.trim(), role: editUserRole, avatar: editUserAvatar } 
          : u
      ));
      setTimeout(() => {
        setEditUserModalOpen(false);
        setUserEditSuccess('');
      }, 1200);
    } catch (err: any) {
      setUserEditError(err.message || 'Failed to save changes.');
    } finally {
      setIsSavingUser(false);
    }
  };

  // Auto-login check
  useEffect(() => {
    try {
      const savedToken = localStorage.getItem('trac_admin_auth');
      if (savedToken === 'true') {
        setIsAuthenticated(true);
        fetchAdminData();
      }
    } finally {
      setIsCheckingAuth(false);
    }
  }, []);

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAuthError('');
    if (passcode === 'admin123' || passcode === 'trac2025' || passcode === 'admin') {
      setIsAuthenticated(true);
      localStorage.setItem('trac_admin_auth', 'true');
      fetchAdminData();
    } else {
      setAuthError('Incorrect passcode. Use default: admin123 or trac2025');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('trac_admin_auth');
  };

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [fRes, uRes, pRes, lRes, tRes, cRes, txRes, qRes] = await Promise.all([
        fetch('/api/filings'),
        fetch('/api/admin/users'),
        fetch('/api/admin/tools-access'),
        fetch('/api/leads'),
        fetch('/api/whatsapp/templates'),
        fetch('/api/admin/config'),
        fetch('/api/payment/transactions'),
        fetch('/api/admin/queries')
      ]);

      const fData = await fRes.json();
      const uData = await uRes.json();
      const pData = await pRes.json();
      const lData = await lRes.json();
      const tData = await tRes.json();
      const cData = await cRes.json();
      const txData = await txRes.json();
      const qData = await qRes.json();

      if (fData.success) setFilings(fData.data || []);
      if (uData.users) setUsers(uData.users || []);
      if (pData.purchases) setToolPurchases(pData.purchases || []);
      if (txData.success && txData.payments) setPayments(txData.payments || []);
      if (lData.leads) setLeads(lData.leads || []);
      if (tData.success) {
        setTemplates(tData.templates || []);
        setSettings(tData.settings || null);
      }
      if (cData.success && cData.config) {
        setConfig(cData.config);
      }
      if (qData.success && qData.queries) {
        setQueries(qData.queries || []);
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Save Dynamic Pricing & Tax Config
  const handleSaveConfig = async () => {
    setSavingConfig(true);
    setConfigSaveSuccess('');
    try {
      const res = await fetch('/api/admin/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config, updatedBy: 'Lead CA Partner' })
      });
      const data = await res.json();
      if (res.ok) {
        setConfigSaveSuccess('✓ All tax rates and pricing updated and applied across the platform!');
        if (data.config) setConfig(data.config);
        setTimeout(() => setConfigSaveSuccess(''), 4000);
      } else {
        alert(data.error || 'Failed to save configuration');
      }
    } catch (e: any) {
      alert('Error saving rates: ' + e.message);
    } finally {
      setSavingConfig(false);
    }
  };

  // Reset to Defaults
  const handleResetConfig = async () => {
    if (!confirm('Are you sure you want to reset all rates and pricing to Union Budget defaults?')) return;
    setSavingConfig(true);
    try {
      const res = await fetch('/api/admin/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset' })
      });
      const data = await res.json();
      if (res.ok && data.config) {
        setConfig(data.config);
        setConfigSaveSuccess('✓ Successfully reset to default Budget FY 2024-25 rates.');
        setTimeout(() => setConfigSaveSuccess(''), 3000);
      }
    } catch (e: any) {
      alert('Reset error: ' + e.message);
    } finally {
      setSavingConfig(false);
    }
  };

  // Toggle tool purchase status (active/revoked)
  const handleTogglePurchase = async (purchaseId: string) => {
    try {
      const res = await fetch('/api/admin/tools-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle_purchase', purchaseId })
      });
      if (res.ok) {
        fetchAdminData();
      }
    } catch (e) {
      alert('Failed to toggle purchase status');
    }
  };

  // Manual grant tool to user
  const handleManualGrant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!grantUserId || !grantToolId) return;
    setIsGranting(true);
    try {
      const selectedTool = TOOLS_LIST.find(t => t.id === grantToolId);
      const selectedUser = users.find(u => u.id === grantUserId);
      const res = await fetch('/api/admin/tools-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'manual_grant',
          userId: grantUserId,
          userName: selectedUser?.name || 'Client',
          userEmail: selectedUser?.email || '',
          toolId: grantToolId,
          toolName: selectedTool?.name || grantToolId
        })
      });
      if (res.ok) {
        setGrantModalOpen(false);
        fetchAdminData();
      }
    } catch (e) {
      alert('Error granting tool access');
    } finally {
      setIsGranting(false);
    }
  };

  // Update Lead Status
  const handleUpdateLead = async (leadId: string, status: LeadItem['status']) => {
    try {
      const res = await fetch('/api/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId, status })
      });
      if (res.ok) {
        fetchAdminData();
      }
    } catch (e) {
      alert('Failed to update lead status');
    }
  };

  // Delete Lead
  const handleDeleteLead = async (leadId: string) => {
    if (!confirm('Are you sure you want to remove this consultation lead?')) return;
    try {
      const res = await fetch(`/api/leads?id=${leadId}`, { method: 'DELETE' });
      if (res.ok) {
        fetchAdminData();
      } else {
        alert('Failed to delete lead');
      }
    } catch (e) {
      alert('Error deleting lead');
    }
  };

  // Create Manual Filing
  const handleCreateFiling = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFilingName.trim() || !newFilingMobile.trim()) {
      alert('Full Name and Mobile are required');
      return;
    }
    setIsCreatingFiling(true);
    try {
      const res = await fetch('/api/filings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: newFilingName.trim(),
          mobile: newFilingMobile.trim(),
          email: newFilingEmail.trim(),
          panNumber: newFilingPan.trim().toUpperCase(),
          city: newFilingCity.trim() || 'India',
          service: newFilingService,
          plan: newFilingPlan,
          financialYear: newFilingYear,
          status: newFilingStatus,
          estimatedRefund: newFilingRefund !== '' ? Number(newFilingRefund) : undefined,
          assignedCA: {
            name: newFilingCAName || 'Senior Tax Expert (CA)',
            phone: '7275922162',
            email: 'contact@tracconsultant.com'
          },
          clientNotes: newFilingNotes.trim()
        })
      });
      if (res.ok) {
        setAddFilingModalOpen(false);
        setNewFilingName('');
        setNewFilingMobile('');
        setNewFilingEmail('');
        setNewFilingPan('');
        setNewFilingNotes('');
        setNewFilingRefund('');
        await fetchAdminData();
      } else {
        const d = await res.json();
        alert(d.error || 'Failed to create filing');
      }
    } catch (e: any) {
      alert('Error creating filing: ' + e.message);
    } finally {
      setIsCreatingFiling(false);
    }
  };

  // Delete Filing
  const handleDeleteFiling = async (filingId: string) => {
    if (!confirm(`Are you sure you want to delete filing ${filingId}? This will remove it from client tracking.`)) return;
    try {
      const res = await fetch(`/api/filings/${filingId}`, { method: 'DELETE' });
      if (res.ok) {
        setSelectedFiling(null);
        await fetchAdminData();
      } else {
        alert('Failed to delete filing');
      }
    } catch (e) {
      alert('Error deleting filing');
    }
  };

  // Send WhatsApp Template Shortcut
  const sendWhatsAppTemplateToClient = (filing: FilingItem, templateType: 'welcome' | 'docs' | 'draft' | 'filed') => {
    const refundFormatted = filing.estimatedRefund ? `₹${filing.estimatedRefund.toLocaleString('en-IN')}` : '₹0';
    let text = '';
    if (templateType === 'welcome') {
      text = `Hello ${filing.fullName}! 🚀\n\nThank you for choosing *Tracconsultant* for your *${filing.service}* (Application Ref: *${filing.id}*).\n\nYour file has been assigned to our Chartered Accountant team (Lead: ${filing.assignedCA?.name || 'Senior CA Desk'}). We are examining your details and will connect with you right here on WhatsApp.\n\n📞 Direct CA Helpline: +91 7275922162\n\n*Tracconsultant — Tax Filing | Compliance | Business Support*`;
    } else if (templateType === 'docs') {
      text = `Hi ${filing.fullName},\n\nRegarding your filing *${filing.id}* with *Tracconsultant*:\n\nOur CA needs additional documents (Form 16 / Bank Statement / AIS / Sales Ledger) to finalize your computation and claim your maximum tax refund.\n\nPlease reply with the documents attached here.\n\nHelpline: +91 7275922162`;
    } else if (templateType === 'draft') {
      text = `Great news ${filing.fullName}! 🎉\n\nYour tax computation for application *${filing.id}* is ready.\n\n💰 *Estimated Refund Claimed:* ${refundFormatted}\n🛡️ Optimized under latest Budget slabs with 100% Notice Protection.\n\nPlease reply *'YES'* to approve for instant Govt portal filing.`;
    } else if (templateType === 'filed') {
      text = `Congratulations ${filing.fullName}! 🏆\n\nYour *${filing.service}* has been successfully filed with the Government Department (Application Ref: *${filing.id}*).\n\nYour official filing acknowledgement has been verified and generated.\n\nSave our number (+91 7275922162) for year-round tax advisory & notice protection.`;
    }

    const cleanPhone = (filing.mobile || '').replace(/\D/g, '').slice(-10);
    window.open(`https://wa.me/91${cleanPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  // KPI Calculations
  const totalFilings = filings.length;
  const totalRegisteredAccounts = users.length;
  const adminAccountsCount = users.filter(u => u.role === 'admin' || u.role?.toLowerCase() === 'admin').length;
  const clientAccountsCount = users.filter(u => u.role !== 'admin' && u.role?.toLowerCase() !== 'admin').length;
  const totalRegisteredUsers = totalRegisteredAccounts;
  const totalToolPurchasesCount = toolPurchases.length;
  const totalToolRevenue = toolPurchases.reduce((acc, p) => acc + (p.status === 'active' ? p.amount : 0), 0);
  const totalServicePayments = payments.filter(p => p.status === 'paid' && !p.notes?.toolId);
  const totalServiceRevenue = totalServicePayments.reduce((acc, p) => acc + (p.amount || 0), 0);
  const totalQueries = queries.length;
  const pendingQueriesCount = queries.filter(q => q.status !== 'resolved').length;
  const resolvedQueriesCount = queries.filter(q => q.status === 'resolved').length;
  const totalQueryRevenue = queries.filter(q => q.paymentStatus === 'paid').reduce((acc, q) => acc + (q.amount || 0), 0);
  const totalPlatformRevenue = totalToolRevenue + totalServiceRevenue + totalQueryRevenue;
  const pendingReviews = filings.filter(f => f.status === 'new' || f.status === 'under_review').length;
  const inProgress = filings.filter(f => f.status === 'ca_assigned' || f.status === 'draft_ready').length;
  const completedFilings = filings.filter(f => f.status === 'filed' || f.status === 'completed').length;

  // Filtered queries
  const filteredQueries = queries.filter(q => {
    const matchesSearch = 
      q.id.toLowerCase().includes(querySearchText.toLowerCase()) ||
      q.clientName.toLowerCase().includes(querySearchText.toLowerCase()) ||
      q.clientPhone.includes(querySearchText) ||
      q.clientEmail.toLowerCase().includes(querySearchText.toLowerCase()) ||
      q.querySubject.toLowerCase().includes(querySearchText.toLowerCase()) ||
      q.category.toLowerCase().includes(querySearchText.toLowerCase());

    const matchesStatus = queryStatusFilter === 'all' || q.status === queryStatusFilter;
    const matchesPlan = queryPlanFilter === 'all' || q.plan === queryPlanFilter;

    return matchesSearch && matchesStatus && matchesPlan;
  });

  // Query Actions
  const openQueryDrawer = (query: CAQueryItem) => {
    setSelectedQuery(query);
    setCaOpinionText(query.caResponse?.opinion || '');
    setCaLegalSections(query.caResponse?.legalSectionsCited || '');
    setCaActionSteps((query.caResponse?.actionSteps || []).join('\n'));
    setCaAssignedName(query.caResponse?.caName || query.assignedCA?.name || 'Senior Chartered Accountant (FCA)');
    setCaMembershipNumber(query.caResponse?.membershipNumber || query.assignedCA?.membershipNumber || 'ICAI #514298');
    setQueryResponseSuccess('');
    setQueryResponseError('');
  };

  const handleSaveQueryResponse = async (status: 'in_review' | 'resolved' = 'resolved') => {
    if (!selectedQuery) return;
    setIsSavingQueryResponse(true);
    setQueryResponseError('');
    setQueryResponseSuccess('');

    try {
      const actionStepsArray = caActionSteps
        .split('\n')
        .map(s => s.trim())
        .filter(Boolean);

      const res = await fetch(`/api/admin/queries/${selectedQuery.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          assignedCA: {
            name: caAssignedName,
            membershipNumber: caMembershipNumber,
            phone: '7275922162'
          },
          caResponse: {
            caName: caAssignedName,
            membershipNumber: caMembershipNumber,
            opinion: caOpinionText,
            legalSectionsCited: caLegalSections,
            actionSteps: actionStepsArray
          }
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setQueryResponseError(data.error || 'Failed to save CA response');
        setIsSavingQueryResponse(false);
        return;
      }

      setQueryResponseSuccess('Legal Opinion & Advice saved successfully! Public tracking updated.');
      setQueries(prev => prev.map(q => q.id === selectedQuery.id ? data.query : q));
      setSelectedQuery(data.query);
      setTimeout(() => setQueryResponseSuccess(''), 3500);
    } catch (err: any) {
      setQueryResponseError(err.message || 'Error saving response');
    } finally {
      setIsSavingQueryResponse(false);
    }
  };

  const handleDeleteQuery = async (queryId: string) => {
    if (!confirm(`Are you sure you want to delete query ${queryId}?`)) return;
    try {
      const res = await fetch(`/api/admin/queries/${queryId}`, { method: 'DELETE' });
      if (res.ok) {
        setQueries(prev => prev.filter(q => q.id !== queryId));
        if (selectedQuery?.id === queryId) setSelectedQuery(null);
      }
    } catch (e: any) {
      alert('Failed to delete query: ' + e.message);
    }
  };

  const sendQueryWhatsApp = (query: CAQueryItem) => {
    const cleanPhone = (query.clientPhone || '').replace(/\D/g, '').slice(-10);
    const opinionSnippet = query.caResponse?.opinion 
      ? `\n\n📋 *CA Legal Opinion Summary:*\n${query.caResponse.opinion.slice(0, 250)}...`
      : '';
    const text = `Hello ${query.clientName}! 👋\n\nRegarding your consultation query *${query.id}* (${query.querySubject}):\n\nOur Senior Chartered Accountant (${query.caResponse?.caName || 'ICAI Panel'}) has reviewed your case.${opinionSnippet}\n\n🔗 *Track your case & view full signed opinion:* https://tracconsultant.com/track?q=${query.id}\n\nFeel free to reply here if you have any questions!`;
    window.open(`https://wa.me/91${cleanPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  // Filtered filings
  const filteredFilings = filings.filter(f => {
    const matchesSearch = 
      f.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.mobile.includes(searchQuery) ||
      f.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesService = serviceFilter === 'all' || f.service.toLowerCase().includes(serviceFilter.toLowerCase());
    const matchesStatus = statusFilter === 'all' || f.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesService && matchesStatus;
  });

  // Open Lead Drawer
  const openLeadDrawer = (filing: FilingItem) => {
    setSelectedFiling(filing);
    setEditStatus(filing.status);
    setEditCAName(filing.assignedCA?.name || 'Senior Tax Expert (CA)');
    setEditCAPhone(filing.assignedCA?.phone || '7275922162');
    setEditEstimatedRefund(filing.estimatedRefund !== undefined ? filing.estimatedRefund : '');
    setNewNote('');
  };

  // Save Filing Updates
  const saveLeadUpdates = async () => {
    if (!selectedFiling) return;
    setSavingDetails(true);

    try {
      const updates: Partial<FilingItem> = {
        status: editStatus,
        estimatedRefund: editEstimatedRefund !== '' ? Number(editEstimatedRefund) : undefined,
        assignedCA: {
          name: editCAName || 'Senior Tax Expert (CA)',
          phone: editCAPhone || '7275922162',
          email: 'contact@tracconsultant.com'
        }
      };

      if (newNote.trim()) {
        const existingNotes = selectedFiling.notes || [];
        updates.notes = [
          ...existingNotes,
          {
            id: `n-${Date.now()}`,
            date: new Date().toISOString(),
            author: editCAName || 'CA Desk',
            message: newNote.trim()
          }
        ];
      }

      const res = await fetch(`/api/filings/${selectedFiling.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });

      if (res.ok) {
        await fetchAdminData();
        setSelectedFiling(null);
      }
    } catch (e) {
      alert('Failed to save filing details');
    } finally {
      setSavingDetails(false);
    }
  };

  // Export CSV
  const exportFilingsCSV = () => {
    const headers = ['ID', 'Client Name', 'Mobile', 'Email', 'Service', 'Status', 'Assigned CA', 'Date'];
    const rows = filings.map(f => [
      f.id,
      `"${f.fullName}"`,
      f.mobile,
      f.email,
      `"${f.service}"`,
      f.status,
      `"${f.assignedCA?.name || ''}"`,
      f.createdAt
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = `tracconsultant_filings_${Date.now()}.csv`;
    link.click();
  };

  // CHECKING AUTH STATE - ELIMINATES LOGIN FORM FLICKER ON REFRESH
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="w-10 h-10 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs text-slate-400 font-medium tracking-wide">Validating Admin Gateway...</p>
      </div>
    );
  }

  // LOGIN SCREEN - DEDICATED FULL-SCREEN SECURE GATEWAY
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-[#071324] flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Back to public website link at top left */}
        <div className="absolute top-6 left-6 z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-900/80 border border-slate-800 hover:border-slate-700 px-3.5 py-2 rounded-xl transition-all shadow-sm backdrop-blur"
          >
            <span>← Return to Public Website</span>
          </Link>
        </div>

        <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl space-y-6 relative z-10 border border-slate-100">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-emerald-400 text-[10px] font-bold tracking-wider uppercase mb-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Restricted CA Admin Gateway</span>
            </div>

            <div className="relative w-16 h-16 mx-auto my-2">
              <Image 
                src="/logo.png" 
                alt="Tracconsultant" 
                fill 
                className="object-contain" 
              />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Executive Admin Portal</h2>
            <p className="text-xs text-slate-500">Supervised by <strong>Chartered Accountants (ICAI Panel)</strong> • 20 Services & Compliance Suite Control</p>
          </div>

          {authError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Admin Passcode / PIN
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  placeholder="Enter admin passcode"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="w-full text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>Unlock Admin Control Center</span>
            </button>
          </form>

          {/* Quick autofill helper for easy testing */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-400 text-[11px]">Quick Demo Fill:</span>
            <button
              type="button"
              onClick={() => {
                setPasscode('admin123');
                localStorage.setItem('trac_admin_auth', 'true');
                setIsAuthenticated(true);
                fetchAdminData();
              }}
              className="px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 font-bold rounded-lg text-[11px] transition-colors flex items-center gap-1"
            >
              <span>🔑 Fill admin123 & Login</span>
            </button>
          </div>

          <div className="pt-2 text-center text-[11px] text-slate-400 space-y-1">
            <div>🔒 256-Bit SSL Encrypted • ICAI Regulatory Compliance</div>
            <div className="text-[10px] text-slate-400">Authorized Tracconsultant Chartered Accountants Only</div>
          </div>
        </div>
      </div>
    );
  }

  // MAIN DEDICATED ADMIN DASHBOARD
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Standalone Admin Top Header */}
      <header className="bg-slate-950 text-white px-4 sm:px-8 py-3.5 sticky top-0 z-40 border-b border-slate-800 shadow-xl">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="flex items-center gap-2.5">
              <div className="relative w-9 h-9 flex-shrink-0">
                <Image 
                  src="/logo.png" 
                  alt="TC" 
                  fill 
                  className="object-contain" 
                />
              </div>
              <div>
                <div className="font-extrabold text-base tracking-tight leading-none">
                  TR<span className="text-[#C9933B]">A</span>C<span className="text-emerald-400 ml-1 font-bold">ADMIN</span>
                </div>
                <div className="text-[9px] uppercase tracking-widest text-slate-400 font-semibold mt-0.5">
                  Executive CA Control Center
                </div>
              </div>
            </Link>

            <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>System Live • Hostinger Node.js</span>
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            {/* Lead CA Profile Badge */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-slate-900 border border-slate-800 rounded-xl text-slate-300">
              <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">
                CA
              </div>
              <span className="text-[11px] font-semibold">CA Operations Desk (Admin)</span>
            </div>

            <button
              onClick={fetchAdminData}
              disabled={loading}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 transition-colors"
              title="Open Public Website in New Tab"
            >
              <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
              <span>Live Website</span>
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-300 font-semibold transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 flex-1 w-full space-y-6">
        
        {/* KPI Executive Summary Row */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-1">
              <span>Total Filings</span>
              <FileText className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">{totalFilings}</div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-1">Active Client Cases</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-1">
              <span>Registered Accounts</span>
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">{totalRegisteredAccounts}</div>
            <div className="text-[11px] text-blue-600 font-semibold mt-1">
              {clientAccountsCount} Clients • {adminAccountsCount} Admins
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-1">
              <span>Platform Revenue</span>
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">₹{totalPlatformRevenue.toLocaleString('en-IN')}</div>
            <div className="text-[11px] text-emerald-700 font-semibold mt-1">₹{totalToolRevenue.toLocaleString('en-IN')} Tools • ₹{totalServiceRevenue.toLocaleString('en-IN')} Services • ₹{totalQueryRevenue.toLocaleString('en-IN')} CA Desk</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-1">
              <span>Service Inquiries</span>
              <MessageCircle className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-purple-600">{leads.length}</div>
            <div className="text-[11px] text-purple-600 font-semibold mt-1">Leads & Consultations</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-1">
              <span>Completed / Filed</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-600">{completedFilings}</div>
            <div className="text-[11px] text-slate-500 font-semibold mt-1">ITR-V Verified</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 gap-2 sm:gap-6 overflow-x-auto text-xs font-bold text-slate-600">
          <button
            onClick={() => setActiveTab('filings')}
            className={`pb-3 px-2 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'filings'
                ? 'border-emerald-600 text-emerald-700 font-black'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>20 Services Filings ({filings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('queries')}
            className={`pb-3 px-2 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'queries'
                ? 'border-amber-600 text-amber-700 font-black'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            <span>CA Advisory Desk ({queries.length})</span>
            {pendingQueriesCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500 text-white animate-pulse">
                {pendingQueriesCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('tool_purchases')}
            className={`pb-3 px-2 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'tool_purchases'
                ? 'border-indigo-600 text-indigo-700 font-black'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>Paid Tools & Subscriptions ({toolPurchases.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`pb-3 px-2 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'users'
                ? 'border-blue-600 text-blue-700 font-black'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Registered Accounts ({totalRegisteredAccounts})</span>
          </button>

          <button
            onClick={() => setActiveTab('leads')}
            className={`pb-3 px-2 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'leads'
                ? 'border-purple-600 text-purple-700 font-black'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            <span>Consultation Leads CRM ({leads.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('whatsapp')}
            className={`pb-3 px-2 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'whatsapp'
                ? 'border-emerald-600 text-emerald-700 font-black'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>WhatsApp Automation</span>
          </button>

          <button
            onClick={() => setActiveTab('pricing_config')}
            className={`pb-3 px-2 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'pricing_config'
                ? 'border-amber-600 text-amber-700 font-black'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Rates & Annual Pricing Engine</span>
          </button>
        </div>

        {/* TAB 1: FILINGS PIPELINE */}
        {activeTab === 'filings' && (
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-5">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Client Filings & Case Pipeline</h3>
                <p className="text-xs text-slate-500">Manage 20 services lifecycle, CA assignments & documents</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setAddFilingModalOpen(true)}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Create New Filing</span>
                </button>
                <button
                  onClick={exportFilingsCSV}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search client name, ID, phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <select
                value={serviceFilter}
                onChange={(e) => setServiceFilter(e.target.value)}
                className="w-full p-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
              >
                <option value="all">All Services</option>
                {SERVICES_LIST.map(s => (
                  <option key={s.id} value={s.title}>{s.title}</option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full p-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
              >
                <option value="all">All Statuses</option>
                <option value="new">New</option>
                <option value="under_review">Under Review</option>
                <option value="ca_assigned">CA Assigned</option>
                <option value="draft_ready">Draft Ready</option>
                <option value="filed">Filed on Govt Portal</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Filings Table */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">ID / Client</th>
                    <th className="p-3">Service & Plan</th>
                    <th className="p-3">Assigned CA</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Est. Refund</th>
                    <th className="p-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredFilings.map((filing) => (
                    <tr key={filing.id} className="hover:bg-slate-50">
                      <td className="p-3">
                        <div className="font-bold text-slate-900">{filing.fullName}</div>
                        <div className="font-mono text-[10px] text-slate-400">{filing.id} • {filing.mobile}</div>
                      </td>
                      <td className="p-3">
                        <div className="font-semibold text-slate-800">{filing.service}</div>
                        <div className="text-[10px] text-slate-400 truncate max-w-[160px]">{filing.plan}</div>
                      </td>
                      <td className="p-3 text-slate-700 font-medium">
                        {filing.assignedCA?.name || 'Unassigned'}
                      </td>
                      <td className="p-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          filing.status === 'completed' || filing.status === 'filed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : filing.status === 'draft_ready'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {filing.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-emerald-700">
                        {filing.estimatedRefund ? `₹${filing.estimatedRefund.toLocaleString('en-IN')}` : '-'}
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => openLeadDrawer(filing)}
                          className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-[10px] transition-colors"
                        >
                          Manage Case
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: CA ADVISORY & PAID CONSULTATION DESK */}
        {activeTab === 'queries' && (
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">CA Advisory & Legal Opinion Desk</h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                    Paid ₹299 / ₹599 Consultations
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Review tax notices, draft authoritative legal opinions, cite statutory sections & notify clients
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/consult-ca"
                  target="_blank"
                  className="px-3.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Public Portal</span>
                </Link>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Total Queries</span>
                <span className="text-xl font-black text-slate-900">{totalQueries}</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">All received cases</span>
              </div>

              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200">
                <span className="text-[10px] font-bold text-amber-700 uppercase block">Pending Review</span>
                <span className="text-xl font-black text-amber-800">{pendingQueriesCount}</span>
                <span className="text-[10px] text-amber-700 block mt-0.5">Needs CA written opinion</span>
              </div>

              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
                <span className="text-[10px] font-bold text-emerald-700 uppercase block">Resolved Opinions</span>
                <span className="text-xl font-black text-emerald-800">{resolvedQueriesCount}</span>
                <span className="text-[10px] text-emerald-700 block mt-0.5">Delivered to client</span>
              </div>

              <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-200">
                <span className="text-[10px] font-bold text-indigo-700 uppercase block">Advisory Revenue</span>
                <span className="text-xl font-black text-indigo-900">₹{totalQueryRevenue.toLocaleString('en-IN')}</span>
                <span className="text-[10px] text-indigo-700 block mt-0.5">100% Collected via Razorpay</span>
              </div>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search client, query ID, phone, topic..."
                  value={querySearchText}
                  onChange={(e) => setQuerySearchText(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center gap-2 text-xs flex-wrap">
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                  {(['all', 'pending', 'in_review', 'resolved'] as const).map(st => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setQueryStatusFilter(st)}
                      className={`px-3 py-1 rounded-lg font-bold capitalize transition-colors cursor-pointer text-xs ${
                        queryStatusFilter === st
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {st.replace('_', ' ')}
                    </button>
                  ))}
                </div>

                <select
                  value={queryPlanFilter}
                  onChange={(e: any) => setQueryPlanFilter(e.target.value)}
                  className="bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 font-bold text-slate-700 text-xs focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="all">All Tiers</option>
                  <option value="standard">Standard (₹299)</option>
                  <option value="priority">Priority Notice (₹599)</option>
                </select>
              </div>
            </div>

            {/* Queries Table */}
            {filteredQueries.length > 0 ? (
              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-900 text-white font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-3">Query ID & Date</th>
                      <th className="p-3">Client Details</th>
                      <th className="p-3">Tier & Paid</th>
                      <th className="p-3">Category & Subject</th>
                      <th className="p-3">Documents</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredQueries.map((query) => (
                      <tr key={query.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3">
                          <span className="font-mono font-bold text-slate-900 block">{query.id}</span>
                          <span className="text-[10px] text-slate-400">
                            {new Date(query.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                          </span>
                        </td>

                        <td className="p-3">
                          <span className="font-bold text-slate-900 block">{query.clientName}</span>
                          <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                            <a href={`tel:${query.clientPhone}`} className="text-emerald-700 hover:underline">
                              {query.clientPhone}
                            </a>
                            <span>•</span>
                            <span className="truncate max-w-[120px]">{query.clientEmail}</span>
                          </div>
                        </td>

                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold block w-max ${
                            query.plan === 'priority'
                              ? 'bg-rose-100 text-rose-800 border border-rose-200'
                              : 'bg-indigo-100 text-indigo-800'
                          }`}>
                            {query.plan === 'priority' ? '⚡ Priority ₹599' : 'Standard ₹299'}
                          </span>
                          <span className="text-[10px] text-emerald-700 font-bold mt-1 block">
                            ✓ Paid (Razorpay)
                          </span>
                        </td>

                        <td className="p-3 max-w-xs">
                          <span className="text-[10px] uppercase font-bold text-slate-500 block truncate">
                            {query.category}
                          </span>
                          <span className="font-bold text-slate-900 block truncate" title={query.querySubject}>
                            {query.querySubject}
                          </span>
                        </td>

                        <td className="p-3">
                          {query.documents && query.documents.length > 0 ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 rounded-md text-[10px] font-semibold text-slate-700">
                              <FileText className="w-3 h-3 text-red-500" />
                              <span>{query.documents.length} File{query.documents.length > 1 ? 's' : ''}</span>
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400">None</span>
                          )}
                        </td>

                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                            query.status === 'resolved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : query.status === 'in_review'
                              ? 'bg-amber-100 text-amber-800 animate-pulse'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {query.status.replace('_', ' ')}
                          </span>
                        </td>

                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => openQueryDrawer(query)}
                              className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-[10px] transition-colors cursor-pointer"
                            >
                              Draft Opinion
                            </button>

                            <button
                              type="button"
                              onClick={() => sendQueryWhatsApp(query)}
                              className="p-1 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                              title="WhatsApp Client"
                            >
                              <MessageCircle className="w-4 h-4" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteQuery(query.id)}
                              className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Delete Query"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-12 text-center text-slate-400 space-y-2 border border-dashed border-slate-200 rounded-2xl">
                <ShieldCheck className="w-8 h-8 mx-auto text-slate-300" />
                <p className="text-xs font-semibold text-slate-600">No consultation queries found matching your filters.</p>
                <p className="text-[11px] text-slate-400">
                  Clients who submit and pay ₹299 / ₹599 on the Consult a CA page will appear here instantly.
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PAID TOOLS & SUBSCRIPTIONS */}
        {activeTab === 'tool_purchases' && (
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-5">
            {/* Sub-tab Navigation */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setToolsSubTab('tools')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    toolsSubTab === 'tools'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Wrench className="w-3.5 h-3.5" />
                  <span>Tool Licenses & Access ({toolPurchases.length})</span>
                </button>
                <button
                  onClick={() => setToolsSubTab('transactions')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    toolsSubTab === 'transactions'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Receipt className="w-3.5 h-3.5" />
                  <span>Fee Invoices & Gateway Transactions ({payments.length})</span>
                </button>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={toolsSubTab === 'tools' ? purchaseSearchQuery : transactionSearchQuery}
                    onChange={(e) => toolsSubTab === 'tools' ? setPurchaseSearchQuery(e.target.value) : setTransactionSearchQuery(e.target.value)}
                    placeholder={toolsSubTab === 'tools' ? "Search client, tool, order ID..." : "Search payer, receipt, ID..."}
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
                  />
                </div>
                {toolsSubTab === 'tools' && (
                  <button
                    onClick={() => setGrantModalOpen(true)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Manual Tool Grant</span>
                  </button>
                )}
              </div>
            </div>

            {/* Sub-view 1: Tool Purchases & Access Table */}
            {toolsSubTab === 'tools' && (
              <div className="border border-slate-200 rounded-2xl overflow-hidden overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Order ID / Date</th>
                      <th className="p-3">Client</th>
                      <th className="p-3">Tool Unlocked</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Payment Mode</th>
                      <th className="p-3">Access Status</th>
                      <th className="p-3 text-center">Toggle Access</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {toolPurchases.filter(p => {
                      if (!purchaseSearchQuery.trim()) return true;
                      const q = purchaseSearchQuery.toLowerCase();
                      return p.userName.toLowerCase().includes(q) ||
                             p.userEmail.toLowerCase().includes(q) ||
                             p.toolName.toLowerCase().includes(q) ||
                             p.id.toLowerCase().includes(q);
                    }).map((purchase) => (
                      <tr key={purchase.id} className="hover:bg-slate-50">
                        <td className="p-3">
                          <div className="font-mono font-bold text-slate-900">{purchase.id}</div>
                          <div className="text-[10px] text-slate-400">{new Date(purchase.createdAt).toLocaleDateString('en-IN')}</div>
                        </td>
                        <td className="p-3">
                          <div className="font-bold text-slate-800">{purchase.userName}</div>
                          <div className="text-[10px] text-slate-400">{purchase.userEmail} {purchase.userPhone && `• ${purchase.userPhone}`}</div>
                        </td>
                        <td className="p-3">
                          <span className="font-semibold text-indigo-900 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                            {purchase.toolName}
                          </span>
                        </td>
                        <td className="p-3 font-mono font-bold text-slate-800">
                          ₹{purchase.amount}
                        </td>
                        <td className="p-3">
                          <span className="text-[10px] font-bold uppercase bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                            {purchase.paymentMode}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            purchase.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {purchase.status === 'active' ? '✓ Active Access' : 'Revoked'}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => handleTogglePurchase(purchase.id)}
                            className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                              purchase.status === 'active'
                                ? 'bg-red-50 text-red-700 hover:bg-red-100'
                                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            }`}
                          >
                            {purchase.status === 'active' ? 'Revoke Access' : 'Grant Access'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Sub-view 2: All Gateway Payments & Invoices Table */}
            {toolsSubTab === 'transactions' && (
              <div className="border border-slate-200 rounded-2xl overflow-hidden overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Receipt / Payment ID</th>
                      <th className="p-3">Payer Details</th>
                      <th className="p-3">Service / Item</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Date</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {payments.filter(p => {
                      if (!transactionSearchQuery.trim()) return true;
                      const q = transactionSearchQuery.toLowerCase();
                      return p.payerName.toLowerCase().includes(q) ||
                             (p.payerEmail && p.payerEmail.toLowerCase().includes(q)) ||
                             p.payerPhone.includes(q) ||
                             p.id.toLowerCase().includes(q) ||
                             (p.razorpayPaymentId && p.razorpayPaymentId.toLowerCase().includes(q)) ||
                             p.planName.toLowerCase().includes(q);
                    }).map((payment) => (
                      <tr key={payment.id} className="hover:bg-slate-50">
                        <td className="p-3">
                          <div className="font-mono font-bold text-slate-900">{payment.id}</div>
                          {payment.razorpayPaymentId ? (
                            <div className="text-[10px] font-mono text-slate-400">Ref: {payment.razorpayPaymentId}</div>
                          ) : (
                            <div className="text-[10px] font-mono text-slate-400">Order: {payment.razorpayOrderId?.slice(-10)}</div>
                          )}
                        </td>
                        <td className="p-3">
                          <div className="font-bold text-slate-800">{payment.payerName}</div>
                          <div className="text-[10px] text-slate-400">
                            {payment.payerEmail && `${payment.payerEmail} • `}
                            {payment.payerPhone}
                            {payment.panNumber && ` • PAN: ${payment.panNumber}`}
                          </div>
                        </td>
                        <td className="p-3">
                          <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                            {payment.planName || payment.service || 'CA Engagement'}
                          </span>
                        </td>
                        <td className="p-3 font-mono font-extrabold text-slate-900">
                          ₹{payment.amount}
                        </td>
                        <td className="p-3 text-slate-500">
                          {new Date(payment.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="p-3">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            payment.status === 'paid' 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : payment.status === 'created'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {payment.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {payments.length === 0 && (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-400">
                          No payment transactions recorded yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: REGISTERED ACCOUNTS */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-5">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Registered Accounts ({totalRegisteredAccounts})</h3>
                <p className="text-xs text-slate-500">
                  Google OAuth &amp; Email accounts • {clientAccountsCount} Clients, {adminAccountsCount} Admins
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                <div className="flex p-0.5 bg-slate-100 rounded-xl text-[11px] font-bold">
                  <button
                    onClick={() => setUserRoleFilter('all')}
                    className={`px-2.5 py-1 rounded-lg transition-colors ${
                      userRoleFilter === 'all' ? 'bg-white text-blue-700 shadow-xs font-black' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    All ({totalRegisteredAccounts})
                  </button>
                  <button
                    onClick={() => setUserRoleFilter('clients')}
                    className={`px-2.5 py-1 rounded-lg transition-colors ${
                      userRoleFilter === 'clients' ? 'bg-white text-blue-700 shadow-xs font-black' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Clients ({clientAccountsCount})
                  </button>
                  <button
                    onClick={() => setUserRoleFilter('admins')}
                    className={`px-2.5 py-1 rounded-lg transition-colors ${
                      userRoleFilter === 'admins' ? 'bg-white text-blue-700 shadow-xs font-black' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Admins ({adminAccountsCount})
                  </button>
                </div>

                <div className="relative w-full sm:w-56">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={userSearchQuery}
                    onChange={(e) => setUserSearchQuery(e.target.value)}
                    placeholder="Search user name or email..."
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="border border-slate-200 rounded-2xl overflow-hidden overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Account / DP</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Auth Type</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Unlocked Suite Tools</th>
                    <th className="p-3">Member Since</th>
                    <th className="p-3 text-center">Manage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.filter(u => {
                    const isAdmin = u.role === 'admin' || u.role?.toLowerCase() === 'admin';
                    if (userRoleFilter === 'clients' && isAdmin) return false;
                    if (userRoleFilter === 'admins' && !isAdmin) return false;
                    if (!userSearchQuery.trim()) return true;
                    const q = userSearchQuery.toLowerCase();
                    return u.name.toLowerCase().includes(q) ||
                           u.email.toLowerCase().includes(q) ||
                           (u.phone && u.phone.includes(q));
                  }).map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50">
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-bold text-xs flex items-center justify-center shadow-2xs shrink-0 overflow-hidden border border-slate-200">
                            {u.avatar ? (
                              <img src={u.avatar} alt={u.name} className="w-full h-full object-cover" />
                            ) : (
                              u.name.charAt(0).toUpperCase()
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-slate-900 flex items-center gap-1.5">
                              <span className="truncate">{u.name}</span>
                              {u.avatar && (
                                <span className="text-[9px] bg-emerald-100 text-emerald-800 font-extrabold px-1.5 py-0.2 rounded-full border border-emerald-300 shrink-0">
                                  DP
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono">
                              {u.phone ? `+91 ${u.phone.replace(/\D/g, '').slice(-10)}` : 'No phone linked'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-slate-600 font-mono text-[11px]">
                        {u.email}
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          u.authProvider === 'google' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}>
                          {u.authProvider === 'google' ? 'Google OAuth' : 'Email/Pass'}
                        </span>
                      </td>
                      <td className="p-3 font-semibold uppercase text-[10px] text-slate-500">
                        {u.role}
                      </td>
                      <td className="p-3">
                        <div className="flex flex-wrap gap-1 max-w-[280px]">
                          {u.unlockedTools && u.unlockedTools.length > 0 ? (
                            u.unlockedTools.map(t => (
                              <span key={t} className="bg-slate-100 text-slate-700 text-[10px] px-2 py-0.5 rounded font-mono">
                                {t}
                              </span>
                            ))
                          ) : (
                            <span className="text-slate-400 text-[10px]">Free tools only</span>
                          )}
                        </div>
                      </td>
                      <td className="p-3 text-[10px] text-slate-400">
                        {new Date(u.createdAt).toLocaleDateString('en-IN')}
                      </td>
                      <td className="p-3 text-center whitespace-nowrap">
                        <button
                          onClick={() => openEditUserModal(u)}
                          className="px-2.5 py-1.5 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200 hover:border-emerald-300 font-bold rounded-xl text-[11px] inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Camera className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Manage DP</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: LEADS CRM */}
        {activeTab === 'leads' && (
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-5">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Consultation Inquiries & Leads CRM</h3>
                <p className="text-xs text-slate-500">Leads captured from the 20 service pages with 1-click WhatsApp quick reply</p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                <div className="flex p-0.5 bg-slate-100 rounded-xl text-[11px] font-bold">
                  {['all', 'new', 'contacted', 'converted', 'closed'].map(st => (
                    <button
                      key={st}
                      onClick={() => setLeadStatusFilter(st)}
                      className={`px-2.5 py-1 rounded-lg capitalize transition-colors ${
                        leadStatusFilter === st ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>

                <div className="relative w-full sm:w-52">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={leadSearchQuery}
                    onChange={(e) => setLeadSearchQuery(e.target.value)}
                    placeholder="Search name, phone..."
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-purple-500"
                  />
                </div>
              </div>
            </div>

            <div className="border border-slate-200 rounded-2xl overflow-hidden overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Lead Name / Mobile</th>
                    <th className="p-3">Service Interest</th>
                    <th className="p-3">Message / Query</th>
                    <th className="p-3">Source</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {leads.filter(l => {
                    const matchesStatus = leadStatusFilter === 'all' || l.status === leadStatusFilter;
                    const matchesSearch = !leadSearchQuery.trim() || 
                                          l.fullName.toLowerCase().includes(leadSearchQuery.toLowerCase()) ||
                                          l.mobile.includes(leadSearchQuery) ||
                                          l.serviceInterest.toLowerCase().includes(leadSearchQuery.toLowerCase());
                    return matchesStatus && matchesSearch;
                  }).map((lead) => (
                    <tr key={lead.id} className="hover:bg-slate-50">
                      <td className="p-3">
                        <div className="font-bold text-slate-900">{lead.fullName}</div>
                        <div className="font-mono text-emerald-700 font-bold text-[11px]">{lead.mobile}</div>
                      </td>
                      <td className="p-3 font-semibold text-slate-800">
                        {lead.serviceInterest}
                      </td>
                      <td className="p-3 text-slate-600 text-[11px] max-w-xs truncate">
                        {lead.message || '-'}
                      </td>
                      <td className="p-3 text-slate-400 text-[10px]">
                        {lead.source}
                      </td>
                      <td className="p-3">
                        <select
                          value={lead.status}
                          onChange={(e) => handleUpdateLead(lead.id, e.target.value as any)}
                          className="text-[10px] font-bold p-1 rounded bg-slate-50 border border-slate-200 text-slate-700"
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="converted">Converted</option>
                          <option value="closed">Closed</option>
                        </select>
                      </td>
                      <td className="p-3 text-center space-x-1.5 whitespace-nowrap">
                        <a
                          href={`https://wa.me/91${lead.mobile.replace(/\D/g, '').slice(-10)}?text=${encodeURIComponent(
                            `Hello ${lead.fullName}, thank you for inquiring about ${lead.serviceInterest} with Tracconsultant. I am your Senior CA Consultant, how may I assist you?`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[10px] inline-flex items-center gap-1 transition-colors"
                        >
                          <MessageCircle className="w-3 h-3" />
                          <span>WhatsApp</span>
                        </a>
                        <button
                          onClick={() => handleDeleteLead(lead.id)}
                          className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete Lead"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: WHATSAPP TEMPLATES */}
        {activeTab === 'whatsapp' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">WhatsApp Notification Templates</h3>
              <p className="text-xs text-slate-500">Automated notification triggers sent to clients during filing milestones</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {templates.map(tpl => (
                <div key={tpl.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-800 text-xs">{tpl.title}</span>
                    <span className="text-[10px] font-bold uppercase bg-slate-200 px-2 py-0.5 rounded text-slate-600">
                      {tpl.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">{tpl.description}</p>
                  <pre className="p-3 bg-white border border-slate-200 rounded-xl text-[11px] text-slate-700 font-mono whitespace-pre-wrap">
                    {tpl.content}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: RATES & ANNUAL PRICING ENGINE */}
        {activeTab === 'pricing_config' && (
          <div className="space-y-6">
            {/* Header Card */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 text-xs font-bold uppercase tracking-wider mb-1.5 border border-amber-500/20">
                  <Settings className="w-3.5 h-3.5" /> Annual Budget & Dynamic Pricing Control
                </div>
                <h3 className="text-xl font-black text-slate-900">Tax Slabs, Service Pricing & Tool Rates Engine</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Update statutory tax rates, standard deductions, 20 services fees & 8 tools pricing in real-time. Last updated on {new Date(config.lastUpdated).toLocaleDateString('en-IN')} by {config.updatedBy}.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleResetConfig}
                  disabled={savingConfig}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
                >
                  Reset Defaults
                </button>
                <button
                  type="button"
                  onClick={handleSaveConfig}
                  disabled={savingConfig}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{savingConfig ? 'Applying Changes...' : 'Save & Apply Rates'}</span>
                </button>
              </div>
            </div>

            {/* Notification Banner */}
            {configSaveSuccess && (
              <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold rounded-2xl flex items-center gap-2 shadow-sm animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{configSaveSuccess}</span>
              </div>
            )}

            {/* SECTION 1: ANNUAL TAX SLABS & BUDGET PARAMETERS */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-5">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  🏛️
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900">Annual Union Budget Tax Parameters & Slabs</h4>
                  <p className="text-xs text-slate-500">Affects live calculations across Income Tax, Advance Tax & HRA Calculators</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Financial Year (FY)</label>
                  <input
                    type="text"
                    value={config.taxRates.financialYear}
                    onChange={(e) => setConfig({
                      ...config,
                      taxRates: { ...config.taxRates, financialYear: e.target.value }
                    })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
                    placeholder="e.g. FY 2024-25"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Assessment Year (AY)</label>
                  <input
                    type="text"
                    value={config.taxRates.assessmentYear}
                    onChange={(e) => setConfig({
                      ...config,
                      taxRates: { ...config.taxRates, assessmentYear: e.target.value }
                    })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
                    placeholder="e.g. AY 2025-26"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Standard Deduction (₹)</label>
                  <input
                    type="number"
                    value={config.taxRates.standardDeduction}
                    onChange={(e) => setConfig({
                      ...config,
                      taxRates: { ...config.taxRates, standardDeduction: Number(e.target.value) }
                    })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-emerald-700"
                    placeholder="75000"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Section 87A Rebate Ceiling (₹)</label>
                  <input
                    type="number"
                    value={config.taxRates.rebate87ALimit}
                    onChange={(e) => setConfig({
                      ...config,
                      taxRates: { ...config.taxRates, rebate87ALimit: Number(e.target.value) }
                    })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-emerald-700"
                    placeholder="700000"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">New Regime Zero-Tax Income (₹)</label>
                  <input
                    type="number"
                    value={config.taxRates.newRegimeZeroTaxCeiling}
                    onChange={(e) => setConfig({
                      ...config,
                      taxRates: { ...config.taxRates, newRegimeZeroTaxCeiling: Number(e.target.value) }
                    })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-indigo-700"
                    placeholder="775000"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Health & Education Cess (%)</label>
                  <input
                    type="number"
                    value={config.taxRates.cessPercent}
                    onChange={(e) => setConfig({
                      ...config,
                      taxRates: { ...config.taxRates, cessPercent: Number(e.target.value) }
                    })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-800"
                    placeholder="4"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">HRA Metro Exemption (%)</label>
                  <input
                    type="number"
                    value={config.taxRates.hraMetroPercent}
                    onChange={(e) => setConfig({
                      ...config,
                      taxRates: { ...config.taxRates, hraMetroPercent: Number(e.target.value) }
                    })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-800"
                    placeholder="50"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">HRA Non-Metro Exemption (%)</label>
                  <input
                    type="number"
                    value={config.taxRates.hraNonMetroPercent}
                    onChange={(e) => setConfig({
                      ...config,
                      taxRates: { ...config.taxRates, hraNonMetroPercent: Number(e.target.value) }
                    })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-800"
                    placeholder="40"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1 text-xs">Statutory Budget Notes & Disclosure</label>
                <textarea
                  rows={2}
                  value={config.taxRates.notes}
                  onChange={(e) => setConfig({
                    ...config,
                    taxRates: { ...config.taxRates, notes: e.target.value }
                  })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700"
                  placeholder="Notes explaining amendments..."
                />
              </div>
            </div>

            {/* SECTION 2: COMPLIANCE SUITE TOOLS PRICING */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-5">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  💎
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900">Compliance Suite Tools & Bundle Pricing</h4>
                  <p className="text-xs text-slate-500">Live prices charged to clients on the checkout paywall & QR code</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-200/80">
                  <div className="flex justify-between items-center mb-1">
                    <label className="font-extrabold text-indigo-950 uppercase">All-Access Pro Toolkit Pass</label>
                    <span className="text-[10px] font-bold bg-indigo-600 text-white px-2 py-0.5 rounded-full">ALL 4 PRO</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="font-bold text-slate-500 text-sm">₹</span>
                    <input
                      type="number"
                      value={config.toolPrices.allAccessPass || 499}
                      onChange={(e) => setConfig({
                        ...config,
                        toolPrices: { ...config.toolPrices, allAccessPass: Number(e.target.value) }
                      })}
                      className="w-full p-2 bg-white border border-indigo-300 rounded-xl font-mono font-black text-indigo-900 text-base"
                    />
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <label className="block font-bold text-slate-700 uppercase mb-1">Advanced PDF Redactor &amp; Blackout Pro</label>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="font-bold text-slate-500 text-sm">₹</span>
                    <input
                      type="number"
                      value={config.toolPrices['advanced-pdf-redactor'] ?? 199}
                      onChange={(e) => setConfig({
                        ...config,
                        toolPrices: { ...config.toolPrices, 'advanced-pdf-redactor': Number(e.target.value) }
                      })}
                      className="w-full p-2 bg-white border border-slate-300 rounded-xl font-mono font-bold text-slate-900"
                    />
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <label className="block font-bold text-slate-700 uppercase mb-1">Advanced CA Tax Computation Generator</label>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="font-bold text-slate-500 text-sm">₹</span>
                    <input
                      type="number"
                      value={config.toolPrices['advanced-computation-generator'] ?? 299}
                      onChange={(e) => setConfig({
                        ...config,
                        toolPrices: { ...config.toolPrices, 'advanced-computation-generator': Number(e.target.value) }
                      })}
                      className="w-full p-2 bg-white border border-slate-300 rounded-xl font-mono font-bold text-slate-900"
                    />
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <label className="block font-bold text-slate-700 uppercase mb-1">Ultra File Compressor &amp; PDF Optimizer</label>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="font-bold text-slate-500 text-sm">₹</span>
                    <input
                      type="number"
                      value={config.toolPrices['file-compressor'] ?? 199}
                      onChange={(e) => setConfig({
                        ...config,
                        toolPrices: { ...config.toolPrices, 'file-compressor': Number(e.target.value) }
                      })}
                      className="w-full p-2 bg-white border border-slate-300 rounded-xl font-mono font-bold text-slate-900"
                    />
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <label className="block font-bold text-slate-700 uppercase mb-1">Smart GST Invoice &amp; E-Way Generator</label>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="font-bold text-slate-500 text-sm">₹</span>
                    <input
                      type="number"
                      value={config.toolPrices['gst-invoice-generator'] ?? 249}
                      onChange={(e) => setConfig({
                        ...config,
                        toolPrices: { ...config.toolPrices, 'gst-invoice-generator': Number(e.target.value) }
                      })}
                      className="w-full p-2 bg-white border border-slate-300 rounded-xl font-mono font-bold text-slate-900"
                    />
                  </div>
                </div>
              </div>

              {/* Free & Open Compliance Tools Master (11 Tools Status & Test Links) */}
              <div className="pt-5 border-t border-slate-100">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h5 className="text-sm font-bold text-slate-900">
                      Free &amp; Open Compliance Tools Master ({TOOLS_LIST.filter(t => t.category === 'free').length} Tools)
                    </h5>
                    <p className="text-[11px] text-slate-500">
                      E-Commerce, GST Verification, HSN directory &amp; Calculators available 100% free with zero paywalls
                    </p>
                  </div>
                  <span className="text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full border border-emerald-200">
                    100% Active &amp; Free
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {TOOLS_LIST.filter(t => t.category === 'free').map(tool => (
                    <div
                      key={tool.id}
                      className="p-3.5 bg-slate-50 hover:bg-emerald-50/50 rounded-2xl border border-slate-200 hover:border-emerald-300 flex items-center justify-between gap-3 transition-all"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs font-bold text-slate-900 truncate">
                            {tool.name}
                          </span>
                          {tool.badge && (
                            <span className="text-[9px] font-black bg-emerald-600 text-white px-1.5 py-0.2 rounded shrink-0 uppercase">
                              {tool.badge}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono block truncate mt-0.5">
                          /tools/{tool.slug}
                        </span>
                      </div>
                      <a
                        href={`/tools/${tool.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 p-2 bg-white hover:bg-[#0B2545] hover:text-white text-slate-600 rounded-xl border border-slate-200 shadow-2xs transition-all"
                        title={`Open ${tool.name}`}
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* SECTION 3: 20 CORE CA SERVICES PRICING TABLE */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-5">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                  💼
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900">20 Core CA Services Price & Turnaround (TAT) Manager</h4>
                  <p className="text-xs text-slate-500">Live prices shown in the Mega Menu dropdown, cards & services directory</p>
                </div>
              </div>

              <div className="border border-slate-200 rounded-2xl overflow-hidden overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3">#</th>
                      <th className="p-3">Service Name</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Starting Fee (Display Price)</th>
                      <th className="p-3">Turnaround Time (TAT)</th>
                      <th className="p-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {config.servicePricing.map((serv, idx) => (
                      <tr key={serv.id} className="hover:bg-slate-50/80">
                        <td className="p-3 font-mono text-slate-400 font-bold">{idx + 1}</td>
                        <td className="p-3 font-bold text-slate-900">{serv.title}</td>
                        <td className="p-3">
                          <span className="text-[10px] font-semibold bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                            {serv.category}
                          </span>
                        </td>
                        <td className="p-3">
                          <input
                            type="text"
                            value={serv.startingPrice}
                            onChange={(e) => {
                              const updated = [...config.servicePricing];
                              updated[idx].startingPrice = e.target.value;
                              setConfig({ ...config, servicePricing: updated });
                            }}
                            className="w-28 p-1.5 bg-white border border-slate-300 rounded-lg font-mono font-bold text-emerald-800 text-xs"
                          />
                        </td>
                        <td className="p-3">
                          <input
                            type="text"
                            value={serv.tat}
                            onChange={(e) => {
                              const updated = [...config.servicePricing];
                              updated[idx].tat = e.target.value;
                              setConfig({ ...config, servicePricing: updated });
                            }}
                            className="w-28 p-1.5 bg-white border border-slate-300 rounded-lg text-slate-700 text-xs"
                          />
                        </td>
                        <td className="p-3 text-center">
                          <input
                            type="checkbox"
                            checked={serv.isActive}
                            onChange={(e) => {
                              const updated = [...config.servicePricing];
                              updated[idx].isActive = e.target.checked;
                              setConfig({ ...config, servicePricing: updated });
                            }}
                            className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Bottom Sticky Save Bar */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
                <span className="text-xs text-slate-400">
                  Tip: Changes take effect immediately across all calculators, booking pages & the payment gateway.
                </span>

                <button
                  type="button"
                  onClick={handleSaveConfig}
                  disabled={savingConfig}
                  className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{savingConfig ? 'Saving Rates...' : 'Save & Apply All Rates'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Manual Grant Tool Modal */}
      {grantModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Grant Tool Access Manually</h3>
              <button onClick={() => setGrantModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleManualGrant} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Select Client Account</label>
                <select
                  value={grantUserId}
                  onChange={(e) => setGrantUserId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  required
                >
                  <option value="">-- Choose Client --</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Select Paid Tool to Unlock</label>
                <select
                  value={grantToolId}
                  onChange={(e) => setGrantToolId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  {TOOLS_LIST.filter(t => t.category === 'paid').map(t => (
                    <option key={t.id} value={t.id}>
                      {t.name} (Value ₹{t.price})
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-900 text-[11px]">
                This will grant immediate free access to this tool in the client's account and log it as an Admin Grant in their dashboard.
              </div>

              <button
                type="submit"
                disabled={isGranting}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md transition-colors"
              >
                {isGranting ? 'Granting...' : 'Confirm & Grant Tool Access'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CA Advisory Desk Detail / Legal Opinion Drawer Modal */}
      {selectedQuery && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="w-full max-w-3xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-start pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-900 text-white px-2.5 py-0.5 rounded-full font-mono">
                    {selectedQuery.id}
                  </span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                    selectedQuery.plan === 'priority'
                      ? 'bg-rose-100 text-rose-800 border border-rose-200'
                      : 'bg-indigo-100 text-indigo-800'
                  }`}>
                    {selectedQuery.plan === 'priority' ? '⚡ Priority Notice Scrutiny (₹599)' : 'Standard Written Opinion (₹299)'}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Paid ₹{selectedQuery.amount} (Razorpay)
                  </span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full capitalize ${
                    selectedQuery.status === 'resolved'
                      ? 'bg-emerald-100 text-emerald-800'
                      : selectedQuery.status === 'in_review'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {selectedQuery.status.replace('_', ' ')}
                  </span>
                </div>
                <h3 className="text-xl font-black text-slate-900 mt-2">{selectedQuery.querySubject}</h3>
                <p className="text-xs text-slate-500">
                  {selectedQuery.category} • Submitted on {new Date(selectedQuery.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedQuery(null)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Client Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
              <div>
                <span className="text-slate-400 font-semibold block text-[10px] uppercase">Client Name</span>
                <span className="font-bold text-slate-900 text-sm">{selectedQuery.clientName}</span>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block text-[10px] uppercase">Mobile Phone</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <a href={`tel:${selectedQuery.clientPhone}`} className="font-bold text-emerald-700 hover:underline">
                    {selectedQuery.clientPhone}
                  </a>
                  <button
                    type="button"
                    onClick={() => sendQueryWhatsApp(selectedQuery)}
                    className="p-1 text-emerald-600 hover:bg-emerald-100 rounded transition-colors"
                    title="Open WhatsApp"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block text-[10px] uppercase">Email</span>
                <a href={`mailto:${selectedQuery.clientEmail}`} className="font-bold text-blue-700 hover:underline truncate block">
                  {selectedQuery.clientEmail}
                </a>
              </div>
            </div>

            {/* Query Narrative */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Client Notice / Problem Description</h4>
              <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200 text-xs text-slate-800 whitespace-pre-wrap leading-relaxed">
                {selectedQuery.queryDetails}
              </div>
            </div>

            {/* Attached Documents */}
            {selectedQuery.documents && selectedQuery.documents.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Attached Notice / Document Dossier ({selectedQuery.documents.length})
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedQuery.documents.map((doc, idx) => (
                    <div key={idx} className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-xs hover:border-slate-300 transition-colors">
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText className="w-4 h-4 text-red-500 shrink-0" />
                        <div className="min-w-0">
                          <p className="font-bold text-slate-800 truncate text-[11px]">{doc.name}</p>
                          <p className="text-[10px] text-slate-400">{doc.size}</p>
                        </div>
                      </div>
                      {doc.dataUrl ? (
                        <a
                          href={doc.dataUrl}
                          download={doc.name}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] font-bold shrink-0 transition-colors flex items-center gap-1"
                        >
                          <Download className="w-3 h-3" />
                          <span>View/DL</span>
                        </a>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-semibold">Attached</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CA Opinion Composer */}
            <div className="p-5 bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl text-white space-y-4 border border-slate-800">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 font-black text-xs flex items-center justify-center">
                    CA
                  </div>
                  <h4 className="text-sm font-bold text-white">Senior Chartered Accountant Written Legal Opinion</h4>
                </div>
                <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  Signed Legal Advisory
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Assigned Senior CA</label>
                  <input
                    type="text"
                    value={caAssignedName}
                    onChange={(e) => setCaAssignedName(e.target.value)}
                    placeholder="e.g. Senior Chartered Accountant (FCA)"
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">ICAI Membership No.</label>
                  <input
                    type="text"
                    value={caMembershipNumber}
                    onChange={(e) => setCaMembershipNumber(e.target.value)}
                    placeholder="e.g. ICAI #514298"
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Statutory Income Tax / GST Sections Cited
                </label>
                <input
                  type="text"
                  value={caLegalSections}
                  onChange={(e) => setCaLegalSections(e.target.value)}
                  placeholder="e.g. Section 143(1)(a), Section 139(9) Defective Return, Rule 86B"
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Authoritative Written Legal Opinion & Analysis
                </label>
                <textarea
                  rows={6}
                  value={caOpinionText}
                  onChange={(e) => setCaOpinionText(e.target.value)}
                  placeholder="Draft your detailed legal assessment, statutory defense, and technical breakdown here..."
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 leading-relaxed font-sans"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Recommended Action Steps for Client (One step per line)
                </label>
                <textarea
                  rows={3}
                  value={caActionSteps}
                  onChange={(e) => setCaActionSteps(e.target.value)}
                  placeholder="1. File rectification under Section 154 within 30 days&#10;2. Download updated AIS/TIS from Income Tax portal&#10;3. Submit grievance on IT e-filing portal"
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 leading-relaxed"
                />
              </div>

              {queryResponseSuccess && (
                <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{queryResponseSuccess}</span>
                </div>
              )}

              {queryResponseError && (
                <div className="p-3 bg-rose-500/20 border border-rose-500/40 text-rose-300 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{queryResponseError}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between flex-wrap gap-3 pt-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleSaveQueryResponse('in_review')}
                    disabled={isSavingQueryResponse}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    Save Draft (Keep In Review)
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSaveQueryResponse('resolved')}
                    disabled={isSavingQueryResponse}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                  >
                    {isSavingQueryResponse ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    )}
                    <span>Submit & Mark Resolved</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`/track?q=${selectedQuery.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-blue-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Public Tracker</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => sendQueryWhatsApp(selectedQuery)}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp Client</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filing Detail / Manage Case Drawer Modal - COMPLETE CUSTOMER SUBMISSION VIEW */}
      {selectedFiling && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-start pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-900 text-white px-2.5 py-0.5 rounded-full">
                    {selectedFiling.id}
                  </span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                    selectedFiling.status === 'completed' || selectedFiling.status === 'filed'
                      ? 'bg-emerald-100 text-emerald-800'
                      : selectedFiling.status === 'new'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {selectedFiling.status.replace('_', ' ')}
                  </span>
                </div>
                <h3 className="text-xl font-black text-slate-900 mt-1">{selectedFiling.service}</h3>
                <p className="text-xs text-slate-500">{selectedFiling.plan} • {selectedFiling.financialYear}</p>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`/track?q=${selectedFiling.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors"
                  title="View Public Tracking Page (ARN Tracker)"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Live Tracking</span>
                </a>

                <a
                  href={`https://wa.me/91${selectedFiling.mobile}?text=${encodeURIComponent(`Hello ${selectedFiling.fullName}, this is Tracconsultant Senior CA Desk regarding your ${selectedFiling.service} (Ref: ${selectedFiling.id}).`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors"
                  title="Direct WhatsApp Client"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Chat Client</span>
                </a>

                <button onClick={() => setSelectedFiling(null)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* SECTION 1: CUSTOMER SUBMITTED DETAILS CARD */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-3">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-slate-700" />
                <span>Customer Profile & Submitted Information</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] block font-semibold uppercase mb-1">Customer Profile &amp; DP</span>
                  <div className="flex items-center gap-2.5">
                    {(() => {
                      const u = users.find(usr => (selectedFiling.userId && usr.id === selectedFiling.userId) || (selectedFiling.email && usr.email.toLowerCase() === selectedFiling.email.toLowerCase()));
                      return (
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-bold text-xs flex items-center justify-center shadow-2xs shrink-0 overflow-hidden border border-slate-200">
                          {u?.avatar ? (
                            <img src={u.avatar} alt={selectedFiling.fullName} className="w-full h-full object-cover" />
                          ) : (
                            selectedFiling.fullName.charAt(0).toUpperCase()
                          )}
                        </div>
                      );
                    })()}
                    <div>
                      <div className="font-bold text-slate-900 text-sm leading-tight">{selectedFiling.fullName}</div>
                      <div className="text-[10px] text-emerald-700 font-semibold">Verified Client</div>
                    </div>
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 text-[10px] block font-semibold uppercase">Mobile Contact</span>
                  <a href={`tel:${selectedFiling.mobile}`} className="font-mono font-bold text-emerald-700 hover:underline">
                    +91 {selectedFiling.mobile}
                  </a>
                </div>

                <div>
                  <span className="text-slate-400 text-[10px] block font-semibold uppercase">Email Address</span>
                  <span className="font-mono text-slate-700">{selectedFiling.email || 'Not provided'}</span>
                </div>

                <div>
                  <span className="text-slate-400 text-[10px] block font-semibold uppercase">PAN Number</span>
                  <span className="font-mono font-black text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded border border-emerald-300">
                    {selectedFiling.panNumber || 'Awaiting Submission'}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 text-[10px] block font-semibold uppercase">City / State</span>
                  <span className="font-semibold text-slate-700">{selectedFiling.city || 'India'}</span>
                </div>

                <div>
                  <span className="text-slate-400 text-[10px] block font-semibold uppercase">Assessment Year</span>
                  <span className="font-semibold text-slate-700">{selectedFiling.financialYear}</span>
                </div>
              </div>

              {/* Special Note from Customer */}
              {selectedFiling.clientNotes && (
                <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
                  <span className="font-bold block text-[10px] uppercase text-amber-800">Special Instructions from Customer:</span>
                  <p className="mt-0.5 italic">"{selectedFiling.clientNotes}"</p>
                </div>
              )}
            </div>

            {/* SECTION 2: CUSTOMER UPLOADED DOCUMENTS */}
            <div className="space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Uploaded Documents & Files ({selectedFiling.documents?.length || 0})</span>
                </span>
                <span className="text-[10px] text-slate-400 font-normal">Encrypted Vault</span>
              </div>

              {selectedFiling.documents && selectedFiling.documents.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedFiling.documents.map((doc, idx) => (
                    <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                        <div className="truncate">
                          <div className="text-xs font-bold text-slate-800 truncate" title={doc.name}>{doc.name}</div>
                          <div className="text-[10px] text-slate-400">{doc.size} • {new Date(doc.uploadDate).toLocaleDateString('en-IN')}</div>
                        </div>
                      </div>
                      <a
                        href={doc.url || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2 py-1 bg-white hover:bg-slate-100 text-indigo-600 border border-slate-200 rounded-lg text-[10px] font-bold shrink-0 ml-2"
                      >
                        View File
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-center space-y-1">
                  <p className="text-xs text-slate-500">No client documents attached with this submission yet.</p>
                  <a
                    href={`https://wa.me/91${selectedFiling.mobile}?text=${encodeURIComponent(`Hello ${selectedFiling.fullName}, Tracconsultant CA Desk here. Kindly share your Form 16 / Bank Statement on WhatsApp to expedite your ${selectedFiling.service}.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:underline"
                  >
                    <span>Request Documents on WhatsApp →</span>
                  </a>
                </div>
              )}
            </div>

            {/* SECTION 3: CA WORKSTATION & STATUS CONTROL */}
            <div className="space-y-4 text-xs pt-2 border-t border-slate-100">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
                CA Operational Actions & Client Live Sync
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Update Filing Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as FilingStatus)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                  >
                    <option value="new">🟡 New (Unprocessed)</option>
                    <option value="under_review">🔵 Under Review</option>
                    <option value="ca_assigned">🟣 CA Assigned</option>
                    <option value="docs_pending">🟠 Docs Pending from Client</option>
                    <option value="draft_ready">🟢 Draft Ready for Approval</option>
                    <option value="filed">🚀 Filed on Govt Portal</option>
                    <option value="completed">✅ Completed & Verified</option>
                    <option value="rejected">❌ Rejected</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Assigned Senior CA</label>
                  <input
                    type="text"
                    value={editCAName}
                    onChange={(e) => setEditCAName(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                    placeholder="e.g. Senior Tax Expert (CA)"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Estimated Tax Refund (₹)</label>
                  <input
                    type="number"
                    value={editEstimatedRefund}
                    onChange={(e) => setEditEstimatedRefund(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-emerald-700"
                    placeholder="e.g. 24850 (Leave blank if nil)"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Assigned CA Contact Phone</label>
                  <input
                    type="text"
                    value={editCAPhone}
                    onChange={(e) => setEditCAPhone(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-700"
                    placeholder="7275922162"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Add Official Case Note (Visible in Client Tracking & Timeline)
                </label>
                <textarea
                  rows={3}
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="e.g. Form 16 Part A & B reconciled with AIS. Deductions under 80C & 80D optimized. Net refund computed at ₹24,850."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                />
              </div>

              {/* 1-Click WhatsApp Milestone Triggers */}
              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>1-Click WhatsApp Milestone Updates</span>
                  </span>
                  <span className="text-[10px] text-emerald-700 font-mono">+91 {selectedFiling.mobile}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => sendWhatsAppTemplateToClient(selectedFiling, 'welcome')}
                    className="p-2.5 bg-white hover:bg-emerald-50 border border-emerald-200 rounded-xl text-[11px] font-bold text-slate-800 text-left transition-colors flex flex-col gap-0.5 shadow-2xs cursor-pointer"
                  >
                    <span className="text-emerald-700 font-black">👋 1. Welcome</span>
                    <span className="text-[9px] text-slate-500 font-normal">Intro + Case ID</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => sendWhatsAppTemplateToClient(selectedFiling, 'docs')}
                    className="p-2.5 bg-white hover:bg-amber-50 border border-amber-200 rounded-xl text-[11px] font-bold text-slate-800 text-left transition-colors flex flex-col gap-0.5 shadow-2xs cursor-pointer"
                  >
                    <span className="text-amber-700 font-black">📎 2. Docs Needed</span>
                    <span className="text-[9px] text-slate-500 font-normal">Form 16 / AIS / Bank</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => sendWhatsAppTemplateToClient(selectedFiling, 'draft')}
                    className="p-2.5 bg-white hover:bg-indigo-50 border border-indigo-200 rounded-xl text-[11px] font-bold text-slate-800 text-left transition-colors flex flex-col gap-0.5 shadow-2xs cursor-pointer"
                  >
                    <span className="text-indigo-700 font-black">📊 3. Draft Ready</span>
                    <span className="text-[9px] text-slate-500 font-normal">Refund computation</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => sendWhatsAppTemplateToClient(selectedFiling, 'filed')}
                    className="p-2.5 bg-white hover:bg-purple-50 border border-purple-200 rounded-xl text-[11px] font-bold text-slate-800 text-left transition-colors flex flex-col gap-0.5 shadow-2xs cursor-pointer"
                  >
                    <span className="text-purple-700 font-black">🚀 4. Filed ITR-V</span>
                    <span className="text-[9px] text-slate-500 font-normal">Ack & Verified</span>
                  </button>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={saveLeadUpdates}
                  disabled={savingDetails}
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{savingDetails ? 'Saving...' : 'Save & Sync Client Tracking'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteFiling(selectedFiling.id)}
                  className="px-4 py-3 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 text-xs cursor-pointer"
                  title="Delete this filing record"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Case</span>
                </button>

                <button
                  onClick={() => setSelectedFiling(null)}
                  className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create New Filing Modal */}
      {addFilingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="w-full max-w-xl bg-white rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">Create New Client Filing</h3>
                  <p className="text-xs text-slate-500">Add case to live tracking pipeline & generate ARN</p>
                </div>
              </div>
              <button
                onClick={() => setAddFilingModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateFiling} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase text-[10px] mb-1">
                    Client Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newFilingName}
                    onChange={(e) => setNewFilingName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase text-[10px] mb-1">
                    Mobile Number (10 digits) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={newFilingMobile}
                    onChange={(e) => setNewFilingMobile(e.target.value)}
                    placeholder="9876543210"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase text-[10px] mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={newFilingEmail}
                    onChange={(e) => setNewFilingEmail(e.target.value)}
                    placeholder="client@gmail.com"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase text-[10px] mb-1">
                    PAN Number
                  </label>
                  <input
                    type="text"
                    maxLength={10}
                    value={newFilingPan}
                    onChange={(e) => setNewFilingPan(e.target.value.toUpperCase())}
                    placeholder="ABCDE1234F"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase text-[10px] mb-1">
                    Select Service *
                  </label>
                  <select
                    value={newFilingService}
                    onChange={(e) => setNewFilingService(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  >
                    {SERVICES_LIST.map((s) => (
                      <option key={s.id} value={s.title}>
                        {s.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase text-[10px] mb-1">
                    Plan / Category
                  </label>
                  <input
                    type="text"
                    value={newFilingPlan}
                    onChange={(e) => setNewFilingPlan(e.target.value)}
                    placeholder="Standard Plan / Salaried / Business"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase text-[10px] mb-1">
                    Financial / Assessment Year
                  </label>
                  <input
                    type="text"
                    value={newFilingYear}
                    onChange={(e) => setNewFilingYear(e.target.value)}
                    placeholder="AY 2025-26"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase text-[10px] mb-1">
                    Initial Status
                  </label>
                  <select
                    value={newFilingStatus}
                    onChange={(e) => setNewFilingStatus(e.target.value as FilingStatus)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-emerald-800"
                  >
                    <option value="new">🟡 New</option>
                    <option value="under_review">🔵 Under Review</option>
                    <option value="ca_assigned">🟣 CA Assigned</option>
                    <option value="docs_pending">🟠 Docs Pending</option>
                    <option value="draft_ready">🟢 Draft Ready</option>
                    <option value="filed">🚀 Filed</option>
                    <option value="completed">✅ Completed</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase text-[10px] mb-1">
                    Estimated Refund (₹)
                  </label>
                  <input
                    type="number"
                    value={newFilingRefund}
                    onChange={(e) => setNewFilingRefund(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="e.g. 15000"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-emerald-700 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase text-[10px] mb-1">
                    Assigned Senior CA
                  </label>
                  <input
                    type="text"
                    value={newFilingCAName}
                    onChange={(e) => setNewFilingCAName(e.target.value)}
                    placeholder="Senior Tax Expert (CA)"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase text-[10px] mb-1">
                    City / Location
                  </label>
                  <input
                    type="text"
                    value={newFilingCity}
                    onChange={(e) => setNewFilingCity(e.target.value)}
                    placeholder="e.g. Lucknow / Delhi / Mumbai"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase text-[10px] mb-1">
                  Internal CA Notes / Instructions
                </label>
                <textarea
                  rows={2}
                  value={newFilingNotes}
                  onChange={(e) => setNewFilingNotes(e.target.value)}
                  placeholder="Case instructions, client documents received, tax computation notes..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="submit"
                  disabled={isCreatingFiling}
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isCreatingFiling ? 'Creating Case...' : 'Create Filing & Generate ARN'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAddFilingModalOpen(false)}
                  className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Manage User & DP */}
      {editUserModalOpen && selectedUserForEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full p-6 relative space-y-5">
            <button
              onClick={() => setEditUserModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">Manage Client Profile &amp; DP</h3>
                <p className="text-xs text-slate-400">{selectedUserForEdit.email}</p>
              </div>
            </div>

            {userEditSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{userEditSuccess}</span>
              </div>
            )}
            {userEditError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-bold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                <span>{userEditError}</span>
              </div>
            )}

            {/* DP Control Section */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-black text-2xl flex items-center justify-center shadow-md ring-2 ring-emerald-500/20 shrink-0 overflow-hidden border border-slate-200">
                {editUserAvatar ? (
                  <img src={editUserAvatar} alt={editUserName} className="w-full h-full object-cover" />
                ) : (
                  editUserName ? editUserName.charAt(0).toUpperCase() : 'U'
                )}
                {isUploadingAdminAvatar && (
                  <div className="absolute inset-0 bg-slate-950/60 flex items-center justify-center">
                    <RefreshCw className="w-4 h-4 text-white animate-spin" />
                  </div>
                )}
              </div>

              <div className="space-y-1.5 flex-1">
                <span className="text-xs font-bold text-slate-800 block">Client Profile Picture</span>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={adminAvatarInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={handleAdminAvatarFileChange}
                  />
                  <button
                    type="button"
                    disabled={isUploadingAdminAvatar}
                    onClick={() => adminAvatarInputRef.current?.click()}
                    className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Upload className="w-3 h-3" />
                    <span>Upload DP</span>
                  </button>

                  {editUserAvatar && (
                    <button
                      type="button"
                      onClick={handleAdminRemoveAvatar}
                      className="py-1.5 px-2.5 bg-white hover:bg-red-50 text-slate-600 hover:text-red-600 border border-slate-200 hover:border-red-200 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                      title="Remove profile picture"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
                <span className="text-[10px] text-slate-400 block">Auto-compressed 400x400 JPG</span>
              </div>
            </div>

            {/* Form Details */}
            <form onSubmit={handleSaveUserDetails} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Legal Name</label>
                <input
                  type="text"
                  required
                  value={editUserName}
                  onChange={e => setEditUserName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Phone / WhatsApp Number</label>
                <input
                  type="tel"
                  value={editUserPhone}
                  onChange={e => setEditUserPhone(e.target.value)}
                  placeholder="+91 9876543210"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Access Role</label>
                <select
                  value={editUserRole}
                  onChange={e => setEditUserRole(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="client">Client (Standard Taxpayer)</option>
                  <option value="admin">Administrator (Full Admin Access)</option>
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditUserModalOpen(false)}
                  className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingUser}
                  className="py-2.5 px-5 bg-[#00a859] hover:bg-[#008f4c] disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  {isSavingUser ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dedicated Admin Portal Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-5 px-6 text-xs text-slate-500 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong>Tracconsultant Operations & Control Center</strong> • Lead: <strong>Senior Chartered Accountant Panel</strong>
            </span>
          </div>
          <div className="flex items-center gap-4 text-slate-400 text-[11px]">
            <span>DPDP Act 2023 Compliant</span>
            <span>•</span>
            <span>256-Bit SSL Encrypted</span>
            <span>•</span>
            <Link href="/" target="_blank" className="text-emerald-600 hover:text-emerald-700 font-semibold">
              Open Public Website →
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

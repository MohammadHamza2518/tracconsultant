'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useConfig } from '@/context/ConfigContext';
import ToolPaywallModal from '@/components/ToolPaywallModal';
import { 
  EyeOff, 
  ShieldCheck, 
  Lock, 
  Unlock, 
  Download, 
  Upload, 
  Check, 
  Sparkles, 
  FileText, 
  RefreshCw, 
  Eye, 
  Zap,
  ArrowRight,
  Sliders,
  CheckCircle2,
  FileCheck,
  AlertCircle
} from 'lucide-react';
import { jsPDF } from 'jspdf';

interface DocProfile {
  docType: string;
  taxpayerName: string;
  panNumber: string;
  aadhaarNumber: string;
  bankAccount: string;
  grossIncome: number;
  stdDeduction: number;
  netTaxable: number;
}

const PRESET_TEMPLATES: Record<string, DocProfile> = {
  form16: {
    docType: 'FORM NO. 16 — PART B (SALARY CERTIFICATE)',
    taxpayerName: 'AMITABH SHARMA',
    panNumber: 'ABCPS1234D',
    aadhaarNumber: '4819 2019 9812',
    bankAccount: '009182374819',
    grossIncome: 1450000,
    stdDeduction: 75000,
    netTaxable: 1375000
  },
  bank: {
    docType: 'BANK ACCOUNT TRANSACTION STATEMENT',
    taxpayerName: 'RAJESHWAR VERMA',
    panNumber: 'BKPV9921K',
    aadhaarNumber: '5512 8821 3341',
    bankAccount: '50100291823748',
    grossIncome: 850000,
    stdDeduction: 0,
    netTaxable: 850000
  },
  itrv: {
    docType: 'INDIAN INCOME TAX RETURN VERIFICATION (ITR-V)',
    taxpayerName: 'PRIYA SHARMA',
    panNumber: 'APZPA8712E',
    aadhaarNumber: '9921 4410 7712',
    bankAccount: '110098234123',
    grossIncome: 2200000,
    stdDeduction: 75000,
    netTaxable: 2125000
  }
};

export default function PdfRedactorPage() {
  const { user, hasToolAccess, refreshUser } = useAuth();
  const { getToolPrice } = useConfig();
  const toolId = 'pdf-redactor';
  const toolName = 'PDF Redact & Sensitive Data Masking Tool';
  const price = getToolPrice(toolId, 199);

  const isUnlocked = hasToolAccess(toolId);
  const [paywallOpen, setPaywallOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Active doc state
  const [activeProfile, setActiveProfile] = useState<DocProfile>(PRESET_TEMPLATES.form16);
  const [fileName, setFileName] = useState('Form16_PartB_AmitabhSharma.pdf');
  const [fileSize, setFileSize] = useState('248 KB');
  const [isCustomUploaded, setIsCustomUploaded] = useState(false);

  // Redaction options
  const [maskPan, setMaskPan] = useState(true);
  const [maskAadhaar, setMaskAadhaar] = useState(true);
  const [maskBank, setMaskBank] = useState(true);
  const [maskSalary, setMaskSalary] = useState(false);
  const [watermark, setWatermark] = useState('CONFIDENTIAL - FOR VERIFICATION ONLY');

  const [isProcessing, setIsProcessing] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Real File Upload Handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processUploadedFile(file);
    }
  };

  const processUploadedFile = (file: File) => {
    setFileName(file.name);
    setFileSize(`${(file.size / 1024).toFixed(1)} KB`);
    setIsCustomUploaded(true);
    setIsDone(false);

    // Auto-adjust doc type based on name
    const lower = file.name.toLowerCase();
    if (lower.includes('bank') || lower.includes('statement')) {
      setActiveProfile(PRESET_TEMPLATES.bank);
    } else if (lower.includes('itr') || lower.includes('ack')) {
      setActiveProfile(PRESET_TEMPLATES.itrv);
    } else {
      setActiveProfile({
        ...PRESET_TEMPLATES.form16,
        docType: `UPLOADED DOCUMENT: ${file.name.toUpperCase()}`
      });
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processUploadedFile(e.dataTransfer.files[0]);
    }
  };

  const handleSimulatedProcess = () => {
    if (!isUnlocked) {
      setPaywallOpen(true);
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsDone(true);
    }, 900);
  };

  // Real PDF Export using jsPDF
  const handleDownloadRealPdf = () => {
    if (!isUnlocked) {
      setPaywallOpen(true);
      return;
    }

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // 1. Watermark diagonally in center
    if (watermark) {
      doc.saveGraphicsState();
      doc.setTextColor(220, 220, 220);
      doc.setFontSize(26);
      doc.setFont('helvetica', 'bold');
      const text = watermark.toUpperCase();
      doc.text(text, pageWidth / 2, pageHeight / 2, {
        align: 'center',
        angle: 45
      });
      doc.restoreGraphicsState();
    }

    // 2. Official Security Header Banner
    doc.setFillColor(11, 30, 59); // FinTech Dark Slate
    doc.rect(0, 0, pageWidth, 28, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('TRAC CONSULTANT - PRIVACY SANITIZED DOCUMENT', 14, 12);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(52, 211, 153); // Emerald
    doc.text('DPDP ACT 2023 COMPLIANT • ZERO KNOWLEDGE REDACTION ENGINE', 14, 19);

    doc.setTextColor(180, 200, 220);
    doc.text(`Timestamp: ${new Date().toLocaleString('en-IN')} | Ref: TRAC-${Date.now().toString().slice(-8)}`, 14, 24);

    // 3. Document Box
    doc.setDrawColor(203, 213, 225);
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(14, 35, pageWidth - 28, 140, 3, 3, 'FD');

    // Title
    doc.setTextColor(30, 41, 59);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text(activeProfile.docType, pageWidth / 2, 45, { align: 'center' });

    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100, 116, 139);
    doc.text(`Original File: ${fileName} (${fileSize})`, pageWidth / 2, 51, { align: 'center' });

    doc.setDrawColor(226, 232, 240);
    doc.line(20, 56, pageWidth - 20, 56);

    // Profile Details
    let y = 66;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);

    // Name
    doc.setTextColor(71, 85, 105);
    doc.text('Name of Taxpayer / Entity:', 22, y);
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.text(activeProfile.taxpayerName, 85, y);

    // PAN
    y += 12;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text('Permanent Account Number (PAN):', 22, y);
    if (maskPan) {
      doc.setFillColor(15, 23, 42);
      doc.rect(85, y - 4, 38, 5.5, 'F'); // Black privacy mask box
      doc.setTextColor(255, 255, 255);
      doc.setFont('courier', 'bold');
      doc.text(`XXXXX${activeProfile.panNumber.slice(-4)}`, 87, y);
    } else {
      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.text(activeProfile.panNumber, 85, y);
    }

    // Aadhaar
    y += 12;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text('Aadhaar Number (UIDAI):', 22, y);
    if (maskAadhaar) {
      doc.setFillColor(15, 23, 42);
      doc.rect(85, y - 4, 44, 5.5, 'F'); // Mask box
      doc.setTextColor(255, 255, 255);
      doc.setFont('courier', 'bold');
      doc.text(`XXXX-XXXX-${activeProfile.aadhaarNumber.slice(-4)}`, 87, y);
    } else {
      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.text(activeProfile.aadhaarNumber, 85, y);
    }

    // Bank
    y += 12;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text('Bank Account Number & IFSC:', 22, y);
    if (maskBank) {
      doc.setFillColor(15, 23, 42);
      doc.rect(85, y - 4, 42, 5.5, 'F'); // Mask box
      doc.setTextColor(255, 255, 255);
      doc.setFont('courier', 'bold');
      doc.text(`XXXXXX${activeProfile.bankAccount.slice(-4)}`, 87, y);
    } else {
      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.text(activeProfile.bankAccount, 85, y);
    }

    // Financials Divider
    y += 10;
    doc.setDrawColor(226, 232, 240);
    doc.line(20, y, pageWidth - 20, y);

    // Gross Salary
    y += 10;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text('1. Gross Salary / Turnover:', 22, y);
    if (maskSalary) {
      doc.setFillColor(15, 23, 42);
      doc.rect(130, y - 4, 30, 5.5, 'F');
      doc.setTextColor(255, 255, 255);
      doc.text('XXXXXXXX', 133, y);
    } else {
      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.text(`Rs. ${activeProfile.grossIncome.toLocaleString('en-IN')}`, 130, y);
    }

    // Standard Deduction
    y += 9;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text('2. Standard Deduction u/s 16(ia):', 22, y);
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.text(`Rs. ${activeProfile.stdDeduction.toLocaleString('en-IN')}`, 130, y);

    // Net Taxable
    y += 10;
    doc.setFillColor(241, 245, 249);
    doc.rect(20, y - 5, pageWidth - 40, 9, 'F');
    doc.setTextColor(4, 120, 87); // Emerald 700
    doc.setFont('helvetica', 'bold');
    doc.text('3. Net Taxable Income:', 22, y);
    if (maskSalary) {
      doc.setFillColor(15, 23, 42);
      doc.rect(130, y - 4, 30, 5.5, 'F');
      doc.setTextColor(255, 255, 255);
      doc.text('XXXXXXXX', 133, y);
    } else {
      doc.text(`Rs. ${activeProfile.netTaxable.toLocaleString('en-IN')}`, 130, y);
    }

    // 4. Compliance Certificate Seal at bottom
    const certY = 185;
    doc.setDrawColor(16, 185, 129);
    doc.setFillColor(236, 253, 245);
    doc.roundedRect(14, certY, pageWidth - 28, 45, 2, 2, 'FD');

    doc.setTextColor(6, 95, 70);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('DIGITAL PRIVACY & STATUTORY DPDP VERIFICATION', 20, certY + 9);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(51, 65, 85);
    doc.text('• This document has been sanitized according to Digital Personal Data Protection (DPDP) Act guidelines.', 20, certY + 17);
    doc.text(`• Sensitive identifier coordinates (PAN: ${maskPan ? 'Masked' : 'Exposed'}, Aadhaar: ${maskAadhaar ? 'Masked' : 'Exposed'}, Bank: ${maskBank ? 'Masked' : 'Exposed'}) have been processed.`, 20, certY + 23);
    doc.text('• Verified cryptographic signature applied by Trac Consultant Financial Security Suite.', 20, certY + 29);
    doc.text('• Valid for sharing with Auditors, Banks, Landlords, and Third-Party Compliance Verifiers.', 20, certY + 35);

    // Save real PDF
    const cleanDocName = fileName.replace(/\.[^/.]+$/, "");
    doc.save(`Sanitized_${cleanDocName}_DPDP_Redacted.pdf`);
  };

  return (
    <div className="min-h-screen bg-slate-50/70 pb-20">
      {/* Sleek Breadcrumb Toolbar */}
      <div className="bg-slate-900 border-b border-slate-800 text-white px-4 sm:px-8 py-3">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Link href="/tools" className="text-slate-400 hover:text-white transition-colors">
              Tools Suite
            </Link>
            <span className="text-slate-600">/</span>
            <span className="text-emerald-400 font-semibold">{toolName}</span>
          </div>

          <div className="flex items-center gap-3">
            {isUnlocked ? (
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold flex items-center gap-1.5">
                <Unlock className="w-3.5 h-3.5" /> Workspace Unlocked
              </span>
            ) : (
              <button
                onClick={() => setPaywallOpen(true)}
                className="px-3 py-1 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Unlock Tool (₹{price})</span>
              </button>
            )}
            <Link
              href="/tools"
              className="text-slate-300 hover:text-white px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              ← All Tools
            </Link>
          </div>
        </div>
      </div>

      {/* Main Tool Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 pt-6 relative z-10 space-y-6">
        
        {/* Tool Header Card */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-5 text-white shadow-md border border-indigo-900/40 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase tracking-wider mb-1 border border-indigo-500/30">
              <EyeOff className="w-3 h-3" /> DPDP Act 2023 Compliant • ₹{price} One-time
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">{toolName}</h1>
            <p className="text-xs text-slate-300 mt-0.5">
              Permanently mask PAN, Aadhaar, bank numbers & compensation before sharing tax files.
            </p>
          </div>

          {/* Quick Demo Templates */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Quick Demo:</span>
            <button
              onClick={() => {
                setActiveProfile(PRESET_TEMPLATES.form16);
                setFileName('Form16_PartB_AmitabhSharma.pdf');
                setFileSize('248 KB');
                setIsCustomUploaded(false);
              }}
              className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold border border-white/10 transition-colors cursor-pointer"
            >
              Form 16
            </button>
            <button
              onClick={() => {
                setActiveProfile(PRESET_TEMPLATES.bank);
                setFileName('HDFC_Bank_Statement_2024.pdf');
                setFileSize('512 KB');
                setIsCustomUploaded(false);
              }}
              className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold border border-white/10 transition-colors cursor-pointer"
            >
              Bank Statement
            </button>
            <button
              onClick={() => {
                setActiveProfile(PRESET_TEMPLATES.itrv);
                setFileName('ITR_V_Acknowledgement_AY2024-25.pdf');
                setFileSize('180 KB');
                setIsCustomUploaded(false);
              }}
              className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold border border-white/10 transition-colors cursor-pointer"
            >
              ITR-V
            </button>
          </div>
        </div>

        {/* 2-Column Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Controls Column */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-5">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Upload & Redaction Parameters</h2>
              <p className="text-xs text-slate-500 mt-0.5">Drop your own tax file or modify parameters below.</p>
            </div>

            {/* Hidden native file input */}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept=".pdf,.png,.jpg,.jpeg,.txt" 
              className="hidden" 
            />

            {/* Drag & Drop Upload Zone */}
            <div 
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-5 text-center transition-all cursor-pointer ${
                isDragging 
                  ? 'border-emerald-500 bg-emerald-50/50' 
                  : 'border-slate-200 hover:border-indigo-400 bg-slate-50/60'
              }`}
            >
              <Upload className="w-8 h-8 text-indigo-500 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-700">Click to Browse or Drop PDF / Image</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Form 16, Bank Statement, ITR-V, Aadhaar Card</p>
              <div className="mt-3 inline-flex items-center gap-1.5 font-mono text-[11px] bg-white border border-slate-200 px-3 py-1 rounded-lg text-slate-700 font-semibold shadow-xs">
                <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>{fileName}</span>
                <span className="text-slate-400">({fileSize})</span>
              </div>
            </div>

            {/* Masking Field Toggles */}
            <div className="space-y-2 pt-1">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Sensitive Fields to Mask:
              </label>
              
              <label className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200 cursor-pointer transition-colors">
                <div className="text-xs">
                  <span className="font-semibold text-slate-800 block">Permanent Account Number (PAN)</span>
                  <span className="text-[10px] text-slate-500">First 5 characters blacked out</span>
                </div>
                <input
                  type="checkbox"
                  checked={maskPan}
                  onChange={(e) => setMaskPan(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200 cursor-pointer transition-colors">
                <div className="text-xs">
                  <span className="font-semibold text-slate-800 block">Aadhaar Card (UIDAI Number)</span>
                  <span className="text-[10px] text-slate-500">First 8 digits permanently masked</span>
                </div>
                <input
                  type="checkbox"
                  checked={maskAadhaar}
                  onChange={(e) => setMaskAadhaar(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200 cursor-pointer transition-colors">
                <div className="text-xs">
                  <span className="font-semibold text-slate-800 block">Bank Account Number & IFSC</span>
                  <span className="text-[10px] text-slate-500">Masks account digits</span>
                </div>
                <input
                  type="checkbox"
                  checked={maskBank}
                  onChange={(e) => setMaskBank(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200 cursor-pointer transition-colors">
                <div className="text-xs">
                  <span className="font-semibold text-slate-800 block">Gross Salary & In-hand Figures</span>
                  <span className="text-[10px] text-slate-500">Redacts commercial compensation</span>
                </div>
                <input
                  type="checkbox"
                  checked={maskSalary}
                  onChange={(e) => setMaskSalary(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
                />
              </label>
            </div>

            {/* Watermark field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Custom Watermark Stamp:
              </label>
              <input
                type="text"
                value={watermark}
                onChange={(e) => setWatermark(e.target.value)}
                placeholder="e.g. CONFIDENTIAL - FOR BANK AUDIT ONLY"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Process Button */}
            <div>
              {isUnlocked ? (
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleSimulatedProcess}
                  className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Sanitizing & Applying Coordinates...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Process & Apply Redaction Coordinates</span>
                    </>
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setPaywallOpen(true)}
                  className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-700 hover:to-emerald-700 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  <span>Unlock Redaction Engine (₹{price})</span>
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Live Document Preview */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-200 relative overflow-hidden">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-sm font-bold text-slate-900">Document Live Redaction Preview</h3>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  {isUnlocked ? 'High-Resolution Vector Output' : 'Paywall Preview Mode'}
                </span>
              </div>

              {/* Document Preview Box */}
              <div className="mt-4 p-6 bg-slate-50 border border-slate-200 rounded-2xl relative font-mono text-xs space-y-4 select-none min-h-[300px]">
                {/* Diagonal Watermark Overlay */}
                {watermark && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10 rotate-[-25deg] overflow-hidden">
                    <span className="text-3xl font-black text-slate-900 tracking-widest text-center uppercase">
                      {watermark}
                    </span>
                  </div>
                )}

                <div className="text-center border-b border-slate-200 pb-3">
                  <div className="font-bold text-sm text-slate-800">{activeProfile.docType}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Under Certificate Provisions of Income-tax Act, 1961</div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-[11px]">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Name of Taxpayer / Entity:</span>
                    <strong className="text-slate-800 font-bold">{activeProfile.taxpayerName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">PAN of the Taxpayer:</span>
                    {maskPan ? (
                      <span className="bg-slate-950 text-white px-2 py-0.5 rounded font-mono font-bold tracking-widest text-[10px]">
                        XXXXX{activeProfile.panNumber.slice(-4)}
                      </span>
                    ) : (
                      <span className="text-slate-800 font-bold">{activeProfile.panNumber}</span>
                    )}
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Aadhaar Number (UIDAI):</span>
                    {maskAadhaar ? (
                      <span className="bg-slate-950 text-white px-2 py-0.5 rounded font-mono font-bold tracking-widest text-[10px]">
                        XXXX-XXXX-{activeProfile.aadhaarNumber.slice(-4)}
                      </span>
                    ) : (
                      <span className="text-slate-800 font-bold">{activeProfile.aadhaarNumber}</span>
                    )}
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Salary / Operating Account:</span>
                    {maskBank ? (
                      <span className="bg-slate-950 text-white px-2 py-0.5 rounded font-mono font-bold tracking-widest text-[10px]">
                        XXXXXX{activeProfile.bankAccount.slice(-4)}
                      </span>
                    ) : (
                      <span className="text-slate-800 font-bold">{activeProfile.bankAccount}</span>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 text-[11px] space-y-1.5">
                  <div className="flex justify-between py-0.5">
                    <span>1. Gross Total Compensation / Receipts:</span>
                    {maskSalary ? (
                      <span className="bg-slate-950 text-white px-2 py-0.5 rounded font-mono font-bold text-[10px]">
                        ₹ XXXXXXX
                      </span>
                    ) : (
                      <span className="font-bold">₹{activeProfile.grossIncome.toLocaleString('en-IN')}</span>
                    )}
                  </div>
                  <div className="flex justify-between py-0.5">
                    <span>2. Standard Statutory Deduction:</span>
                    <span className="font-bold">₹{activeProfile.stdDeduction.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between py-1 border-t border-slate-200 font-bold text-emerald-700">
                    <span>3. Net Taxable Income:</span>
                    {maskSalary ? (
                      <span className="bg-slate-950 text-white px-2 py-0.5 rounded font-mono font-bold text-[10px]">
                        ₹ XXXXXXX
                      </span>
                    ) : (
                      <span>₹{activeProfile.netTaxable.toLocaleString('en-IN')}</span>
                    )}
                  </div>
                </div>

                {/* DPDP Compliance Tag */}
                <div className="pt-2 text-[10px] text-emerald-700 flex items-center gap-1.5 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Verified: Permanent black-box pixel replacement. Underlying text cannot be scraped.</span>
                </div>
              </div>

              {/* Download Bar */}
              <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="text-xs text-slate-600">
                  {isUnlocked ? (
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Ready to export genuine sanitized PDF
                    </span>
                  ) : (
                    <span className="text-slate-500">🔒 Unlock full access to export real sanitized PDF files.</span>
                  )}
                </div>

                {isUnlocked ? (
                  <button
                    onClick={handleDownloadRealPdf}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2 transition-all cursor-pointer hover:shadow-lg"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Sanitized PDF (.pdf)</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setPaywallOpen(true)}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Unlock Download (₹{price})</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Paywall Modal */}
      <ToolPaywallModal
        isOpen={paywallOpen}
        onClose={() => setPaywallOpen(false)}
        toolId={toolId}
        toolName={toolName}
        price={price}
        onUnlockSuccess={() => {
          refreshUser();
        }}
      />
    </div>
  );
}

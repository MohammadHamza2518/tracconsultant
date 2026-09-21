'use client';

import React, { useState, useId } from 'react';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import { 
  Calculator, 
  ArrowRight, 
  CheckCircle2, 
  TrendingDown, 
  Percent, 
  Home, 
  AlertCircle, 
  Download,
  FileText,
  FileSpreadsheet,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  ShieldCheck,
  Building2,
  Info,
  Award
} from 'lucide-react';
import Link from 'next/link';
import { useConfig } from '@/context/ConfigContext';

export type FinancialYearKey = 'FY2026-27' | 'FY2025-26' | 'FY2024-25' | 'FY2023-24';
export type AgeGroupKey = '0-60' | '60-80' | '80+';

export default function TaxCalculator() {
  const { taxRates } = useConfig();
  const [activeTab, setActiveTab] = useState<'income_tax' | 'hra' | 'gst'>('income_tax');

  // -------------------------------------------------------------
  // INCOME TAX WIZARD STATE (ClearTax-style 3 Steps)
  // -------------------------------------------------------------
  const [wizardStep, setWizardStep] = useState<'basic' | 'income' | 'deduction'>('basic');

  // Step 1: Basic Details
  const [selectedFY, setSelectedFY] = useState<FinancialYearKey>('FY2025-26');
  const [ageGroup, setAgeGroup] = useState<AgeGroupKey>('0-60');

  // Step 2: Income Details
  const [salaryIncome, setSalaryIncome] = useState<number>(950000);
  const [businessIncome, setBusinessIncome] = useState<number>(0);
  const [interestIncome, setInterestIncome] = useState<number>(15000);
  const [rentalIncome, setRentalIncome] = useState<number>(0);
  const [digitalAssetsIncome, setDigitalAssetsIncome] = useState<number>(0);
  const [exemptAllowances, setExemptAllowances] = useState<number>(0);
  const [homeLoanSelf, setHomeLoanSelf] = useState<number>(0);
  const [homeLoanLetOut, setHomeLoanLetOut] = useState<number>(0);
  const [otherIncome, setOtherIncome] = useState<number>(0);

  // Step 3: Deductions
  const [sec80C, setSec80C] = useState<number>(150000);
  const [sec80D, setSec80D] = useState<number>(25000);
  const [sec80EEA, setSec80EEA] = useState<number>(0);
  const [employerNps80CCD2, setEmployerNps80CCD2] = useState<number>(0);
  const [sec80TTA, setSec80TTA] = useState<number>(10000);
  const [sec80G, setSec80G] = useState<number>(0);
  const [employeeNps80CCD1B, setEmployeeNps80CCD1B] = useState<number>(0);
  const [otherDeductions, setOtherDeductions] = useState<number>(0);

  // Quick helper: is salaried?
  const isSalaried = salaryIncome > 0;

  // -------------------------------------------------------------
  // HRA Sub-calculator State
  // -------------------------------------------------------------
  const [basicSalary, setBasicSalary] = useState<number>(600000);
  const [hraReceived, setHraReceived] = useState<number>(240000);
  const [rentPaidAnnual, setRentPaidAnnual] = useState<number>(240000);
  const [isMetro, setIsMetro] = useState<boolean>(true);

  // -------------------------------------------------------------
  // GST Sub-calculator State
  // -------------------------------------------------------------
  const [gstAmount, setGstAmount] = useState<number>(10000);
  const [gstRate, setGstRate] = useState<number>(18);
  const [gstMode, setGstMode] = useState<'exclusive' | 'inclusive'>('exclusive');

  // Cess
  const cessRate = 0.04;

  // -------------------------------------------------------------
  // DYNAMIC SLAB RATES BY FINANCIAL YEAR & AGE
  // -------------------------------------------------------------
  const getSlabTable = (fy: FinancialYearKey, age: AgeGroupKey) => {
    // Old Regime Exemption Limit based on Age
    const oldExemptText = age === '80+' ? 'Up to 5 lakh' : age === '60-80' ? 'Up to 3 lakh' : 'Up to 2.5 lakh';
    const oldSecondText = age === '80+' ? 'Nil (Exempt)' : age === '60-80' ? '3 lakh to 5 lakh' : '2.5 lakh to 5 lakh';

    const oldSlabs = [
      { slab: oldExemptText, rate: 'Nil' },
      { slab: oldSecondText, rate: '5%' },
      { slab: '5 lakh to 10 lakh', rate: '20%' },
      { slab: 'Above 10 lakh', rate: '30%' }
    ];

    let newSlabs: { slab: string; rate: string }[] = [];

    if (fy === 'FY2026-27') {
      // ClearTax FY 26-27 projected slabs (Screenshot 2)
      newSlabs = [
        { slab: 'Up to 4 lakh', rate: 'Nil' },
        { slab: '4 lakh to 8 lakh', rate: '5%' },
        { slab: '8 lakh to 12 lakh', rate: '10%' },
        { slab: '12 lakh to 16 lakh', rate: '15%' },
        { slab: '16 lakh to 20 lakh', rate: '20%' },
        { slab: '20 lakh to 24 lakh', rate: '25%' },
        { slab: 'Above 24 lakh', rate: '30%' }
      ];
    } else if (fy === 'FY2025-26' || fy === 'FY2024-25') {
      // Union Budget 2024 Revised Slabs
      newSlabs = [
        { slab: 'Up to 3 lakh', rate: 'Nil' },
        { slab: '3 lakh to 7 lakh', rate: '5%' },
        { slab: '7 lakh to 10 lakh', rate: '10%' },
        { slab: '10 lakh to 12 lakh', rate: '15%' },
        { slab: '12 lakh to 15 lakh', rate: '20%' },
        { slab: 'Above 15 lakh', rate: '30%' }
      ];
    } else {
      // FY 2023-24
      newSlabs = [
        { slab: 'Up to 3 lakh', rate: 'Nil' },
        { slab: '3 lakh to 6 lakh', rate: '5%' },
        { slab: '6 lakh to 9 lakh', rate: '10%' },
        { slab: '9 lakh to 12 lakh', rate: '15%' },
        { slab: '12 lakh to 15 lakh', rate: '20%' },
        { slab: 'Above 15 lakh', rate: '30%' }
      ];
    }

    return { oldSlabs, newSlabs };
  };

  // -------------------------------------------------------------
  // COMPREHENSIVE TAX COMPUTATION ENGINE
  // -------------------------------------------------------------
  const calculateTax = () => {
    // Gross Income Aggregate (excluding flat 30% digital assets for regular slabs)
    const grossRegularIncome = Math.max(0, 
      (salaryIncome || 0) + 
      (businessIncome || 0) + 
      (interestIncome || 0) + 
      (rentalIncome || 0) + 
      (otherIncome || 0)
    );

    // 1. New Regime Deductions & Slabs
    // Standard deduction: ₹75,000 in FY 24-25, 25-26, 26-27; ₹50,000 in FY 23-24
    const newStdDeduction = isSalaried ? (selectedFY === 'FY2023-24' ? 50000 : 75000) : 0;
    // Employer NPS 80CCD(2) allowed in New Regime up to 14% of salary
    const cappedEmployerNpsNew = Math.min(employerNps80CCD2 || 0, (salaryIncome || 0) * 0.14);
    const newTaxableIncome = Math.max(0, grossRegularIncome - newStdDeduction - cappedEmployerNpsNew);

    let newTax = 0;

    if (selectedFY === 'FY2026-27') {
      // ClearTax FY 26-27 Slabs
      // 87A rebate for income up to 12 Lakhs (tax zero up to 12L)
      if (newTaxableIncome <= 1200000) {
        newTax = 0;
      } else {
        if (newTaxableIncome > 400000) newTax += Math.min(newTaxableIncome - 400000, 400000) * 0.05;
        if (newTaxableIncome > 800000) newTax += Math.min(newTaxableIncome - 800000, 400000) * 0.10;
        if (newTaxableIncome > 1200000) newTax += Math.min(newTaxableIncome - 1200000, 400000) * 0.15;
        if (newTaxableIncome > 1600000) newTax += Math.min(newTaxableIncome - 1600000, 400000) * 0.20;
        if (newTaxableIncome > 2000000) newTax += Math.min(newTaxableIncome - 2000000, 400000) * 0.25;
        if (newTaxableIncome > 2400000) newTax += (newTaxableIncome - 2400000) * 0.30;
      }
    } else if (selectedFY === 'FY2025-26' || selectedFY === 'FY2024-25') {
      // Union Budget 2024 revised slabs: rebate up to 7 Lakhs
      if (newTaxableIncome <= 700000) {
        newTax = 0;
      } else {
        if (newTaxableIncome > 300000) newTax += Math.min(newTaxableIncome - 300000, 400000) * 0.05;
        if (newTaxableIncome > 700000) newTax += Math.min(newTaxableIncome - 700000, 300000) * 0.10;
        if (newTaxableIncome > 1000000) newTax += Math.min(newTaxableIncome - 1000000, 200000) * 0.15;
        if (newTaxableIncome > 1200000) newTax += Math.min(newTaxableIncome - 1200000, 300000) * 0.20;
        if (newTaxableIncome > 1500000) newTax += (newTaxableIncome - 1500000) * 0.30;
      }
    } else {
      // FY 2023-24 slabs
      if (newTaxableIncome <= 700000) {
        newTax = 0;
      } else {
        if (newTaxableIncome > 300000) newTax += Math.min(newTaxableIncome - 300000, 300000) * 0.05;
        if (newTaxableIncome > 600000) newTax += Math.min(newTaxableIncome - 600000, 300000) * 0.10;
        if (newTaxableIncome > 900000) newTax += Math.min(newTaxableIncome - 900000, 300000) * 0.15;
        if (newTaxableIncome > 1200000) newTax += Math.min(newTaxableIncome - 1200000, 300000) * 0.20;
        if (newTaxableIncome > 1500000) newTax += (newTaxableIncome - 1500000) * 0.30;
      }
    }

    // Flat 30% tax on Digital Assets (Crypto / VDA)
    const cryptoTaxNew = (digitalAssetsIncome || 0) * 0.30;
    const newCess = (newTax + cryptoTaxNew) * cessRate;
    const totalNewTax = Math.round(newTax + cryptoTaxNew + newCess);

    // 2. Old Regime Deductions & Slabs
    const oldStdDeduction = isSalaried ? 50000 : 0;
    const capped80C = Math.min(sec80C || 0, 150000);
    const max80D = ageGroup === '0-60' ? 50000 : 100000;
    const capped80D = Math.min(sec80D || 0, max80D);
    const cappedHomeLoan = Math.min(homeLoanSelf || 0, 200000);
    const capped80EEA = Math.min(sec80EEA || 0, 150000);
    const capped80CCD1B = Math.min(employeeNps80CCD1B || 0, 50000);
    const capped80TTA = Math.min(sec80TTA || 0, ageGroup === '0-60' ? 10000 : 50000);
    const cappedEmployerNpsOld = Math.min(employerNps80CCD2 || 0, (salaryIncome || 0) * 0.10);

    const totalOldDeductions = 
      oldStdDeduction + 
      (exemptAllowances || 0) + 
      capped80C + 
      capped80D + 
      cappedHomeLoan + 
      (homeLoanLetOut || 0) + 
      capped80EEA + 
      capped80CCD1B + 
      cappedEmployerNpsOld + 
      capped80TTA + 
      (sec80G || 0) + 
      (otherDeductions || 0);

    const oldTaxableIncome = Math.max(0, grossRegularIncome - totalOldDeductions);

    let oldTax = 0;
    // Old regime 87A rebate up to 5 Lakhs
    if (oldTaxableIncome <= 500000) {
      oldTax = 0;
    } else {
      const exemptLimit = ageGroup === '80+' ? 500000 : ageGroup === '60-80' ? 300000 : 250000;
      if (oldTaxableIncome > exemptLimit) {
        oldTax += Math.min(oldTaxableIncome - exemptLimit, 500000 - exemptLimit) * 0.05;
      }
      if (oldTaxableIncome > 500000) {
        oldTax += Math.min(oldTaxableIncome - 500000, 500000) * 0.20;
      }
      if (oldTaxableIncome > 1000000) {
        oldTax += (oldTaxableIncome - 1000000) * 0.30;
      }
    }

    const cryptoTaxOld = (digitalAssetsIncome || 0) * 0.30;
    const oldCess = (oldTax + cryptoTaxOld) * cessRate;
    const totalOldTax = Math.round(oldTax + cryptoTaxOld + oldCess);

    const savings = Math.abs(totalOldTax - totalNewTax);
    const recommendedRegime = totalNewTax <= totalOldTax ? 'New Tax Regime' : 'Old Tax Regime';

    return {
      grossRegularIncome,
      newStdDeduction,
      newTaxableIncome,
      totalNewTax,
      oldStdDeduction,
      totalOldDeductions,
      oldTaxableIncome,
      totalOldTax,
      savings,
      recommendedRegime
    };
  };

  const taxResult = calculateTax();
  const currentSlabs = getSlabTable(selectedFY, ageGroup);

  // -------------------------------------------------------------
  // FORMAL PDF & EXCEL EXPORTS
  // -------------------------------------------------------------
  const downloadTaxPdf = () => {
    try {
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 14;
      const contentWidth = pageWidth - (margin * 2);

      // Header Banner
      doc.setFillColor(11, 37, 69);
      doc.rect(0, 0, pageWidth, 24, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('TRACCONSULTANT', margin, 12);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(201, 147, 59);
      doc.text(`Income Tax Computation & Comparison • ${selectedFY}`, margin, 18);

      const nowStr = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
      doc.setFontSize(7.5);
      doc.setTextColor(220, 230, 242);
      doc.text(`Date: ${nowStr}`, pageWidth - margin, 11, { align: 'right' });

      // Badge
      doc.setFillColor(5, 150, 105);
      doc.roundedRect(pageWidth - margin - 50, 14, 50, 6, 1, 1, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.text(`RECOMMENDED: ${taxResult.recommendedRegime.toUpperCase()}`, pageWidth - margin - 25, 18.2, { align: 'center' });

      let currentY = 32;

      // Section 1: Client Profile
      doc.setFillColor(241, 245, 249);
      doc.rect(margin, currentY, contentWidth, 7, 'F');
      doc.setTextColor(11, 37, 69);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text('1. TAXPAYER PROFILE & APPLICABLE YEAR', margin + 3, currentY + 4.8);
      currentY += 9;

      const profileRows = [
        ['Financial Year & Assessment Year', `${selectedFY} (Assessment Year ${selectedFY === 'FY2026-27' ? 'AY 2027-28' : selectedFY === 'FY2025-26' ? 'AY 2026-27' : selectedFY === 'FY2024-25' ? 'AY 2025-26' : 'AY 2024-25'})`],
        ['Age Bracket', ageGroup === '80+' ? 'Super Senior Citizen (80+ Years)' : ageGroup === '60-80' ? 'Senior Citizen (60-80 Years)' : 'Individual Resident (< 60 Years)'],
        ['Gross Salary Income', `Rs. ${salaryIncome.toLocaleString('en-IN')}`],
        ['Business / Professional Income (Sec 44AD/44ADA)', `Rs. ${businessIncome.toLocaleString('en-IN')}`],
        ['Other Income (Interest, Rental, Other)', `Rs. ${(interestIncome + rentalIncome + otherIncome).toLocaleString('en-IN')}`],
        ['Gross Total Regular Income', `Rs. ${taxResult.grossRegularIncome.toLocaleString('en-IN')}`]
      ];

      profileRows.forEach((r, idx) => {
        doc.setFillColor(idx % 2 === 0 ? 255 : 248, idx % 2 === 0 ? 255 : 250, idx % 2 === 0 ? 255 : 252);
        doc.rect(margin, currentY, contentWidth, 6, 'F');
        doc.setDrawColor(226, 232, 240);
        doc.rect(margin, currentY, contentWidth, 6, 'S');

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(71, 85, 105);
        doc.text(r[0], margin + 3, currentY + 4.2);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(15, 23, 42);
        doc.text(r[1], pageWidth - margin - 3, currentY + 4.2, { align: 'right' });
        currentY += 6;
      });

      currentY += 6;

      // Section 2: Side by Side Computation Table
      doc.setFillColor(241, 245, 249);
      doc.rect(margin, currentY, contentWidth, 7, 'F');
      doc.setTextColor(11, 37, 69);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text('2. SIDE-BY-SIDE REGIME COMPARISON (NEW VS OLD)', margin + 3, currentY + 4.8);
      currentY += 9;

      // Table Header
      doc.setFillColor(11, 37, 69);
      doc.rect(margin, currentY, contentWidth, 7, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.text('Computation Particulars', margin + 3, currentY + 4.8);
      doc.text('New Regime (Sec 115BAC)', margin + 85, currentY + 4.8);
      doc.text('Old Tax Regime', margin + 140, currentY + 4.8);
      currentY += 7;

      const compRows = [
        ['Gross Total Regular Income', `Rs. ${taxResult.grossRegularIncome.toLocaleString('en-IN')}`, `Rs. ${taxResult.grossRegularIncome.toLocaleString('en-IN')}`],
        ['Standard Deduction (Salaried)', `Rs. ${taxResult.newStdDeduction.toLocaleString('en-IN')}`, `Rs. ${taxResult.oldStdDeduction.toLocaleString('en-IN')}`],
        ['Chapter VI-A & Other Deductions', `Rs. ${(employerNps80CCD2 || 0).toLocaleString('en-IN')}`, `Rs. ${(taxResult.totalOldDeductions - taxResult.oldStdDeduction).toLocaleString('en-IN')}`],
        ['Total Deductions Claimed', `Rs. ${(taxResult.newStdDeduction + (employerNps80CCD2 || 0)).toLocaleString('en-IN')}`, `Rs. ${taxResult.totalOldDeductions.toLocaleString('en-IN')}`],
        ['Net Taxable Income', `Rs. ${taxResult.newTaxableIncome.toLocaleString('en-IN')}`, `Rs. ${taxResult.oldTaxableIncome.toLocaleString('en-IN')}`],
        ['FINAL TAX PAYABLE (incl 4% Cess)', `Rs. ${taxResult.totalNewTax.toLocaleString('en-IN')}`, `Rs. ${taxResult.totalOldTax.toLocaleString('en-IN')}`]
      ];

      compRows.forEach((r, idx) => {
        const isFinal = idx === compRows.length - 1;
        doc.setFillColor(isFinal ? 236 : (idx % 2 === 0 ? 255 : 248), isFinal ? 253 : (idx % 2 === 0 ? 255 : 250), isFinal ? 245 : (idx % 2 === 0 ? 255 : 252));
        doc.rect(margin, currentY, contentWidth, 6.5, 'F');
        doc.setDrawColor(226, 232, 240);
        doc.rect(margin, currentY, contentWidth, 6.5, 'S');

        doc.setFont('helvetica', isFinal ? 'bold' : 'normal');
        doc.setFontSize(8);
        doc.setTextColor(isFinal ? 5 : 71, isFinal ? 150 : 85, isFinal ? 105 : 105);
        doc.text(r[0], margin + 3, currentY + 4.5);
        doc.text(r[1], margin + 85, currentY + 4.5);
        doc.text(r[2], margin + 140, currentY + 4.5);
        currentY += 6.5;
      });

      currentY += 6;

      // Recommendation Box
      doc.setFillColor(236, 253, 245);
      doc.roundedRect(margin, currentY, contentWidth, 15, 1.5, 1.5, 'F');
      doc.setDrawColor(16, 185, 129);
      doc.roundedRect(margin, currentY, contentWidth, 15, 1.5, 1.5, 'S');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(6, 95, 70);
      doc.text(`RECOMMENDATION: CHOOSE ${taxResult.recommendedRegime.toUpperCase()}`, margin + 3, currentY + 5.5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(4, 120, 87);
      doc.text(`By opting for ${taxResult.recommendedRegime}, you save approx Rs. ${taxResult.savings.toLocaleString('en-IN')} in taxes for ${selectedFY}.`, margin + 3, currentY + 10.5);

      currentY += 21;

      // Footer
      doc.setDrawColor(226, 232, 240);
      doc.line(margin, currentY, pageWidth - margin, currentY);
      currentY += 4;
      doc.setFontSize(7);
      doc.setTextColor(148, 163, 184);
      doc.text('TracConsultant Certified Chartered Accountant Tax Advisory Engine • https://tracconsultant.com', margin, currentY);
      doc.text(`Generated: ${new Date().toLocaleString('en-IN')}`, pageWidth - margin, currentY, { align: 'right' });

      doc.save(`Income_Tax_Computation_${selectedFY}_${taxResult.recommendedRegime.replace(/\s+/g, '')}.pdf`);
    } catch (err) {
      console.error('PDF error:', err);
    }
  };

  const downloadTaxExcel = () => {
    try {
      const wb = XLSX.utils.book_new();

      const data = [
        ['TRACCONSULTANT - INCOME TAX COMPUTATION & REGIME COMPARISON'],
        [`Financial Year: ${selectedFY} | Age Group: ${ageGroup}`],
        [`Generated On: ${new Date().toLocaleString('en-IN')}`],
        [],
        ['1. INCOME BREAKDOWN', 'AMOUNT (INR)'],
        ['Salary Income', salaryIncome],
        ['Business & Professional Income (Sec 44AD/44ADA)', businessIncome],
        ['Interest Income (Savings & FDs)', interestIncome],
        ['Rental Income Received', rentalIncome],
        ['Digital Assets / Crypto Income (Taxed @ 30%)', digitalAssetsIncome],
        ['Other Income', otherIncome],
        ['GROSS TOTAL REGULAR INCOME', taxResult.grossRegularIncome],
        [],
        ['2. COMPARATIVE TAX LIABILITY', 'NEW REGIME (SEC 115BAC)', 'OLD REGIME'],
        ['Gross Total Income', taxResult.grossRegularIncome, taxResult.grossRegularIncome],
        ['Standard Deduction (Salaried)', taxResult.newStdDeduction, taxResult.oldStdDeduction],
        ['Section 80C Deductions (Max 1.5L)', 0, Math.min(sec80C, 150000)],
        ['Section 80D Health Insurance', 0, sec80D],
        ['Home Loan Interest (Sec 24b)', 0, Math.min(homeLoanSelf, 200000)],
        ['Employer NPS Contribution (Sec 80CCD-2)', employerNps80CCD2, employerNps80CCD2],
        ['Total Deductions Allowed', taxResult.newStdDeduction + (employerNps80CCD2 || 0), taxResult.totalOldDeductions],
        ['Net Taxable Income', taxResult.newTaxableIncome, taxResult.oldTaxableIncome],
        ['FINAL TAX LIABILITY (INCL 4% CESS)', taxResult.totalNewTax, taxResult.totalOldTax],
        [],
        ['RECOMMENDED REGIME', taxResult.recommendedRegime.toUpperCase()],
        ['ESTIMATED TAX SAVINGS (INR)', taxResult.savings],
        [],
        ['Official Engine: TracConsultant (https://tracconsultant.com)']
      ];

      const ws = XLSX.utils.aoa_to_sheet(data);
      ws['!cols'] = [{ wch: 42 }, { wch: 28 }, { wch: 22 }];
      XLSX.utils.book_append_sheet(wb, ws, 'Tax_Comparison');

      XLSX.writeFile(wb, `Income_Tax_Computation_${selectedFY}.xlsx`);
    } catch (err) {
      console.error('Excel error:', err);
    }
  };

  // -------------------------------------------------------------
  // HRA EXEMPTION COMPUTATION (Sub-calculator)
  // -------------------------------------------------------------
  const calculateHRA = () => {
    const cond1 = hraReceived;
    const cond2 = (isMetro ? 0.50 : 0.40) * basicSalary;
    const cond3 = Math.max(0, rentPaidAnnual - (0.10 * basicSalary));
    const exemptHRA = Math.min(cond1, cond2, cond3);
    const taxableHRA = Math.max(0, hraReceived - exemptHRA);
    return { exemptHRA, taxableHRA };
  };
  const hraResult = calculateHRA();

  // -------------------------------------------------------------
  // GST COMPUTATION (Sub-calculator)
  // -------------------------------------------------------------
  const calculateGST = () => {
    let taxAmount = 0;
    let netAmount = 0;
    if (gstMode === 'exclusive') {
      taxAmount = gstAmount * (gstRate / 100);
      netAmount = gstAmount + taxAmount;
    } else {
      netAmount = gstAmount;
      const base = gstAmount / (1 + (gstRate / 100));
      taxAmount = gstAmount - base;
    }
    return {
      taxAmount: Math.round(taxAmount),
      netAmount: Math.round(netAmount),
      cgst: Math.round(taxAmount / 2),
      sgst: Math.round(taxAmount / 2)
    };
  };
  const gstResult = calculateGST();

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
      {/* Top FinTech Mode Tabs */}
      <div className="flex border-b border-slate-200 bg-[#0B2545] p-2 gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('income_tax')}
          className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'income_tax'
              ? 'bg-emerald-500 text-white shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span>Income Tax Calculator</span>
        </button>
        <button
          onClick={() => setActiveTab('hra')}
          className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'hra'
              ? 'bg-emerald-500 text-white shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <Home className="w-4 h-4" />
          <span>HRA Exemption</span>
        </button>
        <button
          onClick={() => setActiveTab('gst')}
          className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'gst'
              ? 'bg-emerald-500 text-white shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <Percent className="w-4 h-4" />
          <span>GST Calculator</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: CLEARTAX-STYLE 3-STEP INCOME TAX WIZARD           */}
      {/* ========================================================= */}
      {activeTab === 'income_tax' && (
        <div className="p-5 sm:p-8">
          {/* Wizard Sub-tabs (Matches ClearTax Screenshots: Basic details | Income details | Deduction) */}
          <div className="border-b border-slate-200 mb-6 flex gap-6 text-sm font-bold">
            <button
              onClick={() => setWizardStep('basic')}
              className={`pb-3 border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
                wizardStep === 'basic'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>Basic details</span>
            </button>
            <button
              onClick={() => setWizardStep('income')}
              className={`pb-3 border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
                wizardStep === 'income'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>Income details</span>
            </button>
            <button
              onClick={() => setWizardStep('deduction')}
              className={`pb-3 border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
                wizardStep === 'deduction'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>Deduction</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: STEP CONTENT (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* ----------------------------------------------------- */}
              {/* STEP 1: BASIC DETAILS (Screenshot 2)                  */}
              {/* ----------------------------------------------------- */}
              {wizardStep === 'basic' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Financial Year Dropdown */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Financial year
                      </label>
                      <select
                        value={selectedFY}
                        onChange={(e) => setSelectedFY(e.target.value as FinancialYearKey)}
                        className="w-full py-2.5 px-3 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 cursor-pointer"
                      >
                        <option value="FY2026-27">FY 2026-2027 (Return to be filed between 1st April 2027 - 31st March 2028)</option>
                        <option value="FY2025-26">FY 2025-2026 (Return to be filed between 1st April 2026 - 31st March 2027)</option>
                        <option value="FY2024-25">FY 2024-2025 (Return to be filed between 1st April 2025 - 31st March 2026)</option>
                        <option value="FY2023-24">FY 2023-2024 (Return to be filed between 1st April 2024 - 31st March 2025)</option>
                      </select>
                    </div>

                    {/* Age Group Dropdown */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Age group
                      </label>
                      <select
                        value={ageGroup}
                        onChange={(e) => setAgeGroup(e.target.value as AgeGroupKey)}
                        className="w-full py-2.5 px-3 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 cursor-pointer"
                      >
                        <option value="0-60">0-60 (Resident Individual)</option>
                        <option value="60-80">60-80 (Senior Citizen)</option>
                        <option value="80+">80+ (Super Senior Citizen)</option>
                      </select>
                    </div>
                  </div>

                  {/* Slabs Display Table (Matches ClearTax Screenshot 2) */}
                  <div className="pt-2">
                    <h4 className="text-center text-sm font-bold text-slate-900 mb-3">
                      Income Tax Slab Rates for {selectedFY}
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* New Regime Slabs */}
                      <div className="border border-slate-200 rounded-xl overflow-hidden">
                        <div className="bg-slate-50 py-2 px-3 text-center border-b border-slate-200 font-bold text-xs text-slate-800">
                          New Regime Slab Rates
                        </div>
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="border-b border-slate-100 text-[11px] text-slate-500 font-semibold bg-slate-50/50">
                              <th className="py-2 px-3">Income Tax Slabs (Rs.)</th>
                              <th className="py-2 px-3 text-right">Rates</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                            {currentSlabs.newSlabs.map((s, idx) => (
                              <tr key={idx} className="hover:bg-slate-50/60">
                                <td className="py-1.5 px-3">{s.slab}</td>
                                <td className="py-1.5 px-3 text-right font-bold text-slate-900">{s.rate}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Old Regime Slabs */}
                      <div className="border border-slate-200 rounded-xl overflow-hidden">
                        <div className="bg-slate-50 py-2 px-3 text-center border-b border-slate-200 font-bold text-xs text-slate-800">
                          Old Regime Slab Rates
                        </div>
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="border-b border-slate-100 text-[11px] text-slate-500 font-semibold bg-slate-50/50">
                              <th className="py-2 px-3">Income Tax Slabs (Rs.)</th>
                              <th className="py-2 px-3 text-right">Rates</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                            {currentSlabs.oldSlabs.map((s, idx) => (
                              <tr key={idx} className="hover:bg-slate-50/60">
                                <td className="py-1.5 px-3">{s.slab}</td>
                                <td className="py-1.5 px-3 text-right font-bold text-slate-900">{s.rate}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-400 mt-2 text-right">
                      * Slab rates vary for resident senior and super senior citizens.
                    </p>
                  </div>

                  {/* Continue Button */}
                  <div className="flex justify-end pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setWizardStep('income')}
                      className="py-2.5 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Continue to Income Details</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* ----------------------------------------------------- */}
              {/* STEP 2: INCOME DETAILS (Screenshot 3)                 */}
              {/* ----------------------------------------------------- */}
              {wizardStep === 'income' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Income from Salary */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                        <span>Income from Salary</span>
                        <span className="text-[10px] text-slate-400">Annual CTC</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">₹</span>
                        <input
                          type="number"
                          value={salaryIncome || ''}
                          onChange={(e) => setSalaryIncome(Number(e.target.value))}
                          placeholder="0"
                          className="w-full pl-7 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-blue-600 font-mono"
                        />
                      </div>
                    </div>

                    {/* Business / Professional Income */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                        <span>Income from Business / Profession</span>
                        <span className="text-[10px] text-emerald-600 font-bold">Sec 44AD/44ADA</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">₹</span>
                        <input
                          type="number"
                          value={businessIncome || ''}
                          onChange={(e) => setBusinessIncome(Number(e.target.value))}
                          placeholder="0"
                          className="w-full pl-7 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-blue-600 font-mono"
                        />
                      </div>
                    </div>

                    {/* Income from interest */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Income from interest (Savings/FDs)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">₹</span>
                        <input
                          type="number"
                          value={interestIncome || ''}
                          onChange={(e) => setInterestIncome(Number(e.target.value))}
                          placeholder="0"
                          className="w-full pl-7 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-blue-600 font-mono"
                        />
                      </div>
                    </div>

                    {/* Exempt allowances */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Exempt allowances (HRA, LTA etc.)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">₹</span>
                        <input
                          type="number"
                          value={exemptAllowances || ''}
                          onChange={(e) => setExemptAllowances(Number(e.target.value))}
                          placeholder="0"
                          className="w-full pl-7 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-blue-600 font-mono"
                        />
                      </div>
                    </div>

                    {/* Rental income received */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Rental income received
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">₹</span>
                        <input
                          type="number"
                          value={rentalIncome || ''}
                          onChange={(e) => setRentalIncome(Number(e.target.value))}
                          placeholder="0"
                          className="w-full pl-7 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-blue-600 font-mono"
                        />
                      </div>
                    </div>

                    {/* Interest on home loan - Self occupied */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Interest on home loan - Self occupied (Sec 24b)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">₹</span>
                        <input
                          type="number"
                          value={homeLoanSelf || ''}
                          onChange={(e) => setHomeLoanSelf(Number(e.target.value))}
                          placeholder="0"
                          className="w-full pl-7 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-blue-600 font-mono"
                        />
                      </div>
                    </div>

                    {/* Income from digital assets */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Income from digital assets (Crypto / VDA @ 30%)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">₹</span>
                        <input
                          type="number"
                          value={digitalAssetsIncome || ''}
                          onChange={(e) => setDigitalAssetsIncome(Number(e.target.value))}
                          placeholder="0"
                          className="w-full pl-7 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-blue-600 font-mono"
                        />
                      </div>
                    </div>

                    {/* Other income */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Other income
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">₹</span>
                        <input
                          type="number"
                          value={otherIncome || ''}
                          onChange={(e) => setOtherIncome(Number(e.target.value))}
                          placeholder="0"
                          className="w-full pl-7 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-blue-600 font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex justify-between pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setWizardStep('basic')}
                      className="py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-xs transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setWizardStep('deduction')}
                      className="py-2.5 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Continue to Deductions</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* ----------------------------------------------------- */}
              {/* STEP 3: DEDUCTIONS (Screenshot 4)                     */}
              {/* ----------------------------------------------------- */}
              {wizardStep === 'deduction' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* 80C */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                        <span>Basic deductions - 80C</span>
                        <span className="text-[10px] text-slate-400">Max ₹1.5L</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">₹</span>
                        <input
                          type="number"
                          value={sec80C || ''}
                          onChange={(e) => setSec80C(Number(e.target.value))}
                          placeholder="0"
                          className="w-full pl-7 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-blue-600 font-mono"
                        />
                      </div>
                    </div>

                    {/* 80D */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                        <span>Medical insurance - 80D</span>
                        <span className="text-[10px] text-slate-400">Health Policy</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">₹</span>
                        <input
                          type="number"
                          value={sec80D || ''}
                          onChange={(e) => setSec80D(Number(e.target.value))}
                          placeholder="0"
                          className="w-full pl-7 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-blue-600 font-mono"
                        />
                      </div>
                    </div>

                    {/* 80EEA */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Interest on housing loan - 80EEA
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">₹</span>
                        <input
                          type="number"
                          value={sec80EEA || ''}
                          onChange={(e) => setSec80EEA(Number(e.target.value))}
                          placeholder="0"
                          className="w-full pl-7 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-blue-600 font-mono"
                        />
                      </div>
                    </div>

                    {/* 80CCD(2) Employer NPS */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                        <span>Employer&apos;s NPS - 80CCD(2)</span>
                        <span className="text-[10px] text-emerald-600 font-bold">Both Regimes</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">₹</span>
                        <input
                          type="number"
                          value={employerNps80CCD2 || ''}
                          onChange={(e) => setEmployerNps80CCD2(Number(e.target.value))}
                          placeholder="0"
                          className="w-full pl-7 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-blue-600 font-mono"
                        />
                      </div>
                    </div>

                    {/* 80TTA */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Interest from deposits - 80TTA
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">₹</span>
                        <input
                          type="number"
                          value={sec80TTA || ''}
                          onChange={(e) => setSec80TTA(Number(e.target.value))}
                          placeholder="0"
                          className="w-full pl-7 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-blue-600 font-mono"
                        />
                      </div>
                    </div>

                    {/* 80G Donations */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Donations to charity - 80G
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">₹</span>
                        <input
                          type="number"
                          value={sec80G || ''}
                          onChange={(e) => setSec80G(Number(e.target.value))}
                          placeholder="0"
                          className="w-full pl-7 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-blue-600 font-mono"
                        />
                      </div>
                    </div>

                    {/* 80CCD(1B) Voluntary NPS */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Employee&apos;s voluntary NPS - 80CCD(1B)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">₹</span>
                        <input
                          type="number"
                          value={employeeNps80CCD1B || ''}
                          onChange={(e) => setEmployeeNps80CCD1B(Number(e.target.value))}
                          placeholder="0"
                          className="w-full pl-7 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-blue-600 font-mono"
                        />
                      </div>
                    </div>

                    {/* Other Deductions */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Any other deduction (80E, 80U, 80GG)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">₹</span>
                        <input
                          type="number"
                          value={otherDeductions || ''}
                          onChange={(e) => setOtherDeductions(Number(e.target.value))}
                          placeholder="0"
                          className="w-full pl-7 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-blue-600 font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex justify-between pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setWizardStep('income')}
                      className="py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-xs transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        window.scrollTo({ top: 300, behavior: 'smooth' });
                      }}
                      className="py-2.5 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md cursor-pointer"
                    >
                      <span>View Calculation</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: STICKY TAX LIABILITY SUMMARY CARD (Matches ClearTax Screenshots 2, 3, 4) */}
            <div className="lg:col-span-5 sticky top-6 space-y-4">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 text-center space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-bold text-slate-800">
                    Tax Liability Summary
                  </h3>
                  <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                    {selectedFY}
                  </span>
                </div>

                {/* Old vs New Regime Figures */}
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-slate-500 font-medium">Old Regime</div>
                    <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono">
                      ₹{taxResult.totalOldTax.toLocaleString('en-IN')}
                    </div>
                  </div>

                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    vs
                  </div>

                  <div>
                    <div className="text-xs text-slate-500 font-medium">New Regime</div>
                    <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono">
                      ₹{taxResult.totalNewTax.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>

                {/* You Save Banner */}
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                  <div className="text-xs font-semibold text-emerald-800">
                    You save in {taxResult.recommendedRegime}:
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-emerald-700 font-mono mt-0.5">
                    ₹{taxResult.savings.toLocaleString('en-IN')}
                  </div>
                </div>

                {/* Primary CTA (Matches ClearTax: File Now) */}
                <Link
                  href="/services/itr-filing"
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>File with CA &amp; Claim Max Refund</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                {/* Dual Download Buttons: PDF & Excel */}
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Export Computation Summary
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={downloadTaxPdf}
                      className="py-2.5 px-3 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Download PDF</span>
                    </button>
                    <button
                      type="button"
                      onClick={downloadTaxExcel}
                      className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5" />
                      <span>Download Excel</span>
                    </button>
                  </div>
                </div>

                {/* Quick Expandable Breakdown */}
                <div className="text-left pt-2 border-t border-slate-100 text-xs space-y-1.5 text-slate-600">
                  <div className="flex justify-between py-0.5">
                    <span>Gross Regular Income:</span>
                    <span className="font-mono font-bold text-slate-900">₹{taxResult.grossRegularIncome.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between py-0.5">
                    <span>Deductions in Old Regime:</span>
                    <span className="font-mono font-bold text-slate-700">₹{taxResult.totalOldDeductions.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between py-0.5">
                    <span>Standard Deduction (New):</span>
                    <span className="font-mono font-bold text-slate-700">₹{taxResult.newStdDeduction.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between py-0.5 border-t border-slate-100 font-bold text-slate-900">
                    <span>Recommended Regime:</span>
                    <span className="text-emerald-600">{taxResult.recommendedRegime}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: HRA EXEMPTION SUB-CALCULATOR                      */}
      {/* ========================================================= */}
      {activeTab === 'hra' && (
        <div className="p-6 sm:p-8">
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
                Section 10(13A) • Rule 2A
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                HRA Exemption Calculator ({selectedFY})
              </h3>
            </div>
            <Link
              href="/tools/hra-calculator"
              className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
            >
              <span>Open Dedicated HRA Suite</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-6 space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Basic Salary (Annual)</span>
                  <span className="text-emerald-700 font-bold font-mono">₹{basicSalary.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min={100000}
                  max={3000000}
                  step={25000}
                  value={basicSalary}
                  onChange={(e) => setBasicSalary(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>HRA Received from Employer (Annual)</span>
                  <span className="text-emerald-700 font-bold font-mono">₹{hraReceived.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min={50000}
                  max={1500000}
                  step={10000}
                  value={hraReceived}
                  onChange={(e) => setHraReceived(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Total Rent Paid (Annual)</span>
                  <span className="text-emerald-700 font-bold font-mono">₹{rentPaidAnnual.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min={50000}
                  max={1500000}
                  step={10000}
                  value={rentPaidAnnual}
                  onChange={(e) => setRentPaidAnnual(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <span className="text-xs font-bold text-slate-700">Accommodation City Type:</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setIsMetro(true)}
                    className={`py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      isMetro ? 'bg-emerald-600 text-white' : 'bg-white border text-slate-700'
                    }`}
                  >
                    Metro City (50% Rule)
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsMetro(false)}
                    className={`py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      !isMetro ? 'bg-emerald-600 text-white' : 'bg-white border text-slate-700'
                    }`}
                  >
                    Non-Metro (40% Rule)
                  </button>
                </div>
                <p className="text-[10px] text-slate-500">
                  Metro: Delhi NCR, Mumbai, Kolkata, Chennai (50% of Basic+DA). Non-Metro: Bengaluru, Hyderabad, Pune, etc. (40%).
                </p>
              </div>
            </div>

            <div className="lg:col-span-6 bg-slate-900 text-white rounded-2xl p-6 flex flex-col justify-between space-y-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Statutory HRA Exemption Summary
                </h4>
                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40">
                    <div className="text-xs text-emerald-300 font-semibold">Exempt HRA (Tax-Free):</div>
                    <div className="text-2xl font-black text-white font-mono mt-1">
                      ₹{hraResult.exemptHRA.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 flex justify-between items-center text-xs">
                    <span className="text-slate-300">Taxable HRA (Added to Salary):</span>
                    <span className="font-mono font-bold text-rose-400">
                      ₹{hraResult.taxableHRA.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              <Link
                href="/tools/hra-calculator"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl text-center flex items-center justify-center gap-1"
              >
                <span>Full HRA Statement &amp; Downloads</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: GST SUB-CALCULATOR                                */}
      {/* ========================================================= */}
      {activeTab === 'gst' && (
        <div className="p-6 sm:p-8">
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
                CBIC Slabs (0%, 5%, 12%, 18%, 28%)
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                GST Tax Calculation Engine
              </h3>
            </div>
            <Link
              href="/tools/gst-calculator"
              className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
            >
              <span>Full GST Suite &amp; 22,616 HSN Directory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {gstMode === 'exclusive' ? 'Base Amount (Excluding GST)' : 'Total Invoice Amount (Including GST)'}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">₹</span>
                  <input
                    type="number"
                    value={gstAmount}
                    onChange={(e) => setGstAmount(Number(e.target.value))}
                    className="w-full pl-7 pr-3 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-bold font-mono text-slate-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  GST Rate Slab
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {[0, 5, 12, 18, 28].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setGstRate(r)}
                      className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        gstRate === r ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                      }`}
                    >
                      {r}%
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Calculation Mode
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setGstMode('exclusive')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      gstMode === 'exclusive' ? 'bg-[#0B2545] text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    GST Exclusive (+ Tax)
                  </button>
                  <button
                    type="button"
                    onClick={() => setGstMode('inclusive')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      gstMode === 'inclusive' ? 'bg-[#0B2545] text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    GST Inclusive (Reverse)
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 bg-slate-900 text-white rounded-2xl p-6 flex flex-col justify-between space-y-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  GST Tax Invoice Breakdown
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-800 text-slate-300">
                    <span>CGST ({gstRate / 2}%):</span>
                    <span className="font-mono font-bold text-white">₹{gstResult.cgst.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800 text-slate-300">
                    <span>SGST ({gstRate / 2}%):</span>
                    <span className="font-mono font-bold text-white">₹{gstResult.sgst.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between py-1 text-emerald-400 font-bold">
                    <span>Total GST ({gstRate}%):</span>
                    <span className="font-mono">₹{gstResult.taxAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 flex justify-between items-center mt-3">
                    <span className="text-xs font-bold text-emerald-300 uppercase">Gross Payable:</span>
                    <span className="font-mono text-xl font-black text-white">₹{gstResult.netAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              <Link
                href="/tools/gst-calculator"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl text-center flex items-center justify-center gap-1"
              >
                <span>Full GST Calculator Suite</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

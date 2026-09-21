'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Calculator, 
  TrendingUp, 
  Percent, 
  Coins, 
  Building2, 
  Home, 
  Briefcase, 
  Calendar, 
  PieChart, 
  DollarSign, 
  Wallet, 
  PiggyBank, 
  ArrowRight, 
  PhoneCall, 
  CheckCircle2, 
  Search, 
  Info,
  ChevronRight,
  RotateCcw,
  Sliders,
  ShieldCheck,
  Award
} from 'lucide-react';
import Link from 'next/link';

// -------------------------------------------------------------
// CALCULATOR DEFINITIONS LIST (Matches User's Reference)
// -------------------------------------------------------------
export interface CalcDef {
  id: string;
  name: string;
  category: 'tax_salary' | 'investments' | 'banking' | 'loans_math';
  icon: any;
  shortDesc: string;
  badge?: string;
}

export const ALL_CALCULATORS: CalcDef[] = [
  { id: 'capital-gains', name: 'Capital Gains Calculator', category: 'tax_salary', icon: TrendingUp, shortDesc: 'Shares & Equity MFs LTCG @ 12.5% & STCG @ 20% with Budget 2024 grandfathering', badge: 'Budget 2024' },
  { id: 'interest', name: 'Interest Calculator', category: 'banking', icon: Percent, shortDesc: 'Simple interest computation on loans, deposits & promissory notes' },
  { id: 'income-tax', name: 'Income Tax Calculator', category: 'tax_salary', icon: Calculator, shortDesc: 'Union Budget FY 24-25 & 25-26 Old vs New Regime comparison with 87A rebate', badge: 'Union Budget' },
  { id: 'gratuity', name: 'Gratuity Calculator', category: 'tax_salary', icon: Award, shortDesc: '15/26 formula calculation under Payment of Gratuity Act 1972' },
  { id: 'sip', name: 'SIP Calculator', category: 'investments', icon: TrendingUp, shortDesc: 'Systematic Investment Plan future wealth & compounded gains projection', badge: 'Most Popular' },
  { id: 'pf', name: 'PF Calculator', category: 'banking', icon: PiggyBank, shortDesc: 'EPFO 8.25% retirement corpus with employee & employer 12% contributions' },
  { id: 'hra', name: 'HRA Calculator', category: 'tax_salary', icon: Home, shortDesc: 'Section 10(13A) metro & non-metro house rent tax exemption calculator' },
  { id: 'salary', name: 'Salary Calculator', category: 'tax_salary', icon: Briefcase, shortDesc: 'Annual CTC to monthly in-hand take-home salary after PF, PT & TDS' },
  { id: 'ppf', name: 'PPF Calculator', category: 'investments', icon: ShieldCheck, shortDesc: 'Public Provident Fund 7.1% tax-free 15-year maturity & compounding' },
  { id: 'rd', name: 'RD Calculator', category: 'banking', icon: Calendar, shortDesc: 'Recurring Deposit quarterly compounding maturity calculator' },
  { id: 'swp', name: 'SWP Calculator', category: 'investments', icon: Wallet, shortDesc: 'Systematic Withdrawal Plan monthly cash flows & residual corpus' },
  { id: 'compound-interest', name: 'Compound Interest Calculator', category: 'banking', icon: Coins, shortDesc: 'Compounding growth across monthly, quarterly, semi-annual & annual periods' },
  { id: 'mutual-fund', name: 'Mutual Fund Calculator', category: 'investments', icon: PieChart, shortDesc: 'CAGR annualized return simulation for SIP and lumpsum equity portfolios' },
  { id: 'roi', name: 'ROI Calculator', category: 'investments', icon: TrendingUp, shortDesc: 'Return on Investment percentage, net profit & annualized gains' },
  { id: 'nps', name: 'NPS Calculator', category: 'investments', icon: Building2, shortDesc: 'National Pension System 60% tax-free lumpsum + 40% monthly pension annuity' },
  { id: 'discount', name: 'Discount Calculator', category: 'loans_math', icon: Percent, shortDesc: 'Sale price, percentage discount savings & post-tax payable bill calculator' },
  { id: 'fd', name: 'FD Calculator', category: 'banking', icon: DollarSign, shortDesc: 'Fixed Deposit maturity return & interest payout across bank slabs' },
  { id: 'lumpsum', name: 'Lumpsum Calculator', category: 'investments', icon: Coins, shortDesc: 'One-time mutual fund investment compounding over long horizons' },
  { id: 'down-payment', name: 'Down Payment Calculator', category: 'loans_math', icon: Home, shortDesc: 'Home & auto purchase down payment, loan principal & monthly EMI' },
  { id: 'retirement', name: 'Retirement Planning Calculator', category: 'investments', icon: Calendar, shortDesc: 'Inflation-adjusted expenses and target corpus needed for financial independence' }
];

export const CATEGORIES = [
  { id: 'all', name: 'All Calculators (20)' },
  { id: 'tax_salary', name: 'Tax & Salary (5)' },
  { id: 'investments', name: 'Investments & Wealth (8)' },
  { id: 'banking', name: 'Banking & Deposits (5)' },
  { id: 'loans_math', name: 'Loans & Math (2)' }
];

// Helper for Indian Currency
const formatINR = (val: number): string => {
  if (isNaN(val)) return '₹0';
  return '₹' + Math.round(val).toLocaleString('en-IN');
};

export default function CalculatorsHub() {
  const [activeCalcId, setActiveCalcId] = useState<string>('sip');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Handle URL hash navigation on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '');
      if (hash && ALL_CALCULATORS.some(c => c.id === hash)) {
        setActiveCalcId(hash);
      }
    }
  }, []);

  const selectCalculator = (id: string) => {
    setActiveCalcId(id);
    if (typeof window !== 'undefined') {
      window.location.hash = id;
    }
  };

  // Filtered calculators list
  const filteredCalculators = useMemo(() => {
    return ALL_CALCULATORS.filter(calc => {
      const matchesCategory = selectedCategory === 'all' || calc.category === selectedCategory;
      const matchesSearch = 
        calc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        calc.shortDesc.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const activeCalc = useMemo(() => {
    return ALL_CALCULATORS.find(c => c.id === activeCalcId) || ALL_CALCULATORS[0];
  }, [activeCalcId]);

  return (
    <div className="w-full space-y-8">
      {/* Category Pills & Instant Search */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 text-xs font-bold scrollbar-none">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-2 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#0B2545] text-white shadow-xs font-black'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search 19 calculators..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white font-medium transition-colors"
          />
        </div>
      </div>

      {/* Main Dual Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT SIDEBAR: Popular Calculators Menu (Matches Reference) */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Calculator className="w-4 h-4 text-emerald-600" />
                <span>Popular Calculators</span>
              </h2>
              <p className="text-[11px] text-slate-500 mt-0.5">Click any calculator to compute instantly</p>
            </div>
            <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
              100% Free
            </span>
          </div>

          <div className="space-y-1 max-h-[640px] overflow-y-auto pr-1">
            {filteredCalculators.map((calc) => {
              const Icon = calc.icon;
              const isActive = calc.id === activeCalcId;
              return (
                <button
                  key={calc.id}
                  onClick={() => selectCalculator(calc.id)}
                  className={`w-full text-left p-3 rounded-2xl transition-all flex items-center justify-between gap-3 cursor-pointer group ${
                    isActive 
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md font-bold' 
                      : 'hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-transparent hover:border-slate-200/80'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600 group-hover:bg-emerald-50 group-hover:text-emerald-700'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold truncate">{calc.name}</div>
                      <div className={`text-[10px] truncate ${isActive ? 'text-emerald-100' : 'text-slate-400'}`}>
                        {calc.shortDesc}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${isActive ? 'text-white translate-x-0.5' : 'text-slate-400 group-hover:text-slate-600'}`} />
                </button>
              );
            })}

            {filteredCalculators.length === 0 && (
              <div className="p-8 text-center text-xs text-slate-400">
                No calculators match &quot;{searchQuery}&quot;. Try a different term.
              </div>
            )}
          </div>
        </div>

        {/* RIGHT AREA: Active Interactive Calculator Workstation */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          {/* Workstation Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold mb-1 border border-emerald-200">
                <activeCalc.icon className="w-3.5 h-3.5" />
                <span>Financial &amp; Tax Workstation</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {activeCalc.name}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {activeCalc.shortDesc}
              </p>
            </div>

            <a
              href={`https://wa.me/917275922162?text=Hello%20Tracconsultant,%20I%20used%20the%20${encodeURIComponent(activeCalc.name)}%20and%20need%20expert%20CA%20advice.`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shrink-0 shadow-xs transition-colors cursor-pointer"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Ask a CA on WhatsApp</span>
            </a>
          </div>

          {/* ACTIVE CALCULATOR BODY */}
          <div className="pt-2">
            {activeCalcId === 'capital-gains' && <CapitalGainsCalculatorView />}
            {activeCalcId === 'interest' && <InterestCalculatorView />}
            {activeCalcId === 'income-tax' && <IncomeTaxCalculatorView />}
            {activeCalcId === 'gratuity' && <GratuityCalculatorView />}
            {activeCalcId === 'sip' && <SipCalculatorView />}
            {activeCalcId === 'pf' && <PfCalculatorView />}
            {activeCalcId === 'hra' && <HraCalculatorView />}
            {activeCalcId === 'salary' && <SalaryCalculatorView />}
            {activeCalcId === 'ppf' && <PpfCalculatorView />}
            {activeCalcId === 'rd' && <RdCalculatorView />}
            {activeCalcId === 'swp' && <SwpCalculatorView />}
            {activeCalcId === 'compound-interest' && <CompoundInterestCalculatorView />}
            {activeCalcId === 'mutual-fund' && <MutualFundCalculatorView />}
            {activeCalcId === 'roi' && <RoiCalculatorView />}
            {activeCalcId === 'nps' && <NpsCalculatorView />}
            {activeCalcId === 'discount' && <DiscountCalculatorView />}
            {activeCalcId === 'fd' && <FdCalculatorView />}
            {activeCalcId === 'lumpsum' && <LumpsumCalculatorView />}
            {activeCalcId === 'down-payment' && <DownPaymentCalculatorView />}
            {activeCalcId === 'retirement' && <RetirementCalculatorView />}
          </div>
        </div>

      </div>
    </div>
  );
}

// ============================================================================
// 1. INTEREST CALCULATOR (Simple Interest)
// ============================================================================
function InterestCalculatorView() {
  const [principal, setPrincipal] = useState<number>(100000);
  const [rate, setRate] = useState<number>(8.5);
  const [tenure, setTenure] = useState<number>(3);

  const interest = (principal * rate * tenure) / 100;
  const totalAmount = principal + interest;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-5">
          <InputSlider
            label="Principal Loan / Investment Amount"
            value={principal}
            min={5000}
            max={5000000}
            step={5000}
            unit="₹"
            onChange={setPrincipal}
          />
          <InputSlider
            label="Annual Rate of Interest"
            value={rate}
            min={1}
            max={30}
            step={0.25}
            unit="%"
            onChange={setRate}
          />
          <InputSlider
            label="Time Period (Years)"
            value={tenure}
            min={1}
            max={30}
            step={1}
            unit="Yr"
            onChange={setTenure}
          />
        </div>

        <ResultBox
          title="Simple Interest Breakdown"
          primaryLabel="Total Payable Amount"
          primaryValue={formatINR(totalAmount)}
          items={[
            { label: 'Principal Amount', value: formatINR(principal) },
            { label: 'Total Simple Interest', value: formatINR(interest), highlight: true },
            { label: 'Interest Ratio', value: `${((interest / totalAmount) * 100).toFixed(1)}%` }
          ]}
          proportionInvested={principal}
          proportionReturn={interest}
          labelInvested="Principal"
          labelReturn="Interest"
          caNote="Formula: SI = (P × R × T) / 100. Ideal for short-term unsecured advances, family loans, and simple deposit contracts."
        />
      </div>
    </div>
  );
}

// ============================================================================
// 2. INCOME TAX CALCULATOR (Old vs New Regime Union Budget)
// ============================================================================
function IncomeTaxCalculatorView() {
  const [grossIncome, setGrossIncome] = useState<number>(950000);
  const [isSalaried, setIsSalaried] = useState<boolean>(true);
  const [sec80C, setSec80C] = useState<number>(150000);
  const [sec80D, setSec80D] = useState<number>(25000);
  const [homeLoanInterest, setHomeLoanInterest] = useState<number>(0);

  // New Regime Calculation (Union Budget: ₹75,000 std deduction + 87A rebate up to ₹7,00,000)
  const newStdDed = isSalaried ? 75000 : 0;
  const newTaxableIncome = Math.max(0, grossIncome - newStdDed);
  let newTax = 0;
  if (newTaxableIncome > 700000) {
    if (newTaxableIncome > 300000) newTax += Math.min(newTaxableIncome - 300000, 400000) * 0.05;
    if (newTaxableIncome > 700000) newTax += Math.min(newTaxableIncome - 700000, 300000) * 0.10;
    if (newTaxableIncome > 1000000) newTax += Math.min(newTaxableIncome - 1000000, 200000) * 0.15;
    if (newTaxableIncome > 1200000) newTax += Math.min(newTaxableIncome - 1200000, 300000) * 0.20;
    if (newTaxableIncome > 1500000) newTax += (newTaxableIncome - 1500000) * 0.30;
  }
  const newTotalTax = Math.round(newTax * 1.04);

  // Old Regime Calculation
  const oldStdDed = isSalaried ? 50000 : 0;
  const capped80C = Math.min(sec80C, 150000);
  const capped80D = Math.min(sec80D, 100000);
  const cappedHomeLoan = Math.min(homeLoanInterest, 200000);
  const totalDeductions = oldStdDed + capped80C + capped80D + cappedHomeLoan;
  const oldTaxableIncome = Math.max(0, grossIncome - totalDeductions);
  let oldTax = 0;
  if (oldTaxableIncome > 500000) {
    if (oldTaxableIncome > 250000) oldTax += Math.min(oldTaxableIncome - 250000, 250000) * 0.05;
    if (oldTaxableIncome > 500000) oldTax += Math.min(oldTaxableIncome - 500000, 500000) * 0.20;
    if (oldTaxableIncome > 1000000) oldTax += (oldTaxableIncome - 1000000) * 0.30;
  }
  const oldTotalTax = Math.round(oldTax * 1.04);

  const savings = Math.abs(oldTotalTax - newTotalTax);
  const betterRegime = newTotalTax <= oldTotalTax ? 'New Tax Regime' : 'Old Tax Regime';

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-5">
          <InputSlider
            label="Gross Annual Income (Salary / Business)"
            value={grossIncome}
            min={300000}
            max={5000000}
            step={25000}
            unit="₹"
            onChange={setGrossIncome}
          />
          <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-2xl">
            <span className="text-xs font-bold text-slate-700">Salaried Employee</span>
            <button
              onClick={() => setIsSalaried(!isSalaried)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                isSalaried ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
              }`}
            >
              {isSalaried ? 'Yes (₹75k Deduction)' : 'No'}
            </button>
          </div>
          <InputSlider
            label="Section 80C Deductions (PPF, ELSS, EPF)"
            value={sec80C}
            min={0}
            max={150000}
            step={5000}
            unit="₹"
            onChange={setSec80C}
          />
          <InputSlider
            label="Section 80D Health Insurance"
            value={sec80D}
            min={0}
            max={100000}
            step={5000}
            unit="₹"
            onChange={setSec80D}
          />
          <InputSlider
            label="Home Loan Interest (Sec 24b)"
            value={homeLoanInterest}
            min={0}
            max={200000}
            step={10000}
            unit="₹"
            onChange={setHomeLoanInterest}
          />
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-xs flex items-center justify-between">
            <div className="font-bold">Recommendation: <span className="underline">{betterRegime}</span></div>
            <div className="text-[11px] font-black bg-emerald-600 text-white px-2 py-0.5 rounded-lg">
              Saves {formatINR(savings)}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className={`p-4 rounded-2xl border ${betterRegime === 'New Tax Regime' ? 'bg-emerald-600 text-white border-emerald-700 shadow-md' : 'bg-slate-50 text-slate-800 border-slate-200'}`}>
              <div className="text-[11px] uppercase font-bold opacity-80">New Regime Tax</div>
              <div className="text-2xl font-black mt-1">{formatINR(newTotalTax)}</div>
              <div className="text-[10px] opacity-75 mt-1">Taxable: {formatINR(newTaxableIncome)}</div>
            </div>

            <div className={`p-4 rounded-2xl border ${betterRegime === 'Old Tax Regime' ? 'bg-emerald-600 text-white border-emerald-700 shadow-md' : 'bg-slate-50 text-slate-800 border-slate-200'}`}>
              <div className="text-[11px] uppercase font-bold opacity-80">Old Regime Tax</div>
              <div className="text-2xl font-black mt-1">{formatINR(oldTotalTax)}</div>
              <div className="text-[10px] opacity-75 mt-1">Deductions: {formatINR(totalDeductions)}</div>
            </div>
          </div>

          <ResultBox
            title="Union Budget Regime Summary"
            primaryLabel="Net Recommended Tax Liability"
            primaryValue={formatINR(Math.min(newTotalTax, oldTotalTax))}
            items={[
              { label: 'Gross Annual Income', value: formatINR(grossIncome) },
              { label: 'New Regime Tax', value: formatINR(newTotalTax) },
              { label: 'Old Regime Tax', value: formatINR(oldTotalTax) },
              { label: 'Net Tax Difference', value: formatINR(savings), highlight: true }
            ]}
            caNote="Under the latest Union Budget, the New Regime provides an increased ₹75,000 standard deduction and 100% tax rebate under Section 87A up to ₹7,00,000 taxable income."
          />
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 3. GRATUITY CALCULATOR
// ============================================================================
function GratuityCalculatorView() {
  const [basicSalary, setBasicSalary] = useState<number>(45000);
  const [tenureYears, setTenureYears] = useState<number>(7);

  // Gratuity formula: (15 * Last Drawn Monthly Basic+DA * Tenure) / 26
  const rawGratuity = (15 * basicSalary * tenureYears) / 26;
  const exemptLimit = 2000000;
  const gratuityPayable = Math.round(rawGratuity);
  const exemptPortion = Math.min(gratuityPayable, exemptLimit);
  const taxablePortion = Math.max(0, gratuityPayable - exemptLimit);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-5">
          <InputSlider
            label="Last Drawn Monthly Salary (Basic + DA)"
            value={basicSalary}
            min={10000}
            max={500000}
            step={5000}
            unit="₹"
            onChange={setBasicSalary}
          />
          <InputSlider
            label="Completed Years of Service"
            value={tenureYears}
            min={5}
            max={40}
            step={1}
            unit="Yrs"
            onChange={setTenureYears}
          />
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl text-[11px] text-blue-900">
            ℹ️ Under the <em>Payment of Gratuity Act, 1972</em>, employee must have completed a minimum of 5 continuous years of service in the organization.
          </div>
        </div>

        <ResultBox
          title="Gratuity Calculation Result"
          primaryLabel="Total Gratuity Payable"
          primaryValue={formatINR(gratuityPayable)}
          items={[
            { label: 'Monthly Basic + DA', value: formatINR(basicSalary) },
            { label: 'Service Tenure', value: `${tenureYears} Years` },
            { label: 'Tax-Free Exempt Amount', value: formatINR(exemptPortion), highlight: true },
            { label: 'Taxable Gratuity Portion', value: formatINR(taxablePortion) }
          ]}
          caNote="Statutory Formula: (15 × Last Basic × Tenure) / 26 days. Maximum tax-free exemption allowed under Section 10(10) of the Income Tax Act is ₹20 Lakhs."
        />
      </div>
    </div>
  );
}

// ============================================================================
// 4. SIP CALCULATOR
// ============================================================================
function SipCalculatorView() {
  const [monthlyInvest, setMonthlyInvest] = useState<number>(5000);
  const [expectedReturn, setExpectedReturn] = useState<number>(12);
  const [years, setYears] = useState<number>(10);

  const months = years * 12;
  const i = expectedReturn / 12 / 100;
  const maturityValue = monthlyInvest * (((Math.pow(1 + i, months) - 1) / i)) * (1 + i);
  const totalInvested = monthlyInvest * months;
  const wealthGained = maturityValue - totalInvested;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-5">
          <InputSlider
            label="Monthly SIP Investment"
            value={monthlyInvest}
            min={500}
            max={100000}
            step={500}
            unit="₹"
            onChange={setMonthlyInvest}
          />
          <InputSlider
            label="Expected Annual Return Rate"
            value={expectedReturn}
            min={1}
            max={30}
            step={0.5}
            unit="%"
            onChange={setExpectedReturn}
          />
          <InputSlider
            label="Investment Time Horizon"
            value={years}
            min={1}
            max={35}
            step={1}
            unit="Yrs"
            onChange={setYears}
          />
        </div>

        <ResultBox
          title="SIP Compounding Projection"
          primaryLabel="Expected Future Corpus"
          primaryValue={formatINR(maturityValue)}
          items={[
            { label: 'Total Invested Amount', value: formatINR(totalInvested) },
            { label: 'Estimated Wealth Gained', value: formatINR(wealthGained), highlight: true },
            { label: 'Total Future Value', value: formatINR(maturityValue) }
          ]}
          proportionInvested={totalInvested}
          proportionReturn={wealthGained}
          labelInvested="Invested"
          labelReturn="Wealth Gained"
          caNote="Compounded monthly with rupee cost averaging. Over long horizons (>7 years), equity SIP historically generates 12-15% CAGR beating inflation."
        />
      </div>
    </div>
  );
}

// ============================================================================
// 5. PF / EPF CALCULATOR
// ============================================================================
function PfCalculatorView() {
  const [basicSalary, setBasicSalary] = useState<number>(35000);
  const [currentAge, setCurrentAge] = useState<number>(28);
  const [existingPf, setExistingPf] = useState<number>(120000);
  const [annualIncrement, setAnnualIncrement] = useState<number>(7);

  const retirementAge = 58;
  const totalYears = Math.max(1, retirementAge - currentAge);
  const interestRate = 8.25; // EPFO notified rate

  // Year-by-year calculation
  let balance = existingPf;
  let totalEmployeeContrib = 0;
  let totalEmployerContrib = 0;
  let currentMonthlySalary = basicSalary;

  for (let yr = 0; yr < totalYears; yr++) {
    const employeeMonthly = currentMonthlySalary * 0.12;
    const employerMonthly = currentMonthlySalary * 0.0367; // 3.67% to EPF, 8.33% to EPS
    const yearlyEmployee = employeeMonthly * 12;
    const yearlyEmployer = employerMonthly * 12;

    totalEmployeeContrib += yearlyEmployee;
    totalEmployerContrib += yearlyEmployer;

    balance += (yearlyEmployee + yearlyEmployer);
    balance += balance * (interestRate / 100);

    currentMonthlySalary += currentMonthlySalary * (annualIncrement / 100);
  }

  const totalInterestEarned = balance - (existingPf + totalEmployeeContrib + totalEmployerContrib);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-5">
          <InputSlider
            label="Monthly Basic Salary + DA"
            value={basicSalary}
            min={15000}
            max={300000}
            step={2500}
            unit="₹"
            onChange={setBasicSalary}
          />
          <InputSlider
            label="Your Current Age (Retires at 58)"
            value={currentAge}
            min={20}
            max={55}
            step={1}
            unit="Yrs"
            onChange={setCurrentAge}
          />
          <InputSlider
            label="Current EPF Balance"
            value={existingPf}
            min={0}
            max={2000000}
            step={25000}
            unit="₹"
            onChange={setExistingPf}
          />
          <InputSlider
            label="Expected Annual Salary Hike"
            value={annualIncrement}
            min={0}
            max={15}
            step={1}
            unit="%"
            onChange={setAnnualIncrement}
          />
        </div>

        <ResultBox
          title="EPF Corpus at Age 58"
          primaryLabel="Total Retirement Corpus"
          primaryValue={formatINR(balance)}
          items={[
            { label: 'Your EPF Contribution (12%)', value: formatINR(totalEmployeeContrib) },
            { label: 'Employer EPF Share (3.67%)', value: formatINR(totalEmployerContrib) },
            { label: 'Total Interest Earned (@8.25%)', value: formatINR(totalInterestEarned), highlight: true },
            { label: 'Tenure Remaining', value: `${totalYears} Years` }
          ]}
          proportionInvested={totalEmployeeContrib + totalEmployerContrib + existingPf}
          proportionReturn={totalInterestEarned}
          labelInvested="Total Contributions"
          labelReturn="Interest Earned"
          caNote="EPFO interest is currently 8.25% p.a., completely tax-free upon maturity if continuous service exceeds 5 years."
        />
      </div>
    </div>
  );
}

// ============================================================================
// 6. HRA CALCULATOR
// ============================================================================
function HraCalculatorView() {
  const [basicSalary, setBasicSalary] = useState<number>(600000);
  const [hraReceived, setHraReceived] = useState<number>(240000);
  const [rentPaid, setRentPaid] = useState<number>(240000);
  const [isMetro, setIsMetro] = useState<boolean>(true);

  // Section 10(13A) rules:
  // 1. Actual HRA received
  // 2. 50% basic (metro) or 40% (non-metro)
  // 3. Rent paid - 10% basic
  const c1 = hraReceived;
  const c2 = isMetro ? basicSalary * 0.50 : basicSalary * 0.40;
  const c3 = Math.max(0, rentPaid - (basicSalary * 0.10));

  const exemptHra = Math.min(c1, c2, c3);
  const taxableHra = Math.max(0, hraReceived - exemptHra);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-5">
          <InputSlider
            label="Annual Basic Salary + DA"
            value={basicSalary}
            min={100000}
            max={3000000}
            step={25000}
            unit="₹"
            onChange={setBasicSalary}
          />
          <InputSlider
            label="Annual HRA Received from Employer"
            value={hraReceived}
            min={0}
            max={1500000}
            step={10000}
            unit="₹"
            onChange={setHraReceived}
          />
          <InputSlider
            label="Actual Total Rent Paid per Year"
            value={rentPaid}
            min={0}
            max={1500000}
            step={10000}
            unit="₹"
            onChange={setRentPaid}
          />
          <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-2xl">
            <div>
              <span className="text-xs font-bold text-slate-800 block">City Classification</span>
              <span className="text-[10px] text-slate-500">Delhi, Mumbai, Kolkata, Chennai are Metro (50%)</span>
            </div>
            <button
              onClick={() => setIsMetro(!isMetro)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                isMetro ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {isMetro ? 'Metro (50%)' : 'Non-Metro (40%)'}
            </button>
          </div>
        </div>

        <ResultBox
          title="HRA Exemption Result"
          primaryLabel="Tax-Free Exempt HRA"
          primaryValue={formatINR(exemptHra)}
          items={[
            { label: 'Total HRA Received', value: formatINR(hraReceived) },
            { label: 'Tax-Exempt HRA Amount', value: formatINR(exemptHra), highlight: true },
            { label: 'Taxable HRA Added to Income', value: formatINR(taxableHra) }
          ]}
          caNote="Section 10(13A) grants exemption as the lowest of: (1) Actual HRA, (2) 50%/40% of Basic, (3) Rent paid minus 10% of Basic. (Applicable under Old Tax Regime)."
        />
      </div>
    </div>
  );
}

// ============================================================================
// 7. SALARY CALCULATOR (CTC to In-Hand)
// ============================================================================
function SalaryCalculatorView() {
  const [ctc, setCtc] = useState<number>(1200000);
  const [annualBonus, setAnnualBonus] = useState<number>(80000);

  // Typical Indian salary structure breakdown
  const grossSalary = ctc - annualBonus;
  const basic = grossSalary * 0.50; // 50% basic rule
  const employeePf = basic * 0.12;
  const profTax = 2400; // ~₹200/mo

  // Approximate tax under New Tax Regime
  const taxableSalary = Math.max(0, grossSalary - 75000);
  let tax = 0;
  if (taxableSalary > 700000) {
    if (taxableSalary > 300000) tax += Math.min(taxableSalary - 300000, 400000) * 0.05;
    if (taxableSalary > 700000) tax += Math.min(taxableSalary - 700000, 300000) * 0.10;
    if (taxableSalary > 1000000) tax += Math.min(taxableSalary - 1000000, 200000) * 0.15;
    if (taxableSalary > 1200000) tax += Math.min(taxableSalary - 1200000, 300000) * 0.20;
    if (taxableSalary > 1500000) tax += (taxableSalary - 1500000) * 0.30;
  }
  const totalTax = Math.round(tax * 1.04);

  const totalDeductions = employeePf + profTax + totalTax;
  const netAnnualTakeHome = grossSalary - totalDeductions;
  const monthlyInHand = Math.round(netAnnualTakeHome / 12);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-5">
          <InputSlider
            label="Total Annual CTC (Cost to Company)"
            value={ctc}
            min={300000}
            max={5000000}
            step={25000}
            unit="₹"
            onChange={setCtc}
          />
          <InputSlider
            label="Annual Variable Pay / Bonus (Part of CTC)"
            value={annualBonus}
            min={0}
            max={1000000}
            step={10000}
            unit="₹"
            onChange={setAnnualBonus}
          />
        </div>

        <ResultBox
          title="Take-Home Pay Estimate"
          primaryLabel="Monthly In-Hand Salary"
          primaryValue={formatINR(monthlyInHand)}
          items={[
            { label: 'Gross Annual Salary', value: formatINR(grossSalary) },
            { label: 'Employee PF (12% Basic)', value: formatINR(employeePf) },
            { label: 'Estimated Annual Tax (TDS)', value: formatINR(totalTax) },
            { label: 'Annual Net Take-Home', value: formatINR(netAnnualTakeHome), highlight: true }
          ]}
          caNote="Computed using New Tax Regime with standard deduction of ₹75,000 and 12% employee EPF on 50% basic component."
        />
      </div>
    </div>
  );
}

// ============================================================================
// 8. PPF CALCULATOR
// ============================================================================
function PpfCalculatorView() {
  const [yearlyDeposit, setYearlyDeposit] = useState<number>(150000);
  const [tenureYears, setTenureYears] = useState<number>(15);
  const rate = 7.1; // Official govt PPF rate

  let balance = 0;
  let totalInvested = 0;
  for (let i = 0; i < tenureYears; i++) {
    balance += yearlyDeposit;
    totalInvested += yearlyDeposit;
    balance += balance * (rate / 100);
  }
  const totalInterest = balance - totalInvested;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-5">
          <InputSlider
            label="Yearly Investment Amount"
            value={yearlyDeposit}
            min={500}
            max={150000}
            step={500}
            unit="₹"
            onChange={setYearlyDeposit}
          />
          <InputSlider
            label="Time Period (Minimum 15 Years)"
            value={tenureYears}
            min={15}
            max={30}
            step={5}
            unit="Yrs"
            onChange={setTenureYears}
          />
        </div>

        <ResultBox
          title="PPF Maturity Estimation"
          primaryLabel="Maturity Amount (100% Tax-Free)"
          primaryValue={formatINR(balance)}
          items={[
            { label: 'Total Invested Amount', value: formatINR(totalInvested) },
            { label: 'Total Interest Earned (@7.1%)', value: formatINR(totalInterest), highlight: true },
            { label: 'Maturity Corpus', value: formatINR(balance) }
          ]}
          proportionInvested={totalInvested}
          proportionReturn={totalInterest}
          labelInvested="Invested"
          labelReturn="Interest"
          caNote="Public Provident Fund enjoys sovereign backing with EEE tax status (investment, interest, and maturity are all completely exempt under Section 80C & 10(11))."
        />
      </div>
    </div>
  );
}

// ============================================================================
// 9. RD CALCULATOR (Recurring Deposit)
// ============================================================================
function RdCalculatorView() {
  const [monthlyDeposit, setMonthlyDeposit] = useState<number>(5000);
  const [rate, setRate] = useState<number>(7.0);
  const [months, setMonths] = useState<number>(36);

  // Bank RD quarterly compounding
  let maturity = 0;
  for (let i = 1; i <= months; i++) {
    const quartersRemaining = (months - i + 1) / 3;
    maturity += monthlyDeposit * Math.pow(1 + (rate / 400), quartersRemaining);
  }
  const totalInvested = monthlyDeposit * months;
  const interestEarned = maturity - totalInvested;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-5">
          <InputSlider
            label="Monthly Deposit Amount"
            value={monthlyDeposit}
            min={500}
            max={100000}
            step={500}
            unit="₹"
            onChange={setMonthlyDeposit}
          />
          <InputSlider
            label="Annual Interest Rate"
            value={rate}
            min={3}
            max={12}
            step={0.1}
            unit="%"
            onChange={setRate}
          />
          <InputSlider
            label="Tenure (Months)"
            value={months}
            min={6}
            max={120}
            step={6}
            unit="Mo"
            onChange={setMonths}
          />
        </div>

        <ResultBox
          title="RD Maturity Value"
          primaryLabel="Total Maturity Value"
          primaryValue={formatINR(maturity)}
          items={[
            { label: 'Total Amount Deposited', value: formatINR(totalInvested) },
            { label: 'Interest Earned', value: formatINR(interestEarned), highlight: true },
            { label: 'Total Maturity Amount', value: formatINR(maturity) }
          ]}
          proportionInvested={totalInvested}
          proportionReturn={interestEarned}
          labelInvested="Deposits"
          labelReturn="Interest"
          caNote="Calculated using standard Indian banking quarterly compounding guidelines. TDS applies if annual interest exceeds ₹40,000 (₹50,000 for senior citizens)."
        />
      </div>
    </div>
  );
}

// ============================================================================
// 10. SWP CALCULATOR (Systematic Withdrawal Plan)
// ============================================================================
function SwpCalculatorView() {
  const [initialCorpus, setInitialCorpus] = useState<number>(2500000);
  const [monthlyWithdrawal, setMonthlyWithdrawal] = useState<number>(20000);
  const [annualReturn, setAnnualReturn] = useState<number>(9);
  const [years, setYears] = useState<number>(10);

  const months = years * 12;
  const monthlyRate = annualReturn / 12 / 100;
  let balance = initialCorpus;
  let totalWithdrawn = 0;

  for (let m = 0; m < months; m++) {
    if (balance <= 0) {
      balance = 0;
      break;
    }
    balance = balance * (1 + monthlyRate) - monthlyWithdrawal;
    totalWithdrawn += monthlyWithdrawal;
  }
  if (balance < 0) balance = 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-5">
          <InputSlider
            label="Initial Investment Corpus"
            value={initialCorpus}
            min={500000}
            max={10000000}
            step={50000}
            unit="₹"
            onChange={setInitialCorpus}
          />
          <InputSlider
            label="Monthly Withdrawal Required"
            value={monthlyWithdrawal}
            min={2000}
            max={100000}
            step={1000}
            unit="₹"
            onChange={setMonthlyWithdrawal}
          />
          <InputSlider
            label="Expected Annual Return Rate"
            value={annualReturn}
            min={4}
            max={18}
            step={0.5}
            unit="%"
            onChange={setAnnualReturn}
          />
          <InputSlider
            label="Time Horizon (Years)"
            value={years}
            min={1}
            max={30}
            step={1}
            unit="Yrs"
            onChange={setYears}
          />
        </div>

        <ResultBox
          title="SWP Cashflow Projection"
          primaryLabel="Final Remaining Balance"
          primaryValue={formatINR(balance)}
          items={[
            { label: 'Initial Corpus', value: formatINR(initialCorpus) },
            { label: 'Total Amount Withdrawn', value: formatINR(totalWithdrawn), highlight: true },
            { label: 'Remaining Portfolio Value', value: formatINR(balance) },
            { label: 'Total Value Delivered', value: formatINR(totalWithdrawn + balance) }
          ]}
          caNote="Ideal for retirees seeking monthly income. SWP offers higher tax efficiency than dividend options or FD interest since only the capital gain portion is taxed."
        />
      </div>
    </div>
  );
}

// ============================================================================
// 11. COMPOUND INTEREST CALCULATOR
// ============================================================================
function CompoundInterestCalculatorView() {
  const [principal, setPrincipal] = useState<number>(100000);
  const [rate, setRate] = useState<number>(10);
  const [years, setYears] = useState<number>(5);
  const [frequency, setFrequency] = useState<number>(4); // 4 = Quarterly

  const amount = principal * Math.pow(1 + (rate / (frequency * 100)), frequency * years);
  const compoundInterest = amount - principal;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-5">
          <InputSlider
            label="Initial Principal Amount"
            value={principal}
            min={5000}
            max={5000000}
            step={5000}
            unit="₹"
            onChange={setPrincipal}
          />
          <InputSlider
            label="Annual Interest Rate"
            value={rate}
            min={1}
            max={25}
            step={0.25}
            unit="%"
            onChange={setRate}
          />
          <InputSlider
            label="Time Period (Years)"
            value={years}
            min={1}
            max={30}
            step={1}
            unit="Yrs"
            onChange={setYears}
          />
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Compounding Frequency</label>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { label: 'Annually', val: 1 },
                { label: 'Half-Yr', val: 2 },
                { label: 'Quarterly', val: 4 },
                { label: 'Monthly', val: 12 }
              ].map(f => (
                <button
                  key={f.val}
                  onClick={() => setFrequency(f.val)}
                  className={`py-2 text-[11px] font-bold rounded-xl transition-all ${
                    frequency === f.val ? 'bg-[#0B2545] text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <ResultBox
          title="Compounded Wealth Result"
          primaryLabel="Total Maturity Amount"
          primaryValue={formatINR(amount)}
          items={[
            { label: 'Principal Invested', value: formatINR(principal) },
            { label: 'Compound Interest Earned', value: formatINR(compoundInterest), highlight: true },
            { label: 'Growth Multiple', value: `${(amount / principal).toFixed(2)}x` }
          ]}
          proportionInvested={principal}
          proportionReturn={compoundInterest}
          labelInvested="Principal"
          labelReturn="Compound Interest"
          caNote="A = P(1 + r/n)^(nt). Compounding reinvests your earnings so your interest generates its own interest over time."
        />
      </div>
    </div>
  );
}

// ============================================================================
// 12. MUTUAL FUND CALCULATOR
// ============================================================================
function MutualFundCalculatorView() {
  const [isSip, setIsSip] = useState<boolean>(true);
  const [amount, setAmount] = useState<number>(10000);
  const [cagr, setCagr] = useState<number>(14);
  const [years, setYears] = useState<number>(10);

  let totalInvested = 0;
  let maturityValue = 0;

  if (isSip) {
    const months = years * 12;
    const i = cagr / 12 / 100;
    maturityValue = amount * (((Math.pow(1 + i, months) - 1) / i)) * (1 + i);
    totalInvested = amount * months;
  } else {
    maturityValue = amount * Math.pow(1 + (cagr / 100), years);
    totalInvested = amount;
  }
  const wealthGained = maturityValue - totalInvested;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-5">
          <div className="flex p-1 bg-slate-100 rounded-2xl">
            <button
              onClick={() => { setIsSip(true); setAmount(10000); }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                isSip ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              SIP (Monthly)
            </button>
            <button
              onClick={() => { setIsSip(false); setAmount(200000); }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                !isSip ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Lumpsum (One-Time)
            </button>
          </div>

          <InputSlider
            label={isSip ? 'Monthly SIP Amount' : 'One-Time Lumpsum Investment'}
            value={amount}
            min={isSip ? 500 : 10000}
            max={isSip ? 100000 : 2000000}
            step={isSip ? 500 : 10000}
            unit="₹"
            onChange={setAmount}
          />
          <InputSlider
            label="Expected CAGR Return Rate"
            value={cagr}
            min={1}
            max={30}
            step={0.5}
            unit="%"
            onChange={setCagr}
          />
          <InputSlider
            label="Tenure (Years)"
            value={years}
            min={1}
            max={30}
            step={1}
            unit="Yrs"
            onChange={setYears}
          />
        </div>

        <ResultBox
          title="Mutual Fund Projection"
          primaryLabel="Expected Portfolio Value"
          primaryValue={formatINR(maturityValue)}
          items={[
            { label: 'Total Invested Amount', value: formatINR(totalInvested) },
            { label: 'Estimated Capital Gains', value: formatINR(wealthGained), highlight: true },
            { label: 'Total Value', value: formatINR(maturityValue) }
          ]}
          proportionInvested={totalInvested}
          proportionReturn={wealthGained}
          labelInvested="Invested"
          labelReturn="Capital Gains"
          caNote="Long-term capital gains (LTCG) in equity mutual funds are tax-exempt up to ₹1.25 Lakh per financial year, with 12.5% tax applicable on excess gains."
        />
      </div>
    </div>
  );
}

// ============================================================================
// 13. ROI CALCULATOR (Return on Investment)
// ============================================================================
function RoiCalculatorView() {
  const [initialCost, setInitialCost] = useState<number>(100000);
  const [finalValue, setFinalValue] = useState<number>(160000);
  const [years, setYears] = useState<number>(3);

  const netProfit = finalValue - initialCost;
  const roiPercent = initialCost > 0 ? (netProfit / initialCost) * 100 : 0;
  const cagr = (initialCost > 0 && finalValue > 0 && years > 0) 
    ? (Math.pow(finalValue / initialCost, 1 / years) - 1) * 100 
    : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-5">
          <InputSlider
            label="Initial Amount Invested"
            value={initialCost}
            min={1000}
            max={5000000}
            step={5000}
            unit="₹"
            onChange={setInitialCost}
          />
          <InputSlider
            label="Final Value Returned / Realized"
            value={finalValue}
            min={1000}
            max={10000000}
            step={5000}
            unit="₹"
            onChange={setFinalValue}
          />
          <InputSlider
            label="Investment Duration (Years)"
            value={years}
            min={1}
            max={20}
            step={0.5}
            unit="Yrs"
            onChange={setYears}
          />
        </div>

        <ResultBox
          title="ROI Evaluation"
          primaryLabel="Total Return on Investment (ROI)"
          primaryValue={`${roiPercent.toFixed(2)}%`}
          items={[
            { label: 'Initial Investment', value: formatINR(initialCost) },
            { label: 'Net Profit / Gain', value: formatINR(netProfit), highlight: true },
            { label: 'Annualized CAGR Return', value: `${cagr.toFixed(2)}% p.a.` }
          ]}
          caNote="ROI = [(Net Profit) / Initial Cost] × 100. The annualized CAGR normalizes multi-year returns to evaluate asset performance against benchmark indices."
        />
      </div>
    </div>
  );
}

// ============================================================================
// 14. NPS CALCULATOR (National Pension System)
// ============================================================================
function NpsCalculatorView() {
  const [monthlyContribution, setMonthlyContribution] = useState<number>(5000);
  const [currentAge, setCurrentAge] = useState<number>(30);
  const [expectedReturn, setExpectedReturn] = useState<number>(10);
  const [annuityRatio, setAnnuityRatio] = useState<number>(40); // min 40%

  const yearsToRetire = Math.max(1, 60 - currentAge);
  const months = yearsToRetire * 12;
  const i = expectedReturn / 12 / 100;
  const totalCorpus = monthlyContribution * (((Math.pow(1 + i, months) - 1) / i)) * (1 + i);
  const totalInvested = monthlyContribution * months;

  const annuityAmount = totalCorpus * (annuityRatio / 100);
  const lumpsumAmount = totalCorpus - annuityAmount;
  const monthlyPension = (annuityAmount * 0.06) / 12; // assuming 6% annuity rate

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-5">
          <InputSlider
            label="Monthly NPS Contribution"
            value={monthlyContribution}
            min={500}
            max={50000}
            step={500}
            unit="₹"
            onChange={setMonthlyContribution}
          />
          <InputSlider
            label="Current Age (Retires at 60)"
            value={currentAge}
            min={18}
            max={55}
            step={1}
            unit="Yrs"
            onChange={setCurrentAge}
          />
          <InputSlider
            label="Expected Annual Growth Rate"
            value={expectedReturn}
            min={6}
            max={15}
            step={0.5}
            unit="%"
            onChange={setExpectedReturn}
          />
          <InputSlider
            label="Annuity Percentage Reinvested (Min 40%)"
            value={annuityRatio}
            min={40}
            max={100}
            step={5}
            unit="%"
            onChange={setAnnuityRatio}
          />
        </div>

        <ResultBox
          title="NPS Retirement Package"
          primaryLabel="Expected Monthly Pension"
          primaryValue={formatINR(monthlyPension)}
          items={[
            { label: 'Total Accumulated Corpus at 60', value: formatINR(totalCorpus) },
            { label: 'Total Invested Amount', value: formatINR(totalInvested) },
            { label: '60% Tax-Free Lumpsum at 60', value: formatINR(lumpsumAmount), highlight: true },
            { label: 'Monthly Pension for Life', value: formatINR(monthlyPension) }
          ]}
          caNote="NPS qualifies for extra ₹50,000 deduction under Section 80CCD(1B) over and above Section 80C. At age 60, up to 60% can be withdrawn 100% tax-free."
        />
      </div>
    </div>
  );
}

// ============================================================================
// 15. DISCOUNT CALCULATOR
// ============================================================================
function DiscountCalculatorView() {
  const [originalPrice, setOriginalPrice] = useState<number>(2500);
  const [discountPercent, setDiscountPercent] = useState<number>(20);
  const [taxPercent, setTaxPercent] = useState<number>(0);

  const discountAmount = originalPrice * (discountPercent / 100);
  const discountedPrice = originalPrice - discountAmount;
  const taxAmount = discountedPrice * (taxPercent / 100);
  const finalPrice = discountedPrice + taxAmount;
  const netSavings = originalPrice - finalPrice;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-5">
          <InputSlider
            label="Original Retail Price"
            value={originalPrice}
            min={100}
            max={500000}
            step={50}
            unit="₹"
            onChange={setOriginalPrice}
          />
          <InputSlider
            label="Discount Percentage"
            value={discountPercent}
            min={1}
            max={90}
            step={1}
            unit="%"
            onChange={setDiscountPercent}
          />
          <InputSlider
            label="Additional Sales Tax / GST"
            value={taxPercent}
            min={0}
            max={28}
            step={1}
            unit="%"
            onChange={setTaxPercent}
          />
        </div>

        <ResultBox
          title="Discounted Invoice Breakdown"
          primaryLabel="Final Payable Price"
          primaryValue={formatINR(finalPrice)}
          items={[
            { label: 'Original Price', value: formatINR(originalPrice) },
            { label: 'Discount Amount Saved', value: formatINR(discountAmount), highlight: true },
            { label: 'GST / Tax Added', value: formatINR(taxAmount) },
            { label: 'Net In-Pocket Savings', value: formatINR(Math.max(0, netSavings)) }
          ]}
          caNote="Instant point-of-sale pricing calculator. Shows both before-tax promotional discount and final GST-inclusive payable amount."
        />
      </div>
    </div>
  );
}

// ============================================================================
// 16. FD CALCULATOR (Fixed Deposit)
// ============================================================================
function FdCalculatorView() {
  const [principal, setPrincipal] = useState<number>(200000);
  const [rate, setRate] = useState<number>(7.25);
  const [years, setYears] = useState<number>(3);

  // Standard Indian Bank quarterly compounding
  const frequency = 4;
  const maturityValue = principal * Math.pow(1 + (rate / (frequency * 100)), frequency * years);
  const interestEarned = maturityValue - principal;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-5">
          <InputSlider
            label="Fixed Deposit Investment Amount"
            value={principal}
            min={10000}
            max={5000000}
            step={10000}
            unit="₹"
            onChange={setPrincipal}
          />
          <InputSlider
            label="Annual Bank Interest Rate"
            value={rate}
            min={3}
            max={12}
            step={0.1}
            unit="%"
            onChange={setRate}
          />
          <InputSlider
            label="Tenure (Years)"
            value={years}
            min={1}
            max={10}
            step={1}
            unit="Yrs"
            onChange={setYears}
          />
        </div>

        <ResultBox
          title="Bank FD Maturity Calculation"
          primaryLabel="Total Maturity Amount"
          primaryValue={formatINR(maturityValue)}
          items={[
            { label: 'Principal Deposit', value: formatINR(principal) },
            { label: 'Total Interest Earned', value: formatINR(interestEarned), highlight: true },
            { label: 'Maturity Amount', value: formatINR(maturityValue) }
          ]}
          proportionInvested={principal}
          proportionReturn={interestEarned}
          labelInvested="Principal"
          labelReturn="Interest"
          caNote="Calculated using RBI standard quarterly compounding. Bank FD interest is taxable as per your income tax slab under 'Income from Other Sources'."
        />
      </div>
    </div>
  );
}

// ============================================================================
// 17. LUMPSUM CALCULATOR
// ============================================================================
function LumpsumCalculatorView() {
  const [investment, setInvestment] = useState<number>(100000);
  const [expectedReturn, setExpectedReturn] = useState<number>(12);
  const [years, setYears] = useState<number>(10);

  const maturityValue = investment * Math.pow(1 + (expectedReturn / 100), years);
  const wealthGained = maturityValue - investment;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-5">
          <InputSlider
            label="Total One-Time Investment"
            value={investment}
            min={5000}
            max={5000000}
            step={5000}
            unit="₹"
            onChange={setInvestment}
          />
          <InputSlider
            label="Expected Annual Return Rate"
            value={expectedReturn}
            min={1}
            max={30}
            step={0.5}
            unit="%"
            onChange={setExpectedReturn}
          />
          <InputSlider
            label="Time Horizon (Years)"
            value={years}
            min={1}
            max={35}
            step={1}
            unit="Yrs"
            onChange={setYears}
          />
        </div>

        <ResultBox
          title="Lumpsum Compounding Growth"
          primaryLabel="Expected Future Corpus"
          primaryValue={formatINR(maturityValue)}
          items={[
            { label: 'Total Invested Amount', value: formatINR(investment) },
            { label: 'Estimated Wealth Gained', value: formatINR(wealthGained), highlight: true },
            { label: 'Future Value', value: formatINR(maturityValue) }
          ]}
          proportionInvested={investment}
          proportionReturn={wealthGained}
          labelInvested="Principal"
          labelReturn="Wealth Gained"
          caNote="A = P × (1 + r)^t. A one-time lumpsum harnesses compounding over long durations without requiring periodic deposits."
        />
      </div>
    </div>
  );
}

// ============================================================================
// 18. DOWN PAYMENT & EMI CALCULATOR
// ============================================================================
function DownPaymentCalculatorView() {
  const [propertyPrice, setPropertyPrice] = useState<number>(5000000);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(20);
  const [interestRate, setInterestRate] = useState<number>(8.75);
  const [tenureYears, setTenureYears] = useState<number>(20);

  const downPaymentAmount = propertyPrice * (downPaymentPercent / 100);
  const loanPrincipal = propertyPrice - downPaymentAmount;

  // Monthly EMI
  const monthlyRate = interestRate / 12 / 100;
  const months = tenureYears * 12;
  const emi = (loanPrincipal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
  const totalPayment = emi * months;
  const totalInterest = totalPayment - loanPrincipal;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-5">
          <InputSlider
            label="Total Property / Asset Purchase Price"
            value={propertyPrice}
            min={500000}
            max={30000000}
            step={100000}
            unit="₹"
            onChange={setPropertyPrice}
          />
          <InputSlider
            label="Down Payment Contribution"
            value={downPaymentPercent}
            min={10}
            max={50}
            step={5}
            unit="%"
            onChange={setDownPaymentPercent}
          />
          <InputSlider
            label="Loan Annual Interest Rate"
            value={interestRate}
            min={5}
            max={16}
            step={0.1}
            unit="%"
            onChange={setInterestRate}
          />
          <InputSlider
            label="Loan Repayment Tenure"
            value={tenureYears}
            min={1}
            max={30}
            step={1}
            unit="Yrs"
            onChange={setTenureYears}
          />
        </div>

        <ResultBox
          title="Loan Financing Breakdown"
          primaryLabel="Monthly Loan EMI"
          primaryValue={formatINR(emi)}
          items={[
            { label: 'Down Payment Required (Cash)', value: formatINR(downPaymentAmount), highlight: true },
            { label: 'Loan Principal Borrowed', value: formatINR(loanPrincipal) },
            { label: 'Total Interest Payable over Tenure', value: formatINR(totalInterest) },
            { label: 'Total Cash Outflow (Principal + Interest)', value: formatINR(totalPayment) }
          ]}
          caNote="RBI mandates a minimum 10-20% borrower contribution for home loans. Principal repayment qualifies for Section 80C and interest qualifies for up to ₹2 Lakh under Section 24b."
        />
      </div>
    </div>
  );
}

// ============================================================================
// 19. RETIREMENT PLANNING CALCULATOR
// ============================================================================
function RetirementCalculatorView() {
  const [currentAge, setCurrentAge] = useState<number>(30);
  const [retireAge, setRetireAge] = useState<number>(60);
  const [monthlyExpense, setMonthlyExpense] = useState<number>(50000);
  const [inflation, setInflation] = useState<number>(6);
  const [postRetireReturn, setPostRetireReturn] = useState<number>(8);

  const yearsToRetire = Math.max(1, retireAge - currentAge);
  const yearsInRetirement = 25; // 60 to 85

  // Future expense at retirement
  const futureMonthlyExpense = monthlyExpense * Math.pow(1 + (inflation / 100), yearsToRetire);
  const futureAnnualExpense = futureMonthlyExpense * 12;

  // Real rate of return post retirement
  const realRate = ((1 + postRetireReturn / 100) / (1 + inflation / 100)) - 1;
  const corpusNeeded = realRate > 0 
    ? (futureAnnualExpense * (1 - Math.pow(1 + realRate, -yearsInRetirement))) / realRate
    : futureAnnualExpense * yearsInRetirement;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-5">
          <InputSlider
            label="Your Current Age"
            value={currentAge}
            min={20}
            max={55}
            step={1}
            unit="Yrs"
            onChange={setCurrentAge}
          />
          <InputSlider
            label="Desired Retirement Age"
            value={retireAge}
            min={45}
            max={70}
            step={1}
            unit="Yrs"
            onChange={setRetireAge}
          />
          <InputSlider
            label="Current Monthly Living Expenses"
            value={monthlyExpense}
            min={15000}
            max={300000}
            step={2500}
            unit="₹"
            onChange={setMonthlyExpense}
          />
          <InputSlider
            label="Expected Annual Inflation Rate"
            value={inflation}
            min={3}
            max={10}
            step={0.5}
            unit="%"
            onChange={setInflation}
          />
          <InputSlider
            label="Post-Retirement Investment Return"
            value={postRetireReturn}
            min={4}
            max={12}
            step={0.5}
            unit="%"
            onChange={setPostRetireReturn}
          />
        </div>

        <ResultBox
          title="Retirement Target Analysis"
          primaryLabel="Target Retirement Corpus Needed"
          primaryValue={formatINR(corpusNeeded)}
          items={[
            { label: 'Current Monthly Expenses', value: formatINR(monthlyExpense) },
            { label: 'Future Monthly Expense at 60 (with 6% inflation)', value: formatINR(futureMonthlyExpense), highlight: true },
            { label: 'Years to Save & Accumulate', value: `${yearsToRetire} Years` },
            { label: 'Estimated Corpus Lifetime', value: `25 Years (Up to Age 85)` }
          ]}
          caNote="Accounts for compound inflation eroding purchasing power. An expense of ₹50,000 today grows to ~₹2.8 Lakh/month in 30 years at 6% inflation."
        />
      </div>
    </div>
  );
}

// ============================================================================
// SHARED REUSABLE INPUT SLIDER COMPONENT
// ============================================================================
interface InputSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  onChange: (val: number) => void;
}

function InputSlider({ label, value, min, max, step, unit = '₹', onChange }: InputSliderProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <label className="font-bold text-slate-700">{label}</label>
        <div className="relative">
          <input
            type="number"
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={(e) => onChange(Number(e.target.value) || min)}
            className="w-28 text-right font-mono font-bold text-xs px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-emerald-600 focus:bg-white"
          />
          {unit && unit !== '₹' && (
            <span className="absolute right-7 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-bold pointer-events-none">
              {unit}
            </span>
          )}
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
      />
      <div className="flex justify-between text-[10px] text-slate-400 font-medium">
        <span>{unit === '₹' ? formatINR(min) : `${min} ${unit}`}</span>
        <span>{unit === '₹' ? formatINR(max) : `${max} ${unit}`}</span>
      </div>
    </div>
  );
}

// ============================================================================
// SHARED RESULT CARD COMPONENT
// ============================================================================
interface ResultBoxProps {
  title: string;
  primaryLabel: string;
  primaryValue: string;
  items: { label: string; value: string; highlight?: boolean }[];
  proportionInvested?: number;
  proportionReturn?: number;
  labelInvested?: string;
  labelReturn?: string;
  caNote?: string;
}

function ResultBox({
  title,
  primaryLabel,
  primaryValue,
  items,
  proportionInvested,
  proportionReturn,
  labelInvested = 'Invested',
  labelReturn = 'Returns',
  caNote
}: ResultBoxProps) {
  const showBar = proportionInvested !== undefined && proportionReturn !== undefined && (proportionInvested + proportionReturn) > 0;
  const total = (proportionInvested || 0) + (proportionReturn || 0);
  const investedPercent = total > 0 ? ((proportionInvested || 0) / total) * 100 : 50;

  return (
    <div className="bg-slate-50/80 rounded-3xl p-6 border border-slate-200/80 space-y-5">
      <div>
        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{title}</div>
        <div className="text-xs text-slate-600 font-medium mt-1">{primaryLabel}</div>
        <div className="text-3xl sm:text-4xl font-black text-emerald-700 tracking-tight mt-0.5">
          {primaryValue}
        </div>
      </div>

      {/* Visual Proportional Bar */}
      {showBar && (
        <div className="space-y-1.5">
          <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden flex shadow-inner">
            <div 
              style={{ width: `${investedPercent}%` }} 
              className="bg-slate-700 h-full transition-all duration-300"
              title={`${labelInvested}: ${investedPercent.toFixed(1)}%`}
            />
            <div 
              style={{ width: `${100 - investedPercent}%` }} 
              className="bg-emerald-500 h-full transition-all duration-300"
              title={`${labelReturn}: ${(100 - investedPercent).toFixed(1)}%`}
            />
          </div>
          <div className="flex justify-between text-[10px] font-bold">
            <span className="flex items-center gap-1.5 text-slate-700">
              <span className="w-2 h-2 rounded-full bg-slate-700 inline-block" />
              {labelInvested} ({investedPercent.toFixed(0)}%)
            </span>
            <span className="flex items-center gap-1.5 text-emerald-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              {labelReturn} ({(100 - investedPercent).toFixed(0)}%)
            </span>
          </div>
        </div>
      )}

      {/* Breakdown List */}
      <div className="divide-y divide-slate-200/80 text-xs">
        {items.map((it, idx) => (
          <div key={idx} className="py-2.5 flex items-center justify-between">
            <span className="text-slate-600">{it.label}</span>
            <span className={`font-mono font-bold ${it.highlight ? 'text-emerald-700 font-black' : 'text-slate-900'}`}>
              {it.value}
            </span>
          </div>
        ))}
      </div>

      {/* CA Professional Note */}
      {caNote && (
        <div className="p-3 bg-white border border-slate-200 rounded-2xl text-[11px] text-slate-600 leading-relaxed flex items-start gap-2">
          <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>{caNote}</span>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// CAPITAL GAINS CALCULATOR (Budget 2024 - ClearTax Pattern with Grandfathering)
// ============================================================================
function CapitalGainsCalculatorView() {
  const [holdingPeriod, setHoldingPeriod] = useState<string>('more_than_1_year');
  const [saleValue, setSaleValue] = useState<number>(500000);
  const [purchaseDate, setPurchaseDate] = useState<string>('on_or_after_jan_2018');
  const [purchaseValue, setPurchaseValue] = useState<number>(300000);
  const [transferExpenses, setTransferExpenses] = useState<number>(0);
  const [fmvJan2018, setFmvJan2018] = useState<number>(0);

  const isLongTerm = holdingPeriod === 'more_than_1_year';

  // Grandfathering u/s 55(2)(ac)
  let effectiveCost = purchaseValue;
  if (purchaseDate === 'before_jan_2018' && fmvJan2018 > 0) {
    const step1 = Math.min(fmvJan2018, saleValue);
    effectiveCost = Math.max(purchaseValue, step1);
  }

  const netSaleConsideration = Math.max(0, saleValue - transferExpenses);
  const grossCapitalGain = Math.max(0, netSaleConsideration - effectiveCost);

  // Union Budget 2024:
  // LTCG: 12.5% (raised from 10%), Exemption: ₹1,25,000 (raised from ₹1,00,000)
  // STCG: 20% (raised from 15%)
  const exemptionLimit = isLongTerm ? 125000 : 0;
  const taxableGain = isLongTerm ? Math.max(0, grossCapitalGain - exemptionLimit) : grossCapitalGain;
  const taxRate = isLongTerm ? 12.5 : 20.0;
  const taxPayable = Math.round(taxableGain * (taxRate / 100));

  return (
    <div className="space-y-6">
      {/* Breadcrumb matching client reference */}
      <div className="text-xs text-slate-400 font-medium">
        Home &gt;&gt; Calculators &gt;&gt; Capital Gains Calculator
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: Inputs matching ClearTax screenshot exactly */}
        <div className="lg:col-span-7 space-y-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
          
          {/* 1. Holding Period */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 block">
              Holding Period (No of Years Between date of Purchase and sale)
            </label>
            <select
              value={holdingPeriod}
              onChange={(e) => setHoldingPeriod(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-blue-600 text-slate-900 font-medium transition-colors"
            >
              <option value="less_equal_1_year">Less Than or Equal to 1 Year</option>
              <option value="more_than_1_year">More than 1 Year</option>
            </select>
          </div>

          {/* 2. Sale Value */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 block">
              Sale Value
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-sm">₹</span>
              <input
                type="number"
                value={saleValue || ''}
                onChange={(e) => setSaleValue(Number(e.target.value))}
                placeholder="500000"
                className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-blue-600 text-slate-900 font-semibold transition-colors"
              />
            </div>
          </div>

          {/* 3. Purchase Date */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 block">
              Purchase Date
            </label>
            <select
              value={purchaseDate}
              onChange={(e) => setPurchaseDate(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-blue-600 text-slate-900 font-medium transition-colors"
            >
              <option value="before_jan_2018">Before 31 Jan 2018</option>
              <option value="on_or_after_jan_2018">On or After 31 Jan 2018</option>
            </select>
          </div>

          {/* 4. Purchase Value */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 block">
              Purchase Value
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-sm">₹</span>
              <input
                type="number"
                value={purchaseValue || ''}
                onChange={(e) => setPurchaseValue(Number(e.target.value))}
                placeholder="300000"
                className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-blue-600 text-slate-900 font-semibold transition-colors"
              />
            </div>
          </div>

          {/* 5. Transfer Expenses */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 block">
              Transfer Expenses (Brokerage etc.)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-sm">₹</span>
              <input
                type="number"
                value={transferExpenses || ''}
                onChange={(e) => setTransferExpenses(Number(e.target.value))}
                placeholder="0"
                className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-blue-600 text-slate-900 font-semibold transition-colors"
              />
            </div>
          </div>

          {/* 6. Fair Market Value as on 31st Jan 2018 (Grandfathering) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700 block">
                Fair Market Value (FMV) (Highest Price of Shares or units) as on 31st Jan 2018
              </label>
              {purchaseDate === 'before_jan_2018' && (
                <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                  Sec 55(2)(ac)
                </span>
              )}
            </div>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-sm">₹</span>
              <input
                type="number"
                value={fmvJan2018 || ''}
                onChange={(e) => setFmvJan2018(Number(e.target.value))}
                placeholder="0"
                disabled={purchaseDate !== 'before_jan_2018'}
                className={`w-full pl-9 pr-3.5 py-2.5 text-sm border rounded-xl font-semibold transition-colors ${
                  purchaseDate === 'before_jan_2018'
                    ? 'bg-white border-blue-400 focus:outline-none focus:border-blue-600 text-slate-900'
                    : 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              />
            </div>
            {purchaseDate !== 'before_jan_2018' && (
              <p className="text-[11px] text-slate-400">
                (Applicable only for assets acquired before 31 Jan 2018 for grandfathering protection)
              </p>
            )}
          </div>
        </div>

        {/* Right Output: Matching ClearTax screenshot banner and result text */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* File ITR Now CTA Button */}
          <Link
            href="/consult-ca"
            className="w-full py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-center block text-sm sm:text-base shadow-md hover:shadow-lg transition-all"
          >
            File ITR Now, Save more Taxes
          </Link>

          {/* EXACT RESULT TEXT matching Client's screenshot */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
            <p className="text-sm sm:text-base text-slate-900 font-medium leading-relaxed">
              <span className="font-bold text-slate-900">
                {isLongTerm ? 'Long Term' : 'Short Term'} Capital Gain
              </span>{' '}
              of <span className="font-bold text-slate-900">₹{grossCapitalGain.toLocaleString('en-IN')}</span> is chargeable to tax @{' '}
              <span className="font-bold text-blue-700">{taxRate}%</span> i.e{' '}
              <span className="font-black text-slate-900 text-lg">₹{taxPayable.toLocaleString('en-IN')}</span>
            </p>

            {isLongTerm && (
              <div className="text-xs text-slate-600 bg-blue-50/80 p-2.5 rounded-xl border border-blue-100 leading-relaxed">
                💡 <strong>Budget 2024 Relief:</strong> First ₹1,25,000 of Long-Term Capital Gains is completely tax-exempt under Section 112A. Tax @ 12.5% applies only on the net gain exceeding ₹1.25 Lakh.
              </div>
            )}
          </div>

          {/* Detailed Statement Breakdown */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs space-y-2.5">
            <div className="font-bold text-slate-800 pb-2 border-b border-slate-200 flex items-center justify-between">
              <span>Capital Gain Breakdown (Budget 2024)</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">Verified</span>
            </div>
            
            <div className="flex justify-between text-slate-600">
              <span>Sale Consideration:</span>
              <span className="font-mono font-semibold text-slate-900">₹{saleValue.toLocaleString('en-IN')}</span>
            </div>

            {transferExpenses > 0 && (
              <div className="flex justify-between text-slate-600">
                <span>Less: Transfer Expenses:</span>
                <span className="font-mono text-red-600">-₹{transferExpenses.toLocaleString('en-IN')}</span>
              </div>
            )}

            <div className="flex justify-between text-slate-600">
              <span>Cost of Acquisition:</span>
              <span className="font-mono font-semibold text-slate-900">₹{effectiveCost.toLocaleString('en-IN')}</span>
            </div>

            <div className="flex justify-between text-slate-900 font-bold pt-1 border-t border-slate-200">
              <span>Gross Capital Gain:</span>
              <span className="font-mono text-emerald-700 font-black">₹{grossCapitalGain.toLocaleString('en-IN')}</span>
            </div>

            {isLongTerm && (
              <div className="flex justify-between text-slate-600">
                <span>Less: Sec 112A Exemption:</span>
                <span className="font-mono text-emerald-700">-₹{Math.min(grossCapitalGain, exemptionLimit).toLocaleString('en-IN')}</span>
              </div>
            )}

            <div className="flex justify-between text-slate-900 font-bold pt-1 border-t border-slate-200">
              <span>Net Taxable Capital Gain:</span>
              <span className="font-mono font-black text-slate-900">₹{taxableGain.toLocaleString('en-IN')}</span>
            </div>

            <div className="flex justify-between text-blue-900 font-bold text-sm pt-2 border-t-2 border-blue-200">
              <span>Tax Payable ({taxRate}%):</span>
              <span className="font-mono font-black text-blue-700 text-base">₹{taxPayable.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Deep link to Full Advanced Multi-Asset Tool with PDF */}
          <Link
            href="/tools/capital-gain-calculator"
            className="group flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-emerald-900 via-slate-900 to-[#0B2545] text-white border border-emerald-500/40 hover:border-emerald-400 shadow-sm transition-all"
          >
            <div>
              <span className="text-xs font-bold text-emerald-400 block group-hover:text-emerald-300">
                Advanced Multi-Asset Suite Tool
              </span>
              <span className="text-[11px] text-slate-300">
                Real Estate Dual Indexation (CII), Gold, Section 54/54EC &amp; PDF Export
              </span>
            </div>
            <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform shrink-0 ml-2" />
          </Link>

        </div>
      </div>
    </div>
  );
}

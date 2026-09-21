'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import * as XLSX from 'xlsx';
import { 
  ShoppingCart, 
  FileSpreadsheet, 
  Download, 
  Upload, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  RefreshCw, 
  Search, 
  Filter, 
  FileCheck, 
  AlertCircle, 
  ArrowRight, 
  Lock, 
  Percent, 
  HelpCircle,
  TrendingUp,
  Layers,
  Building,
  Check,
  Zap,
  Info
} from 'lucide-react';

// Official 2-Digit Indian State Codes (GST Master)
export const GST_STATE_CODES: Record<string, { code: string; name: string }> = {
  'JAMMU AND KASHMIR': { code: '01', name: 'Jammu and Kashmir' },
  'HIMACHAL PRADESH': { code: '02', name: 'Himachal Pradesh' },
  'PUNJAB': { code: '03', name: 'Punjab' },
  'CHANDIGARH': { code: '04', name: 'Chandigarh' },
  'UTTARAKHAND': { code: '05', name: 'Uttarakhand' },
  'HARYANA': { code: '06', name: 'Haryana' },
  'DELHI': { code: '07', name: 'Delhi' },
  'RAJASTHAN': { code: '08', name: 'Rajasthan' },
  'UTTAR PRADESH': { code: '09', name: 'Uttar Pradesh' },
  'BIHAR': { code: '10', name: 'Bihar' },
  'SIKKIM': { code: '11', name: 'Sikkim' },
  'ARUNACHAL PRADESH': { code: '12', name: 'Arunachal Pradesh' },
  'NAGALAND': { code: '13', name: 'Nagaland' },
  'MANIPUR': { code: '14', name: 'Manipur' },
  'MIZORAM': { code: '15', name: 'Mizoram' },
  'TRIPURA': { code: '16', name: 'Tripura' },
  'MEGHALAYA': { code: '17', name: 'Meghalaya' },
  'ASSAM': { code: '18', name: 'Assam' },
  'WEST BENGAL': { code: '19', name: 'West Bengal' },
  'JHARKHAND': { code: '20', name: 'Jharkhand' },
  'ODISHA': { code: '21', name: 'Odisha' },
  'CHHATTISGARH': { code: '22', name: 'Chhattisgarh' },
  'MADHYA PRADESH': { code: '23', name: 'Madhya Pradesh' },
  'GUJARAT': { code: '24', name: 'Gujarat' },
  'DADRA AND NAGAR HAVELI AND DAMAN AND DIU': { code: '26', name: 'Dadra and Nagar Haveli and Daman and Diu' },
  'MAHARASHTRA': { code: '27', name: 'Maharashtra' },
  'ANDHRA PRADESH': { code: '37', name: 'Andhra Pradesh' },
  'KARNATAKA': { code: '29', name: 'Karnataka' },
  'GOA': { code: '30', name: 'Goa' },
  'LAKSHADWEEP': { code: '31', name: 'Lakshadweep' },
  'KERALA': { code: '32', name: 'Kerala' },
  'TAMIL NADU': { code: '33', name: 'Tamil Nadu' },
  'PUDUCHERRY': { code: '34', name: 'Puducherry' },
  'ANDAMAN AND NICOBAR ISLANDS': { code: '35', name: 'Andaman and Nicobar Islands' },
  'TELANGANA': { code: '36', name: 'Telangana' },
  'LADAKH': { code: '38', name: 'Ladakh' },
  'OTHER TERRITORY': { code: '97', name: 'Other Territory' }
};

// Aliases for common abbreviations
const STATE_ALIASES: Record<string, string> = {
  'UP': 'UTTAR PRADESH',
  'DL': 'DELHI',
  'MH': 'MAHARASHTRA',
  'KA': 'KARNATAKA',
  'TN': 'TAMIL NADU',
  'GJ': 'GUJARAT',
  'WB': 'WEST BENGAL',
  'RJ': 'RAJASTHAN',
  'HR': 'HARYANA',
  'MP': 'MADHYA PRADESH',
  'TS': 'TELANGANA',
  'TG': 'TELANGANA',
  'AP': 'ANDHRA PRADESH',
  'KL': 'KERALA',
  'PB': 'PUNJAB',
  'BR': 'BIHAR',
  'JH': 'JHARKHAND',
  'OD': 'ODISHA',
  'ORISSA': 'ODISHA',
  'UK': 'UTTARAKHAND',
  'UA': 'UTTARAKHAND',
  'HP': 'HIMACHAL PRADESH',
  'GA': 'GOA',
  'AS': 'ASSAM',
  'CH': 'CHANDIGARH',
  'JK': 'JAMMU AND KASHMIR',
  'J&K': 'JAMMU AND KASHMIR'
};

export interface Table7B2CSItem {
  posCode: string;
  posName: string;
  taxRate: number; // e.g. 5, 12, 18, 28
  supplyType: 'INTER' | 'INTRA';
  forwardTaxable: number;
  returnTaxable: number;
  netTaxable: number;
  igst: number;
  cgst: number;
  sgst: number;
  totalTax: number;
  tcsDeducted: number; // 1% Section 52
}

// 50-Item Realistic Demo Dataset (Amazon MTR & Flipkart Mix across Indian States)
const SAMPLE_ORDERS_DEMO: any[] = [
  { orderId: '408-1928374-1029381', date: '2025-05-02', marketplace: 'Amazon MTR', state: 'Delhi', stateCode: '07', type: 'Shipment', rate: 18, taxable: 3450 },
  { orderId: '408-1928374-1029382', date: '2025-05-03', marketplace: 'Amazon MTR', state: 'Maharashtra', stateCode: '27', type: 'Shipment', rate: 18, taxable: 5800 },
  { orderId: 'OD129837461928374000', date: '2025-05-04', marketplace: 'Flipkart', state: 'Karnataka', stateCode: '29', type: 'Shipment', rate: 12, taxable: 2200 },
  { orderId: '408-1928374-1029383', date: '2025-05-04', marketplace: 'Amazon MTR', state: 'Uttar Pradesh', stateCode: '09', type: 'Shipment', rate: 18, taxable: 4100 },
  { orderId: '408-1928374-1029384', date: '2025-05-05', marketplace: 'Amazon MTR', state: 'Tamil Nadu', stateCode: '33', type: 'Shipment', rate: 18, taxable: 6900 },
  { orderId: 'MSH-819283746102', date: '2025-05-05', marketplace: 'Meesho', state: 'Rajasthan', stateCode: '08', type: 'Shipment', rate: 5, taxable: 1550 },
  { orderId: '408-1928374-1029385', date: '2025-05-06', marketplace: 'Amazon MTR', state: 'Delhi', stateCode: '07', type: 'Refund', rate: 18, taxable: 1200 },
  { orderId: 'OD129837461928374001', date: '2025-05-06', marketplace: 'Flipkart', state: 'Gujarat', stateCode: '24', type: 'Shipment', rate: 18, taxable: 8400 },
  { orderId: '408-1928374-1029386', date: '2025-05-07', marketplace: 'Amazon MTR', state: 'Maharashtra', stateCode: '27', type: 'Shipment', rate: 12, taxable: 3100 },
  { orderId: '408-1928374-1029387', date: '2025-05-07', marketplace: 'Amazon MTR', state: 'Telangana', stateCode: '36', type: 'Shipment', rate: 18, taxable: 4950 },
  { orderId: 'OD129837461928374002', date: '2025-05-08', marketplace: 'Flipkart', state: 'West Bengal', stateCode: '19', type: 'Shipment', rate: 18, taxable: 3750 },
  { orderId: '408-1928374-1029388', date: '2025-05-09', marketplace: 'Amazon MTR', state: 'Uttar Pradesh', stateCode: '09', type: 'Shipment', rate: 5, taxable: 2800 },
  { orderId: '408-1928374-1029389', date: '2025-05-09', marketplace: 'Amazon MTR', state: 'Haryana', stateCode: '06', type: 'Shipment', rate: 18, taxable: 4200 },
  { orderId: 'MSH-819283746103', date: '2025-05-10', marketplace: 'Meesho', state: 'Bihar', stateCode: '10', type: 'Shipment', rate: 5, taxable: 1950 },
  { orderId: 'OD129837461928374003', date: '2025-05-10', marketplace: 'Flipkart', state: 'Maharashtra', stateCode: '27', type: 'Refund', rate: 18, taxable: 1500 },
  { orderId: '408-1928374-1029390', date: '2025-05-11', marketplace: 'Amazon MTR', state: 'Kerala', stateCode: '32', type: 'Shipment', rate: 18, taxable: 5400 },
  { orderId: '408-1928374-1029391', date: '2025-05-12', marketplace: 'Amazon MTR', state: 'Punjab', stateCode: '03', type: 'Shipment', rate: 12, taxable: 2600 },
  { orderId: 'OD129837461928374004', date: '2025-05-13', marketplace: 'Flipkart', state: 'Madhya Pradesh', stateCode: '23', type: 'Shipment', rate: 18, taxable: 4800 },
  { orderId: '408-1928374-1029392', date: '2025-05-14', marketplace: 'Amazon MTR', state: 'Delhi', stateCode: '07', type: 'Shipment', rate: 12, taxable: 3800 },
  { orderId: '408-1928374-1029393', date: '2025-05-15', marketplace: 'Amazon MTR', state: 'Uttar Pradesh', stateCode: '09', type: 'Refund', rate: 18, taxable: 950 },
  { orderId: 'OD129837461928374005', date: '2025-05-16', marketplace: 'Flipkart', state: 'Assam', stateCode: '18', type: 'Shipment', rate: 18, taxable: 3300 },
  { orderId: '408-1928374-1029394', date: '2025-05-17', marketplace: 'Amazon MTR', state: 'Karnataka', stateCode: '29', type: 'Shipment', rate: 18, taxable: 7100 },
  { orderId: 'MSH-819283746104', date: '2025-05-18', marketplace: 'Meesho', state: 'Odisha', stateCode: '21', type: 'Shipment', rate: 5, taxable: 1400 },
  { orderId: '408-1928374-1029395', date: '2025-05-19', marketplace: 'Amazon MTR', state: 'Gujarat', stateCode: '24', type: 'Refund', rate: 18, taxable: 1100 },
  { orderId: 'OD129837461928374006', date: '2025-05-20', marketplace: 'Flipkart', state: 'Chandigarh', stateCode: '04', type: 'Shipment', rate: 18, taxable: 2900 }
];

export default function EcommerceGstConverterPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Configuration
  const [sellerGstin, setSellerGstin] = useState('09AAACG1234F1Z8');
  const [homeStateCode, setHomeStateCode] = useState('09'); // 09 Uttar Pradesh default
  const [filingPeriod, setFilingPeriod] = useState('052025'); // May 2025
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Raw orders & Aggregated Table 7 items
  const [rawOrders, setRawOrders] = useState<any[]>([]);
  const [table7Items, setTable7Items] = useState<Table7B2CSItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [rateFilter, setRateFilter] = useState('all');

  // Normalize state name to official 2-digit code
  const resolveStateCode = (input: string): { code: string; name: string } => {
    if (!input) return { code: '09', name: 'Uttar Pradesh' };
    const clean = input.trim().toUpperCase();

    // Direct 2-digit code check
    const matchByCode = Object.values(GST_STATE_CODES).find(s => s.code === clean);
    if (matchByCode) return matchByCode;

    // Check aliases
    const aliasResolved = STATE_ALIASES[clean] || clean;
    if (GST_STATE_CODES[aliasResolved]) {
      return GST_STATE_CODES[aliasResolved];
    }

    // Substring search
    for (const [key, val] of Object.entries(GST_STATE_CODES)) {
      if (key.includes(aliasResolved) || aliasResolved.includes(key)) {
        return val;
      }
    }

    return { code: '09', name: input };
  };

  // Process rows into Table 7 B2CS
  const processOrdersData = (orders: any[], homeState: string = homeStateCode) => {
    // Group by PoS Code + Tax Rate
    const map = new Map<string, {
      posCode: string;
      posName: string;
      taxRate: number;
      forwardTaxable: number;
      returnTaxable: number;
    }>();

    orders.forEach(order => {
      const stateObj = resolveStateCode(order.stateCode || order.state);
      const rate = Number(order.rate) || 18;
      const taxable = Math.abs(Number(order.taxable) || 0);
      const isReturn = String(order.type || '').toLowerCase().includes('return') || 
                       String(order.type || '').toLowerCase().includes('refund') ||
                       String(order.type || '').toLowerCase().includes('cancel') ||
                       (Number(order.taxable) < 0);

      const key = `${stateObj.code}_${rate}`;

      if (!map.has(key)) {
        map.set(key, {
          posCode: stateObj.code,
          posName: stateObj.name,
          taxRate: rate,
          forwardTaxable: 0,
          returnTaxable: 0
        });
      }

      const entry = map.get(key)!;
      if (isReturn) {
        entry.returnTaxable += taxable;
      } else {
        entry.forwardTaxable += taxable;
      }
    });

    // Construct final Table 7 array
    const results: Table7B2CSItem[] = [];

    map.forEach(item => {
      const netTaxable = Math.max(0, item.forwardTaxable - item.returnTaxable);
      const isIntra = item.posCode === homeState;
      const supplyType = isIntra ? 'INTRA' : 'INTER';

      let igst = 0;
      let cgst = 0;
      let sgst = 0;

      if (isIntra) {
        const halfRate = item.taxRate / 2;
        cgst = Number(((netTaxable * halfRate) / 100).toFixed(2));
        sgst = Number(((netTaxable * halfRate) / 100).toFixed(2));
      } else {
        igst = Number(((netTaxable * item.taxRate) / 100).toFixed(2));
      }

      const totalTax = Number((igst + cgst + sgst).toFixed(2));
      // 1% Section 52 TCS credit (0.5% CGST + 0.5% SGST or 1% IGST)
      const tcsDeducted = Number(((netTaxable * 1) / 100).toFixed(2));

      results.push({
        posCode: item.posCode,
        posName: item.posName,
        taxRate: item.taxRate,
        supplyType,
        forwardTaxable: Number(item.forwardTaxable.toFixed(2)),
        returnTaxable: Number(item.returnTaxable.toFixed(2)),
        netTaxable: Number(netTaxable.toFixed(2)),
        igst,
        cgst,
        sgst,
        totalTax,
        tcsDeducted
      });
    });

    // Sort by State Code ascending
    results.sort((a, b) => a.posCode.localeCompare(b.posCode));
    setTable7Items(results);
  };

  // Load 1-Click Demo Data
  const handleLoadSampleData = () => {
    setIsProcessing(true);
    setUploadedFileName('Amazon_MTR_&_Flipkart_Combined_May2025.csv');
    setTimeout(() => {
      setRawOrders(SAMPLE_ORDERS_DEMO);
      processOrdersData(SAMPLE_ORDERS_DEMO, homeStateCode);
      setIsProcessing(false);
    }, 400);
  };

  // Real File Upload Parser (Amazon MTR / Flipkart / Meesho / CSV)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setUploadedFileName(file.name);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json<any>(ws, { header: 1 });

        if (!rows || rows.length < 2) {
          alert('Spreadsheet is empty or missing headers.');
          setIsProcessing(false);
          return;
        }

        // Detect column indices based on common header names
        const headerRow: string[] = (rows[0] || []).map((h: any) => String(h || '').toLowerCase().trim());
        
        // Helper to find header
        const findCol = (keywords: string[]) => {
          return headerRow.findIndex(h => keywords.some(k => h.includes(k)));
        };

        const stateCol = findCol(['ship to state', 'customer delivery state', 'delivery state', 'state', 'place of supply', 'pos', 'recipient state']);
        const typeCol = findCol(['transaction type', 'event type', 'order status', 'type', 'shipment/refund', 'status']);
        const rateCol = findCol(['tax rate', 'gst rate', 'rate', 'item gst rate']);
        const taxableCol = findCol(['tax exclusive gross', 'taxable value', 'item taxable value', 'invoice value', 'net amount', 'amount', 'taxable']);
        const orderIdCol = findCol(['order id', 'order-id', 'order item id', 'sub order no', 'invoice number']);

        const parsedOrders: any[] = [];

        for (let i = 1; i < rows.length; i++) {
          const r = rows[i];
          if (!r || r.length === 0) continue;

          const rawState = stateCol !== -1 ? String(r[stateCol] || '') : 'Uttar Pradesh';
          if (!rawState) continue;

          const rawType = typeCol !== -1 ? String(r[typeCol] || '') : 'Shipment';
          let rawTaxable = taxableCol !== -1 ? Number(r[taxableCol]) || 0 : 0;
          let rawRate = rateCol !== -1 ? Number(r[rateCol]) || 18 : 18;

          // If rate is entered as 0.18 -> convert to 18
          if (rawRate < 1 && rawRate > 0) {
            rawRate = Math.round(rawRate * 100);
          }

          parsedOrders.push({
            orderId: orderIdCol !== -1 ? String(r[orderIdCol] || `ORD-${i}`) : `ORD-${i}`,
            state: rawState,
            type: rawType,
            rate: rawRate,
            taxable: rawTaxable
          });
        }

        if (parsedOrders.length === 0) {
          alert('Could not detect order columns. Please make sure the sheet has State and Taxable Value headers, or test with our 1-Click Sample Data.');
          setIsProcessing(false);
          return;
        }

        setRawOrders(parsedOrders);
        processOrdersData(parsedOrders, homeStateCode);
      } catch (err: any) {
        alert('Error parsing file: ' + (err.message || 'Invalid format'));
      } finally {
        setIsProcessing(false);
      }
    };

    reader.readAsBinaryString(file);
  };

  // Handle Home State change & reprocess
  const handleHomeStateChange = (newCode: string) => {
    setHomeStateCode(newCode);
    if (rawOrders.length > 0) {
      processOrdersData(rawOrders, newCode);
    }
  };

  // KPIs
  const totalOrdersCount = rawOrders.length;
  const totalGrossForward = table7Items.reduce((acc, i) => acc + i.forwardTaxable, 0);
  const totalReturnsDeducted = table7Items.reduce((acc, i) => acc + i.returnTaxable, 0);
  const totalNetTaxable = table7Items.reduce((acc, i) => acc + i.netTaxable, 0);
  const totalGstLiability = table7Items.reduce((acc, i) => acc + i.totalTax, 0);
  const totalTcsAccrued = table7Items.reduce((acc, i) => acc + i.tcsDeducted, 0);

  // Filtered Table 7 items
  const filteredItems = table7Items.filter(item => {
    const matchesSearch = item.posName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.posCode.includes(searchTerm);
    const matchesRate = rateFilter === 'all' || item.taxRate === Number(rateFilter);
    return matchesSearch && matchesRate;
  });

  // Export Official GST Portal Table 7 JSON
  const handleDownloadGstr1Json = () => {
    if (table7Items.length === 0) return;

    // Official GST Offline Tool Schema for Table 7 (b2cs)
    const jsonPayload = {
      gstin: sellerGstin.trim().toUpperCase() || '09AAACG1234F1Z8',
      fp: filingPeriod.trim() || '052025',
      gt: totalNetTaxable,
      cur_gt: totalNetTaxable,
      version: 'GSTR1_v2.4',
      hash: 'hash-offline-json',
      b2cs: table7Items.map(item => ({
        sply_ty: item.supplyType,
        pos: item.posCode,
        typ: 'OE', // E-Commerce Operator Supplies
        rt: item.taxRate,
        txval: item.netTaxable,
        iamt: item.igst,
        camt: item.cgst,
        samt: item.sgst,
        csamt: 0
      }))
    };

    const blob = new Blob([JSON.stringify(jsonPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GSTR1_Table7_B2CS_${sellerGstin}_${filingPeriod}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Export Audit CSV
  const handleDownloadAuditCsv = () => {
    if (table7Items.length === 0) return;

    const headers = [
      'Place of Supply (PoS)',
      'State Name',
      'Supply Type',
      'GST Rate (%)',
      'Forward Gross (Rs)',
      'Returns Deducted (Rs)',
      'Net Taxable Value (Rs)',
      'IGST (Rs)',
      'CGST (Rs)',
      'SGST (Rs)',
      'Total GST (Rs)',
      'Sec 52 TCS 1% Credit (Rs)'
    ];

    const rows = table7Items.map(item => [
      `"${item.posCode}"`,
      `"${item.posName}"`,
      item.supplyType,
      item.taxRate,
      item.forwardTaxable,
      item.returnTaxable,
      item.netTaxable,
      item.igst,
      item.cgst,
      item.sgst,
      item.totalTax,
      item.tcsDeducted
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = `ECommerce_GST_Audit_Summary_${filingPeriod}.csv`;
    link.click();
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Strip */}
        <div className="bg-gradient-to-br from-[#0B2545] via-[#091D36] to-[#040e1b] rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="max-w-3xl space-y-3 relative z-10">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>100% Free E-Commerce Tool</span>
              </span>
              <span className="px-3 py-1 rounded-full bg-white/10 text-slate-300 text-xs font-semibold flex items-center gap-1">
                <Lock className="w-3 h-3 text-emerald-400" />
                <span>Client-Side Only: Zero Data Uploaded to Server</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              E-Commerce GSTR-1 & TCS Generator
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Instantly aggregate Amazon MTR, Flipkart GSTR, Meesho & Shopify CSV sheets into official 
              <strong> Table 7 B2CS</strong> JSON for direct GST Portal upload. Automatically offsets customer returns 
              and calculates <strong>1% Section 52 TCS credit</strong>.
            </p>

            {/* Quick action bar */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleLoadSampleData}
                disabled={isProcessing}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Load Sample E-Commerce Data (1-Click Test)</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessing}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 text-emerald-400" />
                <span>Upload Your MTR / GSTR CSV / Excel</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileUpload}
                className="hidden"
              />

              <Link
                href="/services/ecommerce-gst-filing"
                className="text-xs font-bold text-slate-300 hover:text-white underline underline-offset-4 ml-auto"
              >
                Need CA Filing Retainership? (₹499/mo) →
              </Link>
            </div>
          </div>
        </div>

        {/* GSTIN & Home State Setup Bar */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Your GSTIN (For JSON Header)
            </label>
            <input
              type="text"
              value={sellerGstin}
              onChange={(e) => setSellerGstin(e.target.value.toUpperCase())}
              placeholder="e.g. 09AAACG1234F1Z8"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-mono font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Seller Home State (For CGST/SGST vs IGST split)
            </label>
            <select
              value={homeStateCode}
              onChange={(e) => handleHomeStateChange(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500"
            >
              {Object.values(GST_STATE_CODES).map(s => (
                <option key={s.code} value={s.code}>
                  {s.code} - {s.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Return Filing Period (MMYYYY)
            </label>
            <input
              type="text"
              value={filingPeriod}
              onChange={(e) => setFilingPeriod(e.target.value)}
              placeholder="e.g. 052025"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-mono font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Process State or Active File Indicator */}
        {uploadedFileName && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs text-emerald-900">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Active File: <strong>{uploadedFileName}</strong> ({rawOrders.length} raw transactions processed)
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                setUploadedFileName('');
                setRawOrders([]);
                setTable7Items([]);
              }}
              className="text-xs text-emerald-700 hover:text-emerald-900 font-bold underline"
            >
              Clear
            </button>
          </div>
        )}

        {/* Executive Metrics Overview */}
        {table7Items.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Raw Orders</span>
              <span className="text-xl sm:text-2xl font-black text-slate-900">{totalOrdersCount}</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Shipments + Returns</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Gross Sales</span>
              <span className="text-xl sm:text-2xl font-black text-slate-900">₹{totalGrossForward.toLocaleString('en-IN')}</span>
              <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">Forward supply</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Returns Deducted</span>
              <span className="text-xl sm:text-2xl font-black text-rose-600">₹{totalReturnsDeducted.toLocaleString('en-IN')}</span>
              <span className="text-[10px] text-rose-600 font-semibold block mt-0.5">Tax saved on RTO</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Net Table 7</span>
              <span className="text-xl sm:text-2xl font-black text-emerald-700">₹{totalNetTaxable.toLocaleString('en-IN')}</span>
              <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">B2CS taxable value</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Total GST</span>
              <span className="text-xl sm:text-2xl font-black text-slate-900">₹{totalGstLiability.toLocaleString('en-IN')}</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">IGST + CGST + SGST</span>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-2xl border border-amber-300 shadow-sm">
              <span className="text-[10px] font-bold text-amber-800 uppercase block">Sec 52 TCS Credit</span>
              <span className="text-xl sm:text-2xl font-black text-amber-900">₹{totalTcsAccrued.toLocaleString('en-IN')}</span>
              <span className="text-[10px] text-amber-800 font-bold block mt-0.5">1% Cash Refund</span>
            </div>
          </div>
        )}

        {/* Output Table & Export Controls */}
        {table7Items.length > 0 ? (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  Consolidated GSTR-1 Table 7 (B2CS Supplies)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Aggregated by Place of Supply (State Code) and GST Tax Rate with return deductions.
                </p>
              </div>

              {/* Action Export Buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={handleDownloadGstr1Json}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                  title="Direct upload to GST Offline Tool or GST Portal"
                >
                  <Download className="w-4 h-4" />
                  <span>Download GSTR-1 JSON</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadAuditCsv}
                  className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                  title="Download State-wise Excel/CSV for Audit"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                  <span>Download Audit CSV</span>
                </button>
              </div>
            </div>

            {/* Filter / Search Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter by State name or code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500 font-bold">Tax Rate:</span>
                {['all', '5', '12', '18', '28'].map(rate => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => setRateFilter(rate)}
                    className={`px-3 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                      rateFilter === rate
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {rate === 'all' ? 'All Rates' : `${rate}%`}
                  </button>
                ))}
              </div>
            </div>

            {/* Table 7 Data Grid */}
            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-900 text-white font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3">PoS Code</th>
                    <th className="p-3">Place of Supply (State)</th>
                    <th className="p-3">Type</th>
                    <th className="p-3 text-right">GST Rate</th>
                    <th className="p-3 text-right">Gross Sales</th>
                    <th className="p-3 text-right text-rose-300">Returns Deducted</th>
                    <th className="p-3 text-right text-emerald-300">Net Taxable (Table 7)</th>
                    <th className="p-3 text-right">IGST</th>
                    <th className="p-3 text-right">CGST</th>
                    <th className="p-3 text-right">SGST</th>
                    <th className="p-3 text-right">Total Tax</th>
                    <th className="p-3 text-right text-amber-300">Sec 52 TCS (1%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-mono">
                  {filteredItems.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 font-bold text-slate-900">{item.posCode}</td>
                      <td className="p-3 font-sans font-semibold text-slate-800">{item.posName}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                          item.supplyType === 'INTRA' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-indigo-100 text-indigo-800'
                        }`}>
                          {item.supplyType}
                        </span>
                      </td>
                      <td className="p-3 text-right font-bold">{item.taxRate}%</td>
                      <td className="p-3 text-right text-slate-600">₹{item.forwardTaxable.toLocaleString('en-IN')}</td>
                      <td className="p-3 text-right text-rose-600 font-semibold">-₹{item.returnTaxable.toLocaleString('en-IN')}</td>
                      <td className="p-3 text-right font-black text-emerald-700">₹{item.netTaxable.toLocaleString('en-IN')}</td>
                      <td className="p-3 text-right text-slate-700">{item.igst > 0 ? `₹${item.igst.toLocaleString('en-IN')}` : '-'}</td>
                      <td className="p-3 text-right text-slate-700">{item.cgst > 0 ? `₹${item.cgst.toLocaleString('en-IN')}` : '-'}</td>
                      <td className="p-3 text-right text-slate-700">{item.sgst > 0 ? `₹${item.sgst.toLocaleString('en-IN')}` : '-'}</td>
                      <td className="p-3 text-right font-bold text-slate-900">₹{item.totalTax.toLocaleString('en-IN')}</td>
                      <td className="p-3 text-right font-bold text-amber-700">₹{item.tcsDeducted.toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Tracconsultant Senior CA Filing Callout Card */}
            <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-[#0B2545] rounded-2xl p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <div className="flex items-center gap-1.5 justify-center sm:justify-start text-emerald-400 font-bold text-xs">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Senior CA Filing & TCS Claim Service</span>
                </div>
                <h4 className="text-base font-black">
                  Want our Senior Chartered Accountants to file this return on the GST Portal?
                </h4>
                <p className="text-xs text-slate-300">
                  We claim your <strong>₹{totalTcsAccrued.toLocaleString('en-IN')} Section 52 TCS</strong> cash credit, file GSTR-1 and GSTR-3B, and provide 100% Notice Protection.
                </p>
              </div>

              <div className="shrink-0 flex items-center gap-3">
                <Link
                  href="/services/ecommerce-gst-filing"
                  className="px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs shadow-lg transition-all"
                >
                  File for ₹499/mo →
                </Link>
              </div>
            </div>
          </div>
        ) : (
          /* Empty State / How to use guide */
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 text-center space-y-6">
            <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <ShoppingCart className="w-8 h-8" />
            </div>

            <div className="max-w-md mx-auto space-y-2">
              <h3 className="text-xl font-black text-slate-900">No Marketplace File Loaded Yet</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Click below to test instantly with realistic 50-order sample data, or upload your actual Monthly Tax Report (MTR) from Amazon, Flipkart, or Meesho.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleLoadSampleData}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <Zap className="w-4 h-4" />
                <span>Load Sample E-Commerce Data (1-Click Test)</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-xs flex items-center gap-2 transition-all cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>Upload CSV / Excel File</span>
              </button>
            </div>

            {/* How to download reports guide */}
            <div className="pt-8 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left max-w-4xl mx-auto text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="font-black text-slate-900 block">Amazon Seller Central</span>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Go to <strong>Reports &gt; Tax Document Library &gt; Merchant Tax Report (MTR)</strong>. Choose Month and download B2C Orders CSV.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="font-black text-slate-900 block">Flipkart Seller Hub</span>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Go to <strong>Reports Center &gt; GSTR Reports</strong>. Generate and download the Sales Report Excel file for the month.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="font-black text-slate-900 block">Meesho Supplier Panel</span>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Navigate to <strong>Payments &gt; GST Reports</strong>. Download your monthly GST order and return sheet.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

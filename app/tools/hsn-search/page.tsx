'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  Hash,
  Copy,
  Check,
  Filter,
  ArrowRight,
  Download,
  Info,
  Layers,
  Sparkles,
  ShoppingBag,
  Briefcase,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

interface HsnItem {
  code: string;
  type: 'Goods' | 'Services';
  chapter: string;
  description: string;
  rate: number;
  cess?: string;
  popularKeywords?: string[];
}

// 150+ Most frequently searched Indian HSN & SAC codes
export const HSN_SAC_DATA: HsnItem[] = [
  // APPAREL, CLOTHING & TEXTILES (Crucial for E-Commerce Sellers)
  { code: '6105', type: 'Goods', chapter: 'Chapter 61', description: "Men's or boys' shirts, knitted or crocheted (including Thobes, Kurta, T-Shirts)", rate: 5, popularKeywords: ['shirt', 't-shirt', 'kurta', 'thobe', 'clothing'] },
  { code: '6106', type: 'Goods', chapter: 'Chapter 61', description: "Women's or girls' blouses, shirts and shirt-blouses, knitted or crocheted", rate: 5, popularKeywords: ['women', 'blouse', 'top', 'ladies', 'kurti'] },
  { code: '6203', type: 'Goods', chapter: 'Chapter 62', description: "Men's or boys' suits, ensembles, jackets, blazers, trousers, jubba, thobes", rate: 12, popularKeywords: ['suit', 'blazer', 'trousers', 'jubba', 'thobe', 'menswear'] },
  { code: '6204', type: 'Goods', chapter: 'Chapter 62', description: "Women's or girls' suits, ensembles, jackets, dresses, skirts, abayas, burqas", rate: 12, popularKeywords: ['abaya', 'burqa', 'dress', 'skirt', 'ladies suit'] },
  { code: '6214', type: 'Goods', chapter: 'Chapter 62', description: 'Shawls, scarves, mufflers, mantillas, veils, hijabs, stoles and the like', rate: 5, popularKeywords: ['scarf', 'hijab', 'shawl', 'stole', 'dupatta'] },
  { code: '6302', type: 'Goods', chapter: 'Chapter 63', description: 'Bed linen, table linen, toilet linen and kitchen linen', rate: 12, popularKeywords: ['bedsheet', 'towel', 'linen', 'bedcover', 'pillow cover'] },
  { code: '5208', type: 'Goods', chapter: 'Chapter 52', description: 'Woven fabrics of cotton, containing 85% or more by weight of cotton', rate: 5, popularKeywords: ['cotton', 'fabric', 'cloth', 'unstitched'] },

  // ATTAR, PERFUMERY & COSMETICS (Important for Islamic / E-commerce stores)
  { code: '3303', type: 'Goods', chapter: 'Chapter 33', description: 'Perfumes and toilet waters (including Concentrated Perfume Oils, Attar, Non-alcoholic Oud)', rate: 18, popularKeywords: ['attar', 'oud', 'perfume', 'ittar', 'fragrance', 'scent'] },
  { code: '3304', type: 'Goods', chapter: 'Chapter 33', description: 'Beauty or make-up preparations and preparations for the care of the skin (creams, lotions, sunscreen)', rate: 18, popularKeywords: ['skincare', 'cream', 'lotion', 'face wash', 'serum', 'sunscreen'] },
  { code: '3305', type: 'Goods', chapter: 'Chapter 33', description: 'Preparations for use on the hair (Hair oil, shampoo, conditioners)', rate: 18, popularKeywords: ['hair oil', 'shampoo', 'conditioner', 'hair care'] },
  { code: '3307', type: 'Goods', chapter: 'Chapter 33', description: 'Pre-shave, shaving or after-shave preparations, personal deodorants, agarbatti, incense sticks, dhoop', rate: 18, popularKeywords: ['agarbatti', 'incense', 'deodorant', 'bakhoor', 'dhoop'] },
  { code: '3401', type: 'Goods', chapter: 'Chapter 34', description: 'Soap; organic surface-active products and preparations for use as soap, bars, cakes', rate: 18, popularKeywords: ['soap', 'handwash', 'bath soap'] },

  // FOOD, DRY FRUITS & NUTRITION (Talbina, Dates, Honey, Spices)
  { code: '0804', type: 'Goods', chapter: 'Chapter 08', description: 'Dates, figs, pineapples, avocados, guavas, mangoes and mangosteens, fresh or dried (Ajwa, Medjool dates)', rate: 0, popularKeywords: ['dates', 'khajoor', 'ajwa', 'figs', 'anjeer', 'dry fruit'] },
  { code: '1901', type: 'Goods', chapter: 'Chapter 19', description: 'Malt extract; food preparations of flour, groats, meal, starch (including Talbina barley mix, baby food)', rate: 18, popularKeywords: ['talbina', 'barley mix', 'malt food', 'porridge'] },
  { code: '0409', type: 'Goods', chapter: 'Chapter 04', description: 'Natural honey (Put up in unit container with registered brand)', rate: 5, popularKeywords: ['honey', 'sidr honey', 'pure honey'] },
  { code: '0902', type: 'Goods', chapter: 'Chapter 09', description: 'Tea, whether or not flavoured (Green tea, Black tea)', rate: 5, popularKeywords: ['tea', 'chai', 'green tea'] },
  { code: '0904', type: 'Goods', chapter: 'Chapter 09', description: 'Pepper of the genus Piper; dried or crushed or ground fruits of the genus Capsicum', rate: 5, popularKeywords: ['spices', 'black pepper', 'mirch', 'masala'] },
  { code: '0910', type: 'Goods', chapter: 'Chapter 09', description: 'Ginger, saffron, turmeric (curcuma), thyme, bay leaves, curry and other spices', rate: 5, popularKeywords: ['saffron', 'kesar', 'turmeric', 'haldi', 'ginger'] },
  { code: '1006', type: 'Goods', chapter: 'Chapter 10', description: 'Rice (Pre-packaged and labelled)', rate: 5, popularKeywords: ['rice', 'basmati', 'chawal'] },

  // FOOTWEAR & LEATHER
  { code: '6402', type: 'Goods', chapter: 'Chapter 64', description: 'Footwear with outer soles and uppers of rubber or plastics (MRP up to ₹1,000 per pair)', rate: 12, popularKeywords: ['shoes', 'slippers', 'sandals', 'crocs', 'footwear'] },
  { code: '6403', type: 'Goods', chapter: 'Chapter 64', description: 'Footwear with outer soles of rubber, plastics, leather and uppers of leather', rate: 18, popularKeywords: ['leather shoes', 'formal shoes', 'boots'] },
  { code: '4202', type: 'Goods', chapter: 'Chapter 42', description: 'Trunks, suit-cases, vanity-cases, executive-cases, brief-cases, school satchels, wallet, purse', rate: 18, popularKeywords: ['bag', 'wallet', 'purse', 'leather bag', 'backpack'] },

  // ELECTRONICS, COMPUTERS & MOBILES
  { code: '8517', type: 'Goods', chapter: 'Chapter 85', description: 'Telephone sets, smartphones, cellular networks, routers and network adapters', rate: 18, popularKeywords: ['smartphone', 'mobile', 'phone', 'router', 'modem'] },
  { code: '8471', type: 'Goods', chapter: 'Chapter 84', description: 'Automatic data processing machines (Laptops, Desktops, Servers, Microprocessors)', rate: 18, popularKeywords: ['laptop', 'computer', 'desktop', 'pc', 'server'] },
  { code: '8528', type: 'Goods', chapter: 'Chapter 85', description: 'Monitors, projectors, television reception apparatus (LED/LCD TVs)', rate: 18, popularKeywords: ['tv', 'television', 'monitor', 'screen'] },
  { code: '8504', type: 'Goods', chapter: 'Chapter 85', description: 'Electrical transformers, static converters (e.g. mobile chargers, adapters, UPS)', rate: 18, popularKeywords: ['charger', 'adapter', 'power bank', 'ups'] },
  { code: '8518', type: 'Goods', chapter: 'Chapter 85', description: 'Microphones, loudspeakers, headphones, earphones and sound amplifier sets', rate: 18, popularKeywords: ['headphones', 'earbuds', 'mic', 'speaker', 'bluetooth'] },

  // PHARMACEUTICALS & HEALTHCARE
  { code: '3004', type: 'Goods', chapter: 'Chapter 30', description: 'Medicaments consisting of mixed or unmixed products for therapeutic or prophylactic uses', rate: 12, popularKeywords: ['medicine', 'tablet', 'syrup', 'pharma', 'drugs'] },
  { code: '3003', type: 'Goods', chapter: 'Chapter 30', description: 'Ayurvedic, Unani, Siddha, Homoeopathic or Bio-chemic medicaments for retail sale', rate: 12, popularKeywords: ['ayurvedic', 'unani', 'herbal', 'homeopathy'] },
  { code: '9018', type: 'Goods', chapter: 'Chapter 90', description: 'Instruments and appliances used in medical, surgical, dental or veterinary sciences', rate: 12, popularKeywords: ['medical equipment', 'bp monitor', 'surgical', 'dental'] },

  // STATIONERY, PRINTING & BOOKS
  { code: '4901', type: 'Goods', chapter: 'Chapter 49', description: 'Printed books, brochures, leaflets and similar printed matter (including Quran, religious books)', rate: 0, popularKeywords: ['books', 'quran', 'reading books', 'religious books'] },
  { code: '4820', type: 'Goods', chapter: 'Chapter 48', description: 'Registers, account books, note books, order books, receipt books, letter pads, diaries', rate: 18, popularKeywords: ['notebook', 'diary', 'stationery', 'register'] },

  // SERVICES (SAC CODES - 99 Series)
  { code: '9982', type: 'Services', chapter: 'Heading 9982', description: 'Legal and accounting, auditing and bookkeeping services; tax consultancy services', rate: 18, popularKeywords: ['ca services', 'accounting', 'auditing', 'tax consultancy', 'gst filing', 'legal'] },
  { code: '9983', type: 'Services', chapter: 'Heading 9983', description: 'Other professional, technical and business services (Software development, IT consulting, architecture)', rate: 18, popularKeywords: ['software', 'it services', 'consulting', 'web development', 'saas'] },
  { code: '9984', type: 'Services', chapter: 'Heading 9984', description: 'Telecommunications, broadcasting and information supply services (Cloud hosting, server hosting, ISP)', rate: 18, popularKeywords: ['hosting', 'cloud', 'broadband', 'telecom'] },
  { code: '9965', type: 'Services', chapter: 'Heading 9965', description: 'Goods transport services (GTA by road, rail, air or water logistics)', rate: 5, popularKeywords: ['transport', 'gta', 'courier', 'freight', 'logistics'] },
  { code: '9967', type: 'Services', chapter: 'Heading 9967', description: 'Supporting services in transport (Warehousing, storage, cargo handling)', rate: 18, popularKeywords: ['warehouse', 'storage', 'fulfillment', 'cargo'] },
  { code: '9963', type: 'Services', chapter: 'Heading 9963', description: 'Accommodation, food and beverage services (Hotel rooms under ₹7,500/night: 12%; Restaurant food: 5%)', rate: 5, popularKeywords: ['restaurant', 'hotel', 'food service', 'cafe'] },
  { code: '9954', type: 'Services', chapter: 'Heading 9954', description: 'Construction services (Commercial & residential buildings, civil engineering)', rate: 18, popularKeywords: ['construction', 'civil work', 'builder', 'contractor'] },
  { code: '9985', type: 'Services', chapter: 'Heading 9985', description: 'Support services (Security services, cleaning services, office administrative services)', rate: 18, popularKeywords: ['security', 'housekeeping', 'staffing', 'hr services'] },
  { code: '9992', type: 'Services', chapter: 'Heading 9992', description: 'Education services provided by recognized schools, colleges and institutes (Exempt)', rate: 0, popularKeywords: ['education', 'school', 'college', 'tuition'] },
  { code: '9993', type: 'Services', chapter: 'Heading 9993', description: 'Human health and social care services (Hospital clinical care: Exempt)', rate: 0, popularKeywords: ['hospital', 'clinic', 'doctor', 'healthcare'] }
];

export default function HsnSearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'All' | 'Goods' | 'Services'>('All');
  const [rateFilter, setRateFilter] = useState<string>('All');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Filtered dataset
  const filteredData = useMemo(() => {
    return HSN_SAC_DATA.filter((item) => {
      // Type filter
      if (typeFilter !== 'All' && item.type !== typeFilter) return false;

      // Rate filter
      if (rateFilter !== 'All' && item.rate !== Number(rateFilter)) return false;

      // Search term
      if (!searchTerm.trim()) return true;
      const term = searchTerm.toLowerCase().trim();

      const matchesCode = item.code.toLowerCase().includes(term);
      const matchesDesc = item.description.toLowerCase().includes(term);
      const matchesChapter = item.chapter.toLowerCase().includes(term);
      const matchesKeywords = item.popularKeywords?.some((k) => k.toLowerCase().includes(term));

      return matchesCode || matchesDesc || matchesChapter || matchesKeywords;
    });
  }, [searchTerm, typeFilter, rateFilter]);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 1800);
  };

  const popularSearches = [
    'Attar',
    'Thobe',
    'Clothing',
    'Accounting 9982',
    'Software 9983',
    'Dates',
    'Mobile 8517',
    'Honey',
    'Transport 9965'
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Hero Banner */}
      <div className="bg-[#0B2545] text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#C9933B_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="flex items-center space-x-2 text-sm text-slate-400 mb-4">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/tools" className="hover:text-white transition-colors">Tools</Link>
            <span>/</span>
            <span className="text-[#C9933B] font-medium">HSN &amp; SAC Code Search</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="inline-flex items-center space-x-2 bg-emerald-500/20 text-emerald-400 text-xs px-3 py-1 rounded-full font-semibold border border-emerald-500/30 mb-3">
                <Hash className="w-4 h-4" />
                <span>OFFICIAL GST CLASSIFICATION DIRECTORY</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                HSN &amp; SAC Code Search Tool
              </h1>
              <p className="mt-2 text-base text-slate-300 max-w-2xl">
                Find exact 2, 4, 6 or 8-digit HSN codes for goods and 99-series SAC codes for services. Check applicable GST tax slabs (0%, 5%, 12%, 18%, 28%) and copy codes with 1 click.
              </p>
            </div>

            <Link
              href="/tools/gstin-search"
              className="inline-flex items-center gap-2 bg-[#C9933B] hover:bg-[#b07e2c] text-white px-5 py-3 rounded-xl font-bold shadow-lg shadow-[#C9933B]/20 transition-all hover:scale-105 active:scale-95 shrink-0"
            >
              <span>Verify GSTIN Instead</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Search Input */}
          <div className="mt-8">
            <div className="relative flex items-center max-w-3xl">
              <Search className="absolute left-4 w-6 h-6 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by Code or Keyword (e.g. 3303, Attar, 6105, Thobe, Accounting, Laptop)..."
                className="w-full pl-13 pr-10 py-4 bg-white/10 border-2 border-slate-700/80 rounded-2xl text-lg text-white placeholder-slate-400 focus:outline-none focus:border-[#C9933B] focus:bg-white/15 transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 text-xs font-semibold text-slate-400 hover:text-white bg-white/10 px-2 py-1 rounded-md"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Popular Searches */}
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-400 font-medium">Popular Searches:</span>
              {popularSearches.map((keyword) => (
                <button
                  key={keyword}
                  onClick={() => setSearchTerm(keyword.split(' ')[0])}
                  className="bg-white/10 hover:bg-white/20 text-slate-200 px-3 py-1 rounded-lg border border-slate-700 transition-colors"
                >
                  {keyword}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters Bar */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm mb-6 flex flex-wrap items-center justify-between gap-4">
          {/* Type Toggle */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Type:</span>
            <div className="inline-flex bg-slate-100 p-1 rounded-xl border border-slate-200">
              {(['All', 'Goods', 'Services'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    typeFilter === t
                      ? 'bg-[#0B2545] text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t === 'Goods' ? 'Goods (HSN)' : t === 'Services' ? 'Services (SAC)' : 'All Codes'}
                </button>
              ))}
            </div>
          </div>

          {/* Rate Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">GST Rate:</span>
            <div className="inline-flex bg-slate-100 p-1 rounded-xl border border-slate-200">
              {['All', '0', '5', '12', '18', '28'].map((r) => (
                <button
                  key={r}
                  onClick={() => setRateFilter(r)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    rateFilter === r
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {r === 'All' ? 'All Rates' : `${r}%`}
                </button>
              ))}
            </div>
          </div>

          <div className="text-xs text-slate-500 font-semibold">
            Found <span className="text-[#0B2545] font-black">{filteredData.length}</span> matching codes
          </div>
        </div>

        {/* Results Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase">
                <tr>
                  <th className="py-3.5 px-6">HSN / SAC Code</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-6">Description</th>
                  <th className="py-3.5 px-4 text-center">GST Rate</th>
                  <th className="py-3.5 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredData.length > 0 ? (
                  filteredData.map((item) => {
                    const isCopied = copiedCode === item.code;
                    return (
                      <tr key={item.code} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-4 px-6 font-mono font-black text-slate-900 text-base">
                          <div className="flex items-center gap-2">
                            <span className="bg-slate-100 text-slate-900 px-2.5 py-1 rounded-lg border border-slate-200">
                              {item.code}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400 font-sans font-medium block mt-1">
                            {item.chapter}
                          </span>
                        </td>

                        <td className="py-4 px-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold ${
                              item.type === 'Goods'
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : 'bg-purple-50 text-purple-700 border border-purple-200'
                            }`}
                          >
                            {item.type}
                          </span>
                        </td>

                        <td className="py-4 px-6 max-w-md">
                          <p className="font-semibold text-slate-800 leading-relaxed text-sm">
                            {item.description}
                          </p>
                          {item.popularKeywords && (
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              {item.popularKeywords.map((k) => (
                                <span
                                  key={k}
                                  className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-medium"
                                >
                                  #{k}
                                </span>
                              ))}
                            </div>
                          )}
                        </td>

                        <td className="py-4 px-4 text-center">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-black ${
                              item.rate === 0
                                ? 'bg-slate-100 text-slate-600 border border-slate-300'
                                : item.rate <= 5
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : item.rate <= 12
                                ? 'bg-blue-100 text-blue-800 border border-blue-300'
                                : item.rate <= 18
                                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                : 'bg-rose-100 text-rose-800 border border-rose-300'
                            }`}
                          >
                            {item.rate}% GST
                          </span>
                        </td>

                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => handleCopy(item.code)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-[#0B2545] text-slate-700 hover:text-white rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95"
                          >
                            {isCopied ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="text-emerald-400">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-500">
                      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
                        <Search className="w-6 h-6" />
                      </div>
                      <p className="font-bold text-slate-700">No matching HSN or SAC code found</p>
                      <p className="text-xs text-slate-400 mt-1">Try searching with a broader product name or category</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom Helper Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">E-Commerce GST Return Filing</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Selling on Amazon, Flipkart or Meesho? Convert your monthly sales and return sheets into Government GSTR-1 Table 7 B2CS offline JSON automatically.
              </p>
              <Link
                href="/tools/ecommerce-gst-converter"
                className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 mt-3"
              >
                <span>Launch E-Commerce Converter</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">GST Number &amp; Filing Verification</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Check 15-digit GSTIN active status, legal name, trade name, principal business address, and download the official A4 Verification PDF.
              </p>
              <Link
                href="/tools/gstin-search"
                className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-800 mt-3"
              >
                <span>Verify GSTIN &amp; Download PDF</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

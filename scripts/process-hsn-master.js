const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

// Path to official government Excel file
const excelPath = path.join(__dirname, '..', 'HSN_SAC.xlsx');
const outputPath = path.join(__dirname, '..', 'data', 'hsn_sac_master.json');

console.log('Reading official HSN_SAC.xlsx file from:', excelPath);

if (!fs.existsSync(excelPath)) {
  console.error('ERROR: HSN_SAC.xlsx file not found at:', excelPath);
  process.exit(1);
}

const workbook = XLSX.readFile(excelPath);

// 1. Process Goods (HSN_MSTR)
const hsnSheet = workbook.Sheets['HSN_MSTR'];
const rawHsnRows = XLSX.utils.sheet_to_json(hsnSheet);
console.log(`Found ${rawHsnRows.length} raw HSN goods records.`);

// Chapter-based default rate mapping for Indian GST
function getEstimatedGoodsRate(code, description) {
  const desc = description.toLowerCase();
  const ch = code.substring(0, 2);

  // Specific common items overrides
  if (desc.includes('unstitched') || desc.includes('cotton yarn') || desc.includes('fabric')) return 5;
  if (desc.includes('shirt') || desc.includes('clothing') || desc.includes('t-shirt') || desc.includes('kurta')) return 5;
  if (desc.includes('suit') || desc.includes('blazer') || desc.includes('jacket') || desc.includes('dress')) return 12;
  if (desc.includes('attar') || desc.includes('perfume') || desc.includes('cosmetic') || desc.includes('skincare')) return 18;
  if (desc.includes('tobacco') || desc.includes('pan masala') || desc.includes('aerated water') || desc.includes('automobile')) return 28;
  if (desc.includes('solar') || desc.includes('fertilizer') || desc.includes('tea') || desc.includes('coffee') || desc.includes('spices') || desc.includes('honey')) return 5;
  if (desc.includes('fresh') || desc.includes('live animal') || desc.includes('fresh fruit') || desc.includes('vegetable') || desc.includes('salt')) return 0;
  if (desc.includes('book') || desc.includes('printed') || desc.includes('newspaper')) return 0;

  // Chapter defaults
  const chNum = parseInt(ch, 10);
  if (chNum >= 1 && chNum <= 5) return 0; // Live animals, meat, fish, dairy (unbranded)
  if (chNum >= 6 && chNum <= 14) return 5; // Plants, vegetables, fruits, tea, spices, cereals
  if (chNum >= 15 && chNum <= 24) return 5; // Fats, oils, prepared foodstuffs, sugar
  if (chNum >= 25 && chNum <= 27) return 5; // Salt, minerals, fuels
  if (chNum >= 28 && chNum <= 38) return 18; // Chemicals, pharma, cosmetics
  if (chNum >= 39 && chNum <= 40) return 18; // Plastics and rubber
  if (chNum >= 41 && chNum <= 43) return 12; // Leather, raw hides
  if (chNum >= 44 && chNum <= 49) return 12; // Wood, paper, printing
  if (chNum >= 50 && chNum <= 63) return 5; // Textiles and apparel
  if (chNum >= 64 && chNum <= 67) return 12; // Footwear, headgear
  if (chNum >= 68 && chNum <= 71) return 18; // Stone, ceramics, glass, jewellery
  if (chNum >= 72 && chNum <= 83) return 18; // Base metals and iron/steel
  if (chNum >= 84 && chNum <= 85) return 18; // Nuclear reactors, machinery, electrical equipment
  if (chNum >= 86 && chNum <= 89) return 18; // Vehicles, railway, aircraft, ships
  if (chNum >= 90 && chNum <= 97) return 18; // Optical, medical instruments, furniture, toys

  return 18; // Default standard rate
}

function getEstimatedServicesRate(code, description) {
  const desc = description.toLowerCase();
  const c = String(code);

  if (desc.includes('healthcare') || desc.includes('hospital') || desc.includes('education') || desc.includes('school')) return 0;
  if (desc.includes('transport of goods') || desc.includes('gta') || desc.includes('restaurant')) return 5;
  if (desc.includes('hotel') || desc.includes('accommodation')) return 12;
  if (c.startsWith('9982') || c.startsWith('9983') || c.startsWith('9984')) return 18; // Legal/CA/Accounting, IT/Software, Telecom
  if (c.startsWith('9954')) return 18; // Construction
  if (c.startsWith('9965')) return 5; // Freight transport
  if (c.startsWith('9967')) return 18; // Storage/warehousing
  if (desc.includes('gambling') || desc.includes('casino') || desc.includes('betting')) return 28;

  return 18; // Standard services rate
}

const goods = rawHsnRows.map(row => {
  const code = String(row.HSN_CD || '').trim();
  const desc = String(row.HSN_Description || '').trim();
  const ch = code.length >= 2 ? code.substring(0, 2) : '00';
  return {
    c: code,
    d: desc,
    t: 'Goods',
    ch: `Chapter ${ch}`,
    r: getEstimatedGoodsRate(code, desc)
  };
});

// 2. Process Services (SAC_MSTR)
const sacSheet = workbook.Sheets['SAC_MSTR'];
const rawSacRows = XLSX.utils.sheet_to_json(sacSheet);
console.log(`Found ${rawSacRows.length} raw SAC services records.`);

const services = rawSacRows.map(row => {
  const code = String(row.SAC_CD || '').trim();
  const desc = String(row.SAC_Description || '').trim();
  const heading = code.length >= 4 ? code.substring(0, 4) : code;
  return {
    c: code,
    d: desc,
    t: 'Services',
    ch: `Heading ${heading}`,
    r: getEstimatedServicesRate(code, desc)
  };
});

const masterList = [...goods, ...services];
console.log(`Total master records: ${masterList.length} (Goods: ${goods.length}, Services: ${services.length})`);

// Ensure output directory exists
const outDir = path.dirname(outputPath);
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

fs.writeFileSync(outputPath, JSON.stringify(masterList));
console.log(`Successfully wrote ${masterList.length} records to ${outputPath}`);
console.log(`File size: ${(fs.statSync(outputPath).size / 1024 / 1024).toFixed(2)} MB`);

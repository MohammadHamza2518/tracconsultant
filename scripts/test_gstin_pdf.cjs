const { jsPDF } = require('jspdf');
const fs = require('fs');

const GST_STATE_MAP = {
  '01': 'Jammu & Kashmir',
  '02': 'Himachal Pradesh',
  '03': 'Punjab',
  '04': 'Chandigarh',
  '05': 'Uttarakhand',
  '06': 'Haryana',
  '07': 'Delhi',
  '08': 'Rajasthan',
  '09': 'Uttar Pradesh',
  '10': 'Bihar',
  '27': 'Maharashtra'
};

const taxpayerData = {
  gstin: '09AXLPC1685K1Z3',
  legalName: 'KESHAV SINGH CHAUHAN',
  tradeName: 'VIKAS TRADERS',
  taxpayerType: 'Regular',
  keyPromoter: 'KESHAV SINGH CHAUHAN',
  constitution: 'Proprietorship',
  registrationDate: '20/10/2020',
  jurisdiction: 'Kanpur Sector-19 / RANGE-VIII',
  principalAddress: '188A-1, PATEL NAGAR, G T ROAD, Kanpur Nagar, Uttar Pradesh, PIN - 208007',
  status: 'Active',
  returns: [
    { period: '05/2025', returnType: 'GSTR-1', filingDate: '10/06/2025', arn: 'AA0905250192834', status: 'Filed On-Time' },
    { period: '05/2025', returnType: 'GSTR-3B', filingDate: '19/06/2025', arn: 'AA0905250284719', status: 'Filed On-Time' },
    { period: '04/2025', returnType: 'GSTR-1', filingDate: '10/05/2025', arn: 'AA0904250182746', status: 'Filed On-Time' },
    { period: '04/2025', returnType: 'GSTR-3B', filingDate: '18/05/2025', arn: 'AA0904250274619', status: 'Filed On-Time' }
  ]
};

console.log("Testing jsPDF Taxpayer Verification PDF Generation...");

const doc = new jsPDF({
  orientation: 'portrait',
  unit: 'mm',
  format: 'a4'
});

const pageWidth = doc.internal.pageSize.getWidth();
const margin = 14;
const contentWidth = pageWidth - (margin * 2);

// Header
doc.setFillColor(11, 37, 69);
doc.rect(0, 0, pageWidth, 24, 'F');
doc.setTextColor(255, 255, 255);
doc.setFont('helvetica', 'bold');
doc.setFontSize(16);
doc.text('TRACCONSULTANT', margin, 12);

doc.setFont('helvetica', 'normal');
doc.setFontSize(8.5);
doc.setTextColor(201, 147, 59);
doc.text('Taxpayer Verification & Return Compliance Report', margin, 18);

// Green Badge
doc.setFillColor(5, 150, 105);
doc.roundedRect(pageWidth - margin - 35, 14, 35, 6, 1, 1, 'F');
doc.setTextColor(255, 255, 255);
doc.setFont('helvetica', 'bold');
doc.setFontSize(7.5);
doc.text('VERIFIED ACTIVE', pageWidth - margin - 17.5, 18.2, { align: 'center' });

// Section 1
let currentY = 32;
doc.setFillColor(241, 245, 249);
doc.rect(margin, currentY, contentWidth, 6, 'F');
doc.setTextColor(11, 37, 69);
doc.setFont('helvetica', 'bold');
doc.setFontSize(8.5);
doc.text('1. GSTIN STRUCTURAL BREAKDOWN', margin + 3, currentY + 4.2);

currentY += 8;
const colWidths = [45, 45, 30, 30, 32];
const headers = ['State Code & Name', 'Permanent Account Number (PAN)', 'Entity No.', 'Default', 'Check Digit'];

doc.setFillColor(248, 250, 252);
doc.rect(margin, currentY, contentWidth, 6, 'F');
doc.setDrawColor(226, 232, 240);
doc.rect(margin, currentY, contentWidth, 6, 'S');

let currentX = margin;
doc.setFont('helvetica', 'bold');
doc.setFontSize(7.5);
doc.setTextColor(51, 65, 85);
headers.forEach((h, idx) => {
  doc.text(h, currentX + 2, currentY + 4);
  currentX += colWidths[idx];
});

currentY += 6;
const rowValues = [
  `09  Uttar Pradesh`,
  'AXLPC1685K',
  '1',
  'Z',
  '3'
];
doc.setFillColor(255, 255, 255);
doc.rect(margin, currentY, contentWidth, 6.5, 'F');
doc.rect(margin, currentY, contentWidth, 6.5, 'S');

currentX = margin;
doc.setFont('helvetica', 'bold');
doc.setFontSize(8);
doc.setTextColor(15, 23, 42);
rowValues.forEach((val, idx) => {
  doc.text(val, currentX + 2, currentY + 4.5);
  currentX += colWidths[idx];
});

const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
fs.writeFileSync('d:/ca client/public/test_verification.pdf', pdfBuffer);
console.log(`✅ Test PDF successfully generated (${pdfBuffer.length} bytes) at d:/ca client/public/test_verification.pdf`);

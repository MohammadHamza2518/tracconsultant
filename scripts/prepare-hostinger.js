const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const standaloneDir = path.join(rootDir, '.next', 'standalone');
const publicSrc = path.join(rootDir, 'public');
const publicDest = path.join(standaloneDir, 'public');
const staticSrc = path.join(rootDir, '.next', 'static');
const staticDest = path.join(standaloneDir, '.next', 'static');
const dataSrc = path.join(rootDir, 'data');
const dataDest = path.join(standaloneDir, 'data');

console.log('🚀 Preparing Hostinger Standalone Deployment Bundle...');

if (!fs.existsSync(standaloneDir)) {
  console.error('❌ Error: .next/standalone folder not found. Please run "npm run build" first.');
  process.exit(1);
}

// 1. Copy public folder if exists
if (fs.existsSync(publicSrc)) {
  console.log('📦 Copying public/ assets to .next/standalone/public...');
  fs.cpSync(publicSrc, publicDest, { recursive: true });
}

// 2. Copy .next/static to .next/standalone/.next/static
if (fs.existsSync(staticSrc)) {
  console.log('🎨 Copying .next/static assets to .next/standalone/.next/static...');
  fs.cpSync(staticSrc, staticDest, { recursive: true });
}

// 3. Ensure data folder exists in standalone
if (fs.existsSync(dataSrc)) {
  console.log('💾 Copying data/ directory to .next/standalone/data...');
  fs.cpSync(dataSrc, dataDest, { recursive: true });
}

// 4. Create an env file template for production
const rootEnvPath = path.join(rootDir, '.env');
const envDest = path.join(standaloneDir, '.env');

let envContent = `NODE_ENV=production
PORT=3000
HOSTNAME=0.0.0.0
NEXT_PUBLIC_SITE_URL=https://tracconsultant.com
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_Tdyj5KRoPhN4Ao
RAZORPAY_KEY_ID=rzp_test_Tdyj5KRoPhN4Ao
RAZORPAY_KEY_SECRET=pSGKjdOMdizDHuy99nj9q3b7
`;

if (fs.existsSync(rootEnvPath)) {
  try {
    envContent = fs.readFileSync(rootEnvPath, 'utf-8');
  } catch {}
}

fs.writeFileSync(envDest, envContent, 'utf-8');
console.log('⚙️ Synchronized production .env for standalone server.');

console.log('\n✅ Standalone deployment folder is 100% READY at:');
console.log('👉 ' + standaloneDir);
console.log('\nYou can zip the contents of ".next/standalone" and upload directly to Hostinger!\n');

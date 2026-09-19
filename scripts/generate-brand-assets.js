const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const rootDir = path.resolve(__dirname, '..');
const uploadedLogoPath = 'C:/Users/moham/.gemini/antigravity/brain/f24e5a54-5c26-4e5f-af16-ad97ba8d855b/.user_uploaded/media_1789810113108.png';
const publicDir = path.join(rootDir, 'public');
const appDir = path.join(rootDir, 'app');

async function generateBrandAssets() {
  console.log('🎨 Processing Official Client Logo into Website Brand Assets...');

  if (!fs.existsSync(uploadedLogoPath)) {
    console.error('❌ Uploaded logo file not found at:', uploadedLogoPath);
    process.exit(1);
  }

  // 1. Extract the circular seal (minX: 8, minY: 0, width: 312, height: 311)
  const extracted = await sharp(uploadedLogoPath)
    .extract({ left: 8, top: 0, width: 312, height: 311 })
    .resize(512, 512, { fit: 'fill' })
    .toBuffer();

  // 2. Create smooth circular mask to make outer corners 100% transparent
  const circleMask = Buffer.from(
    `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <circle cx="256" cy="256" r="254" fill="white" />
    </svg>`
  );

  const circularLogoBuffer = await sharp(extracted)
    .composite([{ input: circleMask, blend: 'dest-in' }])
    .png()
    .toBuffer();

  // Save primary transparent circular logo
  await sharp(circularLogoBuffer).toFile(path.join(publicDir, 'logo.png'));
  await sharp(circularLogoBuffer).toFile(path.join(publicDir, 'logo-circle.png'));
  console.log('✅ Generated: public/logo.png & public/logo-circle.png (512x512)');

  // 3. Generate square badge (padded inside square card with subtle border)
  const squareBadge = await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    }
  })
    .composite([
      {
        input: await sharp(circularLogoBuffer).resize(470, 470).toBuffer(),
        top: 21,
        left: 21
      }
    ])
    .png()
    .toFile(path.join(publicDir, 'logo-square.png'));
  console.log('✅ Generated: public/logo-square.png');

  // 4. Generate Favicon & App Icons
  // app/icon.png (Next.js automatically uses this as the website favicon!)
  await sharp(circularLogoBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(appDir, 'icon.png'));
  console.log('✅ Generated: app/icon.png (512x512 Next.js Root Tab Icon)');

  // app/apple-icon.png (iOS Bookmark)
  await sharp(circularLogoBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.join(appDir, 'apple-icon.png'));
  console.log('✅ Generated: app/apple-icon.png (180x180 Apple Touch Icon)');

  // public/icon.png (192x192 PWA Icon)
  await sharp(circularLogoBuffer)
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'icon.png'));

  // public/favicon.ico & app/favicon.ico (32x32 PNG-based icon)
  const favicon32 = await sharp(circularLogoBuffer)
    .resize(32, 32)
    .png()
    .toBuffer();
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), favicon32);
  fs.writeFileSync(path.join(appDir, 'favicon.ico'), favicon32);
  console.log('✅ Generated: public/favicon.ico & app/favicon.ico');

  // 5. Generate Horizontal Brand Banner for Navbar & Footer (logo-banner.png)
  // Dimensions: 600 width x 140 height
  // Left: 120x120 circle logo. Right: Styled typography matching the client's seal
  const logo120 = await sharp(circularLogoBuffer).resize(120, 120).toBuffer();

  // Dark background version (for Dark Navbar, Footer, Hero)
  const darkBannerSvg = Buffer.from(
    `<svg width="600" height="140" viewBox="0 0 600 140" xmlns="http://www.w3.org/2000/svg">
      <!-- "TRAC" with "A" in gold -->
      <text x="145" y="70" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" font-weight="900" font-size="52" fill="#FFFFFF" letter-spacing="2">TR<tspan fill="#C9933B">A</tspan>C</text>
      <!-- "CONSULTANT" in gold tracked -->
      <text x="147" y="100" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" font-weight="700" font-size="21" fill="#C9933B" letter-spacing="6">CONSULTANT</text>
      <!-- Bottom motto -->
      <text x="148" y="122" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" font-weight="600" font-size="11" fill="#94A3B8" letter-spacing="2.5">TAX • REGULATORY • ADVISORY • COMPLIANCE</text>
    </svg>`
  );

  await sharp({
    create: {
      width: 600,
      height: 140,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    }
  })
    .composite([
      { input: logo120, top: 10, left: 10 },
      { input: darkBannerSvg, top: 0, left: 0 }
    ])
    .png()
    .toFile(path.join(publicDir, 'logo-banner.png'));
  console.log('✅ Generated: public/logo-banner.png (Dark background variant)');

  // Light background version (for white pages / receipts / light navbars)
  const lightBannerSvg = Buffer.from(
    `<svg width="600" height="140" viewBox="0 0 600 140" xmlns="http://www.w3.org/2000/svg">
      <!-- "TRAC" with "A" in gold -->
      <text x="145" y="70" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" font-weight="900" font-size="52" fill="#0B2545" letter-spacing="2">TR<tspan fill="#C9933B">A</tspan>C</text>
      <!-- "CONSULTANT" in gold tracked -->
      <text x="147" y="100" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" font-weight="700" font-size="21" fill="#C9933B" letter-spacing="6">CONSULTANT</text>
      <!-- Bottom motto -->
      <text x="148" y="122" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" font-weight="600" font-size="11" fill="#64748B" letter-spacing="2.5">TAX • REGULATORY • ADVISORY • COMPLIANCE</text>
    </svg>`
  );

  await sharp({
    create: {
      width: 600,
      height: 140,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    }
  })
    .composite([
      { input: logo120, top: 10, left: 10 },
      { input: lightBannerSvg, top: 0, left: 0 }
    ])
    .png()
    .toFile(path.join(publicDir, 'logo-banner-light.png'));
  console.log('✅ Generated: public/logo-banner-light.png (Light background variant)');

  console.log('\n🎉 ALL BRAND ASSETS SUCCESSFULLY GENERATED FROM CLIENT LOGO!');
}

generateBrandAssets().catch(err => {
  console.error('Error generating brand assets:', err);
  process.exit(1);
});

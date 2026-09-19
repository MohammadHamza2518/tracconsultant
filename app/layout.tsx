import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { AuthProvider } from "@/context/AuthContext";
import { ConfigProvider } from "@/context/ConfigContext";
import AuthModal from "@/components/AuthModal";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://tracconsultant.com'),
  title: {
    default: "Tracconsultant | India's Premier CA Tax Filing, Notice Assistance & Compliance",
    template: "%s | Tracconsultant"
  },
  description: "India's trusted CA-assisted tax super-app. File ITR, GST, Company Registration, 143(1) Notice Scrutiny, and access 10+ professional CA Automation Tools. Max Refund Guarantee & 100% Notice Protection. Call +91 7275922162 / 8052171196.",
  alternates: {
    canonical: 'https://tracconsultant.com',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: "/logo.png", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" }
    ],
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "Tracconsultant | Tax • Regulatory • Advisory • Compliance",
    description: "India's premier CA-assisted tax filing, notice scrutiny, and business compliance platform. Maximum Tax Refund & Notice Protection.",
    url: "https://tracconsultant.com",
    siteName: "Tracconsultant",
    locale: "en_IN",
    type: "website",
    images: [{ url: "/logo.png", width: 512, height: 512, alt: "Tracconsultant Official Logo" }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Tracconsultant | CA-Assisted Tax Filing & Compliance Platform",
    description: "File ITR, GST, Company Incorporation, and solve Tax Notices with Senior CAs.",
    images: ["/logo.png"],
  },
  keywords: [
    "Income Tax Filing India",
    "ITR Filing Online CA Assisted",
    "Tax Notice Assistance 143(1)",
    "GST Registration and Return Filing",
    "Private Limited Company Registration",
    "Chartered Accountant near me",
    "Tracconsultant",
    "Best Tax Filing App India",
    "TaxBuddy alternative",
    "Tax & Compliance Suite",
    "GSTR-2A Reconciliation Online"
  ],
  verification: {
    google: "hOYQSCdhyz53Bs5FZfHUZ-3zX8S0F8TpKEJJTOmXhaM"
  }
};

const jsonLdSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "AccountingService",
      "@id": "https://tracconsultant.com/#organization",
      "name": "Tracconsultant",
      "url": "https://tracconsultant.com",
      "logo": "https://tracconsultant.com/logo.png",
      "image": "https://tracconsultant.com/logo.png",
      "description": "India's premier CA-assisted tax filing, notice assistance, GST, and corporate compliance platform.",
      "telephone": "+91-7275922162",
      "priceRange": "₹₹",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Kalyanpur",
        "addressLocality": "Kanpur",
        "addressRegion": "Uttar Pradesh",
        "postalCode": "208017",
        "addressCountry": "IN"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 26.4950,
        "longitude": 80.2644
      },
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
          "opens": "09:00",
          "closes": "20:00"
        }
      ],
      "areaServed": "IN",
      "knowsAbout": [
        "Income Tax Return Filing",
        "GST Registration & Returns",
        "Company Incorporation",
        "Income Tax Notice Assistance",
        "Financial Advisory",
        "TDS Returns"
      ]
    },
    {
      "@type": "WebSite",
      "@id": "https://tracconsultant.com/#website",
      "url": "https://tracconsultant.com",
      "name": "Tracconsultant",
      "publisher": {
        "@id": "https://tracconsultant.com/#organization"
      }
    }
  ]
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <head>
        <meta name="google-site-verification" content="hOYQSCdhyz53Bs5FZfHUZ-3zX8S0F8TpKEJJTOmXhaM" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-slate-50 text-slate-900 selection:bg-emerald-500 selection:text-white">
        <ConfigProvider>
          <AuthProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <WhatsAppFloat />
            <AuthModal />
          </AuthProvider>
        </ConfigProvider>
      </body>
    </html>
  );
}

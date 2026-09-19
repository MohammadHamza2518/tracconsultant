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
  title: "Tracconsultant | India's Premier CA-Assisted Tax Filing, Compliance & FinTech Platform",
  description: "Superior to TaxBuddy. File ITR, GST, Company Incorporation, handle Tax Notices, and access professional Tax & Compliance digital suite. Max Refund Guarantee & 100% Notice Protection. Call +91 7275922162 / 8052171196.",
  icons: {
    icon: [
      { url: "/logo.png", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" }
    ],
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "Tracconsultant | Tax • Regulatory • Advisory • Compliance",
    description: "India's premier CA-assisted tax filing, notice scrutiny, and business compliance platform.",
    images: [{ url: "/logo.png", width: 512, height: 512, alt: "Tracconsultant Official Logo" }]
  },
  keywords: [
    "Income Tax Filing India",
    "ITR Filing Online",
    "Tax Notice Assistance 143(1)",
    "GST Registration and Returns",
    "Company Registration Pvt Ltd",
    "Chartered Accountant near me",
    "Tracconsultant",
    "TaxBuddy alternative",
    "Tax & Compliance Suite",
    "GSTR-2A Reconciliation"
  ]
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
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

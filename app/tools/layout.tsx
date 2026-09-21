import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Professional CA Automation Tools & Utilities',
  description: 'Access professional CA automation tools: HRA Exemption Tool, GSTR-2A Cleaner & Reconciliation, Balance Sheet Generator, JSON to Computation, and PDF Redactor.',
  alternates: {
    canonical: 'https://tracconsultant.com/tools',
  },
  openGraph: {
    title: 'Professional CA Automation Tools | Tracconsultant',
    description: 'Instant Tax Automation Tools, GSTR-2A Reconciliation, and PDF redaction tools for Indian CAs and taxpayers.',
    url: 'https://tracconsultant.com/tools',
  },
};

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

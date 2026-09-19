import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CA Automation Tools & Free Tax Calculators',
  description: 'Access professional CA automation tools: HRA Exemption Calculator, GSTR-2A Cleaner & Reconciliation, Balance Sheet Generator, JSON to Computation, and PDF Redactor.',
  alternates: {
    canonical: 'https://tracconsultant.com/tools',
  },
  openGraph: {
    title: 'CA Automation Tools & Calculators | Tracconsultant',
    description: 'Instant Tax Calculators, GSTR-2A Reconciliation, and PDF redaction tools for Indian CAs and taxpayers.',
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

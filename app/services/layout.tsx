import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'All CA Services - Income Tax, GST, Company Registration & Legal Advisory',
  description: 'Explore 20+ specialized CA & Legal services offered by Tracconsultant. ITR filing, GST returns, company registration, notice resolution, and corporate compliance.',
  alternates: {
    canonical: 'https://tracconsultant.com/services',
  },
  openGraph: {
    title: 'Chartered Accountant Services Suite | Tracconsultant',
    description: 'Explore 20+ specialized CA & Legal services offered by Tracconsultant.',
    url: 'https://tracconsultant.com/services',
  },
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

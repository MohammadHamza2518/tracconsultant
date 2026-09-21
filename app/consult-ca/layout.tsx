import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ask a Senior CA — Written Legal Opinion & Notice Scrutiny | Tracconsultant',
  description: 'Submit your Income Tax Notice, GST dispute, Capital Gains, or Business query. Guaranteed expert written legal advice from Senior Chartered Accountants within 24–48 hours.',
  alternates: {
    canonical: 'https://tracconsultant.com/consult-ca',
  },
  openGraph: {
    title: 'Ask a Senior CA — Written Legal Opinion | Tracconsultant',
    description: 'Guaranteed written legal advice on Income Tax, Scrutiny Notices, and GST within 24–48 hours from Senior CAs.',
    url: 'https://tracconsultant.com/consult-ca',
  }
};

export default function ConsultCALayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact CA Helpdesk & Tax Experts | Phone, WhatsApp & Email',
  description: 'Get in touch with Tracconsultant senior Chartered Accountants. Direct phone support (+91 7275922162 / 8052171196), instant WhatsApp consultation, or office visits.',
  alternates: {
    canonical: 'https://tracconsultant.com/contact',
  },
  openGraph: {
    title: 'Contact Tracconsultant CA Helpdesk',
    description: 'Direct phone support, instant WhatsApp consultation, or email for tax notices, ITR, and GST filing.',
    url: 'https://tracconsultant.com/contact',
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

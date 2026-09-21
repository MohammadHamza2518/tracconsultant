import React from 'react';
import HsnSearchPage from '../hsn-search/page';

export const metadata = {
  title: 'GST Calculator Online (CBIC Slabs 0%, 5%, 12%, 18%, 28%) | Tracconsultant',
  description: 'Compute CGST, SGST & IGST online with intra-state and inter-state tax split, reverse inclusive calculation, official HSN code lookup, and instant PDF & Excel computation download.'
};

export default function StandaloneGstCalculatorPage() {
  return <HsnSearchPage />;
}

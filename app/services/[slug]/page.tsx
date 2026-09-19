import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { SERVICES_LIST } from '@/lib/data';
import { 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  FileText, 
  ArrowRight, 
  PhoneCall, 
  MessageCircle, 
  ChevronRight, 
  Sparkles 
} from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return SERVICES_LIST.map((service) => ({
    slug: service.slug,
  }));
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = SERVICES_LIST.find((s) => s.slug === slug);

  if (!service) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white py-16 px-4 sm:px-8 border-b border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-5xl mx-auto space-y-4 relative z-10">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold">
            <Link href="/" className="hover:text-white">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/services" className="hover:text-white">Services</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-emerald-400 font-bold">{service.title}</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider border border-emerald-500/30">
            <ShieldCheck className="w-3.5 h-3.5" /> Service #{service.number} • {service.categoryLabel}
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            {service.title}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
            {service.longDesc}
          </p>

          <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-200">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>Turnaround: {service.tat}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-200">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Fees: {service.startingPrice}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-200">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Handled by Senior CA</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-8 pt-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Details Column */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Highlights Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-4">
              <h2 className="text-lg font-bold text-slate-900">Key Deliverables & Guarantees</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {service.highlights.map((h, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-xs font-semibold text-slate-800 leading-snug">{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sub-services if any */}
            {service.subServices && service.subServices.length > 0 && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-4">
                <h2 className="text-lg font-bold text-slate-900">Included Scope of Work</h2>
                <div className="divide-y divide-slate-100 text-xs">
                  {service.subServices.map((sub, idx) => (
                    <div key={idx} className="py-2.5 flex items-center justify-between text-slate-700 font-medium">
                      <span>{idx + 1}. {sub}</span>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                        Covered
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Documents Required */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-4">
              <h2 className="text-lg font-bold text-slate-900">Checklist of Documents Required</h2>
              <p className="text-xs text-slate-500">You can share soft copies via WhatsApp or upload in your client portal.</p>
              
              <ul className="space-y-2.5">
                {service.documentsRequired.map((doc, idx) => (
                  <li key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 flex items-center gap-2.5">
                    <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{doc}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Consultation CTA Column */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-5 sticky top-24">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Professional Engagement</span>
                <h3 className="text-xl font-bold text-slate-900">Book CA Consultation</h3>
                <p className="text-xs text-slate-500">Get assigned to an experienced in-house Chartered Accountant.</p>
              </div>

              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
                <div className="text-[10px] uppercase font-bold text-emerald-700">Estimated Engagement Fee</div>
                <div className="text-2xl font-black text-emerald-900 mt-0.5">{service.startingPrice}</div>
                <div className="text-[11px] text-emerald-700 mt-1">Includes end-to-end filing & documentation</div>
              </div>

              <div className="space-y-2.5">
                <a
                  href={`https://wa.me/917275922162?text=${encodeURIComponent(
                    `Hello Tracconsultant! I want to consult a Chartered Accountant for ${service.title}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Connect on WhatsApp (Instant)</span>
                </a>

                <a
                  href="tel:+917275922162"
                  className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Call CA: +91 7275922162</span>
                </a>
              </div>

              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400 text-center space-y-1">
                <div>🔒 100% Confidential & Secure Data Storage</div>
                <div>ICAI Member CA Supervision Guaranteed</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

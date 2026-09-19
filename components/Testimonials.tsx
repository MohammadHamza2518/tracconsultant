import React from 'react';
import { Star, CheckCircle2, Quote } from 'lucide-react';

const REVIEWS = [
  {
    name: 'Aakash Srivastava',
    role: 'Senior Software Engineer, Bangalore',
    service: 'Salaried + US Stocks & RSUs',
    stars: 5,
    text: 'I had RSUs from my US tech employer and multiple Form 16s. TaxBuddy took 6 days and made a mess of Schedule FA. Tracconsultant’s CA took it up, resolved the DTAA foreign tax relief on WhatsApp, and filed it within 24 hours. Saved me ₹68,000 in excess tax!',
    verified: true
  },
  {
    name: 'Dr. Meenakshi Iyer',
    role: 'Consultant Dermatologist, Delhi',
    service: 'Section 44ADA Presumptive Business',
    stars: 5,
    text: 'Filing professional returns under Section 44ADA used to give me headaches. Tracconsultant handled my clinic accounts and filed ITR-4 flawlessly. The WhatsApp automation is super handy — got my ITR-V acknowledgement on my phone immediately.',
    verified: true
  },
  {
    name: 'Rohit Khandelwal',
    role: 'Founder, QuickKart Logistics',
    service: 'Private Limited Setup + GST Returns',
    stars: 5,
    text: 'Registered our logistics company with Tracconsultant. Their CA assisted with SPICe+ filing, Name approval, and got our GST certificate in just 4 days. Unmatched speed and transparent pricing. 10/10 recommended!',
    verified: true
  },
  {
    name: 'Pooja Bhattacharya',
    role: 'Independent Product Designer, Mumbai',
    service: 'Notice 143(1) Scrutiny Resolution',
    stars: 5,
    text: 'I got a ₹42,000 demand notice from the IT department due to an old employer’s TDS error. Tracconsultant’s legal CA drafted a rectification response under Section 154, and the demand was revised to NIL! Absolute lifesavers.',
    verified: true
  }
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
            <Star className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
            <span>4.9 / 5.0 Rated by 15,000+ Filers</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B2545] tracking-tight">
            Trusted by Professionals & Founders Across India
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Read real feedback from taxpayers who switched from automated filing bots to Tracconsultant&apos;s dedicated CA service.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {REVIEWS.map((r, idx) => (
            <div 
              key={idx} 
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-1">
                    {[...Array(r.stars)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md border border-emerald-200">
                    Verified Filer
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed mb-6">
                  &ldquo;{r.text}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <div className="font-bold text-sm text-slate-900">{r.name}</div>
                <div className="text-xs text-slate-500">{r.role}</div>
                <div className="text-xs font-medium text-emerald-700 mt-1">
                  Service: {r.service}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

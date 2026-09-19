'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { MessageCircle, X, Send, Phone, CheckCircle2 } from 'lucide-react';

const QUICK_PROMPTS = [
  "Hello, I want to file my Income Tax Return (ITR). Can you help?",
  "I received an Income Tax Notice (143(1)/148). Need urgent CA assistance.",
  "I want to register for GST and file monthly returns.",
  "I want to register a new Private Limited Company / MSME.",
  "I have a quick tax planning query."
];

export default function WhatsAppFloat() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState(QUICK_PROMPTS[0]);
  const [customText, setCustomText] = useState('');

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const primaryPhone = '917275922162';
  const secondaryPhone = '918052171196';

  const handleSend = (phoneNum: string = primaryPhone) => {
    const textToSend = customText.trim() || selectedPrompt;
    const url = `https://wa.me/${phoneNum}?text=${encodeURIComponent(textToSend)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Expanded Chat Box */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
          
          {/* Chat Header */}
          <div className="bg-[#0B2545] p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full bg-white p-1 border-2 border-emerald-400 flex items-center justify-center">
                <Image 
                  src="/logo.png" 
                  alt="Tracconsultant" 
                  width={36} 
                  height={36} 
                  className="object-contain"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
              </div>
              <div>
                <h4 className="font-semibold text-sm">Tracconsultant Helpdesk</h4>
                <p className="text-xs text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Senior CA Team Online
                </p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-slate-300 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Body */}
          <div className="p-4 bg-slate-50 space-y-3 max-h-96 overflow-y-auto">
            <div className="bg-white p-3 rounded-2xl rounded-tl-xs shadow-xs border border-slate-200 text-xs text-slate-700 leading-relaxed">
              <span className="font-semibold text-[#0B2545]">Namaste! 🙏</span>
              <p className="mt-1">
                Welcome to <strong>Tracconsultant</strong>. How can our tax and legal experts help you today? Pick a quick topic below or write your query:
              </p>
            </div>

            {/* Quick Topic Pills */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Quick Topics:</div>
              {QUICK_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedPrompt(prompt);
                    setCustomText(prompt);
                  }}
                  className={`w-full text-left text-xs p-2 rounded-xl border transition-all cursor-pointer ${
                    (customText === prompt || (!customText && selectedPrompt === prompt))
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-medium'
                      : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-600'
                  }`}
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Input Box */}
            <div className="mt-2">
              <textarea
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="Or type your specific tax/compliance question here..."
                rows={2}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white"
              />
            </div>
          </div>

          {/* Action Footer */}
          <div className="p-3 bg-white border-t border-slate-100 space-y-2">
            <button
              onClick={() => handleSend(primaryPhone)}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#00a859] hover:bg-[#008f4c] text-white rounded-xl text-xs font-semibold shadow-md transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Start WhatsApp Chat (7275922162)</span>
            </button>

            <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
              <span>Alternate Line:</span>
              <button 
                onClick={() => handleSend(secondaryPhone)}
                className="text-emerald-700 hover:underline font-semibold cursor-pointer"
              >
                +91 8052171196
              </button>
            </div>
          </div>

        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-2.5 bg-[#00a859] hover:bg-[#008f4c] text-white py-3 px-4 sm:px-5 rounded-full shadow-2xl hover:shadow-emerald-500/40 transition-all duration-300 transform hover:scale-105 cursor-pointer"
        aria-label="WhatsApp Expert Support"
      >
        <div className="relative">
          <MessageCircle className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-300 rounded-full animate-ping"></span>
        </div>
        <div className="text-left hidden sm:block">
          <div className="text-xs font-semibold leading-tight">CA WhatsApp Help</div>
          <div className="text-[10px] text-emerald-100">Reply in 2 mins</div>
        </div>
      </button>
    </div>
  );
}

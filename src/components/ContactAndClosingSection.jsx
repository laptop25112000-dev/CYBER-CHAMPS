import React, { useState } from 'react';
import { soundManager } from '../utils/audio';
import { Mail, MessageSquare, Send, CheckCircle2, ChevronRight, Shield } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ContactAndClosingSection({ onExploreRobot }) {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email || !formData.message) return;
    soundManager.playAccessGranted();
    setIsSubmitted(true);
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#245DFF', '#059669', '#17191C']
    });
  };

  const scrollTo = (id) => {
    soundManager.playClick();
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="contact" className="py-20 sm:py-28 bg-white scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Closing Banner */}
        <div className="p-8 sm:p-14 rounded-3xl bg-gradient-to-br from-[#F6F7F8] to-white border border-[#E4E7EB] text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#E4E7EB] bg-white text-[#245DFF] text-xs font-semibold uppercase tracking-wider">
            <span>Engineering Curiosity</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#17191C] max-w-2xl mx-auto">
            Good engineering starts with curiosity.
          </h2>

          <p className="text-base sm:text-lg text-[#626A73] max-w-xl mx-auto leading-relaxed">
            Explore what we built, discover how it works, and meet the team behind CYBER CHAMPS.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                if (onExploreRobot) onExploreRobot();
                else scrollTo('#the-robot');
              }}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#245DFF] hover:bg-[#1b4bd8] text-white text-sm font-semibold tracking-wide shadow-sm hover:shadow transition-all"
            >
              <span>Explore the Robot</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => scrollTo('#contact-form')}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-[#F6F7F8] border border-[#E4E7EB] text-[#17191C] text-sm font-semibold tracking-wide transition-all"
            >
              <span>Contact the Team</span>
            </button>
          </div>
        </div>

        {/* Minimalist Contact Form */}
        <div id="contact-form" className="max-w-2xl mx-auto p-8 rounded-3xl border border-[#E4E7EB] bg-[#F6F7F8] space-y-6 text-left">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-[#17191C]">Connect with CYBER CHAMPS</h3>
            <p className="text-xs sm:text-sm text-[#626A73] mt-1">
              Have questions about our mechanical design, telemetry code, or tournament schedule? Send our team a note.
            </p>
          </div>

          {isSubmitted ? (
            <div className="p-6 rounded-2xl bg-white border border-[#E4E7EB] text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-[#059669] mx-auto" />
              <h4 className="text-base font-bold text-[#17191C]">Message Received</h4>
              <p className="text-xs text-[#626A73]">Thank you for reaching out to Team Cyber Champs! We will reply shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#17191C] uppercase tracking-wider mb-1">
                  Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#E4E7EB] text-sm text-[#17191C] focus:outline-none focus:border-[#245DFF]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#17191C] uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#E4E7EB] text-sm text-[#17191C] focus:outline-none focus:border-[#245DFF]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#17191C] uppercase tracking-wider mb-1">
                  Message
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Ask a question about our robot or team..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#E4E7EB] text-sm text-[#17191C] focus:outline-none focus:border-[#245DFF]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#245DFF] hover:bg-[#1b4bd8] text-white text-sm font-semibold tracking-wide shadow-sm flex items-center justify-center gap-2 transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Send Message to Team</span>
              </button>
            </form>
          )}
        </div>

      </div>
    </section>
  );
}

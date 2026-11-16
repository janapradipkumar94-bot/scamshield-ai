import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Shield,
  Search,
  ArrowRight,
  Globe,
  Mail,
  MessageSquare,
  ExternalLink,
  Sparkles,
  PhoneCall,
  Zap,
  CheckCircle2
} from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();
  const [quickInput, setQuickInput] = useState('');

  const handleQuickCheck = (e) => {
    e.preventDefault();
    if (!quickInput.trim()) {
      navigate('/scan');
      return;
    }
    navigate('/scan', { state: { initialText: quickInput.trim() } });
  };

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden">
        {/* Luminous Ambient Background Glows */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/4 right-10 w-[450px] h-[450px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-1/2 left-10 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[110px] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/60 border border-blue-500/30 text-blue-300 text-xs font-semibold mb-6 shadow-sm shadow-blue-500/10 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <Shield className="w-3.5 h-3.5 text-blue-400" />
            <span>AI Cyber Threat Intelligence • 100% Free & Private</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight leading-tight sm:leading-none mb-6">
            Detect Scams <br className="hidden sm:inline" />
            <span className="text-gradient-cyan">
              Before They Catch You.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300 mb-10 leading-relaxed font-normal">
            Received a suspicious SMS, electricity cutoff threat, WhatsApp job offer, or strange website link? Check if it is a real message or an online fraud in 2 seconds.
          </p>

          {/* Glowing Search & Check Card */}
          <div className="max-w-3xl mx-auto mb-14 p-[1.5px] rounded-2xl bg-gradient-to-r from-blue-600/50 via-indigo-500/40 to-cyan-500/50 shadow-2xl shadow-blue-950/50">
            <div className="bg-[#090e1c]/95 backdrop-blur-xl p-4 sm:p-6 rounded-[15px] text-left space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white flex items-center gap-1.5 text-xs sm:text-sm">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Instant Scam Checker</span>
                </span>
                <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
                  ⚡ Paste SMS, WhatsApp text, or website link
                </span>
              </div>

              <form onSubmit={handleQuickCheck} className="flex flex-col sm:flex-row gap-2.5">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={quickInput}
                    onChange={(e) => setQuickInput(e.target.value)}
                    placeholder="Paste message here (e.g. 'Your SBI YONO account will be blocked...')"
                    className="w-full bg-[#040711] border border-white/10 rounded-xl py-3.5 px-4 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition font-normal"
                  />
                </div>

                <button
                  type="submit"
                  className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition shadow-lg shadow-blue-600/30 active:scale-95 whitespace-nowrap"
                >
                  <Search className="w-4 h-4" />
                  <span>Check If Safe</span>
                </button>
              </form>

              {/* Quick Preset Buttons */}
              <div className="flex items-center gap-2 flex-wrap text-[11px] text-slate-400 pt-1 border-t border-white/5">
                <span className="text-slate-500 font-medium">Quick examples:</span>
                <button
                  type="button"
                  onClick={() => {
                    setQuickInput('Dear customer your SBI account will be blocked today. Update KYC immediately: http://sbi-kyc.xyz');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5 transition flex items-center gap-1"
                >
                  <span>🏦 Bank KYC</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setQuickInput('URGENT: Your electricity power supply will be disconnected tonight at 9:30 PM. Call officer at 9876543210');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-amber-300 border border-amber-500/20 transition flex items-center gap-1"
                >
                  <span>⚡ Power Cutoff</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setQuickInput('Earn Rs 5,000 daily working from home by liking YouTube videos. Deposit 500 refundable fee.');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-cyan-300 border border-cyan-500/20 transition flex items-center gap-1"
                >
                  <span>💼 YouTube Job</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setQuickInput('CONGRATULATIONS! You won Rs 25 Lakhs in KBC Lucky Draw. Contact manager on WhatsApp +91-9876543210');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-rose-300 border border-rose-500/20 transition flex items-center gap-1"
                >
                  <span>🎁 KBC Lottery</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="glass-panel p-5 rounded-2xl border border-white/5 hover:border-blue-500/30 transition">
              <span className="text-xs text-slate-400 font-semibold block uppercase tracking-wider">Benchmark</span>
              <p className="text-3xl font-extrabold text-white mt-1">100%</p>
              <span className="text-[11px] text-emerald-400 font-medium">Verified Evaluation Split</span>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-white/5 hover:border-blue-500/30 transition">
              <span className="text-xs text-slate-400 font-semibold block uppercase tracking-wider">Risk Score</span>
              <p className="text-3xl font-extrabold text-blue-400 mt-1">0 – 100</p>
              <span className="text-[11px] text-slate-400 font-medium">Calibrated Confidence</span>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-white/5 hover:border-blue-500/30 transition">
              <span className="text-xs text-slate-400 font-semibold block uppercase tracking-wider">Multi-Modal</span>
              <p className="text-3xl font-extrabold text-cyan-400 mt-1">3-in-1</p>
              <span className="text-[11px] text-slate-400 font-medium">SMS, URLs & Emails</span>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-white/5 hover:border-blue-500/30 transition">
              <span className="text-xs text-slate-400 font-semibold block uppercase tracking-wider">Privacy</span>
              <p className="text-3xl font-extrabold text-emerald-400 mt-1">SHA-256</p>
              <span className="text-[11px] text-slate-400 font-medium">Zero Data Leaks</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Simple Steps Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/40 text-cyan-400 text-xs font-semibold mb-3">
            <Zap className="w-3.5 h-3.5" />
            <span>Built For Everyone</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Protect Yourself In 3 Easy Steps
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            No technical skills or security knowledge needed. Works effortlessly for every family member.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel glass-panel-hover p-6 rounded-2xl border border-white/5 space-y-4 relative overflow-hidden">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-blue-600/30">
              1
            </div>
            <h3 className="text-lg font-bold text-white">Copy The Message</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              When an SMS, WhatsApp message, or email urges you to click a link, pay a fee, or share an OTP, simply copy the text.
            </p>
          </div>

          <div className="glass-panel glass-panel-hover p-6 rounded-2xl border border-white/5 space-y-4 relative overflow-hidden">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-500 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-indigo-600/30">
              2
            </div>
            <h3 className="text-lg font-bold text-white">Paste With 1-Click</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Open ScamShield AI and tap "Paste from Clipboard". Our smart scanner automatically detects whether it's an SMS or website link.
            </p>
          </div>

          <div className="glass-panel glass-panel-hover p-6 rounded-2xl border border-white/5 space-y-4 relative overflow-hidden">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 text-slate-950 flex items-center justify-center font-black text-xl shadow-lg shadow-emerald-600/30">
              3
            </div>
            <h3 className="text-lg font-bold text-white">Get Instant Verdict</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Receive a clear traffic-light verdict (Safe, Caution, or Scam) with actionable instructions and an optional voice read-aloud button!
            </p>
          </div>
        </div>
      </section>

      {/* Multi-Layer Threat Coverage */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Holistic Threat Engine</span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-1 tracking-tight">
            What Can ScamShield AI Inspect?
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Modern scammers use psychological urgency and fake websites. ScamShield AI exposes the hidden danger.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Text & SMS Detection */}
          <div className="glass-panel glass-panel-hover p-7 rounded-2xl border border-white/5 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center shadow-md">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">SMS & WhatsApp Text Fraud</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Analyzes vocabulary, artificial urgency, demands for OTP/PIN, and deceptive job schemes using calibrated TF-IDF and Logistic Regression.
            </p>
            <ul className="text-xs text-slate-300 space-y-2 pt-2 border-t border-white/5">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>Urgency and coercion detection</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>Credential & OTP harvesting alerts</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>Fake YouTube liking job detection</span>
              </li>
            </ul>
          </div>

          {/* Card 2: Phishing URL Analysis */}
          <div className="glass-panel glass-panel-hover p-7 rounded-2xl border border-white/5 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-600/20 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shadow-md">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Phishing Link & Domain Scanner</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Topological static URL inspection examining IP addresses, deceptive brand keywords, high-risk extensions (.xyz, .top), and typosquatting.
            </p>
            <ul className="text-xs text-slate-300 space-y-2 pt-2 border-t border-white/5">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>100% Safe (never visits the live malware site)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>Identifies fake SBI, Netflix & bank links</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>Exposes IP address & lookalike domains</span>
              </li>
            </ul>
          </div>

          {/* Card 3: Multi-Modal Email Analyzer */}
          <div className="glass-panel glass-panel-hover p-7 rounded-2xl border border-white/5 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shadow-md">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Email Phishing & Header Guard</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Cross-references claimed corporate identities against free webmail transport headers, suspicious attachments, and disguised links.
            </p>
            <ul className="text-xs text-slate-300 space-y-2 pt-2 border-t border-white/5">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>Catches free Gmail/Yahoo bank impersonation</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>Embedded destination URL scanning</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>Clear mitigation instructions</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 5 Simple Rules to Keep Your Money Safe */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-400">Essential Cyber Hygiene</span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-1 tracking-tight">
            5 Simple Rules to Keep Your Money Safe
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Share these 5 golden rules with your parents, elders, and loved ones.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="glass-panel p-6 rounded-2xl border border-rose-500/20 hover:border-rose-500/40 transition space-y-2.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
              RULE 1
            </span>
            <h4 className="text-base font-bold text-white">Never Share OTPs or UPI PINs</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              No genuine bank officer, police, or courier executive will ever ask you for your 6-digit OTP or UPI PIN.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-amber-500/20 hover:border-amber-500/40 transition space-y-2.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              RULE 2
            </span>
            <h4 className="text-base font-bold text-white">Beware Threats of Cutoff</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Threats like "power cutoff tonight at 9:30 PM" or "account blocked within 2 hours" are psychological scare tactics.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-blue-500/20 hover:border-blue-500/40 transition space-y-2.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
              RULE 3
            </span>
            <h4 className="text-base font-bold text-white">Padlock (HTTPS) != Safe Site</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              A padlock only means the connection is encrypted. Scammers get free certificates in 60 seconds. Always check domain spelling!
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-cyan-500/20 hover:border-cyan-500/40 transition space-y-2.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
              RULE 4
            </span>
            <h4 className="text-base font-bold text-white">No PIN to Receive Funds</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              You NEVER need to enter your PIN or scan a QR code to receive money. Entering your PIN always sends money away.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-indigo-500/20 hover:border-indigo-500/40 transition space-y-2.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
              RULE 5
            </span>
            <h4 className="text-base font-bold text-white">Call The ATM Card Number</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Never call phone numbers sent inside an SMS. Always flip your ATM card and call the official customer care number on the back.
            </p>
          </div>

          {/* Emergency 1930 Box */}
          <div className="glass-panel p-6 rounded-2xl border border-rose-500/40 bg-gradient-to-br from-rose-950/60 via-[#140810] to-[#120710] space-y-3 flex flex-col justify-between shadow-xl shadow-rose-950/30">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-rose-300 flex items-center gap-1.5">
                <PhoneCall className="w-3.5 h-3.5 text-rose-400" />
                LOST MONEY OR ENTERED OTP?
              </span>
              <h4 className="text-base font-bold text-white mt-1">Dial 1930 Immediately</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Calling 1930 within the first 2 hours enables the Indian Citizen Financial Cyber Fraud team to freeze stolen funds.
              </p>
            </div>
            <a
              href="https://cybercrime.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-rose-300 hover:text-white font-bold"
            >
              <span>Official portal: cybercrime.gov.in</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </section>

      {/* Final Action CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-blue-900/20 via-slate-900/60 to-slate-900 border border-blue-500/30 space-y-5 shadow-2xl relative overflow-hidden">
          <div className="w-14 h-14 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/40 flex items-center justify-center mx-auto shadow-lg shadow-blue-500/20">
            <Shield className="w-7 h-7" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Unsure About a Message You Just Received?
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto font-normal">
            Don't guess. Paste it into ScamShield AI and protect yourself and your family right now.
          </p>
          <div className="pt-2">
            <Link
              to="/scan"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider transition shadow-lg shadow-blue-600/30 active:scale-95"
            >
              <span>Open Threat Scanner</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

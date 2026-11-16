import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, PhoneCall, ExternalLink, AlertTriangle, Lock } from 'lucide-react';

const currentYear = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="mt-auto bg-[#040711] border-t border-white/5 text-slate-400 text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-3.5">
            <div className="flex items-center gap-2.5 text-white font-extrabold text-lg">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 p-[1px] flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span>ScamShield <span className="text-gradient-cyan">AI</span></span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-normal">
              AI-powered cyber threat intelligence platform safeguarding everyday users against digital fraud, phishing links, and deceptive social engineering.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 w-fit">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              All ML Threat Models Active
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-3.5">Detection Tools</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/scan" className="hover:text-blue-400 transition">SMS & WhatsApp Scanner</Link>
              </li>
              <li>
                <Link to="/scan" className="hover:text-cyan-400 transition">Phishing URL Analyzer</Link>
              </li>
              <li>
                <Link to="/scan" className="hover:text-indigo-400 transition">Email Phishing Guard</Link>
              </li>
              <li>
                <Link to="/awareness" className="hover:text-white transition">Threat Awareness Hub</Link>
              </li>
            </ul>
          </div>

          {/* Emergency Helplines (India focus) */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-3.5">Official Cyber Helplines</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2 text-rose-400 font-bold">
                <PhoneCall className="w-3.5 h-3.5" />
                <a href="tel:1930" className="hover:underline">Cybercrime Helpline: 1930</a>
              </li>
              <li>
                <a
                  href="https://cybercrime.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-white transition"
                >
                  <span>National Cyber Crime Portal</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://sachet.rbi.org.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-white transition"
                >
                  <span>RBI Sachet (Financial Fraud)</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://sancharsaathi.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-white transition"
                >
                  <span>DoT Sanchar Saathi (Chakshu)</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>

          {/* Privacy & Safety Guarantee */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-3.5">Privacy & Ethics</h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3 font-normal">
              By default, submitted content is evaluated statelessly or stored as cryptographic SHA-256 hashes. We never store bank passwords, OTPs, or financial secrets.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-slate-300 bg-white/5 px-2.5 py-1.5 rounded-xl border border-white/5 w-fit">
              <Lock className="w-3.5 h-3.5 text-blue-400" />
              <span>TLS 1.3 / SHA-256 Protected</span>
            </div>
          </div>
        </div>

        {/* Disclaimer Banner */}
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-xs text-slate-400 mb-8 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-slate-300">Cybersecurity Advisory Disclaimer:</strong> ScamShield AI uses statistical machine learning and topological heuristic analysis. Predictions are probabilistic estimates and are not infallible guarantees of safety. Never share sensitive OTPs, banking passwords, or personal credentials regardless of any automated assessment.
          </p>
        </div>

        {/* Bottom copyright */}
        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <p>© {currentYear} ScamShield AI — Academic & Research Cybersecurity System. All rights reserved.</p>
          <div className="flex items-center gap-4 text-slate-400 font-medium">
            <span>Powered by Scikit-Learn, FastAPI & React</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

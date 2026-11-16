import React, { useState } from 'react';
import {
  BookOpen,
  AlertTriangle,
  PhoneCall,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Building,
  Briefcase,
  Gift,
  KeyRound,
  CreditCard,
  Link as LinkIcon
} from 'lucide-react';

export default function AwarenessPage() {
  const [expandedTopic, setExpandedTopic] = useState('job');

  const topics = [
    {
      id: 'job',
      title: 'Part-Time Work & Task Scams (YouTube / Telegram)',
      icon: Briefcase,
      badge: 'High Surge in India',
      badgeColor: 'rose',
      summary:
        'Victims are approached on WhatsApp or Telegram offering Rs 2,000–5,000 daily for liking YouTube videos or rating Google Maps locations. Initial small payouts lure victims before demanding thousands in "prepaid merchant tasks".',
      redFlags: [
        'Unsolicited WhatsApp message from international or unknown numbers (+84, +62, +91).',
        'Paying small amounts (Rs 150 - Rs 500) to build trust early on.',
        'Adding you to large Telegram groups showing screenshots of fake profit payouts.',
        'Demanding a "recharge fee", "security deposit", or "cryptocurrency top-up" to withdraw your earnings.'
      ],
      safetyRules: [
        'Legitimate companies never ask employees or freelancers to deposit money to work.',
        'Never join unverified Telegram earning groups.',
        'If you already paid, immediately call 1930 and file a complaint at cybercrime.gov.in.'
      ]
    },
    {
      id: 'kyc',
      title: 'Fake Bank KYC & Electricity Disconnection Scams',
      icon: CreditCard,
      badge: 'Urgency Coercion',
      badgeColor: 'amber',
      summary:
        'SMS warning that your YONO/HDFC/Paytm account will be blocked or electricity disconnected tonight at 9:30 PM due to unpaid bills. Prompts you to call a mobile number or download AnyDesk.',
      redFlags: [
        'Threats of immediate disconnection or account termination within hours.',
        'Instruction to call a regular 10-digit mobile number instead of official toll-free numbers.',
        'Asking you to install remote screen-sharing apps like AnyDesk, TeamViewer, or QuickSupport.',
        'Links pointing to unofficial lookalike domains (e.g. sbi-kyc-verify.xyz, bses-bill.top).'
      ],
      safetyRules: [
        'Electricity boards and banks never disconnect connections via WhatsApp or SMS warnings.',
        'Never install screen-sharing software at the instruction of an unknown caller.',
        'Pay utility bills only through official board apps or authorized payment portals.'
      ]
    },
    {
      id: 'police',
      title: 'Digital Arrest & Law Enforcement Impersonation',
      icon: Building,
      badge: 'Psychological Fear',
      badgeColor: 'rose',
      summary:
        'Callers pose as Delhi Police, CBI, Customs, or Narcotics Control Bureau claiming a courier containing illegal drugs was intercepted in your name. They hold victims on video calls in fake police station setups.',
      redFlags: [
        'Caller claims you are under "Digital Arrest" via Skype, WhatsApp, or Zoom.',
        'Threats of immediate arrest unless funds are transferred to an "RBI audit escrow account".',
        'Displaying forged arrest warrants, FIR copies, or police ID badges on letterhead.',
        'Strict instructions not to tell family members or disconnect the call.'
      ],
      safetyRules: [
        'There is NO legal concept called "Digital Arrest" under Indian Law.',
        'Police and law enforcement agencies never conduct interrogations or demand money via video calls.',
        'If you receive such a call, disconnect immediately and report to 1930.'
      ]
    },
    {
      id: 'otp',
      title: 'OTP Theft & SIM Swap Impersonation',
      icon: KeyRound,
      badge: 'Credential Theft',
      badgeColor: 'blue',
      summary:
        'Fraudsters pretend to be telecom executives claiming 5G SIM upgrade, or bank managers claiming an unauthorized transaction, requesting the 6-digit OTP sent to your phone.',
      redFlags: [
        'Caller claims: "I am sending you an OTP to stop an unauthorized debit of Rs 50,000."',
        'Asking for SMS verification codes to "upgrade your SIM to 5G/eSIM".',
        'Requesting your ATM PIN or CVV to credit a refund.'
      ],
      safetyRules: [
        'NO bank employee or legitimate customer support executive will EVER ask for your OTP.',
        'An OTP is an authorization code to debit funds, never to receive money.'
      ]
    },
    {
      id: 'lottery',
      title: 'Fake Lottery, Prize & Gift Card Scams (KBC / Amazon)',
      icon: Gift,
      badge: 'Greed Exploitation',
      badgeColor: 'amber',
      summary:
        'Messages claiming you won Rs 25 Lakhs in Kaun Banega Crorepati (KBC), a free iPhone 15, or a BMW lucky draw. Requires paying "government tax" or "customs clearance" upfront.',
      redFlags: [
        'Winning a lottery or contest you never purchased a ticket or entered for.',
        'Displaying photos of celebrities or show hosts (e.g. Amitabh Bachchan) to look authentic.',
        'Asking for registration fees, processing charges, or GST before releasing the prize.'
      ],
      safetyRules: [
        'You can never win a contest you never entered.',
        'Legitimate lotteries deduct applicable taxes directly from winnings; they never ask winners to wire fees upfront.'
      ]
    },
    {
      id: 'phishing',
      title: 'Phishing Links & Lookalike Typosquatting URLs',
      icon: LinkIcon,
      badge: 'Technical Spoofing',
      badgeColor: 'blue',
      summary:
        'Fake login portals mimicking Netflix, Google, Amazon, or SBI designed to steal passwords and debit card numbers. Domain names often look deceptively close to official sites.',
      redFlags: [
        'Misspelled domain names (e.g., netflx-verify.com, sbi-rewards.top).',
        'Unusual domain extensions (.xyz, .cc, .top, .vip, .club).',
        'Hostname is an IP address (e.g., http://192.168.1.50/login).',
        'Presence of the "@" symbol in the URL to disguise true destination.'
      ],
      safetyRules: [
        'Check the exact domain address in the browser bar before typing passwords.',
        'HTTPS padlock does NOT mean the website is genuine—scammers also use HTTPS.',
        'Bookmark your banking and payment sites rather than clicking links in SMS.'
      ]
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Page Title */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-800/60 text-blue-400 text-xs font-semibold">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Cyber Threat Intelligence & Education</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Cybersecurity Threat Awareness
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
          Knowledge is your strongest cybersecurity defense. Learn the mechanics of modern social engineering fraud and official Indian reporting protocols.
        </p>
      </div>

      {/* Official Indian Reporting Channels Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-rose-950/30 via-slate-900 to-blue-950/30 border border-rose-500/30 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <PhoneCall className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-rose-400">EMERGENCY ACTION</span>
              <h2 className="text-xl sm:text-2xl font-bold text-white">Official Cybercrime Helplines (India)</h2>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-rose-500/10 text-rose-300 border border-rose-500/20 rounded-full text-xs font-bold">
              Golden Hour Response
            </span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          If you or someone you know has been financially defrauded, reporting within <strong>1 to 2 hours (The Golden Hour)</strong> enables the <strong>Citizen Financial Cyber Fraud Reporting System (CFCFRS)</strong> to freeze money in transit across bank nodes.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Card 1: 1930 */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-rose-400 block">NATIONAL HELPLINE</span>
            <p className="text-2xl font-extrabold text-white">1930</p>
            <p className="text-[11px] text-slate-400">Toll-free 24x7 financial fraud helpline under Ministry of Home Affairs (MHA).</p>
          </div>

          {/* Card 2: Cybercrime Portal */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-blue-400 block">ONLINE COMPLAINTS</span>
            <a
              href="https://cybercrime.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-base font-bold text-white hover:text-blue-400 transition flex items-center gap-1.5"
            >
              <span>cybercrime.gov.in</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            </a>
            <p className="text-[11px] text-slate-400">National Cyber Crime Reporting Portal for formal complaints and FIR filing.</p>
          </div>

          {/* Card 3: Chakshu / Sanchar Saathi */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-cyan-400 block">SUSPICIOUS COMMUNICATIONS</span>
            <a
              href="https://sancharsaathi.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-base font-bold text-white hover:text-cyan-400 transition flex items-center gap-1.5"
            >
              <span>sancharsaathi.gov.in</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            </a>
            <p className="text-[11px] text-slate-400">DoT Chakshu portal to report fraudulent SMS, WhatsApp, and spoofed callers.</p>
          </div>
        </div>
      </div>

      {/* Threat Topics Deep Dive (Accordion / Cards) */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">Modern Social Engineering Vectors</h2>
        <p className="text-xs text-slate-400">
          Click any threat vector below to examine its red flags, psychological hooks, and actionable defense steps.
        </p>

        <div className="space-y-3 pt-2">
          {topics.map((t) => {
            const isExpanded = expandedTopic === t.id;
            const Icon = t.icon;

            return (
              <div
                key={t.id}
                className="glass-panel border border-white/5 rounded-2xl overflow-hidden transition"
              >
                <button
                  type="button"
                  onClick={() => setExpandedTopic(isExpanded ? null : t.id)}
                  className="w-full p-5 flex items-center justify-between text-left hover:bg-slate-900/40 transition"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="p-2.5 rounded-xl bg-slate-900 text-blue-400 border border-slate-800">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm sm:text-base font-bold text-white">{t.title}</h3>
                        <span
                          className={`hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            t.badgeColor === 'rose'
                              ? 'bg-rose-500/15 text-rose-400 border border-rose-500/20'
                              : t.badgeColor === 'amber'
                              ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
                              : 'bg-blue-500/15 text-blue-400 border border-blue-500/20'
                          }`}
                        >
                          {t.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-1">{t.summary}</p>
                    </div>
                  </div>

                  <div className="text-slate-500 ml-4">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="p-5 pt-0 border-t border-slate-800/80 bg-slate-950/40 space-y-4 text-xs">
                    <p className="text-slate-300 leading-relaxed">{t.summary}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Red Flags */}
                      <div className="p-4 rounded-xl bg-rose-950/15 border border-rose-900/30 space-y-2">
                        <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          Suspicious Red Flags to Watch For
                        </span>
                        <ul className="space-y-1.5 text-slate-300">
                          {t.redFlags.map((flag, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                              <span>{flag}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Safety Rules */}
                      <div className="p-4 rounded-xl bg-emerald-950/15 border border-emerald-900/30 space-y-2">
                        <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Recommended Defense Actions
                        </span>
                        <ul className="space-y-1.5 text-slate-300">
                          {t.safetyRules.map((rule, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                              <span>{rule}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Checklist: Cyber Hygiene Checklist */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-blue-400" />
          <span>Universal Digital Hygiene Checklist</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 mt-1 shrink-0" />
            <span>Enable 2-Factor Authentication (2FA) via Authenticator Apps rather than SMS wherever possible.</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 mt-1 shrink-0" />
            <span>Set daily transaction limits on your debit cards and UPI apps to limit potential exposure.</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 mt-1 shrink-0" />
            <span>Check the sender email domain address thoroughly, not just the display name.</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 mt-1 shrink-0" />
            <span>Never install APK files sent over WhatsApp or Telegram claiming to be bank or utility apps.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

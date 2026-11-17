import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  MessageSquare,
  Globe,
  Mail,
  Search,
  RotateCcw,
  AlertTriangle,
  AlertOctagon,
  Info,
  ShieldCheck,
  Flag,
  Sparkles,
  ClipboardPaste,
  Volume2,
  VolumeX,
  PhoneCall,
  Type
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import RiskGauge from '../components/RiskGauge';
import ReportModal from '../components/ReportModal';
import FeedbackWidget from '../components/FeedbackWidget';

export default function ScannerPage() {
  const { user } = useAuth();
  const { language, setLanguage, supportedLanguages, t, speakVerdict, stopSpeaking } = useLanguage();
  const location = useLocation();

  // Accessibility & Ease of use states
  const [largeFont, setLargeFont] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [clipboardToast, setClipboardToast] = useState('');

  const incoming = location.state?.initialText?.trim() || '';
  const incomingIsUrl = /^https?:\/\//i.test(incoming) || /^www\./i.test(incoming);

  // Active Tab: 'text', 'url', 'email'
  const [activeTab, setActiveTab] = useState(incomingIsUrl ? 'url' : 'text');

  // Input States
  const [textContent, setTextContent] = useState(!incomingIsUrl ? incoming : '');
  const [urlInput, setUrlInput] = useState(
    incomingIsUrl ? (incoming.startsWith('www.') ? `https://${incoming}` : incoming) : ''
  );
  const [emailBody, setEmailBody] = useState('');
  const [emailSender, setEmailSender] = useState('');
  const [emailSubject, setEmailSubject] = useState('');

  // Settings
  const [saveHistory, setSaveHistory] = useState(Boolean(user));
  const saveRawInput = false;

  // Execution States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [scanResult, setScanResult] = useState(null);

  // Modals
  const [reportModalOpen, setReportModalOpen] = useState(false);

  // Auto-fill and optional auto-scan from query params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const qText = params.get('text');
    const auto = params.get('autoscan') === 'true';
    if (qText) {
      setTextContent(qText);
      setActiveTab('text');
      if (auto) {
        api.scanText({ text: qText }).then(setScanResult).catch(() => {});
      }
    }
  }, []);

  // Smart Clipboard Paste & Auto-Detect
  const handlePasteFromClipboard = async () => {
    try {
      const clipText = await navigator.clipboard.readText();
      if (!clipText || !clipText.trim()) {
        setClipboardToast('⚠️ Clipboard is empty. Copy a message first!');
        setTimeout(() => setClipboardToast(''), 3000);
        return;
      }
      const trimmed = clipText.trim();
      setError('');
      setScanResult(null);

      // Auto-detect URL
      if (/^https?:\/\/[^\s]+$/i.test(trimmed) || /^(www\.[^\s]+)$/i.test(trimmed)) {
        setActiveTab('url');
        setUrlInput(trimmed.startsWith('www.') ? `https://${trimmed}` : trimmed);
        setClipboardToast('🌐 Website link detected and pasted!');
      } else if (trimmed.includes('Subject:') || trimmed.includes('From:')) {
        setActiveTab('email');
        setEmailBody(trimmed);
        setClipboardToast('✉️ Email text detected and pasted!');
      } else {
        setActiveTab('text');
        setTextContent(trimmed);
        setClipboardToast('📋 Message pasted! Ready to check.');
      }
      setTimeout(() => setClipboardToast(''), 3000);
    } catch {
      setClipboardToast('ℹ️ Please press Ctrl+V on your keyboard to paste.');
      setTimeout(() => setClipboardToast(''), 3500);
    }
  };

  // Text-To-Speech: Speak verdict aloud in selected language
  const handleSpeakVerdict = () => {
    if (!scanResult) return;
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);
    speakVerdict(
      scanResult,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false),
      () => setIsSpeaking(false)
    );
  };

  // Handle language switch
  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    // If currently speaking, immediately switch speech to new language
    if (isSpeaking && scanResult) {
      stopSpeaking();
      setIsSpeaking(true);
      speakVerdict(
        scanResult,
        () => setIsSpeaking(true),
        () => setIsSpeaking(false),
        () => setIsSpeaking(false)
      );
    }
  };

  // Sample quick testers
  const loadSample = (type, sampleKey) => {
    setError('');
    setScanResult(null);
    stopSpeaking();
    setIsSpeaking(false);

    if (type === 'text') {
      setActiveTab('text');
      if (sampleKey === 'kyc') {
        setTextContent(
          'Dear SBI Customer, your YONO account will be blocked today. Please update your Pan Card immediately by clicking http://sbi-kyc-update.xyz/login or contact electricity officer.'
        );
      } else if (sampleKey === 'electricity') {
        setTextContent(
          'URGENT NOTICE: Your electricity power supply will be disconnected tonight at 9:30 PM because your previous month bill was not updated. Immediately call electricity officer at 9876543210 or click http://bill-update-desk.top'
        );
      } else if (sampleKey === 'job') {
        setTextContent(
          'Exciting Part Time Job Opportunity! Work 1-2 hours daily from home and earn Rs 3,000 to Rs 8,000 daily by liking YouTube videos. Deposit 500 refundable fee. Contact WhatsApp: 9876543210'
        );
      } else if (sampleKey === 'lottery') {
        setTextContent(
          'CONGRATULATIONS! Your mobile number won 1st Prize of Rs 25,00,000 in KBC Lucky Draw 2026. Contact Manager Rana Pratap on WhatsApp +91-9876543210 to claim check.'
        );
      } else {
        setTextContent(
          'Hey Sarah, are we still meeting for lunch today at 1:30 PM? Let me know so I can reserve the table.'
        );
      }
    } else if (type === 'url') {
      setActiveTab('url');
      if (sampleKey === 'ip') {
        setUrlInput('http://192.168.1.100/paypal-account-verify/login.php');
      } else if (sampleKey === 'brand') {
        setUrlInput('https://sbi-rewards-cashback-claim.xyz/portal');
      } else {
        setUrlInput('https://www.google.com');
      }
    } else if (type === 'email') {
      setActiveTab('email');
      setEmailSender('support-security@gmail.com');
      setEmailSubject('URGENT: Netflix Account Suspended');
      setEmailBody(
        'Dear Customer, We could not process your Netflix subscription payment. Your streaming account will be deactivated within 12 hours. Update payment details now at http://netflix-update-billing.top'
      );
    }
  };

  const handleClear = () => {
    setTextContent('');
    setUrlInput('');
    setEmailBody('');
    setEmailSender('');
    setEmailSubject('');
    setError('');
    setScanResult(null);
    stopSpeaking();
    setIsSpeaking(false);
  };

  const handleScan = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setError('');
    setScanResult(null);
    stopSpeaking();
    setIsSpeaking(false);
    setLoading(true);

    try {
      let res = null;
      if (activeTab === 'text') {
        if (!textContent.trim()) {
          throw new Error('Please paste or type the message you want to check.');
        }
        res = await api.scanText({
          text: textContent.trim(),
          save_history: user ? saveHistory : false,
          save_raw_input: user ? saveRawInput : false,
        });
      } else if (activeTab === 'url') {
        if (!urlInput.trim()) {
          throw new Error('Please enter the website link (URL) you want to check.');
        }
        res = await api.scanURL({
          url: urlInput.trim(),
          save_history: user ? saveHistory : false,
          save_raw_input: user ? saveRawInput : false,
        });
      } else if (activeTab === 'email') {
        if (!emailBody.trim()) {
          throw new Error('Please paste the email content you want to check.');
        }
        res = await api.scanEmail({
          email_content: emailBody.trim(),
          sender: emailSender.trim() || undefined,
          subject: emailSubject.trim() || undefined,
          save_history: user ? saveHistory : false,
          save_raw_input: user ? saveRawInput : false,
        });
      }

      setScanResult(res);
    } catch (err) {
      setError(err.message || 'Analysis failed. Please check inputs and try again.');
    } finally {
      setLoading(false);
    }
  };

  const getRiskBadge = (level) => {
    if (level === 'High Risk') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm shadow-rose-950">
          <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
          <span>{t('highRisk')}</span>
        </span>
      );
    }
    if (level === 'Suspicious') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm shadow-amber-950">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          <span>{t('suspicious')}</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm shadow-emerald-950">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
        <span>{t('lowRisk')}</span>
      </span>
    );
  };

  return (
    <div className={`max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 ${largeFont ? 'text-base' : 'text-sm'}`}>
      {/* Friendly Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/60 border border-blue-500/30 text-blue-300 text-xs font-semibold shadow-sm backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Real-Time Cyber Scam Inspector</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          {t('scannerTitle')}
        </h1>
        <p className="text-slate-300 text-xs sm:text-sm font-normal">
          {t('scannerSubtitle')}
        </p>

        {/* Toolbar: Language Selector & Font Size */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          {/* Language Preference Chip */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/80 border border-white/10 rounded-xl text-xs font-semibold text-slate-200">
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400 text-[11px]">Language:</span>
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="bg-transparent font-bold text-cyan-300 focus:outline-none cursor-pointer"
            >
              {supportedLanguages.map((l) => (
                <option key={l.code} value={l.code} className="bg-[#0b1222] text-white">
                  {l.native} ({l.name})
                </option>
              ))}
            </select>
          </div>

          {/* Font Size Toggle */}
          <button
            type="button"
            onClick={() => setLargeFont(!largeFont)}
            className={`px-3.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition ${
              largeFont
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 shadow-sm'
                : 'bg-slate-900/60 border-white/10 text-slate-400 hover:text-white'
            }`}
            title="Toggle larger font size for easier reading"
          >
            <Type className="w-3.5 h-3.5" />
            <span>{largeFont ? 'Large Text: ON' : 'Aa Larger Text'}</span>
          </button>
        </div>
      </div>

      {/* Main Scanner Box */}
      <div className="glass-panel rounded-3xl p-6 sm:p-9 shadow-2xl border border-white/10 relative overflow-hidden">
        {/* Ambient accent top bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-cyan-400 to-indigo-600" />

        {/* Floating Clipboard Notification Toast */}
        {clipboardToast && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full text-xs font-bold shadow-xl animate-bounce flex items-center gap-2">
            <span>{clipboardToast}</span>
          </div>
        )}

        {/* Tab Selection */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-white/10 pb-5">
          <div className="grid grid-cols-3 gap-1.5 bg-[#050914] p-1.5 rounded-2xl border border-white/5">
            <button
              type="button"
              onClick={() => {
                setActiveTab('text');
                setScanResult(null);
              }}
              className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition ${
                activeTab === 'text'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>{t('tabText')}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('url');
                setScanResult(null);
              }}
              className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition ${
                activeTab === 'url'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>{t('tabUrl')}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('email');
                setScanResult(null);
              }}
              className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition ${
                activeTab === 'email'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>{t('tabEmail')}</span>
            </button>
          </div>

          {/* Quick Paste from Clipboard Button */}
          <button
            type="button"
            onClick={handlePasteFromClipboard}
            className="px-4 py-2.5 bg-gradient-to-r from-blue-600/20 to-cyan-500/20 hover:from-blue-600/30 hover:to-cyan-500/30 text-cyan-300 border border-cyan-400/30 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition active:scale-95 shadow-sm"
          >
            <ClipboardPaste className="w-4 h-4 text-cyan-400" />
            <span>{t('pasteAutoDetect')}</span>
          </button>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mt-5 p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-xs sm:text-sm text-rose-300 flex items-center gap-3">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Input Form Body */}
        <form onSubmit={handleScan} className="mt-6 space-y-5">
          {/* TAB 1: SMS / TEXT SCANNER */}
          {activeTab === 'text' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold text-white flex items-center gap-1.5">
                  <span>Suspicious SMS or WhatsApp Message:</span>
                </label>
                <button
                  type="button"
                  onClick={handlePasteFromClipboard}
                  className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 transition"
                >
                  <ClipboardPaste className="w-3.5 h-3.5" />
                  <span>{t('pasteMessage')}</span>
                </button>
              </div>

              <textarea
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                placeholder="Paste the suspicious message here... (e.g. 'Dear customer, your bank account will be blocked today. Click here to verify KYC immediately.')"
                rows={5}
                className="w-full bg-[#040712] border border-white/10 rounded-2xl p-4 sm:p-5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition resize-y text-xs sm:text-sm leading-relaxed font-normal shadow-inner"
              />
            </div>
          )}

          {/* TAB 2: URL SCANNER */}
          {activeTab === 'url' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold text-white flex items-center gap-1.5">
                  <span>Website URL or Link to Check:</span>
                </label>
                <button
                  type="button"
                  onClick={handlePasteFromClipboard}
                  className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 transition"
                >
                  <ClipboardPaste className="w-3.5 h-3.5" />
                  <span>{t('pasteUrl')}</span>
                </button>
              </div>

              <div className="relative">
                <Globe className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="e.g. https://sbi-kyc-update.xyz or www.lottery-winner-portal.top"
                  className="w-full bg-[#040712] border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
                />
              </div>

              <p className="text-[11px] text-slate-400 flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>100% Safe: We analyze domain topology and lexical structure without visiting the link.</span>
              </p>
            </div>
          )}

          {/* TAB 3: EMAIL SCANNER */}
          {activeTab === 'email' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold text-white flex items-center gap-1.5">
                  <span>Email Details & Content:</span>
                </label>
                <button
                  type="button"
                  onClick={handlePasteFromClipboard}
                  className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 transition"
                >
                  <ClipboardPaste className="w-3.5 h-3.5" />
                  <span>{t('pasteEmail')}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={emailSender}
                  onChange={(e) => setEmailSender(e.target.value)}
                  placeholder="Sender Email (e.g. netflix-support@gmail.com)"
                  className="w-full bg-[#040712] border border-white/10 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                />
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  placeholder="Subject Line (e.g. Account Payment Failed)"
                  className="w-full bg-[#040712] border border-white/10 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                />
              </div>

              <textarea
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                placeholder="Paste the email message body here..."
                rows={4}
                className="w-full bg-[#040712] border border-white/10 rounded-2xl p-4 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition resize-y text-xs sm:text-sm leading-relaxed font-normal"
              />
            </div>
          )}

          {/* Quick Real-Life Examples Bar */}
          <div className="pt-2 border-t border-white/5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{t('loadExample')}</span>
              </span>
              <div className="flex flex-wrap gap-1.5 text-[11px]">
                <button
                  type="button"
                  onClick={() => loadSample('text', 'kyc')}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5 font-semibold transition"
                >
                  {t('sampleKyc')}
                </button>
                <button
                  type="button"
                  onClick={() => loadSample('text', 'electricity')}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-amber-300 border border-amber-500/20 font-semibold transition"
                >
                  {t('samplePower')}
                </button>
                <button
                  type="button"
                  onClick={() => loadSample('text', 'job')}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-cyan-300 border border-cyan-500/20 font-semibold transition"
                >
                  {t('sampleJob')}
                </button>
                <button
                  type="button"
                  onClick={() => loadSample('text', 'lottery')}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-rose-300 border border-rose-500/20 font-semibold transition"
                >
                  {t('sampleLottery')}
                </button>
                <button
                  type="button"
                  onClick={() => loadSample('text', 'legit')}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-emerald-400 border border-emerald-500/20 font-semibold transition"
                >
                  {t('sampleSafe')}
                </button>
              </div>
            </div>
          </div>

          {/* Optional save history for logged in users */}
          {user && (
            <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
              <input
                type="checkbox"
                id="save_hist_check"
                checked={saveHistory}
                onChange={(e) => setSaveHistory(e.target.checked)}
                className="rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-0"
              />
              <label htmlFor="save_hist_check" className="cursor-pointer font-medium text-slate-300">
                {t('saveToHistory')}
              </label>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-white/5">
            <button
              type="button"
              onClick={handleClear}
              className="w-full sm:w-auto px-5 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 text-xs font-bold flex items-center justify-center gap-1.5 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t('clearAll')}</span>
            </button>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-9 py-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 transition transform active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>{t('scanning')}</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>{t('btnScan')}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* COMPREHENSIVE RISK RATING SYSTEM (MODIFIED LIKE PREVIOUS WITH ENHANCED LANGUAGE & VOICE) */}
      {scanResult && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="glass-panel rounded-3xl p-6 sm:p-9 border border-white/10 shadow-2xl relative overflow-hidden space-y-7">
            {/* Top Score & Risk Gauge Row */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-white/10">
              <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                {/* Visual Circular Gauge with Normalized Score */}
                <RiskGauge score={scanResult.risk_score} size={150} />

                <div className="space-y-2">
                  <div className="flex items-center gap-2 justify-center sm:justify-start">
                    {getRiskBadge(scanResult.risk_level)}
                    <span className="text-xs text-slate-400 font-medium">
                      {t('riskScore')}: <strong className="text-white font-extrabold">{scanResult.risk_score}</strong> {t('outOf100')}
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white capitalize">
                    {scanResult.label.replace('_', ' ')} {t('assessment')}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Model: <span className="text-slate-300 font-mono font-medium">{scanResult.model_type}</span>
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Scan Timestamp: {new Date(scanResult.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Action Buttons & Language Selector */}
              <div className="flex flex-col gap-2.5 w-full sm:w-auto">
                {/* Speaking Button: Speaks in selected language */}
                <button
                  type="button"
                  onClick={handleSpeakVerdict}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition shadow-md active:scale-95 ${
                    isSpeaking
                      ? 'bg-rose-600 text-white shadow-rose-600/40 ring-2 ring-rose-400/50'
                      : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white shadow-cyan-600/20'
                  }`}
                  title="Listen to the safety verdict spoken in your selected language"
                >
                  {isSpeaking ? (
                    <>
                      <VolumeX className="w-4 h-4 animate-pulse" />
                      <span>{t('stopVoice')}</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4" />
                      <span>{t('readAloud')}</span>
                    </>
                  )}
                </button>

                {/* In-Card Language Selector */}
                <div className="flex items-center justify-between gap-2 px-3 py-1.5 bg-slate-900/80 border border-white/10 rounded-xl text-xs">
                  <span className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                    <Globe className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>Voice Language:</span>
                  </span>
                  <select
                    value={language}
                    onChange={(e) => handleLanguageChange(e.target.value)}
                    className="bg-transparent font-bold text-cyan-300 focus:outline-none cursor-pointer text-xs"
                  >
                    {supportedLanguages.map((l) => (
                      <option key={l.code} value={l.code} className="bg-[#0b1222] text-white">
                        {l.native}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setReportModalOpen(true)}
                    className="flex-1 px-3.5 py-2 bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition"
                  >
                    <Flag className="w-3.5 h-3.5" />
                    <span>{t('reportThreat')}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleClear}
                    className="flex-1 px-3.5 py-2 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl border border-white/10 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{t('newScan')}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Detected Indicators & Reasons */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-400" />
                <span>{t('indicatorsHeading')}</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {scanResult.reasons.map((reason, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-[#080d19]/80 border border-white/5 flex items-start gap-3 text-xs text-slate-300 shadow-sm"
                  >
                    <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0 mt-1.5 shadow-sm shadow-cyan-400"></span>
                    <span className="leading-relaxed">{reason}</span>
                  </div>
                ))}
              </div>

              {scanResult.top_features && scanResult.top_features.length > 0 && (
                <div className="pt-2">
                  <p className="text-xs text-slate-400 font-semibold mb-2">{t('highInfluenceTokens')}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {scanResult.top_features.map((feat, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-blue-950/70 border border-blue-500/30 text-blue-300 text-[11px] font-mono font-medium"
                      >
                        {feat}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Recommended Safety Action */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-950/40 via-indigo-950/30 to-blue-950/40 border border-blue-500/30 space-y-1.5 shadow-md">
              <span className="text-[11px] uppercase font-bold text-cyan-400 tracking-wider block">
                {t('recommendedActionHeading')}
              </span>
              <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed">
                {scanResult.recommendation}
              </p>
            </div>

            {/* Emergency Helpline Box (When High Risk) */}
            {scanResult.risk_level === 'High Risk' && (
              <div className="p-5 rounded-2xl bg-gradient-to-r from-rose-950 via-red-950 to-rose-950 border border-rose-500/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm shadow-xl">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-rose-600/20 text-rose-400 flex items-center justify-center shrink-0 border border-rose-500/30">
                    <PhoneCall className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <p className="font-extrabold text-white text-sm">Already transferred money or entered OTP?</p>
                    <p className="text-rose-200/90 text-xs mt-0.5">
                      Call Indian National Cybercrime Helpline immediately to freeze fraudulent transfers:
                    </p>
                  </div>
                </div>
                <a
                  href="tel:1930"
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-extrabold rounded-xl transition shadow-lg shadow-rose-600/30 whitespace-nowrap text-xs sm:text-sm active:scale-95"
                >
                  {t('dialHelpline')}
                </a>
              </div>
            )}

            {/* Metadata specific notices */}
            {scanResult.metadata?.https_security_notice && (
              <div className="p-3.5 bg-amber-500/10 border border-amber-500/25 rounded-2xl text-xs text-amber-300 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                <span>{scanResult.metadata.https_security_notice}</span>
              </div>
            )}

            {/* Mandatory Disclaimer */}
            <div className="p-3.5 rounded-2xl bg-[#060a14] border border-white/5 text-[11px] text-slate-400 leading-relaxed">
              <strong className="text-slate-300">Disclaimer: </strong>
              {scanResult.disclaimer || t('disclaimer')}
            </div>

            {/* User Feedback Widget */}
            <FeedbackWidget scanId={scanResult.scan_id} />
          </div>
        </div>
      )}

      {/* Threat Report Submission Modal */}
      {scanResult && (
        <ReportModal
          isOpen={reportModalOpen}
          onClose={() => setReportModalOpen(false)}
          defaultContent={textContent || urlInput || emailBody}
          defaultCategory={
            activeTab === 'url' ? 'phishing_url' : activeTab === 'email' ? 'fraud_email' : 'scam_sms'
          }
          riskScore={scanResult.risk_score}
        />
      )}
    </div>
  );
}

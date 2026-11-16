import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Shield, ShieldAlert, LogOut, Menu, X, BarChart3, BookOpen, Search, PhoneCall, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { language, setLanguage, supportedLanguages, t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { name: t('navScanner'), path: '/scan', icon: Search },
    { name: t('navAwareness'), path: '/awareness', icon: BookOpen },
    ...(user ? [{ name: t('navDashboard'), path: '/dashboard', icon: BarChart3 }] : []),
    ...(isAdmin ? [{ name: t('navAdmin'), path: '/admin', icon: ShieldAlert, badge: 'ADMIN' }] : []),
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#060913]/90 backdrop-blur-xl border-b border-white/5 transition-all">
      {/* 24x7 Citizen Cyber Helpline Notice Bar */}
      <div className="bg-gradient-to-r from-rose-950/80 via-red-950/90 to-rose-950/80 border-b border-rose-500/20 py-1.5 px-3 text-center text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 flex-wrap">
          <span className="flex items-center gap-1.5 text-rose-300 font-semibold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
            <PhoneCall className="w-3.5 h-3.5 text-rose-400" />
            <span>{t('helplineText')}</span>
          </span>
          <a
            href="tel:1930"
            className="inline-flex items-center gap-1 font-bold text-white bg-rose-600 hover:bg-rose-500 px-3 py-0.5 rounded-full transition shadow-sm hover:shadow-rose-600/30 text-[11px] active:scale-95"
          >
            📞 1930
          </a>
          <a
            href="https://cybercrime.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="text-rose-200 hover:text-white underline text-[11px] hidden sm:inline transition"
          >
            {t('reportPortal')}
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-400 p-[1.5px] shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition">
              <div className="w-full h-full bg-[#080d1a] rounded-[10px] flex items-center justify-center">
                <Shield className="w-5 h-5 text-blue-400 group-hover:scale-110 transition transform duration-200" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight text-white group-hover:text-blue-400 transition">
                  ScamShield <span className="text-gradient-cyan">AI</span>
                </span>
                <span className="px-1.5 py-0.5 text-[9px] font-bold bg-blue-950/80 text-blue-400 border border-blue-800/60 rounded uppercase tracking-wider">
                  v1.0
                </span>
              </div>
              <p className="text-[9px] text-slate-400 font-semibold tracking-widest uppercase">Cyber Defense</p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-1.5 p-1 rounded-xl bg-slate-900/40 border border-white/5 backdrop-blur-md">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                    active
                      ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30 shadow-sm shadow-blue-500/10'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.icon && <link.icon className={`w-3.5 h-3.5 ${active ? 'text-blue-400' : 'opacity-70'}`} />}
                  <span>{link.name}</span>
                  {link.badge && (
                    <span className="ml-1 px-1.5 py-0.2 text-[8px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded tracking-wider">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Controls (Language Selector + Auth) */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language Preference Dropdown */}
            <div className="relative flex items-center">
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900/80 border border-white/10 hover:border-cyan-500/40 transition">
                <Globe className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="bg-transparent text-xs font-bold text-slate-200 focus:outline-none cursor-pointer pr-1"
                  title="Choose Language Preference"
                >
                  {supportedLanguages.map((l) => (
                    <option key={l.code} value={l.code} className="bg-[#0b1222] text-white">
                      {l.native} ({l.name})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900/60 border border-white/10 rounded-xl">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                    {user.full_name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-semibold text-white leading-none truncate max-w-[120px]">
                      {user.full_name}
                    </p>
                    <span className="text-[10px] text-blue-400 capitalize font-medium">{user.role}</span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 border border-transparent hover:border-rose-800/30 rounded-xl transition"
                  title={t('navLogout')}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition"
                >
                  {t('navLogin')}
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl shadow-md shadow-blue-600/25 transition active:scale-95"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="md:hidden flex items-center gap-2">
            {/* Compact Mobile Language Selector */}
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-900 border border-white/10 text-xs text-cyan-400">
              <Globe className="w-3 h-3" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent text-[11px] font-bold text-slate-200 focus:outline-none cursor-pointer"
              >
                {supportedLanguages.map((l) => (
                  <option key={l.code} value={l.code} className="bg-[#0b1222] text-white">
                    {l.native}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 border border-white/5 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0a0f1d] border-b border-white/10 px-4 pt-2 pb-4 space-y-2 animate-in fade-in">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3.5 py-2.5 rounded-xl text-sm font-semibold ${
                isActive(link.path)
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                  : 'text-slate-300 hover:bg-white/5'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{link.name}</span>
                {link.badge && (
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40 rounded">
                    {link.badge}
                  </span>
                )}
              </div>
            </Link>
          ))}

          <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
            {user ? (
              <div className="flex items-center justify-between p-2">
                <div className="text-sm">
                  <p className="font-semibold text-white">{user.full_name}</p>
                  <p className="text-xs text-slate-400">{user.email}</p>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="px-3 py-1.5 text-xs text-rose-300 border border-rose-800/40 rounded-xl bg-rose-950/30 font-semibold"
                >
                  {t('navLogout')}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 text-xs font-semibold text-slate-300 bg-white/5 border border-white/10 rounded-xl"
                >
                  {t('navLogin')}
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 text-xs font-bold text-white bg-blue-600 rounded-xl shadow-md"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

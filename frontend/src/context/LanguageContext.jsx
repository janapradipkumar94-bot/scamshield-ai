import React, { createContext, useContext, useState, useEffect } from 'react';
import { SUPPORTED_LANGUAGES, TRANSLATIONS } from '../utils/languages';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    try {
      return localStorage.getItem('scamshield_lang') || 'en';
    } catch {
      return 'en';
    }
  });

  const [voices, setVoices] = useState([]);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      const updateVoices = () => {
        const v = window.speechSynthesis.getVoices();
        if (v && v.length > 0) setVoices(v);
      };
      updateVoices();
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  const setLanguage = (newLang) => {
    if (TRANSLATIONS[newLang]) {
      setLanguageState(newLang);
      try {
        localStorage.setItem('scamshield_lang', newLang);
      } catch (e) {
        console.error('Failed to save language', e);
      }
    }
  };

  const t = (key) => {
    const langDict = TRANSLATIONS[language] || TRANSLATIONS.en;
    return langDict[key] || TRANSLATIONS.en[key] || key;
  };

  const currentLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  // Speech Helper that accurately speaks in selected language
  const speakVerdict = (scanResult, onStart, onEnd, onError) => {
    if (!window.speechSynthesis || !scanResult) return;

    window.speechSynthesis.cancel();

    const langDict = TRANSLATIONS[language] || TRANSLATIONS.en;
    let textGenerator = langDict.speechLowRisk;
    if (scanResult.risk_level === 'High Risk') {
      textGenerator = langDict.speechHighRisk;
    } else if (scanResult.risk_level === 'Suspicious') {
      textGenerator = langDict.speechSuspicious;
    }

    const textToSpeak = textGenerator(scanResult.risk_score);
    const utterance = new SpeechSynthesisUtterance(textToSpeak);

    // Set BCP-47 language tag
    utterance.lang = currentLangObj.bcp47;
    utterance.rate = 0.92;
    utterance.pitch = 1.0;

    // Try finding matching installed voice
    const availableVoices = voices.length > 0 ? voices : window.speechSynthesis.getVoices();
    if (availableVoices && availableVoices.length > 0) {
      const langPrefix = currentLangObj.bcp47.split('-')[0].toLowerCase();
      const matchedVoice = availableVoices.find(
        (v) =>
          v.lang.toLowerCase().replace('_', '-').startsWith(currentLangObj.bcp47.toLowerCase()) ||
          v.lang.toLowerCase().startsWith(langPrefix)
      );
      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }
    }

    utterance.onstart = () => {
      if (onStart) onStart();
    };
    utterance.onend = () => {
      if (onEnd) onEnd();
    };
    utterance.onerror = (e) => {
      if (onError) onError(e);
      if (onEnd) onEnd();
    };

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        currentLangObj,
        supportedLanguages: SUPPORTED_LANGUAGES,
        speakVerdict,
        stopSpeaking,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

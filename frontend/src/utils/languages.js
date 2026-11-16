export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', native: 'English', bcp47: 'en-IN' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', bcp47: 'hi-IN' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা', bcp47: 'bn-IN' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்', bcp47: 'ta-IN' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు', bcp47: 'te-IN' },
  { code: 'mr', name: 'Marathi', native: 'मराठी', bcp47: 'mr-IN' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી', bcp47: 'gu-IN' },
];

export const TRANSLATIONS = {
  en: {
    // Nav & Common
    appName: 'ScamShield AI',
    navScanner: 'Threat Scanner',
    navAwareness: 'Awareness Hub',
    navDashboard: 'Dashboard',
    navAdmin: 'Admin Console',
    navLogin: 'Sign In',
    navLogout: 'Sign Out',
    helplineText: 'National Cyber Crime Helpline: Dial 1930 immediately if you suspect online financial fraud.',
    reportPortal: 'Report to cybercrime.gov.in',

    // Scanner Hero
    scannerTitle: 'Inspect Any Message or Link',
    scannerSubtitle: 'Check whether an SMS, WhatsApp text, website URL, or email is authentic or an online fraud in 2 seconds.',
    tabText: 'SMS / Text Message',
    tabUrl: 'Website Link (URL)',
    tabEmail: 'Email Content',
    pasteAutoDetect: 'Paste & Auto-Detect',
    pasteMessage: 'Paste Message',
    pasteUrl: 'Paste Link',
    pasteEmail: 'Paste Email',
    loadExample: 'Or load a real-world example:',
    sampleKyc: '🏦 Bank KYC Block',
    samplePower: '⚡ Power Cut',
    sampleJob: '💼 YouTube Job',
    sampleLottery: '🎁 KBC Lottery',
    sampleSafe: '✅ Safe Message',
    saveToHistory: 'Save this scan to my account dashboard history',
    clearAll: 'Clear Everything',
    btnScan: 'Check This Now — Free',
    scanning: 'Evaluating Threat Indicators...',

    // Risk Ratings
    riskScore: 'Risk Score',
    outOf100: 'out of 100',
    highRisk: 'HIGH RISK DETECTED',
    suspicious: 'SUSPICIOUS CONTENT',
    lowRisk: 'LOW RISK / SAFE',
    assessment: 'Assessment',
    readAloud: '🔊 Read Aloud For Me',
    stopVoice: '⏹ Stop Voice',
    reportThreat: 'Report Threat',
    newScan: 'New Scan',
    indicatorsHeading: 'Detected Threat Indicators & Reasons',
    highInfluenceTokens: 'High-influence Signal Tokens:',
    recommendedActionHeading: 'Recommended Protective Action',
    dialHelpline: '📞 Dial 1930 Now',
    disclaimer: 'Disclaimer: Automated machine learning assessments serve as assistive cybersecurity intelligence and do not constitute formal legal counsel. Always exercise prudence before disclosing personal credentials.',

    // Voice Speeches
    speechHighRisk: (score) =>
      `Warning! High Risk Scam detected with risk score ${score} out of 100. Do not click links, and never share your OTP, UPI pin, or bank passwords with anyone. If you suspect fraud, call 1930 immediately.`,
    speechSuspicious: (score) =>
      `Caution! Suspicious content detected with risk score ${score} out of 100. Please verify the sender carefully before taking any action.`,
    speechLowRisk: (score) =>
      `Good news! Low risk content detected with score ${score} out of 100. No common scam tricks found. However, always remain cautious with unknown senders.`,
  },

  hi: {
    // Nav & Common
    appName: 'स्कैमशील्ड एआई',
    navScanner: 'थ्रेट स्कैनर',
    navAwareness: 'जागरूकता हब',
    navDashboard: 'डैशबोर्ड',
    navAdmin: 'एडमिन कंसोल',
    navLogin: 'लॉग इन',
    navLogout: 'लॉग आउट',
    helplineText: 'राष्ट्रीय साइबर अपराध हेल्पलाइन: ऑनलाइन धोखाधड़ी की स्थिति में तुरंत 1930 डायल करें।',
    reportPortal: 'cybercrime.gov.in पर रिपोर्ट करें',

    // Scanner Hero
    scannerTitle: 'किसी भी संदेश या लिंक की जांच करें',
    scannerSubtitle: 'जांचें कि कोई एसएमएस, व्हाट्सएप मैसेज, वेबसाइट लिंक या ईमेल असली है या ऑनलाइन फ्रॉड — सिर्फ 2 सेकंड में।',
    tabText: 'एसएमएस / टेक्स्ट मैसेज',
    tabUrl: 'वेबसाइट लिंक (URL)',
    tabEmail: 'ईमेल सामग्री',
    pasteAutoDetect: 'पेस्ट करें और ऑटो-डिटेक्ट',
    pasteMessage: 'मैसेज पेस्ट करें',
    pasteUrl: 'लिंक पेस्ट करें',
    pasteEmail: 'ईमेल पेस्ट करें',
    loadExample: 'या वास्तविक उदाहरण लोड करें:',
    sampleKyc: '🏦 बैंक केवाईसी ब्लॉक',
    samplePower: '⚡ बिजली कटौती',
    sampleJob: '💼 यूट्यूब टास्क जॉब',
    sampleLottery: '🎁 केबीसी लॉटरी',
    sampleSafe: '✅ सुरक्षित मैसेज',
    saveToHistory: 'इस स्कैन को मेरे अकाउंट इतिहास में सहेजें',
    clearAll: 'सब साफ करें',
    btnScan: 'अभी जांच करें — मुफ़्त',
    scanning: 'खतरे के संकेतों की जांच हो रही है...',

    // Risk Ratings
    riskScore: 'रिस्क स्कोर',
    outOf100: '100 में से',
    highRisk: 'उच्च जोखिम वाला फ्रॉड मिला',
    suspicious: 'संदिग्ध सामग्री — सावधान रहें',
    lowRisk: 'कम जोखिम / सुरक्षित',
    assessment: 'मूल्यांकन',
    readAloud: '🔊 बोलकर सुनाएं',
    stopVoice: '⏹ आवाज रोकें',
    reportThreat: 'फ्रॉड रिपोर्ट करें',
    newScan: 'नया स्कैन',
    indicatorsHeading: 'पहचाने गए खतरे के संकेत और कारण',
    highInfluenceTokens: 'उच्च प्रभाव वाले कीवर्ड टोकन:',
    recommendedActionHeading: 'सुरक्षा के लिए अनुशंसित कदम',
    dialHelpline: '📞 तुरंत 1930 डायल करें',
    disclaimer: 'अस्वीकरण: यह स्वचालित मशीन लर्निंग प्रणाली सहायक साइबर सुरक्षा विश्लेषण प्रदान करती है। कोई भी व्यक्तिगत विवरण साझा करने से पहले हमेशा सावधानी बरतें।',

    // Voice Speeches
    speechHighRisk: (score) =>
      `चेतावनी! उच्च जोखिम वाला फ्रॉड संदेश मिला है। रिस्क स्कोर 100 में से ${score} है। किसी भी लिंक पर क्लिक न करें, और अपना ओटीपी, यूपीआई पिन या बैंक पासवर्ड किसी को न दें। यदि फ्रॉड हुआ है तो तुरंत 1930 पर कॉल करें।`,
    speechSuspicious: (score) =>
      `सावधानी! संदिग्ध सामग्री पाई गई है। रिस्क स्कोर 100 में से ${score} है। कोई भी कदम उठाने से पहले संदेश भेजने वाले की पूरी जांच करें।`,
    speechLowRisk: (score) =>
      `अच्छी खबर! यह संदेश सुरक्षित और सामान्य लगता है। रिस्क स्कोर 100 में से ${score} है। कोई भी बड़ा फ्रॉड पैटर्न नहीं मिला। फिर भी अज्ञात संदेशों से सतर्क रहें।`,
  },

  bn: {
    // Nav & Common
    appName: 'স্ক্যামশিল্ড এআই',
    navScanner: 'থ্রেট স্ক্যানার',
    navAwareness: 'সচেতনতা হাব',
    navDashboard: 'ড্যাশবোর্ড',
    navAdmin: 'অ্যাডমিন কনসোল',
    navLogin: 'লগ ইন',
    navLogout: 'লগ আউট',
    helplineText: 'জাতীয় সাইবার ক্রাইম হেল্পলাইন: অনলাইন আর্থিক প্রতারণার শিকার হলে অবিলম্বে ১৯৩০ ডায়াল করুন।',
    reportPortal: 'cybercrime.gov.in-এ অভিযোগ করুন',

    // Scanner Hero
    scannerTitle: 'যেকোনো বার্তা বা লিঙ্ক পরীক্ষা করুন',
    scannerSubtitle: 'এসএমএস, হোয়াটসঅ্যাপ বার্তা, ওয়েবসাইট লিঙ্ক বা ইমেল খাঁটি নাকি অনলাইন প্রতারণা — মাত্র ২ সেকেন্ডে যাচাই করুন।',
    tabText: 'এসএমএস / বার্তা',
    tabUrl: 'ওয়েবসাইট লিঙ্ক (URL)',
    tabEmail: 'ইমেল কন্টেন্ট',
    pasteAutoDetect: 'পেস্ট এবং অটো-ডিটেক্ট',
    pasteMessage: 'বার্তা পেস্ট করুন',
    pasteUrl: 'লিঙ্ক পেস্ট করুন',
    pasteEmail: 'ইমেল পেস্ট করুন',
    loadExample: 'বা বাস্তব উদাহরণ লোড করুন:',
    sampleKyc: '🏦 ব্যাংক কেওয়াইসি ব্লক',
    samplePower: '⚡ বিদ্যুৎ সংযোগ বিচ্ছিন্ন',
    sampleJob: '💼 ইউটিউব টাস্ক জব',
    sampleLottery: '🎁 কেবিসি লটারি',
    sampleSafe: '✅ নিরাপদ বার্তা',
    saveToHistory: 'এই স্ক্যানটি আমার হিস্ট্রিতে সংরক্ষণ করুন',
    clearAll: 'সব মুছে ফেলুন',
    btnScan: 'এখনই পরীক্ষা করুন — বিনামূল্যে',
    scanning: 'বিপদ সংকেত বিশ্লেষণ করা হচ্ছে...',

    // Risk Ratings
    riskScore: 'ঝুঁকি স্কোর',
    outOf100: '১০০-র মধ্যে',
    highRisk: 'উচ্চ ঝুঁকির স্ক্যাম শনাক্ত হয়েছে',
    suspicious: 'সন্দেহজনক কন্টেন্ট — সতর্ক থাকুন',
    lowRisk: 'কম ঝুঁকি / নিরাপদ',
    assessment: 'মূল্যায়ন',
    readAloud: '🔊 পড়ে শোনান',
    stopVoice: '⏹ ভয়েস বন্ধ করুন',
    reportThreat: 'রিপোর্ট করুন',
    newScan: 'নতুন স্ক্যান',
    indicatorsHeading: 'শনাক্ত করা বিপদের কারণ ও সংকেত',
    highInfluenceTokens: 'প্রভাবশালী সিগন্যাল টোকেন:',
    recommendedActionHeading: 'প্রস্তাবিত সুরক্ষামূলক ব্যবস্থা',
    dialHelpline: '📞 অবিলম্বে ১৯৩০ ডায়াল করুন',
    disclaimer: 'দাবিত্যাগ: এটি একটি মেশিন লার্নিং সাইবার সিকিউরিটি বিশ্লেষণ। ব্যক্তিগত তথ্য বা ওটিপি শেয়ার করার আগে সর্বদা সতর্ক থাকুন।',

    // Voice Speeches
    speechHighRisk: (score) =>
      `সতর্কতা! উচ্চ ঝুঁকির স্ক্যাম শনাক্ত হয়েছে। ঝুঁকি স্কোর ১০০-তে ${score}। কোনো লিঙ্কে ক্লিক করবেন না, এবং আপনার ওটিপি, ইউপিআই পিন বা পাসওয়ার্ড কাউকে দেবেন না। জালিয়াতির শিকার হলে অবিলম্বে ১৯৩০ নম্বরে কল করুন।`,
    speechSuspicious: (score) =>
      `সাবধানতা! সন্দেহজনক কন্টেন্ট শনাক্ত হয়েছে। ঝুঁকি স্কোর ১০০-তে ${score}। কোনো পদক্ষেপ নেওয়ার আগে প্রেরকের সত্যতা ভালো করে যাচাই করুন।`,
    speechLowRisk: (score) =>
      `ভালো খবর! বার্তাটি নিরাপদ মনে হচ্ছে। ঝুঁকি স্কোর ১০০-তে ${score}। কোনো স্ক্যাম লক্ষণ পাওয়া যায়নি। তবুও অপরিচিত ব্যক্তির মেসেজে সতর্ক থাকুন।`,
  },

  ta: {
    // Nav & Common
    appName: 'ஸ்கேம்ஷீல்ட் AI',
    navScanner: 'அச்சுறுத்தல் ஸ்கேனர்',
    navAwareness: 'விழிப்புணர்வு தளம்',
    navDashboard: 'டாஷ்போர்டு',
    navAdmin: 'நிர்வாகப் பிரிவு',
    navLogin: 'உள்நுழைய',
    navLogout: 'வெளியேறு',
    helplineText: 'தேசிய சைபர் கிரைம் உதவி எண்: ஆன்லைன் நிதி மோசடிக்கு உடனடியாக 1930 ஐ அழைக்கவும்.',
    reportPortal: 'cybercrime.gov.in இல் புகாரளிக்கவும்',

    // Scanner Hero
    scannerTitle: 'எந்தவொரு செய்தி அல்லது இணைப்பையும் சோதிக்கவும்',
    scannerSubtitle: 'SMS, வாட்ஸ்அப் செய்தி, இணையதள இணைப்பு அல்லது மின்னஞ்சல் உண்மையானதா அல்லது மோசடியா என்பதை 2 வினாடிகளில் கண்டறியவும்.',
    tabText: 'SMS / உரைச் செய்தி',
    tabUrl: 'இணையதள இணைப்பு (URL)',
    tabEmail: 'மின்னஞ்சல் விவரம்',
    pasteAutoDetect: 'ஒட்டி தானாகக் கண்டறி',
    pasteMessage: 'செய்தியை ஒட்டுக',
    pasteUrl: 'இணைப்பை ஒட்டுக',
    pasteEmail: 'மின்னஞ்சலை ஒட்டுக',
    loadExample: 'அல்லது மாதிரி உதாரணத்தை ஏற்றவும்:',
    sampleKyc: '🏦 வங்கி KYC தடை',
    samplePower: '⚡ மின் தடை அறிவிப்பு',
    sampleJob: '💼 பகுதி நேர வேலை',
    sampleLottery: '🎁 KBC லாட்டரி',
    sampleSafe: '✅ பாதுகாப்பான செய்தி',
    saveToHistory: 'எனது கணக்கு வரலாற்றில் சேமிக்கவும்',
    clearAll: 'அனைத்தையும் அழிக்கவும்',
    btnScan: 'இப்போதே சரிபார்க்கவும் — இலவசம்',
    scanning: 'அச்சுறுத்தல் காரணிகள் பகுப்பாய்வு செய்யப்படுகின்றன...',

    // Risk Ratings
    riskScore: 'ஆபத்து மதிப்பீடு',
    outOf100: '100-க்கு',
    highRisk: 'அதிக ஆபத்து கண்டறியப்பட்டது',
    suspicious: 'சந்தேகத்திற்கிடமான உள்ளடக்கம்',
    lowRisk: 'குறைந்த ஆபத்து / பாதுகாப்பானது',
    assessment: 'மதிப்பீடு',
    readAloud: '🔊 குரலில் கேட்க',
    stopVoice: '⏹ குரலை நிறுத்து',
    reportThreat: 'மோசடியைப் புகாரளி',
    newScan: 'புதிய சோதனை',
    indicatorsHeading: 'கண்டறியப்பட்ட ஆபத்து அறிகுறிகள் மற்றும் காரணங்கள்',
    highInfluenceTokens: 'அதிக தாக்கம் கொண்ட சொற்கள்:',
    recommendedActionHeading: 'பரிந்துரைக்கப்பட்ட பாதுகாப்பு நடவடிக்கை',
    dialHelpline: '📞 1930 எண்ணை அழைக்கவும்',
    disclaimer: 'பொறுப்புத் துறப்பு: இந்த தானியங்கி இயந்திர கற்றல் மதிப்பீடு உதவிகரமான சைபர் பாதுகாப்பிற்கானது. முக்கியமான தகவல்களைப் பகிர்வதற்கு முன் எச்சரிக்கையாக இருங்கள்.',

    // Voice Speeches
    speechHighRisk: (score) =>
      `எச்சரிக்கை! அதிக ஆபத்தான மோசடி செய்தி கண்டறியப்பட்டது. ஆபத்து மதிப்பீடு 100-க்கு ${score}. எந்த இணைப்பையும் கிளிக் செய்யாதீர்கள், உங்கள் OTP அல்லது UPI PIN-ஐ யாரிடமும் பகிராதீர்கள். உடனடியாக 1930 என்ற எண்ணை அழைக்கவும்.`,
    speechSuspicious: (score) =>
      `கவனம்! சந்தேகத்திற்கிடமான உள்ளடக்கம் கண்டறியப்பட்டது. ஆபத்து மதிப்பீடு 100-க்கு ${score}. நடவடிக்கை எடுப்பதற்கு முன் அனுப்புநரை சரிபார்க்கவும்.`,
    speechLowRisk: (score) =>
      `நல்ல செய்தி! இது பாதுகாப்பான செய்தியாகத் தெரிகிறது. ஆபத்து மதிப்பீடு 100-க்கு ${score}. மோசடி அறிகுறிகள் ஏதும் இல்லை. இருப்பினும் விழிப்புடன் இருங்கள்.`,
  },

  te: {
    // Nav & Common
    appName: 'స్కామ్‌షీల్డ్ AI',
    navScanner: 'థ్రెట్ స్కానర్',
    navAwareness: 'అవగాహన కేంద్రం',
    navDashboard: 'డ్యాష్‌బోర్డ్',
    navAdmin: 'అడ్మిన్ కన్సోల్',
    navLogin: 'లాగిన్',
    navLogout: 'లాగ్ అవుట్',
    helplineText: 'జాతీయ సైబర్ క్రైమ్ హెల్ప్‌లైన్: ఆన్‌లైన్ మోసం జరిగినప్పుడు వెంటనే 1930 కి కాల్ చేయండి.',
    reportPortal: 'cybercrime.gov.in లో రిపోర్ట్ చేయండి',

    // Scanner Hero
    scannerTitle: 'ఏదైనా సందేశం లేదా లింక్‌ను తనిఖీ చేయండి',
    scannerSubtitle: 'SMS, వాట్సాప్ సందేశం, వెబ్‌సైట్ లింక్ లేదా ఈమెయిల్ నిజమైనదా లేక ఆన్‌లైన్ మోసమా అనేది కేవలం 2 సెకన్లలో తెలుసుకోండి.',
    tabText: 'SMS / సందేశం',
    tabUrl: 'వెబ్‌సైట్ లింక్ (URL)',
    tabEmail: 'ఈమెయిల్ కంటెంట్',
    pasteAutoDetect: 'పేస్ట్ & ఆటో-డిటెక్ట్',
    pasteMessage: 'సందేశం పేస్ట్ చేయండి',
    pasteUrl: 'లింక్ పేస్ట్ చేయండి',
    pasteEmail: 'ఈమెయిల్ పేస్ట్ చేయండి',
    loadExample: 'లేదా ఉదాహరణను లోడ్ చేయండి:',
    sampleKyc: '🏦 బ్యాంక్ KYC బ్లాక్',
    samplePower: '⚡ విద్యుత్ నిలిపివేత',
    sampleJob: '💼 యూట్యూబ్ టాస్క్ జాబ్',
    sampleLottery: '🎁 KBC లాటరీ',
    sampleSafe: '✅ సురక్షిత సందేశం',
    saveToHistory: 'ఈ స్కాన్‌ను నా హిస్టరీలో సేవ్ చేయండి',
    clearAll: 'అన్నీ క్లియర్ చేయండి',
    btnScan: 'ఇప్పుడే తనిఖీ చేయండి — ఉచితం',
    scanning: 'ప్రమాద సంకేతాలను విశ్లేషిస్తోంది...',

    // Risk Ratings
    riskScore: 'రిస్క్ స్కోర్',
    outOf100: '100 కి',
    highRisk: 'అధిక ప్రమాదం గుర్తించబడింది',
    suspicious: 'అనుమానాస్పద కంటెంట్ — జాగ్రత్త',
    lowRisk: 'తక్కువ ప్రమాదం / సురక్షితం',
    assessment: 'మూల్యాంకనం',
    readAloud: '🔊 బిగ్గరగా వినండి',
    stopVoice: '⏹ వాయిస్ ఆపండి',
    reportThreat: 'మోసాన్ని నివేదించండి',
    newScan: 'కొత్త స్కాన్',
    indicatorsHeading: 'గుర్తించబడిన ప్రమాద సూచికలు మరియు కారణాలు',
    highInfluenceTokens: 'ప్రభావవంతమైన కీవర్డ్ టోకెన్లు:',
    recommendedActionHeading: 'రక్షణ కోసం సిఫార్సు చేసిన చర్యలు',
    dialHelpline: '📞 వెంటనే 1930 కి కాల్ చేయండి',
    disclaimer: 'నిరాకరణ: ఇది సహాయక సైబర్ సెక్యూరిటీ విశ్లేషణ. సమాచారాన్ని లేదా OTPని పంచుకునే ముందు ఎల్లప్పుడూ జాగ్రత్తగా ఉండండి.',

    // Voice Speeches
    speechHighRisk: (score) =>
      `హెచ్చరిక! అధిక ప్రమాదకర మోసపూరిత సందేశం గుర్తించబడింది. రిస్క్ స్కోర్ 100 కి ${score}. లింక్‌లపై క్లిక్ చేయవద్దు, OTP లేదా UPI పిన్ ఎవరితోనూ పంచుకోవద్దు. వెంటనే 1930 కి కాల్ చేయండి.`,
    speechSuspicious: (score) =>
      `జాగ్రత్త! అనుమానాస్పద సందేశం గుర్తించబడింది. రిస్క్ స్కోర్ 100 కి ${score}. ఏ చర్య తీసుకునే ముందైనా పంపినవారిని ధృవీకరించండి.`,
    speechLowRisk: (score) =>
      `మంచి వార్త! ఈ సందేశం సురక్షితంగా ఉంది. రిస్క్ స్కోర్ 100 కి ${score}. ఎటువంటి మోసపూరిత సంకేతాలు కనిపించలేదు.`,
  },

  mr: {
    // Nav & Common
    appName: 'स्कॅमशील्ड AI',
    navScanner: 'थ्रेट स्कॅनर',
    navAwareness: 'जागरूकता केंद्र',
    navDashboard: 'डॅशबोर्ड',
    navAdmin: 'अ‍ॅडमिन कन्सोल',
    navLogin: 'साइन इन',
    navLogout: 'साइन आउट',
    helplineText: 'राष्ट्रीय सायबर गुन्हे हेल्पलाइन: ऑनलाइन आर्थिक फसवणूक झाल्यास त्वरित १९३० वर संपर्क साधा.',
    reportPortal: 'cybercrime.gov.in वर तक्रार नोंदवा',

    // Scanner Hero
    scannerTitle: 'कोणताही मेसेज किंवा लिंक तपासा',
    scannerSubtitle: 'एसएमएस, व्हॉट्सअ‍ॅप मेसेज, वेबसाइट लिंक किंवा ईमेल खरा आहे की ऑनलाइन घोटाळा — फक्त २ सेकंदात तपासा.',
    tabText: 'SMS / मजकूर मेसेज',
    tabUrl: 'वेबसाइट लिंक (URL)',
    tabEmail: 'ईमेल मजकूर',
    pasteAutoDetect: 'पेस्ट करा आणि ऑटो-डिटेक्ट',
    pasteMessage: 'मेसेज पेस्ट करा',
    pasteUrl: 'लिंक पेस्ट करा',
    pasteEmail: 'ईमेल पेस्ट करा',
    loadExample: 'किंवा उदाहरण लोड करा:',
    sampleKyc: '🏦 बँक केवायसी ब्लॉक',
    samplePower: '⚡ वीज पुरवठा खंडित',
    sampleJob: '💼 यूट्यूब टास्क जॉब',
    sampleLottery: '🎁 केबीसी लॉटरी',
    sampleSafe: '✅ सुरक्षित मेसेज',
    saveToHistory: 'हा स्कॅन माझ्या खात्यात जतन करा',
    clearAll: 'सर्व साफ करा',
    btnScan: 'आता तपासा — विनामूल्य',
    scanning: 'धोक्याच्या घटकांचे विश्लेषण होत आहे...',

    // Risk Ratings
    riskScore: 'जोखीम गुण',
    outOf100: '१०० पैकी',
    highRisk: 'उच्च जोखीम घोटाळा आढळला',
    suspicious: 'संशयास्पद संदेश — काळजी घ्या',
    lowRisk: 'कमी जोखीम / सुरक्षित',
    assessment: 'मूल्यांकन',
    readAloud: '🔊 आवाजात ऐका',
    stopVoice: '⏹ आवाज थांबवा',
    reportThreat: 'तक्रार नोंदवा',
    newScan: 'नवीन स्कॅन',
    indicatorsHeading: 'आढळलेले धोक्याचे संकेत आणि कारणे',
    highInfluenceTokens: 'उच्च प्रभावाचे कीवर्ड्स:',
    recommendedActionHeading: 'सुरक्षेसाठी शिफारस केलेली कृती',
    dialHelpline: '📞 त्वरित १९३० डायल करा',
    disclaimer: 'अस्वीकरण: हे स्वयंचलित मशीन लर्निंग सायबर विश्लेषण आहे. कोणताही ओटीपी किंवा पासवर्ड शेअर करण्यापूर्वी सावधगिरी बाळगा.',

    // Voice Speeches
    speechHighRisk: (score) =>
      `धोका! उच्च जोखमीचा घोटाळा आढळला आहे. जोखीम गुण १०० पैकी ${score} आहेत. कोणत्याही लिंकवर क्लिक करू नका आणि तुमचा ओटीपी किंवा यूपीआय पिन कोणालाही देऊ नका. त्वरित १९३० वर संपर्क साधा.`,
    speechSuspicious: (score) =>
      `सावधान! संशयास्पद संदेश आढळला आहे. जोखीम गुण १०० पैकी ${score} आहेत. कोणतीही कृती करण्यापूर्वी पाठवणाऱ्याची खात्री करा.`,
    speechLowRisk: (score) =>
      `चांगली बातमी! हा संदेश सुरक्षित वाटतो. जोखीम गुण १०० पैकी ${score} आहेत. घोटाळ्याचे कोणतेही स्पष्ट संकेत आढळले नाहीत.`,
  },

  gu: {
    // Nav & Common
    appName: 'સ્કેમશીલ્ડ AI',
    navScanner: 'થ્રેટ સ્કેનર',
    navAwareness: 'જાગૃતિ કેન્દ્ર',
    navDashboard: 'ડેશબોર્ડ',
    navAdmin: 'એડમિન કન્સોલ',
    navLogin: 'સાઇન ઇન',
    navLogout: 'સાઇન આઉટ',
    helplineText: 'રાષ્ટ્રીય સાયબર ક્રાઈમ હેલ્પલાઇન: ઓનલાઇન છેતરપિંડીના કિસ્સામાં તાત્કાલિક 1930 ડાયલ કરો.',
    reportPortal: 'cybercrime.gov.in પર ફરિયાદ કરો',

    // Scanner Hero
    scannerTitle: 'કોઈપણ સંદેશ અથવા લિંક તપાસો',
    scannerSubtitle: 'SMS, WhatsApp મેસેજ, વેબસાઇટ લિંક અથવા ઇમેઇલ સાચો છે કે ઓનલાઇન છેતરપિંડી — માત્ર 2 સેકન્ડમાં તપાસો.',
    tabText: 'SMS / ટેક્સ્ટ મેસેજ',
    tabUrl: 'વેબસાઇટ લિંક (URL)',
    tabEmail: 'ઇમેઇલ સામગ્રી',
    pasteAutoDetect: 'પેસ્ટ કરો અને ઓટો-ડિટેક્ટ',
    pasteMessage: 'મેસેજ પેસ્ટ કરો',
    pasteUrl: 'લિંક પેસ્ટ કરો',
    pasteEmail: 'ઇમેઇલ પેસ્ટ કરો',
    loadExample: 'અથવા ઉદાહરણ લોડ કરો:',
    sampleKyc: '🏦 બેંક KYC બ્લોક',
    samplePower: '⚡ વીજળી કાપ નોટિસ',
    sampleJob: '💼 યુટ્યુબ ટાસ્ક જોબ',
    sampleLottery: '🎁 KBC લોટરી',
    sampleSafe: '✅ સુરક્ષિત મેસેજ',
    saveToHistory: 'આ સ્કેન મારા ખાતામાં સાચવો',
    clearAll: 'બધું સાફ કરો',
    btnScan: 'હમણાં તપાસો — મફત',
    scanning: 'જોખમી સંકેતોનું વિશ્લેષણ કરી રહ્યું છે...',

    // Risk Ratings
    riskScore: 'જોખમ સ્કોર',
    outOf100: '100 માંથી',
    highRisk: 'ઉચ્ચ જોખમ છેતરપિંડી મળી',
    suspicious: 'શંકાસ્પદ સંદેશ — સાવચેત રહો',
    lowRisk: 'ઓછું જોખમ / સુરક્ષિત',
    assessment: 'મૂલ્યાંકન',
    readAloud: '🔊 અવાજમાં સાંભળો',
    stopVoice: '⏹ અવાજ બંધ કરો',
    reportThreat: 'ફરિયાદ નોંધાવો',
    newScan: 'નવું સ્કેન',
    indicatorsHeading: 'શોધાયેલ જોખમના સંકેતો અને કારણો',
    highInfluenceTokens: 'મહત્વના કીવર્ડ ટોકન્સ:',
    recommendedActionHeading: 'સુરક્ષા માટે ભલામણ કરેલ પગલાં',
    dialHelpline: '📞 તાત્કાલિક 1930 ડાયલ કરો',
    disclaimer: 'ડિસ્ક્લેમર: આ સ્વચાલિત મશીન લર્નિંગ વિશ્લેષણ છે. કોઈપણ અંગત વિગતો અથવા OTP શેર કરતા પહેલા હંમેશા સાવચેતી રાખો.',

    // Voice Speeches
    speechHighRisk: (score) =>
      `ચેતવણી! ઉચ્ચ જોખમ ધરાવતો સ્કેમ સંદેશ મળ્યો છે. જોખમ સ્કોર 100 માંથી ${score} છે. કોઈપણ લિંક પર ક્લિક ન કરો અને તમારો OTP અથવા UPI પિન શેર ન કરો. તાત્કાલિક 1930 પર કૉલ કરો.`,
    speechSuspicious: (score) =>
      `સાવધાની! શંકાસ્પદ સંદેશ મળ્યો છે. જોખમ સ્કોર 100 માંથી ${score} છે. કોઈપણ પગલું ભરતા પહેલા મોકલનારની ખાતરી કરો.`,
    speechLowRisk: (score) =>
      `સારા સમાચાર! આ સંદેશ સુરક્ષિત જણાય છે. જોખમ સ્કોર 100 માંથી ${score} છે. સ્કેમના કોઈ સ્પષ્ટ સંકેતો નથી.`,
  },
};


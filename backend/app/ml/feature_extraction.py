"""
Feature extraction module for text and URL scam detection in ScamShield AI.
Provides lexical, heuristic, structural, and behavioral feature extractors.
"""

import math
import re
from urllib.parse import urlparse
from typing import Dict, Any, List

# Suspicious TLDs commonly seen in phishing and fraud
SUSPICIOUS_TLDS = {
    "xyz", "top", "work", "club", "buzz", "click", "cc", "site", "online",
    "vip", "shop", "biz", "info", "link", "gq", "cf", "tk", "ml", "ga"
}

# High-profile brands often targeted by impersonation
TARGET_BRANDS = [
    "sbi", "hdfc", "icici", "axis", "paytm", "phonepe", "gpay", "google",
    "microsoft", "apple", "netflix", "amazon", "flipkart", "paypal", "fedex",
    "dhl", "ups", "indiapost", "whatsapp", "telegram", "facebook", "instagram"
]

# High-risk urgency and coercion phrases
URGENCY_PATTERNS = [
    r"\bimmediately\b", r"\burgent\b", r"\bwithin \d+ hours?\b", r"\bwithin \d+ minutes?\b",
    r"\b(?:act|expire[sd]?|suspended|blocked|disconnect(?:ed)?|cutoff)\s+today\b",
    r"\btoday\s+only\b", r"\btonight\s+by\b", r"\baccount (?:will be )?blocked\b",
    r"\baccount (?:will be )?suspended\b", r"\bdeactivated\b", r"\bdisconnected\b",
    r"\bpolice arrest\b", r"\bwarrant\b", r"\blawsuit\b", r"\bpower cutoff\b",
    r"\bterminated\b", r"\bcourt notice\b", r"\belectricity officer\b", r"\bpower supply\b",
    r"\bunpaid bill\b", r"\baction required\b", r"\blight bill\b", r"\bbijli\b"
]

# Sensitive credentials and financial harvesting triggers
SENSITIVE_PATTERNS = [
    r"\b(?:share|send|give|tell|reply\s+with|submit|enter|update|verify|confirm)\s+(?:the\s+|your\s+|me\s+)?(?:otp|pin|password|cvv|code)\b",
    r"\botp\s+(?:to\s+cancel|for\s+verification|to\s+receive|to\s+claim)\b",
    r"\bshare\s+your\s+code\b",
    r"\bseed\s+phrase\b", r"\bcvv\b",
    r"\bpan\s+card\b", r"\baadhaar\b", r"\bkyc\s+update\b", r"\bvideo\s+kyc\b",
    r"\btransfer\s+fee\b", r"\bregistration\s+fee\b", r"\bprocessing\s+fee\b", r"\bsecurity\s+deposit\b",
    r"\bdownload\s+apk\b", r"\b\.apk\b", r"\binstall\s+app\b", r"\bwire\s+money\b"
]

# Unrealistic monetary claims / prize / job offers
REWARD_PATTERNS = [
    r"\bwon\b", r"\blottery\b", r"\bcrore\b", r"\blakhs?\b", r"\bguaranteed (?:returns?|profit)\b",
    r"\bfree iphone\b", r"\bpart time job\b", r"\bearn \d+ daily\b", r"\bearn money\b", r"\bdaily income\b",
    r"\blike youtube\b", r"\b300% profit\b", r"\bdouble your\b", r"\bcashback\b", r"\bgift voucher\b",
    r"\blucky draw\b", r"\bkbc\b", r"\bcongratulations\b", r"\bshortlisted\b", r"\bwork from home\b"
]

# Contact redirection signals
CONTACT_PATTERNS = [
    r"wa\.me\/\d+", r"t\.me\/[a-zA-Z0-9_]+", r"telegram:?\s*@\w+", r"whatsapp:?\s*[\+\d\s\-]{8,}",
    r"anydesk", r"teamviewer", r"\bcontact on whatsapp\b", r"\bjoin telegram\b"
]


def calculate_entropy(text: str) -> float:
    """Calculate Shannon entropy of a string."""
    if not text:
        return 0.0
    freq: Dict[str, int] = {}
    for char in text:
        freq[char] = freq.get(char, 0) + 1
    entropy = 0.0
    length = len(text)
    for count in freq.values():
        p = count / length
        entropy -= p * math.log2(p)
    return round(entropy, 3)


def extract_text_indicators(text: str) -> Dict[str, Any]:
    """
    Extract heuristic indicators from text for explainability and feature enrichment.
    """
    lower = text.lower()
    indicators: List[str] = []
    category_signals: Dict[str, int] = {
        "urgency": 0,
        "sensitive_request": 0,
        "unrealistic_reward": 0,
        "contact_redirection": 0
    }

    # Urgency check
    for pattern in URGENCY_PATTERNS:
        if re.search(pattern, lower):
            category_signals["urgency"] += 1
    if category_signals["urgency"] > 0:
        indicators.append("Urgent or coercive pressure tactics detected (threat of suspension, cutoff, or arrest)")

    # Check for authentic transactional safety disclaimers (e.g. "Do not share OTP with anyone")
    has_defensive_disclaimer = bool(re.search(r"\b(?:do\s+not|never)\s+share\b|\bvalid\s+for\s+\d+\s+min", lower))

    # Sensitive info check
    for pattern in SENSITIVE_PATTERNS:
        if re.search(pattern, lower):
            category_signals["sensitive_request"] += 1

    if has_defensive_disclaimer and category_signals["sensitive_request"] == 0:
        indicators.append("Includes standard transactional safety disclaimer ('Never share OTP with anyone')")
    elif category_signals["sensitive_request"] > 0:
        indicators.append("Request for confidential information (OTP, PIN, CVV, or identity documents)")

    # Reward / job check
    for pattern in REWARD_PATTERNS:
        if re.search(pattern, lower):
            category_signals["unrealistic_reward"] += 1
    if category_signals["unrealistic_reward"] > 0:
        indicators.append("Unrealistic prize, lottery, or work-from-home earning claim")

    # Redirection check
    for pattern in CONTACT_PATTERNS:
        if re.search(pattern, lower):
            category_signals["contact_redirection"] += 1
    if category_signals["contact_redirection"] > 0:
        indicators.append("Redirection to external unverified messaging apps (WhatsApp / Telegram / Remote access)")

    # URL presence in text
    extracted_urls = re.findall(r"https?://[^\s<>\"']+|www\.[^\s<>\"']+", text)
    if extracted_urls:
        indicators.append(f"Contains {len(extracted_urls)} web link(s) embedded in the message")

    return {
        "indicators": indicators,
        "signals": category_signals,
        "urls": extracted_urls,
        "text_length": len(text),
        "word_count": len(text.split()),
        "has_phone": bool(re.search(r"(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}", text))
    }


def extract_url_features(url_str: str) -> Dict[str, Any]:
    """
    Extract structural and lexical cybersecurity features from a given URL string.
    DOES NOT make live network requests to malicious targets.
    """
    # Normalize scheme if missing for parsing
    has_scheme = bool(re.match(r"^https?://", url_str, re.IGNORECASE))
    parsed_candidate = url_str if has_scheme else "http://" + url_str
    
    try:
        parsed = urlparse(parsed_candidate)
        hostname = (parsed.hostname or "").lower()
        path = parsed.path.lower()
        query = parsed.query.lower()
    except Exception:
        hostname = ""
        path = ""
        query = ""

    # Check for IP address in hostname
    is_ip = bool(re.match(r"^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$", hostname))
    
    # Subdomain count
    host_parts = hostname.split(".")
    tld = host_parts[-1] if host_parts else ""
    subdomain_count = max(0, len(host_parts) - 2) if not is_ip else 0

    # Suspicious TLD
    has_suspicious_tld = tld in SUSPICIOUS_TLDS

    # Check brand impersonation / spoofing
    # e.g., 'sbi-kyc-update.xyz' contains brand 'sbi' but is not official domain 'sbi.co.in'
    detected_brands: List[str] = []
    for brand in TARGET_BRANDS:
        if brand in hostname:
            # Check if it's the legitimate exact domain
            legitimate_domains = [f"{brand}.com", f"{brand}.co.in", f"{brand}.in", f"{brand}.org", f"{brand}.net"]
            if not any(hostname == leg or hostname.endswith("." + leg) for leg in legitimate_domains):
                detected_brands.append(brand)

    # Suspicious keywords in path/subdomain
    suspicious_path_keywords = [
        "login", "verify", "update", "secure", "banking", "account", "wallet",
        "confirm", "kyc", "claim", "prize", "gift", "airdrop", "free", "dispute"
    ]
    matched_path_keywords = [kw for kw in suspicious_path_keywords if kw in path or kw in query or kw in hostname]

    # Structural anomalies
    entropy = calculate_entropy(hostname)
    has_at_symbol = "@" in url_str
    has_double_slash = "//" in path
    has_hyphens = hostname.count("-") >= 2
    port_present = bool(parsed.port and parsed.port not in (80, 443))

    reasons: List[str] = []
    if is_ip:
        reasons.append("Host is an IP address instead of a recognized domain name")
    if has_suspicious_tld:
        reasons.append(f"Domain uses high-risk top-level domain (.{tld}) frequently abused in phishing")
    if detected_brands:
        reasons.append(f"Potential brand impersonation detected for: {', '.join(detected_brands).upper()}")
    if matched_path_keywords:
        reasons.append(f"Suspicious sensitive authentication/claim terms in URL: {', '.join(matched_path_keywords[:3])}")
    if has_at_symbol:
        reasons.append("Contains '@' symbol used to obscure true destination authority")
    if has_hyphens:
        reasons.append("Unusual number of hyphens in domain, common in typo-squatting")
    if entropy > 3.8:
        reasons.append(f"High domain entropy ({entropy}) indicating possible algorithmic generation or randomness")
    if len(url_str) > 75:
        reasons.append("Excessive URL length commonly used to conceal redirect targets")

    # Important security notice:
    uses_https = parsed.scheme.lower() == "https"
    
    return {
        "url": url_str,
        "hostname": hostname,
        "is_ip": is_ip,
        "tld": tld,
        "has_suspicious_tld": has_suspicious_tld,
        "detected_brands": detected_brands,
        "matched_keywords": matched_path_keywords,
        "subdomain_count": subdomain_count,
        "url_length": len(url_str),
        "entropy": entropy,
        "has_at_symbol": has_at_symbol,
        "uses_https": uses_https,
        "port_present": port_present,
        "reasons": reasons
    }

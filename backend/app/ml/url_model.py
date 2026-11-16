"""
URL Cybersecurity Analysis Engine for ScamShield AI.
Performs lexical, topological, and heuristic threat assessment on submitted URLs.
IMPORTANT: Never attempts live socket requests or browser executions of target URLs.
Clearly identifies assessment as a cybersecurity heuristic model.
"""

from typing import Dict, Any, List
from .feature_extraction import extract_url_features


class URLAnalyzer:
    def __init__(self):
        self.model_type = "Cybersecurity Heuristic Feature Analyzer"

    def analyze(self, url: str) -> Dict[str, Any]:
        """
        Analyze suspicious URL without executing or fetching live content.
        Computes risk score (0-100), risk level, structural anomalies, and safety actions.
        """
        if not url or not url.strip():
            return {
                "label": "empty",
                "risk_score": 0,
                "risk_level": "Low Risk",
                "reasons": ["No URL provided"],
                "recommendation": "Enter a valid website link to scan.",
                "model_type": self.model_type
            }

        url_str = url.strip()
        features = extract_url_features(url_str)
        reasons: List[str] = list(features["reasons"])
        
        # Calculate risk score based on cybersecurity risk weighting
        score = 10  # Base unknown risk

        # 1. IP address instead of domain (+45)
        if features["is_ip"]:
            score += 45

        # 2. High-risk TLD (+35)
        if features["has_suspicious_tld"]:
            score += 35

        # 3. Brand impersonation / typosquatting (+45)
        if features["detected_brands"]:
            score += 45

        # 4. Sensitive auth keywords in path / query (+25)
        if features["matched_keywords"]:
            score += min(35, len(features["matched_keywords"]) * 15)

        # 5. Excessive subdomains (+20)
        if features["subdomain_count"] >= 3:
            score += 20
            reasons.append(f"Excessive number of subdomains ({features['subdomain_count']}) commonly used to disguise malicious destinations")

        # 6. '@' character or non-standard port (+30)
        if features["has_at_symbol"]:
            score += 30
        if features["port_present"]:
            score += 20
            reasons.append("Non-standard web port specified in URL")

        # 7. High entropy (+15)
        if features["entropy"] > 4.0:
            score += 15

        # Cap score between 0 and 100
        risk_score = max(5, min(100, score))

        # Risk classification
        if risk_score >= 70:
            risk_level = "High Risk"
            label = "phishing"
        elif risk_score >= 30:
            risk_level = "Suspicious"
            label = "suspicious"
        else:
            risk_level = "Low Risk"
            label = "low_risk"

        if not reasons:
            reasons.append("Domain and path structures do not exhibit known malicious topological indicators")

        # Explicit educational notice about HTTPS
        https_notice = "HTTPS encryption encrypts data in transit but DOES NOT verify legitimacy; fraudulent sites frequently obtain valid SSL certificates."
        
        # Recommendations
        if risk_level == "High Risk":
            recommendation = "DO NOT open or visit this URL. Do not enter credentials, phone numbers, or credit card information. If you arrived here from an SMS or email, report the sender."
        elif risk_level == "Suspicious":
            recommendation = "Exercise caution. Verify the official organization domain by manually searching for their verified homepage on Google or official directories before navigating."
        else:
            recommendation = "The URL exhibits low structural risk. However, stay vigilant and confirm the URL matches the official organization before logging in."

        return {
            "label": label,
            "risk_score": risk_score,
            "risk_level": risk_level,
            "input_type": "url",
            "url": url_str,
            "hostname": features["hostname"],
            "features": {
                "is_ip": features["is_ip"],
                "tld": features["tld"],
                "uses_https": features["uses_https"],
                "entropy": features["entropy"],
                "subdomains": features["subdomain_count"],
                "detected_brands": features["detected_brands"],
                "suspicious_terms": features["matched_keywords"]
            },
            "reasons": reasons,
            "https_security_notice": https_notice,
            "recommendation": recommendation,
            "model_type": self.model_type,
            "is_model_trained": False,  # Transparently declared as heuristic cybersecurity analyzer
            "disclaimer": "URL analysis is performed via static structural and lexical heuristics without live navigation. Low risk is not a guarantee of safety."
        }

"""
Email Scam & Phishing Detection Engine for ScamShield AI.
Combines header parsing, body NLP text classification, sender domain validation,
and embedded link security analysis.
"""

import re
from typing import Dict, Any, List
from .text_model import ScamTextClassifier
from .url_model import URLAnalyzer


class EmailAnalyzer:
    def __init__(self, text_classifier: ScamTextClassifier, url_analyzer: URLAnalyzer):
        self.text_classifier = text_classifier
        self.url_analyzer = url_analyzer

    def analyze(self, email_content: str, sender: str = "", subject: str = "") -> Dict[str, Any]:
        """
        Analyze pasted email content.
        Can parse embedded 'From:', 'Subject:', 'Date:' headers if included in raw paste.
        """
        if not email_content or not email_content.strip():
            return {
                "label": "empty",
                "risk_score": 0,
                "risk_level": "Low Risk",
                "reasons": ["Email content was empty"],
                "recommendation": "Paste the email subject and body to scan.",
                "model_type": "hybrid_email_scanner"
            }

        parsed_sender = sender
        parsed_subject = subject
        body = email_content

        # Extract headers if user pasted entire raw email
        from_match = re.search(r"^(?:from|sender):\s*(.+)$", email_content, re.IGNORECASE | re.MULTILINE)
        if from_match and not parsed_sender:
            parsed_sender = from_match.group(1).strip()

        subject_match = re.search(r"^subject:\s*(.+)$", email_content, re.IGNORECASE | re.MULTILINE)
        if subject_match and not parsed_subject:
            parsed_subject = subject_match.group(1).strip()

        combined_text = f"{parsed_subject} {body}".strip()

        # 1. Text Classification
        text_result = self.text_classifier.predict(combined_text)
        reasons: List[str] = list(text_result.get("reasons", []))
        signals = text_result.get("signals", {})

        # 2. Extract and analyze embedded links
        embedded_urls = re.findall(r"https?://[^\s<>\"']+|www\.[^\s<>\"']+", body)
        url_results = []
        max_url_risk = 0
        for u in embedded_urls[:5]:  # Analyze up to top 5 links
            u_res = self.url_analyzer.analyze(u)
            url_results.append(u_res)
            if u_res["risk_score"] > max_url_risk:
                max_url_risk = u_res["risk_score"]

        # 3. Sender spoofing / free webmail detection
        sender_warning = None
        if parsed_sender:
            sender_lower = parsed_sender.lower()
            free_mail_providers = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "rediffmail.com"]
            # Check if claimed brand is being sent from free webmail
            corporate_brands = ["paypal", "amazon", "apple", "netflix", "microsoft", "sbi", "hdfc", "icici", "fedex"]
            claims_brand = any(brand in combined_text.lower() for brand in corporate_brands)
            is_free_mail = any(provider in sender_lower for provider in free_mail_providers)
            
            if claims_brand and is_free_mail:
                sender_warning = f"Sender uses a public free email provider ({parsed_sender}) while claiming to represent a commercial institution"
                reasons.insert(0, sender_warning)

        # 4. Synthesize final risk score
        text_score = text_result.get("risk_score", 0)
        final_score = text_score

        # If high risk URL embedded, elevate score
        if max_url_risk >= 70:
            final_score = max(final_score, int(max_url_risk * 0.95))
            if "Contains malicious or high-risk phishing destination link" not in reasons:
                reasons.append("Contains malicious or high-risk phishing destination link")
        elif max_url_risk >= 40:
            final_score = max(final_score, final_score + 15)

        if sender_warning:
            final_score = max(final_score, final_score + 25)

        final_score = max(0, min(100, final_score))

        if final_score >= 70:
            risk_level = "High Risk"
            label = "phishing_email"
            recommendation = "CRITICAL: Do NOT reply, do NOT click any links, and do NOT open attachments. Mark this email as Phishing/Spam in your email client."
        elif final_score >= 30:
            risk_level = "Suspicious"
            label = "suspicious_email"
            recommendation = "Check the sender's full email address (not just display name). Do not open links or attachments before independently verifying with the sender."
        else:
            risk_level = "Low Risk"
            label = "legitimate"
            recommendation = "The email shows low threat indicators. Always verify before sharing sensitive personal or financial information."

        return {
            "label": label,
            "risk_score": final_score,
            "risk_level": risk_level,
            "input_type": "email",
            "parsed_sender": parsed_sender or "Not specified",
            "parsed_subject": parsed_subject or "Not specified",
            "reasons": reasons,
            "top_features": text_result.get("top_features", []),
            "url_analysis": url_results,
            "recommendation": recommendation,
            "model_type": "Multi-Modal Email & Threat Pipeline (Text ML + URL Heuristics)",
            "is_model_trained": text_result.get("is_model_trained", True),
            "disclaimer": "Automated security scanning can produce false positives or miss novel threats. Exercise caution with unexpected communications."
        }

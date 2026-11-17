"""
Text scam classification and explainability engine for ScamShield AI.
Integrates trained TF-IDF + Logistic Regression pipeline with rule-based
heuristics to compute calibrated risk scores, threat categories, and explainable signals.
"""

import os
import json
import joblib
from typing import Dict, Any, List
from .feature_extraction import extract_text_indicators, extract_url_features

# Default model path
DEFAULT_MODEL_PATH = os.path.join(
    os.path.dirname(__file__), "models", "text_scam_classifier.joblib"
)
METRICS_PATH = os.path.join(
    os.path.dirname(__file__), "models", "model_metrics.json"
)


class ScamTextClassifier:
    def __init__(self, model_path: str = DEFAULT_MODEL_PATH):
        self.model_path = model_path
        self.pipeline = None
        self.metrics = None
        self.load_model()

    def load_model(self):
        """Load joblib pipeline and metadata from disk if available."""
        if os.path.exists(self.model_path):
            try:
                self.pipeline = joblib.load(self.model_path)
            except Exception as e:
                print(f"[!] Warning: Could not load text classifier from {self.model_path}: {e}")
                self.pipeline = None
        else:
            self.pipeline = None

        if os.path.exists(METRICS_PATH):
            try:
                with open(METRICS_PATH, "r", encoding="utf-8") as f:
                    self.metrics = json.load(f)
            except Exception:
                self.metrics = None

    def is_loaded(self) -> bool:
        return self.pipeline is not None

    def predict(self, text: str) -> Dict[str, Any]:
        """
        Analyze suspicious text and return:
        - risk_score (0-100)
        - risk_level ("Low Risk", "Suspicious", "High Risk")
        - reasons (list of detected indicators)
        - recommendation
        - top_suspicious_features
        - model_type & confidence
        """
        if not text or not text.strip():
            return {
                "label": "empty",
                "risk_score": 0,
                "risk_level": "Low Risk",
                "reasons": ["Input content was empty"],
                "recommendation": "Provide suspicious message content to scan.",
                "model_type": "text_classifier",
                "is_model_trained": self.is_loaded()
            }

        # Extract contextual heuristics
        heuristics = extract_text_indicators(text)
        reasons: List[str] = list(heuristics["indicators"])
        signals = heuristics["signals"]
        urls = heuristics["urls"]

        # If pipeline not loaded, fail-safe rule-based fallback with disclosure
        if not self.pipeline:
            return self._heuristic_fallback(text, heuristics)

        # Inspect embedded URLs with static URL feature extractor
        max_url_risk = 0
        for u in urls[:3]:
            try:
                u_feat = extract_url_features(u)
                u_score = 10
                if u_feat["is_ip"]:
                    u_score += 45
                if u_feat["has_suspicious_tld"]:
                    u_score += 40
                if u_feat["detected_brands"]:
                    u_score += 45
                if u_feat["matched_keywords"]:
                    u_score += min(35, len(u_feat["matched_keywords"]) * 15)
                if u_score > max_url_risk:
                    max_url_risk = u_score
                for u_reason in u_feat["reasons"][:2]:
                    if u_reason not in reasons:
                        reasons.append(f"Embedded link: {u_reason}")
            except Exception:
                pass

        # ML Prediction
        try:
            proba = self.pipeline.predict_proba([text])[0]
            # proba[1] is probability of scam
            scam_prob = float(proba[1])
        except Exception as e:
            return self._heuristic_fallback(text, heuristics, error_msg=str(e))

        # Calibrated Base Score from Probability:
        # Standard uncalibrated logistic probabilities on text cluster around 0.35 - 0.70.
        # Calibrate around the 0.50 decision boundary:
        if scam_prob < 0.50:
            # Benign spectrum: map [0.0, 0.50) into [5, 25]
            calibrated_score = int(5 + (scam_prob / 0.50) * 20)
        else:
            # Malicious spectrum: map [0.50, 1.0] into [45, 85]
            calibrated_score = int(45 + ((scam_prob - 0.50) / 0.50) * 40)

        total_signals = sum(signals.values())

        # If zero threat indicators, zero suspicious links, and zero urgency: enforce strict benign ceiling
        if total_signals == 0 and not urls and max_url_risk == 0:
            final_score = min(15, calibrated_score)
        else:
            final_score = calibrated_score

            # Elevate score for critical cybersecurity signals:
            # 1. Embedded Phishing Link
            if max_url_risk >= 70:
                final_score = max(final_score, int(max_url_risk * 0.96))
            elif max_url_risk >= 35:
                final_score = max(final_score, final_score + 25)

            # 2. Banking / KYC / Account cutoff urgency
            if signals["urgency"] > 0 and signals["sensitive_request"] > 0:
                final_score = max(final_score, 94)
            elif signals["urgency"] > 0:
                final_score = max(final_score, 85)
            elif signals["sensitive_request"] > 0:
                final_score = max(final_score, 82)

            # 3. Lottery / Lucky Draw / Job Task Fraud
            if signals["unrealistic_reward"] > 0 and (signals["contact_redirection"] > 0 or signals["sensitive_request"] > 0 or "kbc" in text.lower() or "lottery" in text.lower() or "job" in text.lower()):
                final_score = max(final_score, 88)
            elif signals["unrealistic_reward"] > 0:
                final_score = max(final_score, 78)

            # 4. Off-platform redirection (WhatsApp / Telegram / Remote access)
            if signals["contact_redirection"] > 0:
                final_score = max(final_score, 80)

        # Standardized Risk Range [5 - 99]
        risk_score = max(5, min(99, final_score))

        # Classification mapping:
        # 0-29: Low Risk, 30-69: Suspicious, 70-100: High Risk
        if risk_score >= 70:
            risk_level = "High Risk"
            label = "scam"
        elif risk_score >= 30:
            risk_level = "Suspicious"
            label = "suspicious"
        else:
            risk_level = "Low Risk"
            label = "legitimate"

        # Provide explanatory reasons if none triggered by heuristics
        if not reasons:
            if label == "scam":
                reasons.append("Semantic and vocabulary patterns align strongly with known fraudulent social engineering templates")
            elif label == "suspicious":
                reasons.append("Contains ambiguous promotional or unsolicited communication elements")
            else:
                reasons.append("No prominent social engineering, credential harvesting, or extortion patterns detected")

        # Extract top influential vocabulary matches
        top_features = self._extract_influential_terms(text)

        # Recommended safety action
        recommendation = self._generate_recommendation(risk_level, signals, heuristics["urls"])

        return {
            "label": label,
            "risk_score": risk_score,
            "risk_level": risk_level,
            "input_type": "text",
            "confidence": round(float(max(proba)), 4),
            "reasons": reasons,
            "top_features": top_features,
            "embedded_urls": heuristics["urls"],
            "recommendation": recommendation,
            "model_type": "TF-IDF + Logistic Regression (scikit-learn)",
            "is_model_trained": True,
            "evaluation_accuracy": self.metrics.get("accuracy") if self.metrics else None,
            "disclaimer": "Predictions are automated probabilistic estimates and can make errors. Never rely on automated detection as a guarantee of safety."
        }

    def _extract_influential_terms(self, text: str) -> List[str]:
        """Find words in text that have high positive coefficients in the logistic model."""
        if not self.pipeline:
            return []
        try:
            tfidf = self.pipeline.named_steps["tfidf"]
            clf = self.pipeline.named_steps["classifier"]
            feature_names = tfidf.get_feature_names_out()
            coefficients = clf.coef_[0]

            # Transform single text
            vec = tfidf.transform([text])
            feature_indices = vec.nonzero()[1]

            matched = []
            for idx in feature_indices:
                score = coefficients[idx]
                if score > 0.4:  # Positive coefficient indicates scam indicator
                    matched.append((feature_names[idx], float(score)))

            matched.sort(key=lambda x: x[1], reverse=True)
            return [term for term, _ in matched[:6]]
        except Exception:
            return []

    def _heuristic_fallback(self, text: str, heuristics: Dict[str, Any], error_msg: str = None) -> Dict[str, Any]:
        """Clear fallback when ML model has not been trained or cannot be loaded."""
        reasons = list(heuristics["indicators"])
        signals = heuristics["signals"]
        score = 15
        if signals["sensitive_request"]:
            score += 40
        if signals["urgency"]:
            score += 25
        if signals["unrealistic_reward"]:
            score += 25

        score = min(100, score)
        risk_level = "High Risk" if score >= 70 else ("Suspicious" if score >= 30 else "Low Risk")
        
        return {
            "label": "scam" if score >= 70 else ("suspicious" if score >= 30 else "legitimate"),
            "risk_score": score,
            "risk_level": risk_level,
            "input_type": "text",
            "confidence": 0.50,
            "reasons": reasons or ["Heuristic evaluation only (ML model artifact not loaded)"],
            "top_features": [],
            "embedded_urls": heuristics["urls"],
            "recommendation": self._generate_recommendation(risk_level, signals, heuristics["urls"]),
            "model_type": "Rule-Based Heuristic Fallback",
            "is_model_trained": False,
            "evaluation_accuracy": None,
            "disclaimer": "Model artifact not loaded. Results are generated via heuristic baseline rules."
        }

    def _generate_recommendation(self, risk_level: str, signals: Dict[str, int], urls: List[str]) -> str:
        if risk_level == "High Risk":
            if signals.get("sensitive_request"):
                return "CRITICAL: Do NOT share any OTP, PIN, password, or banking information. Financial institutions never ask for codes."
            if urls:
                return "DO NOT click the embedded link(s). Contact the organization directly through their verified official website or customer support."
            return "Block the sender and do not respond. Verify any claims through official independent channels."
        elif risk_level == "Suspicious":
            return "Proceed with caution. Do not click unsolicited links or wire money. Verify the sender's identity through official channels."
        else:
            return "No prominent fraud patterns detected. However, always verify unknown senders before sharing personal information."

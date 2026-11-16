"""
Text scam classification and explainability engine for ScamShield AI.
Integrates trained TF-IDF + Logistic Regression pipeline with rule-based
heuristics to compute calibrated risk scores, threat categories, and explainable signals.
"""

import os
import json
import joblib
from typing import Dict, Any, List
from .feature_extraction import extract_text_indicators

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

        # If pipeline not loaded, fail-safe rule-based fallback with disclosure
        if not self.pipeline:
            return self._heuristic_fallback(text, heuristics)

        # ML Prediction
        try:
            proba = self.pipeline.predict_proba([text])[0]
            # proba[1] is probability of scam
            scam_prob = float(proba[1])
        except Exception as e:
            return self._heuristic_fallback(text, heuristics, error_msg=str(e))

        # Base score from probability (0 to 100)
        base_score = int(round(scam_prob * 100))

        # Signal adjustments: if strong critical signals (e.g. OTP request + urgent payment),
        # calibrate score to prevent false negatives
        critical_count = signals["sensitive_request"] + signals["urgency"]
        if critical_count >= 2 and base_score < 70:
            base_score = min(88, base_score + 25)
            if "Combination of critical urgency and credential/OTP requests detected" not in reasons:
                reasons.append("Combination of high urgency and credential/OTP requests detected")

        # Classification mapping:
        # 0-29: Low Risk, 30-69: Suspicious, 70-100: High Risk
        risk_score = max(0, min(100, base_score))
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

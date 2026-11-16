"""
ScamShield AI — Model Training Script.
Trains a reproducible scikit-learn TF-IDF + Logistic Regression classifier
to identify scam and fraudulent text patterns from legitimate communications.
"""

import os
import re
import json
import joblib
import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix,
    classification_report
)

RANDOM_SEED = 42
DATASET_PATH = os.path.join("datasets", "scam_detection_dataset.csv")
MODEL_OUTPUT_DIR = os.path.join("backend", "app", "ml", "models")
MODEL_OUTPUT_PATH = os.path.join(MODEL_OUTPUT_DIR, "text_scam_classifier.joblib")
METRICS_OUTPUT_PATH = os.path.join(MODEL_OUTPUT_DIR, "model_metrics.json")


def clean_text(text: str) -> str:
    """Preprocess text for vectorization while retaining semantic signals."""
    if not isinstance(text, str):
        return ""
    # Normalize whitespaces
    text = re.sub(r"\s+", " ", text.strip())
    return text


def train():
    print(f"[*] Loading dataset from {DATASET_PATH}...")
    if not os.path.exists(DATASET_PATH):
        raise FileNotFoundError(f"Dataset file not found at {DATASET_PATH}. Run training/generate_dataset.py first.")
    
    df = pd.read_csv(DATASET_PATH)
    
    # Validation & Cleaning
    df = df.dropna(subset=["text", "label"])
    df["clean_text"] = df["text"].apply(clean_text)
    df = df[df["clean_text"].str.len() > 3]
    df = df.drop_duplicates(subset=["clean_text"])
    
    # Map labels: scam -> 1, legitimate -> 0
    label_map = {"scam": 1, "legitimate": 0}
    df["target"] = df["label"].map(label_map)
    df = df.dropna(subset=["target"])
    df["target"] = df["target"].astype(int)

    X = df["clean_text"].values
    y = df["target"].values

    print(f"[*] Total valid unique samples: {len(df)}")
    print(f"[*] Class distribution: Scam={sum(y==1)}, Legitimate={sum(y==0)}")

    # Stratified Train/Test Split with fixed random seed
    X_train, X_test, y_train, y_test = train_test_split(
        X, y,
        test_size=0.25,
        random_state=RANDOM_SEED,
        stratify=y
    )

    print(f"[*] Training samples: {len(X_train)} | Test samples: {len(X_test)}")

    # Build Pipeline: TF-IDF with unigrams + bigrams + calibrated Logistic Regression
    pipeline = Pipeline([
        ("tfidf", TfidfVectorizer(
            ngram_range=(1, 2),
            max_features=2500,
            sublinear_tf=True,
            stop_words="english"
        )),
        ("classifier", LogisticRegression(
            C=1.5,
            class_weight="balanced",
            random_state=RANDOM_SEED,
            max_iter=1000
        ))
    ])

    print("[*] Training TF-IDF + Logistic Regression pipeline...")
    pipeline.fit(X_train, y_train)

    # Evaluate on held-out test set
    y_pred = pipeline.predict(X_test)
    y_prob = pipeline.predict_proba(X_test)[:, 1]

    acc = float(accuracy_score(y_test, y_pred))
    prec = float(precision_score(y_test, y_pred, zero_division=0))
    rec = float(recall_score(y_test, y_pred, zero_division=0))
    f1 = float(f1_score(y_test, y_pred, zero_division=0))
    cm = confusion_matrix(y_test, y_pred).tolist()

    report_dict = classification_report(
        y_test, y_pred,
        target_names=["legitimate", "scam"],
        output_dict=True,
        zero_division=0
    )

    print("\n" + "="*50)
    print("           MODEL EVALUATION RESULTS (HELD-OUT TEST SET)")
    print("="*50)
    print(f"Accuracy  : {acc:.4f} ({acc*100:.2f}%)")
    print(f"Precision : {prec:.4f}")
    print(f"Recall    : {rec:.4f}")
    print(f"F1-Score  : {f1:.4f}")
    print("\nConfusion Matrix [[TN, FP], [FN, TP]]:")
    print(np.array(cm))
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred, target_names=["legitimate", "scam"], zero_division=0))

    # Save model artifacts
    os.makedirs(MODEL_OUTPUT_DIR, exist_ok=True)
    joblib.dump(pipeline, MODEL_OUTPUT_PATH)
    print(f"[OK] Model pipeline saved to {MODEL_OUTPUT_PATH}")

    # Save metrics metadata for API and College/Evaluation documentation
    metrics_data = {
        "model_name": "TF-IDF + Logistic Regression Text Scam Classifier",
        "random_seed": RANDOM_SEED,
        "train_samples": len(X_train),
        "test_samples": len(X_test),
        "accuracy": round(acc, 4),
        "precision": round(prec, 4),
        "recall": round(rec, 4),
        "f1_score": round(f1, 4),
        "confusion_matrix": {
            "true_negatives": cm[0][0],
            "false_positives": cm[0][1],
            "false_negatives": cm[1][0],
            "true_positives": cm[1][1]
        },
        "classification_report": report_dict,
        "classes": ["legitimate", "scam"]
    }

    with open(METRICS_OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(metrics_data, f, indent=2)
    print(f"[OK] Evaluation metrics saved to {METRICS_OUTPUT_PATH}")

    return metrics_data


if __name__ == "__main__":
    train()

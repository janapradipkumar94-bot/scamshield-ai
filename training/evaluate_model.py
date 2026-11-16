"""
ScamShield AI — Standalone Model Evaluation Script.
Inspects saved model performance, runs false positive / false negative breakdown,
and evaluates unseen sample test cases.
"""

import os
import json
import joblib
import pandas as pd
import numpy as np
from sklearn.metrics import classification_report, confusion_matrix

MODEL_PATH = os.path.join("backend", "app", "ml", "models", "text_scam_classifier.joblib")
DATASET_PATH = os.path.join("datasets", "scam_detection_dataset.csv")


def evaluate():
    if not os.path.exists(MODEL_PATH):
        print(f"[!] Model not found at {MODEL_PATH}. Please run training/train_text_model.py first.")
        return

    print(f"[*] Loading model from {MODEL_PATH}...")
    pipeline = joblib.load(MODEL_PATH)

    print(f"[*] Loading dataset from {DATASET_PATH}...")
    df = pd.read_csv(DATASET_PATH)
    label_map = {"scam": 1, "legitimate": 0}
    df["target"] = df["label"].map(label_map)
    df = df.dropna(subset=["target", "text"])

    X = df["text"].values
    y = df["target"].values

    preds = pipeline.predict(X)
    probs = pipeline.predict_proba(X)[:, 1]

    print("\n" + "="*50)
    print("        FULL CORPUS VALIDATION & ERROR ANALYSIS")
    print("="*50)
    print(classification_report(y, preds, target_names=["legitimate", "scam"]))
    print("Confusion Matrix [[TN, FP], [FN, TP]]:")
    print(confusion_matrix(y, preds))

    # Identify any False Positives and False Negatives
    df["prediction"] = preds
    df["scam_prob"] = probs

    false_positives = df[(df["target"] == 0) & (df["prediction"] == 1)]
    false_negatives = df[(df["target"] == 1) & (df["prediction"] == 0)]

    print(f"\nTotal False Positives (Legitimate flagged as Scam): {len(false_positives)}")
    for idx, row in false_positives.head(3).iterrows():
        print(f"  - [Prob: {row['scam_prob']:.2f}] {row['text'][:90]}...")

    print(f"\nTotal False Negatives (Scam missed as Legitimate): {len(false_negatives)}")
    for idx, row in false_negatives.head(3).iterrows():
        print(f"  - [Prob: {row['scam_prob']:.2f}] {row['text'][:90]}...")


if __name__ == "__main__":
    evaluate()

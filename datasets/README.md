# ScamShield AI — Datasets Documentation

## Overview
This directory contains dataset files used to train, evaluate, and test the machine learning text classification model for **ScamShield AI**.

## Dataset Structure

### `scam_detection_dataset.csv`
A curated and labeled dataset specifically designed to train the text classification pipeline to differentiate between legitimate communications (including benign promotional messages) and malicious scam/fraud attempts.

#### Columns
- `text` *(string, required)*: The raw text body of the SMS, message, or email.
- `label` *(string, required)*: Classification label — either `scam` or `legitimate`.
- `category` *(string, optional)*: Specific fraud category:
  - `phishing` (Credential harvesting, fake login portals)
  - `financial_fraud` (Fake bank KYC, account suspension, electricity cutoff)
  - `job_scam` (Part-time YouTube liking, fake remote jobs, deposit demands)
  - `lottery_scam` (Fake lottery, prize distribution, lucky draw)
  - `impersonation` (Fake police, customs, tax authority, family emergency)
  - `crypto_scam` (Guaranteed high yield investments, Ponzi schemes)
  - `legitimate` (Authentic transactional messages, personal notes, authentic marketing)
- `source` *(string, optional)*: Synthetic curated / benchmark source.

## Synthetic & Curated Dataset Disclaimer
> [!NOTE]
> The default development dataset contains verified patterns of modern social engineering tactics alongside authentic transactional and personal messages. While this dataset allows for high-precision local development, reproducible model evaluation, and unit testing, production-scale deployments should augment this dataset with larger corpus collections such as:
> - Kaggle SMS Spam Collection (adapted for scam vs ham)
> - Enron Email Dataset
> - PhishTank and OpenPhish URL feeds
> - HuggingFace Cybersecurity datasets

## Replacing with Custom Datasets
To retrain with your own CSV dataset:
1. Ensure your CSV contains at least `text` and `label` columns (where `label` has values `scam` or `legitimate`).
2. Place your file in `datasets/scam_detection_dataset.csv` (or specify `--dataset-path <path>` to `training/train_text_model.py`).
3. Run the training script:
   ```bash
   python training/train_text_model.py
   ```
4. Verify the generated evaluation metrics and confusion matrix in `backend/app/ml/models/model_metrics.json`.

# ScamShield AI — AI-Powered Scam Detection System

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg?logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/Frontend-React%2019%20+%20Vite-61DAFB.svg?logo=react)](https://react.dev)
[![TailwindCSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC.svg?logo=tailwind-css)](https://tailwindcss.com)
[![Scikit-Learn](https://img.shields.io/badge/ML-Scikit--Learn-F7931E.svg?logo=scikitlearn)](https://scikit-learn.org)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB%20%2F%20In--Memory-47A248.svg?logo=mongodb)](https://mongodb.com)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

An enterprise-grade, explainable cybersecurity web application designed to detect, analyze, and mitigate fraudulent SMS/text messages, deceptive phishing URLs, and social-engineering emails before they compromise users.

---

## Table of Contents
1. [Academic Capstone Project Overview](#academic-capstone-project-overview)
   - [Project Abstract](#project-abstract)
   - [Problem Statement](#problem-statement)
   - [Core Objectives](#core-objectives)
   - [System Architecture & Methodology](#system-architecture--methodology)
   - [Model Evaluation Report (Empirical Results)](#model-evaluation-report-empirical-results)
   - [Limitations & Future Scope](#limitations--future-scope)
2. [Technology Stack](#technology-stack)
3. [Key Features & Capabilities](#key-features--capabilities)
4. [Project Directory Structure](#project-directory-structure)
5. [Windows Setup & Deployment Guide](#windows-setup--deployment-guide)
   - [Prerequisites](#prerequisites)
   - [1. Clone / Navigate Workspace](#1-clone--navigate-workspace)
   - [2. Backend Setup & Virtual Environment](#2-backend-setup--virtual-environment)
   - [3. Dataset Preparation & Model Training](#3-dataset-preparation--model-training)
   - [4. Database Configuration](#4-database-configuration)
   - [5. Launching the Backend Server](#5-launching-the-backend-server)
   - [6. Frontend Setup & Launch](#6-frontend-setup--launch)
   - [7. Running Automated Tests](#7-running-automated-tests)
6. [API Specification & Usage Examples](#api-specification--usage-examples)
7. [Security & Privacy Principles](#security--privacy-principles)
8. [Troubleshooting Common Windows Errors](#troubleshooting-common-windows-errors)

---

## Academic Capstone Project Overview

### Project Abstract
Social engineering attacks—including smishing (SMS phishing), brand typosquatting, fraudulent job schemes, and coercive digital impersonations—represent the fastest-growing attack vector against digital citizens and financial systems worldwide. Traditional rule-based keyword filters suffer from rigid fragility against lexical variations, while pure black-box deep learning models fail to explain their reasoning to vulnerable end-users. 

**ScamShield AI** addresses this challenge through a multi-modal, explainable cybersecurity architecture. It integrates a TF-IDF vectorizer and calibrated Logistic Regression classifier with topological static URL heuristics and email header-body correlation. The system calculates an interpretable risk score (0–100), classifies threats into three standardized tiers (Low Risk, Suspicious, High Risk), highlights specific triggering tokens, and delivers actionable safety instructions.

### Problem Statement
Digital financial fraud and smishing attacks cause billions in losses annually. Fraudsters leverage psychological coercion (e.g., threats of electricity cutoff, bank KYC expiration, law enforcement warrants) and technical deception (homograph attacks, IP URLs, free webmail impersonation). Users lack accessible, real-time tools to inspect communications before taking irreversible actions such as sharing OTPs or wiring money.

### Core Objectives
1. **Explainable AI Scam Classification**: Differentiate genuine transactional/conversational messages from malicious fraud with high precision and zero black-box obscurity.
2. **Safe Topological URL Inspection**: Assess phishing links through structural, lexical, and brand-impersonation indicators without executing live network requests or exposing clients to drive-by payloads.
3. **Multi-Modal Threat Correlation**: Cross-reference claimed sender identities against transport headers and embedded links in emails.
4. **Zero-Trust Privacy Standard**: Store scan history as cryptographic SHA-256 hashes by default, preventing sensitive financial data leaks.
5. **Role-Based Governance**: Provide security administrators with telemetry dashboards, report review queues, and model diagnostic monitors.

### System Architecture & Methodology

```
+--------------------------------------------------------------------------+
|                        ScamShield AI User Interface                      |
|                  (React 19 + Vite + Tailwind CSS + Recharts)             |
+--------------------------------------------------------------------------+
       |                                     |                        |
 [SMS / Text Input]                   [Website URL Target]     [Pasted Email]
       |                                     |                        |
       v                                     v                        v
+------------------+                 +-----------------+      +---------------+
|  TF-IDF (1,2)    |                 | Topological URL |      | Email Parser  |
|  Vectorization   |                 | Lexical Engine  |      | & Correlation |
+------------------+                 +-----------------+      +---------------+
       |                                     |                        |
       v                                     |                        |
+------------------+                         |                        |
| Logistic Regr.   |                         |                        |
| Text Classifier  |                         |                        |
+------------------+                         |                        |
       |                                     |                        |
       +--------------------+----------------+------------------------+
                            |
                            v
             +------------------------------+
             | Calibrated Risk Engine (0-100)|
             | - Low Risk     (0  - 29)     |
             | - Suspicious   (30 - 69)     |
             | - High Risk    (70 - 100)    |
             | - Actionable Recommendations |
             | - Detected Indicator Tokens  |
             +------------------------------+
                            |
           +----------------+----------------+
           |                                 |
           v                                 v
+-----------------------+        +-----------------------+
|  MongoDB / In-Memory  |        |  Admin Intelligence   |
|  Cryptographic Store  |        |  & Audit Analytics    |
+-----------------------+        +-----------------------+
```

### Model Evaluation Report (Empirical Results)
The text classification model was trained and evaluated on a held-out test split using a fixed random seed (`random_state=42`) and stratified sampling:

- **Algorithm**: Sublinear Term Frequency-Inverse Document Frequency (TF-IDF, n-gram range 1–2) + L2-Regularized Logistic Regression (`C=1.5`, balanced class weighting).
- **Corpus Distribution**: 131 verified samples (68 Scam, 63 Legitimate).
- **Test Set Performance (Held-out 25%)**:
  - **Accuracy**: **100.00%** (1.0000)
  - **Precision**: **1.0000**
  - **Recall**: **1.0000**
  - **F1-Score**: **1.0000**
  - **Confusion Matrix**:
    - True Negatives (Legitimate recognized as Legitimate): **16**
    - False Positives (Legitimate flagged as Scam): **0**
    - False Negatives (Scam missed as Legitimate): **0**
    - True Positives (Scam detected as Scam): **17**

*(Metrics are stored in `backend/app/ml/models/model_metrics.json` and served directly through the Admin Console).*

### Limitations & Future Scope
- **Current Limitations**: 
  - Static URL heuristics do not follow live multi-stage HTTP 302 redirects (intentionally designed to safeguard client systems against live malware sockets).
  - The default development dataset contains curated high-impact templates; novel zero-day evasion phrases may require retraining.
- **Future Scope**:
  - Integration of pre-trained cybersecurity transformer embeddings (e.g. RoBERTa/DeBERTa fine-tuned on phishing corpora).
  - Sandboxed headless browser screenshot inspection for visual homoglyph comparison.
  - Native browser extension for automated real-time background protection.

---

## Technology Stack

### Frontend
- **Framework**: React 19 with Vite 8.
- **Styling**: Tailwind CSS (Tailwind v4 with `@tailwindcss/vite`).
- **Routing**: React Router DOM (v7).
- **Visualizations**: Recharts for threat telemetry and distribution analytics.
- **Icons**: Lucide React.

### Backend
- **Framework**: FastAPI (Python 3.10+ / 3.14).
- **Server**: Uvicorn ASGI.
- **Validation**: Pydantic v2 & Pydantic Settings.
- **Security**: Bcrypt password hashing, PyJWT tokens, and in-memory rate limiting.

### Machine Learning
- **Library**: scikit-learn (`TfidfVectorizer`, `LogisticRegression`).
- **Data Engineering**: Pandas, NumPy.
- **Serialization**: Joblib.

### Database
- **Primary**: MongoDB via PyMongo.
- **Resilience Engine**: Zero-dependency In-Memory persistent engine activated automatically when local MongoDB service is inactive, ensuring 100% test and evaluation pass rate out of the box!

---

## Project Directory Structure

```
scamshield-ai/
├── datasets/
│   ├── scam_detection_dataset.csv     # Curated dataset of scam & legitimate messages
│   └── README.md                      # Dataset documentation and replacement guide
├── training/
│   ├── generate_dataset.py            # Reproducible benchmark dataset generator
│   ├── train_text_model.py            # Model training & metrics generation pipeline
│   └── evaluate_model.py              # Standalone model evaluator & error analysis
├── backend/
│   ├── requirements.txt               # Python package dependencies
│   └── app/
│       ├── main.py                    # FastAPI entrypoint, CORS, rate limiting
│       ├── core/
│       │   ├── config.py              # Pydantic environment settings
│       │   └── security.py            # Bcrypt hashing & PyJWT token utilities
│       ├── database/
│       │   └── connection.py          # PyMongo client with fallback memory store
│       ├── schemas/                   # Pydantic request & response schemas
│       │   ├── auth.py
│       │   ├── scan.py
│       │   └── admin.py
│       ├── services/                  # Business logic & dependencies
│       │   ├── auth_service.py
│       │   ├── scan_service.py
│       │   └── admin_service.py
│       ├── ml/                        # ML pipelines & threat analyzers
│       │   ├── feature_extraction.py  # Text and URL heuristic extractors
│       │   ├── text_model.py          # Text scam classifier inference
│       │   ├── url_model.py           # Topological URL threat analyzer
│       │   ├── email_model.py         # Multi-modal email threat analyzer
│       │   └── models/
│       │       ├── text_scam_classifier.joblib
│       │       └── model_metrics.json
│       └── tests/                     # Pytest automated test suite
│           ├── conftest.py
│           ├── test_health_and_schemas.py
│           ├── test_scanners.py
│           ├── test_auth_and_security.py
│           └── test_admin_and_reports.py
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css
│       ├── context/
│       │   └── AuthContext.jsx
│       ├── services/
│       │   └── api.js
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── Footer.jsx
│       │   ├── RiskGauge.jsx
│       │   ├── ReportModal.jsx
│       │   ├── FeedbackWidget.jsx
│       │   └── ProtectedRoute.jsx
│       └── pages/
│           ├── HomePage.jsx
│           ├── ScannerPage.jsx
│           ├── DashboardPage.jsx
│           ├── AdminPage.jsx
│           ├── AwarenessPage.jsx
│           ├── LoginPage.jsx
│           └── RegisterPage.jsx
├── .env.example                       # Environment variables template
├── .env                               # Local active environment variables
├── .gitignore
└── README.md                          # Full system documentation
```

---

## Windows Setup & Deployment Guide

Follow these step-by-step instructions in Windows PowerShell or Command Prompt.

### Prerequisites
1. **Python**: Version 3.10 or higher (`python --version`).
2. **Node.js**: Version 18.0 or higher (`node --version` and `npm --version`).
3. **MongoDB** *(Optional)*: Community Server or MongoDB Atlas URI. If no local MongoDB service is running, ScamShield AI automatically engages its built-in in-memory storage engine!

---

### 1. Clone / Navigate Workspace
```powershell
cd "c:\Users\Pradip Kumar Jana\OneDrive\Desktop\Antigravity\scamshield-ai"
```

---

### 2. Backend Setup & Virtual Environment

Create and activate a Python virtual environment:
```powershell
# Create virtual environment
python -m venv venv

# Activate virtual environment (Windows PowerShell)
.\venv\Scripts\Activate.ps1

# (If PowerShell displays an ExecutionPolicy error, run:)
# Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Install backend dependencies:
```powershell
pip install -r backend/requirements.txt
```

Verify installed packages:
```powershell
python -c "import fastapi, sklearn, pandas, numpy, pymongo, bcrypt, jwt; print('All backend dependencies verified!')"
```

---

### 3. Dataset Preparation & Model Training

Generate the benchmark dataset and train the machine learning classifier:
```powershell
# 1. Generate curated dataset
python training/generate_dataset.py

# 2. Train the TF-IDF + Logistic Regression model
python training/train_text_model.py

# 3. (Optional) Run standalone model evaluation
python training/evaluate_model.py
```
This produces `backend/app/ml/models/text_scam_classifier.joblib` and `backend/app/ml/models/model_metrics.json`.

---

### 4. Database Configuration

Inspect `.env` (created from `.env.example`). Default settings:
```ini
PROJECT_NAME="ScamShield AI"
ENVIRONMENT="development"
DEBUG=True

# Security Secret (Change in production)
SECRET_KEY="scamshield-development-secret-key-32-bytes-secure"
ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# MongoDB (Local or Atlas)
MONGODB_URI="mongodb://localhost:27017"
DATABASE_NAME="scamshield_ai"

# CORS
CORS_ORIGINS="http://localhost:5173,http://127.0.0.1:5173"

RATE_LIMIT_PER_MINUTE=60
MAX_TEXT_LENGTH=10000

# Default Seed Administrator
ADMIN_EMAIL="admin@scamshield.ai"
ADMIN_PASSWORD="AdminSecurePassword123!"
```

---

### 5. Launching the Backend Server

Start the Uvicorn ASGI server:
```powershell
python -m uvicorn backend.app.main:app --reload --port 8000
```
- Interactive Swagger API Docs: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- API Health Check: [http://127.0.0.1:8000/api/health](http://127.0.0.1:8000/api/health)

---

### 6. Frontend Setup & Launch

Open a second Windows PowerShell terminal:
```powershell
cd "c:\Users\Pradip Kumar Jana\OneDrive\Desktop\Antigravity\scamshield-ai\frontend"

# Install npm dependencies (if not already installed)
npm install

# Start Vite development server
npm run dev
```
Open your browser at: **[http://localhost:5173](http://localhost:5173)**

#### Pre-Configured Demo Credentials:
- **Admin Account**: `admin@scamshield.ai` / `AdminSecurePassword123!` *(or click "Load Admin Demo" on the login page)*.
- **Regular User**: Register any new account instantly from `/register`.

---

### 7. Running Automated Tests

Run the complete backend test suite:
```powershell
python -m pytest backend/app/tests -v
```
All 17 test suites (text scanning, URL phishing, email spoofing, token validation, cross-user privacy isolation, and admin RBAC) will execute and pass.

---

## API Specification & Usage Examples

### 1. Health Check
`GET /api/health`
```bash
curl -X GET http://127.0.0.1:8000/api/health
```

### 2. Scan Text / SMS Message
`POST /api/scan/text`
```bash
curl -X POST http://127.0.0.1:8000/api/scan/text \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Dear customer your SBI account will be blocked today. Update KYC immediately: http://sbi-kyc.xyz",
    "save_history": false
  }'
```
**Sample Response:**
```json
{
  "label": "scam",
  "risk_score": 92,
  "risk_level": "High Risk",
  "input_type": "text",
  "confidence": 0.92,
  "reasons": [
    "Urgent or coercive pressure tactics detected (threat of suspension, cutoff, or arrest)",
    "Request for confidential information (OTP, PIN, CVV, or identity documents)",
    "Contains 1 web link(s) embedded in the message"
  ],
  "top_features": ["kyc", "sbi", "blocked", "update"],
  "recommendation": "DO NOT click the embedded link(s). Contact the organization directly through their verified official website or customer support.",
  "model_type": "TF-IDF + Logistic Regression (scikit-learn)",
  "is_model_trained": true,
  "disclaimer": "Predictions are automated probabilistic estimates and can make errors. Never rely on automated detection as a guarantee of safety.",
  "timestamp": "2026-10-28T16:15:00.000Z"
}
```

### 3. Scan Website URL
`POST /api/scan/url`
```bash
curl -X POST http://127.0.0.1:8000/api/scan/url \
  -H "Content-Type: application/json" \
  -d '{
    "url": "http://192.168.1.1/paypal-account-verify/login.php"
  }'
```

### 4. User Registration & Login
`POST /api/auth/register` & `POST /api/auth/login`
```bash
curl -X POST http://127.0.0.1:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@scamshield.ai",
    "password": "AdminSecurePassword123!"
  }'
```

---

## Security & Privacy Principles

1. **Stateless Privacy Standard**: Text inputs are processed in-memory. If a user does not explicitly opt in to save scan history, zero content is persisted.
2. **Cryptographic Hashes**: When saved, raw message bodies are masked with SHA-256 cryptographic hashes (`[Protected Content: SHA-256 3a8f...]`) unless explicit raw consent is checked.
3. **Password Security**: Passwords are never stored in plaintext; salted and hashed using Bcrypt with cost factor 12.
4. **CORS & Rate Limiting**: Access restricted to authorized frontend origins; sliding-window in-memory IP rate limiter defends against scraping and resource exhaustion.
5. **No Blind Web Requests**: The URL analyzer performs lexical and structural inspection without issuing socket connections or web crawls to untrusted domains.

---

## Troubleshooting Common Windows Errors

### 1. PowerShell Script Execution Policy
*Error*: `File Activate.ps1 cannot be loaded because running scripts is disabled on this system.`
*Solution*:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### 2. Port Already in Use (8000 or 5173)
*Error*: `[Errno 10048] error while attempting to bind on address ('127.0.0.1', 8000)`
*Solution*: Run on alternative port or free the port:
```powershell
# Free port 8000 in PowerShell:
Get-Process -Id (Get-NetTCPConnection -LocalPort 8000).OwningProcess | Stop-Process
```

### 3. MongoDB Connection Refused
*Notice*: `MongoDB not reachable at mongodb://localhost:27017`
*Behavior*: ScamShield AI automatically engages its **zero-dependency in-memory storage engine**. No action is required; the backend runs smoothly! If you wish to use live MongoDB, start the service:
```powershell
net start MongoDB
```

---

## Emergency Cybercrime Resources (India)
- **National Cybercrime Helpline**: **1930**
- **National Cybercrime Reporting Portal**: [cybercrime.gov.in](https://cybercrime.gov.in)
- **Citizen Financial Cyber Fraud Reporting System (CFCFRS)**
- **Reserve Bank of India Sachet Portal**: [sachet.rbi.org.in](https://sachet.rbi.org.in)
- **DoT Sanchar Saathi (Chakshu)**: [sancharsaathi.gov.in](https://sancharsaathi.gov.in)

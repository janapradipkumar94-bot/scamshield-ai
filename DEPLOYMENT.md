# 🚀 ScamShield AI — Cloud Deployment Guide

This guide provides step-by-step instructions to deploy **ScamShield AI** (FastAPI ML Backend + React Vite Frontend) to production for **free ($0)**.

The repository is pre-configured with:
- `render.yaml` — 1-Click Blueprint for Render (Deploys both Backend & Frontend simultaneously)
- `frontend/vercel.json` — Edge-ready SPA routing for Vercel
- `Dockerfile` & `docker-compose.yml` — Production containerization for Docker, Railway, or AWS/GCP
- Dynamic CORS & Backend URL resolution in `backend/app/main.py` and `frontend/src/services/api.js`

---

## 🌟 Option 1: 1-Click Full-Stack Deployment on Render (Recommended)

Render can deploy **both the Backend and Frontend together** directly from your GitHub repository using the included `render.yaml` Blueprint.

### Step 1: Open Render Blueprints
1. Visit **[dashboard.render.com/blueprints](https://dashboard.render.com/blueprints)**.
2. Sign in with your GitHub account: **`janapradipkumar94-bot`**.

### Step 2: Create New Blueprint Instance
1. Click **"New Blueprint Instance"**.
2. Connect or search for your repository: `janapradipkumar94-bot/scamshield-ai`.
3. Render will read `render.yaml` and discover two services:
   - **`scamshield-backend`** (Python Web Service running FastAPI)
   - **`scamshield-frontend`** (Static Site running React + Vite)

### Step 3: Click "Apply"
1. Render will automatically build the backend dependencies (`pip install -r backend/requirements.txt`) and start Uvicorn.
2. Render will build the frontend (`npm run build`) and inject the backend URL into `VITE_API_URL`.
3. Once completed (usually 2–3 minutes), your app is live!
   - Frontend URL: `https://scamshield-frontend.onrender.com`
   - Backend API Docs: `https://scamshield-backend.onrender.com/docs`

---

## ⚡ Option 2: Deploy Frontend on Vercel + Backend on Render

If you prefer Vercel's lightning-fast global CDN for the frontend:

### Part A: Deploy Backend on Render
1. Go to **[dashboard.render.com](https://dashboard.render.com)** -> Click **"New +"** -> **"Web Service"**.
2. Connect repository `janapradipkumar94-bot/scamshield-ai`.
3. Fill in the service details:
   - **Name**: `scamshield-backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r backend/requirements.txt`
   - **Start Command**: `python -m uvicorn backend.app.main:app --host 0.0.0.0 --port $PORT`
   - **Plan**: `Free`
4. Click **"Deploy Web Service"**.
5. Once deployed, copy your backend URL (e.g., `https://scamshield-backend.onrender.com`).

### Part B: Deploy Frontend on Vercel
1. Go to **[vercel.com/new](https://vercel.com/new)**.
2. Import repository `janapradipkumar94-bot/scamshield-ai`.
3. In the project configuration:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click "Edit" and choose `frontend`.
4. Under **Environment Variables**, add:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://scamshield-backend.onrender.com` *(Paste your Render backend URL)*
5. Click **"Deploy"**.
6. Within 1 minute, your site will be live at `https://scamshield-ai-xxx.vercel.app`!

---

## 🐳 Option 3: Deploy with Docker / Railway / Cloud Run

You can deploy ScamShield AI anywhere Docker is supported.

### Using Docker Compose Locally or on a VPS:
```bash
# Clone the repository
git clone https://github.com/janapradipkumar94-bot/scamshield-ai.git
cd scamshield-ai

# Build and start services
docker compose up -d --build
```
- Backend will be accessible at: `http://localhost:8000`
- API Health check: `http://localhost:8000/api/health`
- Swagger Documentation: `http://localhost:8000/docs`

### Deploying Docker Image to Railway:
1. Go to **[railway.app](https://railway.app)** -> **"New Project"**.
2. Choose **"Deploy from GitHub repo"** and select `scamshield-ai`.
3. Railway automatically detects the root `Dockerfile`.
4. Add environment variable `PORT=8000`.
5. Generate a public domain under service Settings.

---

## ⚙️ Environment Variables Reference

| Variable | Required | Default | Description |
| :--- | :---: | :---: | :--- |
| `ENVIRONMENT` | No | `production` | Set to `production` or `development` |
| `PORT` | No | `8000` | Port for FastAPI backend (set automatically by cloud providers) |
| `SECRET_KEY` | Recommended | Built-in fallback | JWT signature secret key |
| `VITE_API_URL` | Frontend only | Empty (relative `/api`) | Public URL of the FastAPI backend service |
| `ADMIN_EMAIL` | No | `admin@scamshield.ai` | Seed admin account email |
| `ADMIN_PASSWORD` | No | `AdminSecurePassword123!` | Seed admin account password |
| `MONGODB_URI` | No | In-memory fallback | MongoDB connection string (auto in-memory if empty) |
| `GEMINI_API_KEY` | No | Heuristic fallback | Optional Google Gemini API key for hybrid analysis |

---

## 🔍 Verification & Health Checks

Once deployed, verify your deployment:

1. **Backend Health Check**:
   ```bash
   curl -i https://<your-backend-url>/api/health
   # Expected response: {"status":"healthy", "database":"connected (in-memory)", "timestamp": ...}
   ```

2. **Interactive API Documentation**:
   Visit `https://<your-backend-url>/docs` to view and test all 20+ endpoints.

3. **Frontend Verification**:
   - Open your frontend URL in any browser.
   - Run a test scan with: *"URGENT: Your bank account will be blocked within 24 hours. Click bit.ly/bank-verify"*.
   - Toggle between **Easy View** (citizen-friendly, high-contrast traffic light) and **Detailed View** (technical breakdown).
   - Test the voice speaker with multi-language synthesis (English, Hindi, Bengali).

# 🚀 Deployment Guide: Banker Verify

Since this project uses a heavy ML backend (`DeepFace`, `TensorFlow`), we use a **Shared Cloud Architecture**.

---

## 🏗️ The Architecture

1.  **Frontend**: Deployed on **Vercel** (Fast, Secure, Modern).
2.  **Backend**: Deployed on **Render** (Supports heavy Linux environments and Large ML models).
3.  **Database**: **SQLite** (included in backend) or a managed **MySQL** (RDS/Aiven).

---

## 🎨 Step 1: Frontend (Vercel)

### 1. Separate your Code

Vercel works best if it knows where your React code is.

- In the Vercel Dashboard, Import your Repo.
- **Root Directory**: Select `frontend-react`.
- **Framework Preset**: `Vite`.
- **Build Command**: `npm run build`.
- **Output Directory**: `dist`.

### 2. Set Environment Variables

In Vercel Settings -> Environment Variables, add:

- `VITE_API_URL`: `https://your-backend-url.onrender.com/api/v1`

---

## 🧠 Step 2: Backend (Render.com)

Render is recommended because it handles heavy Python dependencies better than Vercel.

### 1. Create a `Render Blueprint` (render.yaml)

Create this file in your project root:

```yaml
services:
  - type: web
    name: banker-verify-api
    env: python
    buildCommand: pip install -r requirements_hackathon.txt
    startCommand: python -m uvicorn backend.app:app --host 0.0.0.0 --port $PORT
    envVars:
      - key: PYTHON_VERSION
        value: 3.10.0
```

### 2. Deploy on Render

- Connect your GitHub.
- Select "Web Service".
- Render will detect the Python environment and install the ML models automatically on the first run.

---

## 🔗 Step 3: Connect Them

Once your Backend is live on Render:

1. Copy the URL Render provides.
2. Go back to Vercel and update your `VITE_API_URL`.
3. Re-deploy the frontend.

---

## ⚠️ Important Deployment Notes

- **Cold Starts**: On free tiers, the ML model might take 30-60 seconds to "wake up" for the first verification.
- **Model Downloads**: The backend will download the **ArcFace** model (~150MB) on its first initialization. Ensure your hosting has at least 512MB of RAM.

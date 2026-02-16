# 🚀 Deployment Guide: Banker Verify

Since this project uses a heavy ML backend (`DeepFace`, `TensorFlow`), we use a **Shared Cloud Architecture**.

---

## 🏗️ The Architecture

1.  **Frontend**: Deployed on **Vercel** (Fast, Secure, Modern).
2.  **Backend**: Deployed on **Render** (Supports heavy Linux environments and Large ML models).

---

## ⚡ Option 1: Render (Standard)

_Best for: Permanent Hosting, Set-and-Forget_

### Step 1: Frontend (Vercel)

1.  In the Vercel Dashboard, Import your Repo.
2.  **Root Directory**: Set to `frontend-react`.
3.  **Framework Preset**: `Vite`.
4.  **Environment Variables**: Add `VITE_API_URL` set to your Render URL (e.g. `https://your-api.onrender.com`).

### Step 2: Backend (Render.com)

1.  Connect your GitHub to Render.
2.  Create a **New Web Service**.
3.  **Build Command**: `pip install -r requirements_hackathon.txt`
4.  **Start Command**: `python -m uvicorn backend.app:app --host 0.0.0.0 --port $PORT`
5.  **Environment Variables**:
    - `PYTHON_VERSION`: `3.10.0` (Critical for AI models)
    - `JWT_SECRET`: (Random String)

---

## 🚄 Option 2: Railway (Faster Builds)

_Best for: Faster deployment times, better logs_

1.  Connect GitHub to **Railway.app**.
2.  It will auto-detect Python.
3.  Add the `PYTHON_VERSION` variable (`3.10.0`).
4.  Railway builds are usually 2-3x faster than Render.

---

## 🚨 Option 3: "Emergency" Hackathon Mode (Ngrok)

_Best for: INSTANT Demo, no waiting for builds_

1.  Keep your backend running on your laptop:
    ```bash
    python -m uvicorn backend.app:app --host 0.0.0.0 --port 8000 --reload
    ```
2.  Download & Run **Ngrok**:
    ```bash
    ngrok http 8000
    ```
3.  Copy the URL it gives you (e.g., `https://xyz.ngrok-free.app`).
4.  Go to Vercel -> Settings -> Environment Variables.
5.  Set `VITE_API_URL` to that Ngrok URL.
6.  **Redeploy Vercel**.
7.  **Done!** Your laptop is now the server for the whole world.

---

## ⚠️ Important Notes

- **Cold Starts**: On free tiers, the ML model might take 30-60 seconds to "wake up" for the first verification.
- **Memory**: This app requires the **Starter** or **Standard** instance on Render to run smoothly with TensorFlow. If using the Free tier, it may be slow.
- **Security**: I've enabled automatic `JWT_SECRET` generation in the blueprint for your security.

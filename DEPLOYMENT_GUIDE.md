# 🚀 Deployment Guide: Banker Verify

Since this project uses a heavy ML backend (`DeepFace`, `TensorFlow`), we use a **Shared Cloud Architecture**.

---

## 🏗️ The Architecture

1.  **Frontend**: Deployed on **Vercel** (Fast, Secure, Modern).
2.  **Backend**: Deployed on **Render** (Supports heavy Linux environments and Large ML models).

---

## 🎨 Step 1: Frontend (Vercel)

1.  In the Vercel Dashboard, Import your Repo.
2.  **Root Directory**: Set to `frontend-react`.
3.  **Framework Preset**: `Vite`.
4.  **Environment Variables**: Add `VITE_API_URL` set to your Render URL (e.g. `https://your-api.onrender.com`).

---

## 🧠 Step 2: Backend (Render.com)

I've added a **Blueprint** (`render.yaml`) to make this automatic.

1.  Connect your GitHub to Render.
2.  Go to **Blueprints** in the top menu.
3.  Click **New Blueprint Instance**.
4.  Select your repository.
5.  Render will automatically detect the settings and start building!
    - _Note_: The first build takes 5-8 minutes as it installs TensorFlow.
    - _Note_: It will automatically use **SQLite** for the database, so you don't need to set up any external DB!

---

## 🔗 Step 3: Connect Them

Once your Backend is live on Render:

1.  Copy the URL Render provides (ending in `.onrender.com`).
2.  Go to your **Vercel Project Settings** -> **Environment Variables**.
3.  Update (or add) `VITE_API_URL` with that URL.
4.  Re-deploy the frontend (or just wait for it to update).

---

## ⚠️ Important Deployment Notes

- **Cold Starts**: On free tiers, the ML model might take 30-60 seconds to "wake up" for the first verification.
- **Memory**: This app requires the **Starter** or **Standard** instance on Render to run smoothly with TensorFlow. If using the Free tier, it may be slow.
- **Security**: I've enabled automatic `JWT_SECRET` generation in the blueprint for your security.

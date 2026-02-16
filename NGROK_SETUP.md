# Ngrok + Vercel Setup Guide

## What We're Doing

- **Backend**: Running on your laptop (localhost:8000) + Ngrok tunnel (makes it accessible from internet)
- **Frontend**: Deployed on Vercel (accessible worldwide)

---

## Step 1: Start Your Backend (Locally)

Open a terminal and run:

```bash
cd c:\Users\itska\Desktop\banker_assistant
python -m uvicorn backend.app:app --host 0.0.0.0 --port 8000 --reload
```

**Wait for**: `Uvicorn running on http://0.0.0.0:8000`

✅ Leave this terminal running.

---

## Step 2: Start Ngrok Tunnel

Open a **NEW** terminal and run:

```bash
cd c:\Users\itska\Desktop\banker_assistant
ngrok http 8000
```

You'll see output like this:

```
Session Status                online
Account                       Your Name (Plan: Free)
Version                       3.x.x
Region                        India (in)
Latency                       -
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://abc-123-xyz.ngrok-free.app -> http://localhost:8000
```

**COPY THE HTTPS URL** (the part ending with `.ngrok-free.app`)

Example: `https://abc-123-xyz.ngrok-free.app`

✅ Leave this terminal running too.

---

## Step 3: Deploy Frontend to Vercel

### 3a. Push Your Code to GitHub

```bash
cd c:\Users\itska\Desktop\banker_assistant
git add .
git commit -m "ready for vercel deployment"
git push
```

### 3b. Go to Vercel Dashboard

1. Open https://vercel.com/dashboard
2. Click **Add New** → **Project**
3. Import your GitHub repository
4. **IMPORTANT SETTINGS**:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend-react`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 3c. Add Environment Variable

**BEFORE deploying**, click **Environment Variables**:

- **Name**: `VITE_API_URL`
- **Value**: Paste your ngrok URL (from Step 2)
  - Example: `https://abc-123-xyz.ngrok-free.app`
- Click **Add**

### 3d. Deploy

Click **Deploy**

Wait 1-2 minutes. You'll get a URL like: `https://your-app.vercel.app`

---

## Step 4: Test It

1. Open your Vercel URL (e.g., `https://your-app.vercel.app`)
2. Login with your test credentials
3. Try a verification

✅ It should work now!

---

## Troubleshooting

### "Verification Failed" Error

1. **Check ngrok is running**: Look for the "Forwarding" line in your ngrok terminal
2. **Check the URL in Vercel**:
   - Go to Vercel → Settings → Environment Variables
   - Verify `VITE_API_URL` matches your ngrok URL
   - If you changed it, **redeploy** (Deployments tab → ... → Redeploy)

### "ERR_CONNECTION_REFUSED"

- Your backend (`uvicorn`) is not running
- Restart it with the command in Step 1

### Backend Works Locally but Not on Vercel

- 99% chance the `VITE_API_URL` is wrong or not set
- Go to Vercel dashboard and double-check it

---

## Important Notes

⚠️ **Ngrok URL Changes**: Every time you restart ngrok, you get a NEW URL. You must:

1. Copy the new URL
2. Update it in Vercel Environment Variables
3. Redeploy Vercel

💡 **Keep Terminals Running**: Don't close the terminals running `uvicorn` and `ngrok` or your app will stop working.

🔒 **For Production**: Use Render instead (but ngrok works perfectly for demos/hackathons).

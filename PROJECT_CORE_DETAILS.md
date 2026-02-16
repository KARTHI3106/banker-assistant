# Project: Banker Verify

**Human-Centric Identity Assurance Engine**

---

## 🎯 What is it?

Banker Verify is an **AI-Assisted Identity platforms** designed for bank branches to verify customers in real-time. It moves beyond simple "matching" by providing **Explainable AI** to help bank officials make risk-based decisions.

## 🛠️ Tech Stack: What is used Where?

| Layer               | Technology         | Usage                                                                 |
| :------------------ | :----------------- | :-------------------------------------------------------------------- |
| **Identity Core**   | `Facenet512`       | Generates 512-D facial embeddings (neural fingerprints).              |
| **Computer Vision** | `OpenCV`           | Real-time face detection, alignment, and gray-scale analysis.         |
| **3D Liveness**     | `MediaPipe`        | 3D Face Mesh tracking to detect Z-depth (prevents 2D photo spoofing). |
| **Backend**         | `FastAPI (Python)` | High-speed asynchronous engine.                                       |
| **Frontend**        | `React + Tailwind` | Modern, dark-mode dashboard for bank officials.                       |
| **Data Security**   | `JWT + MySQL`      | Secure banker authentication and private audit trailing.              |

## 🧬 How it Detects (Technical Logic)

- **Face & Geometry**: Compares 512-point facial vectors using **Cosine Similarity**.
- **Anomaly Detection**: Flags "Digital Spoofing" by using **Laplacian Variance** to find unnaturally smooth surfaces (Deepfakes).
- **Variation Engine**: Detects **Hair changes**, **Glasses**, and **Skin marks** (scars/moles) to ensure the person in the ID is the same person at the counter.
- **Adaptive Thresholds**: Automatically adjusts score sensitivity based on lighting and occlusions (e.g., handles "glasses" gracefully).

## 💎 Unique Selling Propositions (USP)

1. **Explainable AI**: Doesn't just say "Fail"; it explains _why_ (e.g., "Matched 85% - Decision driven by skin geometry despite low light").
2. **Cost Sovereignty**: Runs **on-premise** on local hardware. No per-hit API fees like standard KYC vendors.
3. **Audit-Ready Persistence**: Stores a complete mathematical audit trail for every verification, meeting RBI/Compliance standards.

## 🏆 How it's different from Competitors?

_Vs. Signzy, HyperVerge, IDfy:_

1. **Cloud vs Edge**: Competitors process in the cloud (security risk). We process at the **Edge** (local network), keeping biometric data private.
2. **Black Box vs XAI**: Competitors give a simple Pass/Fail. We provide a **Confidence Breakdown** for human-in-the-loop oversight.
3. **Static vs Adaptive**: Competitors fail users in bad branch lighting. We use **Adaptive Thresholding** to normalize for environmental noise.

---

**Summary for Pitch**: Banker Verify is a **Privacy-First**, **Cost-Efficient** shield that turns standard facial recognition into a **Compliance-Ready Identity Platform**.

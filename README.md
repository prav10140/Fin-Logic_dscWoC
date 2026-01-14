# 🛡️ Fin-Logic: AI-Powered Financial Protection

> **Expose the Fine Print** — An intelligent document analyzer that detects predatory clauses, hidden fees, and dark patterns in financial contracts using AI and OCR.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)
![Firebase](https://img.shields.io/badge/Firebase-Integrated-orange.svg)

---

## 📋 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [Disclaimer](#disclaimer)
- [License](#license)

---

## 🎯 Overview

**Fin-Logic** is an AI-powered tool designed to protect users from predatory financial clauses hidden in contracts, loan agreements, and terms of service. It uses a **dual-layer analysis engine** combining regex pattern matching with Large Language Models (Groq AI) to identify risks like:

- 🚨 **Hidden Fees** (Processing charges, late payment penalties)
- 🔄 **Auto-Renewal Traps** (Subscription lock-ins)
- 📈 **Variable Interest Rates** (APR changes without notice)
- 🔒 **Forced Arbitration** (Waiving legal rights)
- 🕵️ **Data Privacy Violations** (Selling personal data)

### Why Fin-Logic?
Most users sign financial documents without understanding the risks. Fin-Logic acts as a **personal digital lawyer**, translating complex legalese into simple English, estimating potential financial loss, and suggesting safer alternatives.

---

## ✨ Features

### Core Capabilities
- **📄 Universal Document Parsing**: Supports PDF uploads, image uploads (OCR via Tesseract.js), and direct text paste
- **🧠 Hybrid Risk Detection**: 
  - **Regex Heuristics**: Instant flagging of known predatory patterns
  - **LLM Analysis (Groq)**: Deep contextual understanding and safer rewrites
- **💰 Financial Loss Estimator**: Calculates potential monetary cost of vague terms
- **✍️ Simplify & Rewrite**: Explains clauses in plain English and generates "Safer Versions"
- **🔐 Smart History Vault**: Securely stores past analyses using Cloud Firestore
- **🔑 Secure Authentication**: Google Sign-In integration via Firebase Auth

### UI/UX
- **🎨 Premium Glassmorphism Design**: Animated backgrounds, neon accents, and smooth transitions
- **📱 Fully Responsive**: Works seamlessly on desktop, tablet, and mobile
- **⚡ Real-time Analysis**: Instant feedback with loading animations

---

## 🛠️ Tech Stack

### Frontend
- **HTML5 / CSS3 / JavaScript (ES6+)**
- **Firebase Client SDK** (Authentication & Firestore)
- **Tesseract.js** (Client-side OCR for images)

### Backend
- **Node.js** with **Express.js**
- **Multer** (File upload handling)
- **pdf-parse** (PDF text extraction)
- **Groq SDK** (AI-powered clause analysis)
- **Firebase Admin SDK** (Server-side authentication & database)

### Infrastructure
- **Firebase Firestore** (NoSQL cloud database)
- **Firebase Authentication** (Google Sign-In)
- **Render.com** (Deployment platform)

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v14 or higher)
- **npm** (comes with Node.js)
- **Firebase Project** (for Auth & Firestore)
- **Groq API Key** ([Get it here](https://console.groq.com))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Th-Shivam/Fin-Logic.git
   cd Fin-Logic
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   
   Create a `.env` file in the root directory:
   ```env
   # Groq AI API Key
   GROQ_API_KEY=your_groq_api_key_here
   
   # Firebase Configuration (Frontend)
   FIREBASE_API_KEY=your_firebase_api_key
   FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
   FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   FIREBASE_APP_ID=your_app_id
   FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

4. **Add Firebase Service Account Key**
   
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Navigate to **Project Settings** → **Service Accounts**
   - Click **Generate New Private Key**
   - Save the file as `serviceAccountKey.json` in the project root

5. **Enable Firebase Services**
   
   In your Firebase Console:
   - **Authentication**: Enable "Google" sign-in provider
   - **Firestore Database**: Create a database (start in test mode)
   - **Firestore Rules**: Update rules to:
     ```javascript
     rules_version = '2';
     service cloud.firestore {
       match /databases/{database}/documents {
         match /users/{userId}/{document=**} {
           allow read, write: if request.auth != null && request.auth.uid == userId;
         }
       }
     }
     ```

6. **Run the application**
   ```bash
   npm start
   ```
   
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Deployment

### Deploy to Render.com (Free Tier)

1. **Push to GitHub** (if not already done)
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Create Web Service on Render**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click **New +** → **Web Service**
   - Connect your GitHub repository
   - Configure:
     - **Build Command**: `npm install`
     - **Start Command**: `node server.js`

3. **Add Environment Variables**
   
   In Render's **Environment** tab, add all variables from your `.env` file, plus:
   ```
   FIREBASE_SERVICE_ACCOUNT=<paste entire serviceAccountKey.json content here>
   ```

4. **Deploy**
   - Click **Create Web Service**
   - Wait for deployment to complete

5. **Update Firebase Authorized Domains**
   - Copy your Render URL (e.g., `https://fin-logic.onrender.com`)
   - Go to Firebase Console → **Authentication** → **Settings** → **Authorized Domains**
   - Add your Render URL

---

## 📁 Project Structure

```
Fin-Logic/
├── public/
│   ├── index.html          # Main HTML file
│   ├── style.css           # Premium UI styles
│   ├── script.js           # Frontend logic
│   └── firebase-client.js  # Firebase client SDK
├── analysis.js             # OCR & fallback risk detection
├── preprocessing.js        # Regex-based risk patterns
├── groq-service.js         # Groq AI integration
├── firebase-config.js      # Firebase Admin SDK
├── server.js               # Express server
├── package.json            # Dependencies
├── .env                    # Environment variables (not committed)
├── serviceAccountKey.json  # Firebase credentials (not committed)
└── README.md               # This file
```

---

## ⚠️ Disclaimer

> **EDUCATIONAL TOOL ONLY**
> 
> This tool is for **informational and educational purposes only**. It does **NOT** provide legal, financial, or professional advice. 
> 
> - Results are AI-generated estimates and **may not be 100% accurate**
> - Always verify important financial decisions with your **bank, legal advisor, or certified financial professional** before taking action
> - The developers assume **no liability** for decisions made based on this tool's output

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 🤝 Contributing

We love your input! We want to make contributing to Fin-Logic as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features

Please compile with our [Contribution Guidelines](CONTRIBUTING.md) before submitting a Pull Request.


---

## 📧 Contact

**Shivam Singh**  
GitHub: [@Th-Shivam](https://github.com/Th-Shivam)

---

<div align="center">
  <strong>Built with ❤️ for financial transparency</strong>
</div>

# Gemini API Integration Guide

## 📦 Installation

Package already installed:
```bash
npm install @google/generative-ai
```

## 🔑 Get API Key

1. Go to: https://makersuite.google.com/app/apikey
2. Click "Create API Key"
3. Copy your key

## ⚙️ Set Environment Variable

### Option 1: Temporary (Current Terminal Session)
```bash
export GEMINI_API_KEY=your_api_key_here
node server.js
```

### Option 2: Permanent (.env file)
1. Create `.env` file in project root:
```bash
GEMINI_API_KEY=your_api_key_here
```

2. Install dotenv:
```bash
npm install dotenv
```

3. Add to top of `server.js`:
```javascript
require('dotenv').config();
```

## 📁 File Structure

```
/home/rudra/Projects/Fin-Logic/
├── gemini-service.js    ← Gemini integration (NEW)
├── server.js            ← Test route added
└── .env                 ← API key (create this)
```

## 🧪 Testing

1. **Set API key** (choose one method above)

2. **Restart server**:
```bash
pkill -f "node server.js" && GEMINI_API_KEY=your_key node server.js
```

3. **Test the endpoint**:
```bash
curl http://localhost:3000/api/test-gemini
```

**Expected Response**:
```json
{
  "success": true,
  "message": "Gemini API is working!",
  "response": "Hello from Gemini! I can help you..."
}
```

## 📝 Usage in Code

```javascript
const { analyzeWithGemini } = require('./gemini-service');

// Use anywhere in your app
const response = await analyzeWithGemini('Your prompt here');
console.log(response); // Plain string response
```

## ⚠️ Important Notes

- **Free Tier**: gemini-1.5-flash (60 requests/minute)
- **Never commit** `.env` file to Git
- Add `.env` to `.gitignore`

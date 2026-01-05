# Gemini API Troubleshooting

## ❌ Current Error
```
404 Not Found - models/gemini-pro is not found for API version v1beta
```

## 🔍 Possible Causes

### 1. Invalid/Expired API Key
- API key might be wrong or expired
- Verify at: https://makersuite.google.com/app/apikey

### 2. Generative AI API Not Enabled
- The API might not be enabled for your project
- Enable here: https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com

### 3. Model Name Changed
- Google might have deprecated `gemini-pro`
- Need to check available models

## ✅ Solutions

### Solution 1: Generate Fresh API Key
1. Go to: https://makersuite.google.com/app/apikey
2. Click "Create API Key"
3. Copy the new key
4. Update `.env`:
   ```
   GEMINI_API_KEY=your_new_key_here
   ```
5. Restart server

### Solution 2: Enable Generative AI API
1. Go to: https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com
2. Click "Enable"
3. Wait a few minutes
4. Try again

### Solution 3: Check Available Models
Run this to see which models are available:
```bash
curl "https://generativelanguage.googleapis.com/v1beta/models?key=YOUR_API_KEY"
```

## 🆘 Need Help?
If none of these work, we can:
- Switch to a different AI provider (OpenAI, Claude)
- Use a different Gemini SDK version
- Debug the API key permissions

Let me know what you'd like to try!

const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const { extractText, analyzeText } = require('./analysis');

// Load environment variables from .env file
require('dotenv').config();

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json()); // Enable JSON body parsing for text input
app.use(express.static('public')); // Serve frontend files

// Multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({ storage: storage });

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Analysis Route
app.post('/analyze', upload.single('document'), async (req, res) => {
  let text = '';

  try {
    // Case 1: File Upload
    if (req.file) {
      const filePath = req.file.path;
      text = await extractText(filePath);
    } 
    // Case 2: Pasted Text
    else if (req.body.text) {
      text = req.body.text;
    } 
    else {
      return res.status(400).json({ error: 'No file or text provided.' });
    }

    // 2. LLM Analysis (Placeholder)
    const analysis = await analyzeText(text);

    res.json({
      success: true,
      textPreview: text.substring(0, 500) + '...',
      analysis: analysis
    });

  } catch (error) {
    console.error('Processing Error:', error);
    res.status(500).json({ error: 'Failed to process document.' });
  }
});

// Firebase endpoints (optional - only work if Firebase is configured)
const { db, isConfigured } = require('./firebase-config');

app.post('/api/save-report', async (req, res) => {
  if (!isConfigured) {
    return res.json({ success: false, message: 'Firebase not configured' });
  }
  
  const { userId, reportData } = req.body;
  
  if (!userId || !reportData) {
    return res.status(400).json({ success: false, error: 'Missing userId or reportData' });
  }
  
  try {
    const docRef = await db.collection('users').doc(userId)
      .collection('reports').add({
        ...reportData,
        timestamp: new Date()
      });
    
    res.json({ success: true, reportId: docRef.id });
  } catch (error) {
    console.error('Error saving report:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/history/:userId', async (req, res) => {
  if (!isConfigured) {
    return res.json({ success: false, message: 'Firebase not configured', reports: [] });
  }
  
  const { userId } = req.params;
  
  try {
    const snapshot = await db.collection('users').doc(userId)
      .collection('reports')
      .orderBy('timestamp', 'desc')
      .limit(50)
      .get();
    
    const reports = [];
    snapshot.forEach(doc => {
      reports.push({ id: doc.id, ...doc.data() });
    });
    
    res.json({ success: true, reports });
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ success: false, error: error.message, reports: [] });
  }
});

app.get('/api/report/:userId/:reportId', async (req, res) => {
  if (!isConfigured) {
    return res.json({ success: false, message: 'Firebase not configured' });
  }
  
  const { userId, reportId } = req.params;
  
  try {
    const doc = await db.collection('users').doc(userId)
      .collection('reports').doc(reportId).get();
    
    if (doc.exists) {
      res.json({ success: true, report: { id: doc.id, ...doc.data() } });
    } else {
      res.status(404).json({ success: false, error: 'Report not found' });
    }
  } catch (error) {
    console.error('Error fetching report:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Gemini API Test Route
const { analyzeWithGemini, isConfigured: isGeminiConfigured } = require('./gemini-service');

app.get('/api/test-gemini', async (req, res) => {
  if (!isGeminiConfigured) {
    return res.json({
      success: false,
      message: 'Gemini API not configured. Set GEMINI_API_KEY environment variable.'
    });
  }

  try {
    const testPrompt = 'Say "Hello from Gemini!" and explain in one sentence what you can do.';
    const response = await analyzeWithGemini(testPrompt);
    
    res.json({
      success: true,
      message: 'Gemini API is working!',
      response: response
    });
  } catch (error) {
    console.error('Gemini test error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Serve Firebase Config
app.get('/api/firebase-config', (req, res) => {
    res.json({
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.FIREBASE_APP_ID,
        measurementId: process.env.FIREBASE_MEASUREMENT_ID
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

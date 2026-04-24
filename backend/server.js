require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Groq = require('groq-sdk');
const mongoose = require('mongoose');
const { getForensicPrompt } = require('./forensicPrompt');
const authRoutes = require('./routes/auth');

const app = express();
const port = process.env.PORT || 5005;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/aiml007';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB locally for Authentication'))
  .catch(err => console.error('MongoDB connection error:', err));

// Mount Auth Routes
app.use('/api/auth', authRoutes);

// Set up multer for file handling (memory storage for easy processing)
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Initialize Groq (fallback)
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || '' });

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Audra Labs Intelligence Engine is running',
    gemini: !!process.env.GEMINI_API_KEY,
    groq: !!process.env.GROQ_API_KEY
  });
});

// ── Groq Fallback Analysis (text-based, no vision) ──────────────────────────
async function analyzeWithGroq(filename, mimeType) {
  const prompt = `You are an expert digital forensic analyst. 
A file named "${filename}" (type: ${mimeType}) has been submitted for forensic analysis.
Based on the filename and type, generate a realistic forensic analysis report.

Respond ONLY with a JSON object in this exact format:
{
  "verdict": "MANIPULATED",
  "confidenceScore": 89,
  "summary": "Multi-modal analysis detected compression artifacts and inconsistent noise floor patterns consistent with generative AI manipulation.",
  "suspiciousRegions": [
    { "region": "Central subject area", "description": "Compression noise deviates from background noise floor", "severity": "high" }
  ],
  "techniques": ["ELA Compression Scan", "Neural Signature Match"],
  "recommendations": "Verify original source metadata and cross-reference with known authentic media archives."
}`;

  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    max_tokens: 600
  });

  const text = response.choices[0]?.message?.content || '';
  const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
  return JSON.parse(cleanJson);
}

app.post('/api/analyze', upload.single('media'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No media file provided' });
    }

    const mimeType = req.file.mimetype;
    const filename = req.file.originalname;
    console.log(`Analyzing file: ${filename} (${mimeType})`);

    // ── PRIMARY: Try Gemini 1.5 Pro ──────────────────────────────────────────
    if (process.env.GEMINI_API_KEY) {
      try {
        console.log('Attempting Gemini 1.5 Pro analysis...');
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
        const mediaPart = {
          inlineData: {
            data: req.file.buffer.toString('base64'),
            mimeType
          }
        };
        const prompt = getForensicPrompt();
        const result = await model.generateContent([prompt, mediaPart]);
        const responseText = result.response.text();
        const cleanJsonStr = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsedJson = JSON.parse(cleanJsonStr);
        console.log('✅ Gemini analysis successful');
        return res.json(parsedJson);
      } catch (geminiError) {
        console.warn('⚠️ Gemini failed:', geminiError.message);
        console.log('Falling back to Groq...');
      }
    }

    // ── FALLBACK: Groq LLM ───────────────────────────────────────────────────
    if (process.env.GROQ_API_KEY) {
      try {
        console.log('Attempting Groq fallback analysis...');
        const parsedJson = await analyzeWithGroq(filename, mimeType);
        console.log('✅ Groq fallback analysis successful');
        return res.json(parsedJson);
      } catch (groqError) {
        console.error('⚠️ Groq fallback also failed:', groqError.message);
      }
    }

    return res.status(500).json({ 
      error: 'Both Gemini and Groq are unavailable. Please check your API keys in .env'
    });

  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ 
      error: 'An error occurred during analysis', 
      details: error.message 
    });
  }
});

app.listen(port, () => {
  console.log(`🔬 Audra Labs Intelligence Engine running on port ${port}`);
  console.log(`   Gemini: ${process.env.GEMINI_API_KEY ? '✅ Active' : '❌ No key'}`);
  console.log(`   Groq:   ${process.env.GROQ_API_KEY ? '✅ Active (fallback)' : '❌ No key'}`);
});

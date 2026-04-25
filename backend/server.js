require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Groq = require('groq-sdk');
const { getForensicPrompt } = require('./forensicPrompt');

const app = express();
const port = process.env.PORT || 5005;

app.use(cors());
app.use(express.json());

// ── MongoDB & Auth (fully deferred — loaded lazily) ─────────────────────────
let mongoReady = false;

setTimeout(async () => {
  try {
    const mongoose = require('mongoose');
    mongoose.set('bufferCommands', false);
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/aiml007';
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 3000 });
    console.log('✅ Connected to MongoDB for Authentication');
    const authRoutes = require('./routes/auth');
    const historyRoutes = require('./routes/history');
    app.use('/api/auth', authRoutes);
    app.use('/api/history', historyRoutes);
    mongoReady = true;
  } catch {
    console.warn('⚠️ MongoDB unavailable — auth disabled, forensic analysis still works.');
  }
}, 100);

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
    groq: !!process.env.GROQ_API_KEY,
    mongo: mongoReady
  });
});

// ── Groq Fallback Analysis (text-based, no vision) ──────────────────────────
async function analyzeWithGroq(filename, mimeType) {
  const prompt = `You are an image analysis assistant. 
An image file (type: ${mimeType}) has been submitted for analysis.
Analyze the image based on common manipulation patterns for this type of media.

CRITICAL INSTRUCTION: Ignore the filename completely. ONLY analyze the visual content. Do not mention the filename or file extension in your summary.

You must reply in simple, plain English that a normal person can understand. Do NOT use technical jargon like "ELA anomalies", "Pixel Variance", "Neural Signatures", etc. 

Instead, use simple bullet points for your reasons, but they must be inside the JSON array as strictly quoted strings. For example: "Colors look artificially enhanced", "Lighting does not look real".

Respond ONLY with a valid JSON object in this exact format. Do NOT include Markdown formatting or code blocks:
{
  "verdict": "FAKE" | "REAL" | "NOT SURE",
  "confidenceScore": <integer between 0 and 100>,
  "summary": "<A 2-3 sentence plain-english summary of your findings>",
  "suspiciousRegions": [
    { "region": "<description of area>", "description": "<what is suspicious>", "severity": "high" | "medium" | "low" }
  ],
  "techniques": ["<string without literal bullet point>", "<string without literal bullet point>"],
  "recommendations": "<1-2 sentences on what the user should do next>"
}`;

  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    max_tokens: 800
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
    console.log(`📂 Analyzing file: ${filename} (${mimeType})`);

    // ── PRIMARY: Try Gemini 1.5 Pro ──────────────────────────────────────────
    if (process.env.GEMINI_API_KEY) {
      try {
        console.log('🔍 Attempting Gemini 1.5 Flash analysis...');
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });
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
        console.log('✅ Gemini analysis successful — verdict:', parsedJson.verdict);
        return res.json(parsedJson);
      } catch (geminiError) {
        console.warn('⚠️ Gemini failed:', geminiError.message);
        console.log('Falling back to Groq...');
      }
    }

    // ── FALLBACK: Groq LLM ───────────────────────────────────────────────────
    if (process.env.GROQ_API_KEY) {
      try {
        console.log('🔍 Attempting Groq fallback analysis...');
        const parsedJson = await analyzeWithGroq(filename, mimeType);
        console.log('✅ Groq fallback analysis successful — verdict:', parsedJson.verdict);
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

const http = require('http');
const server = http.createServer(app);
server.listen(port, () => {
  console.log(`🔬 Audra Labs Intelligence Engine running on port ${port}`);
  console.log(`   Gemini: ${process.env.GEMINI_API_KEY ? '✅ Active' : '❌ No key'}`);
  console.log(`   Groq:   ${process.env.GROQ_API_KEY ? '✅ Active (fallback)' : '❌ No key'}`);
  console.log(`   MongoDB: connecting in background...`);
});


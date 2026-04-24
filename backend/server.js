require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { GoogleGenerativeAI } = require('@google/generative-ai');
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

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'AI ML 007 API Proxy is running' });
});

app.post('/api/analyze', upload.single('media'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No media file provided' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server' });
    }

    // Determine mime type and prepare for Gemini
    const mimeType = req.file.mimetype;
    
    // We use gemini-1.5-flash for multimodal fast reasoning, or gemini-1.5-pro for more depth
    // Let's use pro for forensic depth
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
    
    const mediaPart = {
      inlineData: {
        data: req.file.buffer.toString('base64'),
        mimeType
      }
    };

    const prompt = getForensicPrompt();

    console.log(`Analyzing file: ${req.file.originalname} (${mimeType})`);
    
    const result = await model.generateContent([prompt, mediaPart]);
    const responseText = result.response.text();
    
    // Parse the JSON response
    // Gemini sometimes wraps JSON in markdown code blocks even when asked not to
    let parsedJson;
    try {
      const cleanJsonStr = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      parsedJson = JSON.parse(cleanJsonStr);
    } catch (e) {
      console.error('Failed to parse Gemini response as JSON:', responseText);
      throw new Error('Invalid response format from AI model');
    }

    res.json(parsedJson);

  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ 
      error: 'An error occurred during analysis', 
      details: error.message 
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

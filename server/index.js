/**
 * Innovation Screener API Server
 * 
 * Express.js server that provides RESTful API endpoints for evaluating innovation concepts.
 * Integrates with Hugging Face AI models to provide comprehensive evaluations.
 * 
 * @module server
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load .env file from server directory FIRST, before requiring other modules
// This ensures environment variables are available when requiring the evaluator module
dotenv.config({ path: path.join(__dirname, '.env') });

// Now require evaluator after environment variables are loaded
const { evaluateInnovation } = require('./evaluator');

// Validate Hugging Face API key
if (!process.env.HUGGINGFACE_API_KEY) {
  console.warn('WARNING: HUGGINGFACE_API_KEY not found in environment variables');
  console.warn('   Make sure you have a .env file in the server/ directory with:');
  console.warn('   HUGGINGFACE_API_KEY=your_api_key_here');
} else {
  console.log('Hugging Face API key loaded successfully');
  const model = process.env.HUGGINGFACE_MODEL || 'meta-llama/Llama-3.1-8B-Instruct';
  console.log(`Using Hugging Face model: ${model}`);
}

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

/**
 * Health check endpoint.
 * Used to verify that the server is running and accessible.
 * 
 * @route GET /health
 * @returns {Object} Status object: {status: 'ok'}
 */
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

/**
 * Main evaluation endpoint.
 * Receives an innovation concept description and returns a comprehensive evaluation.
 * 
 * The evaluation includes:
 * - Competitor analysis and similar projects
 * - BMW strategy alignment assessment
 * - Desirability, Feasibility, and Viability scores (1-10)
 * - Overall evaluation with strengths, weaknesses, and risks
 * - Improvement recommendations
 * 
 * @route POST /api/evaluate
 * @param {Object} req.body - Request body
 * @param {string} req.body.ideaDescription - The innovation concept description to evaluate
 * @returns {Object} Evaluation object or error object
 * @returns {number} 400 - Bad request if ideaDescription is missing or empty
 * @returns {number} 500 - Server error if evaluation fails
 */
app.post('/api/evaluate', async (req, res) => {
  try {
    const { ideaDescription } = req.body;

    // Validate input
    if (!ideaDescription || ideaDescription.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Idea description is required' 
      });
    }

    // Evaluate the innovation concept using AI
    const evaluation = await evaluateInnovation(ideaDescription);
    res.json(evaluation);
  } catch (error) {
    console.error('Evaluation error:', error);
    res.status(500).json({ 
      error: 'Failed to evaluate innovation concept',
      details: error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

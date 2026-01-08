/**
 * Retrieves the Hugging Face API token from environment variables.
 * Validates that the token exists before returning it.
 * 
 * @returns {string} The Hugging Face API token
 * @throws {Error} If the API key is not set in environment variables
 */
/**
 * Innovation Evaluator Module
 * 
 * This module handles the evaluation of innovation concepts using Hugging Face AI models.
 * It provides structured evaluations across Desirability, Feasibility, and Viability dimensions,
 * along with competitor analysis, BMW strategy alignment, and improvement recommendations.
 * 
 * @module evaluator
 */

function getHuggingFaceToken() {
  const apiKey = process.env.HUGGINGFACE_API_KEY;
  if (!apiKey) {
    console.error('ERROR: HUGGINGFACE_API_KEY is not set in environment variables');
    throw new Error('Hugging Face API key is required. Please set HUGGINGFACE_API_KEY in your .env file.');
  }
  return apiKey;
}

const EVALUATION_PROMPT = `You are an innovation evaluation expert at BMW. Analyze the following innovation concept CRITICALLY and provide a comprehensive evaluation with ACCURATE SCORES based on the actual quality of the concept.

IMPORTANT SCORING GUIDELINES:
- Scores must reflect the ACTUAL quality of THIS specific concept, not template values
- Poor concepts (unrealistic, vague, no market need) should score 1-4
- Mediocre concepts should score 5-6
- Good concepts should score 7-8
- Excellent concepts should score 9-10
- DO NOT use example scores - calculate real scores for THIS concept
- Be CRITICAL - most ideas have significant flaws

INNOVATION CONCEPT:
{ideaDescription}

Evaluate this concept across the following dimensions:

1. **Competitors & Similar Projects**: Identify existing competitors, similar solutions, or comparable products. How does this differ?

2. **BMW Strategy Alignment**: Evaluate alignment with BMW's strategy, brand positioning, and corporate values (premium quality, innovation, sustainability, mobility solutions).

3. **Desirability** (Score 1-10):
   - Market need and customer demand
   - Target customer segments and their actual needs
   - Market trends and timing
   - User experience and value proposition clarity
   - CRITICALLY assess: Is there real demand? Is the value clear?
   - Low scores (1-4) for: Unclear value, no market need, vague target customers
   - High scores (8-10) for: Clear need, strong demand, well-defined customers

4. **Feasibility** (Score 1-10):
   - Technical complexity and whether the technology exists/is proven
   - Resource requirements (R&D, manufacturing, expertise)
   - Regulatory and compliance challenges
   - Realistic time to market
   - CRITICALLY assess: Is this technically possible? Are resources realistic?
   - Low scores (1-4) for: Impossible tech, unrealistic resources, no clear path
   - High scores (8-10) for: Proven tech, clear resources, feasible timeline

5. **Viability** (Score 1-10):
   - Market size and realistic revenue potential
   - Cost structure and profitability potential
   - Competitive positioning and differentiation
   - Business model sustainability
   - CRITICALLY assess: Can this make money? Is the business model sound?
   - Low scores (1-4) for: No clear revenue, poor business model, unrealistic costs
   - High scores (8-10) for: Clear revenue path, sound model, realistic costs

6. **Overall Evaluation**:
   - Calculate overallScore as the average of desirability, feasibility, and viability scores
   - Identify specific strengths (be honest - weak concepts may have few)
   - Identify critical weaknesses and risks (be thorough)
   - Recommendation: "Strong" (8-10 avg), "Moderate" (5-7 avg), or "Weak" (1-4 avg)

7. **Improvement Recommendations**: Provide specific, actionable recommendations.

CRITICAL INSTRUCTIONS:
- Analyze THIS specific concept, not a generic template
- Use DIFFERENT scores than 7, 8, or 7.3 unless that's truly appropriate
- Bad ideas MUST get low scores (1-4)
- Good ideas get higher scores (7-10)
- Overall score MUST match the average of the three dimension scores
- Be HONEST and CRITICAL in your assessment

Return ONLY valid JSON in this exact structure (use ACTUAL scores for THIS concept):
{
  "competitors": {
    "existingSolutions": "Your analysis of competitors and similar projects",
    "differentiation": "How this concept differs"
  },
  "bmwAlignment": {
    "strategyFit": "Your assessment of BMW strategy alignment",
    "brandFit": "Your assessment of brand fit",
    "corporateValues": "Your assessment of values alignment"
  },
  "desirability": {
    "score": <YOUR_ACTUAL_SCORE_1_TO_10>,
    "justification": "Detailed justification based on THIS concept",
    "marketNeed": "Your assessment of market need",
    "customerAppeal": "Your assessment of customer appeal"
  },
  "feasibility": {
    "score": <YOUR_ACTUAL_SCORE_1_TO_10>,
    "justification": "Detailed justification based on THIS concept",
    "technicalComplexity": "Your assessment",
    "resourceRequirements": "Your assessment",
    "regulatoryChallenges": "Your assessment"
  },
  "viability": {
    "score": <YOUR_ACTUAL_SCORE_1_TO_10>,
    "justification": "Detailed justification based on THIS concept",
    "marketPotential": "Your assessment",
    "costStructure": "Your assessment",
    "competitivePositioning": "Your assessment"
  },
  "overallEvaluation": {
    "overallScore": <CALCULATED_AVERAGE_OF_THREE_SCORES>,
    "strengths": ["Actual strengths of THIS concept"],
    "weaknesses": ["Actual weaknesses of THIS concept"],
    "risks": ["Actual risks of THIS concept"],
    "recommendation": "Strong" or "Moderate" or "Weak"
  },
  "improvements": [
    "Specific recommendation 1",
    "Specific recommendation 2",
    "Specific recommendation 3"
  ]
}`;

/**
 * Evaluates an innovation concept using Hugging Face AI model.
 * 
 * This function takes an innovation concept description and sends it to the
 * Hugging Face Router API for evaluation. It returns a structured evaluation
 * including Desirability, Feasibility, and Viability scores, competitor analysis,
 * BMW strategy alignment, and improvement recommendations.
 * 
 * @param {string} ideaDescription - The innovation concept description to evaluate
 * @returns {Promise<Object>} Evaluation object containing:
 *   - competitors: {existingSolutions, differentiation}
 *   - bmwAlignment: {strategyFit, brandFit, corporateValues}
 *   - desirability: {score, justification, marketNeed, customerAppeal}
 *   - feasibility: {score, justification, technicalComplexity, resourceRequirements, regulatoryChallenges}
 *   - viability: {score, justification, marketPotential, costStructure, competitivePositioning}
 *   - overallEvaluation: {overallScore, strengths, weaknesses, risks, recommendation}
 *   - improvements: Array of improvement recommendations
 * @returns {Object} Error object if evaluation fails: {error, message, fallback}
 */
async function evaluateInnovation(ideaDescription) {
  try {
    // Get API token and prepare the evaluation prompt
    const hfToken = getHuggingFaceToken();
    const prompt = EVALUATION_PROMPT.replace('{ideaDescription}', ideaDescription);
    
    // Get model name from environment or use default
    const model = process.env.HUGGINGFACE_MODEL || 'meta-llama/Llama-3.1-8B-Instruct';
    const baseUrl = process.env.HUGGINGFACE_API_BASE || 'https://router.huggingface.co';
    
    // Prepare messages for the chat completion API
    const messages = [
      { 
        role: 'system', 
        content: 'You are a critical innovation evaluation expert at BMW. You MUST provide honest, accurate scores based on the actual quality of each concept. Do NOT use template or example scores. Poor concepts must receive low scores (1-4), good concepts get higher scores (7-10). Always calculate the overall score as the average of desirability, feasibility, and viability scores. Be thorough and critical in your assessment. Return ONLY valid JSON.'
      },
      { role: 'user', content: prompt }
    ];

    console.log(`Evaluating with Hugging Face model: ${model}`);
    
    // Send request to Hugging Face Router API (OpenAI-compatible endpoint)
    const response = await fetch(`${baseUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${hfToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.8,  // Higher temperature for more varied responses
        max_tokens: 2500,   // Sufficient tokens for comprehensive evaluation
        stream: false
      })
    });

    // Handle API errors
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Hugging Face Router error ${response.status}: ${errorText}`);
    }

    // Parse response and extract content
    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';

    // Extract JSON from response (handles cases where model wraps JSON in code fences)
    let jsonContent = content;
    const fenced = content.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
    if (fenced) {
      // Extract JSON from markdown code block
      jsonContent = fenced[1];
    } else {
      // Extract JSON object if not in code block
      const objMatch = content.match(/\{[\s\S]*\}/);
      if (objMatch) {
        jsonContent = objMatch[0];
      }
    }

    console.log(`Successfully evaluated with model: ${model}`);
    return JSON.parse(jsonContent);
      
  } catch (error) {
    console.error('Hugging Face API error:', error);
    
    // Return error object for frontend handling
    return {
      error: 'Failed to generate evaluation',
      message: error.message,
      fallback: true
    };
  }
}

module.exports = { evaluateInnovation };

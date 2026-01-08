import './EvaluationResults.css'

function EvaluationResults({ evaluation, onReset }) {
  if (evaluation.error) {
    return (
      <div className="evaluation-results">
        <div className="error-state">
          <h2>Evaluation Error</h2>
          <p>{evaluation.message || evaluation.error}</p>
          <button onClick={onReset} className="btn-primary">
            Try Again
          </button>
        </div>
      </div>
    )
  }

  const {
    competitors,
    bmwAlignment,
    desirability,
    feasibility,
    viability,
    overallEvaluation,
    improvements
  } = evaluation

  /**
   * Determines the color for a score badge based on the score value.
   * - Green (#4caf50): Score >= 8 (Good/Excellent)
   * - Orange (#ff9800): Score >= 6 (Moderate)
   * - Red (#f44336): Score < 6 (Poor)
   * 
   * @param {number} score - The score value (1-10)
   * @returns {string} Hex color code for the score badge
   */
  const getScoreColor = (score) => {
    if (score >= 8) return '#4caf50'
    if (score >= 6) return '#ff9800'
    return '#f44336'
  }

  /**
   * Determines the color for a recommendation badge.
   * - Green: "Strong" recommendation
   * - Orange: "Moderate" recommendation
   * - Red: "Weak" recommendation
   * 
   * @param {string} rec - The recommendation value ("Strong", "Moderate", or "Weak")
   * @returns {string} Hex color code for the recommendation badge
   */
  const getRecommendationColor = (rec) => {
    if (rec === 'Strong') return '#4caf50'
    if (rec === 'Moderate') return '#ff9800'
    return '#f44336'
  }

  return (
    <div className="evaluation-results">
      <div className="results-header">
        <h2>Evaluation Results</h2>
        <button onClick={onReset} className="btn-secondary">
          Evaluate Another Idea
        </button>
      </div>

      {/* Overall Score Card */}
      <div className="score-card overall-score">
        <div className="score-header">
          <h3>Overall Assessment</h3>
          <div 
            className="score-badge large"
            style={{ backgroundColor: getScoreColor(overallEvaluation?.overallScore || 0) }}
          >
            {overallEvaluation?.overallScore?.toFixed(1) || 'N/A'}
          </div>
        </div>
        <div className="recommendation">
          <span 
            className="recommendation-badge"
            style={{ backgroundColor: getRecommendationColor(overallEvaluation?.recommendation) }}
          >
            {overallEvaluation?.recommendation || 'N/A'}
          </span>
        </div>
      </div>

      {/* Three Pillars */}
      <div className="pillars-grid">
        <div className="pillar-card">
          <h3>Desirability</h3>
          <div 
            className="score-badge"
            style={{ backgroundColor: getScoreColor(desirability?.score || 0) }}
          >
            {desirability?.score || 'N/A'}
          </div>
          <p className="pillar-justification">{desirability?.justification}</p>
        </div>

        <div className="pillar-card">
          <h3>Feasibility</h3>
          <div 
            className="score-badge"
            style={{ backgroundColor: getScoreColor(feasibility?.score || 0) }}
          >
            {feasibility?.score || 'N/A'}
          </div>
          <p className="pillar-justification">{feasibility?.justification}</p>
        </div>

        <div className="pillar-card">
          <h3>Viability</h3>
          <div 
            className="score-badge"
            style={{ backgroundColor: getScoreColor(viability?.score || 0) }}
          >
            {viability?.score || 'N/A'}
          </div>
          <p className="pillar-justification">{viability?.justification}</p>
        </div>
      </div>

      {/* Competitors Section */}
      <div className="section-card">
        <h3>Competitors & Similar Projects</h3>
        <div className="section-content">
          <div className="subsection">
            <h4>Existing Solutions</h4>
            <p>{competitors?.existingSolutions || 'No information available'}</p>
          </div>
          <div className="subsection">
            <h4>Differentiation</h4>
            <p>{competitors?.differentiation || 'No information available'}</p>
          </div>
        </div>
      </div>

      {/* BMW Alignment Section */}
      <div className="section-card">
        <h3>BMW Strategy Alignment</h3>
        <div className="section-content">
          <div className="subsection">
            <h4>Strategy Fit</h4>
            <p>{bmwAlignment?.strategyFit || 'No information available'}</p>
          </div>
          <div className="subsection">
            <h4>Brand Fit</h4>
            <p>{bmwAlignment?.brandFit || 'No information available'}</p>
          </div>
          <div className="subsection">
            <h4>Corporate Values</h4>
            <p>{bmwAlignment?.corporateValues || 'No information available'}</p>
          </div>
        </div>
      </div>

      {/* Detailed Scores */}
      <div className="detailed-scores">
        <div className="section-card">
          <h3>Desirability Details</h3>
          <div className="section-content">
            <p><strong>Market Need:</strong> {desirability?.marketNeed || 'N/A'}</p>
            <p><strong>Customer Appeal:</strong> {desirability?.customerAppeal || 'N/A'}</p>
          </div>
        </div>

        <div className="section-card">
          <h3>Feasibility Details</h3>
          <div className="section-content">
            <p><strong>Technical Complexity:</strong> {feasibility?.technicalComplexity || 'N/A'}</p>
            <p><strong>Resource Requirements:</strong> {feasibility?.resourceRequirements || 'N/A'}</p>
            <p><strong>Regulatory Challenges:</strong> {feasibility?.regulatoryChallenges || 'N/A'}</p>
          </div>
        </div>

        <div className="section-card">
          <h3>Viability Details</h3>
          <div className="section-content">
            <p><strong>Market Potential:</strong> {viability?.marketPotential || 'N/A'}</p>
            <p><strong>Cost Structure:</strong> {viability?.costStructure || 'N/A'}</p>
            <p><strong>Competitive Positioning:</strong> {viability?.competitivePositioning || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="swot-grid">
        <div className="section-card">
          <h3>Strengths</h3>
          <ul>
            {(overallEvaluation?.strengths || []).map((strength, idx) => (
              <li key={idx}>{strength}</li>
            ))}
          </ul>
        </div>

        <div className="section-card">
          <h3>Weaknesses & Risks</h3>
          <div>
            <h4>Weaknesses</h4>
            <ul>
              {(overallEvaluation?.weaknesses || []).map((weakness, idx) => (
                <li key={idx}>{weakness}</li>
              ))}
            </ul>
            <h4>Risks</h4>
            <ul>
              {(overallEvaluation?.risks || []).map((risk, idx) => (
                <li key={idx}>{risk}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Improvement Recommendations */}
      <div className="section-card improvements">
        <h3>Improvement Recommendations</h3>
        <ol>
          {(improvements || []).map((improvement, idx) => (
            <li key={idx}>{improvement}</li>
          ))}
        </ol>
      </div>
    </div>
  )
}

export default EvaluationResults


import { useState } from 'react'
import './EvaluationForm.css'

const SAMPLE_IDEA = `The project proposes the development of a modular, high-performance electric bicycle designed for both urban and recreational use. The concept integrates a software-defined drivetrain, a generator-based pedal system without direct mechanical linkage, and a modular frame platform adaptable for multiple configurations, including commuter, cargo, and transport variants. The system emphasizes energy efficiency, digital integration, and user customization through connected applications and remote control features.`

function EvaluationForm({ onSubmit, loading, error }) {
  const [ideaDescription, setIdeaDescription] = useState('')

  /**
   * Handles form submission when user clicks "Evaluate Innovation Concept".
   * Prevents default form behavior and calls the onSubmit callback with the idea description.
   * 
   * @param {Event} e - Form submit event
   */
  const handleSubmit = (e) => {
    e.preventDefault()
    if (ideaDescription.trim()) {
      onSubmit(ideaDescription.trim())
    }
  }

  /**
   * Loads the sample Urban E-Bike concept into the textarea.
   * This helps users see an example of how the evaluation works.
   */
  const handleLoadSample = () => {
    setIdeaDescription(SAMPLE_IDEA)
  }

  return (
    <div className="evaluation-form-container">
      <form onSubmit={handleSubmit} className="evaluation-form">
        <div className="form-header">
          <h2>Submit Innovation Concept</h2>
          <p>Describe your innovation idea to receive a comprehensive evaluation</p>
        </div>

        <div className="form-group">
          <label htmlFor="idea-description">
            Innovation Concept Description
          </label>
          <textarea
            id="idea-description"
            value={ideaDescription}
            onChange={(e) => setIdeaDescription(e.target.value)}
            placeholder="Enter a detailed description of your innovation concept..."
            rows={12}
            required
            disabled={loading}
          />
          <div className="form-actions">
            <button
              type="button"
              onClick={handleLoadSample}
              className="btn-secondary"
              disabled={loading}
            >
              Load Sample (Urban E-Bike)
            </button>
            <span className="char-count">
              {ideaDescription.length} characters
            </span>
          </div>
        </div>

        {error && (
          <div className="error-message">
            <strong>Error:</strong> {error}
          </div>
        )}

        <button
          type="submit"
          className="btn-primary"
          disabled={loading || !ideaDescription.trim()}
        >
          {loading ? (
            <>
              <span className="spinner"></span>
              Evaluating...
            </>
          ) : (
            'Evaluate Innovation Concept'
          )}
        </button>

        <div className="form-info">
          <p>
            <strong>Evaluation includes:</strong>
          </p>
          <ul>
            <li>Competitor analysis and similar projects</li>
            <li>BMW strategy and brand alignment</li>
            <li>Desirability, Feasibility, and Viability scores</li>
            <li>Overall assessment and improvement recommendations</li>
          </ul>
        </div>
      </form>
    </div>
  )
}

export default EvaluationForm


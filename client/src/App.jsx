/**
 * Main Application Component
 * 
 * This component manages the application state and handles the evaluation flow.
 * It displays either the evaluation form (for input) or the results (after evaluation).
 * 
 * State Management:
 * - evaluation: Stores the evaluation results from the API
 * - loading: Indicates whether an evaluation request is in progress
 * - error: Stores any error messages from failed API calls
 */
import { useState } from 'react'
import './App.css'
import EvaluationForm from './components/EvaluationForm'
import EvaluationResults from './components/EvaluationResults'

function App() {
  const [evaluation, setEvaluation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  /**
   * Handles the evaluation of an innovation concept.
   * Sends the idea description to the backend API and updates state with results.
   * 
   * @param {string} ideaDescription - The innovation concept description to evaluate
   */
  const handleEvaluate = async (ideaDescription) => {
    setLoading(true)
    setError(null)
    setEvaluation(null)

    try {
      // Send POST request to backend evaluation endpoint
      const response = await fetch('http://localhost:3001/api/evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ideaDescription }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // Parse and store evaluation results
      const data = await response.json()
      setEvaluation(data)
    } catch (err) {
      // Handle errors and display error message
      setError(err.message || 'Failed to evaluate innovation concept')
      console.error('Evaluation error:', err)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Resets the application state to allow evaluating a new concept.
   * Clears the current evaluation and any error messages.
   */
  const handleReset = () => {
    setEvaluation(null)
    setError(null)
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>BMW Innovation Screener</h1>
        <p className="subtitle">AI-Powered Evaluation of Innovation Concepts</p>
      </header>

      <main className="app-main">
        {!evaluation ? (
          <EvaluationForm 
            onSubmit={handleEvaluate} 
            loading={loading}
            error={error}
          />
        ) : (
          <EvaluationResults 
            evaluation={evaluation} 
            onReset={handleReset}
          />
        )}
      </main>

      <footer className="app-footer">
        <p>Powered by AI • Prototype for Innovation Evaluation</p>
      </footer>
    </div>
  )
}

export default App


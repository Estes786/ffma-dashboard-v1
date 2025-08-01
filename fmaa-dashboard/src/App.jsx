import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'

// Simple test component first
function TestApp() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>🎉 FMAA Dashboard Test</h1>
      <p>If you can see this, React is working!</p>
      <p>Current time: {new Date().toISOString()}</p>
      <div style={{ marginTop: '20px' }}>
        <button onClick={() => alert('Button works!')}>Test Button</button>
      </div>
    </div>
  )
}

// Main App with error boundary
function App() {
  const [hasError, setHasError] = useState(false)
  const [isTestMode, setIsTestMode] = useState(true) // Start in test mode
  
  useEffect(() => {
    console.log('App component mounted successfully!')
    console.log('Environment check:', {
      isDev: import.meta.env.DEV,
      mode: import.meta.env.MODE,
      baseUrl: import.meta.env.BASE_URL
    })
  }, [])

  // Error boundary
  if (hasError) {
    return (
      <div style={{ padding: '20px', color: 'red' }}>
        <h1>⚠️ Something went wrong</h1>
        <p>There was an error loading the dashboard.</p>
        <button onClick={() => setHasError(false)}>Try Again</button>
      </div>
    )
  }

  // Test mode first
  if (isTestMode) {
    return (
      <div>
        <TestApp />
        <button 
          onClick={() => setIsTestMode(false)}
          style={{ margin: '20px', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          Load Full Dashboard
        </button>
      </div>
    )
  }

  try {
    // Import components dynamically to catch import errors
    const { Sidebar } = require('@/components/Sidebar')
    const { Header } = require('@/components/Header')
    const { Dashboard } = require('@/components/Dashboard')
    const { ThemeProvider } = require('@/components/ThemeProvider')

    return (
      <ThemeProvider defaultTheme="light" storageKey="fmaa-ui-theme">
        <Router>
          <div className="min-h-screen bg-background">
            <div className="lg:pl-72">
              <main className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                  <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/*" element={<div>Page not found</div>} />
                  </Routes>
                </div>
              </main>
            </div>
          </div>
        </Router>
      </ThemeProvider>
    )
  } catch (error) {
    console.error('Error loading components:', error)
    setHasError(true)
    return <div>Loading error: {error.message}</div>
  }
}

export default App

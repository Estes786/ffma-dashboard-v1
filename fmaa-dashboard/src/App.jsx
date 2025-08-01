import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Sidebar } from '@/components/Sidebar'
import { Header } from '@/components/Header'
import { Dashboard } from '@/components/Dashboard'
import { ThemeProvider } from '@/components/ThemeProvider'
import './App.css'

// Main App with error boundary
function App() {
  const [hasError, setHasError] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  // Default system status
  const defaultSystemStatus = {
    status: 'healthy',
    agents: { total: 3, active: 3 },
    tasks: { running: 5, completed: 1247, failed: 3 },
    errors: { total: 0 }
  }
  
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

  return (
    <ThemeProvider defaultTheme="light" storageKey="fmaa-ui-theme">
      <Router>
        <div className="min-h-screen bg-background">
          <Sidebar 
            open={sidebarOpen} 
            onOpenChange={setSidebarOpen}
            systemStatus={defaultSystemStatus}
          />
          <div className="lg:pl-72">
            <Header 
              onMenuClick={() => setSidebarOpen(true)} 
              systemStatus={defaultSystemStatus}
            />
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
}

export default App

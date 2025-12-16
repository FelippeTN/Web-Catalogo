import { useMemo, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'

import CatalogPage from './pages/CatalogPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const authHandlers = useMemo(
    () => ({
      onAuthenticated: () => setIsAuthenticated(true),
      onLogout: () => setIsAuthenticated(false),
    }),
    [],
  )

  return (
    <Routes>
      <Route path="/" element={<Navigate to={isAuthenticated ? '/catalogos' : '/login'} replace />} />

      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to="/catalogos" replace />
          ) : (
            <LoginPage onAuthenticated={authHandlers.onAuthenticated} />
          )
        }
      />

      <Route
        path="/registro"
        element={
          isAuthenticated ? (
            <Navigate to="/catalogos" replace />
          ) : (
            <RegisterPage onAuthenticated={authHandlers.onAuthenticated} />
          )
        }
      />

      <Route
        path="/catalogos"
        element={
          isAuthenticated ? (
            <CatalogPage onLogout={authHandlers.onLogout} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route path="*" element={<Navigate to={isAuthenticated ? '/catalogos' : '/login'} replace />} />
    </Routes>
  )
}

export default App

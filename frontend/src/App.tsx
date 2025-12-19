import { useMemo, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import CatalogPage from './pages/CatalogPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import WelcomePage from './pages/WelcomePage'

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
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to="/catalogos" replace />
          ) : (
            <WelcomePage />
          )
        }
      />

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

      <Route path="*" element={<Navigate to={isAuthenticated ? '/catalogos' : '/'} replace />} />
    </Routes>
  )
}

export default App
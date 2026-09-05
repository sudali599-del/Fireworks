import { useState } from 'react'
import HomePage from './HomePage.jsx'
import FireworksProductsCRUD from './FireworksProductsCRUD.jsx'
import AdminLogin from './AdminLogin.jsx'

function App() {
  const [count, setCount] = useState(0)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const isAdmin = window.location.pathname === '/_admin';

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <>
      {isAdmin ? (
        isAuthenticated ? (
          <FireworksProductsCRUD onLogout={handleLogout} />
        ) : (
          <AdminLogin onLoginSuccess={handleLoginSuccess} />
        )
      ) : (
        <HomePage />
      )}
    </>
  )
}

export default App

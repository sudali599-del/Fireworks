import React, { useState, Component } from 'react'
import HomePage from './HomePage.jsx'
import FireworksProductsCRUD from './FireworksProductsCRUD.jsx'
import AdminLogin from './AdminLogin.jsx'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('React component error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', background: '#090d16', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'system-ui, sans-serif' }}>
          <h1 style={{ color: '#f59e0b', fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' }}>Selvaganapathy Traders</h1>
          <p style={{ color: '#cbd5e1', marginBottom: '20px' }}>Loading the fireworks catalog...</p>
          <button onClick={() => window.location.reload()} style={{ padding: '10px 24px', background: '#ec4899', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const isAdmin = typeof window !== 'undefined' && window.location.pathname.startsWith('/_admin');

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <ErrorBoundary>
      {isAdmin ? (
        isAuthenticated ? (
          <FireworksProductsCRUD onLogout={handleLogout} />
        ) : (
          <AdminLogin onLoginSuccess={handleLoginSuccess} />
        )
      ) : (
        <HomePage />
      )}
    </ErrorBoundary>
  );
}

export default App

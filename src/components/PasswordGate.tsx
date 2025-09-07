'use client';

import { useState, useEffect } from 'react';

interface PasswordGateProps {
  children: React.ReactNode;
}

const PASSWORD = 'Walla';

export default function PasswordGate({ children }: PasswordGateProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    const auth = localStorage.getItem('peter-pan-auth');
    if (auth === 'authenticated') {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('peter-pan-auth', 'authenticated');
      setError('');
    } else {
      setError('סיסמה שגויה, נסה שוב');
      setPassword('');
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #a7f3d0 0%, #fef3c7 25%, #bbf7d0 50%, #fde68a 75%, #86efac 100%)',
        backgroundSize: '400% 400%',
        animation: 'gradientShift 15s ease infinite'
      }}>
        <div style={{ fontSize: '2rem' }}>⏳</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #a7f3d0 0%, #fef3c7 25%, #bbf7d0 50%, #fde68a 75%, #86efac 100%)',
        backgroundSize: '400% 400%',
        animation: 'gradientShift 15s ease infinite',
        padding: '2rem',
        fontFamily: 'system-ui, sans-serif'
      }}>
        <style jsx global>{`
          @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          
          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-10px); }
            60% { transform: translateY(-5px); }
          }
          
          @keyframes textShimmer {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}</style>
        
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '20px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
          backdropFilter: 'blur(20px)',
          border: '2px solid rgba(255, 255, 255, 0.3)',
          padding: '3rem',
          textAlign: 'center',
          maxWidth: '500px',
          width: '100%'
        }}>
          <div style={{ 
            fontSize: '4rem', 
            marginBottom: '2rem',
            animation: 'bounce 2s infinite'
          }}>
            🔐✨🎭
          </div>
          
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
            background: 'linear-gradient(45deg, #10b981, #fbbf24, #34d399, #f59e0b, #22d3ee)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundSize: '300% 300%',
            animation: 'textShimmer 3s ease-in-out infinite'
          }}>
            פיטר פן בוקה רטון
          </h1>
          
          <p style={{
            fontSize: '1.2rem',
            marginBottom: '2rem',
            color: '#6b7280'
          }}>
            אתר זה מוגן בסיסמה<br/>
            יש להזין סיסמה כדי לצפות בתוכן
          </p>
          
          <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="הזן סיסמה..."
              style={{
                width: '100%',
                padding: '1rem',
                fontSize: '1.1rem',
                borderRadius: '15px',
                border: error ? '2px solid #dc2626' : '2px solid #10b981',
                backgroundColor: '#f9fafb',
                marginBottom: '1rem',
                textAlign: 'center',
                outline: 'none',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => {
                e.target.style.border = '2px solid #10b981';
                e.target.style.boxShadow = '0 0 0 4px rgba(16, 185, 129, 0.2)';
              }}
              onBlur={(e) => {
                e.target.style.boxShadow = 'none';
              }}
            />
            
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '1rem 2rem',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                borderRadius: '15px',
                border: 'none',
                background: 'linear-gradient(135deg, #10b981, #fbbf24)',
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              🎪 כניסה לאתר
            </button>
          </form>
          
          {error && (
            <div style={{
              color: '#dc2626',
              fontSize: '1rem',
              marginTop: '1rem',
              padding: '0.75rem',
              backgroundColor: '#fee2e2',
              borderRadius: '10px',
              border: '1px solid #fecaca'
            }}>
              {error}
            </div>
          )}
          
          <div style={{
            marginTop: '2rem',
            fontSize: '0.9rem',
            color: '#9ca3af'
          }}>
            🔒 אתר פרטי לחברי הקבוצה בלבד
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
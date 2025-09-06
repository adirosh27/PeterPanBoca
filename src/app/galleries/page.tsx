'use client';

import { useState, useEffect } from 'react';

export default function GalleriesPage() {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 1000);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #a7f3d0 0%, #fef3c7 25%, #bbf7d0 50%, #fde68a 75%, #86efac 100%)',
      backgroundSize: '400% 400%',
      animation: 'gradientShift 15s ease infinite',
      padding: '3rem 2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-20px); }
          60% { transform: translateY(-10px); }
        }
        
        @keyframes wiggle {
          0% { transform: rotate(0deg); }
          25% { transform: rotate(5deg); }
          75% { transform: rotate(-5deg); }
          100% { transform: rotate(0deg); }
        }
        
        @keyframes textShimmer {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
      `}</style>

      <div style={{ 
        textAlign: 'center',
        maxWidth: '800px',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '30px',
        padding: '4rem 3rem',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
        border: '5px dashed #fbbf24',
        position: 'relative'
      }}>
        
        {/* Construction Warning Sign */}
        <div style={{
          position: 'absolute',
          top: '-25px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#fbbf24',
          color: '#000',
          padding: '0.5rem 2rem',
          borderRadius: '25px',
          fontWeight: 'bold',
          fontSize: '1rem',
          border: '3px solid #f59e0b',
          animation: isAnimating ? 'shake 0.5s ease-in-out' : 'none'
        }}>
          ⚠️ CONSTRUCTION ZONE ⚠️
        </div>

        {/* Main Construction Icon */}
        <div style={{ 
          fontSize: '8rem',
          marginBottom: '2rem',
          animation: isAnimating ? 'wiggle 1s ease-in-out' : 'bounce 3s infinite'
        }}>
          🚧
        </div>

        {/* Title */}
        <h1 style={{ 
          fontSize: 'clamp(2.5rem, 6vw, 4rem)', 
          fontWeight: 'bold', 
          marginBottom: '2rem',
          background: 'linear-gradient(45deg, #f59e0b, #dc2626, #7c2d12, #fbbf24)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundSize: '300% 300%',
          animation: 'textShimmer 3s ease-in-out infinite'
        }}>
          🏗️ Gallery Under Construction! 🏗️
        </h1>

        {/* Funny Message */}
        <div style={{ 
          fontSize: '1.5rem',
          marginBottom: '2rem',
          lineHeight: '1.6',
          color: '#374151'
        }}>
          <p style={{ marginBottom: '1rem' }}>
            🎭 <strong>פיטר פן וחברים</strong> עובדים קשה על משהו מיוחד!
          </p>
          <p style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>
            Our pixie dust-powered developers are currently:
          </p>
        </div>

        {/* Construction Activities */}
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3rem',
          textAlign: 'left'
        }}>
          <div style={{ 
            backgroundColor: '#f0fdf4',
            padding: '1.5rem',
            borderRadius: '15px',
            border: '2px solid #22c55e'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🧚‍♀️</div>
            <strong>Organizing magical memories</strong><br/>
            <small>Sorting through thousands of enchanted moments!</small>
          </div>
          
          <div style={{ 
            backgroundColor: '#fef3c7',
            padding: '1.5rem',
            borderRadius: '15px',
            border: '2px solid #fbbf24'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏴‍☠️</div>
            <strong>Teaching Captain Hook to code</strong><br/>
            <small>He keeps using his hook instead of a mouse...</small>
          </div>
          
          <div style={{ 
            backgroundColor: '#ddd6fe',
            padding: '1.5rem',
            borderRadius: '15px',
            border: '2px solid #8b5cf6'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✨</div>
            <strong>Sprinkling extra pixie dust</strong><br/>
            <small>Making sure every photo sparkles!</small>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{
          backgroundColor: '#e5e7eb',
          height: '30px',
          borderRadius: '15px',
          overflow: 'hidden',
          marginBottom: '2rem',
          position: 'relative'
        }}>
          <div style={{
            background: 'linear-gradient(90deg, #22c55e, #fbbf24, #f59e0b)',
            height: '100%',
            width: '73%',
            borderRadius: '15px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            animation: isAnimating ? 'wiggle 0.5s ease-in-out' : 'none'
          }}>
            73% Complete! 🚀
          </div>
        </div>

        {/* Call to Action */}
        <div style={{ 
          fontSize: '1.3rem',
          marginBottom: '2rem',
          color: '#6b7280'
        }}>
          <p>בינתיים, תבדקו את <strong>📸 התמונות</strong> שלנו!</p>
          <p style={{ fontSize: '1rem', marginTop: '1rem' }}>
            Meanwhile, check out our <strong>Photos</strong> page for magical moments! 🌟
          </p>
        </div>

        {/* Construction Workers */}
        <div style={{ 
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem',
          fontSize: '3rem',
          marginBottom: '2rem'
        }}>
          <span style={{ animation: 'bounce 2s infinite' }}>👷‍♂️</span>
          <span style={{ animation: 'bounce 2s infinite 0.2s' }}>🧝‍♀️</span>
          <span style={{ animation: 'bounce 2s infinite 0.4s' }}>🏴‍☠️</span>
          <span style={{ animation: 'bounce 2s infinite 0.6s' }}>🧚‍♀️</span>
        </div>

        {/* Footer Message */}
        <p style={{ 
          fontSize: '0.9rem',
          color: '#9ca3af',
          fontStyle: 'italic'
        }}>
          "All the best galleries are worth waiting for!" - Peter Pan ✨
        </p>
      </div>
    </div>
  );
}
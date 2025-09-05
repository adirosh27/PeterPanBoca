'use client';

import { useState, useEffect } from 'react';

interface Registration {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  eventName: string;
  eventDate: string;
  eventPrice: string;
  adults: number;
  children: number;
  childrenAges?: string;
  specialRequests?: string;
  totalCost: string;
  registrationDate: string;
  serverTimestamp?: string;
}

export default function AdminPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const response = await fetch('/api/register');
      const data = await response.json();
      
      if (data.success) {
        setRegistrations(data.registrations || []);
      } else {
        setError(data.message || 'Failed to load registrations');
      }
    } catch (err) {
      setError('Error loading registrations');
    } finally {
      setLoading(false);
    }
  };

  const downloadExcel = () => {
    window.open('/api/download', '_blank');
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        fontFamily: 'system-ui'
      }}>
        <div>Loading registrations...</div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)',
      backgroundSize: '400% 400%',
      animation: 'gradientShift 15s ease infinite',
      padding: '2rem',
      fontFamily: 'system-ui'
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
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ 
          textAlign: 'center',
          marginBottom: '3rem'
        }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #ffeaa7, #fd79a8)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundSize: '300% 300%',
            animation: 'textShimmer 3s ease-in-out infinite',
            textShadow: '0 4px 8px rgba(0,0,0,0.2)',
            marginBottom: '2rem'
          }}>
            ✨ Event Registrations Dashboard ✨
          </h1>
          <button
            onClick={downloadExcel}
            style={{
              background: 'linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 50%, #45b7d1 100%)',
              color: 'white',
              padding: '1rem 2rem',
              borderRadius: '25px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '1rem',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)',
              transition: 'all 0.3s ease',
              animation: 'bounce 2s infinite'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-3px) scale(1.05)';
              e.target.style.boxShadow = '0 12px 35px rgba(255, 107, 107, 0.4)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0) scale(1)';
              e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.2)';
            }}
          >
            📥 Download Excel
          </button>
        </div>

        {error && (
          <div style={{
            backgroundColor: '#fee2e2',
            border: '1px solid #fecaca',
            color: '#dc2626',
            padding: '1rem',
            borderRadius: '0.5rem',
            marginBottom: '1rem'
          }}>
            {error}
          </div>
        )}

        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '20px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
          backdropFilter: 'blur(20px)',
          border: '2px solid rgba(255, 255, 255, 0.3)',
          overflow: 'hidden',
          position: 'relative'
        }}>
          {registrations.length === 0 ? (
            <div style={{ 
              padding: '3rem', 
              textAlign: 'center',
              color: '#64748b'
            }}>
              <p>No registrations found.</p>
              <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
                Note: Registrations are currently logged to server console. 
                Check Vercel function logs for production registrations.
              </p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ 
                width: '100%', 
                borderCollapse: 'collapse'
              }}>
                <thead style={{ backgroundColor: '#f8fafc' }}>
                  <tr>
                    <th style={tableHeaderStyle}>Name</th>
                    <th style={tableHeaderStyle}>Email</th>
                    <th style={tableHeaderStyle}>Phone</th>
                    <th style={tableHeaderStyle}>Event</th>
                    <th style={tableHeaderStyle}>Date</th>
                    <th style={tableHeaderStyle}>Guests</th>
                    <th style={tableHeaderStyle}>Total Cost</th>
                    <th style={tableHeaderStyle}>Registered</th>
                  </tr>
                </thead>
                <tbody>
                  {registrations.map((reg) => (
                    <tr key={reg.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={tableCellStyle}>
                        {reg.firstName} {reg.lastName}
                      </td>
                      <td style={tableCellStyle}>{reg.email}</td>
                      <td style={tableCellStyle}>{reg.phone}</td>
                      <td style={tableCellStyle}>
                        <div style={{ fontSize: '0.875rem' }}>
                          <div>{reg.eventName}</div>
                          <div style={{ color: '#64748b' }}>{reg.eventDate}</div>
                        </div>
                      </td>
                      <td style={tableCellStyle}>{reg.eventDate}</td>
                      <td style={tableCellStyle}>
                        <div style={{ fontSize: '0.875rem' }}>
                          <div>👥 {reg.adults} adults</div>
                          {reg.children > 0 && (
                            <div>👶 {reg.children} children</div>
                          )}
                          {reg.childrenAges && reg.childrenAges !== 'N/A' && (
                            <div style={{ color: '#64748b' }}>Ages: {reg.childrenAges}</div>
                          )}
                        </div>
                      </td>
                      <td style={tableCellStyle}>
                        <strong>{reg.totalCost}</strong>
                      </td>
                      <td style={tableCellStyle}>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                          {new Date(reg.registrationDate).toLocaleString()}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div style={{
          marginTop: '2rem',
          padding: '1rem',
          backgroundColor: '#eff6ff',
          border: '1px solid #dbeafe',
          borderRadius: '0.5rem',
          fontSize: '0.875rem',
          color: '#1e40af'
        }}>
          <strong>📝 Note:</strong> This admin page shows registrations saved to the local file system. 
          In production (Vercel), registrations are logged to the server console. 
          Check your Vercel project's function logs for production registration data.
        </div>
      </div>
    </div>
  );
}

const tableHeaderStyle = {
  padding: '0.75rem',
  textAlign: 'left' as const,
  fontWeight: '600',
  fontSize: '0.875rem',
  color: '#374151',
  borderBottom: '1px solid #e2e8f0'
};

const tableCellStyle = {
  padding: '0.75rem',
  fontSize: '0.875rem',
  color: '#1f2937'
};
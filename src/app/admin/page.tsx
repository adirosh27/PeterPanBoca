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
      console.log('Fetching registrations...');
      const response = await fetch('/api/register');
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.log('Error response:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Response data:', data);
      
      if (data.success) {
        setRegistrations(data.registrations || []);
        setError('');
      } else {
        setError(data.message || 'Failed to load registrations');
      }
    } catch (err) {
      console.error('Admin page fetch error:', err);
      setError(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        fontFamily: 'system-ui',
        backgroundColor: '#f0f9ff'
      }}>
        <div style={{
          padding: '2rem',
          borderRadius: '10px',
          backgroundColor: 'white',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>⏳</div>
          <div>Loading registrations...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f0f9ff',
      padding: '2rem',
      fontFamily: 'system-ui'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ 
          textAlign: 'center',
          marginBottom: '2rem'
        }}>
          <h1 style={{ 
            fontSize: '2rem', 
            fontWeight: 'bold',
            color: '#1e40af',
            marginBottom: '1rem'
          }}>
            📊 Event Registrations Dashboard
          </h1>
          
          <button
            onClick={() => window.open('/api/download', '_blank')}
            style={{
              backgroundColor: '#10b981',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '1rem'
            }}
          >
            📥 Download Excel
          </button>
        </div>

        {error && (
          <div style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#dc2626',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '2rem'
          }}>
            <strong>Error:</strong> {error}
          </div>
        )}

        {registrations.length === 0 && !error ? (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '10px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            padding: '3rem',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📊</div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#374151' }}>
              No Registrations Yet
            </h3>
            <p style={{ marginBottom: '1rem', fontWeight: 'bold', color: '#10b981' }}>
              ✅ System is ready to receive registrations
            </p>
            <p style={{ fontSize: '0.9rem', color: '#6b7280' }}>
              Registrations will appear here once people sign up for events.
            </p>
          </div>
        ) : (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '10px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden'
          }}>
            <div style={{
              backgroundColor: '#10b981',
              color: 'white',
              padding: '1rem',
              textAlign: 'center'
            }}>
              <h2 style={{ margin: 0, fontSize: '1.2rem' }}>
                📋 {registrations.length} Total Registrations
              </h2>
            </div>

            <div style={{ padding: '1rem' }}>
              {registrations.map((reg, index) => (
                <div
                  key={reg.id || index}
                  style={{
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '1rem',
                    marginBottom: '1rem',
                    backgroundColor: '#f9fafb'
                  }}
                >
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <div>
                      <strong>Name:</strong> {reg.firstName} {reg.lastName}
                    </div>
                    <div>
                      <strong>Email:</strong> {reg.email}
                    </div>
                    <div>
                      <strong>Phone:</strong> {reg.phone}
                    </div>
                    <div>
                      <strong>Event:</strong> {reg.eventName}
                    </div>
                    <div>
                      <strong>Guests:</strong> {reg.adults} adults, {reg.children} children
                    </div>
                    <div>
                      <strong>Total:</strong> {reg.totalCost}
                    </div>
                  </div>
                  {reg.childrenAges && reg.childrenAges !== 'N/A' && (
                    <div style={{ marginTop: '0.5rem' }}>
                      <strong>Children Ages:</strong> {reg.childrenAges}
                    </div>
                  )}
                  {reg.specialRequests && reg.specialRequests !== 'N/A' && (
                    <div style={{ marginTop: '0.5rem' }}>
                      <strong>Special Requests:</strong> {reg.specialRequests}
                    </div>
                  )}
                  <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#6b7280' }}>
                    Registered: {new Date(reg.serverTimestamp || reg.registrationDate).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
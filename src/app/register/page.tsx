'use client';

import { useState } from 'react';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  event: string;
  adults: number;
  children: number;
  childrenAges: string;
  specialRequests: string;
  paymentMethod: string;
}

const EVENTS = [
  { id: 'rosh-hashana-toast', name: 'הרמת כוסית לראש השנה', date: 'September 13, 2025 at 20:00', price: 45 },
  { id: 'sukkot-celebration', name: 'חגיגת סוכות עם פיטר פן', date: 'October 18, 2025 at 19:30', price: 55 }
];

export default function RegisterPage() {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    event: '',
    adults: 1,
    children: 0,
    childrenAges: '',
    specialRequests: '',
    paymentMethod: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
             (type === 'number' ? parseInt(value) || 0 : value)
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.event) newErrors.event = 'Please select an event';
    if (formData.adults < 1) newErrors.adults = 'At least 1 adult is required';
    if (formData.children > 0 && !formData.childrenAges.trim()) {
      newErrors.childrenAges = 'Please specify children ages';
    }
    if (!formData.paymentMethod) newErrors.paymentMethod = 'Please select a payment method';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      // Get the selected event details
      const selectedEvent = EVENTS.find(event => event.id === formData.event);
      const totalCost = selectedEvent ? (formData.adults + formData.children) * selectedEvent.price : 0;
      
      // Prepare data for submission
      const registrationData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        eventName: selectedEvent?.name || '',
        eventDate: selectedEvent?.date || '',
        eventPrice: `$${selectedEvent?.price || 0} per person`,
        adults: formData.adults,
        children: formData.children,
        childrenAges: formData.childrenAges || 'N/A',
        specialRequests: formData.specialRequests || 'None',
        paymentMethod: formData.paymentMethod,
        totalCost: `$${totalCost}`,
        registrationDate: new Date().toLocaleString()
      };

      // Submit via our Next.js API route
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(registrationData)
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setIsSubmitting(false);
          setShowSuccess(true);
          
          // Reset form after success
          setTimeout(() => {
            setShowSuccess(false);
            setFormData({
              firstName: '',
              lastName: '',
              email: '',
              phone: '',
              event: '',
              adults: 1,
              children: 0,
              childrenAges: '',
              specialRequests: '',
              paymentMethod: ''
            });
          }, 4000);
        } else {
          throw new Error(result.message || 'Registration failed');
        }
      } else {
        const errorData = await response.json();
        console.error('API error:', errorData);
        throw new Error(errorData.message || `Registration submission failed: ${response.status}`);
      }
      
    } catch (error) {
      console.error('Error submitting registration:', error);
      setIsSubmitting(false);
      alert(`There was an error processing your registration: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`);
    }
  };

  if (showSuccess) {
    return (
      <div style={{ 
        minHeight: '80vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '2rem'
      }}>
        <div 
          data-card
          style={{
            textAlign: 'center',
            padding: '3rem',
            borderRadius: '20px',
            maxWidth: '600px',
            margin: '0 auto'
          }}
        >
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#15803d' }}>
            Registration Successful!
          </h1>
          <p style={{ fontSize: '1.2rem', marginBottom: '2rem', lineHeight: '1.6' }}>
            Thank you for registering for הרמת כוסית לראש השנה! Your registration has been submitted successfully. The event organizers will receive your details and contact you with further information.
          </p>
          <div style={{ fontSize: '3rem' }}>✨ ⭐ 🧚‍♀️ ✨</div>
        </div>
      </div>
    );
  }

  const selectedEvent = EVENTS.find(event => event.id === formData.event);
  const totalCost = selectedEvent ? (formData.adults + formData.children) * selectedEvent.price : 0;

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #a7f3d0 0%, #fef3c7 25%, #bbf7d0 50%, #fde68a 75%, #86efac 100%)',
      backgroundSize: '400% 400%',
      animation: 'gradientShift 15s ease infinite',
      padding: 'clamp(1rem, 4vw, 2rem) clamp(0.5rem, 2vw, 1rem)',
      fontFamily: 'system-ui, sans-serif',
      overflowX: 'hidden',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      <style jsx global>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        [data-card] {
          background: rgba(255, 255, 255, 0.95);
          border: 2px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
          backdrop-filter: blur(20px);
          position: relative;
          overflow: hidden;
        }
        
        [data-card]::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #10b981, #fbbf24, #34d399, #f59e0b, #22d3ee, #a78bfa);
          background-size: 300% 100%;
          animation: borderFlow 3s linear infinite;
        }
        
        @keyframes borderFlow {
          0% { background-position: 0% 50%; }
          100% { background-position: 300% 50%; }
        }
        
        input, select, textarea {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(240, 248, 255, 0.9) 100%);
          border: 2px solid transparent;
          border-radius: 15px;
          padding: 1rem 1.25rem;
          font-size: 1rem;
          width: 100%;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }
        
        input:focus, select:focus, textarea:focus {
          outline: none;
          border: 2px solid #10b981;
          box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.2), 0 8px 25px rgba(0, 0, 0, 0.15);
          transform: translateY(-2px);
        }
        
        input:hover, select:hover, textarea:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
        }
        
        button {
          background: linear-gradient(135deg, #10b981 0%, #fbbf24 25%, #34d399 50%, #f59e0b 75%, #22d3ee 100%);
          background-size: 300% 100%;
          color: white;
          border: none;
          padding: 1.25rem 2.5rem;
          border-radius: 50px;
          font-size: 1.2rem;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.4s ease;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
          text-transform: uppercase;
          letter-spacing: 1px;
          animation: buttonGlow 2s ease-in-out infinite alternate;
        }
        
        @keyframes buttonGlow {
          from { 
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
            background-position: 0% 50%;
          }
          to { 
            box-shadow: 0 8px 30px rgba(16, 185, 129, 0.4);
            background-position: 100% 50%;
          }
        }
        
        button:hover:not(:disabled) {
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 12px 35px rgba(16, 185, 129, 0.4);
          background-position: 100% 50%;
        }
        
        button:active:not(:disabled) {
          transform: translateY(-1px) scale(1.01);
        }
        
        button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          animation: none;
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
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0', width: '100%', boxSizing: 'border-box' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 'clamp(2rem, 6vw, 3rem)', width: '100%', boxSizing: 'border-box' }}>
          <div style={{ 
            fontSize: 'clamp(2rem, 6vw, 4rem)', 
            marginBottom: '1rem',
            animation: 'bounce 2s infinite',
            wordWrap: 'break-word', display: 'inline', whiteSpace: 'pre-wrap', writingMode: 'horizontal-tb',
            overflowWrap: 'break-word',
            maxWidth: '100%'
          }}>🎪✨🧚‍♀️✨</div>
          <h1 style={{ 
            fontSize: 'clamp(1.5rem, 5vw, 4rem)', 
            fontWeight: 'bold', 
            marginBottom: '1rem',
            background: 'linear-gradient(45deg, #10b981, #fbbf24, #34d399, #f59e0b, #22d3ee, #a78bfa)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundSize: '300% 300%',
            animation: 'textShimmer 3s ease-in-out infinite',
            textShadow: '0 4px 8px rgba(0,0,0,0.2)',
            wordWrap: 'break-word', display: 'inline', whiteSpace: 'pre-wrap', writingMode: 'horizontal-tb',
            overflowWrap: 'break-word',
            maxWidth: '100%',
            lineHeight: '1.2'
          }}>
            ✨ Peter Pan Boca Events ✨
          </h1>
          <p style={{ 
            fontSize: 'clamp(0.9rem, 3vw, 1.3rem)', 
            maxWidth: '600px', 
            margin: '0 auto',
            lineHeight: '1.7',
            color: 'rgba(255, 255, 255, 0.95)',
            background: 'rgba(255, 255, 255, 0.1)',
            padding: 'clamp(0.8rem, 4vw, 1.5rem)',
            borderRadius: '20px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
            wordWrap: 'break-word', display: 'inline', whiteSpace: 'pre-wrap', writingMode: 'horizontal-tb',
            overflowWrap: 'break-word',
            width: '100%',
            boxSizing: 'border-box'
          }}>
            🌟 Join us for magical Peter Pan adventures! 🌟<br/>
            Fill out the form below to register for your chosen event and embark on an unforgettable journey!
          </p>
        </div>
        


        {/* Registration Form */}
        <form onSubmit={handleSubmit}>
          <div 
            data-card
            style={{
              padding: 'clamp(1.5rem, 5vw, 2.5rem)',
              borderRadius: '20px',
              marginBottom: '2rem'
            }}
          >
            <h2 style={{ 
              fontSize: 'clamp(1.2rem, 4vw, 1.8rem)', 
              fontWeight: 'bold', 
              marginBottom: '2rem',
              background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundSize: '200% 200%',
              animation: 'textShimmer 2s ease-in-out infinite',
              borderBottom: '3px solid transparent',
              borderImage: 'linear-gradient(90deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #ffeaa7) 1',
              paddingBottom: '0.75rem',
              textAlign: 'center'
            }}>
              📝 Personal Information
            </h2>

            {/* Name Fields */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: 'clamp(1rem, 3vw, 1.5rem)', 
              marginBottom: '1.5rem' 
            }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  fontWeight: 'bold', 
                  marginBottom: '0.5rem',
                  color: '#15803d'
                }}>
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '10px',
                    border: errors.firstName ? '2px solid #dc2626' : '2px solid #facc15',
                    fontSize: '1rem',
                    backgroundColor: '#f0fdf4'
                  }}
                  placeholder="Enter your first name"
                />
                {errors.firstName && (
                  <p style={{ color: '#dc2626', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                    {errors.firstName}
                  </p>
                )}
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  fontWeight: 'bold', 
                  marginBottom: '0.5rem',
                  color: '#15803d'
                }}>
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '10px',
                    border: errors.lastName ? '2px solid #dc2626' : '2px solid #facc15',
                    fontSize: '1rem',
                    backgroundColor: '#f0fdf4'
                  }}
                  placeholder="Enter your last name"
                />
                {errors.lastName && (
                  <p style={{ color: '#dc2626', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                    {errors.lastName}
                  </p>
                )}
              </div>
            </div>

            {/* Contact Fields */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: 'clamp(1rem, 3vw, 1.5rem)', 
              marginBottom: '1.5rem' 
            }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  fontWeight: 'bold', 
                  marginBottom: '0.5rem',
                  color: '#15803d'
                }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '10px',
                    border: errors.email ? '2px solid #dc2626' : '2px solid #facc15',
                    fontSize: '1rem',
                    backgroundColor: '#f0fdf4'
                  }}
                  placeholder="your@email.com"
                />
                {errors.email && (
                  <p style={{ color: '#dc2626', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  fontWeight: 'bold', 
                  marginBottom: '0.5rem',
                  color: '#15803d'
                }}>
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '10px',
                    border: errors.phone ? '2px solid #dc2626' : '2px solid #facc15',
                    fontSize: '1rem',
                    backgroundColor: '#f0fdf4'
                  }}
                  placeholder="(555) 123-4567"
                />
                {errors.phone && (
                  <p style={{ color: '#dc2626', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                    {errors.phone}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Event Selection */}
          <div 
            data-card
            style={{
              padding: 'clamp(1.5rem, 5vw, 2.5rem)',
              borderRadius: '20px',
              marginBottom: '2rem'
            }}
          >
            <h2 style={{ 
              fontSize: 'clamp(1.2rem, 4vw, 1.8rem)', 
              fontWeight: 'bold', 
              marginBottom: '2rem',
              background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundSize: '200% 200%',
              animation: 'textShimmer 2s ease-in-out infinite',
              borderBottom: '3px solid transparent',
              borderImage: 'linear-gradient(90deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #ffeaa7) 1',
              paddingBottom: '0.75rem',
              textAlign: 'center'
            }}>
              🎭 Event Selection
            </h2>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ 
                display: 'block', 
                fontWeight: 'bold', 
                marginBottom: '1rem',
                color: '#15803d',
                wordWrap: 'break-word',
                whiteSpace: 'pre-wrap'
              }}>
                Choose Your Peter Pan Adventure *
              </label>
              
              <div style={{ display: 'grid', gap: '1rem' }}>
                {EVENTS.map((event) => (
                  <label
                    key={event.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '1rem',
                      border: formData.event === event.id ? '3px solid #15803d' : '2px solid #facc15',
                      borderRadius: '15px',
                      cursor: 'pointer',
                      backgroundColor: formData.event === event.id ? '#f0fdf4' : 'transparent',
                      transition: 'all 0.3s ease',
                      gap: '1rem'
                    }}
                    onMouseEnter={(e) => {
                      if (formData.event !== event.id) {
                        e.currentTarget.style.backgroundColor = '#f9fdf7';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (formData.event !== event.id) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    <input
                      type="radio"
                      name="event"
                      value={event.id}
                      checked={formData.event === event.id}
                      onChange={handleInputChange}
                      style={{ display: 'none' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.25rem' }}>
                        {event.name}
                      </div>
                      <div style={{ color: '#666', fontSize: '0.9rem' }}>
                        📅 {event.date} • 💰 ${event.price} per person
                      </div>
                    </div>
                  </label>
                ))}
              </div>
              
              {errors.event && (
                <p style={{ color: '#dc2626', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                  {errors.event}
                </p>
              )}
            </div>

            {selectedEvent && (
              <div 
                style={{
                  backgroundColor: '#f0fdf4',
                  padding: '1rem',
                  borderRadius: '10px',
                  border: '2px solid #15803d',
                  marginTop: '1rem'
                }}
              >
                <h4 style={{ color: '#15803d', marginBottom: '0.5rem' }}>
                  ✨ Selected Event: {selectedEvent.name}
                </h4>
                <p style={{ margin: 0, fontSize: '0.9rem' }}>
                  📅 {selectedEvent.date} • 💰 ${selectedEvent.price} per person
                </p>
              </div>
            )}
          </div>

          {/* Party Size */}
          <div 
            data-card
            style={{
              padding: 'clamp(1.5rem, 5vw, 2.5rem)',
              borderRadius: '20px',
              marginBottom: '2rem'
            }}
          >
            <h2 style={{ 
              fontSize: '1.8rem', 
              fontWeight: 'bold', 
              marginBottom: '2rem',
              background: 'linear-gradient(45deg, #96ceb4, #ffeaa7, #fd79a8)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundSize: '200% 200%',
              animation: 'textShimmer 2s ease-in-out infinite',
              borderBottom: '3px solid transparent',
              borderImage: 'linear-gradient(90deg, #96ceb4, #ffeaa7, #fd79a8, #ff6b6b, #4ecdc4) 1',
              paddingBottom: '0.75rem',
              textAlign: 'center'
            }}>
              👨‍👩‍👧‍👦 Party Information
            </h2>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: 'clamp(1rem, 3vw, 1.5rem)', 
              marginBottom: '1.5rem' 
            }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  fontWeight: 'bold', 
                  marginBottom: '0.5rem',
                  color: '#15803d'
                }}>
                  Number of Adults *
                </label>
                <input
                  type="number"
                  name="adults"
                  value={formData.adults}
                  onChange={handleInputChange}
                  min="1"
                  max="10"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '10px',
                    border: errors.adults ? '2px solid #dc2626' : '2px solid #facc15',
                    fontSize: '1rem',
                    backgroundColor: '#f0fdf4'
                  }}
                />
                {errors.adults && (
                  <p style={{ color: '#dc2626', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                    {errors.adults}
                  </p>
                )}
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  fontWeight: 'bold', 
                  marginBottom: '0.5rem',
                  color: '#15803d'
                }}>
                  Number of Children
                </label>
                <input
                  type="number"
                  name="children"
                  value={formData.children}
                  onChange={handleInputChange}
                  min="0"
                  max="10"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '10px',
                    border: '2px solid #facc15',
                    fontSize: '1rem',
                    backgroundColor: '#f0fdf4'
                  }}
                />
              </div>
            </div>

            {formData.children > 0 && (
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ 
                  display: 'block', 
                  fontWeight: 'bold', 
                  marginBottom: '0.5rem',
                  color: '#15803d'
                }}>
                  Children Ages *
                </label>
                <input
                  type="text"
                  name="childrenAges"
                  value={formData.childrenAges}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '10px',
                    border: errors.childrenAges ? '2px solid #dc2626' : '2px solid #facc15',
                    fontSize: '1rem',
                    backgroundColor: '#f0fdf4'
                  }}
                  placeholder="e.g., 5, 8, 12"
                />
                {errors.childrenAges && (
                  <p style={{ color: '#dc2626', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                    {errors.childrenAges}
                  </p>
                )}
              </div>
            )}

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ 
                display: 'block', 
                fontWeight: 'bold', 
                marginBottom: '0.5rem',
                color: '#15803d'
              }}>
                Special Requests or Dietary Restrictions
              </label>
              <textarea
                name="specialRequests"
                value={formData.specialRequests}
                onChange={handleInputChange}
                rows={4}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '10px',
                  border: '2px solid #facc15',
                  fontSize: '1rem',
                  backgroundColor: '#f0fdf4',
                  resize: 'vertical'
                }}
                placeholder="Let us know about any allergies, accessibility needs, or special requests..."
              />
            </div>
          </div>

          {/* Payment Summary & Method */}
          {selectedEvent && (
            <div 
              data-card
              style={{
                padding: 'clamp(1.5rem, 5vw, 2.5rem)',
                borderRadius: '20px',
                marginBottom: '2rem'
              }}
            >
              <h2 style={{ 
                fontSize: 'clamp(1.2rem, 4vw, 1.8rem)', 
                fontWeight: 'bold', 
                marginBottom: '2rem',
                background: 'linear-gradient(45deg, #ffeaa7, #fd79a8, #ff6b6b, #4ecdc4)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundSize: '200% 200%',
                animation: 'textShimmer 2s ease-in-out infinite',
                borderBottom: '3px solid transparent',
                borderImage: 'linear-gradient(90deg, #ffeaa7, #fd79a8, #ff6b6b, #4ecdc4, #96ceb4) 1',
                paddingBottom: '0.75rem',
                textAlign: 'center'
              }}>
                💰 Payment & Summary
              </h2>

              {/* Cost Summary */}
              <div style={{ 
                background: 'linear-gradient(135deg, rgba(255, 235, 59, 0.2), rgba(76, 175, 80, 0.2), rgba(156, 39, 176, 0.2))', 
                padding: '2rem', 
                borderRadius: '20px', 
                border: '3px solid transparent',
                backgroundClip: 'padding-box',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 2px 0 rgba(255, 255, 255, 0.3)',
                position: 'relative',
                marginBottom: '2rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Event:</span>
                  <span>{selectedEvent.name}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span>Date:</span>
                  <span>{selectedEvent.date}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span>Price per person:</span>
                  <span>${selectedEvent.price}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span>Adults ({formData.adults}):</span>
                  <span>${formData.adults * selectedEvent.price}</span>
                </div>
                {formData.children > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <span>Children ({formData.children}):</span>
                    <span>${formData.children * selectedEvent.price}</span>
                  </div>
                )}
                <hr style={{ margin: '1rem 0', border: 'none', borderTop: '1px solid #15803d' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '1.2rem', fontWeight: 'bold', color: '#15803d' }}>
                  <span>Total Cost:</span>
                  <span>${totalCost}</span>
                </div>
              </div>

              {/* Payment Method Selection */}
              <div style={{ marginBottom: '2rem' }}>
                <label style={{ 
                  display: 'block', 
                  fontWeight: 'bold', 
                  marginBottom: '1rem',
                  color: '#15803d'
                }}>
                  Choose Payment Method *
                </label>
                
                <div style={{ display: 'grid', gap: '1rem' }}>
                  {[
                    { id: 'paypal', name: 'PayPal', icon: '💳', description: 'Pay securely with PayPal' },
                    { id: 'venmo', name: 'Venmo', icon: '📱', description: 'Pay with Venmo (@PeterPanBoca)' },
                    { id: 'zelle', name: 'Zelle', icon: '🏦', description: 'Pay with Zelle' },
                    { id: 'check', name: 'Check', icon: '🏧', description: 'Pay by check (mail to address provided)' }
                  ].map((method) => (
                    <label
                      key={method.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '1rem',
                        border: formData.paymentMethod === method.id ? '3px solid #15803d' : '2px solid #facc15',
                        borderRadius: '15px',
                        cursor: 'pointer',
                        backgroundColor: formData.paymentMethod === method.id ? '#f0fdf4' : 'transparent',
                        transition: 'all 0.3s ease',
                        gap: '1rem'
                      }}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.id}
                        checked={formData.paymentMethod === method.id}
                        onChange={handleInputChange}
                        style={{ display: 'none' }}
                      />
                      <div style={{ fontSize: '1.5rem' }}>{method.icon}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.25rem' }}>
                          {method.name}
                        </div>
                        <div style={{ color: '#666', fontSize: '0.9rem' }}>
                          {method.description}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Payment Instructions */}
              {formData.paymentMethod && (
                <div style={{ 
                  marginTop: '1.5rem', 
                  padding: '1rem', 
                  backgroundColor: '#f0fdf4', 
                  borderRadius: '10px', 
                  border: '2px solid #15803d' 
                }}>
                  <h4 style={{ color: '#15803d', marginBottom: '0.5rem' }}>
                    Payment Instructions:
                  </h4>
                  {formData.paymentMethod === 'paypal' && (
                    <p style={{ margin: 0, fontSize: '0.9rem' }}>
                      After registration, you'll receive a PayPal invoice via email. Payment is required within 7 days to secure your spot.
                    </p>
                  )}
                  {formData.paymentMethod === 'venmo' && (
                    <p style={{ margin: 0, fontSize: '0.9rem' }}>
                      Send payment to <strong>@PeterPanBoca</strong> with your name in the note. Include registration confirmation number when available.
                    </p>
                  )}
                  {formData.paymentMethod === 'zelle' && (
                    <p style={{ margin: 0, fontSize: '0.9rem' }}>
                      Zelle payment details will be provided via email after registration. Payment required within 7 days.
                    </p>
                  )}
                  {formData.paymentMethod === 'check' && (
                    <p style={{ margin: 0, fontSize: '0.9rem' }}>
                      Mail check to the address provided in your confirmation email. Make payable to "Peter Pan Boca". Payment required within 7 days.
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Submit */}
          <div 
            data-card
            style={{
              padding: 'clamp(1.5rem, 5vw, 2.5rem)',
              borderRadius: '20px',
              marginBottom: '2rem'
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <button
                type="submit"
                disabled={isSubmitting}
                data-button
                style={{
                  padding: '1.25rem 3rem',
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  borderRadius: '15px',
                  border: 'none',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  opacity: isSubmitting ? 0.7 : 1,
                  transition: 'all 0.3s ease',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}
                onMouseEnter={(e) => {
                  if (!isSubmitting) {
                    e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSubmitting) {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  }
                }}
              >
                {isSubmitting ? (
                  <>
                    <span style={{ animation: 'spin 1s linear infinite' }}>⏳</span>
                    Submitting...
                  </>
                ) : (
                  <>
                    🎪 Register for Event
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

    </div>
  );
}
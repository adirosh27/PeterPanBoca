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
}

const EVENTS = [
  { id: 'rosh-hashana-toast', name: 'הרמת כוסית לראש השנה', date: 'September 13, 2025 at 20:00', price: 45 }
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
    specialRequests: ''
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
              specialRequests: ''
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
  
  // Calculate total cost
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
                color: '#15803d'
              }}>
                Choose Your Peter Pan Adventure *
              </label>
              

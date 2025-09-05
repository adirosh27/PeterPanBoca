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
  agreeTerms: boolean;
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
    specialRequests: '',
    agreeTerms: false
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
    if (!formData.agreeTerms) newErrors.agreeTerms = 'You must agree to terms and conditions';

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

      // Submit directly via Formspree (client-side)
      const submitFormData = new FormData();
      submitFormData.append('firstName', registrationData.firstName);
      submitFormData.append('lastName', registrationData.lastName);
      submitFormData.append('email', registrationData.email);
      submitFormData.append('phone', registrationData.phone);
      submitFormData.append('eventName', registrationData.eventName);
      submitFormData.append('eventDate', registrationData.eventDate);
      submitFormData.append('eventPrice', registrationData.eventPrice);
      submitFormData.append('adults', registrationData.adults.toString());
      submitFormData.append('children', registrationData.children.toString());
      submitFormData.append('childrenAges', registrationData.childrenAges || 'N/A');
      submitFormData.append('specialRequests', registrationData.specialRequests || 'None');
      submitFormData.append('totalCost', registrationData.totalCost);
      submitFormData.append('registrationId', Date.now().toString());
      submitFormData.append('timestamp', new Date().toISOString());

      const response = await fetch('https://formspree.io/f/mjkveqdk', {
        method: 'POST',
        body: submitFormData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
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
            agreeTerms: false
          });
        }, 4000);
      } else {
        const errorText = await response.text();
        console.error('Formspree error:', errorText);
        throw new Error(`Registration submission failed: ${response.status}`);
      }
      
    } catch (error) {
      console.error('Error submitting registration:', error);
      setIsSubmitting(false);
      alert(`There was an error processing your registration: ${error.message}. Please try again.`);
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
    <div style={{ padding: '2rem 0', minHeight: '100vh' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 2rem' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎪</div>
          <h1 style={{ 
            fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', 
            fontWeight: 'bold', 
            marginBottom: '1rem',
            color: '#15803d'
          }}>
            Event Registration
          </h1>
          <p style={{ 
            fontSize: '1.2rem', 
            maxWidth: '600px', 
            margin: '0 auto',
            lineHeight: '1.6',
            opacity: 0.8
          }}>
            Join us for magical Peter Pan adventures! Fill out the form below to register for your chosen event.
          </p>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit}>
          <div 
            data-card
            style={{
              padding: '2.5rem',
              borderRadius: '20px',
              marginBottom: '2rem'
            }}
          >
            <h2 style={{ 
              fontSize: '1.8rem', 
              fontWeight: 'bold', 
              marginBottom: '2rem',
              color: '#15803d',
              borderBottom: '2px solid #facc15',
              paddingBottom: '0.5rem'
            }}>
              📝 Personal Information
            </h2>

            {/* Name Fields */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
              gap: '1.5rem', 
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
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
              gap: '1.5rem', 
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
              padding: '2.5rem',
              borderRadius: '20px',
              marginBottom: '2rem'
            }}
          >
            <h2 style={{ 
              fontSize: '1.8rem', 
              fontWeight: 'bold', 
              marginBottom: '2rem',
              color: '#15803d',
              borderBottom: '2px solid #facc15',
              paddingBottom: '0.5rem'
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
                      transition: 'all 0.3s ease'
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
                      style={{ 
                        marginRight: '1rem', 
                        transform: 'scale(1.2)',
                        accentColor: '#15803d'
                      }}
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
              padding: '2.5rem',
              borderRadius: '20px',
              marginBottom: '2rem'
            }}
          >
            <h2 style={{ 
              fontSize: '1.8rem', 
              fontWeight: 'bold', 
              marginBottom: '2rem',
              color: '#15803d',
              borderBottom: '2px solid #facc15',
              paddingBottom: '0.5rem'
            }}>
              👨‍👩‍👧‍👦 Party Information
            </h2>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '1.5rem', 
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

          {/* Payment Summary */}
          <div 
              data-card
              style={{
                padding: '2.5rem',
                borderRadius: '20px',
                marginBottom: '2rem'
              }}
            >
              <h2 style={{ 
                fontSize: '1.8rem', 
                fontWeight: 'bold', 
                marginBottom: '2rem',
                color: '#15803d',
                borderBottom: '2px solid #facc15',
                paddingBottom: '0.5rem'
              }}>
                💰 Payment Summary
              </h2>

              <div style={{ backgroundColor: '#f0fdf4', padding: '1.5rem', borderRadius: '15px', border: '2px solid #15803d' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Event:</span>
                  <span>{selectedEvent ? selectedEvent.name : 'הרמת כוסית לראש השנה'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span>Price per person:</span>
                  <span>${selectedEvent ? selectedEvent.price : 45}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span>Adults ({formData.adults}):</span>
                  <span>${formData.adults * (selectedEvent ? selectedEvent.price : 45)}</span>
                </div>
                {formData.children > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <span>Children ({formData.children}):</span>
                    <span>${formData.children * (selectedEvent ? selectedEvent.price : 45)}</span>
                  </div>
                )}
                <hr style={{ margin: '1rem 0', border: 'none', borderTop: '1px solid #15803d' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '1.2rem', fontWeight: 'bold', color: '#15803d' }}>
                  <span>Total Cost:</span>
                  <span>${totalCost || (formData.adults + formData.children) * 45}</span>
                </div>
              </div>

              <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: '#fffbeb', borderRadius: '10px', border: '1px solid #facc15' }}>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#92400e' }}>
                  💳 <strong>Payment:</strong> After registration, you will receive payment instructions via email. 
                  You can pay via PayPal, Venmo, or check. Full payment is required within 7 days to secure your spot.
                </p>
              </div>
            </div>
          </div>

          {/* Terms and Submit */}
          <div 
            data-card
            style={{
              padding: '2.5rem',
              borderRadius: '20px',
              marginBottom: '2rem'
            }}
          >
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ 
                display: 'flex',
                alignItems: 'flex-start',
                cursor: 'pointer',
                fontSize: '0.95rem',
                lineHeight: '1.5'
              }}>
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleInputChange}
                  style={{ 
                    marginRight: '0.75rem', 
                    marginTop: '0.25rem',
                    transform: 'scale(1.2)',
                    accentColor: '#15803d'
                  }}
                />
                <span>
                  I agree to the terms and conditions, understand that this event involves physical activities, 
                  and acknowledge that photos/videos may be taken during the event for promotional purposes. 
                  I confirm that all information provided is accurate. *
                </span>
              </label>
              {errors.agreeTerms && (
                <p style={{ color: '#dc2626', fontSize: '0.9rem', marginTop: '0.5rem', marginLeft: '2rem' }}>
                  {errors.agreeTerms}
                </p>
              )}
            </div>

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

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
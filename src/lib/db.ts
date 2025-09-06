// Persistent database utility using Vercel KV (Redis)
import { kv } from '@vercel/kv';

interface Registration {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  event: string;
  eventName: string;
  adults: number;
  children: number;
  childrenAges: string;
  specialRequests: string;
  serverTimestamp: string;
  registrationDate: string;
}

const REGISTRATIONS_KEY = 'peter-pan-registrations';

// Check if KV is available
function isKvAvailable(): boolean {
  return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

// Get all registrations from KV database
export async function getAllRegistrations(): Promise<Registration[]> {
  try {
    if (!isKvAvailable()) {
      console.log('KV not available, returning empty array');
      return [];
    }

    const registrations = await kv.get<Registration[]>(REGISTRATIONS_KEY);
    const result = registrations || [];
    console.log(`Retrieved ${result.length} registrations from KV database`);
    return result;
  } catch (error) {
    console.error('Error getting registrations from KV:', error);
    return [];
  }
}

// Add a new registration
export async function addRegistration(registration: Registration): Promise<boolean> {
  try {
    if (!isKvAvailable()) {
      console.log('KV not available, cannot save registration');
      return false;
    }

    // Get existing registrations
    const existingRegistrations = await getAllRegistrations();
    
    // Add new registration
    const updatedRegistrations = [...existingRegistrations, registration];
    
    // Save back to KV
    await kv.set(REGISTRATIONS_KEY, updatedRegistrations);
    
    console.log('Registration saved to KV database:', {
      id: registration.id,
      name: `${registration.firstName} ${registration.lastName}`,
      email: registration.email,
      totalRegistrations: updatedRegistrations.length
    });
    
    return true;
  } catch (error) {
    console.error('Error adding registration to KV:', error);
    return false;
  }
}

// Initialize database
export async function initDatabase(): Promise<void> {
  if (isKvAvailable()) {
    console.log('KV database is available and initialized');
  } else {
    console.log('KV database not available - check environment variables');
  }
}

// Get registration count
export async function getRegistrationCount(): Promise<number> {
  const registrations = await getAllRegistrations();
  return registrations.length;
}
// Persistent database utility using Upstash Redis
import { Redis } from '@upstash/redis';

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

// Initialize Redis client using fromEnv for automatic configuration
const redis = Redis.fromEnv();

// Check if Redis is available
function isRedisAvailable(): boolean {
  return !!process.env.UPSTASH_REDIS_REST_URL && !!process.env.UPSTASH_REDIS_REST_TOKEN;
}

// Get all registrations from Redis database
export async function getAllRegistrations(): Promise<Registration[]> {
  try {
    if (!isRedisAvailable()) {
      console.log('Redis not available, returning empty array');
      return [];
    }

    const registrations = await redis.get<Registration[]>(REGISTRATIONS_KEY);
    const result = registrations || [];
    console.log(`Retrieved ${result.length} registrations from Redis database`);
    return result;
  } catch (error) {
    console.error('Error getting registrations from Redis:', error);
    return [];
  }
}

// Add a new registration
export async function addRegistration(registration: Registration): Promise<boolean> {
  try {
    if (!isRedisAvailable()) {
      console.log('Redis not available, cannot save registration');
      return false;
    }

    // Get existing registrations
    const existingRegistrations = await getAllRegistrations();
    
    // Add new registration
    const updatedRegistrations = [...existingRegistrations, registration];
    
    // Save back to Redis
    await redis.set(REGISTRATIONS_KEY, updatedRegistrations);
    
    console.log('Registration saved to Redis database:', {
      id: registration.id,
      name: `${registration.firstName} ${registration.lastName}`,
      email: registration.email,
      totalRegistrations: updatedRegistrations.length
    });
    
    return true;
  } catch (error) {
    console.error('Error adding registration to Redis:', error);
    return false;
  }
}

// Initialize database
export async function initDatabase(): Promise<void> {
  if (isRedisAvailable()) {
    console.log('Redis database is available and initialized');
  } else {
    console.log('Redis database not available - check environment variables');
  }
}

// Get registration count
export async function getRegistrationCount(): Promise<number> {
  const registrations = await getAllRegistrations();
  return registrations.length;
}
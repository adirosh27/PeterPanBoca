// Simple database utility for registration persistence
// Uses global memory storage that persists during serverless function lifetime

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

// Global storage that persists across function calls
declare global {
  var __REGISTRATIONS__: Registration[] | undefined;
}

// Initialize global storage
function initGlobalStorage(): Registration[] {
  if (!global.__REGISTRATIONS__) {
    global.__REGISTRATIONS__ = [];
    console.log('Initialized global registration storage');
  }
  return global.__REGISTRATIONS__;
}

// Get all registrations from global storage
export async function getAllRegistrations(): Promise<Registration[]> {
  const registrations = initGlobalStorage();
  console.log(`Retrieved ${registrations.length} registrations from global storage`);
  return [...registrations]; // Return copy to prevent mutations
}

// Add a new registration
export async function addRegistration(registration: Registration): Promise<boolean> {
  try {
    const registrations = initGlobalStorage();
    
    // Add new registration to global storage
    registrations.push(registration);
    
    console.log('Registration saved to global storage:', {
      id: registration.id,
      name: `${registration.firstName} ${registration.lastName}`,
      email: registration.email,
      totalRegistrations: registrations.length
    });
    
    return true;
  } catch (error) {
    console.error('Error adding registration to global storage:', error);
    return false;
  }
}

// Initialize database
export async function initDatabase(): Promise<void> {
  const registrations = initGlobalStorage();
  console.log(`Database initialized with ${registrations.length} existing registrations`);
}

// Get registration count
export async function getRegistrationCount(): Promise<number> {
  const registrations = initGlobalStorage();
  return registrations.length;
}
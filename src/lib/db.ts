// Simple database utility for registration persistence
import { promises as fs } from 'fs';
import path from 'path';

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

// In-memory fallback for when filesystem isn't available
let memoryStorage: Registration[] = [];

const DB_FILE = 'registrations.json';
const DATA_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DATA_DIR, DB_FILE);

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    return true;
  } catch (error) {
    console.log('Could not create data directory:', error);
    return false;
  }
}

// Load registrations from file
async function loadFromFile(): Promise<Registration[]> {
  try {
    await ensureDataDir();
    const data = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // File doesn't exist or can't be read, return empty array
    return [];
  }
}

// Save registrations to file
async function saveToFile(registrations: Registration[]): Promise<boolean> {
  try {
    const dirCreated = await ensureDataDir();
    if (!dirCreated) return false;
    
    await fs.writeFile(DB_PATH, JSON.stringify(registrations, null, 2));
    console.log(`Saved ${registrations.length} registrations to file`);
    return true;
  } catch (error) {
    console.log('Could not save to file:', error);
    return false;
  }
}

// Get all registrations (tries file first, falls back to memory)
export async function getAllRegistrations(): Promise<Registration[]> {
  try {
    // Try to load from file first
    const fileData = await loadFromFile();
    
    // If we have file data, use it and sync memory
    if (fileData.length > 0) {
      memoryStorage = fileData;
      console.log(`Loaded ${fileData.length} registrations from file`);
      return fileData;
    }
    
    // Otherwise use memory storage
    console.log(`Using memory storage: ${memoryStorage.length} registrations`);
    return memoryStorage;
  } catch (error) {
    console.error('Error loading registrations:', error);
    return memoryStorage; // Fallback to memory
  }
}

// Add a new registration
export async function addRegistration(registration: Registration): Promise<boolean> {
  try {
    // Load existing data
    const existing = await getAllRegistrations();
    
    // Add new registration
    existing.push(registration);
    
    // Update memory storage
    memoryStorage = existing;
    
    // Try to save to file
    const fileSaved = await saveToFile(existing);
    
    console.log('Registration saved:', {
      id: registration.id,
      name: `${registration.firstName} ${registration.lastName}`,
      email: registration.email,
      totalRegistrations: existing.length,
      savedToFile: fileSaved,
      savedToMemory: true
    });
    
    return true;
  } catch (error) {
    console.error('Error adding registration:', error);
    return false;
  }
}

// Initialize database
export async function initDatabase(): Promise<void> {
  try {
    const existing = await loadFromFile();
    memoryStorage = existing;
    console.log(`Database initialized with ${existing.length} existing registrations`);
  } catch (error) {
    console.log('Database initialized with empty memory storage');
    memoryStorage = [];
  }
}

// Get registration count
export async function getRegistrationCount(): Promise<number> {
  const registrations = await getAllRegistrations();
  return registrations.length;
}
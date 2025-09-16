#!/usr/bin/env node

/**
 * Database Keep-Alive Script
 *
 * This script pings your Vercel database every 6 hours to keep it active
 * and prevent it from being deleted due to inactivity.
 *
 * Usage:
 * - Run once: node keep-db-active.js
 * - Run continuously: node keep-db-active.js --continuous
 */

const https = require('https');

const HEALTH_ENDPOINT = 'https://peter-pan-boca.vercel.app/api/health';
const LOCAL_ENDPOINT = 'http://localhost:3000/api/health';
const PING_INTERVAL = 6 * 60 * 60 * 1000; // 6 hours in milliseconds

async function pingDatabase() {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();

    https.get(HEALTH_ENDPOINT, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        const duration = Date.now() - startTime;
        const timestamp = new Date().toISOString();

        try {
          const response = JSON.parse(data);
          console.log(`[${timestamp}] Database ping successful (${duration}ms)`);
          console.log(`  Status: ${response.status}`);
          console.log(`  Registration count: ${response.registrationCount}`);
          resolve(response);
        } catch (error) {
          console.log(`[${timestamp}] Database ping successful but invalid JSON (${duration}ms)`);
          console.log(`  Response: ${data}`);
          resolve({ status: 'unknown', raw: data });
        }
      });
    }).on('error', (error) => {
      const timestamp = new Date().toISOString();
      console.error(`[${timestamp}] Database ping failed:`, error.message);
      reject(error);
    });
  });
}

async function runContinuous() {
  console.log('Starting database keep-alive service...');
  console.log(`Will ping ${HEALTH_ENDPOINT} every 6 hours`);
  console.log('Press Ctrl+C to stop\n');

  // Initial ping
  try {
    await pingDatabase();
  } catch (error) {
    console.error('Initial ping failed, but continuing...');
  }

  // Set up interval
  setInterval(async () => {
    try {
      await pingDatabase();
    } catch (error) {
      console.error('Scheduled ping failed, will retry in 6 hours');
    }
  }, PING_INTERVAL);

  // Keep the process running
  process.on('SIGINT', () => {
    console.log('\nDatabase keep-alive service stopped');
    process.exit(0);
  });
}

async function runOnce() {
  console.log('Pinging database once...');
  try {
    await pingDatabase();
    console.log('Database ping completed successfully');
  } catch (error) {
    console.error('Database ping failed:', error.message);
    process.exit(1);
  }
}

// Check command line arguments
const args = process.argv.slice(2);
const continuous = args.includes('--continuous');

if (continuous) {
  runContinuous();
} else {
  runOnce();
}
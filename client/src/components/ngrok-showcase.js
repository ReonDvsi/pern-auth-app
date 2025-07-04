/**
 * Ngrok Showcase Configuration Helper
 * 
 * This file contains instructions and utilities for showcasing the app via ngrok
 */

/**
 * INSTRUCTIONS FOR NGROK SHOWCASE
 * 
 * 1. Start your backend server: npm run start (in server directory)
 * 2. Start ngrok for backend: ngrok http 5000
 * 3. Copy the ngrok URL (e.g., https://abc123.ngrok.io)
 * 4. Create a temporary .env.ngrok file in client directory with:
 *    REACT_APP_API_URL=https://abc123.ngrok.io/api
 *    REACT_APP_SOCKET_URL=https://abc123.ngrok.io
 * 5. Create a temporary .env.ngrok file in server directory with:
 *    CLIENT_URL=https://your-frontend-ngrok-url.ngrok.io
 * 6. Start frontend with: npm start -- --env-file=.env.ngrok (in client directory)
 * 7. Start ngrok for frontend: ngrok http 3000
 * 8. Share the frontend ngrok URL with your colleague
 */

// Helper function to generate .env.ngrok files
const fs = require('fs');
const path = require('path');

function createNgrokConfig(backendNgrokUrl, frontendNgrokUrl) {
  // Create client .env.ngrok
  const clientEnv = `REACT_APP_API_URL=${backendNgrokUrl}/api\nREACT_APP_SOCKET_URL=${backendNgrokUrl}`;
  fs.writeFileSync(path.join(__dirname, '../../../client/.env.ngrok'), clientEnv);
  
  // Create server .env.ngrok
  const serverEnv = `CLIENT_URL=${frontendNgrokUrl}\n`;
  fs.writeFileSync(path.join(__dirname, '../../../server/.env.ngrok'), serverEnv);
  
  console.log('✅ Ngrok configuration files created!');
  console.log('\nTo use them:');
  console.log('1. Start backend: npm run start -- --env-file=.env.ngrok (in server directory)');
  console.log('2. Start frontend: npm start -- --env-file=.env.ngrok (in client directory)');
}

// Export the function for use in Node.js
module.exports = { createNgrokConfig };

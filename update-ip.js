const fs = require('fs');
const path = require('path');
const os = require('os');

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

function updateEnvFile(filePath, updates) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    Object.entries(updates).forEach(([key, value]) => {
      const regex = new RegExp(`^${key}=.*$`, 'gm');
      if (regex.test(content)) {
        content = content.replace(regex, `${key}=${value}`);
      } else {
        content += `\n${key}=${value}`;
      }
    });
    
    fs.writeFileSync(filePath, content);
    console.log(`✅ Updated ${filePath}`);
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message);
  }
}

const localIP = getLocalIP();
const PORT = 5000;

console.log(`🌐 Detected IP address: ${localIP}`);
console.log('📝 Updating configuration files...\n');

// Update client .env
const clientEnvPath = path.join(__dirname, 'client', '.env');
updateEnvFile(clientEnvPath, {
  REACT_APP_API_URL: `http://${localIP}:${PORT}`,
  REACT_APP_SOCKET_URL: `http://${localIP}:${PORT}`
});

// Update server .env
const serverEnvPath = path.join(__dirname, 'server', '.env');
updateEnvFile(serverEnvPath, {
  CLIENT_URL: `http://${localIP}:3000`
});

console.log('\n✨ Configuration updated successfully!');
console.log('🚀 Now you can:');
console.log('   1. Start the backend: cd server && npm start');
console.log('   2. Start the frontend: cd client && npm start');
console.log(`   3. Access from any device: http://${localIP}:3000`);

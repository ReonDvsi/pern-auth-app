const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const getLocalIP = require('./utils/getLocalIP');

dotenv.config();

const authRoutes = require('./routes/authRoutes');
const siteRoutes = require('./routes/siteRoutes');
const checkInRoutes = require('./routes/checkInRoutes');
const socketHandlers = require('./websocket/socketHandlers');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Temporarily allow all origins for ngrok demo
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Middleware
app.use(cors({
  origin: '*', // Temporarily allow all origins for ngrok demo
  credentials: true
}));
app.use(express.json());

// Add io to request object
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/sites', siteRoutes);
app.use('/api/checkins', checkInRoutes);

// Socket handlers
socketHandlers(io);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, '0.0.0.0', () => {
  const localIP = getLocalIP();
  console.log(`Server running on port ${PORT}`);
  console.log(`Local access: http://localhost:${PORT}`);
  console.log(`Network access: http://${localIP}:${PORT}`);
  console.log('\n📌 Update your client .env file with:');
  console.log(`REACT_APP_API_URL=http://${localIP}:${PORT}`);
  console.log(`REACT_APP_SOCKET_URL=http://${localIP}:${PORT}`);
});
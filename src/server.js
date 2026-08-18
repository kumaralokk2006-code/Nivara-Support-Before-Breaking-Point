require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const { connectDB } = require('./config/database');
const { initializeSockets } = require('./sockets/socketHandler');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  const server = http.createServer(app);
  const io = new Server(server, {
    cors: { origin: '*', methods: ['GET', 'POST', 'PUT'] }
  });

  initializeSockets(io);

  server.listen(PORT, () => {
    console.log(`==================================================`);
    console.log(`  NIVARA BACKEND SERVER RUNNING ON PORT ${PORT}`);
    console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`  Healthcheck: http://localhost:${PORT}/api/health`);
    console.log(`==================================================`);
  });
};

if (require.main === module) {
  startServer();
}

module.exports = { startServer };

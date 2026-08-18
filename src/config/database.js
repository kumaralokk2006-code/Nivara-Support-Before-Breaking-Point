const mongoose = require('mongoose');

let memoryServer = null;

const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGODB_URI;

    if (!mongoUri || process.env.NODE_ENV === 'test' || process.env.USE_IN_MEMORY_DB === 'true') {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      memoryServer = await MongoMemoryServer.create();
      mongoUri = memoryServer.getUri();

      if (process.env.NODE_ENV !== 'test') {
        console.warn('');
        console.warn('========================================================================');
        console.warn('  [NIVARA NOTICE] RUNNING WITH IN-MEMORY MONGODB (DEVELOPMENT MODE)');
        console.warn('  Data will NOT persist across server restarts.');
        console.warn('  For production or persistent storage, configure MONGODB_URI in .env');
        console.warn('========================================================================');
        console.warn('');
      }
    }

    await mongoose.connect(mongoUri);
    console.log(`Connected to MongoDB database: ${mongoose.connection.host || 'in-memory'}`);
  } catch (error) {
    console.error('MongoDB Connection Failed:', error.message);
    if (process.env.NODE_ENV !== 'test') {
      process.exit(1);
    }
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (memoryServer) {
      await memoryServer.stop();
    }
  } catch (error) {
    console.error('Error disconnecting from database:', error.message);
  }
};

module.exports = { connectDB, disconnectDB };

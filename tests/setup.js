process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_jwt_secret_nivara_ps29';
const { connectDB, disconnectDB } = require('../src/config/database');

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await disconnectDB();
});

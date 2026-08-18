const request = require('supertest');
const app = require('../src/app');
require('./setup');

describe('Authentication & RBAC Module', () => {
  it('should register a new student and return a JWT token', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test.student@univ.edu',
        password: 'Password123!',
        role: 'STUDENT',
        name: 'Test Student',
        course: 'B.Tech IT',
        year: 2,
        department: 'Information Tech'
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.role).toBe('STUDENT');
  });

  it('should login an existing student successfully', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test.student@univ.edu',
        password: 'Password123!'
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
  });

  it('should reject invalid password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test.student@univ.edu',
        password: 'WrongPassword'
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});

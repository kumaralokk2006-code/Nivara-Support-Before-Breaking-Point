const request = require('supertest');
const app = require('../src/app');
require('./setup');

describe('Consent Architecture & Gating', () => {
  let token = '';

  beforeAll(async () => {
    const reg = await request(app).post('/api/auth/register').send({
      email: 'consent.student@univ.edu',
      password: 'Pass1234!',
      role: 'STUDENT',
      name: 'Consent Student',
      course: 'B.Tech Mech',
      year: 1,
      department: 'Mechanical'
    });
    token = reg.body.token;
  });

  it('should fetch active student consent preferences', async () => {
    const res = await request(app)
      .get('/api/consent')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.consents)).toBe(true);
  });

  it('should block financial profile update if financial_matching consent is not granted', async () => {
    const res = await request(app)
      .post('/api/financial-support/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({
        feeDifficulty: 'MODERATE',
        expenseCategories: ['TUITION']
      });

    expect(res.status).toBe(403);
    expect(res.body.consentRequired).toBe(true);
  });

  it('should allow financial profile update after granting financial_matching consent', async () => {
    // Grant consent
    await request(app)
      .post('/api/consent')
      .set('Authorization', `Bearer ${token}`)
      .send({
        consentType: 'financial_matching',
        granted: true
      });

    const res = await request(app)
      .post('/api/financial-support/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({
        feeDifficulty: 'MODERATE',
        expenseCategories: ['TUITION']
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

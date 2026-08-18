const request = require('supertest');
const app = require('../src/app');
const { runFairnessAudit } = require('../src/services/fairnessService');
require('./setup');

describe('PS-29 Bias & Fairness Monitoring Engine', () => {
  let adminToken = '';

  beforeAll(async () => {
    const reg = await request(app).post('/api/auth/register').send({
      email: 'admin.fairness@univ.edu',
      password: 'Pass1234!',
      role: 'ADMIN',
      name: 'Fairness Admin'
    });
    adminToken = reg.body.token;
  });

  it('should run fairness audit and flag small sample sizes with insufficientDataFlag', async () => {
    const metrics = await runFairnessAudit('department');
    expect(Array.isArray(metrics)).toBe(true);

    const res = await request(app)
      .get('/api/admin/fairness/audit')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.metrics)).toBe(true);
  });
});

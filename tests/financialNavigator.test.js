const request = require('supertest');
const app = require('../src/app');
const SupportProgram = require('../src/models/SupportProgram');
require('./setup');

describe('Financial Support Navigator (Minimal Data & Non-Definitive Phrasing)', () => {
  let token = '';

  beforeAll(async () => {
    const reg = await request(app).post('/api/auth/register').send({
      email: 'fin.student@univ.edu',
      password: 'Pass1234!',
      role: 'STUDENT',
      name: 'Finance Student',
      department: 'Civil'
    });
    token = reg.body.token;

    // Grant financial consent
    await request(app)
      .post('/api/consent')
      .set('Authorization', `Bearer ${token}`)
      .send({ consentType: 'financial_matching', granted: true });

    // Seed a support program
    await SupportProgram.create({
      title: 'Tuition Fee Installment Support',
      category: 'FINANCIAL',
      subCategory: 'INSTALLMENT_PLAN',
      description: 'Flexible installment options for tuition fee payment.',
      eligibilityCriteria: {
        targetDifficulty: ['MODERATE', 'SIGNIFICANT'],
        targetExpenses: ['TUITION'],
        targetAidStatus: ['NOT_RECEIVING']
      }
    });
  });

  it('should submit minimal financial survey without requiring bank accounts or credit scores', async () => {
    const res = await request(app)
      .post('/api/financial-support/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({
        feeDifficulty: 'MODERATE',
        expenseCategories: ['TUITION'],
        currentAidStatus: 'NOT_RECEIVING'
      });

    expect(res.status).toBe(200);
    expect(res.body.financialProfile.feeDifficulty).toBe('MODERATE');
  });

  it('should return matched recommendations with supportive non-definitive phrasing', async () => {
    const res = await request(app)
      .get('/api/financial-support/recommendations')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.recommendations)).toBe(true);
    if (res.body.recommendations.length > 0) {
      expect(res.body.recommendations[0].recommendationNote).toContain('You may want to explore');
    }
  });
});

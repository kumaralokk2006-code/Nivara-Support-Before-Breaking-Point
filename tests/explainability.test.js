const request = require('supertest');
const app = require('../src/app');
require('./setup');

describe('Explainability Engine ("Why am I seeing this?")', () => {
  let token = '';

  beforeAll(async () => {
    const reg = await request(app).post('/api/auth/register').send({
      email: 'explain.student@univ.edu',
      password: 'Pass1234!',
      role: 'STUDENT',
      name: 'Explain Student',
      course: 'B.Tech CS',
      year: 2,
      department: 'Computer Science'
    });
    token = reg.body.token;

    // Grant financial consent & set profile
    await request(app)
      .post('/api/consent')
      .set('Authorization', `Bearer ${token}`)
      .send({ consentType: 'financial_matching', granted: true });

    await request(app)
      .post('/api/financial-support/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({
        feeDifficulty: 'MODERATE',
        expenseCategories: ['TUITION'],
        currentAidStatus: 'NOT_RECEIVING'
      });
  });

  it('should return transparent factor breakdown and non-punitive assurance for recommendations', async () => {
    const recsRes = await request(app)
      .get('/api/recommendations')
      .set('Authorization', `Bearer ${token}`);

    expect(recsRes.status).toBe(200);
    if (recsRes.body.recommendations.length > 0) {
      const recId = recsRes.body.recommendations[0]._id;
      const expRes = await request(app)
        .get(`/api/recommendations/${recId}/explanation`)
        .set('Authorization', `Bearer ${token}`);

      expect(expRes.status).toBe(200);
      expect(expRes.body.explanation).toBeDefined();
      expect(expRes.body.explanation.contributingFactors).toBeDefined();
      expect(expRes.body.explanation.dataNotUsed).toBeDefined();
      expect(expRes.body.explanation.nonPunitiveAssurance).toContain('solely for support navigation');
    }
  });
});

const request = require('supertest');
const app = require('../src/app');
require('./setup');

describe('Privacy Tiers & Zero Admin Snooping ACL', () => {
  let studentToken = '';
  let adminToken = '';
  let counsellorToken = '';

  beforeAll(async () => {
    const sReg = await request(app).post('/api/auth/register').send({
      email: 'privacy.student@univ.edu',
      password: 'Pass1234!',
      role: 'STUDENT',
      name: 'Privacy Student'
    });
    studentToken = sReg.body.token;

    const aReg = await request(app).post('/api/auth/register').send({
      email: 'privacy.admin@univ.edu',
      password: 'Pass1234!',
      role: 'ADMIN',
      name: 'Privacy Admin'
    });
    adminToken = aReg.body.token;

    const cReg = await request(app).post('/api/auth/register').send({
      email: 'privacy.counsellor@univ.edu',
      password: 'Pass1234!',
      role: 'COUNSELLOR',
      name: 'Privacy Counsellor'
    });
    counsellorToken = cReg.body.token;
  });

  it('should prevent Admin from accessing Student-only endpoints like today dashboard and check-ins', async () => {
    const res = await request(app)
      .get('/api/student/today')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(403);
  });

  it('should prevent Admin from accessing Counsellor-only private session notes', async () => {
    const res = await request(app)
      .get('/api/counsellor/session-notes/some_fake_id')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(403);
  });

  it('should prevent Student from accessing Admin dashboard analytics', async () => {
    const res = await request(app)
      .get('/api/admin/dashboard')
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.status).toBe(403);
  });
});

const request = require('supertest');
const app = require('../src/app');
require('./setup');

describe('Student Data Transparency & Correction Workflow', () => {
  let studentToken = '';
  let adminToken = '';

  beforeAll(async () => {
    const sReg = await request(app).post('/api/auth/register').send({
      email: 'corr.student@univ.edu',
      password: 'Pass1234!',
      role: 'STUDENT',
      name: 'Old Name',
      department: 'Electrical'
    });
    studentToken = sReg.body.token;

    const aReg = await request(app).post('/api/auth/register').send({
      email: 'corr.admin@univ.edu',
      password: 'Pass1234!',
      role: 'ADMIN',
      name: 'Review Admin'
    });
    adminToken = aReg.body.token;
  });

  it('should allow student to submit correction request and admin to approve it', async () => {
    // 1. Submit
    const submitRes = await request(app)
      .post('/api/profile/correction-request')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        fieldCategory: 'PERSONAL',
        fieldName: 'name',
        currentValue: 'Old Name',
        requestedValue: 'New Verified Name',
        justification: 'Correcting spelling discrepancy with institutional records.'
      });

    expect(submitRes.status).toBe(201);
    const corrId = submitRes.body.correction._id;

    // 2. Admin Review
    const reviewRes = await request(app)
      .put(`/api/profile/admin/correction-requests/${corrId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        status: 'APPROVED',
        reviewNotes: 'Verified with registrar department.'
      });

    expect(reviewRes.status).toBe(200);
    expect(reviewRes.body.correction.status).toBe('APPROVED');

    // 3. Verify student profile updated
    const profRes = await request(app)
      .get('/api/student/profile')
      .set('Authorization', `Bearer ${studentToken}`);

    expect(profRes.body.profile.name).toBe('New Verified Name');
  });
});

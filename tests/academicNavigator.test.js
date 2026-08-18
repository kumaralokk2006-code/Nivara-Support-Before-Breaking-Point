const request = require('supertest');
const app = require('../src/app');
const SupportProgram = require('../src/models/SupportProgram');
require('./setup');

describe('Academic Support Navigator', () => {
  let token = '';

  beforeAll(async () => {
    const reg = await request(app).post('/api/auth/register').send({
      email: 'acad.student@univ.edu',
      password: 'Pass1234!',
      role: 'STUDENT',
      name: 'Academic Student',
      department: 'Mechanical'
    });
    token = reg.body.token;

    await SupportProgram.create({
      title: 'Peer Tutoring in Thermodynamics',
      category: 'ACADEMIC',
      subCategory: 'PEER_TUTORING',
      description: 'Peer tutoring sessions for engineering subjects.',
      eligibilityCriteria: {
        targetAcademicIssues: ['Thermodynamics']
      }
    });
  });

  it('should update academic signals and return matched academic programs', async () => {
    const sigRes = await request(app)
      .post('/api/academic/signals')
      .set('Authorization', `Bearer ${token}`)
      .send({
        academicStress: 4,
        subjectDifficulty: ['Thermodynamics'],
        examPressure: 4
      });

    expect(sigRes.status).toBe(200);

    const recRes = await request(app)
      .get('/api/academic/recommendations')
      .set('Authorization', `Bearer ${token}`);

    expect(recRes.status).toBe(200);
    expect(recRes.body.recommendations.length).toBeGreaterThan(0);
  });
});

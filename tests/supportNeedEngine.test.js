const request = require('supertest');
const app = require('../src/app');
const { evaluateStudentSupportNeeds } = require('../src/services/supportNeedEngine');
const User = require('../src/models/User');
require('./setup');

describe('Support Need Engine (Non-punitive Indicators)', () => {
  let studentUser = null;
  let token = '';

  beforeAll(async () => {
    const reg = await request(app).post('/api/auth/register').send({
      email: 'engine.student@univ.edu',
      password: 'Pass1234!',
      role: 'STUDENT',
      name: 'Engine Student',
      course: 'B.Tech CS',
      year: 3,
      department: 'Computer Science'
    });
    token = reg.body.token;
    studentUser = await User.findOne({ email: 'engine.student@univ.edu' });
  });

  it('should compute support need profile without generating punitive labels', async () => {
    // Submit 3 check-ins with high stress
    for (let i = 1; i <= 3; i++) {
      await request(app)
        .post('/api/checkins')
        .set('Authorization', `Bearer ${token}`)
        .send({
          mood: 2,
          stress: 5,
          sleep: 2,
          energy: 2,
          academicPressure: 4,
          dateString: `2026-08-0${i}`
        });
    }

    const profile = await evaluateStudentSupportNeeds(studentUser._id);
    expect(profile).toBeDefined();
    expect(profile.wellbeingNeed).toBe('HIGH');
    expect(profile.activeSignalsSummary.length).toBeGreaterThan(0);
  });
});

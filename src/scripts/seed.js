require('dotenv').config();
const mongoose = require('mongoose');
const { connectDB, disconnectDB } = require('../config/database');
const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const CounsellorProfile = require('../models/CounsellorProfile');
const Consent = require('../models/Consent');
const CheckIn = require('../models/CheckIn');
const AcademicSignal = require('../models/AcademicSignal');
const FinancialProfile = require('../models/FinancialProfile');
const SupportProgram = require('../models/SupportProgram');
const SupportCircle = require('../models/SupportCircle');
const CorrectionRequest = require('../models/CorrectionRequest');
const { generateRecommendationsForStudent } = require('../services/recommendationEngine');
const { runFairnessAudit } = require('../services/fairnessService');
const { ROLES, CONSENT_TYPES, FINANCIAL_DIFFICULTY, AID_STATUS } = require('../config/constants');

const seedData = async () => {
  console.log('--- Starting Nivara Demo Database Seeding ---');
  await connectDB();

  // Clear existing collections
  await Promise.all([
    User.deleteMany({}),
    StudentProfile.deleteMany({}),
    CounsellorProfile.deleteMany({}),
    Consent.deleteMany({}),
    CheckIn.deleteMany({}),
    AcademicSignal.deleteMany({}),
    FinancialProfile.deleteMany({}),
    SupportProgram.deleteMany({}),
    SupportCircle.deleteMany({}),
    CorrectionRequest.deleteMany({})
  ]);

  // 1. Create Admins
  const adminUsers = [
    { email: 'admin.welfare@campus.edu', name: 'Dr. Anita Sharma', role: ROLES.ADMIN },
    { email: 'dean.academics@campus.edu', name: 'Prof. Rajesh Menon', role: ROLES.ADMIN },
    { email: 'fairness.officer@campus.edu', name: 'Dr. Sunita Rao', role: ROLES.ADMIN }
  ];

  for (const a of adminUsers) {
    await User.create({ email: a.email, passwordHash: 'AdminPass123!', role: a.role });
  }
  console.log('✓ Created 3 Campus Administrators');

  // 2. Create Counsellors
  const counsellorUsers = [
    { email: 'counsellor.mentalhealth@campus.edu', name: 'Dr. Vikram Seth', title: 'Senior Mental Health Counsellor', specs: ['Wellbeing', 'Crisis', 'Mindfulness'] },
    { email: 'counsellor.academic@campus.edu', name: 'Prof. Meera Joshi', title: 'Academic Learning Strategist', specs: ['Academic', 'Exam Prep', 'Time Management'] },
    { email: 'counsellor.career@campus.edu', name: 'Mr. Rohan Kapoor', title: 'Placement & Career Advisor', specs: ['Career', 'Placement Anxiety'] },
    { email: 'counsellor.firstyear@campus.edu', name: 'Ms. Priya Patel', title: 'First-Year Transition Mentor', specs: ['First-Year', 'Homesickness', 'Hostel Life'] }
  ];

  for (const c of counsellorUsers) {
    const user = await User.create({ email: c.email, passwordHash: 'Counsellor123!', role: ROLES.COUNSELLOR });
    await CounsellorProfile.create({
      userId: user._id,
      name: c.name,
      title: c.title,
      specializations: c.specs,
      bio: 'Dedicated campus support specialist committed to student well-being and academic growth.',
      availability: [
        { dayOfWeek: 'Monday', startTime: '10:00', endTime: '16:00' },
        { dayOfWeek: 'Wednesday', startTime: '10:00', endTime: '16:00' },
        { dayOfWeek: 'Friday', startTime: '10:00', endTime: '14:00' }
      ]
    });
  }
  console.log('✓ Created 4 Counsellor Profiles with Availability Slots');

  // 3. Create Support Programs (Financial, Academic, Wellbeing)
  const programs = [
    {
      title: 'Tuition Fee Installment Assistance Plan',
      category: 'FINANCIAL',
      subCategory: 'INSTALLMENT_PLAN',
      description: 'Allows eligible students facing temporary cash flow challenges to split term fees into 3 equal monthly installments without penalties.',
      eligibilityCriteria: {
        targetDifficulty: ['MODERATE', 'SIGNIFICANT'],
        targetExpenses: ['TUITION'],
        targetAidStatus: ['NOT_RECEIVING', 'APPLIED_WAITING']
      },
      providerDepartment: 'Student Accounts Office'
    },
    {
      title: 'Emergency Student Food & Living Subsidy',
      category: 'FINANCIAL',
      subCategory: 'EMERGENCY_FUND',
      description: 'Discretionary immediate micro-grants for essential nutritional and living needs during unforeseen circumstances.',
      eligibilityCriteria: {
        targetDifficulty: ['SIGNIFICANT'],
        targetExpenses: ['FOOD', 'HOSTEL'],
        targetAidStatus: ['NOT_RECEIVING']
      },
      providerDepartment: 'Welfare Board'
    },
    {
      title: 'Merit-Cum-Means Educational Scholarship',
      category: 'FINANCIAL',
      subCategory: 'SCHOLARSHIP',
      description: 'Comprehensive institutional scholarship covering up to 50% tuition and course material support.',
      eligibilityCriteria: {
        targetDifficulty: ['MODERATE', 'SIGNIFICANT'],
        targetExpenses: ['TUITION', 'BOOKS'],
        targetAidStatus: ['NOT_RECEIVING', 'APPLIED_WAITING']
      },
      providerDepartment: 'Dean of Student Affairs'
    },
    {
      title: 'Campus Work-Study Library & Lab Assistantship',
      category: 'FINANCIAL',
      subCategory: 'WORK_STUDY',
      description: 'Flexible 8-10 hours/week on-campus assistant roles designed to offset incidental expenses.',
      eligibilityCriteria: {
        targetDifficulty: ['SLIGHT', 'MODERATE'],
        targetExpenses: ['BOOKS', 'TRANSPORT']
      },
      providerDepartment: 'Central Library'
    },
    {
      title: 'Peer Tutoring & Subject Coaching Clinics',
      category: 'ACADEMIC',
      subCategory: 'PEER_TUTORING',
      description: '1-on-1 and small group study sessions facilitated by senior student tutors in challenging foundational subjects.',
      eligibilityCriteria: {
        targetAcademicIssues: ['Data Structures', 'Engineering Mathematics', 'Thermodynamics']
      },
      providerDepartment: 'Academic Learning Center'
    },
    {
      title: 'Exam Preparation & Time Management Workshop',
      category: 'ACADEMIC',
      subCategory: 'EXAM_PREP',
      description: 'Structured strategies for managing syllabus backlog, effective spaced repetition, and exam calm.',
      eligibilityCriteria: {
        targetAcademicIssues: ['Exam Pressure', 'Time Management']
      },
      providerDepartment: 'Academic Support Wing'
    },
    {
      title: 'Faculty Mentorship & Advising Hours',
      category: 'ACADEMIC',
      subCategory: 'ADVISOR_HOURS',
      description: 'Dedicated weekly walk-in advisory sessions with faculty mentors for course guidance and re-engagement.',
      eligibilityCriteria: {
        targetAcademicIssues: ['Attendance Re-engagement', 'Elective Guidance']
      },
      providerDepartment: 'Department Mentorship Cell'
    },
    {
      title: 'Campus Mindfulness & Stress Reduction Circle',
      category: 'WELLBEING',
      subCategory: 'MINDFULNESS',
      description: 'Weekly guided relaxation and mindfulness sessions in the Student Care Center.',
      eligibilityCriteria: {},
      providerDepartment: 'Nivara Campus Well-being Center'
    }
  ];

  for (const p of programs) {
    await SupportProgram.create(p);
  }
  console.log('✓ Created 8 Multidimensional Support Programs (Academic, Financial, Wellbeing)');

  // 4. Create Students & Histories
  const studentData = [
    { email: 'rahul.kumar@student.edu', name: 'Rahul Kumar', dept: 'Computer Science', course: 'B.Tech CS', year: 2, feeDiff: FINANCIAL_DIFFICULTY.MODERATE, aid: AID_STATUS.NOT_RECEIVING, expenses: ['TUITION', 'BOOKS'], acadStress: 4, examPres: 4, subDiff: ['Data Structures'], moodSeq: [2, 2, 3, 2, 2], stressSeq: [4, 5, 4, 4, 4] },
    { email: 'priya.sharma@student.edu', name: 'Priya Sharma', dept: 'Mechanical', course: 'B.Tech Mech', year: 3, feeDiff: FINANCIAL_DIFFICULTY.NONE, aid: AID_STATUS.RECEIVING, expenses: [], acadStress: 2, examPres: 2, subDiff: [], moodSeq: [4, 4, 4, 5, 4], stressSeq: [2, 1, 2, 2, 2] },
    { email: 'arjun.singh@student.edu', name: 'Arjun Singh', dept: 'Electronics', course: 'B.Tech ECE', year: 1, feeDiff: FINANCIAL_DIFFICULTY.SIGNIFICANT, aid: AID_STATUS.NOT_RECEIVING, expenses: ['FOOD', 'HOSTEL'], acadStress: 3, examPres: 3, subDiff: ['Engineering Mathematics'], moodSeq: [2, 3, 2, 2, 2], stressSeq: [4, 4, 5, 4, 4] },
    { email: 'sneha.patel@student.edu', name: 'Sneha Patel', dept: 'Civil', course: 'B.Tech Civil', year: 4, feeDiff: FINANCIAL_DIFFICULTY.SLIGHT, aid: AID_STATUS.APPLIED_WAITING, expenses: ['TRANSPORT'], acadStress: 4, examPres: 5, subDiff: ['Structural Analysis'], moodSeq: [3, 2, 3, 2, 3], stressSeq: [4, 4, 4, 5, 4] },
    { email: 'vikas.verma@student.edu', name: 'Vikas Verma', dept: 'Computer Science', course: 'B.Tech CS', year: 1, feeDiff: FINANCIAL_DIFFICULTY.NONE, aid: AID_STATUS.NOT_RECEIVING, expenses: [], acadStress: 1, examPres: 2, subDiff: [], moodSeq: [5, 4, 5, 4, 5], stressSeq: [1, 2, 1, 1, 2] }
  ];

  for (const s of studentData) {
    const user = await User.create({ email: s.email, passwordHash: 'StudentPass123!', role: ROLES.STUDENT });
    await StudentProfile.create({
      userId: user._id,
      name: s.name,
      course: s.course,
      year: s.year,
      department: s.dept,
      demographicGroup: s.dept
    });

    // Consent
    await Consent.create({ userId: user._id, consentType: CONSENT_TYPES.WELLBEING_CHECKIN, granted: true, grantedAt: new Date() });
    await Consent.create({ userId: user._id, consentType: CONSENT_TYPES.FINANCIAL_MATCHING, granted: s.feeDiff !== FINANCIAL_DIFFICULTY.NONE, grantedAt: new Date() });
    await Consent.create({ userId: user._id, consentType: CONSENT_TYPES.ACADEMIC_INTEGRATION, granted: true, grantedAt: new Date() });

    // Financial Profile
    if (s.feeDiff !== FINANCIAL_DIFFICULTY.NONE) {
      await FinancialProfile.create({
        studentId: user._id,
        feeDifficulty: s.feeDiff,
        expenseCategories: s.expenses,
        currentAidStatus: s.aid
      });
    }

    // Academic Signal
    await AcademicSignal.create({
      studentId: user._id,
      academicStress: s.acadStress,
      examPressure: s.examPres,
      subjectDifficulty: s.subDiff,
      attendanceTrend: s.acadStress >= 4 ? 'DECLINING' : 'STABLE'
    });

    // Daily Check-ins (past 5 days)
    for (let i = 0; i < s.moodSeq.length; i++) {
      const d = new Date();
      d.setDate(d.getDate() - (s.moodSeq.length - 1 - i));
      const dateString = d.toISOString().split('T')[0];

      await CheckIn.create({
        studentId: user._id,
        dateString,
        mood: s.moodSeq[i],
        stress: s.stressSeq[i],
        sleep: Math.max(1, 6 - s.stressSeq[i]),
        energy: s.moodSeq[i],
        academicPressure: s.acadStress
      });
    }

    // Generate explainable recommendations
    await generateRecommendationsForStudent(user._id);
  }
  console.log('✓ Created 5 Students with Consents, Check-In Timelines, Financial & Academic Profiles, and Recommendations');

  // 5. Create Temporary Support Circles
  const circles = [
    { name: 'First-Year Hostel Transition', category: 'FIRST_YEAR', description: 'A safe peer room for first-year students navigating hostel life and homesickness.', activeUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000) },
    { name: 'Exam Stress & Revision Calm', category: 'EXAM_STRESS', description: 'Share study tips, time management strategies, and mutual encouragement during exam prep.', activeUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
    { name: 'Placement & Internship Preparation', category: 'PLACEMENT_ANXIETY', description: 'Peer support group for final-year and pre-final students preparing for technical interviews.', activeUntil: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000) }
  ];

  for (const c of circles) {
    await SupportCircle.create(c);
  }
  console.log('✓ Created 3 Temporary Support Circles');

  // 6. Run Initial Fairness Audit
  await runFairnessAudit('department');
  console.log('✓ Computed Initial PS-29 Group-Level Fairness & Bias Audit Metrics');

  console.log('==================================================');
  console.log('  NIVARA DATABASE SEEDING COMPLETED SUCCESSFULLY');
  console.log('  Demo Student: rahul.kumar@student.edu / StudentPass123!');
  console.log('  Demo Counsellor: counsellor.mentalhealth@campus.edu / Counsellor123!');
  console.log('  Demo Admin: admin.welfare@campus.edu / AdminPass123!');
  console.log('==================================================');

  await disconnectDB();
};

if (require.main === module) {
  seedData().catch(err => {
    console.error('Seeding failed:', err);
    process.exit(1);
  });
}

module.exports = { seedData };

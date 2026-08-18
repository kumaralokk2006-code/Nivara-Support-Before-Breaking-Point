const StudentProfile = require('../models/StudentProfile');
const CheckIn = require('../models/CheckIn');
const Appointment = require('../models/Appointment');
const Notification = require('../models/Notification');
const SupportNeedProfile = require('../models/SupportNeedProfile');
const Recommendation = require('../models/Recommendation');
const Consent = require('../models/Consent');

const getTodayDashboard = async (req, res, next) => {
  try {
    const studentId = req.user._id;
    const todayStr = new Date().toISOString().split('T')[0];

    const checkInToday = await CheckIn.findOne({ studentId, dateString: todayStr });
    const upcomingAppointment = await Appointment.findOne({
      studentId,
      dateTime: { $gte: new Date() },
      status: { $in: ['ACCEPTED', 'PENDING', 'REQUESTED'] }
    }).populate('counsellorId', 'email').sort({ dateTime: 1 });

    const activeRecs = await Recommendation.find({ studentId, status: 'ACTIVE' }).limit(3);
    const unreadNotifications = await Notification.countDocuments({ userId: studentId, isRead: false });
    const needProfile = await SupportNeedProfile.findOne({ studentId });

    const recommendedActions = [];
    if (!checkInToday) {
      recommendedActions.push('Complete today\'s daily well-being check-in');
    }
    if (activeRecs.length > 0) {
      recommendedActions.push(`Explore ${activeRecs.length} supportive recommendations`);
    }

    res.json({
      success: true,
      today: {
        date: todayStr,
        checkInCompleted: !!checkInToday,
        checkInData: checkInToday || null,
        upcomingAppointment,
        activeRecommendationsCount: activeRecs.length,
        unreadNotifications,
        recommendedActions,
        supportNeedSummary: needProfile ? {
          academic: needProfile.academicNeed,
          financial: needProfile.financialNeed,
          wellbeing: needProfile.wellbeingNeed
        } : null
      }
    });
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const profile = await StudentProfile.findOne({ userId: req.user._id });
    res.json({ success: true, profile });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { language, communicationPreference } = req.body;
    const profile = await StudentProfile.findOneAndUpdate(
      { userId: req.user._id },
      { language, communicationPreference },
      { new: true }
    );
    res.json({ success: true, message: 'Profile preferences updated', profile });
  } catch (error) {
    next(error);
  }
};

const getTransparencyReport = async (req, res, next) => {
  try {
    const studentId = req.user._id;
    const profile = await StudentProfile.findOne({ userId: studentId });
    const consents = await Consent.find({ userId: studentId });

    const report = {
      title: 'Nivara Data Transparency Report',
      description: 'Nivara operates strictly on minimal data minimization and informed consent.',
      dataFieldsStored: [
        {
          category: 'Personal Information',
          fields: ['Name', 'Course', 'Year', 'Department'],
          isOptional: false,
          purpose: 'Institutional enrollment context for support routing',
          accessTier: 'Student & Authorized Support Professionals (No public/peer access)'
        },
        {
          category: 'Daily Well-being Check-ins',
          fields: ['Mood (1-5)', 'Stress (1-5)', 'Sleep (1-5)', 'Energy (1-5)', 'Academic Pressure (1-5)'],
          isOptional: true,
          consentStatus: consents.find(c => c.consentType === 'wellbeing_checkin')?.granted ? 'GRANTED' : 'REVOKED',
          purpose: 'Detecting supportive trends and personal reflection',
          accessTier: 'Student (Full), Counsellor (Aggregated trends), Admin (NO ACCESS)'
        },
        {
          category: 'Financial Support Navigator',
          fields: ['Fee Difficulty', 'Expense Categories', 'Aid Status'],
          isOptional: true,
          consentStatus: consents.find(c => c.consentType === 'financial_matching')?.granted ? 'GRANTED' : 'REVOKED',
          purpose: 'Matching eligible campus scholarships, emergency funds, and installment schemes',
          accessTier: 'Student Only (Zero Counsellor & Zero Admin Access)'
        },
        {
          category: 'Data NOT Collected Or Used',
          fields: ['Bank account transactions', 'Credit scores', 'Aadhaar / National ID', 'Disciplinary punishment records'],
          isOptional: false,
          purpose: 'Strictly prohibited under Nivara privacy policy'
        }
      ],
      nonPunitiveGuarantees: [
        'Nivara never penalizes attendance based on check-ins.',
        'Nivara never downgrades grades or cancels scholarships automatically.',
        'All high-impact decisions remain with human institutional review.'
      ]
    };

    res.json({ success: true, report });
  } catch (error) {
    next(error);
  }
};

const getInsights = async (req, res, next) => {
  try {
    const studentId = req.user._id;
    const checkIns = await CheckIn.find({ studentId }).sort({ dateString: 1 }).limit(30);

    const averages = {
      mood: 0,
      stress: 0,
      sleep: 0,
      energy: 0,
      academicPressure: 0
    };

    if (checkIns.length > 0) {
      averages.mood = Number((checkIns.reduce((a, c) => a + c.mood, 0) / checkIns.length).toFixed(2));
      averages.stress = Number((checkIns.reduce((a, c) => a + c.stress, 0) / checkIns.length).toFixed(2));
      averages.sleep = Number((checkIns.reduce((a, c) => a + c.sleep, 0) / checkIns.length).toFixed(2));
      averages.energy = Number((checkIns.reduce((a, c) => a + c.energy, 0) / checkIns.length).toFixed(2));
      averages.academicPressure = Number((checkIns.reduce((a, c) => a + c.academicPressure, 0) / checkIns.length).toFixed(2));
    }

    res.json({
      success: true,
      insights: {
        totalCheckIns: checkIns.length,
        averages,
        timeline: checkIns.map(c => ({
          date: c.dateString,
          mood: c.mood,
          stress: c.stress,
          sleep: c.sleep,
          energy: c.energy,
          academicPressure: c.academicPressure
        }))
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getTodayDashboard, getProfile, updateProfile, getTransparencyReport, getInsights };

const AcademicSignal = require('../models/AcademicSignal');
const SupportProgram = require('../models/SupportProgram');
const { matchAcademicSupport } = require('../services/academicMatcher');
const { generateRecommendationsForStudent } = require('../services/recommendationEngine');

const getSignals = async (req, res, next) => {
  try {
    const signal = await AcademicSignal.findOne({ studentId: req.user._id });
    res.json({ success: true, signal: signal || null });
  } catch (error) {
    next(error);
  }
};

const updateSignals = async (req, res, next) => {
  try {
    const studentId = req.user._id;
    const { academicStress, subjectDifficulty, examPressure, placementAnxiety, assignmentChallenges, consentedAttendancePercentage, attendanceTrend } = req.body;

    const signal = await AcademicSignal.findOneAndUpdate(
      { studentId },
      {
        academicStress,
        subjectDifficulty,
        examPressure,
        placementAnxiety,
        assignmentChallenges,
        consentedAttendancePercentage,
        attendanceTrend
      },
      { upsert: true, new: true }
    );

    try {
      await generateRecommendationsForStudent(studentId);
    } catch (err) {
      // Non-blocking
    }

    res.json({
      success: true,
      message: 'Academic support preferences updated successfully',
      signal
    });
  } catch (error) {
    next(error);
  }
};

const getPrograms = async (req, res, next) => {
  try {
    const programs = await SupportProgram.find({ category: 'ACADEMIC', isActive: true });
    res.json({ success: true, programs });
  } catch (error) {
    next(error);
  }
};

const getRecommendations = async (req, res, next) => {
  try {
    const matches = await matchAcademicSupport(req.user._id);
    res.json({ success: true, recommendations: matches });
  } catch (error) {
    next(error);
  }
};

module.exports = { getSignals, updateSignals, getPrograms, getRecommendations };

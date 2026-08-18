const FinancialProfile = require('../models/FinancialProfile');
const SupportProgram = require('../models/SupportProgram');
const { matchFinancialSupport } = require('../services/financialMatcher');
const { generateRecommendationsForStudent } = require('../services/recommendationEngine');

const getProfile = async (req, res, next) => {
  try {
    const profile = await FinancialProfile.findOne({ studentId: req.user._id });
    res.json({ success: true, financialProfile: profile || null });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const studentId = req.user._id;
    const { feeDifficulty, expenseCategories, currentAidStatus, supportPreferences } = req.body;

    const profile = await FinancialProfile.findOneAndUpdate(
      { studentId },
      {
        feeDifficulty,
        expenseCategories,
        currentAidStatus,
        supportPreferences
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
      message: 'Financial support preferences recorded successfully.',
      financialProfile: profile
    });
  } catch (error) {
    next(error);
  }
};

const getPrograms = async (req, res, next) => {
  try {
    const programs = await SupportProgram.find({ category: 'FINANCIAL', isActive: true });
    res.json({ success: true, programs });
  } catch (error) {
    next(error);
  }
};

const getProgramById = async (req, res, next) => {
  try {
    const program = await SupportProgram.findById(req.params.id);
    if (!program) {
      return res.status(404).json({ success: false, message: 'Financial program not found' });
    }
    res.json({ success: true, program });
  } catch (error) {
    next(error);
  }
};

const getRecommendations = async (req, res, next) => {
  try {
    const matches = await matchFinancialSupport(req.user._id);
    res.json({ success: true, recommendations: matches });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProfile, updateProfile, getPrograms, getProgramById, getRecommendations };

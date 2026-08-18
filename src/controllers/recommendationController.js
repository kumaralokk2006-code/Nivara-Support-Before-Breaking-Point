const Recommendation = require('../models/Recommendation');
const { getRecommendationExplanation } = require('../services/explanationEngine');
const { generateRecommendationsForStudent } = require('../services/recommendationEngine');

const getRecommendations = async (req, res, next) => {
  try {
    let recs = await Recommendation.find({ studentId: req.user._id, status: 'ACTIVE' }).populate('programId');
    if (recs.length === 0) {
      recs = await generateRecommendationsForStudent(req.user._id);
    }
    res.json({ success: true, recommendations: recs });
  } catch (error) {
    next(error);
  }
};

const getRecommendationById = async (req, res, next) => {
  try {
    const rec = await Recommendation.findOne({ _id: req.params.id, studentId: req.user._id }).populate('programId');
    if (!rec) {
      return res.status(404).json({ success: false, message: 'Recommendation not found' });
    }
    res.json({ success: true, recommendation: rec });
  } catch (error) {
    next(error);
  }
};

const getExplanation = async (req, res, next) => {
  try {
    const explanation = await getRecommendationExplanation(req.params.id, req.user._id);
    res.json({ success: true, ...explanation });
  } catch (error) {
    next(error);
  }
};

const markExplored = async (req, res, next) => {
  try {
    const rec = await Recommendation.findOneAndUpdate(
      { _id: req.params.id, studentId: req.user._id },
      { status: 'EXPLORED' },
      { new: true }
    );
    res.json({ success: true, message: 'Recommendation marked as explored', recommendation: rec });
  } catch (error) {
    next(error);
  }
};

module.exports = { getRecommendations, getRecommendationById, getExplanation, markExplored };

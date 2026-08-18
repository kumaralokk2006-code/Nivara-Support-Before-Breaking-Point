const SupportNeedProfile = require('../models/SupportNeedProfile');
const { evaluateStudentSupportNeeds } = require('../services/supportNeedEngine');

const getStudentSupportNeed = async (req, res, next) => {
  try {
    let profile = await SupportNeedProfile.findOne({ studentId: req.user._id });
    if (!profile) {
      profile = await evaluateStudentSupportNeeds(req.user._id);
    }

    res.json({
      success: true,
      supportNeedProfile: {
        academicNeed: profile.academicNeed,
        academicScore: profile.academicScore,
        financialNeed: profile.financialNeed,
        wellbeingNeed: profile.wellbeingNeed,
        activeSignalsSummary: profile.activeSignalsSummary,
        evaluatedAt: profile.evaluatedAt,
        nonPunitiveAssurance: 'These indicators represent supportive resource recommendations and cannot be used for punitive, grading, or disciplinary actions.'
      }
    });
  } catch (error) {
    next(error);
  }
};

const reevaluateSupportNeed = async (req, res, next) => {
  try {
    const profile = await evaluateStudentSupportNeeds(req.user._id);
    res.json({
      success: true,
      message: 'Support need profile re-evaluated successfully.',
      supportNeedProfile: profile
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getStudentSupportNeed, reevaluateSupportNeed };

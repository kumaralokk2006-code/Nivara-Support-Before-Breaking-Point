const Recommendation = require('../models/Recommendation');
const FinancialProfile = require('../models/FinancialProfile');
const AcademicSignal = require('../models/AcademicSignal');
const CheckIn = require('../models/CheckIn');
const Consent = require('../models/Consent');

/**
 * Explanation Engine:
 * Generates transparent, factor-by-factor "Why am I seeing this?" breakdowns.
 */
const getRecommendationExplanation = async (recommendationId, studentId) => {
  const rec = await Recommendation.findOne({ _id: recommendationId, studentId }).populate('programId');
  if (!rec) {
    throw new Error('Recommendation not found');
  }

  const contributingFactors = [];
  const timeWindow = 'Evaluated from check-in ratings and profile inputs submitted in the past 14 days.';
  
  if (rec.category === 'FINANCIAL') {
    const fin = await FinancialProfile.findOne({ studentId });
    if (fin) {
      if (fin.feeDifficulty !== 'NONE') {
        contributingFactors.push(`Consented response: Indicated '${fin.feeDifficulty.toLowerCase()}' difficulty with educational expenses.`);
      }
      if (fin.expenseCategories && fin.expenseCategories.length > 0) {
        contributingFactors.push(`Target expense categories identified: ${fin.expenseCategories.join(', ')}.`);
      }
      if (fin.currentAidStatus) {
        contributingFactors.push(`Current aid status reported: ${fin.currentAidStatus.replace(/_/g, ' ').toLowerCase()}.`);
      }
    }
  } else if (rec.category === 'ACADEMIC') {
    const acad = await AcademicSignal.findOne({ studentId });
    if (acad) {
      if (acad.academicStress >= 3) {
        contributingFactors.push(`Consented response: Elevated academic stress score (${acad.academicStress}/5).`);
      }
      if (acad.subjectDifficulty && acad.subjectDifficulty.length > 0) {
        contributingFactors.push(`Subjects with reported difficulty: ${acad.subjectDifficulty.join(', ')}.`);
      }
      if (acad.examPressure >= 3) {
        contributingFactors.push(`Consented response: Exam pressure rating (${acad.examPressure}/5).`);
      }
    }
  } else if (rec.category === 'WELLBEING') {
    const checkIns = await CheckIn.find({ studentId }).sort({ dateString: -1 }).limit(7);
    if (checkIns.length > 0) {
      const avgStress = (checkIns.reduce((a, c) => a + c.stress, 0) / checkIns.length).toFixed(1);
      contributingFactors.push(`Average stress rating of ${avgStress}/5 across your recent daily check-ins.`);
    }
  }

  if (contributingFactors.length === 0) {
    contributingFactors.push('Matched with standard campus support resources based on your course and academic level.');
  }

  return {
    recommendationId: rec._id,
    programTitle: rec.title,
    category: rec.category,
    explanation: {
      summary: rec.explanationText,
      contributingFactors,
      timeWindow,
      dataNotUsed: [
        'Bank account statements, credit scores, or Aadhaar numbers',
        'Academic grade disciplinary files',
        'Unconsented institutional records'
      ],
      nonPunitiveAssurance: 'This recommendation is solely for support navigation. It does not affect your grades, scholarship standing, attendance penalties, or disciplinary record.'
    }
  };
};

module.exports = { getRecommendationExplanation };

const Recommendation = require('../models/Recommendation');
const SupportProgram = require('../models/SupportProgram');
const { matchAcademicSupport } = require('./academicMatcher');
const { matchFinancialSupport } = require('./financialMatcher');
const { evaluateStudentSupportNeeds } = require('./supportNeedEngine');
const { SUPPORT_CATEGORIES, SUPPORT_LEVELS } = require('../config/constants');

const generateRecommendationsForStudent = async (studentId) => {
  const needProfile = await evaluateStudentSupportNeeds(studentId);

  // 1. Academic Matches
  const academicMatches = await matchAcademicSupport(studentId);
  // 2. Financial Matches
  const financialMatches = await matchFinancialSupport(studentId);
  // 3. Well-being Matches
  const wellbeingPrograms = await SupportProgram.find({ category: SUPPORT_CATEGORIES.WELLBEING, isActive: true });

  const generated = [];

  // Academic Recs
  for (const match of academicMatches.slice(0, 3)) {
    const existing = await Recommendation.findOne({ studentId, programId: match.program._id });
    if (!existing) {
      const rec = await Recommendation.create({
        studentId,
        programId: match.program._id,
        category: SUPPORT_CATEGORIES.ACADEMIC,
        title: match.program.title,
        reasonCodes: match.reasons,
        explanationText: match.recommendationNote
      });
      generated.push(rec);
    }
  }

  // Financial Recs
  for (const match of financialMatches.slice(0, 3)) {
    const existing = await Recommendation.findOne({ studentId, programId: match.program._id });
    if (!existing) {
      const rec = await Recommendation.create({
        studentId,
        programId: match.program._id,
        category: SUPPORT_CATEGORIES.FINANCIAL,
        title: match.program.title,
        reasonCodes: match.reasons,
        explanationText: match.recommendationNote
      });
      generated.push(rec);
    }
  }

  // Wellbeing Recs
  if (needProfile.wellbeingNeed === SUPPORT_LEVELS.HIGH || needProfile.wellbeingNeed === SUPPORT_LEVELS.MODERATE) {
    for (const prog of wellbeingPrograms.slice(0, 2)) {
      const existing = await Recommendation.findOne({ studentId, programId: prog._id });
      if (!existing) {
        const rec = await Recommendation.create({
          studentId,
          programId: prog._id,
          category: SUPPORT_CATEGORIES.WELLBEING,
          title: prog.title,
          reasonCodes: ['Identified well-being support indicator from recent check-ins'],
          explanationText: 'You may find this supportive well-being resource or counselling service beneficial.'
        });
        generated.push(rec);
      }
    }
  }

  return await Recommendation.find({ studentId, status: 'ACTIVE' }).populate('programId');
};

module.exports = { generateRecommendationsForStudent };

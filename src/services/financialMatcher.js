const SupportProgram = require('../models/SupportProgram');
const FinancialProfile = require('../models/FinancialProfile');
const { SUPPORT_CATEGORIES, FINANCIAL_DIFFICULTY } = require('../config/constants');

/**
 * Financial Support Navigator:
 * Matches minimal consented financial signals to support programs.
 * Explicit safeguard: Uses supportive non-definitive phrasing.
 */
const matchFinancialSupport = async (studentId) => {
  const finProfile = await FinancialProfile.findOne({ studentId });
  const programs = await SupportProgram.find({ category: SUPPORT_CATEGORIES.FINANCIAL, isActive: true });

  const matches = [];

  for (const prog of programs) {
    let matchScore = 0;
    const reasons = [];

    if (finProfile && finProfile.feeDifficulty !== FINANCIAL_DIFFICULTY.NONE) {
      // Check category match
      const criteria = prog.eligibilityCriteria || {};
      const expenseOverlap = (finProfile.expenseCategories || []).some(cat => 
        (criteria.targetExpenses || []).includes(cat)
      );

      if (expenseOverlap) {
        matchScore += 2;
        reasons.push(`Matched support for indicated expense categories: ${finProfile.expenseCategories.join(', ')}`);
      }

      if (finProfile.currentAidStatus === 'NOT_RECEIVING' && ['SCHOLARSHIP', 'FEE_ASSISTANCE', 'INSTALLMENT_PLAN'].includes(prog.subCategory)) {
        matchScore += 2;
        reasons.push('Relevant aid program for students not currently receiving financial assistance');
      }

      if (finProfile.feeDifficulty === FINANCIAL_DIFFICULTY.SIGNIFICANT && prog.subCategory === 'EMERGENCY_FUND') {
        matchScore += 3;
        reasons.push('Emergency relief grant option for significant unexpected financial strain');
      }
    }

    if (matchScore > 0 || prog.subCategory === 'SCHOLARSHIP') {
      matches.push({
        program: prog,
        matchScore,
        reasons: reasons.length > 0 ? reasons : ['General campus financial support opportunity'],
        recommendationNote: 'You may want to explore this support option. Final eligibility is determined by the respective scholarship committee/institution.'
      });
    }
  }

  return matches.sort((a, b) => b.matchScore - a.matchScore);
};

module.exports = { matchFinancialSupport };

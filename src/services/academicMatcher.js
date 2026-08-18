const SupportProgram = require('../models/SupportProgram');
const AcademicSignal = require('../models/AcademicSignal');
const { SUPPORT_CATEGORIES } = require('../config/constants');

/**
 * Academic Support Navigator:
 * Matches student's consented academic signals to helpful academic resources, advisors, and workshops.
 */
const matchAcademicSupport = async (studentId) => {
  const signal = await AcademicSignal.findOne({ studentId });
  const programs = await SupportProgram.find({ category: SUPPORT_CATEGORIES.ACADEMIC, isActive: true });

  const matches = [];

  for (const prog of programs) {
    let relevanceScore = 0;
    const reasons = [];

    if (signal) {
      if (signal.subjectDifficulty && signal.subjectDifficulty.length > 0 && prog.subCategory === 'PEER_TUTORING') {
        relevanceScore += 2;
        reasons.push(`Peer tutoring available for ${signal.subjectDifficulty.join(', ')}`);
      }
      if ((signal.examPressure >= 3 || signal.academicStress >= 3) && ['EXAM_PREP', 'STUDY_SKILLS'].includes(prog.subCategory)) {
        relevanceScore += 2;
        reasons.push('Resources matched with self-reported exam pressure');
      }
      if (signal.placementAnxiety && prog.subCategory === 'CAREER_WORKSHOP') {
        relevanceScore += 2;
        reasons.push('Matched with placement anxiety support preferences');
      }
      if (signal.attendanceTrend === 'DECLINING' && prog.subCategory === 'ADVISOR_HOURS') {
        relevanceScore += 2;
        reasons.push('Academic advising recommended for attendance re-engagement');
      }
    }

    // Default baseline campus programs
    if (relevanceScore > 0 || prog.subCategory === 'STUDY_SKILLS') {
      matches.push({
        program: prog,
        relevanceScore,
        reasons: reasons.length > 0 ? reasons : ['General campus academic enrichment resource'],
        recommendationNote: 'You may want to explore this academic support option to assist with your coursework.'
      });
    }
  }

  return matches.sort((a, b) => b.relevanceScore - a.relevanceScore);
};

module.exports = { matchAcademicSupport };

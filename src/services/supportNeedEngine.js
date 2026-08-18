const CheckIn = require('../models/CheckIn');
const FinancialProfile = require('../models/FinancialProfile');
const AcademicSignal = require('../models/AcademicSignal');
const SupportNeedProfile = require('../models/SupportNeedProfile');
const Consent = require('../models/Consent');
const { SUPPORT_LEVELS, CONSENT_TYPES, FINANCIAL_DIFFICULTY, AID_STATUS } = require('../config/constants');

/**
 * Deterministic Support Need Engine (SIH PS-29 Specification):
 * Replaces unvalidated complex black-box ML models with a transparent, explainable, testable weighted-rule engine.
 * Computes support need indicators (LOW, MILD, MODERATE, HIGH) across Academic, Financial, and Well-being dimensions.
 */
const evaluateStudentSupportNeeds = async (studentId) => {
  // Check active consents
  const consents = await Consent.find({ userId: studentId, granted: true });
  const grantedTypes = new Set(consents.map(c => c.consentType));

  const signalsSummary = [];

  // =========================================================================
  // 1. Deterministic Academic Support Need Scoring (Section 5 PRD Specification)
  // Configurable weights:
  // - Attendance < 75%: +25
  // - Declining attendance: +15
  // - Declining marks: +20
  // - Multiple overdue assignments (>= 2): +15
  // - Academic stress >= 4: +15
  // - Student requests help: +10
  // =========================================================================
  let academicNeed = SUPPORT_LEVELS.LOW;
  let academicScore = 0;

  if (grantedTypes.has(CONSENT_TYPES.ACADEMIC_INTEGRATION) || grantedTypes.has(CONSENT_TYPES.ACADEMIC_DATA)) {
    const acadSignal = await AcademicSignal.findOne({ studentId });
    if (acadSignal) {
      if (acadSignal.attendancePercentage < 75) {
        academicScore += 25;
        signalsSummary.push({
          category: 'ACADEMIC',
          indicator: `Consented attendance (${acadSignal.attendancePercentage}%) is below 75%`,
          level: SUPPORT_LEVELS.HIGH,
          points: 25
        });
      }
      if (acadSignal.attendanceTrend === 'DECLINING') {
        academicScore += 15;
        signalsSummary.push({
          category: 'ACADEMIC',
          indicator: 'Consented attendance trend indicates a declining trajectory',
          level: SUPPORT_LEVELS.MODERATE,
          points: 15
        });
      }
      if (acadSignal.marksTrend === 'DECLINING') {
        academicScore += 20;
        signalsSummary.push({
          category: 'ACADEMIC',
          indicator: 'Declining academic assessment trend reported',
          level: SUPPORT_LEVELS.MODERATE,
          points: 20
        });
      }
      if (acadSignal.overdueAssignmentsCount >= 2 || acadSignal.assignmentChallenges) {
        academicScore += 15;
        signalsSummary.push({
          category: 'ACADEMIC',
          indicator: 'Multiple assignments pending or self-reported coursework challenges',
          level: SUPPORT_LEVELS.MODERATE,
          points: 15
        });
      }
      if (acadSignal.academicStress >= 4 || acadSignal.examPressure >= 4) {
        academicScore += 15;
        signalsSummary.push({
          category: 'ACADEMIC',
          indicator: `Elevated self-reported academic/exam pressure (${Math.max(acadSignal.academicStress, acadSignal.examPressure)}/5)`,
          level: SUPPORT_LEVELS.MODERATE,
          points: 15
        });
      }
      if (acadSignal.studentRequestedHelp) {
        academicScore += 10;
        signalsSummary.push({
          category: 'ACADEMIC',
          indicator: 'Student voluntarily requested academic tutoring or advising navigation',
          level: SUPPORT_LEVELS.MILD,
          points: 10
        });
      }

      // Map score to Support Need Levels
      if (academicScore >= 50) {
        academicNeed = SUPPORT_LEVELS.HIGH;
      } else if (academicScore >= 35) {
        academicNeed = SUPPORT_LEVELS.MODERATE;
      } else if (academicScore >= 20) {
        academicNeed = SUPPORT_LEVELS.MILD;
      } else {
        academicNeed = SUPPORT_LEVELS.LOW;
      }
    }
  }

  // =========================================================================
  // 2. Financial Support Need Evaluation (Section 7 PRD Minimal Data)
  // =========================================================================
  let financialNeed = SUPPORT_LEVELS.LOW;
  if (grantedTypes.has(CONSENT_TYPES.FINANCIAL_MATCHING)) {
    const finProfile = await FinancialProfile.findOne({ studentId });
    if (finProfile) {
      const isSigDiff = finProfile.feeDifficulty === FINANCIAL_DIFFICULTY.SIGNIFICANT;
      const isModDiff = finProfile.feeDifficulty === FINANCIAL_DIFFICULTY.MODERATE;
      const isSlightDiff = finProfile.feeDifficulty === FINANCIAL_DIFFICULTY.SLIGHT;
      const notAided = finProfile.currentAidStatus === AID_STATUS.NOT_RECEIVING;
      const multipleExpenses = (finProfile.expenseCategories || []).length >= 2;

      if (isSigDiff || (isModDiff && notAided && multipleExpenses)) {
        financialNeed = SUPPORT_LEVELS.HIGH;
        signalsSummary.push({
          category: 'FINANCIAL',
          indicator: 'Self-reported significant difficulty with living/educational expenses without active aid',
          level: SUPPORT_LEVELS.HIGH
        });
      } else if (isModDiff) {
        financialNeed = SUPPORT_LEVELS.MODERATE;
        signalsSummary.push({
          category: 'FINANCIAL',
          indicator: 'Self-reported moderate difficulty in specific educational expense categories',
          level: SUPPORT_LEVELS.MODERATE
        });
      } else if (isSlightDiff && notAided) {
        financialNeed = SUPPORT_LEVELS.MILD;
        signalsSummary.push({
          category: 'FINANCIAL',
          indicator: 'Self-reported slight difficulty with educational expenses',
          level: SUPPORT_LEVELS.MILD
        });
      }
    }
  }

  // =========================================================================
  // 3. Well-being Support Need Evaluation (Section 8 PRD)
  // =========================================================================
  let wellbeingNeed = SUPPORT_LEVELS.LOW;
  if (grantedTypes.has(CONSENT_TYPES.WELLBEING_CHECKIN)) {
    const checkIns = await CheckIn.find({ studentId }).sort({ dateString: -1 }).limit(14);
    
    if (checkIns.length > 0) {
      const avgStress = checkIns.reduce((acc, c) => acc + c.stress, 0) / checkIns.length;
      const avgSleep = checkIns.reduce((acc, c) => acc + c.sleep, 0) / checkIns.length;
      const avgMood = checkIns.reduce((acc, c) => acc + c.mood, 0) / checkIns.length;

      let consecutiveHighStressCount = 0;
      for (const c of checkIns.slice(0, 5)) {
        if (c.stress >= 4 || c.sleep <= 2 || c.mood <= 2) {
          consecutiveHighStressCount++;
        }
      }

      if (consecutiveHighStressCount >= 3 || avgStress >= 4.0 || avgMood <= 1.8) {
        wellbeingNeed = SUPPORT_LEVELS.HIGH;
        signalsSummary.push({
          category: 'WELLBEING',
          indicator: 'Persistent elevated stress or disrupted sleep across multiple check-ins',
          level: SUPPORT_LEVELS.HIGH
        });
      } else if (avgStress >= 3.2 || avgSleep <= 2.5) {
        wellbeingNeed = SUPPORT_LEVELS.MODERATE;
        signalsSummary.push({
          category: 'WELLBEING',
          indicator: 'Moderate fluctuations in reported mood and energy',
          level: SUPPORT_LEVELS.MODERATE
        });
      } else if (avgStress >= 2.8 || avgMood <= 2.8) {
        wellbeingNeed = SUPPORT_LEVELS.MILD;
        signalsSummary.push({
          category: 'WELLBEING',
          indicator: 'Mild self-reported stress indicators',
          level: SUPPORT_LEVELS.MILD
        });
      }
    }
  }

  // Save or update SupportNeedProfile
  const profile = await SupportNeedProfile.findOneAndUpdate(
    { studentId },
    {
      academicNeed,
      academicScore,
      financialNeed,
      wellbeingNeed,
      activeSignalsSummary: signalsSummary,
      evaluatedAt: new Date()
    },
    { upsert: true, new: true }
  );

  return profile;
};

module.exports = { evaluateStudentSupportNeeds };

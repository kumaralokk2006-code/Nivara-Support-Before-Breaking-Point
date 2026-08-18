const { MODERATION_STATUS } = require('../config/constants');
const { screenInputSafety } = require('./aiService');

const TOXIC_PATTERNS = [
  /kill your/i,
  /hate you/i,
  /die /i,
  /stupid/i,
  /idiot/i,
  /harass/i,
  /abuse/i
];

const screenCirclePost = (content) => {
  // Check crisis signals
  const crisisCheck = screenInputSafety(content);
  if (crisisCheck.isCrisis) {
    return {
      status: MODERATION_STATUS.FLAGGED_HIGH_RISK,
      flags: ['CRISIS_INDICATOR_DETECTED']
    };
  }

  // Check toxic patterns
  const matchedFlags = [];
  for (const pattern of TOXIC_PATTERNS) {
    if (pattern.test(content)) {
      matchedFlags.push('POTENTIAL_HARASSMENT_OR_ABUSE');
      break;
    }
  }

  if (matchedFlags.length > 0) {
    return {
      status: MODERATION_STATUS.PENDING_REVIEW,
      flags: matchedFlags
    };
  }

  return {
    status: MODERATION_STATUS.APPROVED,
    flags: []
  };
};

module.exports = { screenCirclePost };

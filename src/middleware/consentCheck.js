const Consent = require('../models/Consent');

const requireConsent = (consentType) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Authentication required.' });
      }

      const consent = await Consent.findOne({
        userId: req.user._id,
        consentType,
        granted: true
      });

      if (!consent) {
        return res.status(403).json({
          success: false,
          consentRequired: true,
          consentType,
          message: `Student consent for '${consentType}' is required before accessing or submitting this data. Please grant consent in your privacy settings.`
        });
      }

      req.consent = consent;
      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = { requireConsent };

const Consent = require('../models/Consent');
const { logAction } = require('../services/auditService');

const getConsents = async (req, res, next) => {
  try {
    const consents = await Consent.find({ userId: req.user._id });
    res.json({ success: true, consents });
  } catch (error) {
    next(error);
  }
};

const updateConsent = async (req, res, next) => {
  try {
    const { consentType, granted } = req.body;

    const consent = await Consent.findOneAndUpdate(
      { userId: req.user._id, consentType },
      {
        granted,
        grantedAt: granted ? new Date() : undefined,
        revokedAt: !granted ? new Date() : undefined,
        ipAddress: req.ip
      },
      { upsert: true, new: true }
    );

    await logAction({
      userId: req.user._id,
      action: granted ? 'CONSENT_GRANTED' : 'CONSENT_REVOKED',
      resourceType: 'Consent',
      resourceId: consent._id,
      details: { consentType, granted }
    });

    res.json({
      success: true,
      message: `Consent for '${consentType}' updated successfully.`,
      consent
    });
  } catch (error) {
    next(error);
  }
};

const revokeConsent = async (req, res, next) => {
  try {
    const { consentType } = req.params;

    const consent = await Consent.findOneAndUpdate(
      { userId: req.user._id, consentType },
      { granted: false, revokedAt: new Date() },
      { new: true }
    );

    await logAction({
      userId: req.user._id,
      action: 'CONSENT_REVOKED',
      resourceType: 'Consent',
      resourceId: consent ? consent._id : null,
      details: { consentType }
    });

    res.json({
      success: true,
      message: `Consent for '${consentType}' has been revoked. Associated data will be excluded from support evaluations.`,
      consent
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getConsents, updateConsent, revokeConsent };

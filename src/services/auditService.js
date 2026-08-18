const AuditLog = require('../models/AuditLog');

const logAction = async ({ userId, action, resourceType, resourceId, details, ipAddress }) => {
  try {
    return await AuditLog.create({
      userId,
      action,
      resourceType,
      resourceId: resourceId ? String(resourceId) : undefined,
      details,
      ipAddress
    });
  } catch (error) {
    console.error('AuditLog Error:', error.message);
  }
};

module.exports = { logAction };

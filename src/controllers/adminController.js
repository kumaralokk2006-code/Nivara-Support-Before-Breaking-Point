const StudentProfile = require('../models/StudentProfile');
const SupportNeedProfile = require('../models/SupportNeedProfile');
const Appointment = require('../models/Appointment');
const CheckIn = require('../models/CheckIn');
const SupportProgram = require('../models/SupportProgram');
const FairnessMetric = require('../models/FairnessMetric');
const AuditLog = require('../models/AuditLog');
const { runFairnessAudit } = require('../services/fairnessService');

const getDashboardMetrics = async (req, res, next) => {
  try {
    const totalStudents = await StudentProfile.countDocuments();
    const activeNeeds = await SupportNeedProfile.find({});

    const supportDemand = {
      academic: { high: 0, moderate: 0, low: 0 },
      financial: { high: 0, moderate: 0, low: 0 },
      wellbeing: { high: 0, moderate: 0, low: 0 }
    };

    activeNeeds.forEach(n => {
      if (n.academicNeed) supportDemand.academic[n.academicNeed.toLowerCase()]++;
      if (n.financialNeed) supportDemand.financial[n.financialNeed.toLowerCase()]++;
      if (n.wellbeingNeed) supportDemand.wellbeing[n.wellbeingNeed.toLowerCase()]++;
    });

    const totalCheckins = await CheckIn.countDocuments();
    const totalAppointments = await Appointment.countDocuments();

    res.json({
      success: true,
      metrics: {
        totalStudents,
        totalCheckins,
        totalAppointments,
        supportDemand
      }
    });
  } catch (error) {
    next(error);
  }
};

const getDemandAnalytics = async (req, res, next) => {
  try {
    const totalProfiles = await SupportNeedProfile.countDocuments() || 1;
    const academicHigh = await SupportNeedProfile.countDocuments({ academicNeed: 'HIGH' });
    const financialHigh = await SupportNeedProfile.countDocuments({ financialNeed: 'HIGH' });
    const wellbeingHigh = await SupportNeedProfile.countDocuments({ wellbeingNeed: 'HIGH' });

    res.json({
      success: true,
      analytics: {
        proportions: {
          academic: Number(((academicHigh / totalProfiles) * 100).toFixed(1)),
          financial: Number(((financialHigh / totalProfiles) * 100).toFixed(1)),
          wellbeing: Number(((wellbeingHigh / totalProfiles) * 100).toFixed(1))
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

const getFairnessAudit = async (req, res, next) => {
  try {
    let metrics = await FairnessMetric.find({}).sort({ evaluationDate: -1 }).limit(20);
    if (metrics.length === 0) {
      metrics = await runFairnessAudit('department');
    }
    res.json({ success: true, metrics });
  } catch (error) {
    next(error);
  }
};

const triggerFairnessAudit = async (req, res, next) => {
  try {
    const { attribute = 'department' } = req.body;
    const metrics = await runFairnessAudit(attribute);
    res.json({ success: true, message: 'Fairness audit completed successfully', metrics });
  } catch (error) {
    next(error);
  }
};

const createSupportProgram = async (req, res, next) => {
  try {
    const program = await SupportProgram.create(req.body);
    res.status(201).json({ success: true, program });
  } catch (error) {
    next(error);
  }
};

const updateSupportProgram = async (req, res, next) => {
  try {
    const program = await SupportProgram.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, program });
  } catch (error) {
    next(error);
  }
};

const getAuditLogs = async (req, res, next) => {
  try {
    const logs = await AuditLog.find({}).sort({ timestamp: -1 }).limit(50);
    res.json({ success: true, logs });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardMetrics,
  getDemandAnalytics,
  getFairnessAudit,
  triggerFairnessAudit,
  createSupportProgram,
  updateSupportProgram,
  getAuditLogs
};

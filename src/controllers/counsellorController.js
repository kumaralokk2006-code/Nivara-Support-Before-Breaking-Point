const CounsellorProfile = require('../models/CounsellorProfile');
const Appointment = require('../models/Appointment');
const SessionNote = require('../models/SessionNote');
const SupportNeedProfile = require('../models/SupportNeedProfile');
const { logAction } = require('../services/auditService');

const listCounsellors = async (req, res, next) => {
  try {
    const { specialization } = req.query;
    const query = { isActive: true };
    if (specialization) {
      query.specializations = specialization;
    }
    const counsellors = await CounsellorProfile.find(query).populate('userId', 'email');
    res.json({ success: true, counsellors });
  } catch (error) {
    next(error);
  }
};

const getCounsellorById = async (req, res, next) => {
  try {
    const counsellor = await CounsellorProfile.findById(req.params.id).populate('userId', 'email');
    if (!counsellor) {
      return res.status(404).json({ success: false, message: 'Counsellor not found' });
    }
    res.json({ success: true, counsellor });
  } catch (error) {
    next(error);
  }
};

const getDashboard = async (req, res, next) => {
  try {
    const counsellorId = req.user._id;
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const todaySessions = await Appointment.find({
      counsellorId,
      dateTime: { $gte: todayStart, $lte: todayEnd },
      status: 'ACCEPTED'
    }).populate('studentId', 'email');

    const pendingRequests = await Appointment.find({
      counsellorId,
      status: 'REQUESTED'
    }).populate('studentId', 'email');

    const followUps = await Appointment.find({
      counsellorId,
      status: 'FOLLOW_UP'
    }).populate('studentId', 'email');

    res.json({
      success: true,
      dashboard: {
        todaySessions,
        pendingRequests,
        followUps
      }
    });
  } catch (error) {
    next(error);
  }
};

const saveSessionNote = async (req, res, next) => {
  try {
    const { appointmentId, studentId, content, actionItems, followUpRecommended } = req.body;

    const note = await SessionNote.findOneAndUpdate(
      { appointmentId },
      {
        counsellorId: req.user._id,
        studentId,
        content,
        actionItems,
        followUpRecommended
      },
      { upsert: true, new: true }
    );

    await logAction({
      userId: req.user._id,
      action: 'NOTE_CREATED',
      resourceType: 'SessionNote',
      resourceId: note._id
    });

    res.status(201).json({ success: true, message: 'Private session note saved', note });
  } catch (error) {
    next(error);
  }
};

const getSessionNote = async (req, res, next) => {
  try {
    const note = await SessionNote.findOne({
      appointmentId: req.params.appointmentId,
      counsellorId: req.user._id
    });

    if (!note) {
      return res.status(404).json({ success: false, message: 'Session note not found or access denied' });
    }

    res.json({ success: true, note });
  } catch (error) {
    next(error);
  }
};

module.exports = { listCounsellors, getCounsellorById, getDashboard, saveSessionNote, getSessionNote };

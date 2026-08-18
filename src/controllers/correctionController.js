const CorrectionRequest = require('../models/CorrectionRequest');
const StudentProfile = require('../models/StudentProfile');
const { logAction } = require('../services/auditService');
const { createNotification } = require('../services/notificationService');

const submitRequest = async (req, res, next) => {
  try {
    const studentId = req.user._id;
    const { fieldCategory, fieldName, currentValue, requestedValue, justification } = req.body;

    const correction = await CorrectionRequest.create({
      studentId,
      fieldCategory,
      fieldName,
      currentValue,
      requestedValue,
      justification
    });

    await logAction({
      userId: studentId,
      action: 'CORRECTION_SUBMITTED',
      resourceType: 'CorrectionRequest',
      resourceId: correction._id,
      details: { fieldName, requestedValue }
    });

    res.status(201).json({
      success: true,
      message: 'Data correction request submitted for institutional review.',
      correction
    });
  } catch (error) {
    next(error);
  }
};

const getStudentRequests = async (req, res, next) => {
  try {
    const requests = await CorrectionRequest.find({ studentId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, requests });
  } catch (error) {
    next(error);
  }
};

const getAllAdminRequests = async (req, res, next) => {
  try {
    const requests = await CorrectionRequest.find({}).populate('studentId', 'email').sort({ createdAt: -1 });
    res.json({ success: true, requests });
  } catch (error) {
    next(error);
  }
};

const reviewRequest = async (req, res, next) => {
  try {
    const { status, reviewNotes } = req.body;
    const correction = await CorrectionRequest.findById(req.params.id);

    if (!correction) {
      return res.status(404).json({ success: false, message: 'Correction request not found' });
    }

    correction.status = status;
    correction.reviewedBy = req.user._id;
    correction.reviewNotes = reviewNotes;
    await correction.save();

    // If approved, update student profile if applicable
    if (status === 'APPROVED') {
      const updateData = {};
      if (['name', 'course', 'year', 'department'].includes(correction.fieldName)) {
        updateData[correction.fieldName] = correction.requestedValue;
        await StudentProfile.findOneAndUpdate({ userId: correction.studentId }, updateData);
      }
    }

    await logAction({
      userId: req.user._id,
      action: 'CORRECTION_RESOLVED',
      resourceType: 'CorrectionRequest',
      resourceId: correction._id,
      details: { status, reviewNotes }
    });

    await createNotification({
      userId: correction.studentId,
      title: 'Correction Request Update',
      message: `Your data correction request for '${correction.fieldName}' has been ${status.toLowerCase()}.`,
      type: 'CORRECTION_STATUS'
    });

    res.json({ success: true, message: `Correction request ${status.toLowerCase()}.`, correction });
  } catch (error) {
    next(error);
  }
};

module.exports = { submitRequest, getStudentRequests, getAllAdminRequests, reviewRequest };

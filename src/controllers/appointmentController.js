const Appointment = require('../models/Appointment');
const { createNotification } = require('../services/notificationService');

const bookAppointment = async (req, res, next) => {
  try {
    const studentId = req.user._id;
    const { counsellorId, dateTime, modality = 'ONLINE', reasonCategory = 'WELLBEING', studentNotes } = req.body;

    const appointment = await Appointment.create({
      studentId,
      counsellorId,
      dateTime,
      modality,
      reasonCategory,
      studentNotes,
      status: 'REQUESTED'
    });

    await createNotification({
      userId: counsellorId,
      title: 'New Appointment Request',
      message: `A student has requested a counselling session on ${new Date(dateTime).toLocaleDateString()}.`,
      type: 'APPOINTMENT_UPDATE'
    });

    res.status(201).json({
      success: true,
      message: 'Appointment requested successfully. Counsellor will review.',
      appointment
    });
  } catch (error) {
    next(error);
  }
};

const listAppointments = async (req, res, next) => {
  try {
    const query = req.user.role === 'STUDENT' ? { studentId: req.user._id } : { counsellorId: req.user._id };
    const appointments = await Appointment.find(query)
      .populate('studentId', 'email')
      .populate('counsellorId', 'email')
      .sort({ dateTime: -1 });

    res.json({ success: true, appointments });
  } catch (error) {
    next(error);
  }
};

const getAppointmentById = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('studentId', 'email')
      .populate('counsellorId', 'email');

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    res.json({ success: true, appointment });
  } catch (error) {
    next(error);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    const { status, followUpDate } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    appointment.status = status;
    if (followUpDate) appointment.followUpDate = followUpDate;
    await appointment.save();

    await createNotification({
      userId: appointment.studentId,
      title: 'Appointment Status Updated',
      message: `Your counselling appointment status is now '${status}'.`,
      type: 'APPOINTMENT_UPDATE'
    });

    res.json({ success: true, message: 'Appointment status updated', appointment });
  } catch (error) {
    next(error);
  }
};

const scheduleFollowUp = async (req, res, next) => {
  try {
    const { followUpDate } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    appointment.status = 'FOLLOW_UP';
    appointment.followUpDate = followUpDate;
    await appointment.save();

    res.json({ success: true, message: 'Follow-up scheduled', appointment });
  } catch (error) {
    next(error);
  }
};

module.exports = { bookAppointment, listAppointments, getAppointmentById, updateStatus, scheduleFollowUp };

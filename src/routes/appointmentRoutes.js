const express = require('express');
const router = express.Router();
const { bookAppointment, listAppointments, getAppointmentById, updateStatus, scheduleFollowUp } = require('../controllers/appointmentController');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);
router.post('/', bookAppointment);
router.get('/', listAppointments);
router.get('/:id', getAppointmentById);
router.put('/:id/status', updateStatus);
router.post('/:id/follow-up', scheduleFollowUp);

module.exports = router;

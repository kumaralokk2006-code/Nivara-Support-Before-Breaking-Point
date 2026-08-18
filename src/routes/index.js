const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const consentRoutes = require('./consentRoutes');
const studentRoutes = require('./studentRoutes');
const checkinRoutes = require('./checkinRoutes');
const academicRoutes = require('./academicRoutes');
const financialRoutes = require('./financialRoutes');
const recommendationRoutes = require('./recommendationRoutes');
const counsellorRoutes = require('./counsellorRoutes');
const appointmentRoutes = require('./appointmentRoutes');
const aiRoutes = require('./aiRoutes');
const supportCircleRoutes = require('./supportCircleRoutes');
const correctionRoutes = require('./correctionRoutes');
const adminRoutes = require('./adminRoutes');
const supportNeedRoutes = require('./supportNeedRoutes');

router.use('/auth', authRoutes);
router.use('/consent', consentRoutes);
router.use('/student', studentRoutes);
router.use('/checkins', checkinRoutes);
router.use('/academic-support', academicRoutes);
router.use('/academic', academicRoutes);
router.use('/financial-support', financialRoutes);
router.use('/support-needs', supportNeedRoutes);
router.use('/recommendations', recommendationRoutes);
router.use('/counsellors', counsellorRoutes);
router.use('/counsellor', counsellorRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/ai', aiRoutes);
router.use('/support-circles', supportCircleRoutes);
router.use('/profile', correctionRoutes);
router.use('/admin', adminRoutes);

router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'Nivara Early Student Support Backend',
    version: '2.1.0',
    timestamp: new Date()
  });
});

module.exports = router;

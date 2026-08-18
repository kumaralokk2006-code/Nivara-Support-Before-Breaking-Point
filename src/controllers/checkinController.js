const CheckIn = require('../models/CheckIn');
const { generateRecommendationsForStudent } = require('../services/recommendationEngine');

const submitCheckIn = async (req, res, next) => {
  try {
    const studentId = req.user._id;
    const { mood, stress, sleep, energy, academicPressure, notes, dateString } = req.body;
    const todayStr = dateString || new Date().toISOString().split('T')[0];

    const checkIn = await CheckIn.findOneAndUpdate(
      { studentId, dateString: todayStr },
      {
        mood: Number(mood),
        stress: Number(stress),
        sleep: Number(sleep),
        energy: Number(energy),
        academicPressure: Number(academicPressure),
        notes
      },
      { upsert: true, new: true }
    );

    // Refresh support recommendations
    try {
      await generateRecommendationsForStudent(studentId);
    } catch (err) {
      // Non-blocking recommendation generation error
    }

    res.status(201).json({
      success: true,
      message: 'Check-in recorded successfully. Thank you for taking a moment for yourself today.',
      checkIn
    });
  } catch (error) {
    next(error);
  }
};

const getTodayStatus = async (req, res, next) => {
  try {
    const studentId = req.user._id;
    const todayStr = new Date().toISOString().split('T')[0];
    const checkIn = await CheckIn.findOne({ studentId, dateString: todayStr });
    res.json({
      success: true,
      completed: !!checkIn,
      checkIn: checkIn || null
    });
  } catch (error) {
    next(error);
  }
};

const getHistory = async (req, res, next) => {
  try {
    const studentId = req.user._id;
    const { limit = 30 } = req.query;
    const history = await CheckIn.find({ studentId }).sort({ dateString: -1 }).limit(Number(limit));
    res.json({ success: true, history });
  } catch (error) {
    next(error);
  }
};

module.exports = { submitCheckIn, getTodayStatus, getHistory };

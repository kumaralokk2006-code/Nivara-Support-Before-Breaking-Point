const mongoose = require('mongoose');

const academicSignalSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true
  },
  attendancePercentage: {
    type: Number,
    min: 0,
    max: 100,
    default: 85
  },
  attendanceTrend: {
    type: String,
    enum: ['STABLE', 'DECLINING', 'IMPROVING', 'UNKNOWN'],
    default: 'STABLE'
  },
  marksTrend: {
    type: String,
    enum: ['STABLE', 'DECLINING', 'IMPROVING', 'UNKNOWN'],
    default: 'STABLE'
  },
  overdueAssignmentsCount: {
    type: Number,
    min: 0,
    default: 0
  },
  academicStress: {
    type: Number,
    min: 1,
    max: 5,
    default: 1
  },
  examPressure: {
    type: Number,
    min: 1,
    max: 5,
    default: 1
  },
  studentRequestedHelp: {
    type: Boolean,
    default: false
  },
  placementAnxiety: {
    type: Boolean,
    default: false
  },
  assignmentChallenges: {
    type: Boolean,
    default: false
  },
  subjectDifficulty: [{
    type: String,
    trim: true
  }]
}, { timestamps: true });

module.exports = mongoose.model('AcademicSignal', academicSignalSchema);

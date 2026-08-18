const mongoose = require('mongoose');
const { SUPPORT_CATEGORIES } = require('../config/constants');

const supportProgramSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    enum: Object.values(SUPPORT_CATEGORIES),
    required: true,
    index: true
  },
  subCategory: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  eligibilityCriteria: {
    targetDifficulty: [String],
    targetExpenses: [String],
    targetAidStatus: [String],
    targetAcademicIssues: [String]
  },
  applicationLink: {
    type: String,
    default: ''
  },
  providerDepartment: {
    type: String,
    default: 'Campus Support'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('SupportProgram', supportProgramSchema);

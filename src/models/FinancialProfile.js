const mongoose = require('mongoose');
const { FINANCIAL_DIFFICULTY, EXPENSE_CATEGORIES, AID_STATUS } = require('../config/constants');

const financialProfileSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true
  },
  feeDifficulty: {
    type: String,
    enum: Object.values(FINANCIAL_DIFFICULTY),
    default: FINANCIAL_DIFFICULTY.NONE
  },
  expenseCategories: [{
    type: String,
    enum: Object.values(EXPENSE_CATEGORIES)
  }],
  currentAidStatus: {
    type: String,
    enum: Object.values(AID_STATUS),
    default: AID_STATUS.NOT_RECEIVING
  },
  supportPreferences: [{
    type: String,
    trim: true
  }]
}, { timestamps: true });

module.exports = mongoose.model('FinancialProfile', financialProfileSchema);

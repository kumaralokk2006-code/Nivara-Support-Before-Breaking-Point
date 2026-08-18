const mongoose = require('mongoose');

const fairnessMetricSchema = new mongoose.Schema({
  evaluationDate: {
    type: Date,
    default: Date.now,
    index: true
  },
  attributeAudited: {
    type: String,
    required: true
  },
  groupLabel: {
    type: String,
    required: true
  },
  sampleSize: {
    type: Number,
    required: true
  },
  recommendationRate: {
    type: Number,
    required: true
  },
  selectionRate: {
    type: Number,
    required: true
  },
  disparateImpactRatio: {
    type: Number,
    required: true
  },
  disparityFlag: {
    type: Boolean,
    default: false
  },
  insufficientDataFlag: {
    type: Boolean,
    default: false
  },
  notes: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('FairnessMetric', fairnessMetricSchema);

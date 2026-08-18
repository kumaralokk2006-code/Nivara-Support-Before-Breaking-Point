const StudentProfile = require('../models/StudentProfile');
const Recommendation = require('../models/Recommendation');
const FairnessMetric = require('../models/FairnessMetric');

/**
 * PS-29 Fairness & Bias Monitoring Service
 * Audits support recommendation distributions across demographic cohorts.
 * Applies the 80% four-fifths rule strictly as an AUDIT INDICATOR (not an automated legal verdict).
 * Flags small sample sizes (N < 30) with insufficientDataFlag.
 */
const runFairnessAudit = async (attributeName = 'department') => {
  const students = await StudentProfile.find({});
  if (students.length === 0) return [];

  // Group students by audited attribute
  const groups = {};
  for (const s of students) {
    const key = s[attributeName] || 'Unknown';
    if (!groups[key]) groups[key] = { total: 0, studentIds: [] };
    groups[key].total++;
    groups[key].studentIds.push(s.userId);
  }

  // Calculate recommendation rates per group
  const results = [];
  let maxRate = 0;

  for (const [groupLabel, data] of Object.entries(groups)) {
    const recCount = await Recommendation.countDocuments({
      studentId: { $in: data.studentIds }
    });

    const uniqueStudentsRecommended = (await Recommendation.distinct('studentId', {
      studentId: { $in: data.studentIds }
    })).length;

    const rate = data.total > 0 ? (uniqueStudentsRecommended / data.total) : 0;
    if (rate > maxRate) maxRate = rate;

    results.push({
      attributeAudited: attributeName,
      groupLabel,
      sampleSize: data.total,
      recommendationRate: Number(rate.toFixed(3)),
      selectionRate: Number((recCount / (data.total || 1)).toFixed(3)),
      insufficientDataFlag: data.total < 30
    });
  }

  // Calculate Disparate Impact Ratio against highest group rate
  const benchmarkRate = maxRate > 0 ? maxRate : 1;
  const auditRecords = [];

  for (const item of results) {
    const disparateImpactRatio = benchmarkRate > 0 ? Number((item.recommendationRate / benchmarkRate).toFixed(3)) : 1.0;
    // 80% rule: ratio < 0.80 triggers disparity audit flag
    const disparityFlag = !item.insufficientDataFlag && disparateImpactRatio < 0.80;

    let notes = 'Fairness metrics within monitored range.';
    if (item.insufficientDataFlag) {
      notes = `Sample size (N=${item.sampleSize}) is too small for definitive audit conclusions. Monitored for baseline trend only.`;
    } else if (disparityFlag) {
      notes = `Potential support disparity detected (${(disparateImpactRatio * 100).toFixed(1)}% of benchmark). Recommended for human institutional review. Support is not automatically altered.`;
    }

    const metric = await FairnessMetric.create({
      attributeAudited: item.attributeAudited,
      groupLabel: item.groupLabel,
      sampleSize: item.sampleSize,
      recommendationRate: item.recommendationRate,
      selectionRate: item.selectionRate,
      disparateImpactRatio,
      disparityFlag,
      insufficientDataFlag: item.insufficientDataFlag,
      notes
    });

    auditRecords.push(metric);
  }

  return auditRecords;
};

module.exports = { runFairnessAudit };

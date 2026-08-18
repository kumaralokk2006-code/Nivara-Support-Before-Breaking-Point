const SupportCircle = require('../models/SupportCircle');
const CircleMember = require('../models/CircleMember');
const CirclePost = require('../models/CirclePost');
const { screenCirclePost } = require('../services/moderationService');

const listCircles = async (req, res, next) => {
  try {
    const circles = await SupportCircle.find({ activeUntil: { $gte: new Date() } });
    res.json({ success: true, circles });
  } catch (error) {
    next(error);
  }
};

const createCircle = async (req, res, next) => {
  try {
    const { name, category, description, maxMembers = 30, activeUntil } = req.body;
    const circle = await SupportCircle.create({
      name,
      category,
      description,
      maxMembers,
      activeUntil: activeUntil || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    });
    res.status(201).json({ success: true, circle });
  } catch (error) {
    next(error);
  }
};

const getCircleById = async (req, res, next) => {
  try {
    const circle = await SupportCircle.findById(req.params.id);
    if (!circle) {
      return res.status(404).json({ success: false, message: 'Support circle not found' });
    }

    const posts = await CirclePost.find({ circleId: circle._id, moderationStatus: 'APPROVED' }).sort({ createdAt: -1 });
    const isMember = !!(await CircleMember.findOne({ circleId: circle._id, studentId: req.user._id }));

    res.json({ success: true, circle, posts, isMember });
  } catch (error) {
    next(error);
  }
};

const joinCircle = async (req, res, next) => {
  try {
    const circleId = req.params.id;
    const studentId = req.user._id;

    const circle = await SupportCircle.findById(circleId);
    if (!circle) {
      return res.status(404).json({ success: false, message: 'Circle not found' });
    }

    const existing = await CircleMember.findOne({ circleId, studentId });
    if (existing) {
      return res.json({ success: true, message: 'Already a member of this circle' });
    }

    if (circle.memberCount >= circle.maxMembers) {
      return res.status(400).json({ success: false, message: 'Circle has reached maximum capacity.' });
    }

    await CircleMember.create({ circleId, studentId });
    circle.memberCount += 1;
    await circle.save();

    res.json({ success: true, message: 'Joined support circle successfully' });
  } catch (error) {
    next(error);
  }
};

const leaveCircle = async (req, res, next) => {
  try {
    const circleId = req.params.id;
    const studentId = req.user._id;

    await CircleMember.findOneAndDelete({ circleId, studentId });
    await SupportCircle.findByIdAndUpdate(circleId, { $inc: { memberCount: -1 } });

    res.json({ success: true, message: 'Left support circle successfully' });
  } catch (error) {
    next(error);
  }
};

const createPost = async (req, res, next) => {
  try {
    const circleId = req.params.id;
    const { content } = req.body;

    const screening = screenCirclePost(content);

    const post = await CirclePost.create({
      circleId,
      authorStudentId: req.user._id,
      content,
      moderationStatus: screening.status,
      moderationFlags: screening.flags
    });

    let message = 'Post shared with peer circle.';
    if (screening.status === 'PENDING_REVIEW') {
      message = 'Post held for moderator review to ensure a safe peer environment.';
    } else if (screening.status === 'FLAGGED_HIGH_RISK') {
      message = 'Post contains critical distress signals. Campus support has been notified to assist.';
    }

    res.status(201).json({
      success: true,
      message,
      post: {
        id: post._id,
        content: post.content,
        moderationStatus: post.moderationStatus,
        createdAt: post.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { listCircles, createCircle, getCircleById, joinCircle, leaveCircle, createPost };

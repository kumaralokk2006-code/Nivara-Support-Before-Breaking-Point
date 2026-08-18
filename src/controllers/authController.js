const jwt = require('jsonwebtoken');
const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const CounsellorProfile = require('../models/CounsellorProfile');
const Consent = require('../models/Consent');
const { ROLES, CONSENT_TYPES } = require('../config/constants');
const { logAction } = require('../services/auditService');

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role, email: user.email },
    process.env.JWT_SECRET || 'nivara_super_secret_jwt_key_sih_2026_ps29',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

const register = async (req, res, next) => {
  try {
    const { email, password, role = ROLES.STUDENT, name, course, year, department, title, specializations } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
    }

    const user = await User.create({
      email,
      passwordHash: password,
      role
    });

    if (role === ROLES.STUDENT) {
      await StudentProfile.create({
        userId: user._id,
        name: name || 'Student',
        course: course || 'B.Tech Computer Science',
        year: year || 1,
        department: department || 'Engineering'
      });

      // Default baseline consent configuration (opted in for wellbeing, optional for others)
      await Consent.create({
        userId: user._id,
        consentType: CONSENT_TYPES.WELLBEING_CHECKIN,
        granted: true,
        grantedAt: new Date()
      });
      await Consent.create({
        userId: user._id,
        consentType: CONSENT_TYPES.FINANCIAL_MATCHING,
        granted: false
      });
      await Consent.create({
        userId: user._id,
        consentType: CONSENT_TYPES.ACADEMIC_INTEGRATION,
        granted: true,
        grantedAt: new Date()
      });
    } else if (role === ROLES.COUNSELLOR) {
      await CounsellorProfile.create({
        userId: user._id,
        name: name || 'Counsellor',
        title: title || 'Campus Counsellor',
        specializations: specializations || ['Academic', 'Wellbeing']
      });
    }

    const token = generateToken(user);
    await logAction({ userId: user._id, action: 'USER_REGISTERED', resourceType: 'User', resourceId: user._id });

    res.status(201).json({
      success: true,
      message: 'Account registered successfully',
      token,
      user: { id: user._id, email: user.email, role: user.role }
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user);
    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: { id: user._id, email: user.email, role: user.role }
    });
  } catch (error) {
    next(error);
  }
};

const me = async (req, res, next) => {
  try {
    let profile = null;
    if (req.user.role === ROLES.STUDENT) {
      profile = await StudentProfile.findOne({ userId: req.user._id });
    } else if (req.user.role === ROLES.COUNSELLOR) {
      profile = await CounsellorProfile.findOne({ userId: req.user._id });
    }

    res.json({
      success: true,
      user: req.user,
      profile
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
};

module.exports = { register, login, me, logout };

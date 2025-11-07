const User = require('../models/User.model');

// @desc    Get user profile
// @route   GET /api/users/:id
// @access  Public
exports.getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('createdEvents')
      .populate('registeredEvents');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone, profileImage } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, phone, profileImage },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's created events
// @route   GET /api/users/my-events
// @access  Private
exports.getMyEvents = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('createdEvents');

    res.status(200).json({
      success: true,
      data: user.createdEvents
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's registered events
// @route   GET /api/users/registered-events
// @access  Private
exports.getRegisteredEvents = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('registeredEvents');

    res.status(200).json({
      success: true,
      data: user.registeredEvents
    });
  } catch (error) {
    next(error);
  }
};

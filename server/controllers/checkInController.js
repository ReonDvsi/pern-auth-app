const CheckIn = require('../models/checkInModel');
const Site = require('../models/siteModel');

const checkIn = async (req, res) => {
  try {
    const { siteId, reasonForVisit } = req.body;
    const userId = req.user.id;

    // Check if user already has an active check-in
    const activeCheckIn = await CheckIn.findActiveByUserId(userId);
    if (activeCheckIn) {
      return res.status(400).json({ message: 'You already have an active check-in' });
    }

    // Create the check-in
    const checkInRecord = await CheckIn.create(userId, siteId, reasonForVisit);
    
    // Get site details for real-time update
    const site = await Site.findById(siteId);
    
    // Get the complete check-in data with user and site info
    const completeCheckIn = await CheckIn.findActiveByUserId(userId);
    
    // Emit socket event for real-time updates with complete data
    if (req.io) {
      req.io.emit('newCheckIn', {
        id: completeCheckIn.id,
        user_id: completeCheckIn.user_id,
        site_id: completeCheckIn.site_id,
        check_in_time: completeCheckIn.check_in_time,
        reason_for_visit: completeCheckIn.reason_for_visit,
        status: completeCheckIn.status,
        // User info
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        // Site info
        site_name: site.name,
        latitude: site.latitude,
        longitude: site.longitude,
        // Duration
        duration_seconds: 0
      });
    }

    res.status(201).json(checkInRecord);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getActiveCheckIn = async (req, res) => {
  try {
    const userId = req.user.id;
    const activeCheckIn = await CheckIn.findActiveByUserId(userId);
    res.json(activeCheckIn);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const checkOut = async (req, res) => {
  try {
    const { checkInId, feedback } = req.body;
    const userId = req.user.id;

    // Verify the check-in belongs to the user
    const activeCheckIn = await CheckIn.findActiveByUserId(userId);
    if (!activeCheckIn || activeCheckIn.id !== checkInId) {
      return res.status(404).json({ message: 'Active check-in not found' });
    }

    const checkOutRecord = await CheckIn.checkOut(checkInId, feedback);
    
    // Emit socket event for real-time updates
    if (req.io) {
      req.io.emit('checkOut', {
        checkInId: checkInId,
        userId: userId
      });
    }

    res.json(checkOutRecord);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getAllActiveCheckIns = async (req, res) => {
  try {
    const activeCheckIns = await CheckIn.findAllActive();
    res.json(activeCheckIns);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getAllCompletedCheckIns = async (req, res) => {
  try {
    const completedCheckIns = await CheckIn.findAllCompleted();
    res.json(completedCheckIns);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  checkIn,
  getActiveCheckIn,
  checkOut,
  getAllActiveCheckIns,
  getAllCompletedCheckIns
};
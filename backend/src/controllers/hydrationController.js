const HydrationLog = require('../models/HydrationLog');
const HydrationGoal = require('../models/HydrationGoal');

// GET /api/hydration/today
const getTodayHydration = async (req, res) => {
  try {
    const userId = req.user.id;

    // Bugünün başı ve sonu
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // Bugünkü logları getir
    const logs = await HydrationLog.find({
      userId,
      loggedAt: { $gte: startOfDay, $lte: endOfDay },
    }).sort({ loggedAt: -1 });

    // Toplam içilen su
    const totalMl = logs.reduce((sum, log) => sum + log.amountMl, 0);

    // Günlük hedef
    const goal = await HydrationGoal.findOne({ userId });
    const dailyGoalMl = goal ? goal.dailyGoalMl : 2500;

    res.status(200).json({
      success: true,
      data: {
        totalMl,
        dailyGoalMl,
        remainingMl: Math.max(0, dailyGoalMl - totalMl),
        percentage: Math.min(100, Math.round((totalMl / dailyGoalMl) * 100)),
        logs,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/hydration/logs?date=2026-03-30
const getLogsByDate = async (req, res) => {
  try {
    const userId = req.user.id;
    const { date } = req.query;

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const logs = await HydrationLog.find({
      userId,
      loggedAt: { $gte: startOfDay, $lte: endOfDay },
    }).sort({ loggedAt: -1 });

    const totalMl = logs.reduce((sum, log) => sum + log.amountMl, 0);

    res.status(200).json({
      success: true,
      data: { date, totalMl, logs },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/hydration/logs
const addHydrationLog = async (req, res) => {
  try {
    const userId = req.user.id;
    const { amountMl, note } = req.body;

    const log = await HydrationLog.create({ userId, amountMl, note });

    res.status(201).json({
      success: true,
      message: 'Water intake logged successfully.',
      data: { log },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getTodayHydration, getLogsByDate, addHydrationLog };
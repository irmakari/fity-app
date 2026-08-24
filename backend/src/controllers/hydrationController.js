const { supabase } = require('../config/db');

const mapHydrationLog = (row) => {
  if (!row) return null;
  return {
    _id: row.id,
    id: row.id,
    userId: row.user_id,
    amountMl: Number(row.amount_ml),
    date: row.date,
    loggedAt: row.created_at,
    createdAt: row.created_at,
  };
};

const getTodayHydration = async (req, res) => {
  try {
    const userId = req.user.id;
    const todayStr = new Date().toISOString().split('T')[0];

    const { data: logRows, error } = await supabase
      .from('hydration_logs')
      .select('*')
      .eq('user_id', userId)
      .eq('date', todayStr)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ success: false, message: error.message });
    }

    const logs = (logRows || []).map(mapHydrationLog);
    const totalMl = logs.reduce((sum, log) => sum + log.amountMl, 0);

    const { data: goalRow } = await supabase
      .from('hydration_goals')
      .select('daily_target_ml')
      .eq('user_id', userId)
      .maybeSingle();

    const dailyGoalMl = goalRow ? Number(goalRow.daily_target_ml) : 2500;

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

const getLogsByDate = async (req, res) => {
  try {
    const userId = req.user.id;
    const { date } = req.query;

    const dateStr = date ? new Date(date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];

    const { data: logRows, error } = await supabase
      .from('hydration_logs')
      .select('*')
      .eq('user_id', userId)
      .eq('date', dateStr)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ success: false, message: error.message });
    }

    const logs = (logRows || []).map(mapHydrationLog);
    const totalMl = logs.reduce((sum, log) => sum + log.amountMl, 0);

    res.status(200).json({
      success: true,
      data: { date: dateStr, totalMl, logs },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const addHydrationLog = async (req, res) => {
  try {
    const userId = req.user.id;
    const { amountMl, date } = req.body;

    const dateStr = date ? new Date(date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];

    const { data: newRow, error } = await supabase
      .from('hydration_logs')
      .insert([
        {
          user_id: userId,
          amount_ml: amountMl,
          date: dateStr,
        },
      ])
      .select()
      .single();

    if (error || !newRow) {
      return res.status(500).json({ success: false, message: error?.message || 'Database insert failed' });
    }

    res.status(201).json({
      success: true,
      message: 'Water intake logged successfully.',
      data: { log: mapHydrationLog(newRow) },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getTodayHydration, getLogsByDate, addHydrationLog };
const Activity = require("../models/activityModel");

exports.getHistory = async (req, res) => {
  try {
    const history = await Activity.find({
      user: req.user.id,
    })
      .sort({
        createdAt: -1,
      })
      .limit(100);

    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching history",
      error: error.message,
    });
  }
};

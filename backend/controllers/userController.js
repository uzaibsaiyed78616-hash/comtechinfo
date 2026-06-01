import User from "../models/User.js";

export const getCredits = async (req, res) => {
  const { userId } = req.query;

  const user = await User.findById(userId);

  res.json({
    credits: user.credits
  });
};
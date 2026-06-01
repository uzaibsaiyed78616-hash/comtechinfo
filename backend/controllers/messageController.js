import Message from "../models/Message.js";
import User from "../models/User.js";
import { sessions } from "../server.js";

export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id; 
    
    // 1. User-specific messages count
    const sentCount = await Message.countDocuments({ userId, status: "sent" });
    const failedCount = await Message.countDocuments({ userId, status: "failed" });
    
    // 2. Fetch Latest History for Table (Latest 10)
    const history = await Message.find({ userId })
      .sort({ createdAt: -1 })
      .limit(10);
    
    // 3. User credits from DB
    const user = await User.findById(userId);

    res.json({ 
      success: true, 
      stats: { 
        credits: user ? user.credits : 0,
        sent: sentCount, 
        failed: failedCount,
        history: history // Frontend table ke liye
      } 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Stats error" });
  }
};

export const sendMessage = async (req, res) => {
  const { number, message } = req.body;
  const userId = req.user.id;

  try {
    const session = sessions.get(userId);

    if (!session || !session.ready) {
      return res.status(400).json({ 
        success: false, 
        message: "WhatsApp isn't connected. Go to the Devices page and scan the code!" 
      });
    }

    const user = await User.findById(userId);
    if (!user || user.credits <= 0) {
      return res.status(400).json({ success: false, message: "Credits are exhausted!" });
    }

    if (!number || !message) {
      return res.status(400).json({ success: false, message: "Number or Message missing!" });
    }

    let cleanNumber = number.toString().replace(/\D/g, ''); 
    if (cleanNumber.length === 10) {
      cleanNumber = '91' + cleanNumber;
    }

    const chatId = `${cleanNumber}@c.us`;

    await session.client.sendMessage(chatId, message);

    const newMessage = new Message({
      userId,
      number: cleanNumber,
      message,
      status: "sent" 
    });
    await newMessage.save();

    user.credits -= 1;
    await user.save();

    res.status(200).json({ success: true, message: "Message sent via WhatsApp!" });

  } catch (err) {
    const failedMsg = new Message({
      userId,
      number,
      message,
      status: "failed"
    });
    await failedMsg.save();
    res.status(500).json({ success: false, error: err.message });
  }
};
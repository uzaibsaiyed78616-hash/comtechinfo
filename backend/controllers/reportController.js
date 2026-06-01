import Message from "../models/Message.js";

// GET Reports with Filters
export const getReport = async (req, res) => {
  try {
    const userId = req.user.id;
    const { search, status } = req.query;

    let query = { userId };

    if (search && search.trim() !== "") {
      query.$or = [
        { number: { $regex: search, $options: "i" } },
        { message: { $regex: search, $options: "i" } }
      ];
    }

    if (status && status !== "All Status") {
      query.status = status.toLowerCase();
    }

    const reports = await Message.find(query).sort({ createdAt: -1 });
    res.json({ success: true, reports });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// DELETE Report (Rakha hai API ke liye, frontend se link hata diya hai)
export const deleteReport = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Message.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Record not found!" });
    }

    res.json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
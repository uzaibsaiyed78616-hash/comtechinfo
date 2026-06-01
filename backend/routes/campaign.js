import express from "express";
import axios from "axios";

const router = express.Router();

// SINGLE SEND
router.post("/send-msg", async (req, res) => {
  const { number, message } = req.body;

  const response = await axios.get(
    `https://int.chatway.in/api/send-msg?username=test@gmail.com&number=91${number}&message=${encodeURIComponent(message)}&token=YOUR_TOKEN`
  );

  res.json({ status: "sent", response: response.data });
});


// BULK SEND
router.post("/send-bulk", async (req, res) => {
  const { numbers, message } = req.body;

  let results = [];

  for (let num of numbers) {

    const resp = await axios.get(
      `https://int.chatway.in/api/send-msg?username=test@gmail.com&number=91${num}&message=${encodeURIComponent(message)}&token=YOUR_TOKEN`
    );

    results.push({ num, status: "sent" });
  }

  res.json({ success: true, results });
});

export default router;
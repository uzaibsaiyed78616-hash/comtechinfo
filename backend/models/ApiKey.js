import mongoose from "mongoose";

const apiKeySchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  apiKey: String
});

export default mongoose.model("ApiKey", apiKeySchema);
import mongoose from "mongoose";

// Naya database naam: chatway_saas
const MONGO_URI = "mongodb://localhost:27017/chatway_saas"; 

mongoose.connect(MONGO_URI)
  .then(() => console.log("Chatway DB Connected!"))
  .catch((err) => console.log("Connection Error: ", err));

export default mongoose;
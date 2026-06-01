import jwt from "jsonwebtoken";

export const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ message: "Access Denied: No Token Provided" });
    }

    const decoded = jwt.verify(token, "SECRET_KEY_123");
    req.user = decoded; // Isme id aur role dono 
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid Token" });
  }
};

//  Naya middleware sirf Admin ke liye
export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: "Only for Admin User!" });
  }
};
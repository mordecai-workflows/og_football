import jwt from "jsonwebtoken";

//middware to extract user id from token
export const extractUserId = (req, res, next) => {
  console.log("extractUserId middleware called");
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
    req.user = decoded;
    req.userId = decoded.id;
    next();
  });
};

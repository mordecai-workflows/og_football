import jwt from "jsonwebtoken";


//middware to extract user id from token
export const extractUserId = (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1]; // Extract the token from the Authorization header
  
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }
  
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Invalid token" });
      }
      req.userId = decoded.id; // Attach the user ID to the request object
      next();
    });
  };


  
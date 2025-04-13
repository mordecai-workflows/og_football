import express from 'express';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { loginUser, registerUser, deleteUserAccount, editUserInfo, getPlayerInfo, getPlayerProfile } from '../controllers/auth.js';
import { extractUserId } from '../Middleware/auth.js';

dotenv.config();
const router=express.Router()


router.post('/register', registerUser)
router.post('/login', loginUser)
router.delete('/delete', extractUserId, deleteUserAccount);
router.put('/edit', extractUserId, editUserInfo);
router.get('/player', extractUserId, getPlayerInfo);
router.get('/player/:playerId', extractUserId, getPlayerProfile);


  router.get("/auth/verify", (req, res) => {
    const token = req.cookies.accessToken;
  
    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // use your secret
      res.status(200).json({ valid: true, user: decoded });
    } catch (err) {
      res.status(401).json({ message: 'Invalid token' });
    }
  });
  
export default router
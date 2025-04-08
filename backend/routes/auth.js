import express from 'express';
import dotenv from 'dotenv';
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
export default router
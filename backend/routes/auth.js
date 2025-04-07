import express from 'express';
import dotenv from 'dotenv';
import { loginUser, registerUser } from '../controllers/auth.js';

dotenv.config();

const router=express.Router()

router.post('/register', registerUser)

router.post('/login', loginUser)

export default router
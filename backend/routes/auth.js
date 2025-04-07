import express from 'express';
import dotenv from 'dotenv';
import { registerUser } from '../controllers/auth.js';

dotenv.config();

const router=express.Router()

router.post('/register', registerUser)


export default router
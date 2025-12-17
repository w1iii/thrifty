import express from 'express';
import { signup, login, changePassword, refresh, logout, getData } from '../controllers/authController.js';
import authenticateToken from '../middleware/authenticateToken.js'



const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.post('/changePassword', authenticateToken, changePassword);
router.get('/refresh', refresh);
router.get('/getData', authenticateToken, getData);


export default router;

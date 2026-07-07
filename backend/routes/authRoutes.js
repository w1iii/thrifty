import express from 'express';
import { signup, login, changePassword, refresh, logout, getData } from '../controllers/authController.js';
import authenticateToken from '../middleware/authenticateToken.js';
import { validate, signupSchema, loginSchema, changePasswordSchema } from '../middleware/validate.js';

const router = express.Router();

router.post('/signup', validate(signupSchema), signup);
router.post('/login', validate(loginSchema), login);
router.post('/logout', logout);
router.post('/changePassword', authenticateToken, validate(changePasswordSchema), changePassword);
router.get('/refresh', refresh);
router.get('/getData', authenticateToken, getData);

export default router;

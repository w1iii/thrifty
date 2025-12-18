import express from 'express';
import { getItems, getSavedItems, createItem, saveSwipe } from '../controllers/itemController.js';
import  authenticateToken  from '../middleware/authenticateToken.js';

const router = express.Router();

router.get('/', getItems);
router.get('/saved', authenticateToken, getSavedItems);
router.post('/swipe', authenticateToken, saveSwipe);
router.post('/createItem', authenticateToken, createItem); // protected

export default router;



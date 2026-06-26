import express from 'express';
import { getItems, swipeItem, getSavedItems } from '../controllers/swipeController.js';
import { addItem, upload } from '../controllers/itemsController.js';
import authenticateToken from '../middleware/authenticateToken.js';

const router = express.Router();

router.get('/items', authenticateToken, getItems);
router.post('/swipe', authenticateToken, swipeItem);
router.get('/saved', authenticateToken, getSavedItems);
router.post('/additem', authenticateToken, upload.single('image'), addItem);

export default router;

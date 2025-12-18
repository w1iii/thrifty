import express from 'express';
import { getItems, createItem } from '../controllers/itemController.js';
import  authenticateToken  from '../middleware/authenticateToken.js';

const router = express.Router();

router.get('/', getItems);
router.post('/createItem', authenticateToken, createItem); // protected

export default router;



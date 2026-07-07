import express from 'express';
import { getItems, swipeItem, getSavedItems } from '../controllers/swipeController.js';
import { addItem, upload, handleUploadErrors } from '../controllers/itemsController.js';
import authenticateToken from '../middleware/authenticateToken.js';
import { validate, swipeSchema, addItemSchema } from '../middleware/validate.js';

const router = express.Router();

router.get('/items', authenticateToken, getItems);
router.post('/swipe', authenticateToken, validate(swipeSchema), swipeItem);
router.get('/saved', authenticateToken, getSavedItems);
router.post('/additem', authenticateToken, upload.single('image'), validate(addItemSchema), addItem, handleUploadErrors);

export default router;

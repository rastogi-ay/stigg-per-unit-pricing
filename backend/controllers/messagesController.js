import express from 'express';
import * as messagesService from '../services/messagesService.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = express.Router();

async function createMessage(req, res) {
  const customerId = req.stiggCustomerId;

  try {
    const result = await messagesService.sendMessage(customerId);
    return res.status(201).json(result);
  } catch (error) {
    console.error('Failed to send message:', error);
    return res.status(500).json({ error: 'Failed to send message' });
  }
}

router.post('/', requireAuth, createMessage);
export default router;

import express from 'express';
import * as messagesService from '../services/messagesService.js';

const router = express.Router();

async function createMessage(req, res) {
  const { customerId } = req.body;

  if (!customerId) {
    return res.status(400).json({ error: 'Customer ID is required' });
  }

  try {
    const result = await messagesService.sendMessage(customerId);
    return res.status(201).json(result);
  } catch (error) {
    console.error('Failed to send message:', error);
    return res.status(500).json({ error: 'Failed to send message' });
  }
}

router.post('/', createMessage);
export default router;

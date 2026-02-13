import express from 'express';
import * as analyticsService from '../services/analyticsService.js';
import { FeatureDeniedError } from '../stigg.js';

const router = express.Router();

async function fetchAnalytics(req, res) {
  const customerId = req.query.customerId;

  if (!customerId) {
    return res.status(400).json({ error: 'customerId is required' });
  }

  try {
    const data = await analyticsService.getAnalytics(customerId);
    return res.status(200).json(data);
  } catch (error) {
    if (error instanceof FeatureDeniedError) {
      return res.status(403).json({ error: 'You do not have access to analytics. Please upgrade your plan.' });
    }
    console.error('Failed to get analytics:', error);
    return res.status(500).json({ error: 'Failed to get analytics' });
  }
}

router.get('/', fetchAnalytics);
export default router;

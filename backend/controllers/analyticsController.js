import express from 'express';
import * as analyticsService from '../services/analyticsService.js';

const router = express.Router();

async function fetchAnalytics(req, res) {
  const customerId = req.query.customerId;
  const featureId = req.query.featureId;

  if (!customerId || !featureId) {
    return res.status(400).json({ error: 'customerId and featureId are required' });
  }

  try {
    // checks if the customer is entitled to analytics
    const data = await analyticsService.getAnalytics(customerId, featureId);
    return res.json(data);
  } catch (error) {
    if (error.statusCode === 403) {
      return res.status(403).json({ error: error.message });
    }
    console.error('Failed to get analytics:', error);
    return res.status(500).json({ error: 'Failed to load analytics' });
  }
}

router.get('/', fetchAnalytics);
export default router;

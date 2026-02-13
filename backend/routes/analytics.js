import express from 'express';
import { stiggClient } from '../stigg.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const customerId = req.query.customerId;
  const featureId = req.query.featureId;

  if (!customerId || !featureId) {
    return res.status(400).json({ error: 'customerId and featureId are required' });
  }

  try {
    // first, check if the customer is entitled to analytics
    const analyticsEntitlement = await stiggClient.getBooleanEntitlement({
      customerId,
      featureId,
    });
    console.log("Analytics Entitlement:", analyticsEntitlement);
    if (!analyticsEntitlement.hasAccess) {
      return res.status(403).json({ error: 'You do not have access to analytics. Please upgrade your plan.' });
    }
    // then, return the hidden message
    return res.json({
      hiddenMessage: 'Hidden message: Welcome to the analytics dashboard — you’re in!',
    });
  } catch (error) {
    console.error('Failed to get analytics:', error);
    return res.status(500).json({ error: 'Failed to load analytics' });
  }
});

export default router;

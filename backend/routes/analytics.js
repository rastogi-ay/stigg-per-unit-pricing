import express from 'express';
import { stiggClient } from '../stigg/stigg.js';
import {
  ANALYTICS_FEATURE_ID,
  TEMPLATES_FEATURE_ID,
  CAMPAIGNS_FEATURE_ID,
} from '../stigg/features.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const customerId = req.query.customerId;

  if (!customerId) {
    return res.status(400).json({ error: 'customerId is required' });
  }

  try {
    // first, check if the customer is entitled to analytics
    const analyticsEntitlement = await stiggClient.getBooleanEntitlement({
      customerId,
      featureId: ANALYTICS_FEATURE_ID,
    });
    if (!analyticsEntitlement.hasAccess) {
      return res.status(403).json({ error: 'You do not have access to analytics. Please upgrade your plan.' });
    }
    // then, get the usage of the templates and campaigns features
    const templatesEntitlement = await stiggClient.getMeteredEntitlement({ customerId, featureId: TEMPLATES_FEATURE_ID });
    const campaignsEntitlement = await stiggClient.getMeteredEntitlement({ customerId, featureId: CAMPAIGNS_FEATURE_ID });
    return res.json({
      hiddenMessage: 'Hidden message: Welcome to the analytics dashboard — you’re in!',
      templateCount: templatesEntitlement.currentUsage,
      campaignCount: campaignsEntitlement.currentUsage,
    });
  } catch (error) {
    console.error('Failed to get analytics:', error);
    return res.status(500).json({ error: 'Failed to load analytics' });
  }
});

export default router;

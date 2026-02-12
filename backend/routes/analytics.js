import express from 'express';
import { stiggClient } from '../stigg/stigg.js';
import { ANALYTICS_FEATURE_ID } from '../stigg/features.js';
import { templatesStore } from './templates.js';
import { campaignsStore } from './campaigns.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const customerId = req.query.customerId;

  if (!customerId) {
    return res.status(400).json({ error: 'customerId is required' });
  }

  try {
    const entitlement = await stiggClient.getBooleanEntitlement({
      customerId,
      featureId: ANALYTICS_FEATURE_ID,
    });

    if (!entitlement.hasAccess) {
      return res.status(403).json({ error: 'You do not have access to analytics. Please upgrade your plan.' });
    }

    return res.json({
      hiddenMessage: 'Welcome to the analytics dashboard — you’re in!',
      templateCount: templatesStore.length,
      campaignCount: campaignsStore.length,
    });
  } catch (error) {
    console.error('Failed to get analytics:', error);
    return res.status(500).json({ error: 'Failed to load analytics' });
  }
});

export default router;

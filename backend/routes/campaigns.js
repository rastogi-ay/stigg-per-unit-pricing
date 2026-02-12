import express from 'express';
import { stiggClient } from '../stigg/stigg.js';
import { CAMPAIGNS_FEATURE_ID } from '../stigg/features.js';

const router = express.Router();
export const campaignsStore = [];

router.get('/', (req, res) => {
  res.json(campaignsStore);
});

router.post('/', async (req, res) => {
  const { campaign, customerId } = req.body;

  if (!campaign || !customerId) {
    return res.status(400).json({ error: 'Campaign and customerId are required' });
  }

  try {
    // first, check if the customer is entitled to create a campaign
    const entitlement = await stiggClient.getMeteredEntitlement({
      customerId,
      featureId: CAMPAIGNS_FEATURE_ID,
      options: { requestedUsage: 1 },
    });
    console.log("Campaigns Entitlement:", entitlement);
    if (!entitlement.hasAccess) {
      return res.status(403).json({ error: 'You do not have access to the feature. Please upgrade your plan.' });
    }
    // then, we'll report the usage to Stigg and save the campaign to our "database"
    const reportUsage = await stiggClient.reportUsage({ customerId, featureId: CAMPAIGNS_FEATURE_ID, value: 1 });
    console.log("Reported Usage of Campaign:", reportUsage);
    campaignsStore.push(campaign);

    return res.status(201).json(campaign);
  } catch (error) {
    console.error('Failed to create campaign:', error);
    return res.status(500).json({ error: 'Failed to create campaign' });
  }
});

export default router;

import express from 'express';
import { stiggClient } from '../stigg/stigg.js';
import { TEMPLATES_FEATURE_ID } from '../stigg/features.js';

const router = express.Router();
export const templatesStore = [];

router.get('/', (req, res) => {
  res.json(templatesStore);
});

router.post('/', async (req, res) => {
  const { template, customerId } = req.body;

  if (!template || !customerId) {
    return res.status(400).json({ error: 'Template and customerId are required' });
  }

  try {
    // first, check if the customer is entitled to create a template
    const entitlement = await stiggClient.getMeteredEntitlement({
      customerId,
      featureId: TEMPLATES_FEATURE_ID,
      options: { requestedUsage: 1 },
    });
    if (!entitlement.hasAccess) {
      return res.status(403).json({ error: 'You do not have access to the feature. Please upgrade your plan.' });
    }
    // then, we'll save the template to our "database" and report the usage to Stigg
    templatesStore.push(template);
    await stiggClient.reportUsage({ customerId, featureId: TEMPLATES_FEATURE_ID, value: 1 });
    return res.status(201).json(template);
  } catch (error) {
    console.error('Failed to create template:', error);
    return res.status(500).json({ error: 'Failed to create template' });
  }
});

export default router;

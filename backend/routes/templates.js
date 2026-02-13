import express from 'express';
import { stiggClient } from '../stigg.js';

const router = express.Router();
export const templatesStore = [];

router.get('/', (req, res) => {
  res.json(templatesStore);
});

router.post('/', async (req, res) => {
  const { template, customerId, featureId } = req.body;

  if (!template || !customerId || !featureId) {
    return res.status(400).json({ error: 'Template, customerId and featureId are required' });
  }

  try {
    // first, check if the customer is entitled to create a template
    const entitlement = await stiggClient.getMeteredEntitlement({
      customerId,
      featureId,
      options: { requestedUsage: 1 },
    });
    console.log("Templates Entitlement:", entitlement);
    if (!entitlement.hasAccess) {
      return res.status(403).json({ error: 'You do not have access to the feature. Please upgrade your plan.' });
    }
    // then, we'll report the usage to Stigg and save the template to our "database"
    const reportUsage = await stiggClient.reportUsage({ customerId, featureId, value: 1 });
    console.log("Reported Usage of Template:", reportUsage);
    templatesStore.push(template);

    return res.status(201).json(template);
  } catch (error) {
    console.error('Failed to create template:', error);
    return res.status(500).json({ error: 'Failed to create template' });
  }
});

export default router;

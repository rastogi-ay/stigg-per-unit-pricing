import express from 'express';
import * as campaignsService from '../services/campaignsService.js';

const router = express.Router();

function fetchCampaigns(req, res) {
  const campaigns = campaignsService.getAll();
  return res.json(campaigns);
}

async function createCampaign(req, res) {
  const { campaign, customerId, featureId } = req.body;

  if (!campaign || !customerId || !featureId) {
    return res.status(400).json({ error: 'Campaign, customerId and featureId are required' });
  }

  try {
    // checks if the customer is entitled to create a campaign and (if so) report the usage to Stigg
    const created = await campaignsService.saveCampaign(customerId, featureId, campaign);
    return res.status(201).json(created);
  } catch (error) {
    if (error.statusCode === 403) {
      return res.status(403).json({ error: error.message });
    }
    console.error('Failed to create campaign:', error);
    return res.status(500).json({ error: 'Failed to create campaign' });
  }
}

router.get('/', fetchCampaigns);
router.post('/', createCampaign);
export default router;

import express from 'express';
import * as templatesService from '../services/templatesService.js';

const router = express.Router();

function fetchTemplates(req, res) {
  const templates = templatesService.getAll();
  return res.json(templates);
}

async function createTemplate(req, res) {
  const { template, customerId, featureId } = req.body;

  if (!template || !customerId || !featureId) {
    return res.status(400).json({ error: 'Template, customerId and featureId are required' });
  }

  try {
    // checks if the customer is entitled to create a template and (if so) report the usage to Stigg
    const created = await templatesService.saveTemplate(customerId, featureId, template);
    return res.status(201).json(created);
  } catch (error) {
    if (error.statusCode === 403) {
      return res.status(403).json({ error: error.message });
    }
    console.error('Failed to create template:', error);
    return res.status(500).json({ error: 'Failed to create template' });
  }
}

router.get('/', fetchTemplates);
router.post('/', createTemplate);
export default router;

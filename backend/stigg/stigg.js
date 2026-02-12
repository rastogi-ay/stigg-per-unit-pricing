import dotenv from 'dotenv';
import { Stigg } from '@stigg/node-server-sdk';
import { TEMPLATES_FEATURE_ID } from './features.js';
import { CAMPAIGNS_FEATURE_ID } from './features.js';
import { ANALYTICS_FEATURE_ID } from './features.js';

dotenv.config();

export const stiggClient = Stigg.initialize({
  // Stigg server API key from Stigg environment
  apiKey: process.env.STIGG_SERVER_API_KEY,
  // ex. opt for "fail closed" approach for when Stigg is down, this can be changed
  entitlementsFallback: {
    [CAMPAIGNS_FEATURE_ID]: {
      hasAccess: false,
    },
    [TEMPLATES_FEATURE_ID]: {
      hasAccess: false,
    },
    [ANALYTICS_FEATURE_ID]: {
      hasAccess: false,
    },
  },
});

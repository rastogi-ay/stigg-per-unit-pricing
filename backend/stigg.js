import dotenv from 'dotenv';
import { Stigg } from '@stigg/node-server-sdk';

dotenv.config();

// Feature IDs for the different features from Stigg
export const TEMPLATES_FEATURE_ID = 'feature-01-templates';
export const ANALYTICS_FEATURE_ID = 'feature-04-analytics';

// Initialize the Stigg client to be used throughout the server
export const stiggClient = Stigg.initialize({
  // Stigg server API key from Stigg environment
  apiKey: process.env.STIGG_SERVER_API_KEY,
  // ex. opt for "fail closed" approach for when Stigg is down, this can be changed
  entitlementsFallback: {
    [TEMPLATES_FEATURE_ID]: {
      hasAccess: false,
    },
    [ANALYTICS_FEATURE_ID]: {
      hasAccess: false,
    },
  },
});

// Error class for feature denied errors to be thrown after entitlement checks
export class FeatureDeniedError extends Error {
  constructor() {
    super();
    this.name = 'FeatureDeniedError';
  }
}
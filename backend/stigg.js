import dotenv from 'dotenv';
import { Stigg } from '@stigg/node-server-sdk';

dotenv.config();

// Feature IDs for the different features from Stigg
export const TEMPLATES_FEATURE_ID = 'feature-01-templates';
export const ANALYTICS_FEATURE_ID = 'feature-04-analytics';
export const MESSAGES_FEATURE_ID = 'feature-06-messages';

// Initialize the Stigg client to be used throughout the server
export const stiggClient = Stigg.initialize({
  // Stigg server API key from Stigg environment
  apiKey: process.env.STIGG_SERVER_API_KEY,
  // example of the fallback strategy for when Stigg is down
  entitlementsFallback: {
    [TEMPLATES_FEATURE_ID]: {
      hasAccess: false,
    },
    [ANALYTICS_FEATURE_ID]: {
      hasAccess: false,
    },
    [MESSAGES_FEATURE_ID]: {
      hasAccess: true,
      isUnlimited: true,
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
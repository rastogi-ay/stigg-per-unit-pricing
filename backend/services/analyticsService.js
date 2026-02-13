import { stiggClient, ANALYTICS_FEATURE_ID, FeatureDeniedError } from '../stigg.js';

async function getAnalytics(customerId) {
  const entitlement = await stiggClient.getBooleanEntitlement({
    customerId,
    featureId: ANALYTICS_FEATURE_ID,
  });
  console.log("Analytics Entitlement:", entitlement);
  if (!entitlement.hasAccess) {
    throw new FeatureDeniedError();
  }
  return {
    hiddenMessage: 'Hidden message: Welcome to the analytics dashboard — you\'re in!',
  };
}

export { getAnalytics };

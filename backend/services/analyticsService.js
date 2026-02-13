import { stiggClient } from '../stigg.js';

async function getAnalytics(customerId, featureId) {
  const entitlement = await stiggClient.getBooleanEntitlement({
    customerId,
    featureId,
  });
  console.log("Analytics Entitlement:", entitlement);
  if (!entitlement.hasAccess) {
    const error = new Error('You do not have access to analytics. Please upgrade your plan.');
    error.statusCode = 403;
    throw error;
  }
  return {
    hiddenMessage: 'Hidden message: Welcome to the analytics dashboard — you\'re in!',
  };
}

export { getAnalytics };

import { stiggClient } from '../stigg.js';

const campaignsStore = [];

function getAll() {
  return campaignsStore;
}

async function saveCampaign(customerId, featureId, campaign) {
  // first, check if the customer is entitled to create a campaign
  const entitlement = await stiggClient.getMeteredEntitlement({
    customerId,
    featureId,
    options: { requestedUsage: 1 },
  });
  console.log("Campaigns Entitlement:", entitlement);
  if (!entitlement.hasAccess) {
    const error = new Error('You do not have access to the feature. Please upgrade your plan.');
    error.statusCode = 403;
    throw error;
  }
  // then, report the usage to Stigg
  const reportUsage = await stiggClient.reportUsage({ customerId, featureId, value: 1 });
  console.log("Reported Usage of Campaign:", reportUsage);
  campaignsStore.push(campaign);
  return campaign;
}

export { getAll, saveCampaign };

import { stiggClient } from '../stigg.js';

const templatesStore = [];

function getAll() {
  return templatesStore;
}

async function saveTemplate(customerId, featureId, template) {
  // first, check if the customer is entitled to create a template
  const entitlement = await stiggClient.getMeteredEntitlement({
    customerId,
    featureId,
    options: { requestedUsage: 1 },
  });
  console.log("Templates Entitlement:", entitlement);
  if (!entitlement.hasAccess) {
    const error = new Error('You do not have access to the feature. Please upgrade your plan.');
    error.statusCode = 403;
    throw error;
  }
  // then, report the usage to Stigg
  const reportUsage = await stiggClient.reportUsage({ customerId, featureId, value: 1 });
  console.log("Reported Usage of Template:", reportUsage);
  templatesStore.push(template);
  return template;
}

export { getAll, saveTemplate };

import { stiggClient } from '../stigg.js';

const TEAMS = ['product', 'engineering'];

async function sendMessage(customerId) {
  const team = TEAMS[Math.floor(Math.random() * TEAMS.length)];

  const reportEvent = await stiggClient.reportEvent({
    customerId,
    eventName: 'message_sent',
    idempotencyKey: customerId + '-' + String(Date.now()),
    dimensions: {
      team,
    },
  });
  console.log("Reported Event of Message:", reportEvent);
  return {
    message: 'Message sent successfully to team: ' + team,
  };
}

export { sendMessage };

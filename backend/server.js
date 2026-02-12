import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import templatesRouter from './routes/templates.js';
import campaignsRouter from './routes/campaigns.js';
import analyticsRouter from './routes/analytics.js';
import { stiggClient } from './stigg/stigg.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;
let server;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173', // Vite default port
    'http://localhost:3000', // Alternative React port
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000',
  ],
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/templates', templatesRouter);
app.use('/api/campaigns', campaignsRouter);
app.use('/api/analytics', analyticsRouter);

// Start the server, wait for Stigg client to initialize
export async function startServer() {
  await stiggClient.waitForInitialization();

  server = app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Stigg client initialized');
  });

  return server;
}

// Shutdown the server, close Stigg client
export async function shutdown() {
  if (!server) return;

  return new Promise((resolve) => {
    server.close(() => {
      stiggClient.close();
      console.log('Server closed');
      console.log('Stigg client closed');
      resolve();
    });
  });
}
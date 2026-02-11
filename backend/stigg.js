import dotenv from 'dotenv';
import { Stigg } from '@stigg/node-server-sdk';

dotenv.config();

export const stiggClient = Stigg.initialize({
  apiKey: process.env.STIGG_SERVER_API_KEY,
});
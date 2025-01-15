// test-env.ts
import dotenv from 'dotenv';
import path from 'path';

console.log('Current directory:', __dirname);
console.log('Looking for .env in:', path.join(__dirname, '.env'));

const result = dotenv.config();
console.log('Dotenv config result:', result);
console.log('Environment variables:', {
  JWT_SECRET: process.env.JWT_SECRET,
  NODE_ENV: process.env.NODE_ENV,
  // Log all env variables (be careful not to share this output if using real secrets)
  all: process.env
});
// Vercel Web Analytics
import { inject } from './vercel-analytics.mjs';

// Initialize Vercel Analytics
inject({
  mode: 'auto', // Automatically detect environment
  debug: false  // Set to true for development debugging
});

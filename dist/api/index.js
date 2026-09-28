// api/index.js
// Vercel Serverless Function entry point for DAREDOWN API routes (/api/*)
// In Vercel's Node.js runtime, exporting an Express app automatically handles
// incoming HTTP requests as a serverless function.

const app = require('../server');

module.exports = app;

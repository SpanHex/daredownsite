// api/[...path].js
// Vercel Serverless Function catch-all entry point for DAREDOWN API routes (/api/*)
// Routes any subpath under /api/ directly to the Express application

const app = require('../server');

module.exports = app;

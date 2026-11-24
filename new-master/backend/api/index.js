let app;
let initError = null;

try {
  app = require('../server');
} catch (err) {
  initError = {
    message: err.message,
    stack: err.stack,
  };
  console.error('FATAL initialization error in server.js:', err);
}

module.exports = (req, res) => {
  const origin = (req.headers && req.headers.origin) ? req.headers.origin : '*';

  // Always inject CORS headers on every serverless response
  if (origin !== '*') {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control, Pragma'
  );
  res.setHeader('Access-Control-Max-Age', '86400');

  // Immediately respond 200 OK to all preflight OPTIONS requests
  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    return res.end();
  }

  // If server.js failed to initialize, return the diagnostic error with CORS headers
  if (initError) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({
      error: 'Backend Initialization Error',
      message: initError.message,
      stack: initError.stack,
    }, null, 2));
  }

  // Handle standard Express app execution
  return app(req, res);
};

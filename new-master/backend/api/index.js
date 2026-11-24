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
  // If an initialization error happened when requiring server.js, return it with CORS enabled
  if (initError) {
    const origin = req.headers && req.headers.origin ? req.headers.origin : '*';
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
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

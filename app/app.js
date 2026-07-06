const express = require('express');
const os = require('os');

const app = express();
const PORT = process.env.PORT || 3000;

let requestCount = 0;

app.use((req, res, next) => {
  requestCount++;
  next();
});

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Hello from Sample DevOps App!',
    hostname: os.hostname(),
    timestamp: new Date().toISOString(),
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

app.get('/ready', (req, res) => {
  res.status(200).json({ status: 'READY' });
});

app.get('/metrics', (req, res) => {
  res.set('Content-Type', 'text/plain');
  res.send(
    `# HELP app_requests_total Total number of requests received\n` +
    `# TYPE app_requests_total counter\n` +
    `app_requests_total ${requestCount}\n`
  );
});

// Start server only when running directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
  });
}

module.exports = app;
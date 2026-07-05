const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Simple in-memory health/metrics state
let requestCount = 0;

app.use((req, res, next) => {
  requestCount++;
  next();
});

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Hello from Sample DevOps App!',
    hostname: require('os').hostname(),
    timestamp: new Date().toISOString(),
  });
});

// Health check endpoint - used by Docker/K8s probes
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

// Readiness endpoint
app.get('/ready', (req, res) => {
  res.status(200).json({ status: 'READY' });
});

// Basic metrics endpoint (Prometheus can scrape a proper /metrics with prom-client,
// this is a simplified version for demo purposes)
app.get('/metrics', (req, res) => {
  res.set('Content-Type', 'text/plain');
  res.send(
    `# HELP app_requests_total Total number of requests received\n` +
    `# TYPE app_requests_total counter\n` +
    `app_requests_total ${requestCount}\n`
  );
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

module.exports = app;

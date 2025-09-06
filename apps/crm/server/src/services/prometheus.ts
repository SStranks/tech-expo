import type { Request, Response } from 'express';

import prometheusClient from 'prom-client';

const PREFIX = 'express_';

const collectDefaultMetrics = prometheusClient.collectDefaultMetrics;
const Registry = prometheusClient.Registry;
const prometheusRegister = new Registry();
collectDefaultMetrics({ prefix: PREFIX, register: prometheusRegister });

const httpRequestDurationSeconds = new prometheusClient.Histogram({
  name: `${PREFIX}http_request_duration_seconds`,
  buckets: [0.001, 0.002, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2, 5],
  help: 'Duration of HTTP requests in ms',
  labelNames: ['method', 'route', 'code'],
});

const httpRequestCounter = new prometheusClient.Counter({
  name: `${PREFIX}http_request_count`,
  help: 'Count of HTTP requests made to my app',
  labelNames: ['method', 'route', 'statusCode'],
});

const upGauge = new prometheusClient.Gauge({
  name: `${PREFIX}up`,
  help: '1 if the service is healthy, 0 otherwise',
});
upGauge.set(1);

prometheusRegister.registerMetric(httpRequestDurationSeconds);
prometheusRegister.registerMetric(httpRequestCounter);
prometheusRegister.registerMetric(upGauge);

let metricsCache = '';
let lastUpdated = 0;
const METRICS_INTERVAL = 10_000;
let inProgress: Promise<string> | null = null;

async function getMetrics(): Promise<string> {
  const now = Date.now();

  // If cache is fresh, return it
  if (now - lastUpdated < METRICS_INTERVAL && metricsCache) {
    return metricsCache;
  }

  // If another request is already updating, reuse it
  if (inProgress) {
    return inProgress;
  }

  // Otherwise, start a new metrics fetch
  inProgress = prometheusRegister
    .metrics()
    .then((metrics) => {
      metricsCache = metrics;
      lastUpdated = Date.now();
      return metrics;
    })
    .finally(() => {
      inProgress = null;
    });

  return inProgress;
}

async function prometheusMetricsHandler(_req: Request, res: Response) {
  try {
    const metrics = await getMetrics();
    res.set('Content-Type', prometheusRegister.contentType);
    res.end(metrics);
  } catch {
    res.status(500).send('Error generating Prometheus metrics');
  }
}

export { httpRequestCounter, httpRequestDurationSeconds, prometheusMetricsHandler };

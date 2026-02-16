/**
 * Prometheus Metrics
 * 
 * This module exports Prometheus metrics for monitoring:
 * - HTTP request metrics (count, duration, errors)
 * - Business metrics (tasks created, users active)
 * - System metrics (memory, CPU)
 * 
 * WHY Prometheus?
 * - Industry standard for metrics collection
 * - Time-series database (perfect for monitoring)
 * - Works with Grafana for beautiful dashboards
 * - Kubernetes-native (used everywhere in K8s)
 */

import { Registry, Counter, Histogram, Gauge, collectDefaultMetrics } from 'prom-client';

// Create a registry to hold all metrics
export const register = new Registry();

// Collect default Node.js metrics (CPU, memory, event loop, etc.)
collectDefaultMetrics({ register });

// ============================================
// HTTP METRICS
// ============================================

/**
 * HTTP Request Counter
 * Tracks total number of HTTP requests by method, route, and status code
 */
export const httpRequestCounter = new Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status'],
  registers: [register],
});

/**
 * HTTP Request Duration Histogram
 * Tracks how long requests take (for calculating p50, p95, p99 latencies)
 */
export const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10], // Latency buckets in seconds
  registers: [register],
});

// ============================================
// BUSINESS METRICS
// ============================================

/**
 * Tasks Created Counter
 * Tracks how many tasks are created (business metric)
 */
export const tasksCreatedCounter = new Counter({
  name: 'tasks_created_total',
  help: 'Total number of tasks created',
  labelNames: ['organization_id', 'project_id'],
  registers: [register],
});

/**
 * Tasks Completed Counter
 * Tracks how many tasks are completed
 */
export const tasksCompletedCounter = new Counter({
  name: 'tasks_completed_total',
  help: 'Total number of tasks completed',
  labelNames: ['organization_id', 'project_id'],
  registers: [register],
});

/**
 * Active Users Gauge
 * Tracks number of currently active users
 */
export const activeUsersGauge = new Gauge({
  name: 'active_users',
  help: 'Number of currently active users',
  labelNames: ['organization_id'],
  registers: [register],
});

/**
 * Database Query Duration
 * Tracks database query performance
 */
export const dbQueryDuration = new Histogram({
  name: 'db_query_duration_seconds',
  help: 'Duration of database queries in seconds',
  labelNames: ['operation', 'table'],
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5],
  registers: [register],
});

// ============================================
// ERROR METRICS
// ============================================

/**
 * Error Counter
 * Tracks application errors
 */
export const errorCounter = new Counter({
  name: 'application_errors_total',
  help: 'Total number of application errors',
  labelNames: ['type', 'route'],
  registers: [register],
});

/**
 * Database Connection Pool
 * Tracks database connection pool status
 */
export const dbPoolSize = new Gauge({
  name: 'db_pool_size',
  help: 'Database connection pool size',
  labelNames: ['state'], // 'active', 'idle', 'waiting'
  registers: [register],
});

// Export all metrics for easy access
export const metrics = {
  httpRequestCounter,
  httpRequestDuration,
  tasksCreatedCounter,
  tasksCompletedCounter,
  activeUsersGauge,
  dbQueryDuration,
  errorCounter,
  dbPoolSize,
};

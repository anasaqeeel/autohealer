/**
 * Metrics Middleware
 * 
 * Tracks HTTP request metrics for Prometheus
 */

import { Request, Response, NextFunction } from 'express';
import { httpRequestCounter, httpRequestDuration } from '../utils/metrics';

/**
 * Middleware to track HTTP metrics
 */
export function metricsMiddleware(req: Request, res: Response, next: NextFunction): void {
  const startTime = Date.now();
  const route = req.route?.path || req.path;

  // Track response when it finishes
  res.on('finish', () => {
    const duration = (Date.now() - startTime) / 1000; // Convert to seconds
    const status = res.statusCode.toString();

    // Increment request counter
    httpRequestCounter.inc({
      method: req.method,
      route: route,
      status: status,
    });

    // Record request duration
    httpRequestDuration.observe(
      {
        method: req.method,
        route: route,
        status: status,
      },
      duration
    );
  });

  next();
}

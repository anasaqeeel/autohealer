/**
 * Health Check Endpoint Tests
 * 
 * Tests for the /health endpoint which is critical for:
 * - Kubernetes liveness/readiness probes
 * - Load balancer health checks
 * - Monitoring systems
 */

import request from 'supertest';
import app from '../src/server';

// Note: If server.ts doesn't export app, we may need to create a test server
// For now, this assumes app is exported from server.ts

describe('Health Check Endpoint', () => {
  describe('GET /health', () => {
    it('should return 200 status code', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
    });

    it('should return JSON response', async () => {
      const response = await request(app).get('/health');
      expect(response.headers['content-type']).toMatch(/json/);
    });

    it('should return status ok', async () => {
      const response = await request(app).get('/health');
      expect(response.body.status).toBe('ok');
    });

    it('should return timestamp', async () => {
      const response = await request(app).get('/health');
      expect(response.body.timestamp).toBeDefined();
      expect(new Date(response.body.timestamp).getTime()).toBeGreaterThan(0);
    });

    it('should return uptime', async () => {
      const response = await request(app).get('/health');
      expect(response.body.uptime).toBeDefined();
      expect(typeof response.body.uptime).toBe('number');
    });

    it('should return environment', async () => {
      const response = await request(app).get('/health');
      expect(response.body.environment).toBeDefined();
    });
  });
});

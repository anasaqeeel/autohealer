/**
 * Metrics Endpoint Tests
 * 
 * Tests for the /metrics endpoint (Prometheus metrics)
 */

import request from 'supertest';
import app from '../src/server';

describe('Metrics Endpoint', () => {
  describe('GET /metrics', () => {
    it('should return 200 status code', async () => {
      const response = await request(app).get('/metrics');
      expect(response.status).toBe(200);
    });

    it('should return Prometheus format', async () => {
      const response = await request(app).get('/metrics');
      expect(response.headers['content-type']).toContain('text/plain');
      expect(response.text).toContain('# HELP');
      expect(response.text).toContain('# TYPE');
    });

    it('should contain Node.js metrics', async () => {
      const response = await request(app).get('/metrics');
      expect(response.text).toMatch(/nodejs_/);
    });
  });
});

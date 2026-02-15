/**
 * Main Server File
 * 
 * This is the entry point for the TaskMaster Pro backend API.
 * 
 * DevOps Notes:
 * - This server exposes a /health endpoint that Kubernetes/Docker will use for health checks
 * - All routes are prefixed with /api for API versioning
 * - CORS is configured to allow frontend requests
 * - Helmet adds security headers (XSS protection, etc.)
 * - Morgan logs HTTP requests (useful for monitoring)
 */

import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDatabase, syncDatabase } from './config/database';
import './models'; // Import models to register them with Sequelize

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3001;

// ============================================
// MIDDLEWARE SETUP
// ============================================

// Helmet: Security headers (XSS protection, content security policy, etc.)
// WHY: Prevents common web vulnerabilities
app.use(helmet());

// CORS: Allow frontend to make requests
// In production, set CORS_ORIGIN to your frontend domain
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  })
);

// Body parser: Parse JSON request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Morgan: HTTP request logger
// Format: "GET /api/health 200 5ms"
// WHY: Essential for monitoring and debugging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// ============================================
// HEALTH CHECK ENDPOINT
// ============================================

/**
 * Health Check Endpoint
 * 
 * This is CRITICAL for DevOps:
 * - Kubernetes uses this for liveness/readiness probes
 * - Load balancers use this to route traffic
 * - Monitoring tools ping this to check if service is up
 * 
 * Returns 200 if server is running, 503 if unhealthy
 */
app.get('/health', async (req: Request, res: Response) => {
  try {
    // In a real production system, you'd also check:
    // - Database connectivity
    // - Redis connectivity
    // - External service dependencies
    
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
    });
  } catch (error) {
    res.status(503).json({
      status: 'error',
      message: 'Service unhealthy',
    });
  }
});

// ============================================
// API ROUTES
// ============================================

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'TaskMaster Pro API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      api: '/api',
    },
  });
});

// API routes
import authRoutes from './routes/authRoutes';
import organizationRoutes from './routes/organizationRoutes';
import projectRoutes from './routes/projectRoutes';
import taskRoutes from './routes/taskRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import activityRoutes from './routes/activityRoutes';

app.use('/api/auth', authRoutes);
app.use('/api/organizations', organizationRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/activity', activityRoutes);

// ============================================
// ERROR HANDLING MIDDLEWARE
// ============================================

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path,
  });
});

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
});

// ============================================
// SERVER STARTUP
// ============================================

async function startServer() {
  try {
    // Connect to database
    await connectDatabase();
    
    // Sync database models (create tables if they don't exist)
    // WARNING: In production, use migrations instead!
    // For now, we'll use sync for development
    const forceSync = process.env.DB_FORCE_SYNC === 'true';
    await syncDatabase(forceSync);
    
    // Start HTTP server
    app.listen(PORT, () => {
      console.log(`🚀 TaskMaster Pro backend running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1); // Exit with error code (important for Docker/K8s)
  }
}

// Start the server
startServer();

// Graceful shutdown (important for production)
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  process.exit(0);
});

export default app;

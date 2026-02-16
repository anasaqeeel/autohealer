/**
 * Database Configuration
 * 
 * This file sets up Sequelize ORM to connect to MySQL.
 * 
 * WHY Sequelize?
 * - It's a mature ORM (Object-Relational Mapping) that lets us write database queries in JavaScript/TypeScript
 * - Handles connection pooling automatically (important for production - reuses DB connections)
 * - Provides migrations (version control for database schema changes)
 * - Type-safe models (with TypeScript)
 * 
 * In DevOps terms: This abstraction layer makes it easier to:
 * - Switch databases if needed (PostgreSQL, SQLite, etc.)
 * - Write database-agnostic code
 * - Test with in-memory databases
 */

import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Railway provides MYSQL_URL (connection string) or individual variables
// Priority: MYSQL_URL > DB_* variables > MYSQL* variables > defaults
const dbName = process.env.DB_NAME || process.env.MYSQL_DATABASE || 'taskmaster_pro';
const dbUser = process.env.DB_USER || process.env.MYSQLUSER || 'taskmaster_user';
const dbPassword = process.env.DB_PASSWORD || process.env.MYSQLPASSWORD || 'taskmaster_password';
const dbHost = process.env.DB_HOST || process.env.MYSQLHOST || 'localhost';
const dbPort = parseInt(process.env.DB_PORT || process.env.MYSQLPORT || '3306');

// Log database config (without password) for debugging
console.log('🔍 Database Config:', {
  host: dbHost,
  port: dbPort,
  database: dbName,
  user: dbUser,
  hasPassword: !!dbPassword,
  usingMYSQLHOST: !!process.env.MYSQLHOST,
  usingDB_HOST: !!process.env.DB_HOST,
});

// Create Sequelize instance
// This is the connection pool that will handle all database queries
const sequelize = new Sequelize(
  dbName,
  dbUser,
  dbPassword,
  {
    host: dbHost,
    port: dbPort,
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false, // Log SQL queries in dev only
    pool: {
      max: 10, // Maximum number of connections in the pool
      min: 0,
      acquire: 30000, // Time in ms to wait before throwing error if connection can't be acquired
      idle: 10000, // Time in ms before closing idle connections
    },
    // Retry configuration (important for production resilience)
    retry: {
      max: 3, // Retry failed queries up to 3 times
    },
  }
);

/**
 * Test database connection
 * This is called on server startup to ensure we can connect to MySQL
 * 
 * In DevOps: This is a health check - if DB is down, we want to know immediately
 */
export async function connectDatabase(): Promise<void> {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    throw error; // Crash the server if DB is unavailable (fail-fast principle)
  }
}

/**
 * Sync database models (creates tables if they don't exist)
 * 
 * WARNING: In production, use migrations instead of sync!
 * sync() is fine for development, but migrations give you version control for schema changes
 * 
 * force: true = DROP existing tables and recreate (DANGEROUS - only for dev!)
 * alter: true = Modify existing tables to match models (safer, but still risky in prod)
 */
export async function syncDatabase(force: boolean = false): Promise<void> {
  try {
    await sequelize.sync({ force, alter: !force });
    console.log('✅ Database models synchronized.');
  } catch (error) {
    console.error('❌ Error syncing database:', error);
    throw error;
  }
}

export default sequelize;

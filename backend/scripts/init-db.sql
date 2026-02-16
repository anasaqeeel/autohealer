-- Database initialization script
-- This runs automatically when MySQL container starts for the first time
-- It ensures the database and user exist with correct permissions

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS taskmaster_pro CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create user if it doesn't exist
CREATE USER IF NOT EXISTS 'taskmaster_user'@'%' IDENTIFIED BY 'taskmaster_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON taskmaster_pro.* TO 'taskmaster_user'@'%';

-- Flush privileges to apply changes
FLUSH PRIVILEGES;

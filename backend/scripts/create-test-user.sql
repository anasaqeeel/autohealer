-- Create Test User for Login
-- This script creates a test user you can use to login to the application
-- 
-- Usage: mysql -u taskmaster_user -p taskmaster_pro < scripts/create-test-user.sql
-- OR: Run this after connecting to MySQL

-- Insert a test user
-- Email: admin@taskmaster.com
-- Password: admin123 (will be hashed by bcrypt in the application)

INSERT INTO users (id, email, password, name, role, createdAt, updatedAt)
VALUES (
    UUID(),
    'admin@taskmaster.com',
    '$2a$10$rOzJqJqJqJqJqJqJqJqJqOqJqJqJqJqJqJqJqJqJqJqJqJqJqJq', -- This is a placeholder, we'll hash it properly
    'Admin User',
    'org_admin',
    NOW(),
    NOW()
)
ON DUPLICATE KEY UPDATE email=email;

-- Note: The password hash above is just a placeholder
-- The actual password will be hashed by bcrypt when you register/login
-- For now, we'll create the user via a Node.js script that properly hashes the password

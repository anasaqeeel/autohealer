#!/bin/bash

# Database Setup Script (Updated for Linux MySQL auth_socket)
# 
# This script creates the MySQL database and user for TaskMaster Pro.
# 
# Handles both password-based and sudo-based MySQL authentication.

set -e  # Exit on error

DB_NAME="taskmaster_pro"
DB_USER="taskmaster_user"
DB_PASSWORD="taskmaster_password"

echo "🔧 Setting up MySQL database for TaskMaster Pro..."
echo ""

# Check if MySQL is running
if ! systemctl is-active --quiet mysql 2>/dev/null && ! pgrep -x mysqld > /dev/null; then
    echo "⚠️  MySQL doesn't appear to be running."
    echo "   Please start MySQL first:"
    echo "   sudo systemctl start mysql"
    exit 1
fi

echo "📦 Creating database and user..."
echo ""

# Try method 1: sudo mysql (for auth_socket - most common on Linux)
echo "Attempting setup with sudo (no password required)..."
if sudo mysql <<EOF 2>/dev/null; then
-- Create database
CREATE DATABASE IF NOT EXISTS ${DB_NAME} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create user
CREATE USER IF NOT EXISTS '${DB_USER}'@'localhost' IDENTIFIED BY '${DB_PASSWORD}';

-- Grant privileges
GRANT ALL PRIVILEGES ON ${DB_NAME}.* TO '${DB_USER}'@'localhost';

-- Flush privileges
FLUSH PRIVILEGES;

-- Show success
SELECT 'Database ${DB_NAME} and user ${DB_USER} created successfully!' AS message;
EOF
    echo ""
    echo "✅ Database setup complete using sudo method!"
    echo ""
    echo "📝 Next steps:"
    echo "   1. Start the backend server:"
    echo "      cd /home/anas/anas/dev-ops/taskmaster-pro/backend"
    echo "      npm run dev"
    echo ""
    echo "   2. The server will automatically create all tables on first run."
    exit 0
fi

# Try method 2: mysql -u root -p (password-based)
echo ""
echo "Sudo method didn't work. Trying password-based method..."
echo "You'll be prompted for MySQL root password."
echo ""

if mysql -u root -p <<EOF; then
-- Create database
CREATE DATABASE IF NOT EXISTS ${DB_NAME} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create user
CREATE USER IF NOT EXISTS '${DB_USER}'@'localhost' IDENTIFIED BY '${DB_PASSWORD}';

-- Grant privileges
GRANT ALL PRIVILEGES ON ${DB_NAME}.* TO '${DB_USER}'@'localhost';

-- Flush privileges
FLUSH PRIVILEGES;

-- Show success
SELECT 'Database ${DB_NAME} and user ${DB_USER} created successfully!' AS message;
EOF
    echo ""
    echo "✅ Database setup complete using password method!"
    echo ""
    echo "📝 Next steps:"
    echo "   1. Start the backend server:"
    echo "      cd /home/anas/anas/dev-ops/taskmaster-pro/backend"
    echo "      npm run dev"
    echo ""
    echo "   2. The server will automatically create all tables on first run."
    exit 0
fi

# If both methods fail
echo ""
echo "❌ Both authentication methods failed."
echo ""
echo "Please set up the database manually:"
echo ""
echo "1. Log into MySQL:"
echo "   sudo mysql"
echo ""
echo "2. Run these commands:"
echo "   CREATE DATABASE ${DB_NAME} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
echo "   CREATE USER '${DB_USER}'@'localhost' IDENTIFIED BY '${DB_PASSWORD}';"
echo "   GRANT ALL PRIVILEGES ON ${DB_NAME}.* TO '${DB_USER}'@'localhost';"
echo "   FLUSH PRIVILEGES;"
echo "   EXIT;"
echo ""
exit 1

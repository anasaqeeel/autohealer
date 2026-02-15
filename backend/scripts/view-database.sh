#!/bin/bash

# Quick script to view database and tables
# Usage: ./scripts/view-database.sh

DB_NAME="taskmaster_pro"
DB_USER="taskmaster_user"
DB_PASSWORD="taskmaster_password"

echo "📊 TaskMaster Pro Database Viewer"
echo "=================================="
echo ""

# Show all tables
echo "📋 Tables in database '${DB_NAME}':"
echo ""
mysql -u ${DB_USER} -p${DB_PASSWORD} ${DB_NAME} -e "SHOW TABLES;" 2>/dev/null || mysql -u ${DB_USER} -p ${DB_NAME} -e "SHOW TABLES;"

echo ""
echo ""

# Show table structures
echo "📐 Table Structures:"
echo ""

TABLES=$(mysql -u ${DB_USER} -p${DB_PASSWORD} ${DB_NAME} -e "SHOW TABLES;" -s -N 2>/dev/null || mysql -u ${DB_USER} -p ${DB_NAME} -e "SHOW TABLES;" -s -N)

for table in $TABLES; do
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "Table: $table"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    mysql -u ${DB_USER} -p${DB_PASSWORD} ${DB_NAME} -e "DESCRIBE $table;" 2>/dev/null || mysql -u ${DB_USER} -p ${DB_NAME} -e "DESCRIBE $table;"
    echo ""
done

echo ""
echo "💡 To view data in a table, use:"
echo "   mysql -u ${DB_USER} -p ${DB_NAME} -e \"SELECT * FROM users;\""
echo ""

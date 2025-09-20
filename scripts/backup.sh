#!/bin/bash

# Backup script for TaskFlow data

set -e

BACKUP_DIR="./backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="taskflow_backup_${TIMESTAMP}.tar.gz"

echo "📦 Creating backup..."

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Export Convex data (you'll need to implement this based on your Convex setup)
echo "💾 Backing up Convex data..."
# npx convex export --output ./temp_export.json

# Create compressed backup
echo "🗜️ Creating compressed backup..."
tar -czf "${BACKUP_DIR}/${BACKUP_FILE}" \
    --exclude=node_modules \
    --exclude=.git \
    --exclude=dist \
    --exclude=build \
    .

echo "✅ Backup created: ${BACKUP_DIR}/${BACKUP_FILE}"

# Clean up old backups (keep last 7 days)
echo "🧹 Cleaning up old backups..."
find $BACKUP_DIR -name "taskflow_backup_*.tar.gz" -mtime +7 -delete

echo "🎉 Backup completed successfully!"

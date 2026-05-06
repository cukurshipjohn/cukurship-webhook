#!/bin/bash
set -e
cd /home/ubuntu/apps/appwebservice
git pull origin main
npm install --production
pm2 restart cukurship-backend
echo "[DEPLOY] Sukses: $(date)"

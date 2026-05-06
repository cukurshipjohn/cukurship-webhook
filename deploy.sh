#!/bin/bash
set -e
APP_DIR="${APP_DIR:-/home/ubuntu/apps/appwebservice}"
cd "$APP_DIR"
git pull origin main
npm install --omit=dev
pm2 restart cukurship-backend
echo "[DEPLOY] Sukses: $(date)"

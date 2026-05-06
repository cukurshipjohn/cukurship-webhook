'use strict';
const express = require('express');
const { exec } = require('child_process');
const crypto = require('crypto');
const app = express();
const PORT = process.env.PORT || 9000;
const SECRET = process.env.WEBHOOK_SECRET || 'chubayang123';
const DEPLOY_SCRIPT = process.env.DEPLOY_SCRIPT || '/home/ubuntu/webhook/deploy.sh';

app.use(express.raw({ type: 'application/json' }));

app.post('/webhook', (req, res) => {
  const sig = req.headers['x-hub-signature-256'] || '';
  const hash = 'sha256=' + crypto.createHmac('sha256', SECRET).update(req.body).digest('hex');

  try {
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(hash))) {
      console.log('[WEBHOOK] Signature invalid!');
      return res.status(401).send('Unauthorized');
    }
  } catch (e) {
    return res.status(401).send('Unauthorized');
  }

  res.status(200).send('OK');

  const payload = JSON.parse(req.body);
  console.log(`[WEBHOOK] Push detektasi: ${payload.repository?.name} - ${payload.ref}`);

  exec(`/bin/bash ${DEPLOY_SCRIPT}`, (err, stdout, stderr) => {
    if (err) return console.error('[DEPLOY] Error:', stderr);
    console.log('[DEPLOY]', stdout);
  });
});

app.get('/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

app.listen(PORT, () => console.log(`[WEBHOOK] Server berjalan di port ${PORT}`));
#!/usr/bin/env bash
pm2 stop monitor:vote
NODE_ENV=production pm2 start dist/index.js --name monitor:vote  -- vote

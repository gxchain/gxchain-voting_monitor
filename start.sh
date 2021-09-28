#!/usr/bin/env bash
pm2 stop monitor:vote
pm2 start dist/index.js --name monitor:vote  -- vote

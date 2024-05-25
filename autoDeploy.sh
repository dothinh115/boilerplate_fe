#!/bin/bash
YARN_PATH=/usr/local/bin/yarn
PM2_PATH=/root/.nvm/versions/node/v18.18.2/bin/pm2

export NVM_DIR="/root/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

NODE_VERSION=$(node -v)

if [ "$NODE_VERSION" != "v18.18.2" ]; then
nvm install 18.18.2 
wait
nvm use 18.18.2
wait
fi

cd /var/www/truyenhot_admin
git reset --hard HEAD
wait
git fetch origin
wait

CHANGES=$(git log HEAD..origin/main --oneline)
wait
if [ -n "$CHANGES" ]; then
    git pull origin main
    $YARN_PATH install
    wait
    $YARN_PATH build
    wait
    $PM2_PATH stop admin 
    wait
    $PM2_PATH delete admin
    wait
    export PORT=4000
    wait
    $PM2_PATH start "ecosystem.config.cjs"
    wait
fi


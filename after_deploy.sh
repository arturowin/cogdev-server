#!/usr/bin/env bash
cd /root/coglite_backend

sudo npm i

gulp build

pm2 restart all

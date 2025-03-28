#!/bin/sh

set -e

systemctl stop privatedrive.service

cd $(dirname "$0")
git pull

cd Frontend
npm install
npm run build
cd ..

rm -rf /Backend/public/*
cp -r /Frontend/dist/private-drive-front/browser/* /Backend/public/


systemctl restart privatedrive.service
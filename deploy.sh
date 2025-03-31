#!/bin/sh

set -e

systemctl stop privatedrive.service

cd $(dirname "$0")
git pull

cd Backend
npm install
cd ..

curl -s https://api.github.com/repos/piotrw01/PrivateDriveFront/releases/latest \
| grep "browser_download_url" \
| head -n 1 \
| sed -E 's/.*"browser_download_url": "(.*)".*/\1/' \
| xargs curl -L -o frontend.zip

rm -rf Backend/public/*
7z x frontend.zip -o./Backend/public/
rm frontend.zip


systemctl restart privatedrive.service

#!/usr/bin/env bash
echo '====rm======'
rm -rf dist.zip
echo '====build======'
npm run build
echo '====zip======'
zip dist.zip -r dist/*
echo 'delete dist'
rm -rf dist
echo 'upload...'
scp -r dist.zip zm-admin-web@119.23.200.193:/home/zm-admin-web/
echo 'upload success...'
echo 'login...'
ssh zm-admin-web@119.23.200.193

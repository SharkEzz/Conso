#!/bin/sh

cd front
npm i
npm run build
cd ..
go build .
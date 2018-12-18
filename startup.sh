#!/bin/sh
docker build -t block .
cd server
docker build -t blockserv .
cd ..
docker-compose up

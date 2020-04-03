#!/bin/bash

ssh-keygen -q -N "" -t rsa -b 4096 -m PEM -f $PWD/jwtRS256.key

openssl rsa -in jwtRS256test.key -pubout -outform PEM -out jwtRS256.key.pub 2>/dev/null
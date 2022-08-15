#!/bin/sh
if [ -d "node_modules/" ];then
    clear & electron .
else
    npm install
    clear & electron .
fi
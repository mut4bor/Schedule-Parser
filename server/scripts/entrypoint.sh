#!/bin/bash
if [ -f "scripts/.lock" ]; then
    npm i
    npm run refresh
    rm -rf scripts/.lock
    npm start
else 
    npm start
fi

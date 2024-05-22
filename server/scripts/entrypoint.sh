#!/bin/bash
if [ -f "scripts/.lock" ]; then
    npm i
    mkdir docs/XLSXFiles -p    
    npm run refresh
    rm -rf scripts/.lock
    npm start
else 
    npm start
fi

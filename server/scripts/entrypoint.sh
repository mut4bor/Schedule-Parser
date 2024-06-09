#!/bin/bash
if [ -f "scripts/.lock" ]; then
    npm i
    mkdir docs/XLSXFiles -p    
    npm run update
    rm -rf scripts/.lock
    npm run dev
else 
    npm run dev
fi

#!/bin/bash
if [ -f "scripts/.lock" ]; then
    npm i --prefix /server
    npm i --prefix /client
    rm -f /server/scripts/.lock
    exit 0
else
    npm run dev
fi

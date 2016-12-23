#!/bin/bash
APPROOT="/home/pi/webapps/home"
forever stop --sourceDir $APPROOT --workingDir $APPROOT --workingDir $PWD -t $APPROOT"/server.js"
#!/bin/bash
forever stop --sourceDir $PWD --workingDir $PWD -t ~/webapps/home/server.js
forever stop --sourceDir $PWD --workingDir $PWD -t ~/webapps/home/wemo.js
forever stop --sourceDir $PWD --workingDir $PWD -t ~/webapps/home/jobs.js

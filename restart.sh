#!/bin/bash
forever stop --sourceDir $PWD --workingDir $PWD -t ~/webapps/home/server.js
forever stop --sourceDir $PWD --workingDir $PWD -t ~/webapps/home/wemo.js
forever stop --sourceDir $PWD --workingDir $PWD -t ~/webapps/home/jobs.js
rm $PWD/logs/*.log
forever start -a --sourceDir $PWD --workingDir $PWD -l logs/log.log -e logs/error.log server.js
forever start -a --sourceDir $PWD --workingDir $PWD -l logs/log.log -e logs/error.log wemo.js
forever start -a --sourceDir $PWD --workingDir $PWD -l logs/jobs.log -e logs/error.log jobs.js

#!/bin/bash
rm $PWD/logs/*.log
forever start -a --sourceDir $PWD --workingDir $PWD -l logs/log.log -e logs/error.log server.js
forever start -a --sourceDir $PWD --workingDir $PWD -l logs/log.log -e logs/error.log wemo.js
forever start -a --sourceDir $PWD --workingDir $PWD -l logs/jobs.log -e logs/error.log jobs.js

// Imported Modules
var Service = require.main.require('./helpers/service.js');
var SensorMonitor = require.main.require('./helpers/sensor-monitor.js');
var house = require('./helpers/house-status.js');

var sensorMonitor = new SensorMonitor(house);
sensorMonitor.start();		

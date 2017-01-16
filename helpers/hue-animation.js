var conf = require('../config');



var HueAnimation = (function() {
	// App configs
	this.host = conf.hueHost;
	this.username = conf.hueUsername;
	this.api = null;
	this.intervalMax = 50;
	this.transitionWaitMin = 300;

	// Hue API variables
	this.hueAPI = null;
	this.lightState = null;

	// State variables
	this.initialState = {};
	this.state = null;
	this.intervalCount = 0;
	this.currentLightState = {};

	// Constructor
	this.con = function(){
		var hue = require("node-hue-api");
		this.lightState = hue.lightState;
		this.api = new hue.HueApi(this.host,this.username);
		this.state = this.lightState.create();
	};

	// Returns a color state for the given light selected randomly between
	// red, white, and blue. The color state returned will not be the current color.
	this.getRandomColorState = function(light){
		var color = null;
		var colorState = null;
		if(typeof this.currentLightState[light] === undefined){
			this.currentLightState[light] = "white";
		}
		// Generate a random color until it does not match the current color.
		do {
			var randomNumber = Math.floor(Math.random() * 3) + 1;
			if(randomNumber == 1){
				color = "red";
				colorState = this.state.rgb(255, 0, 0).transitionInstant();
			} else if(randomNumber ==2){
				color = "blue";
				colorState = this.state.rgb(0, 0, 255).transitionInstant();
			} else {
				color = "white";
				colorState = this.state.rgb(255, 255, 255).transitionInstant();
			}
		} while (this.currentLightState[light] == color);
		return colorState;
	};

	this.createInitialStatusPromise = function(light){
		var self = this;
		return new Promise(function(resolve,reject){
			self.api.lightStatus(light,function(err, result){
				if(err){
					reject(err);
				} else {
					result.state.lightNumber = light;
					resolve(result.state);
				}
			});
		});
	};

	this.setInitialState = function(lightList){
		var self = this;
		var promiseList = [];
		for(var i =0; i < lightList.length; i++){
			promiseList.push(this.createInitialStatusPromise(lightList[i]));
		}
		return Promise.all(promiseList).then(function(values){
			for(var i =0; i < values.length; i++){
				self.initialState[values[i].lightNumber] = values[i];
			}
		}).catch(function(reason){
			console.log(reason);
		});
	};

	this.panic = function(duration){
		if(duration){
			this.intervalMax = 2 * 5 * duration;
		}
		var self = this;
		var lowerLampOff = this.lightState.create().off().transitionInstant();
		var lampsOn = this.lightState.create().on().rgb(255, 255, 255).bri(255).sat(255).transitionInstant();
		var startingStates = [];
		startingStates[0] = this.api.setLightState(1, lampsOn);
		startingStates[1] = this.api.setLightState(3, lampsOn);
		startingStates[2] = this.api.setLightState(4, lowerLampOff);
		return Promise.all(startingStates).then(function(test){
			self.panicChange(1);
			setTimeout(function(){
				self.panicChange(3);
			}, 150);
		}).catch(function(reason){
			console.log(reason);
		});
	};

	this.trigger = function(mode, duration){
		var self = this;
		this.setInitialState([1,3,4]).then(function(){
			if(mode == "panic"){
				self.panic(duration);
			}
		}).catch(function(reason){
			console.log(reason);
		});
	};

	this.panicChange = function(light){
		this.intervalCount++;
		self = this;
		setTimeout(function(){
			if(self.intervalCount == self.intervalMax){
				self.intervalCount++;
				try {
						self.restoreInitialState();
					} catch (e){
						console.log(e);
						var util = require('util');
						console.log(util.inspect(this,{ showHidden: true, depth: null }));						
					}
			} else if(self.intervalCount < self.intervalMax) {
				self.api.setLightState(light, self.getRandomColorState()).then(function(){
					try {
						self.panicChange(light);
					} catch (e){
						console.log(e);
						var util = require('util');
						console.log(util.inspect(this,{ showHidden: true, depth: null }));
					}
				}).done();
			}
		}, self.transitionWaitMin);
	};

	this.restoreInitialState = function(){

		for(var light in this.initialState){
			if(this.initialState.hasOwnProperty(light)){
				var state = this.initialState[light];
				self.api.setLightState(
					light, 
					this.lightState
						.create()
						.on(state.on)
						.bri(state.bri)
						.hue(state.hue)
						.sat(state.sat)
						.xy(state.xy)
				);
			}	
		}
	};

	return this.con();
});

module.exports = HueAnimation;



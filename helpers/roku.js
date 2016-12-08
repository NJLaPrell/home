module.exports = {

	cmd: null,

	executeCommand: function(cmd, response){
		this.cmd = cmd;
		self = this;
		switch(this.cmd){

			case "ping":
			this.sendRequest("/input?a=b", "POST", response);
			break;

			case "wake":
			this.executeCommand("turn-off-screen", response);
			break;

			case "power-on":
			self.executeCommand("home", function(response){
				var doItAgain = setTimeout(function(response){
					self.executeCommand("home", response);
				}, 400);
			});
			break;

			case "power-off":
			this.getPowerStatus(function(status){
				if(status===null){
					response({
						status:500,
              			message: "The TV is not responding."
              		});
				} else if(status){
					self.executeCommand("turn-off-screen", response);
				} else {
					response({
						status:200,
              			message: "The TV is already off."
              		});
				}
			});
			break;

			case "turn-off-screen":
			this.sendRequest("/launch/dev", "POST", response);
			break;


			case "power":
			this.sendRequest("/keypress/power", "POST", response);
			
			break;

			case "netflix":
			this.sendRequest("/launch/12", "POST", response);
			break;

			case "amazon":
			this.sendRequest("/launch/13", "POST", response);
			break;

			case "hulu":
			this.sendRequest("/launch/2285", "POST", response);
			break;

			case "plex":
			this.sendRequest("/launch/13535", "POST", response);
			break;

			case "home":
			this.sendRequest("/keypress/home", "POST", response);
			break;

			// The method doesn't exist.
			default:
				response({
					status:404,
					message: "Method Not Found - The TV command '" + cmd + "' does not exist."
				});
			break;
		}

	},

	getPowerStatus: function(response){
		this.sendRequest("/query/device-info", "GET", function(res){
			var parseString = require('xml2js').parseString;
			parseString(res.body, function (err, result) {
				var power = null;
				if(result){
					power = result["device-info"]["power-mode"][0] == 'PowerOn' ? true : false;
				}
                response(power);
              });

		});
	},

	getScreenSaverMode: function(response){
		this.sendRequest("/query/active-app", "GET", function(res){
			var parseString = require('xml2js').parseString;
			parseString(res.body, function (err, result) {
				var screensaver = null;
				if(result){
					screensaver = typeof result["active-app"].screensaver === 'undefined' ? false : true;
				}
                response(screensaver);
              });
		});
	},

	sendRequest: function(path, method, response){
		var conf = require('../config');
		var ops = {
			host: conf.rokuIP,
			port: conf.rokuPort,
			timeout: 1000,
			method: method,
			path: path
		};
		var http = require('http');
		
		var self = this;

		http.request(ops,function(res){
			var body = '';
            res.on('data', function(chunk) {
              body += chunk;
            });
            res.on('end', function(){
              response({
              	status:200,
              	message: "Success - The TV command '" + self.cmd + "' has been executed.",
              	body: body
              });
            });
		}).on('error', function(){
			response({status:500, message:"Unknown Error - The HTTP request to Roku failed."});
		}).end();
	}


};
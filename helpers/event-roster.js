module.exports = {
	"trigger-edimax-switch": {
		description: "Triggers Edimax switches on or off.",
		type: "Trigger",
		args: {
			name: "The name of the switch to toggle.",
			direction: "\"on\" or \"off.\""
		}
	},
	"trigger-hue-lights": {
		description: "Triggers Hue light states for on/off, brightness, color, preset colors, and supported custom scenes.",
		type: "Trigger",
		args: {
			lightID: "Numeric representation of the light to be controlled.",
			direction: "\"on\" or \"off\" to toggle the light.",
			bri: "Brightness level",
			rgb: "RGB value object. Should contain numeric values for r, g, and b.",
			colorPreset: "Named value of an RGB preset defined in the config.",
			christmasMode: "Toggles Christmas preset colors."
		}
	},
	"startup-complete": {
		description: "Server startup sequence has completed.",
		type: "Internal"
	},
	"poll-ups": {
		description: "UPS status poll event with data from the UPS status.",
		type: "Poll Results",
		args: {
			status: "ONLINE or ONBATT",
			startTime: "Date/Time",
			lineVoltage: "Voltage value",
			loadPercent: "Load percentage",
			batteryCharge: "Percent remaining",
			timeLeft: "In minutes",
			batteryVoltage: "Battery voltage",
			timeOnBattery: "In seconds"
		}	
	},
	"poll-internet-connectivity": {
		description: "Indicates whether the house is connected to the internet.",
		type: "Poll Results",
		args: {
			pass: "Boolean true when the internet is connected and false when it is not."
		}
	},
	"weather-status": {
		description: "Weather data retrieved from openweathermap.org.",
		type: "status",
		args: {
			description: "Abreviated description of current conditions.",
			temp: "Degrees F",
			humidity: "Percent",
			wind: "MPH",
			clouds: "Percent coverage",
			icon: "Icon name to use for current weather.",
			sunrise: "Unix time representation of the time for today's sunrise.",
			sunset: "Unix time representation of the time for today's sunset."
		}
	},
	"tv-status": {
		description: "Status data for the state of the TV.",
		type: "status",
		args: {
			status: "Status value (on/off/sleeping)."
		}
	},
	"status-hueLightStates": {
		description: "Status of all Hue lights. Sends a Hue status object",
		type: "status"
	},
	"switchStatus": {
		description: "Edimax switch status.",
		type: "status",
		args: {
			PLUGNAME: "Boolean representing the on/off status of the switch."
		}
	},
	"sunset": {
		description: "Fires when the sun sets according to the weather API.",
		type: "environmental"
	},
	"sunrise": {
		description: "description",
		type: "environmental"
	},
	"location": {
		description: "description",
		type: "environmental",
		args: {
			person: "nick/brenda",
			location: "home/away"
		}
	},
	"email-received": {
		description: "Email received. Args represent the mail object.",
		type: "type"
	},
	"trigger-hueAnimation": {
		description: "description",
		type: "type",
		args: {
			panic: "Boolean. Triggers panic animation."
		}
	},
	"lutron-changed": {
		description: "Lutron device changed",
		type: "environmental",
		args: {
			lightID: "ID of the Lutron device that was controlled.",
			brightness: "New brightness value."
		}
	},
	"trigger-lutron": {
		description: "Lutron device triggered by the home app.",
		type: "environmental",
		args: {
			light: "Light ID",
			direction: "on/off"
		}
	},
	"motion-while-away": {
		description: "Motion detected while the house was unoccupied.",
		type: "environmental"
	},
	"hue-toggled": {
		description: "Hue light turned on or off by the home app.",
		type: "environmental",
		args: {
			lightID: "Integer ID of the light changed.",
			direction: "on/off"
		}
	},
	"hue-brightness-changed": {
		description: "Hue light brightness was changed by the home app.",
		type: "environmental",
		args: {
			lightID: "Integer ID of the light changed.",
			bri: "Hue brightness level."
		}
	},
	"hue-color-changed": {
		description: "Hue light color was changed by the home app.",
		type: "environmental",
		args: {
			lightID: "Integer ID of the light changed.",
			rgb: "Array of RGB values 0-255"
		}
	},
	"RDP": {
		description: "An RDP Connection was made to 192.168.0.25",
		type: "environmental"
	},
	"weather": {
		description: "Event fired by IFTTT for rain or freezing events.",
		type: "environmental",
		args: {
			status: "rain/freezeing"
		}
	}
};
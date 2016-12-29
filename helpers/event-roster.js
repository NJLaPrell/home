module.exports = {
	"trigger-toggleSwitch": {
		description: "Triggers Edimax switches on or off.",
		type: "trigger",
		args: {
			name: "The name of the switch to toggle.",
			direction: "\"on\" or \"off.\""
		}
	},
	"trigger-hueLights": {
		description: "Triggers Edimax switches on or off.",
		type: "trigger",
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
		type: "internal"
	},
	"ups-status": {
		description: "UPS status poll event with data from the UPS status.",
		type: "status",
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
	"internetCheck": {
		description: "Indicates whether the house is connected to the internet.",
		type: "status",
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
	"gps": {
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
	}
};
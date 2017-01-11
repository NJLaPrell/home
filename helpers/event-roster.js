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
	"poll-weather": {
		description: "Weather data retrieved from openweathermap.org.",
		type: "Poll Results",
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
	"poll-tv": {
		description: "Status data for the state of the TV.",
		type: "Poll Results",
		args: {
			status: "Status value (on/off/sleeping)."
		}
	},
	"poll-hue": {
		description: "Status of all Hue lights. Sends a Hue status object",
		type: "Poll Results"
	},
	"poll-edimax-switch": {
		description: "Edimax switch status.",
		type: "Poll Results",
		args: {
			PLUGNAME: "Boolean representing the on/off status of the switch."
		}
	},
	"sunset": {
		description: "Fires when the sun sets according to the weather API.",
		type: "Environmental"
	},
	"sunrise": {
		description: "description",
		type: "Environmental"
	},
	"location": {
		description: "description",
		type: "Environmental",
		args: {
			person: "nick/brenda",
			location: "home/away"
		}
	},
	"email-received": {
		description: "Email received. Args represent the mail object.",
		type: "Internal"
	},
	"trigger-hue-animation": {
		description: "description",
		type: "Trigger",
		args: {
			panic: "Boolean. Triggers panic animation."
		}
	},
	"lutron-changed": {
		description: "Lutron device changed",
		type: "Environmental",
		args: {
			lightID: "ID of the Lutron device that was controlled.",
			brightness: "New brightness value."
		}
	},
	"trigger-lutron": {
		description: "Lutron device triggered by the home app.",
		type: "Trigger",
		args: {
			light: "Light ID",
			direction: "on/off"
		}
	},
	"motion-while-away": {
		description: "Motion detected while the house was unoccupied.",
		type: "Environmental"
	},
	"hue-toggled": {
		description: "Hue light turned on or off by the home app.",
		type: "Environmental",
		args: {
			lightID: "Integer ID of the light changed.",
			direction: "on/off"
		}
	},
	"hue-brightness-changed": {
		description: "Hue light brightness was changed by the home app.",
		type: "Environmental",
		args: {
			lightID: "Integer ID of the light changed.",
			bri: "Hue brightness level."
		}
	},
	"hue-color-changed": {
		description: "Hue light color was changed by the home app.",
		type: "Environmental",
		args: {
			lightID: "Integer ID of the light changed.",
			rgb: "Array of RGB values 0-255"
		}
	},
	"rdp": {
		description: "An RDP Connection was made to 192.168.0.25",
		type: "Environmental"
	},
	"weather": {
		description: "Event fired by IFTTT for rain or freezing events.",
		type: "Environmental",
		args: {
			status: "rain/freezeing"
		}
	},
	"lutron-connected": {
		description: "Fired one a Telnet connection is made to the Lutron hub and the username/password have been accepted.",
		type: "Internal"
	},
	"wemo-discovered": {
		description: "Fired by the Wemo service when a Wemo device is discovered at startup.",
		type: "Internal",
		args: {
			device: "Friendly device name",
			info: "deviceInfo object returned by the descovery method."
		}
	},
	"wemo-changed": {
		description: "Fired by the Wemo service when a Wemo device state changes.",
		type: "Environmental",
		args: {
			device: "Friendly device name",
			value: "binary state value"
		}
	},
	"trigger-wemo": {
		description: "Trigger to change the state of a wemo device. Currenly only supports binary state change.",
		type: "Trigger",
		args: {
			device: "Friendly device name",
			value: "binary state value"
		}
	},
	"house-occupied": {
		description: "Triggered when one or more people arrive home when the house was previously unoccupied.",
		type: "Environmental"
	}
	,
	"house-unoccupied": {
		description: "Triggered when a person leaves and there are no others in the house.",
		type: "Environmental"
	},
	"sensor-monitor-started": {
		description: "The sensor monitor has been started",
		type: "Internal"
	},
	"sensor-reported": {
		description: "A sensor value has been reported",
		type: "Environmental",
		args: {
			sensorID: "The name/ID of the sensor reporting.",
			value: "The value reported by the sensor"
		}
	},
	"sensor-temp-1": {
		description: "The first temperature sensor monitor.",
		type: "Sensor Data",
		args: {
			value: "The average of the last 10 reported values."
		}
	},
	"sensor-connected": {
		description: "A sensor has been connected",
		type: "Internal",
		args: {
			sensorID: "Name/ID of the sensor connecting."
		}
	}
};
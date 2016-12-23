module.exports = {
	debug: false,
	port: 8080,
	uName: "***USERNAME FOR REST INTERFACE***",
	uPass: "***PASSWORD FOR DASHBOARD USER***",
	password: "***PASSWORD FOR REST INTERFACE***",
	rokuIP: "192.168.x.xx",
	rokuPort: 8060,
	localIP: "*** IP ADDRESS OF THIS MACHINE ***",
	hueHost: "192.168.x.xx",
	hueUsername: "*************",
	weatherAPIKey: "12303b8b619db0b9cc89fa46f4871850",
	nicksPhoneIP: '*** IPHONE IP FOR LOCATION TRACKING ***',
	brendasPhoneIP: '*** IPHONE IP FOR LOCATION TRACKING ***',
	lutron: {
		host: '192.168.x.xx',
		username: 'lutron',
		password: 'integration',
		dimmers: [
			{
				id:4,
				name: 'Hallway'
			},
			{
				id:2,
				name: 'Kitchen'
			}
		]
	},
	textAlert: {
		subject: "#TXTAlert",
		smtpEnvelope: {
			from: 'foo@bar.com',
			to: 'trigger@applet.ifttt.com'
		},
		smtpAuth: {
			user: '***********',
			pass: '***********'
		},
		smtpConfig: {
			port: 465,
			host: 'smtp.gmail.com',
			secure: true
		}
	},
	imap: {
		username: "foo@bar.com",
		password: "************",
		host: "imap.somehost.org",
		port: 993,
		tls: true,
		//debug: console.log,
		tlsOptions: { rejectUnauthorized: false },
		mailbox: "INBOX",
		searchFilter: ["UNSEEN"],
		markSeen: true,
		fetchUnreadOnStart: false,
		mailParserOptions: {streamAttachments: false}, // options to be passed to mailParser lib.
		attachments: false // download attachments as they are encountered to the project directory
		//attachmentOptions: { directory: "attachments/" } // specify a download directory for attachments
	},
	minDebugHistory: 100,
	maxDebugHistory: 200,
	smartPlugConfig: {
		timeout: 5000,
		username: '********',
		password: '********',
		plugs: [
			{
				name: 'Test Plug',
				host: '192.168.x.xx'
			},
			{
				name: 'Tiffany Lamp',
				host: '192.168.x.xx'
			},
			{
				name: 'Christmas Lights 1',
				host: '192.168.x.xx'
			},
			{
				name: 'Christmas Lights 2',
				host: '192.168.x.xx'
			}
		]
	},
	deviceLayout: [
		{
			room: 'Front Porch',
			devices: [
				{
					name: 'Christmas Lights 1',
					type: 'edimax-switch',
					identifyer: 'Christmas Lights 1'
				},
				{
					name: 'Christmas Lights 2',
					type: 'edimax-switch',
					identifyer: 'Christmas Lights 2'
				}
			]
		},
		{
			room: 'Living Room',
			devices: [
				{
					name: 'Left Lamp',
					type: 'hue-color',
					identifyer: 3
				},
				{
					name: 'Right Lamp',
					type: 'hue-color',
					identifyer: 1
				},
				{
					name: 'Right Lower Lamp',
					type: 'hue',
					identifyer: 4
				}
			]
		},
		{
			room: 'Master Bedroom',
			devices: [
				{
					name: 'Lamp',
					type: 'hue-color',
					identifyer: 2
				},
				{
					name: 'Lower Lamp',
					type: 'hue',
					identifyer: 5
				},
				{
					name: 'Tiffany Lamp',
					type: 'edimax-switch',
					identifyer: 'Tiffany Lamp'
				}
			]
		},
		{
			room: 'Hallway',
			devices: [
				{
					name: 'Light',
					type: 'caseta-dimmer',
					identifyer: 4
				}
			]
		},
		{
			room: 'Kitchen',
			devices: [
				{
					name: 'Light',
					type: 'caseta-dimmer',
					identifyer: 2
				}
			]
		}
	]
};
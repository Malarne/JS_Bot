const { Client } = require('discord.js');
const Handlers = require('./Handlers.js');
const path = require('path');
const { PlayerManager } = require('../lavalib/index.js');
/**
* @param {String} token The client's token uses to authorize the client.
* @param {Object} clientOptions Apply client options such as: disableEveryone.
*/
class Park extends Client {
	constructor(token, clientOptions, config, lavalinkconfig) {
		super(clientOptions);
		this.token = token;
		this.config = config;
		this.lavalinkconfig = lavalinkconfig;
		this.player = null;
		this.handlers = new Handlers(this, {
			events:path.join(__dirname, '..', 'Events'),
			commands: path.join(__dirname, '..', 'Commands'),
		});
		this.once('ready', this._ready.bind(this));
	}

	_ready() {
		this.player = new PlayerManager(this, this.lavalinkconfig.nodes, {
			user: this.user.id,
			shards: 1,
		});
		console.log('Music Client is Ready!');
	}

	connect() {
		this.login(this.token).catch(console.error); // Auth to the API & WS
		this.handlers.eventsHandler(); // Handle events
		this.handlers.commandsHandler(); // Handle commands
		return this;
	}
}

module.exports = Park;

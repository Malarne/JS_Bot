const config = require('./Private/config.json');
const Park = require('./Models/Park');
const lavalink = require('./Private/lavalink.json');

const client = new Park(config.token, { disableEveryone: true }, config, lavalink);

client.connect();

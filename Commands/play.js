const unirest = require('unirest');
const config = require('../Private/lavalink.json');
const defaultRegions = {
	asia: ['sydney', 'singapore', 'japan', 'hongkong'],
	eu: ['london', 'frankfurt', 'amsterdam', 'russia', 'eu-central', 'eu-west'],
	us: ['us-central', 'us-west', 'us-east', 'us-south', 'brazil'],
};

const play = async (client, message, args) => {
	if (!message.member || !message.member.voice.channel) return message.reply('Must be in a voice channel');
	let [...track] = args;
	track = track.join(' ');
	if (!track.indexOf('https') == 1) {
		if (!track.indexOf(' ') == 0) {
			track = track.split(' ').join('');
		}
	}
	else {
		if (!track.indexOf('ytsearch:') == 1) track = 'ytsearch:' + track;
	}
	const [song] = await getSong(track);
	const player = await client.player.join({
		guild: message.guild.id,
		channel: message.member.voice.channel.id,
		host: getIdealHost(client, message.guild.region),
	}, { selfdeaf: false });
	if (!player) throw 'No player found...';
	if (player.playing) {
		player.queue.push(track);
		return message.reply(`${track} was added to the queue !`);
	}
	player.play(song.track);
	player.once('error', console.error);
	player.once('end', data => {
		message.channel.send('Song has ended...');
		if (!player.queue.length == 0) {
			const next = player.queue.splice(0, 1);
			play(client, message, next);
		}
		else {
			player.leave(message.guild.id);
		}
	});
	return message.reply(`Now playing: **${song.info.title}** by *${song.info.author}*`);
};

async function getSong(string) {
	try {
		const res = await request('GET', `http://${config.restnode.host}:${config.restnode.port}/loadtracks`, { 'identifier': string }, { 'Authorization': config.restnode.password });
		if (!res) throw 'There was an error, try again';
		if (!Object.keys(res.body).length) throw 'No tracks found';
		return res.body.tracks;
	}
	catch (e) {
		console.error(e);
	}
}

function getRegion(client, region) {
	region = region.replace('vip-', '');
	for (const key in defaultRegions) {
		const nodes = client.player.nodes.filter(node => node.connected && node.region === key);
		if (!nodes) continue;
		for (const id of defaultRegions[key]) {
			if (id === region || region.startsWith(id) || region.includes(id)) return key;
		}
	}
	return 'asia';
}

function getIdealHost(client, region) {
	region = getRegion(client, region);
	const foundNode = client.player.nodes.find(node => node.ready && node.region === region);
	if (foundNode) return foundNode.host;
	return client.player.nodes[0].host;
}

function request(method, url, querystring, headers) {
	return new Promise((res, rej) => {
		const req = unirest[method.toLowerCase()](url);

		if (typeof querystring !== 'object') {
			rej('Querystring must be an object!');
		}
		else {
			const qsKeys = Object.keys(querystring);
			qsKeys.forEach(key => {
				req.query({
					[key]: querystring[key],
				});
			});
		}

		if (typeof headers !== 'object') {
			rej('Headers must be an object!');
		}
		else {
			req.headers(headers);
		}

		req.end(response => {
			if (response.error) {
				rej(response.error);
			}
			else {
				res(response);
			}
		});
	});
}

module.exports = play;

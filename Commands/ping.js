const run = async (client, msg, args) => {
	const m = await msg.channel.send('Ping?');
	m.edit(`Pong! Latency is ${m.createdTimestamp - msg.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`)
		.catch(console.error);
};
module.exports = run;

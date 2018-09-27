const message = async (client, msg) => {
	if (msg.author.bot || !msg.guild || !msg.content.startsWith(client.config.prefix)) return;

	const args = msg.content.slice(client.config.prefix.length).trim().split(/ +/g);
	const command = args.shift();

	const commands = client.handlers.commands;
	if (commands.get(command)) {
		commands.get(command).run(client, msg, args).catch(console.error);
	}
};

module.exports = message;

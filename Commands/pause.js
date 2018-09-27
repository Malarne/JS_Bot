const pause = async (client, message, args) => {
	const player = client.player.get(message.guild.id);
	if (!player) return message.reply('No lavalink player found');
	await player.pause(true);
	return message.reply('Paused the music');
};

module.exports = pause;

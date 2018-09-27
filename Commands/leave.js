const leave = async (client, message, args) => {
	await client.player.leave(message.guild.id);
	return message.reply('Successfully left the voice channel');
};

module.exports = leave;

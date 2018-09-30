const volume = async (client, message, args) => {
	const player = client.player.get(message.guild.id);
	if (isNaN(args[0])) return message.reply('Volume takes a number as argument !');
	const vol = args[0];
	if (vol > 100 || vol < 0) return message.reply('Volume should be between 1 and 100 !');
	player.volume(parseInt(vol));
	message.reply(`Volume is now ${vol}%`);
};

module.exports = volume;

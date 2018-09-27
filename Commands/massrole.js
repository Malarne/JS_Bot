const massrole = async (client, msg, args) => {
	const mention = msg.mentions.first();
	if (!mention) {
		let role = msg.guild.roles.get(args[0]);
		if (!role) {
			role = msg.guilds.roles.filter(r => r.name === args.join(' '));
			if (!role) {
				return msg.reply('Merci de bien me donner une mention, un id ou un nom de role valide.');
			}
		}
		msg.guild.members.forEach(function(member) {
			member.addRole(role);
		});
	}
	msg.guild.members.forEach(function(member) {
		member.addRole(mention);
	});
};

module.exports = massrole;

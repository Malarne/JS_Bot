const unirest = require('unirest');
const config = require('../Private/config.json');

function slowset(channel, value) {
	// Fonction d'aide, pour eviter de copier coller tout ce bordel a chaque fois qu'on veut modifier la valeur
	const headers = {
		Authorization: 'Bot ' + config.token,
		'User-agent': 'Slowmode cog',
		'Content-type': 'application/json',
	};
	// J'ai utilisé unirest pour envoyer la requete patch, npm i unirest pour l'installer, sinon n'importe quelle lib pour envoyer une requete patch marchera aussi
	unirest.patch(`https://discordapp.com/api/channels/${channel.id}`)
		.headers(headers)
		.send({ 'rate_limit_per_user': value });
}

const slowmode = async (client, msg, args) => {
	// uniquement accessible si l'auteur de la commande a la permission "Gerer les messages", si l'on a un nombre apres la commande, on va set le slowmode, si on a "off" on coupe le slowmode
	if (msg.member.hasPermission('MANAGE_CHANNELS')) {
		if (isNaN(args[0])) {
			if (args[0] == 'off') {
				slowset(msg.channel, 0);
				await msg.channel.send('Ce channel n\'est plus en slow mode. :snail:');
			}
		}
		else {
			const value = parseInt(args[0]);
			slowset(msg.channel, value);
			await msg.channel.send(`Ce channel a maintenant un slow mode. :snail: (${value} secondes)`);
		}
	}
};

module.exports = slowmode;

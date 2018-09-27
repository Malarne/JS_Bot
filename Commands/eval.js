const config = require('../Private/lavalink.json');
const { inspect } = require('util');

const eval = async (client, message, args) => {
	if (message.author.id !== config.owner) return;
	try {
		const code = args.join(' ');
		const evaled = eval(code);
		return message.channel.send(await clean(evaled), { code: 'js' });
	}
	catch (err) {
		return message.channel.send(`\`ERROR\` \`\`\`js\n${await clean(err)}\n\`\`\``);
	}
};

async function clean(text) {
	if (text instanceof Promise || (Boolean(text) && typeof text.then === 'function' && typeof text.catch === 'function')) text = await text;
	if (typeof text !== 'string') text = inspect(text, { depth: 0, showHidden: false });
	text = text.replace(/`/g, `\`${String.fromCharCode(8203)}`).replace(/@/g, `@${String.fromCharCode(8203)}`);
	return text;
}

module.exports = eval;

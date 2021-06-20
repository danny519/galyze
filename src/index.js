const Discord = require('discord.js');
const client = new Discord.Client({
    ws: { intents: 519 }
});
const config = require('../config.json');
const fs = require('fs');

client.commands = new Discord.Collection();
client.categories = new Discord.Collection();

const categoryFolders = fs.readdirSync('./commands').filter();

for (const category of categoryFolders) { // I SMELL MESSY CODE HUH

    const categoryPath = `./commands/${category}`;
    const commandCollection = new Discord.Collection();
    const commandFiles = fs.readdirSync(categoryPath);

    for (const file of commandFiles) {
        const command = require(`./commands/${file}`);

        client.commands.set(command.name, command);
        commandCollection.set(command.name, command);
    }

    client.categories.set(category, commandCollection);
    // set a new item in the Collection
    // with the key as the command name and the value as the exported module

}

client.on('ready', () => {

    console.log(`${client.user.username} is online!`)

})

client.on('message', (message) => {

    if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();

	if (!client.commands.has(command)) return;

	try {
		client.commands.get(command).execute(message, args);
	} catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}
});

client.login(config.token);
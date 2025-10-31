// Require the necessary discord.js and openai.js classes
const { Client, Events, GatewayIntentBits, MessageFlags, REST, Routes, Collection, Emoji } = require('discord.js');
const config = require('./config.json')
const fs = require('node:fs');
const path = require('node:path');

// Create a new client instance
// Requires GuildMessages and MessageContent for reading
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

// // Store commands
// var commands = new Collection;
// commands.set(pingCommand.name, { data: pingCommand, execute: pingExecute });
// console.log(client.commands)

// When the client is ready, run this code (only once)
client.once(Events.ClientReady, (readyClient) => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);

	// const rest = new REST().setToken(config["bot-token"]);
	// try {
	// 	console.log(`Started refreshing ${commands.length} application (/) commands.`);
	// 	// The put method is used to fully refresh all commands in the guild with the current set
	// 	const data = rest.put(Routes.applicationGuildCommands((config["client-id"]), (config["guild-id"])), { body: commands });
	// 	console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	// } catch (error) {
	// 	// And of course, make sure you catch and log any errors!
	// 	console.error(error);
	// }
});

// Note that === is a js notation for type checking
client.on("messageCreate", (msg) => {
	if (msg.author.bot) return; // makes sure it can't reply to itself
	
	if (msg.content === "ping")	{
		msg.reply("pong")
	}
	
	if (msg.content === "pin me")	{
		msg.pin()
	}

	if (msg.content.includes("fire"))	{
		msg.react("🔥")
	}
})

// const commands = []; 
// const foldersPath = path.join(__dirname, 'commands');
// const commandFolders = fs.readdirSync(foldersPath);

// for (const folder of commandFolders) {
// 	// Grab all the command files from the commands directory you created earlier
// 	const commandsPath = path.join(foldersPath, folder);
// 	const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));
// 	// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
// 	for (const file of commandFiles) {
// 		const filePath = path.join(commandsPath, file);
// 		const command = require(filePath);
// 		if ('data' in command && 'execute' in command) {
// 			commands.push(command.data.toJSON());
// 		} else {
// 			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
// 		}
// 	}
// }

// for (const folder of commandFolders) {
// 	const commandsPath = path.join(foldersPath, folder);
// 	const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));
// 	for (const file of commandFiles) {
// 		const filePath = path.join(commandsPath, file);
// 		const command = require(filePath);
// 		if ('data' in command && 'execute' in command) {
// 			// commands.set(command.data.name, command);
// 			commands.find(command.data.name) = command;
// 		} else {
// 			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
// 		}
// 		console.log(file)
// 	}
// }

// const eventsPath = path.join(__dirname, 'events');
// const eventFiles = fs.readdirSync(eventsPath).filter((file) => file.endsWith('.js'));
// for (const file of eventFiles) {
// 	const filePath = path.join(eventsPath, file);
// 	const event = require(filePath);
// 	if (event.once) {
// 		client.once(event.name, (...args) => event.execute(...args));
// 	} else {
// 		client.on(event.name, (...args) => event.execute(...args));
// 	}
// }

// Log in to Discord with your client's token
client.login(config["bot-token"]);

console.log('Ran all code')
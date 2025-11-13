// Require the necessary discord.js and openai.js classes
const { Client, Events, GatewayIntentBits, MessageFlags, REST, Routes, Collection, Emoji, TextChannel, SlashCommandBuilder } = require('discord.js');
const config = require('./config.json')
const fs = require('node:fs');
const path = require('node:path');
require('dotenv').config();
const { OpenAI } = require('openai');
const { Channel } = require('node:diagnostics_channel');

// Create a new client instance
// Requires GuildMessages and MessageContent for reading
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
const clientAI = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY
});

// When the client is ready, run this code (only once)
client.once(Events.ClientReady, async (readyClient) => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);

	// instantiates all commands and adds them to client
	const ping = new SlashCommandBuilder()
		.setName("ping")
		.setDescription("Returns pong!");
	const printlog = new SlashCommandBuilder()
		.setName("printlog")
		.setDescription("Prints all messages logged for this chat.");
	const ai = new SlashCommandBuilder()
		.setName("ai")
		.setDescription("Toggles the user to talk to AI! Only one at a time though.");
	const summarize = new SlashCommandBuilder()
		.setName("summarize")
		.setDescription("Summarizes the current chatlog");

	client.application.commands.create(ping)
	client.application.commands.create(printlog)
	client.application.commands.create(ai)
	client.application.commands.create(summarize)
});

var messages = []

var cur_ai_user = ""

// Note that === is a js notation for type checking
client.on("messageCreate", async (msg) => {
	let myDict = {} // handles message content in dictionary
	myDict.author = msg.author.globalName
	myDict.content = msg.content
	messages.push(
		myDict
	)

	if (msg.author.bot) return; // makes sure it can't reply to itself

	if (msg.author.globalName === cur_ai_user)	{ // allows talking to AI
		msg.react("🔄")
		msg.channel.send(await runAI("Here is the conversation log: " + JSON.stringify(messages) + 
			" ||| Given the conversation, respond to the following: " + msg.content))
		await msg.reactions.cache.get("🔄").users.remove(config["client-id"])
	}

	if (msg.content.includes("pin me"))	{ // pins the message
		msg.pin()
	}

	if (msg.content.includes("fire"))	{ // adds a fire emoji
		msg.react("🔥")
	}
})

async function runAI(input="")	{
	const response = await clientAI.responses.create({
		model: "gpt-5-mini",
		input: input,
		text: { verbosity: "low" },
		max_output_tokens: 700
	});
	return response.output_text
}

// handles all command interactions
client.on("interactionCreate", async (interaction) => {
	if (!interaction.isChatInputCommand()) return; // if not a commmand

	if (interaction.commandName === "ping")	{ // if ping, then pong
		interaction.reply("Pong!")
	}

	if (interaction.commandName === "printlog")	{ // if printlog, then print all msgs
		if (messages.length === 0)	{
			interaction.reply("Message log is empty")
		} else {
			interaction.reply(JSON.stringify(messages))
		}
	}

	if (interaction.commandName === "ai")	{ // sets current user to the one running the command
		if (cur_ai_user !== interaction.user.globalName)	{
			cur_ai_user = interaction.user.globalName
			interaction.reply("I am now listening to user " + cur_ai_user + ". Speak your truth king")
		} else {
			interaction.reply("Chat with user " + cur_ai_user + " has ended. Thanks for chatting!")
			cur_ai_user = ""
		}
	}

	if (interaction.commandName === "summarize")	{ // summarizes chat log
		if (messages.length === 0)	{
			interaction.reply("Message log is empty")
		} else {
			await interaction.deferReply()
			var response = await runAI("Summarize the following messages: " + JSON.stringify(messages))
			response = response
			await interaction.editReply(response)
		}
	}
})

// Log in to Discord with your client's token
client.login(config["bot-token"]);

console.log('Ran all code, and openai')
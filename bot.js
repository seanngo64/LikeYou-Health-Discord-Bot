// Require the necessary discord.js and openai.js classes
const { Client, Events, GatewayIntentBits, MessageFlags, REST, Routes, Collection, Emoji, TextChannel } = require('discord.js');
const config = require('./config.json')
const fs = require('node:fs');
const path = require('node:path');
require('dotenv').config();
const { OpenAI } = require('openai');
const { Channel } = require('node:diagnostics_channel');
const { SlashCommandBuilder } = require('discord.js');

// Create a new client instance
// Requires GuildMessages and MessageContent for reading
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
const clientAI = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY
});

// When the client is ready, run this code (only once)
client.once(Events.ClientReady, async (readyClient) => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});


// Note that === is a js notation for type checking
client.on("messageCreate", async (msg) => {
	if (msg.author.bot) return; // makes sure it can't reply to itself
	
	else if (msg.content === "ping")	{
		msg.reply("pong")
	}
	
	else if (msg.content.includes("pin me"))	{
		msg.pin()
	}

	else if (msg.content.includes("fire"))	{
		msg.react("🔥")
	}

	// TODO: implement /summarize for summarizing text threads. 
	// throws exception? for not threads, or caps length of reading 
	// and notes it in the response message
	else if (msg.content.startsWith("!AI")) {
		const response = await clientAI.responses.create({
			model: "gpt-5-mini",
			input: msg.content,
			reasoning: { effort: "minimal" },
			text: { verbosity: "low" },
			max_output_tokens: 100
		});
		msg.reply(response.output_text)
	}
})

// Log in to Discord with your client's token
client.login(config["bot-token"]);

console.log('Ran all code, and openai')
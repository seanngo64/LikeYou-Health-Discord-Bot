import { SlashCommandBuilder } from require('discord.js');

export const command = new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Lets you play ping pong!");

export async function execute(interaction) {
    await interaction.reply("pong")
}
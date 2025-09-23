import { SlashCommandBuilder, ChatInputCommandInteraction, MessageFlags, EmbedBuilder } from "discord.js";

module.exports = {
    data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("pong!"),
    async execute(interaction: ChatInputCommandInteraction){

        await interaction.reply({content: "pong", flags: MessageFlags.Ephemeral})
    }
}
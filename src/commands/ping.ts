import { SlashCommandBuilder, ChatInputCommandInteraction, MessageFlags, EmbedBuilder } from "discord.js";

module.exports = {
    data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("pong!"),
    async execute(interaction: ChatInputCommandInteraction){
        const temp = new EmbedBuilder()
            .setTitle("https://discord.com/channels/1344770314999173120/1354384385662517480/1418246626916434034")
            .setDescription("https://discord.com/channels/1344770314999173120/1354384385662517480/1418246626916434034")
            .setFields(
                {name: "https://discord.com/channels/1344770314999173120/1354384385662517480/1418246626916434034", "value" : "https://discord.com/channels/1344770314999173120/1354384385662517480/1418246626916434034"}
            )

        await interaction.reply({content: "pong", flags: MessageFlags.Ephemeral, embeds: [temp]})
    }
}
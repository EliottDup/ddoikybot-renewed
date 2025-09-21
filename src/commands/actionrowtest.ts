import { ActionRowBuilder, ButtonBuilder } from "@discordjs/builders";
import { ButtonStyle, ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("actionrowtest")
        .setDescription("a test for action row and stuffs."),
    async execute(interaction: ChatInputCommandInteraction){
        const buttn1 = new ButtonBuilder()
            .setCustomId("btn1")
            .setLabel("button 1")
            .setStyle(ButtonStyle.Primary);
        const row = new ActionRowBuilder()
            .addComponents(buttn1).toJSON();
        await interaction.reply({
            content: "test",
            components: [row],
        });
    }
}
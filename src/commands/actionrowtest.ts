import { ActionRowBuilder, ButtonBuilder, MessageActionRowComponentBuilder } from "@discordjs/builders";
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
        const row = new ActionRowBuilder<MessageActionRowComponentBuilder>()
            .addComponents(buttn1);
        await interaction.reply({
            content: "test",
            components: [row],
        });
    }
}
import { ButtonInteraction, MessageFlags } from "discord.js";

module.exports = {
    name: "deleteMessage:button:0",
    async execute(interaction: ButtonInteraction) {
        await interaction.message.delete();
        interaction.reply({ content: "Message discarded", flags: MessageFlags.Ephemeral });
    }
};
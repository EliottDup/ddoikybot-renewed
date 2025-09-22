import { ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageActionRowComponentBuilder, MessageFlags, StringSelectMenuInteraction } from "discord.js";
import { getChannelById } from "../db/channelsRepo";

module.exports = {
    name: "streakEdit.stringMenu.select",
    async execute(interaction: StringSelectMenuInteraction, ...args: string[]) {
        let editstreakButton = new ButtonBuilder()
            .setLabel("Edit Streak")
            .setCustomId(`editStreakModerator.button:${interaction.values[0]}`)
            .setStyle(ButtonStyle.Primary);

        let deleteStreakButton = new ButtonBuilder()
            .setLabel("⚠️ Delete Streak")
            .setCustomId(`deleteStreakModerator.button:${interaction.values[0]}`)
            .setStyle(ButtonStyle.Danger);
        
        let channel = await getChannelById(interaction.values[0]);
        let row = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(editstreakButton, deleteStreakButton);
        if (!channel) {
            interaction.reply({ content: `ERROR: that channel does not exist (anymore)`, flags: MessageFlags.Ephemeral });
            return;
        }
        interaction.reply({ content: `Currently editing channel ${channel.name}`, flags: MessageFlags.Ephemeral, components: [row]});
    }
};
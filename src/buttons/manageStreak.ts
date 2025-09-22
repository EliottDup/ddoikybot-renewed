import { ActionRowBuilder, ButtonInteraction, ChannelSelectMenuBuilder, ChannelType, InteractionCallbackResponse, MessageFlags, ModalActionRowComponentBuilder, ModalBuilder, ModalComponentBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { getServer } from "../db/serverRepo";
import { getUserChannelInGuild } from "../db/channelsRepo";
import { DBChannel } from "../types/types";

module.exports = {
    name: "manageStreak.button",
    async execute(interaction: ButtonInteraction){
        if (!interaction.guildId) return;
        let streak: DBChannel | undefined = (await getUserChannelInGuild(interaction.guildId, interaction.user.id));
        if (streak){
            interaction.reply({content: "TODO: implement channel changing", flags: MessageFlags.Ephemeral});
            return;
        } else {
            const modal = new ModalBuilder()
                .setCustomId("createStreak.modal")
                .setTitle("Create a Streak");
            
            const nameInput = new TextInputBuilder()
                .setCustomId("streakCreateName")
                .setLabel("Streak Name")
                .setValue(interaction.user.displayName)
                .setRequired(true)
                .setStyle(TextInputStyle.Short);
            
            const channelIdInput = new TextInputBuilder()
                .setCustomId("streakCreateChannel")
                .setLabel("Streak Channel ID")
                .setPlaceholder("Right Click > Copy Channel ID (e.g. \"1406612319009509436\")")
                .setRequired(true)
                .setStyle(TextInputStyle.Short)
                .setMaxLength(20)
                .setValue("");

            const row1 = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(nameInput);
            const row2 = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(channelIdInput);

            modal.addComponents(row1, row2);

            interaction.showModal(modal, {withResponse: true});
        }

    }
}
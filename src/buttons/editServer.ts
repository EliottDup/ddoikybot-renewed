import { ActionRowBuilder, ButtonInteraction, ModalActionRowComponentBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";

module.exports = {
    name: "editServer.button",
    async execute(interaction: ButtonInteraction, ...args: string[]) {
        const modal = new ModalBuilder()
            .setCustomId("editServer.modal")
            .setTitle("Edit server");
        
        const newChannelId = new TextInputBuilder()
            .setCustomId("newChannelId")
            .setLabel("new main channel ID")
            .setRequired(true)
            .setStyle(TextInputStyle.Short);
        
        modal.addComponents(new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(newChannelId));
        
        interaction.showModal(modal);
    }
};
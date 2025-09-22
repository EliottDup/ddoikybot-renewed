import { ActionRowBuilder, ButtonInteraction, ModalActionRowComponentBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";

module.exports = {
    name: "drewOverride.button",
    async execute(interaction: ButtonInteraction, ...args: string[]) {
        const modal = new ModalBuilder()
            .setCustomId("drewOverride.modal")
            .setTitle("Override Draw");
        
        const idInput = new TextInputBuilder()
            .setLabel("The ID of the message to use")
            .setCustomId("messageId")
            .setRequired(true)
            .setStyle(TextInputStyle.Short);
        
        let row = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(idInput);

        modal.addComponents(row);

        interaction.showModal(modal);
    }
};
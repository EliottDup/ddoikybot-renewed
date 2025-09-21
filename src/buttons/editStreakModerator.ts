import { ActionRow, ActionRowBuilder, ButtonInteraction, ModalActionRowComponentBuilder, ModalBuilder, TextInputBuilder } from "discord.js";

module.exports = {
    name: "editStreakModeratorButton",
    async execute(interaction: ButtonInteraction){
        let selectStreakModal = new ModalBuilder()
            .setTitle("Select Streak")
            .setCustomId("selectStreakForEditModeratorModal");
        
        let namefield = new TextInputBuilder()
            .setCustomId("name")
            .setLabel("Name of streak to edit:")
            .setMaxLength(255)
            .setRequired(true);
        
        let row: ActionRowBuilder<ModalActionRowComponentBuilder> = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(namefield);
        
        selectStreakModal.addComponents(row);

        interaction.showModal(selectStreakModal);
        // let streakField = new TextInputBuilder()
        //     .setCustomId("streak")
        //     .setLabel("Current Streak");
        
        // let highStreakField = new TextInputBuilder()
        //     .setCustomId("highStreak")
        //     .setLabel("Max Streak");
        
        // let aliveField = new TextInputBuilder()
        //     .setCustomId("alive")
        //     .setLabel("Is Alive"); 
        
    }
}
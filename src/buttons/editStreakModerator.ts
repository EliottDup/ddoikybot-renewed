import { ActionRow, ActionRowBuilder, ButtonInteraction, ModalActionRowComponentBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";

module.exports = {
    name: "editStreakModerator:button:0",
    async execute(interaction: ButtonInteraction){
        let selectStreakModal = new ModalBuilder()
            .setTitle("Select Streak")
            .setCustomId("editStreakModerator:modal:0");

        let namefield = new TextInputBuilder()
            .setCustomId("name")
            .setLabel("Name of streak to edit:")
            .setMaxLength(255)
            .setRequired(true)
            .setStyle(TextInputStyle.Short);
        
        let newNamefield = new TextInputBuilder()
            .setCustomId("newName")
            .setLabel("New Name")
            .setMaxLength(255)
            .setPlaceholder("(Leave empty to remain unchanged)")
            .setRequired(false)
            .setStyle(TextInputStyle.Short);
        
        let streakField = new TextInputBuilder()
            .setCustomId("streak")
            .setLabel("Current Streak")
            .setPlaceholder("(number) (Leave empty to remain unchanged)")
            .setRequired(false)
            .setStyle(TextInputStyle.Short);
        
        let highStreakField = new TextInputBuilder()
            .setCustomId("highStreak")
            .setLabel("Max Streak")
            .setPlaceholder("(number) (Leave empty to remain unchanged)")
            .setRequired(false)
            .setStyle(TextInputStyle.Short);
        
        let aliveField = new TextInputBuilder()
            .setCustomId("alive")
            .setLabel("Is Alive")
            .setPlaceholder("(true/false) (Leave empty to remain unchanged)")
            .setRequired(false)
            .setStyle(TextInputStyle.Short);
        
        let row1: ActionRowBuilder<ModalActionRowComponentBuilder> = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(namefield);
        let row2: ActionRowBuilder<ModalActionRowComponentBuilder> = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(newNamefield);
        let row3: ActionRowBuilder<ModalActionRowComponentBuilder> = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(streakField);
        let row4: ActionRowBuilder<ModalActionRowComponentBuilder> = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(highStreakField);
        let row5: ActionRowBuilder<ModalActionRowComponentBuilder> = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(aliveField);
        
        selectStreakModal.addComponents(row1, row2, row3, row4, row5);

        interaction.showModal(selectStreakModal);
    }
}
import { ActionRow, ActionRowBuilder, ButtonInteraction, MessageFlags, ModalActionRowComponentBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { getChannelById } from "../db/channelsRepo";

module.exports = {
    name: "editStreakModerator.button",
    async execute(interaction: ButtonInteraction, ...args: string[]){
        
        let channel = await getChannelById(args[0]);
        if (!channel) {
            interaction.reply({content: "whoops, something went wrong, or the channel might not exist anymore", flags: MessageFlags.Ephemeral});
            return;
        }
        let selectStreakModal = new ModalBuilder()
            .setTitle("Edit Streak")
            .setCustomId(`editStreakModerator.modal:${channel.channel_id}`);
        
        let newNamefield = new TextInputBuilder()
            .setCustomId("newName")
            .setLabel(`New Name (current: ${channel.name})`)
            .setMaxLength(255)
            .setValue(channel.name)
            .setRequired(true)
            .setStyle(TextInputStyle.Short);
        
        let streakField = new TextInputBuilder()
            .setCustomId("streak")
            .setLabel(`Current Streak (current value: ${channel.streak.toString()})`)
            .setValue(channel.streak.toString())
            .setRequired(true)
            .setStyle(TextInputStyle.Short);
        
        let highStreakField = new TextInputBuilder()
            .setCustomId("highStreak")
            .setLabel(`Max Streak (current value: ${channel.high_streak.toString()})`)
            .setValue(channel.high_streak.toString())
            .setRequired(true)
            .setStyle(TextInputStyle.Short);
        
        let aliveField = new TextInputBuilder()
            .setCustomId("alive")
            .setLabel(`Is Alive (current value: ${channel.is_alive ? "true" : "false"})`)
            .setPlaceholder("(true/false)")
            .setValue(channel.is_alive ? "true" : "false")
            .setRequired(true)
            .setStyle(TextInputStyle.Short);
        
        let row1: ActionRowBuilder<ModalActionRowComponentBuilder> = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(newNamefield);
        let row2: ActionRowBuilder<ModalActionRowComponentBuilder> = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(streakField);
        let row3: ActionRowBuilder<ModalActionRowComponentBuilder> = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(highStreakField);
        let row4: ActionRowBuilder<ModalActionRowComponentBuilder> = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(aliveField);
        
        selectStreakModal.addComponents(row1, row2, row3, row4);

        interaction.showModal(selectStreakModal);
    }
}
import { ActionRowBuilder, ModalActionRowComponentBuilder, ModalBuilder, ModalSubmitInteraction, TextInputBuilder } from "discord.js";
import { DBChannel } from "../types/types";
import { getChannelByNameInGuild } from "../db/channelsRepo";

module.exports = {
    name: "selectStreakForEditModeratorModal",
    async execute(interaction: ModalSubmitInteraction){
        if (!interaction.guildId) return;
        let name = interaction.fields.getTextInputValue("name");
        let channel: DBChannel | undefined = await getChannelByNameInGuild(interaction.guildId, name);
        if (channel == undefined) {
            interaction.reply({content: `No channel with name ${name} found.`});
            return;
        }

        // TODO: problem, cannot showmodal from ModalSubmitInteraction... whoops

        let editStreakModal = new ModalBuilder()
            .setTitle("Edit Streak")
            .setCustomId("streakEditModeratorModal");
                
        let streakField = new TextInputBuilder()
            .setCustomId("streak")
            .setLabel("Current Streak")
            .setValue(channel.streak?.toString() ?? "0");
        
        let highStreakField = new TextInputBuilder()
            .setCustomId("highStreak")
            .setLabel("Max Streak")
            .setValue(channel.high_streak?.toString() ?? "0");
        
        let aliveField = new TextInputBuilder()
            .setCustomId("alive")
            .setLabel("Is Alive")
            .setValue((channel.is_alive) ? "true" : " false");
        
        let row1 = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(streakField);
        let row2 = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(highStreakField);
        let row3 = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(aliveField);   
    }
}
import { ActionRowBuilder, MessageFlags, ModalActionRowComponentBuilder, ModalBuilder, ModalSubmitInteraction, TextInputBuilder } from "discord.js";
import { DBChannel } from "../types/types";
import { getChannelByNameInGuild, upsertChannel } from "../db/channelsRepo";

module.exports = {
    name: "editStreakModeratorModal",
    async execute(interaction: ModalSubmitInteraction){
        if (!interaction.guildId) return;
        let name = interaction.fields.getTextInputValue("name");
        let channel: DBChannel | undefined = await getChannelByNameInGuild(interaction.guildId, name);
        if (channel == undefined) {
            interaction.reply({content: `No channel with name ${name} found.`});
            return;
        }

        let newNameInput = interaction.fields.getTextInputValue("newName");
        let streakInput = interaction.fields.getTextInputValue("streak");
        let highStreakInput = interaction.fields.getTextInputValue("highStreak");
        let isAliveInput = interaction.fields.getTextInputValue("alive");
        
        let newName = channel.name;
        if (newNameInput != "") {
            if (await getChannelByNameInGuild(interaction.guildId, newNameInput) != undefined){
                interaction.reply({content: `Error: there already is a streak named ${newNameInput}`});
                return;
            }
            newName = newNameInput;
        }

        let newStreak = channel.streak

        if (streakInput != "") {
            newStreak = Number.parseInt(streakInput);
            if (Number.isNaN(newStreak)){
                interaction.reply({ content: `Value  \`${streakInput}\` for Streak is incorrect, please use a number, changes cancelled.`, flags: MessageFlags.Ephemeral});
                return;
            }
        }

        let newHighStreak = channel.high_streak;
        
        if (highStreakInput != "") {
            newHighStreak = Number.parseInt(highStreakInput);
            if (Number.isNaN(newStreak)){
                interaction.reply({ content: `Value  \`${highStreakInput}\` for Max Streak is incorrect, please use a number, changes cancelled.`, flags: MessageFlags.Ephemeral});
                return;
            }
        }

        let newIsAlive = channel.is_alive;
        if (isAliveInput != "") {
            if (isAliveInput == "0" || isAliveInput.toLowerCase() == "false"){
                newIsAlive = false;
            }
            else if (isAliveInput == "1" || isAliveInput.toLowerCase() == "true"){
                newIsAlive = true;
            }
            else {
                interaction.reply({ content: `Value  \`${isAliveInput}\` for Alive is incorrect, please use true/false or 0/1, changes cancelled.`, flags: MessageFlags.Ephemeral});
                return;
            }
        }

        channel.name = newName;
        channel.streak = newStreak;
        channel.high_streak = newHighStreak;
        channel.is_alive = newIsAlive;
        await upsertChannel(channel);
        interaction.reply({ content: "Streak Updated", flags: MessageFlags.Ephemeral});
    }
}
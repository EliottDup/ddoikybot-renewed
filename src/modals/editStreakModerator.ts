import { ActionRowBuilder, MessageFlags, ModalActionRowComponentBuilder, ModalBuilder, ModalSubmitInteraction, TextInputBuilder } from "discord.js";
import { DBChannel } from "../types/types";
import { getChannelById, getChannelByNameInGuild, upsertChannel } from "../db/channelsRepo";

module.exports = {
    name: "editStreakModerator.modal",
    async execute(interaction: ModalSubmitInteraction, ...args: string[]){
        if (!interaction.guildId) return;
        let channel: DBChannel | undefined = await getChannelById(args[0]);
        if (channel == undefined) {
            interaction.reply({content: `whoops, something went wrong, or the channel might not exist anymore`, flags: MessageFlags.Ephemeral});
            return;
        }
        console.log(channel);

        let newNameInput = interaction.fields.getTextInputValue("newName");
        let streakInput = interaction.fields.getTextInputValue("streak");
        let highStreakInput = interaction.fields.getTextInputValue("highStreak");
        let isAliveInput = interaction.fields.getTextInputValue("alive");
        
        channel.name = newNameInput;

       channel.streak = Number.parseInt(streakInput);
       if (Number.isNaN(channel.streak)){
           interaction.reply({ content: `Value  \`${streakInput}\` for Streak is incorrect, please use a number, changes cancelled.`, flags: MessageFlags.Ephemeral});
           return;
       }

        channel.high_streak = Number.parseInt(highStreakInput);
        if (Number.isNaN(channel.high_streak)){
            interaction.reply({ content: `Value  \`${highStreakInput}\` for Max Streak is incorrect, please use a number, changes cancelled.`, flags: MessageFlags.Ephemeral});
            return;
        }

        if (isAliveInput == "0" || isAliveInput.toLowerCase() == "false"){
            channel.is_alive = false;
        }
        else if (isAliveInput == "1" || isAliveInput.toLowerCase() == "true"){
            channel.is_alive = true;
        }
        else {
            interaction.reply({ content: `Value  \`${isAliveInput}\` for Alive is incorrect, please use \`true\`/\`false\` or \`0\`/\`1\`, changes cancelled.`, flags: MessageFlags.Ephemeral});
            return;
        }

        await upsertChannel(channel);
        interaction.reply({ content: "Streak Updated", flags: MessageFlags.Ephemeral});
    }
}
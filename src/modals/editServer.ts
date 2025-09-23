import { MessageFlags, ModalSubmitInteraction, DiscordAPIError } from 'discord.js';
import { getChannelById } from "../db/channelsRepo";
import { getServer, upsertServer } from '../db/serverRepo';
import { resendServerMainMessages } from '../utils';

module.exports = {
    name: "editServer.modal",
    async execute(interaction: ModalSubmitInteraction, ...args: string[]) {
        if (!interaction.inGuild() || ! interaction.guild) return;
        const newChannelId = interaction.fields.getTextInputValue("newChannelId");
        try {
            let [dcChannel, dbChannel] = await Promise.all([interaction.guild.channels.fetch(newChannelId), getChannelById(newChannelId)]);
            if (dcChannel == null){
                interaction.reply({ content: `Error: Channel <#${newChannelId}> with ID ${newChannelId} not found by bot.`, flags: MessageFlags.Ephemeral});
                return;
            }
            if (!dcChannel.isTextBased() || dcChannel.isVoiceBased()){
                interaction.reply({ content: `Error: Channel <#${newChannelId}> is not a text based channel.`, flags: MessageFlags.Ephemeral});
                return
            }
            if (dbChannel != undefined){
                interaction.reply({ content: `Error: Channel <#${newChannelId}> is already used by streak ${dbChannel.name}.`, flags: MessageFlags.Ephemeral });
                return;
            }

            let server = await getServer(interaction.guildId);
            if (!server){
                interaction.reply({ content: `Even I don't know how you got this error message.`, flags: MessageFlags.Ephemeral });
                return;
            }
            server.main_channel = newChannelId;
            server.stats_message = undefined;
            await upsertServer(server);
            resendServerMainMessages(interaction.guild);

            interaction.reply({ content: "server Updated", flags: MessageFlags.Ephemeral });
        } catch (error) {
            if (error instanceof DiscordAPIError ){
                interaction.reply({ content: error.message, flags: MessageFlags.Ephemeral });
            }
        }
    }
};
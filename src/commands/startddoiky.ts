import { ChatInputCommandInteraction, InteractionContextType, MessageFlags, PermissionFlagsBits, SlashCommandBuilder, TextChannel } from "discord.js";
import { getServer, upsertServer } from "../db/serverRepo";
import { getChannelsByServer, upsertChannel } from "../db/channelsRepo";
import { resendServerMainMessages } from "../utils";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("start-ddoiky")
        .setDescription("re-starts the ddoiky, setting everyone as alive.")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setContexts(InteractionContextType.Guild),
    
    async execute(interaction: ChatInputCommandInteraction){
        if (!interaction.guildId || !interaction.guild) return;
        let server = await getServer(interaction.guildId);
        if (!server){
            interaction.reply({content: "Error, server not set up, please use `/initialise` first", flags: MessageFlags.Ephemeral});
            return;
        }
        server.ddoiky_active = true;
        await upsertServer(server);
        
        let channels = await getChannelsByServer(interaction.guildId);
        for (let channel of channels) {
            channel.is_alive = true;
            await upsertChannel(channel);
        }
        let channel = await interaction.guild.channels.fetch(server.main_channel) as TextChannel;
        await channel?.send("@everyone Another ddoiky has been started")
        resendServerMainMessages(interaction.guild);
        interaction.reply({content: "Ddoiky started"});
    }
}
import { ChannelType, ChatInputCommandInteraction, InteractionContextType, MessageFlags, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { getServer, upsertServer } from "../db/serverRepo";
import { DBServer } from "../types/types";
import { resendServerMainMessages } from "../utils";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("initialise")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addChannelOption((channelOption) => 
            channelOption
                .setName("stat-channel")
                .setDescription("the channel used by the bot to display daily information")
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildText)
        ).setDescription("running this command initialises the bot in this server.")
        .setContexts(InteractionContextType.Guild),

    async execute(interaction: ChatInputCommandInteraction){
        if (!interaction.guildId) return;
        getServer(interaction.guildId).then( async ( server ) => {
            if (!server){
                if (!interaction.guildId || !interaction.guild) return;
                const channel = interaction.options.getChannel<ChannelType.GuildText>("stat-channel");
                if (!channel) return;

                
                // let message: Message<true> = await channel?.send({content: "tem:b: message", components: [row.toJSON()]});
                
                let dbServer: DBServer = {id: interaction.guildId, ddoiky_active: false, main_channel: channel.id};
                upsertServer(dbServer);

                await resendServerMainMessages(interaction.guild);

                interaction.reply({content: "done", flags: MessageFlags.Ephemeral});
            }
            else{
                interaction.reply({ content: "Error: server already set up", flags:MessageFlags.Ephemeral });
            }
        });
    }
}
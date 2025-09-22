import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, ChatInputCommandInteraction, InteractionContextType, Message, MessageFlags, PermissionFlagsBits, SlashCommandBuilder, TextChannel } from "discord.js";
import { getServer, upsertServer } from "../db/serverRepo";
import { DBServer } from "../types/types";

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
                if (!interaction.guildId) return;

                const drewButton = new ButtonBuilder()
                    .setCustomId("drew.button")
                    .setLabel("I Drew")
                    .setStyle(ButtonStyle.Success);
                
                const createOrManageButton = new ButtonBuilder()
                    .setCustomId("manageStreak.button")
                    .setLabel("Manage or Create Streak")
                    .setStyle(ButtonStyle.Success);

                const row = new ActionRowBuilder()
                    .addComponents(drewButton, createOrManageButton);
                
                const channel = interaction.options.getChannel<ChannelType.GuildText>("stat-channel");
                if (!channel) return;
                let message: Message<true> = await channel?.send({content: "temp:b: message", components: [row.toJSON()]});
                
                let dbServer: DBServer = {id: interaction.guildId, ddoiky_active: false, main_channel: channel.id, stats_message: message.id};
                upsertServer(dbServer);

                interaction.reply({content: "done", flags: MessageFlags.Ephemeral});
            }
            else{
                interaction.reply({ content: "Error: server already set up", flags:MessageFlags.Ephemeral });
            }
        });
    }
}
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelSelectMenuBuilder, ChatInputCommandInteraction, InteractionContextType, MessageActionRowComponentBuilder, MessageFlags, PermissionFlagsBits, SlashCommandBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js";
import { getChannelsByServer } from "../db/channelsRepo";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("manage_server")
        .setContexts(InteractionContextType.Guild)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDescription("Moderator panel to manage the server"),
    
    async execute(interaction: ChatInputCommandInteraction){
        if (!interaction.guildId) return;
        let editstreakButton = new ButtonBuilder()
            .setLabel("Edit Streak")
            .setCustomId("editStreakModerator.button")
            .setStyle(ButtonStyle.Primary);

        let editServerButton = new ButtonBuilder()
            .setLabel("Edit Server")
            .setCustomId("editServer.button")
            .setStyle(ButtonStyle.Primary);
        
        let deleteStreakButton = new ButtonBuilder()
            .setLabel("⚠️ Delete Streak")
            .setCustomId("DeleteStreakModerator.button")
            .setStyle(ButtonStyle.Danger);

        let deleteServerButton = new ButtonBuilder()
            .setLabel("⚠️ Delete Server")
            .setCustomId("deleteServer.button")
            .setStyle(ButtonStyle.Danger);
        
        let streakSelectMenu = new StringSelectMenuBuilder()    
            .setCustomId("streakSelect.stringMenu")
            .setPlaceholder("Select a streak to edit")
            .setOptions();
        
        let options: StringSelectMenuOptionBuilder[] = [];
        let channels = await getChannelsByServer(interaction.guildId);

        for (const channel of channels){
            let username = (await interaction.client.users.fetch(channel.user_id)).displayName;
            options.push(new StringSelectMenuOptionBuilder()
            .setLabel(channel.name)
            .setValue(channel.channel_id)
            .setDescription(`Streak belonging to ${username}`));
        }

        streakSelectMenu.addOptions(options);
        let row1 = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(streakSelectMenu);
        let row2 = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(editServerButton, deleteServerButton);


        interaction.reply({content: "What do you wish to do?", flags: MessageFlags.Ephemeral,
            components: options.length > 0 ? [row1, row2] : [row2]
        })
    }
}
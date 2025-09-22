import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, InteractionContextType, MessageActionRowComponentBuilder, MessageFlags, PermissionFlagsBits, SlashCommandBuilder, StringSelectMenuBuilder } from "discord.js";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("manage_server")
        .setContexts(InteractionContextType.Guild)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDescription("Moderator panel to manage the server"),
    
    async execute(interaction: ChatInputCommandInteraction){
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

        let row: ActionRowBuilder<MessageActionRowComponentBuilder> = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(editstreakButton, editServerButton, deleteStreakButton, deleteServerButton);


        interaction.reply({content: "What do you wish to do?", flags: MessageFlags.Ephemeral,
            components: [row]
        })
    }
}
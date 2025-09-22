import { ActionRowBuilder, ButtonInteraction, MessageFlags, ModalActionRowComponentBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { getChannelById } from "../db/channelsRepo";

module.exports = {
    name: "deleteStreak.button",
    async execute(interaction: ButtonInteraction, ...args: string[]) {
        
        let channel = await getChannelById(args[0]);
        if (!channel) {
            interaction.reply({ content: `ERROR: that channel does not exist (anymore)`, flags: MessageFlags.Ephemeral });
            return;
        }

        let confirmModal = new ModalBuilder()
            .setCustomId(`deleteStreak.modal.confirm:${channel.channel_id}`)
            .setTitle("Are you sure you want to delete this Streak?")
            .addComponents(
                new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
                    new TextInputBuilder()
                    .setLabel("Delete this text to confirm")
                    .setValue(`By deleting this text, I hereby confirm that the channel named ${channel.name} be deleted upon pressing Confirm.`)
                    .setPlaceholder(`Pressing \`Submit\` will now delete the channel ${channel.name}`)
                    .setStyle(TextInputStyle.Paragraph)
                    .setCustomId("confirmation")
                    .setRequired(false)
                )
            );
        
        interaction.showModal(confirmModal);
    }
};
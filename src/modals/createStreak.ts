import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, DiscordAPIError, MessageActionRowComponentBuilder, MessageFlags, ModalSubmitInteraction } from "discord.js";
import { DBChannel } from "../types/types";
import { upsertChannel } from "../db/channelsRepo";
import { resendServerMainMessages } from "../utils";

module.exports = {
    name: "createStreak.modal",
    async execute(interaction: ModalSubmitInteraction){
        try {
            if (!interaction.guildId || !interaction.guild) return;
            let name: string = interaction.fields.getTextInputValue("streakCreateName");
            let channelID: string = interaction.fields.getTextInputValue("streakCreateChannel");

            let channel = await interaction.client.channels.fetch(channelID);

            if (!channel) {
                interaction.reply({ content: "channel not found", flags: MessageFlags.Ephemeral});
                return;
            }
            if (channel.type != ChannelType.GuildText){
                interaction.reply({content: "selected channel id is not a text channel", flags:MessageFlags.Ephemeral});
                return;
            }

            let streak: DBChannel = {
                channel_id: channelID,
                user_id: interaction.user.id,
                server_id: interaction.guildId,
                name: name,
                streak: 0,
                high_streak: 0,
                draw_counter: 0,
                is_alive: false
            }

            upsertChannel(streak);

            let btn = new ButtonBuilder()
                .setCustomId("deleteMessage.button")
                .setLabel("Dismiss message")
                .setStyle(ButtonStyle.Primary);

            let row = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(btn);

            channel.send({content: `channel registered with name ${name} and user ${interaction.user.tag}`, components: [row]});
            resendServerMainMessages(interaction.guild);
            interaction.reply({content: "streak created", flags:MessageFlags.Ephemeral});
        } catch (error) {
            if (error instanceof DiscordAPIError){
                interaction.reply({ content: error.message, flags: MessageFlags.Ephemeral });
            }
        }
    }
}
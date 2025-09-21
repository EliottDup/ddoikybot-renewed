import { ChannelType, MessageFlags, ModalSubmitInteraction } from "discord.js";
import { DBChannel } from "../types/types";
import { upsertChannel } from "../db/channelsRepo";

module.exports = {
    name: "createStreak",
    async execute(interaction: ModalSubmitInteraction){
        if (!interaction.guildId) return;
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
        channel.send({content: `channel registered with name ${name} and user ${interaction.user.tag}`});
        interaction.reply({content: "streak created", flags:MessageFlags.Ephemeral});
    }
}
import { DiscordAPIError, MessageFlags, ModalSubmitInteraction, TextChannel } from "discord.js";
import { getUserChannelInGuild, upsertChannel } from "../db/channelsRepo";
import { resendServerMainMessages } from "../utils";

module.exports = {
    name: "drewOverride.modal",
    async execute(interaction: ModalSubmitInteraction, ...args: string[]) {
        if (!interaction.guild || !interaction.guildId) return;
        const messageId = interaction.fields.getTextInputValue("messageId");
        let streak = await getUserChannelInGuild(interaction.guildId, interaction.user.id);
        if (!streak) return;

        try {
            let channel = await interaction.guild.channels.fetch(streak.channel_id);
            if (!(channel instanceof TextChannel)) return;
            let msg = await channel.messages.fetch(messageId);
        
            const now = new Date();

            if (streak.draw_counter == 0 || (streak.draw_counter == 1 && now.getHours() < 5)) {
                streak.draw_counter++;
                streak.streak++;
                streak.high_streak = Math.max(streak.high_streak, streak.streak);
                streak.last_message = messageId;
                upsertChannel(streak);
                resendServerMainMessages(interaction.guild);

                interaction.reply({ content: `Congrats, your streak has been increased to ${streak.streak}`});
                return;
            }

            interaction.reply({ content: "you have already drawn today", flags: MessageFlags.Ephemeral});

        } catch (e) {
            if (e instanceof DiscordAPIError){
                interaction.reply({ content: e.message, flags: MessageFlags.Ephemeral });
            }
        }
    }
};
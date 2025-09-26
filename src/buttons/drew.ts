import { ButtonBuilder, ButtonInteraction, ButtonStyle, MessageFlags, ActionRow, ActionRowBuilder, MessageActionRowComponentBuilder, Message } from 'discord.js';
import { getUserChannelInGuild, upsertChannel } from "../db/channelsRepo";
import { TextChannel } from "discord.js";
import { resendServerMainMessages } from '../utils';

module.exports = {
    name: "drew.button",
    async execute(interaction: ButtonInteraction){
        if (!interaction.inGuild() || !interaction.guild) return;
        const streak = await getUserChannelInGuild(interaction.guildId, interaction.user.id);
        if (!streak) return;
        
        const now = new Date();
        
        if (streak.draw_counter == 2 || streak.draw_counter == 1 && now.getHours() >= 5){
            interaction.reply({ content: "You have already drawn today.", flags: MessageFlags.Ephemeral});
            return;
        }
        
        let channel = await interaction.guild.channels.fetch(streak.channel_id);
        
        if (!channel){
            interaction.reply({ content: "Something went wrong, maybe your channel has been deleted", flags: MessageFlags.Ephemeral});
            return;
        }

        if (!(channel instanceof TextChannel)){
            interaction.reply({ content: "Error: your channel is not a text channel, please edit your channel", flags: MessageFlags.Ephemeral});
            return;
        }
        
        const messages = await channel.messages.fetch({ limit: 10, cache: true, before: streak.last_message});
        let message: Message<true> | null = null;

        for (let [snfl, msg] of messages){
            if (msg.attachments.size > 0 && // has attachment
                msg.author.id == streak.user_id && // is by streak owner
                Math.floor(Math.abs((now.getTime() - msg.createdAt.getTime())/3_600_000)) // was less than 24 hrs ago
            ){
                message = msg
                break;
            }
        }
        
        if (message == null){
            let retryButton = new ButtonBuilder()
                .setLabel("Try Again")
                .setCustomId("drew.button")
                .setStyle(ButtonStyle.Primary);

            let overrideButton = new ButtonBuilder()
                .setLabel("Enter message ID manually")
                .setCustomId("drewOverride.button")
                .setStyle(ButtonStyle.Secondary);
            
            let row = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(retryButton, overrideButton);

            interaction.reply({ 
                content: "Oops, I could not find any messages with attachments in the last 10 messages or since your last drawing or in the last 24 h, please make sure to upload your drawing and press `Try Again`. Otherwise, copy the id of the message that you wish to submit as a drawing and press `Override`.",
                flags: MessageFlags.Ephemeral,
                components: [row]
            });
            return;
        }

        if (streak.draw_counter == 0 || (streak.draw_counter == 1 && now.getHours() < 5)) {
            streak.draw_counter++;
            streak.streak++;
            streak.high_streak = Math.max(streak.high_streak, streak.streak);
            streak.last_message = message.id;
            await upsertChannel(streak);

            resendServerMainMessages(interaction.guild);

            interaction.reply({ content: `Congrats, your streak has been increased to ${streak.streak}`, flags: MessageFlags.Ephemeral});
            return;
        }
    }
}
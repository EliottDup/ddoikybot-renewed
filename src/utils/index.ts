import { ActionRowBuilder, APIEmbedField, ButtonBuilder, ButtonStyle, EmbedBuilder, Guild, MessageActionRowComponentBuilder, MessageCreateOptions, TextChannel } from "discord.js";
import { getChannelsByServer } from "../db/channelsRepo";
import { getServer, upsertServer } from "../db/serverRepo";

export async function generateServerMainMessages(guild: Guild): Promise<MessageCreateOptions[]> {
    let [channels, server] = await Promise.all([ getChannelsByServer(guild.id), getServer(guild.id) ]);
    if (!server) return [];

    const infoEmbedFields: APIEmbedField[] = [
        {name: "ddoiky status", value: `ddoiky ${server.ddoiky_active? "active": "inactive"}`, inline: true},
        function(): APIEmbedField {
            let value = "";
            for (const channel of channels) {
                value += `${channel.name}\n`;
            }
            return {name: "Alive ddoiky members", value: value, inline: true};
        }()
    ] 

    let infoEmbed = new EmbedBuilder()
        .addFields(infoEmbedFields); 

    const baseEmbedField: APIEmbedField = { name: "Name:", value: "User:\nChannel:\nLast Drawing:\nStreak:\nHigh Score:\nIs Alive:\n", inline: true};
    let userFields: APIEmbedField[] = [];


    for (const channel of channels) {
        let lastMessage = "No last drawing found"

        if (channel.last_message){
            try {
                lastMessage = (await ((await guild.channels.fetch(channel.channel_id)) as TextChannel).messages.fetch(channel.last_message)).url;
            } catch (error) {}
        }

        userFields.push({ name: `${channel.name}`, value: `<@${channel.user_id}>\n<#${channel.channel_id}>\n${lastMessage}\n${channel.streak}\n${channel.high_streak}\n${channel.is_alive? "alive" : "dead"}`, inline: true});
    }

    if (userFields.length % 2 == 1){
        userFields.push({name: " ", value: " ", inline: true});
    }

    let fields: APIEmbedField[] = [];

    for (let i = 0; i < userFields.length / 2; i++){
        fields.push(baseEmbedField);
        fields.push(userFields[i * 2]);
        fields.push(userFields[i * 2 + 1]);
    }

    let statsEmbeds: EmbedBuilder[] = [];
    while (fields.length > 0){
        statsEmbeds.push(new EmbedBuilder().addFields(fields.splice(0, 24)));
    }

    let embeds = [infoEmbed, ...statsEmbeds];

    let messages: MessageCreateOptions[] = [];

    while (embeds.length > 0){
        messages.push({embeds: embeds.splice(0, 10)});
    }

    const drewButton = new ButtonBuilder()
        .setCustomId("drew.button")
        .setLabel("I Drew")
        .setStyle(ButtonStyle.Success);
    
    const createOrManageButton = new ButtonBuilder()
        .setCustomId("manageStreak.button")
        .setLabel("Manage or Create Streak")
        .setStyle(ButtonStyle.Success);

    const row = new ActionRowBuilder<MessageActionRowComponentBuilder>()
        .addComponents(drewButton, createOrManageButton);

    messages[messages.length - 1].components = [row];

    return messages;
}

export async function resendServerMainMessages(guild: Guild): Promise<void> {
    let server = await getServer(guild.id);
    if (!server) return;

    let channel = await guild.channels.fetch(server.main_channel) as TextChannel;
    if (!channel) return;

    
    let [messageCreateOptions, _] = await Promise.all([
        generateServerMainMessages(guild),
        async function(){
            if (!server.stats_message || server.stats_message === "") return;
            let message = await channel.messages.fetch(server.stats_message);
            message.delete();
            return;
        }()
    ]);

    console.log("sending new messages");
    let snowflakes: string[] = [];

    for (const messageCreateOption of messageCreateOptions){
        let message = await channel.send(messageCreateOption);
        snowflakes.push(message.id);
    }

    server.stats_message = snowflakes[0];
    upsertServer(server);
    return;
}
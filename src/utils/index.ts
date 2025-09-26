import { ActionRowBuilder, APIEmbedField, ButtonBuilder, ButtonStyle, Client, Collection, EmbedBuilder, Guild, MessageActionRowComponentBuilder, MessageCreateOptions, TextChannel } from "discord.js";
import { getChannelsByServer, upsertChannel } from "../db/channelsRepo";
import { getAllServers, getServer, upsertServer } from "../db/serverRepo";
import { DBServer } from "../types/types";
import { timeout } from "cron";
import config from "../config/config.json"

export async function generateServerMainMessages(guild: Guild): Promise<MessageCreateOptions[]> {
    let [channels, server] = await Promise.all([ getChannelsByServer(guild.id), getServer(guild.id) ]);
    if (!server) return [];

    const infoEmbedFields: APIEmbedField[] = [
        {name: "DDOIKY status", value: `${server.ddoiky_active? "active": "inactive"}`, inline: true},
        function(): APIEmbedField {
            let value = "";
            for (const channel of channels) {
                if (channel.is_alive){
                    value += `${channel.name}\n`;
                }
            }
            return {name: "Alive DDOIKY members", value: value, inline: true};
        }(),
        {name: "Deadline:", value: `<t:${Math.floor((Date.now() + timeout("0 0 5 * * *"))/1000)}:R>`, inline: false},
        {name: "Last Update:", value: `<t:${Math.floor(Date.now()/1000)}:R>`, inline: false}
    ]

    let infoEmbed = new EmbedBuilder()
        .addFields(infoEmbedFields); 

    const baseEmbedField: APIEmbedField = { name: "Name:", value: "User:\nChannel:\nLast Drawing:\nStreak:\nHigh Score:\nDDOIKY Status:\n", inline: true};
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
            try {
                if (!server.stats_message || server.stats_message === "") return;
                let messages = await channel.messages.fetch({ before: server.stats_message, limit: 10});
                messages.set(server.stats_message, await channel.messages.fetch(server.stats_message));
                for (const [snowflake, message] of messages){
                    if (message.author.id != config.id) {
                        messages.delete(snowflake);
                        console.log(message.author.id, config.id);
                    }
                }
                for (const [_, message] of messages){
                    await message.delete();
                }
            return;
            } catch (error) {
                console.log(`could not delete old stats message in server ${guild.id}, maybe it was deleted manually`);
            }
        }()
    ]);

    console.log("sending new messages");
    let snowflakes: string[] = [];

    for (const messageCreateOption of messageCreateOptions){
        let message = await channel.send(messageCreateOption);
        snowflakes.push(message.id);
    }

    server.stats_message = snowflakes[snowflakes.length - 1];
    upsertServer(server);
    return;
}

async function checkServer(client: Client, server: DBServer): Promise<void> {
    let [channels, mainChannel] = await Promise.all([getChannelsByServer(server.id), client.channels.fetch(server.main_channel)]);
    if (!(mainChannel instanceof TextChannel) || !mainChannel) {
        console.log(`Main channel ${server.main_channel} in server ${server.id} is not a text channel or could not be found`);
        return;
    }

    let deathAnnouncements: Collection<string, number> = new Collection<string, number>();

    for (const channel of channels){
        if (channel.draw_counter == 0){
            //DEATH
            if (channel.streak >= 10 || (server.ddoiky_active && channel.is_alive)){
                deathAnnouncements.set(channel.user_id, channel.streak);
            }
            channel.is_alive = false;
            channel.streak = 0;
            upsertChannel(channel);
        }
        else {
            channel.draw_counter -= 1;
            upsertChannel(channel);
        }
    }
    if (deathAnnouncements.size > 0){
        let description = "The following members have died or lost a promising streak:\n";
        for (const [userID, streak] of deathAnnouncements){
            description += `<@${userID}> with a streak of ${streak.toString()}\n`;
        }
        await mainChannel.send({embeds: [new EmbedBuilder().setTitle("Death Announcement").setDescription(description)]});
    }
    resendServerMainMessages(mainChannel.guild);
}

export async function theCheckening(client: Client): Promise<void> {
    console.log("The Checkening has begun");
    let servers = await getAllServers();
    for (const server of servers){
        checkServer(client, server);
    }
    console.log("The Checkening has ended and did not crash \\o/");
}


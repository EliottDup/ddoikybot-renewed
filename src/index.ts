import {ChatInputCommandInteraction, Client, Collection, GatewayIntentBits, Interaction, MessageFlags, SlashCommandBuilder} from "discord.js"
import config from "./config/config.json"
import path from "path";
import { readdirSync } from "fs";
import { CommandCollection, CommandModule, EventModule } from "./types/types";
import { closeConnection, createConnection } from "./db";
import { createServersTable } from "./db/serverRepo";
import { createChannelsTable } from "./db/channelsRepo";
import { CronJob } from "cron";
import { theCheckening } from "./utils";

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

// DB initialisation
createConnection().then(() => {
    createServersTable();
    createChannelsTable();
});


// Command Initialisation
const commands: CommandCollection = new Collection<string, CommandModule>()

const commandsPath = path.join(__dirname, "commands");
const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith(".ts") || file.endsWith(".js"));

for (const file of commandFiles) {
    const command = require(path.join(commandsPath, file));
    commands.set(command.data.name, command);
}

// Event Initialisation
const eventsPath = path.join(__dirname, "events");
const eventFiles = readdirSync(eventsPath).filter(file => file.endsWith(".ts") || file.endsWith(".js"));

for (const file of eventFiles){
    const filePath = path.join(eventsPath, file);
    const event: EventModule = require(filePath);
    if (event.once){
        client.once(event.name, (...args) => event.execute(commands, ...args));
    }
    else {
        client.on(event.name, (...args) => event.execute(commands, ...args));
    }
}

function shutdown(){
    client.destroy();
    closeConnection();
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

// Cron Job :) :) :)

const job = new CronJob(
    "0 0 5 * * *", // Every day at 5am
    function () {
        theCheckening(client);
    },
    null,
    true,
    "Europe/Amsterdam"
);

// Start bot
client.login(config.token);
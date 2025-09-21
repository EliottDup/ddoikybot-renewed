import { Client, Events } from "discord.js";
import { CommandCollection } from "../types/types";

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(commands: CommandCollection, client: Client) {
        console.log(`logged in as ${client.user?.tag}`);
    }
}
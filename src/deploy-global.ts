import { REST, Routes, SlashCommandBuilder } from "discord.js";
import { readdirSync } from "fs";
import path from "path";
import config from "./config/config.json"

const commanddPath = path.join(__dirname, "commands");
const commandFiles = readdirSync(commanddPath).filter(file => file.endsWith(".ts") || file.endsWith(".js"));

const commands: SlashCommandBuilder[] = []

for (const file of commandFiles) {
    const command = require(path.join(commanddPath, file));
    commands.push(command.data.toJSON());
}

const rest = new REST({ version: "10" }).setToken(config.token);

(async () => {
    try {
        console.log("deploying commands");
        await rest.put(
            Routes.applicationCommands(config.id),
            { body: commands }
        );
        console.log("commands successfully deployed to guild");
    } catch (error){
        console.error(error);
    }
})();
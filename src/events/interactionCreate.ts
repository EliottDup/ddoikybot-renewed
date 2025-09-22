import { ButtonInteraction, ChatInputCommandInteraction, Events, Interaction, MessageFlags, ModalSubmitInteraction, StringSelectMenuInteraction } from "discord.js";
import { ButtonModule, CommandCollection, ModalModule, StringSelectModule } from "../types/types";
import path from "path";
import { readdirSync } from "fs";
import { getServer } from "../db/serverRepo";
import { loadModules } from "../utils/loadModules";

function parseCustomId(customId: string): {id: string, args: string[]} {
    const [id, ...args] = customId.split(":");
    return {id, args};
}

const basepath = path.dirname(__dirname);

const buttons = loadModules<ButtonModule>(basepath, "buttons")

const modals = loadModules<ModalModule>(basepath, "modals")

const stringSelectMenus = loadModules<StringSelectModule>(basepath, "stringSelect");


module.exports = {
    name: Events.InteractionCreate,
    async execute(commands: CommandCollection, interaction: Interaction){
        if (interaction.isChatInputCommand()){
            interaction: ChatInputCommandInteraction;
            const cmd = commands.get(interaction.commandName);
            if (!cmd) return;
            try {
                await cmd.execute(interaction);
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: "error: the command was stupid and had error", flags: MessageFlags.Ephemeral});
            }
            return;
        } else if (interaction.isButton()) {
            
            if (!interaction.guildId) return;
            if (!await getServer(interaction.guildId)){
                interaction.reply({ content: "This server is not set up. please use `/initialise`", flags:MessageFlags.Ephemeral });
                return;
            }
            interaction: ButtonInteraction;
            const { id, args } = parseCustomId(interaction.customId); 
            const btn = buttons.get(id);
            if (!btn) {
                console.log(`button "${id}" not found`)
                interaction.reply({content: "dev forgor to do this :skull:", flags: MessageFlags.Ephemeral});
                return;
            }
            try {
                await btn.execute(interaction, ...args);
            }catch (error) {
                console.error(error);
                await interaction.reply({ content: "error: the button was stupid and had error", flags: MessageFlags.Ephemeral});
            }
            return;
        } else if (interaction.isModalSubmit()) {
            interaction: ModalSubmitInteraction;
            let { id, args } = parseCustomId(interaction.customId);
            const mdl = modals.get(id);
            if (!mdl) {
                interaction.reply({content: "dev forgor to do this :skull:", flags: MessageFlags.Ephemeral});
                return;
            }
            try {
                await mdl.execute(interaction, ...args);
            } catch (error) {
                console.error(error);
            }
        } else if (interaction.isStringSelectMenu()) {
            interaction: StringSelectMenuInteraction;
            let { id, args } = parseCustomId(interaction.customId);
            const ssm = stringSelectMenus.get(id);
            if (!ssm){
                interaction.reply({content: "dev forgor to do this :skull:", flags: MessageFlags.Ephemeral});
                return;
            }
            try {
                await ssm.execute(interaction, ...args);
            } catch (error) {
                console.error(error);
            }
        }
    }
}
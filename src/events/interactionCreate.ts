import { ButtonInteraction, ChatInputCommandInteraction, Collection, Events, Interaction, MessageFlags, ModalSubmitInteraction } from "discord.js";
import { ButtonCollection, ButtonModule, CommandCollection, ModalCollection, ModalModule } from "../types/types";
import path from "path";
import { readdirSync } from "fs";
import { getServer } from "../db/serverRepo";

const buttons: ButtonCollection = new Collection<string, ButtonModule>()


const buttonsPath = path.join(path.dirname(__dirname), "buttons");
const buttonFiles = readdirSync(buttonsPath).filter(file => file.endsWith(".ts") || file.endsWith(".js"));



for (const file of buttonFiles) {
    const button : ButtonModule = require(path.join(buttonsPath, file));
    buttons.set(button.name, button);
}

const modals: ModalCollection = new Collection<string, ModalModule>();

const modalsPath = path.join(path.dirname(__dirname), "modals");
const modalFiles = readdirSync(modalsPath).filter(file => file.endsWith(".ts") || file.endsWith(".js"));

for (const file of modalFiles) {
    const modal : ModalModule = require(path.join(modalsPath, file));
    modals.set(modal.name, modal);
}


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
        } else if (interaction.isButton()){
            if (!interaction.guildId) return;
            if (!await getServer(interaction.guildId)){
                interaction.reply({ content: "This server is not set up. please use `/initialise`", flags:MessageFlags.Ephemeral });
                return;
            }
            interaction: ButtonInteraction;
            const btn = buttons.get(interaction.customId);
            if (!btn) {
                interaction.reply({content: "dev forgor to do this :skull:", flags: MessageFlags.Ephemeral});
                return;
            }
            try {
                await btn.execute(interaction);
            }catch (error) {
                console.error(error);
                await interaction.reply({ content: "error: the button was stupid and had error", flags: MessageFlags.Ephemeral});
            }
            return;
        } else if (interaction.isModalSubmit()){
            interaction: ModalSubmitInteraction;
            const mdl = modals.get(interaction.customId);
            if (!mdl) {
                interaction.reply({content: "dev forgor to do this :skull:", flags: MessageFlags.Ephemeral});
                return;
            }
            try {
                await mdl.execute(interaction);
            } catch (error) {
                console.error(error);
            }
        }
    }
}
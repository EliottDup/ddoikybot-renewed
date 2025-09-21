import { ButtonInteraction, ChatInputCommandInteraction, Collection, Events, Interaction, MessageFlags } from "discord.js";
import { ButtonCollection, ButtonModule, CommandCollection } from "../types/types";
import path from "path";
import { readdirSync } from "fs";

const buttons: ButtonCollection = new Collection<string, ButtonModule>()


const buttonsPath = path.join(path.dirname(__dirname), "buttons");
const buttonsFiles = readdirSync(buttonsPath).filter(file => file.endsWith(".ts") || file.endsWith(".js"));


for (const file of buttonsFiles) {
    const button : ButtonModule = require(path.join(buttonsPath, file));
    buttons.set(button.name, button);
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
        }
    }
}
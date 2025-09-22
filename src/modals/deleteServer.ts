import { MessageFlags, ModalSubmitInteraction } from 'discord.js';
import { deleteServer } from '../db/serverRepo';
module.exports = {
    name: "deleteServer.modal.confirm",
    async execute(interaction: ModalSubmitInteraction) {
        if(!interaction.guildId) return;
        let conf = interaction.fields.getTextInputValue("confirmation");
        if (conf == "") {
            await deleteServer(interaction.guildId);
            interaction.reply({content: "Server successfully deleted.", flags: MessageFlags.Ephemeral});
        }
        else{
            interaction.reply({ content: "Confirmation text not cleared, server deletion cancelled.", flags: MessageFlags.Ephemeral});
        }
    }
}
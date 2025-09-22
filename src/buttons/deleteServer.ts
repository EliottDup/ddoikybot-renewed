import { ActionRowBuilder, ButtonInteraction, MessageFlags, ModalActionRowComponentBuilder, ModalBuilder, ModalSubmitInteraction, TextInputStyle} from 'discord.js';
import { deleteServer } from '../db/serverRepo';
import { TextInputBuilder } from '@discordjs/builders';
module.exports = {
    name: "deleteServer.button",
    async execute(interaction: ButtonInteraction){
        let confirmModal = new ModalBuilder()
            .setCustomId("deleteServer.modal.confirm")
            .setTitle("Are you sure you want to delete this server?")
            .addComponents(
                new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
                    new TextInputBuilder()
                    .setLabel("Delete this text to confirm")
                    .setValue("By deleting this text, I hereby confirm that the server and all of it's channels will be deleted upon pressing Confirm.")
                    .setPlaceholder("Pressing `Submit` will now delete this server and all of its channels")
                    .setStyle(TextInputStyle.Paragraph)
                    .setCustomId("confirmation")
                    .setRequired(false)
                )
            );
        
        interaction.showModal(confirmModal);

        // const filter = (interaction: ModalSubmitInteraction) => interaction.customId === "serverDeleteConfirm";
        // interaction.awaitModalSubmit({ filter: filter, time: 30_000 }).then(async interaction => {

        // }).catch(console.error);
    }
}
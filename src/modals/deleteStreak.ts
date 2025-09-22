import { MessageFlags, ModalSubmitInteraction } from "discord.js";
import { deleteChannel } from "../db/channelsRepo";

module.exports = {
    name: "deleteStreak.modal.confirm",
    async execute(interaction: ModalSubmitInteraction, ...args: string[]) {
        const input = interaction.fields.getTextInputValue("confirmation");
        if(!interaction.guildId) return;
        let conf = interaction.fields.getTextInputValue("confirmation");
        if (conf == "") {
            await deleteChannel(args[0]);
            interaction.reply({content: "Channel successfully deleted.", flags: MessageFlags.Ephemeral});
        }
        else{
            interaction.reply({ content: "Confirmation text not cleared, channel deletion cancelled.", flags: MessageFlags.Ephemeral});
        }
    }
};
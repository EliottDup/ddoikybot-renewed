import { MessageFlags, ModalSubmitInteraction } from "discord.js";
import { deleteChannel } from "../db/channelsRepo";
import { resendServerMainMessages } from "../utils";

module.exports = {
    name: "deleteStreak.modal.confirm",
    async execute(interaction: ModalSubmitInteraction, ...args: string[]) {
        const input = interaction.fields.getTextInputValue("confirmation");
        if(!interaction.guildId || !interaction.guild) return;
        let conf = interaction.fields.getTextInputValue("confirmation");
        if (conf == "") {
            await deleteChannel(args[0]);
            resendServerMainMessages(interaction.guild);
            interaction.reply({content: "Channel successfully deleted.", flags: MessageFlags.Ephemeral});
            console.log(`streak with id ${args[0]} for user ${interaction.user.tag} in guild ${interaction.guild.name}`);
        }
        else{
            interaction.reply({ content: "Confirmation text not cleared, channel deletion cancelled.", flags: MessageFlags.Ephemeral});
        }
    }
};
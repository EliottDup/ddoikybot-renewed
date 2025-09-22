import { ButtonInteraction, MessageFlags } from "discord.js";

module.exports = {
    name: "drew.button",
    async execute(interaction: ButtonInteraction){
        interaction.reply({content: "You :regional_indicator_d:rew.", flags: MessageFlags.Ephemeral});
        // TODO:
        /*
            - check if guild exists -> if no, error
            - check if user has streak in guild -> if no: error
            - load last n messages in user channel (up to some date or smth)
            - if one of them has image
                - calculate all that funky logic that makes me wanna kill myself
                - finish
            - if not, then ???
        */
    }
}
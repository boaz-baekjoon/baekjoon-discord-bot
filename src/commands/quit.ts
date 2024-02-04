import {ChatInputCommandInteraction, SlashCommandBuilder} from "discord.js";
import {MongoUtil} from "../util/mongoUtil.js";
import {logger} from "../logger.js";

export default {
data: new SlashCommandBuilder()
        .setName('quit')
        .setDescription('백준 ID를 포함한 모든 정보를 제거합니다.'),

    async execute(interaction: ChatInputCommandInteraction) {
        try {
            const user = await MongoUtil.findUserWithDiscordId(interaction.user.id);
            if (!user) {
                await interaction.reply("등록되지 않은 유저입니다. /register를 통해 등록해주세요.")
                return;
            }

            const response = await MongoUtil.deleteUser(interaction.user.id);
            if (response) {
                await interaction.reply("정상적으로 제거되었습니다.")
                logger.info(`${interaction.user.id}  제거 완료`)
            }
            return;
        } catch (error: any) {
            await interaction.reply("알 수 없는 오류가 발생했습니다.")
            logger.error(error.message)
        }
    }
}
import {logger} from "../logger.js";
import {MongoUtil} from "../util/mongoUtil.js";
import {ChatInputCommandInteraction, Message, SlashCommandBuilder} from "discord.js";
import {getUserInfo} from "../embedMessage/userInfoMessage.js";
import {searchUserInfoWithSolvedAc} from "../bot/getUserInfo.js";

export default {
    data: new SlashCommandBuilder()
        .setName('register')
        .setDescription('백준 아이디를 등록합니다.')
        .addStringOption(option =>
            option.setName('id')
                .setDescription('백준 아이디를 입력해주세요.')
                .setRequired(true)),
    async execute(interaction: ChatInputCommandInteraction) {
        try {
            const user = await MongoUtil.findUserWithDiscordId(interaction.user.id);

            if (user) {
                const realUser = await searchUserInfoWithSolvedAc(user['boj_id']);
                if (realUser.username === 'error') {
                    await interaction.reply("백준에 존재하지 않는 계정이 등록된 상태입니다. \n/quit을 통해 아이디 제거 후 /register를 통해 다시 등록해주세요.")
                    return;
                } else {
                    await interaction.reply({embeds: [getUserInfo(realUser)]})
                    await interaction.reply(`이미 ${user['boj_id']}로 등록이 된 상태입니다. \n
                    변경하시려면 /quit을 통해 아이디 제거 후 /register를 통해 다시 등록해주세요.`)
                    return;
                }
            }

            const boj_id = interaction.options.getString('id');
            const realUser = await searchUserInfoWithSolvedAc(boj_id!);
            if (realUser.username === 'error') {
                await interaction.reply("백준에 존재하지 않는 계정입니다. 명령을 취소합니다.")
                return;
            }

            await interaction.reply({embeds: [getUserInfo(realUser)]})
            const response = await MongoUtil.addUser(interaction.user.id, boj_id!);
            if (response) {
                await interaction.reply("정상적으로 등록되었습니다.")
                logger.info(`${interaction.user.id} / ${boj_id} 가입 완료`)
            }
            return;
        } catch (error: any) {
            await interaction.reply("알 수 없는 오류가 발생했습니다.")
            logger.error(error.message)
        }
    }
}

import {logger} from "../logger.js";
import {MongoUtil} from "../util/mongoUtil.js";
import {ChatInputCommandInteraction, Message, SlashCommandBuilder} from "discord.js";
import {getUserInfo} from "../embedMessage/userInfoMessage.js";
import {searchUserInfoWithSolvedAc} from "../bot/getUserInfo.js";


async function registerId(message: Message, isUserAlreadyRegistered: boolean) {
    await message.reply("등록하실 백준 아이디를 입력해주세요.");
    const botFilter = (m: { author: { bot: any; id: string; }; content: string; }) => !m.author.bot && m.author.id === message.author.id && !m.content.startsWith('!');
    const idCollector = message.channel.createMessageCollector({filter: botFilter,max:1, time: 20000});

    idCollector.on('collect', async msg => {
        const realUser = await searchUserInfoWithSolvedAc(msg.content);
        if (realUser.username === 'error'){
            await message.reply("백준에 존재하지 않는 계정입니다. 명령을 취소합니다.")
            return;
        }else{
            await message.channel.send({embeds: [getUserInfo(realUser)]})

            let response: boolean;
            if(isUserAlreadyRegistered){
                response = await MongoUtil.modifyBojIdOfUser(message.author.id, msg.content);
            }else{
                response = await MongoUtil.addUser(message.author.id, msg.content);
            }

            if (response){
                await message.reply(isUserAlreadyRegistered ? "정상적으로 변경되었습니다." : "정상적으로 등록되었습니다.")
                logger.info(`${message.author.id} / ${msg.content} 가입 완료`)
            }else{
                await message.reply("알 수 없는 오류가 발생했습니다.")
            }
        }
    })

    idCollector.on('end', collected => {
        if (collected.size === 0){
            message.reply("입력 시간이 만료되었습니다.")
        }
    })
}

export async function execute (message: Message) {
    try {
        const user = await MongoUtil.findUserWithDiscordId(message.author.id);

        if (user) {
            const realUser = await searchUserInfoWithSolvedAc(user['boj_id']);

            if(realUser.username === 'error'){
                await message.reply("백준에 존재하지 않는 계정이 등록된 상태입니다. '변경' 또는 '삭제'를 입력하여 백준 아이디를 변경해주세요.")
            }else{
                await message.channel.send({embeds: [getUserInfo(realUser)]})
                await message.reply(`이미 ${user['boj_id']}로 등록이 된 상태입니다. 변경하시려면 '변경', 삭제하시려면 '삭제'를 입력해주세요. 명령어를 취소하려면 '취소'를 입력해주세요.`)
            }
            const botFilter = (m: {
                author: { bot: any; id: string; };
                content: string;
            }) => !m.author.bot && m.author.id === message.author.id && !m.content.startsWith('!')
                && (m.content === '변경' || m.content === '삭제' || m.content === '취소');
            const responseCollector = message.channel.createMessageCollector({filter: botFilter, max: 1, time: 20000});

            responseCollector.on('collect', async msg => {
                switch (msg.content) {
                    case '변경':
                        await registerId(message, true);
                        break;
                    case '삭제':
                        const response = await MongoUtil.deleteUser(message.author.id);
                        if (response) {
                            await message.reply("정상적으로 삭제되었습니다.")
                        } else {
                            await message.reply("알 수 없는 오류가 발생했습니다.")
                        }
                        break;
                    case '취소':
                        await message.reply("명령을 취소하셨습니다.");
                        break;
                }
            })

            responseCollector.on('end', collected => {
                if (collected.size === 0) {
                    message.reply("입력 시간이 만료되었습니다.")
                }
            })

        } else {
            await registerId(message, false)
        }
    } catch (error: any) {
        logger.error(error.message)
    }
}

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

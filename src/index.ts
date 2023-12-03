import {Client, GatewayIntentBits} from 'discord.js';
import { sendDailyProblem } from './bot/cron'
import * as cron from 'node-cron';
import { logger } from './logger'
import {initializeBot} from "./bot/initialize-bot";

export const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.DirectMessages
    ],
});

initializeBot(client).then(() => {
    logger.info(`Successfully Initialized at ${Date.now()}`)
})

const userCommandStatus = {}
client.on('messageCreate', message => {
    //봇이 만든 메시지나, 채널의 메시지가 아니거나, 명령어가 아닌 경우 무시
    if (message.author.bot || !message.guild || !message.content.startsWith('!')) return;

    //다른 명령어를 처리중인데 또 다른 명령어를 입력하려 시도하면 무시
    if (userCommandStatus[message.author.id] && message.content.startsWith('!')){
        message.reply('현재 다른 명령어를 실행중입니다.')
        return;
    }

    //명령어이면 '!' 제거 후 읽기
    const args = message.content.slice(1).split(/ +/);
    const command = args.shift().toLowerCase();

    //올바른 명령어가 아니면 무시
    if (!client.commands.has(command)) {
        message.reply("알 수 없는 명령어입니다. 명령어를 확인하시려면 !help를 입력해주세요.")
        return;
    }

    try {
        client.commands.get(command).execute(message, userCommandStatus, args);
    } catch (error) {
        console.error(error);
        message.reply('알 수 없는 오류가 발생했습니다.');
    }
});

cron.schedule('* * * * *', function(){
    logger.verbose("Running cron job")
    sendDailyProblem(client).then(r =>
        logger.verbose(r)
    ).catch(error =>{
        logger.error(error)
    })
});



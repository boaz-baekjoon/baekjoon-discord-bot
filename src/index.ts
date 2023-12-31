import {Client, Collection, GatewayIntentBits} from 'discord.js';
import { sendDailyProblem } from './bot/cron.js'
import * as cron from 'node-cron';
import { logger } from './logger.js'
import {initializeBot} from "./bot/initialize-bot.js";

declare module "discord.js" {
    export interface Client {
        commands: Collection<unknown, any>
    }
}
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
    try{
        //Ignore if message is from bot or not from guild
        if (message.author.bot || !message.guild || !message.content.startsWith('!')) return;

        //Slice the command and arguments
        // @ts-ignore
        const command: string = message.content.slice(1).split(/ +/).shift().toLowerCase();

        //Ignore if command is not in commands
        if (!client.commands.has(command)) {
            message.reply("알 수 없는 명령어입니다. 명령어를 확인하시려면 !help를 입력해주세요.")
            return;
        }

        client.commands.get(command).execute(message);
    }catch (error) {
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



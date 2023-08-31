const {Client, GatewayIntentBits, Collection} = require('discord.js')
const fs = require('fs');
const { sendRandomMessage } = require('./bot/cron')
const cron = require("node-cron");
const logger = require("./logger")

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.DirectMessages
    ],
});
const config = require("./config.json")

client.config = config;
client.commands = new Collection();

module.exports = client;

client.login(process.env.DISCORD_TOKEN);

require('./bot/welcome')


client.once('ready', async () => {
    console.log("BOJ Bot is ready")
})

const commands = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));
for (const file of commands) {
    const commandName = file.split(".")[0];
    const command = require(`./commands/${file}`);

    console.log(`Attempting to load command ${commandName}`);
    client.commands.set(commandName, command);
}

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
        console.log("Command Not Found")
        return;
    }

    try {
        console.log(`Entered Command : ${command}`)
        console.log(message.author.id)
        client.commands.get(command).execute(message, userCommandStatus, args);
    } catch (error) {
        console.error(error);
        message.reply('명령을 실행하는 동안 오류가 발생했습니다.');
    }
});

cron.schedule('* * * * *', function(){
    logger.verbose("Running cron job")
    sendRandomMessage(client).then(r =>
        logger.verbose(r)
    ).catch(error =>{
        logger.error(error)
    })
});



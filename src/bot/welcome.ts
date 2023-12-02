import { client } from '../index'
import { embedWelcome } from './guideMessage'
import { logger } from '../logger'

client.on("guildCreate", async(guild) => {
    let channel = guild.channels.cache.find(channel => channel.type === 0);
    logger.info(`${guild.ownerId} Uses Baekjoon bot newly`)
    if (!channel){
        logger.warn(`${guild.ownerId} / No chat channel found`)
        return;
    }
    channel.send({embeds: [embedWelcome]});
})



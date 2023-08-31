const client = require("../index")
const guideMessage = require("./guideMessage")
const logger = require("../logger")

client.on("guildCreate", async(guild) => {
    let channel = guild.channels.cache.find(channel => channel.type === 0);
    if (!channel){
        logger.warn(`${guild.ownerId} / No chat channel found`)
        return;
    }
    channel.send({embeds: [guideMessage]});
})



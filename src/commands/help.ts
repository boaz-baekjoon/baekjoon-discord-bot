import {embedWelcome} from '../bot/guideMessage';

module.exports = {
    name: 'Daily Notification',
    execute(message, userCommandStatus, args) {
        message.channel.send({embeds: [embedWelcome]})
    },
};
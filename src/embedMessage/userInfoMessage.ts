import {EmbedBuilder} from "discord.js";
import {SolvedAcUser} from "../model/solvedac_user_class.js";

export function getUserInfo(userClass: SolvedAcUser): EmbedBuilder{
    return new EmbedBuilder()
        .setColor(0x3498DB)
        .setAuthor({name: 'BOJ Bot', iconURL: 'https://avatars.githubusercontent.com/u/139442196?s=200&v=4'})
        .setThumbnail(userClass.profileImageUrl)
        .setTitle(userClass.username)
        .setDescription(userClass.bio)
        .addFields(
            {name: '\u200B', value: '\u200B'},
            {name: '티어', value: `${userClass.getTierName()}`, inline: true},
            {name: '푼 문제 수', value: `${userClass.solvedCount}`, inline: true},
            {name: '\u200B', value: '\u200B'},
            {name: 'Rating', value: `${userClass.rating}`, inline: true},
        )
        .setTimestamp()
        .setFooter({text: 'Baekjoon Bot', iconURL: 'https://avatars.githubusercontent.com/u/139442196?s=200&v=4'});
}

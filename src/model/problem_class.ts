import {EmbedBuilder} from 'discord.js';
import {logger} from "../logger.js";

export class BojProblem{
    problemId: number;
    title: string;
    level: number;
    tags: string[];
    constructor(problemId: number, title: string, level: number, tags: string[]) {
        this.problemId = problemId;
        this.title = title;
        this.level = level;
        this.tags = tags;
    }
    getLevel(){
        let probLevel = this.level
        if (1 <= probLevel && probLevel <= 5){
            return `브론즈 ${6-probLevel}`
        }else if (6 <= probLevel && probLevel <= 10){
            return `실버 ${11-probLevel}`
        }else if (11 <= probLevel && probLevel <= 15){
            return `골드 ${16-probLevel}`
        }else if (16 <= probLevel && probLevel <= 20){
            return `플레티넘 ${21-probLevel}`
        }else if (21 <= probLevel && probLevel<= 25){
            return `다이아 ${26-probLevel}`
        }else if (26 <= probLevel && probLevel <= 30){
            return `루비 ${31-probLevel}`
        }else{
            return `레벨 책정 안됨`
        }
    }

    getEmbedMsg(msgTitle: string){
        try{
            return new EmbedBuilder()
                .setColor(0x3498DB)
                .setAuthor({name: 'Baekjoon Bot', iconURL: 'https://avatars.githubusercontent.com/u/139442196?s=200&v=4'})
                .setTitle(msgTitle)
                .setThumbnail('https://avatars.githubusercontent.com/u/139442196?s=200&v=4')
                .addFields(
                    {name: '문제 번호:', value: `${this.problemId}`, inline: false},
                    {name: '문제:', value: `${this.title}`, inline: false},
                    {name: '난이도:', value: `${this.getLevel()}`, inline: false},
                    {
                        name: '알고리즘 분류:',
                        value: this.tags.length > 0 ? `${this.tags.join(', ')}` : '-',
                        inline: false
                    },
                    {name: '링크', value: `https://www.acmicpc.net/problem/${this.problemId}`, inline: false}
                )
                .setFooter({text: 'Baekjoon Bot. 버그가 발생한 경우 /report로 제보해주세요. /help을 통해 새로운 명령어를 반드시 확인해주세요!', iconURL: 'https://avatars.githubusercontent.com/u/139442196?s=200&v=4'})
        }catch (error){
            logger.error(error)
            return getProblemErrorMsg();
        }

    }

    hideTags(){
        this.tags = []
    }

}

export function getProblemErrorMsg(){
    return new BojProblem(-1, "알 수 없는 오류가 발생했습니다.", 0, [])
}
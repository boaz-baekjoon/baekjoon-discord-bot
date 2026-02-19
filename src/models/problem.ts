import mongoose from 'mongoose';
import { EmbedBuilder } from 'discord.js';
import { logger } from "../logger.js";
import { getTierName } from "../types.js";

export interface IProblem {
    problem_id: number;
    problem_title: string;
    problem_level: number;
    tag_key: string;
}

const ProblemSchema = new mongoose.Schema<IProblem>({
    problem_id: {type: Number, required: true},
    problem_title: {type: String, required: true},
    problem_level: {type: Number, required: true},
    tag_key: {type: String, required: true}
});

export const ProblemModel = mongoose.model<IProblem>('Problem', ProblemSchema, 'problem');

export class BojProblem {
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

    getLevel(): string {
        return getTierName(this.level);
    }

    getEmbedMsg(msgTitle: string): EmbedBuilder {
        try {
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
                        value: this.tags.length > 0 ? this.tags.join(', ') : '-',
                        inline: false
                    },
                    {name: '링크', value: `https://www.acmicpc.net/problem/${this.problemId}`, inline: false}
                )
                .setFooter({text: 'Baekjoon Bot. 버그가 발생한 경우 /report로 제보해주세요. /help을 통해 새로운 명령어를 반드시 확인해주세요!', iconURL: 'https://avatars.githubusercontent.com/u/139442196?s=200&v=4'});
        } catch (error) {
            logger.error(error);
            return new EmbedBuilder()
                .setColor(0x3498DB)
                .setTitle("오류")
                .setDescription("알 수 없는 오류가 발생했습니다.");
        }
    }

    hideTags(): void {
        this.tags = [];
    }
}

export function getProblemErrorMsg(): BojProblem {
    return new BojProblem(-1, "알 수 없는 오류가 발생했습니다.", 0, []);
}

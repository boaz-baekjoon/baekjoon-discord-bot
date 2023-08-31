const {EmbedBuilder} = require("discord.js");

class bojProblem{
    constructor(problemId, title, level, tags) {
        this.problemId = problemId
        this.title = title
        this.level = level
        this.tags = tags.map(tag => tag.key)
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

    getEmbedMsg(title){
        return new EmbedBuilder()
            .setColor(0x3498DB)
            .setAuthor({name: 'BOJ Bot'})
            .setTitle(title)
            .addFields(
                {name: '문제 번호:', value: `${this.problemId}`, inline: false},
                {name: '문제:', value: `${this.title}`, inline: false},
                {name: '난이도:', value: `${this.getLevel()}`, inline: false},
                {
                    name: '알고리즘 분류:',
                    value: this.tags.length > 0 ? `${this.tags.join(', ')}` : '알고리즘 분류가 되어있지 않습니다.',
                    inline: false
                },
                {name: '링크', value: `https://www.acmicpc.net/problem/${this.problemId}`, inline: false}
            )
            .setTimestamp();
    }
}

module.exports = {bojProblem}
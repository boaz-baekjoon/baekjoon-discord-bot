export class SolvedAcUser{
    username: string;
    bio: string;
    profileImageUrl: string;
    solvedCount: number;
    tier: number;
    rating: number;

    constructor(username: string, bio: string, profileImageUrl: string, solvedCount: number, tier: number, rating: number){
        this.username = username;
        this.bio = bio;
        this.profileImageUrl = profileImageUrl;
        this.solvedCount = solvedCount;
        this.tier = tier;
        this.rating = rating;
    }

    static returnErrorInstance(): SolvedAcUser{
        return new SolvedAcUser('error',
            'error',
            'error',
            -1,
            -1,
            -1);
    }

    static returnUserWithResponse(response: any): SolvedAcUser{
        return new SolvedAcUser(response.data['handle'],
            response.data['bio'],
            response.data['avatar'],
            response.data['solved_count'],
            response.data['level'],
            response.data['rating']);
    }

    getTierName(): string{
        if (1 <= this.tier && this.tier <= 5){
            return `브론즈 ${6-this.tier}`
        }else if (6 <= this.tier && this.tier <= 10){
            return `실버 ${11-this.tier}`
        }else if (11 <= this.tier && this.tier <= 15){
            return `골드 ${16-this.tier}`
        }else if (16 <= this.tier && this.tier <= 20){
            return `플레티넘 ${21-this.tier}`
        }else if (21 <= this.tier && this.tier<= 25){
            return `다이아 ${26-this.tier}`
        }else if (26 <= this.tier && this.tier <= 30){
            return `루비 ${31-this.tier}`
        }else if (this.tier == 31){
            return `마스터`
        }else{
            return `언랭`
        }
    }


}
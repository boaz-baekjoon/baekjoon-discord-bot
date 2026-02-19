import { AxiosResponse } from "axios";
import { getTierName } from "../types.js";

interface SolvedAcApiResponse {
    handle: string;
    bio: string;
    profileImageUrl: string | null;
    solvedCount: number;
    tier: number;
    rating: number;
}

export class SolvedAcUser {
    username: string;
    bio: string;
    profileImageUrl: string;
    solvedCount: number;
    tier: number;
    rating: number;

    constructor(username: string, bio: string, profileImageUrl: string, solvedCount: number, tier: number, rating: number) {
        this.username = username;
        this.bio = bio;
        this.profileImageUrl = profileImageUrl;
        this.solvedCount = solvedCount;
        this.tier = tier;
        this.rating = rating;
    }

    static returnErrorInstance(): SolvedAcUser {
        return new SolvedAcUser('error', 'error', 'error', -1, -1, -1);
    }

    static returnUserWithResponse(response: AxiosResponse<SolvedAcApiResponse>): SolvedAcUser {
        const data = response.data;
        return new SolvedAcUser(
            data.handle,
            data.bio === '' ? '자기소개가 없습니다.' : data.bio,
            data.profileImageUrl ?? 'https://static.solved.ac/misc/64x64/default_profile.png',
            data.solvedCount,
            data.tier,
            data.rating
        );
    }

    getTierName(): string {
        return getTierName(this.tier);
    }
}

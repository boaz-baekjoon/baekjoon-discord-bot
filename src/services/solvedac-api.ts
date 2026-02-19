import { SolvedAcUser } from "../models/solvedac-user.js";
import axios from "axios";
import { logger } from "../logger.js";

export async function searchUserInfoWithSolvedAc(userId: string): Promise<SolvedAcUser> {
    try {
        const response = await axios.get(`https://solved.ac/api/v3/user/show`, {
            timeout: 3000,
            params: {
                handle: userId,
            }
        });
        if (response.data.handle === userId) {
            return SolvedAcUser.returnUserWithResponse(response);
        }
    } catch (error: unknown) {
        logger.error(error instanceof Error ? error.message : error);
    }
    return SolvedAcUser.returnErrorInstance();
}

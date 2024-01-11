import {SolvedAcUser} from "../model/solvedac_user_class.js";
import axios from "axios";
import {logger} from "../logger.js";

export async function searchUserInfoWithSolvedAc(userId: string): Promise<SolvedAcUser> {
    try {
        const response = await axios.get(`https://solved.ac/api/v3/user/show`, {
            timeout: 3000,
            params: {
                handle: userId,
            }
        });
        if (response.data['handle'] === userId) {
            return SolvedAcUser.returnUserWithResponse(response);
        }
    } catch (error: any) {
        logger.error(error.message)
    }
    return SolvedAcUser.returnErrorInstance();
}
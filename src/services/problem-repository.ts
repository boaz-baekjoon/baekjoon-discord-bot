import { ProblemModel, BojProblem } from '../models/problem.js';
import { logger } from "../logger.js";

export class ProblemRepository {
    static async findByProblemId(problemId: number): Promise<BojProblem | null> {
        try {
            const problems = await ProblemModel.find({problem_id: problemId});
            if (problems.length === 0) {
                return null;
            }
            const {problem_id, problem_title, problem_level} = problems[0];
            const tags = problems.map((p) => p.tag_key);
            return new BojProblem(problem_id, problem_title, problem_level, tags);
        } catch (error: unknown) {
            logger.error(error instanceof Error ? error.message : error);
            return null;
        }
    }
}

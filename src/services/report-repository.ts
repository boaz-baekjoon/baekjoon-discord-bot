import { ReportModel } from '../models/report.js';
import { logger } from "../logger.js";

export class ReportRepository {
    static async insert(report: string): Promise<boolean> {
        try {
            const reportDoc = new ReportModel({
                message: report,
            });
            await reportDoc.save();
            return true;
        } catch (error: unknown) {
            logger.error(error instanceof Error ? error.message : error);
            return false;
        }
    }
}

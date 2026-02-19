import mongoose from 'mongoose';

interface IReport {
    message: string;
}

const ReportSchema = new mongoose.Schema<IReport>({
    message: {type: String, required: true},
});

export const ReportModel = mongoose.model<IReport>('Mongodb_report_schema', ReportSchema, 'boj_report');

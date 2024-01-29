import * as mongoose from 'mongoose';

interface IReport extends mongoose.Document {
    message: string;
}

const ReportSchema = new mongoose.Schema({
    message: {type: String, required: true},
});

export const Report = mongoose.model<IReport>('Mongodb_report_schema', ReportSchema, 'boj_report');
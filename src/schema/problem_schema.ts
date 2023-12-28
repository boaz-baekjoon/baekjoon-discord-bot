import * as mongoose from 'mongoose';



interface IProblem extends mongoose.Document {
    problemId: number;
    title: string;
    level: number;
    tag: string;
}

const ProblemSchema = new mongoose.Schema({
    problemId: {type: String, required: true},
    title: {type: String, required: true},
    level: {type: Number, required: true},
    tag: {type: String, required: true}
});

export const Problem = mongoose.model<IProblem>('Problem', ProblemSchema, 'problem');

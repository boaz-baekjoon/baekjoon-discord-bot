import * as mongoose from 'mongoose';



interface IProblem extends mongoose.Document {
    problem_id: number;
    problem_title: string;
    problem_level: number;
    tag_key: string;
}

const ProblemSchema = new mongoose.Schema({
    problem_id: {type: Number, required: true},
    problem_title: {type: String, required: true},
    problem_level: {type: Number, required: true},
    tag_key: {type: String, required: true}
});

export const Problem = mongoose.model<IProblem>('Problem', ProblemSchema, 'problem');

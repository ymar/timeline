import mongoose, { Schema, Document } from 'mongoose';

export interface ITimeEntry extends Document {
    project: mongoose.Types.ObjectId;
    description: string;
    duration: number;
    date: Date;
    user: mongoose.Types.ObjectId;
}

const TimeEntrySchema: Schema = new Schema({
    project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    description: { type: String, required: true },
    duration: { type: Number, required: true },
    date: { type: Date, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

export const TimeEntry = mongoose.models.TimeEntry || mongoose.model<ITimeEntry>('TimeEntry', TimeEntrySchema);

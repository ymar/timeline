import mongoose, { Schema, Document } from 'mongoose'

export interface ITimeEntry extends Document {
    user: mongoose.Types.ObjectId;
    project: mongoose.Types.ObjectId;
    description: string;
    date: Date;
    duration: number; // Duration in minutes
}

const TimeEntrySchema: Schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    duration: { type: Number, required: true }, // Duration in minutes
}, { timestamps: true });

export const TimeEntry = mongoose.models.TimeEntry || mongoose.model<ITimeEntry>('TimeEntry', TimeEntrySchema, 'time_entries');

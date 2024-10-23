import mongoose from 'mongoose';

const TimeEntrySchema = new mongoose.Schema({
    user: { type: String, default: 'default-user' },
    project: { type: String, required: true },
    task: { type: String, default: '' }, // Make task optional with default empty string
    date: { type: Date, required: true },
    duration: { type: Number, required: true }, // Duration in minutes
    notes: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

export const TimeEntry = mongoose.models.TimeEntry || mongoose.model('TimeEntry', TimeEntrySchema);

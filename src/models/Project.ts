import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  client: { type: String, required: true },
  description: { type: String },
  isActive: { type: Boolean, default: true },
  budgetHours: { type: Number, default: 0 }, // Total budgeted hours
  hourlyRate: { type: Number, default: 0 }, // Hourly rate for the project
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Project = mongoose.models.Project || mongoose.model('Project', ProjectSchema);

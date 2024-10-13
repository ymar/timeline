import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  name: string;
  // Add other project fields as needed
}

const ProjectSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  // Add other project fields as needed
}, { timestamps: true });

export default mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);

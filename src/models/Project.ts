import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  name: string;
  description?: string;
  client?: mongoose.Types.ObjectId;
  user?: mongoose.Types.ObjectId;
}

const ProjectSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  client: { type: Schema.Types.ObjectId, ref: 'Client' },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export const Project = mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);

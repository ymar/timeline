import mongoose, { Schema, Document } from 'mongoose';

export interface IClient extends Document {
  name: string;
  user: mongoose.Types.ObjectId;
}

const ClientSchema: Schema = new Schema({
  name: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

export const Client = mongoose.models.Client || mongoose.model<IClient>('Client', ClientSchema);

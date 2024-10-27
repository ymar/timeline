import mongoose from 'mongoose';

const ProfileSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  type: { type: String, enum: ['Employee', 'Contractor'], default: 'Employee' },
  roles: [{ type: String }],
  weeklyCapacity: { type: Number, default: 40 },
  hourlyRate: { type: Number, default: 0 },
  timezone: { type: String, default: 'Europe/Amsterdam' },
  photoUrl: { type: String },
  showWelcomePage: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Profile = mongoose.models.Profile || mongoose.model('Profile', ProfileSchema);

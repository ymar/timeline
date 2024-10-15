import { startOfWeek, endOfWeek, subDays } from 'date-fns';
import { connectToDatabase } from './db';
import { TimeEntry } from '@/models/TimeEntry';
import { Types } from 'mongoose';

export async function getWeekTimeEntries() {
  await connectToDatabase();

  const now = new Date();
  const weekStart = startOfWeek(now);
  const weekEnd = endOfWeek(now);


  const weekTimeEntries = await TimeEntry.find({
    date: {
      $gte: weekStart,
      $lte: weekEnd,
    },
  }).lean().sort({ date: 1 });

  return weekTimeEntries;
}


export async function getRecentTimeEntries(days = 7) {
  await connectToDatabase();

  const now = new Date();
  const startDate = subDays(now, days);


  const recentEntries = await TimeEntry.find({
    date: {
      $gte: startDate,
      $lte: now,
    },
  }).lean().sort({ date: -1 });

  return recentEntries;
}

export async function createTimeEntry(data: {
  date: Date;
  duration: number;
  description: string;
  projectId: string;
}) {
  await connectToDatabase();

  const TimeEntryModel = await import('@/models/TimeEntry').then(module => module.default);

  const newTimeEntry = new TimeEntryModel({
    ...data,
    project: new Types.ObjectId(data.projectId),
  });

  await newTimeEntry.save();
  return newTimeEntry;
}

export interface TimeEntryType {
  _id: string;
  project: string;
  description: string;
  date: string | Date;
  duration: number;
}

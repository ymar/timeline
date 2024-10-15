'use server'

import { connectToDatabase } from '@/lib/db';
import { TimeEntry } from '@/models/TimeEntry';

export async function addTimeEntry(formData: FormData) {
  const date = new Date(formData.get('date') as string)
  const project = formData.get('project') as string
  const description = formData.get('description') as string
  const duration = parseInt(formData.get('duration') as string, 10)

  try {
    const newEntry: Omit<TimeEntry, '_id'> = { date, project, description, duration }
    await createTimeEntry(newEntry)
    return { success: true }
  } catch (error) {
    console.error('Error adding time entry:', error)
    return { success: false, error: 'Failed to add time entry' }
  }
}

export async function createTimeEntry(data: {
  project: string;
  description: string;
  duration: number;
  date: string;
  userId: string;
}) {
  await connectToDatabase();
  
  const timeEntry = new TimeEntry({
    project: data.project,
    description: data.description,
    duration: data.duration,
    date: new Date(data.date),
    user: data.userId,
  });

  await timeEntry.save();
  return timeEntry;
}

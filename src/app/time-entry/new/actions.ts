import { connectToDatabase } from '@/lib/db';
import { Project } from '@/models/Project';
import { TimeEntry } from '@/models/TimeEntry';
import { startOfWeek, endOfWeek } from 'date-fns';

export async function getProjects() {
  try {
    await connectToDatabase();
    const projects = await Project.find({}).sort({ name: 1 }).lean();
    return projects.map(project => ({
      id: project._id.toString(),
      name: project.name,
    }));
  } catch (error) {
    console.error('Failed to fetch projects:', error);
    throw new Error('Failed to fetch projects');
  }
}

export async function getWeeklyTimeEntries() {
  try {
    await connectToDatabase();
    const now = new Date();
    const weekStart = startOfWeek(now);
    const weekEnd = endOfWeek(now);

    const entries = await TimeEntry.find({
      date: { $gte: weekStart, $lte: weekEnd }
    })
      .sort({ date: -1 })
      .populate('project', 'name')
      .lean();

    return entries.map(entry => ({
      id: entry._id.toString(),
      project: entry.project.name,
      description: entry.description,
      date: entry.date, // This is already a Date object
      duration: entry.duration,
    }));
  } catch (error) {
    console.error('Failed to fetch weekly time entries:', error);
    throw new Error('Failed to fetch weekly time entries');
  }
}

import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { TimeEntry } from '@/models/TimeEntry';

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const data = await req.json();
    console.log('Received data:', data); // Log the received data

    const { project, description, duration, date, userId } = data;

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const timeEntryData = {
      project,
      description,
      duration,
      date: new Date(date),
      user: userId, // Make sure this is set correctly
    };

    console.log('Time entry data:', timeEntryData); // Log the data being used to create the TimeEntry

    const timeEntry = new TimeEntry(timeEntryData);

    await timeEntry.save();

    return NextResponse.json({ message: 'Time entry created successfully', timeEntry });
  } catch (error) {
    console.error('Error creating time entry:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}

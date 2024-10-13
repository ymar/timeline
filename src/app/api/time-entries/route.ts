import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/lib/db';
import { TimeEntry } from '@/models/TimeEntry';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-config';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const { project, description, date, duration } = await req.json();

    const timeEntry = new TimeEntry({
      user: session.user.id, // Make sure your User model has an 'id' field
      project,
      description,
      date,
      duration: parseInt(duration, 10),
    });

    await timeEntry.save();
    return NextResponse.json({ message: 'Time entry created successfully' });
  } catch (error) {
    console.error('Error creating time entry:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

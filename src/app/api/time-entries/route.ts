import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { TimeEntry } from '@/models/TimeEntry';

export async function GET() {
  try {
    await connectToDatabase();
    const timeEntries = await TimeEntry.find().sort({ date: -1 });
    return NextResponse.json(timeEntries);
  } catch (error) {
    console.error('Error fetching time entries:', error);
    return NextResponse.json({ error: 'Failed to fetch time entries' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await connectToDatabase();
    const newTimeEntry = new TimeEntry(body);
    await newTimeEntry.save();
    return NextResponse.json(newTimeEntry, { status: 201 });
  } catch (error) {
    console.error('Error creating time entry:', error);
    return NextResponse.json({ error: 'Failed to create time entry' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    await connectToDatabase();
    const updatedTimeEntry = await TimeEntry.findByIdAndUpdate(
      body._id,
      { ...body, updatedAt: new Date() },
      { new: true }
    );
    if (!updatedTimeEntry) {
      return NextResponse.json({ error: 'Time entry not found' }, { status: 404 });
    }
    return NextResponse.json(updatedTimeEntry);
  } catch (error) {
    console.error('Error updating time entry:', error);
    return NextResponse.json({ error: 'Failed to update time entry' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    await connectToDatabase();
    const deletedTimeEntry = await TimeEntry.findByIdAndDelete(id);
    if (!deletedTimeEntry) {
      return NextResponse.json({ error: 'Time entry not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Time entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting time entry:', error);
    return NextResponse.json({ error: 'Failed to delete time entry' }, { status: 500 });
  }
}

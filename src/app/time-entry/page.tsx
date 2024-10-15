import { TimeEntryList } from '@/components/time-entry/TimeEntryList';
import { connectToDatabase } from '@/lib/db';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { TimeEntry } from '@/models/TimeEntry';

async function getTimeEntries(): Promise<TimeEntry[]> {
  await connectToDatabase();
  return TimeEntry.find().lean();
}

export default async function TimeEntryPage() {
  const timeEntries = await getTimeEntries();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Track your time</h1>
        <Link href="/time-entry/new">
          <Button>New Time Entry</Button>
        </Link>
      </div>
      <TimeEntryList timeEntries={timeEntries} />
    </div>
  );
}

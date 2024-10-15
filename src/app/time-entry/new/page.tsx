import { TimeEntryForm } from '@/components/time-entry/TimeEntryForm';
import { connectToDatabase } from '@/lib/db';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function NewTimeEntryPage() {
  await connectToDatabase();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Log New Time Entry</h1>
        <Link href="/time-entries">
          <Button variant="outline">
            Back to Time Entries
          </Button>
        </Link>
      </div>
      <TimeEntryForm />
    </div>
  );
}
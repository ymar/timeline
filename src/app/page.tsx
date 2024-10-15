import { Suspense } from 'react';
import TimeEntriesOverview from '@/components/TimeEntriesOverview';

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Time Tracker Dashboard</h1>
      <Suspense fallback={<div>Loading time entries...</div>}>
        <TimeEntriesOverview />
      </Suspense>
    </main>
  );
}

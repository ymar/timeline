import { getRecentTimeEntries } from '@/lib/time-entries';
import { format, parseISO } from 'date-fns';
import { TimeEntry } from '@/models/TimeEntry';

interface GroupedTimeEntries {
  [key: string]: {
    date: Date;
    entries: TimeEntry[];
  };
}

export default async function TimeEntriesOverview() {
  const recentEntries = await getRecentTimeEntries();
  const groupedEntries = groupEntriesByDay(recentEntries);

  return (
    <div className="space-y-6">
      {Object.entries(groupedEntries).map(([dayKey, { date, entries }]) => (
        <div key={dayKey} className="bg-white shadow rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-3">
            {format(date, 'EEEE, MMMM d')}
          </h2>
          <ul className="space-y-2">
            {entries.map((entry: TimeEntry) => (
              <li key={entry._id} className="flex justify-between items-center">
                <span>{entry.project.name}</span>
                <span>{entry.description}</span>
                <span>{formatDuration(entry.duration)}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function groupEntriesByDay(entries: TimeEntry[]): GroupedTimeEntries {
  const grouped: GroupedTimeEntries = {};

  entries.forEach((entry: TimeEntry) => {
    let date: Date;
    if (typeof entry.date === 'string') {
      date = parseISO(entry.date);
    } else if (entry.date instanceof Date) {
      date = entry.date;
    } else {
      console.error('Invalid date format for entry:', entry);
      return; // Skip this entry
    }

    const dayKey = format(date, 'yyyy-MM-dd');

    if (!grouped[dayKey]) {
      grouped[dayKey] = { date, entries: [] };
    }

    grouped[dayKey].entries.push(entry);
  });

  return grouped;
}

function formatDuration(duration: number): string {
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);
  return `${hours}h ${minutes}m`;
}

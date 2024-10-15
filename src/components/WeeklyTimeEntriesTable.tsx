'use client';

import { TimeEntry } from '@/models/TimeEntry';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';

interface WeeklyTimeEntriesTableProps {
  entries: TimeEntry[];
}

export default function WeeklyTimeEntriesTable({ entries }: WeeklyTimeEntriesTableProps) {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Weekly Time Entries</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Project</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Duration (hours)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry) => (
            <TableRow key={entry._id}>
              <TableCell>{format(new Date(entry.date), 'yyyy-MM-dd')}</TableCell>
              <TableCell>{entry.project.name}</TableCell>
              <TableCell>{entry.description}</TableCell>
              <TableCell>{entry.duration}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

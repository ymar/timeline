import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface TimeEntry {
  _id: string;
  name: string;
  description?: string;
}

interface TimeEntryListProps {
  timeEntries?: TimeEntry[];
}

export function TimeEntryList({ timeEntries = [] }: TimeEntryListProps) {
  if (timeEntries.length === 0) {
    return <p>No time entries found.</p>;
  }

  return (
    <div className="space-y-4">
      {timeEntries.map(({ _id, name, description }) => (
        <Card key={_id} className="w-full">
          <CardHeader>
            <CardTitle>{name}</CardTitle>
          </CardHeader>
          {description && <CardContent>{description}</CardContent>}
        </Card>
      ))}
    </div>
  );
}

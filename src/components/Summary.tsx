'use client';

import { useEffect, useState } from 'react';

interface TimeEntry {
  _id: string;
  project: string;
  task: string;
  duration: number;
  date: string;
}

const Summary = () => {
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);

  useEffect(() => {
    const fetchTimeEntries = async () => {
      const response = await fetch('/api/time-entries');
      const data = await response.json();
      setTimeEntries(data);
    };

    fetchTimeEntries();
  }, []);

  const totalDuration = timeEntries.reduce((acc, entry) => acc + entry.duration, 0);
  const projectSummary = timeEntries.reduce((acc, entry) => {
    acc[entry.project] = (acc[entry.project] || 0) + entry.duration;
    return acc;
  }, {} as { [key: string]: number });

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">Summary</h2>
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Total Time</h3>
          <p>{Math.round(totalDuration / 60)} hours</p>
        </div>
        <div>
          <h3 className="text-lg font-medium">Project Breakdown</h3>
          <ul className="list-disc list-inside">
            {Object.entries(projectSummary).map(([project, duration]) => (
              <li key={project}>
                {project}: {Math.round(duration / 60)} hours
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Summary;

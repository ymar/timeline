'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Plus, Pencil, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils"; // Add this import
import TimeEntryModal from './TimeEntryModal';

interface TimeEntry {
  _id: string;
  project: string;
  date: string;
  duration: number;
  notes: string;
  task?: string; // Make task optional to match the model
  user: string; // Add user field
}

interface Project {
  _id: string;
  name: string;
  client: string;
}

const WeeklyTimeEntry = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = new Date();
    const monday = new Date(today);
    monday.setDate(today.getDate() - today.getDay() + 1);
    monday.setHours(0, 0, 0, 0);
    return monday;
  });
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [projects, setProjects] = useState<{ [key: string]: Project }>({});
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [editingEntry, setEditingEntry] = useState<TimeEntry | null>(null);

  // Get the dates for the current week
  const getCurrentWeekDates = () => {
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(currentWeekStart);
      date.setDate(currentWeekStart.getDate() + i);
      return date;
    });
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentWeekStart(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setDate(prevDate.getDate() + (direction === 'next' ? 7 : -7));
      return newDate;
    });
  };

  const goToToday = () => {
    const today = new Date();
    const monday = new Date(today);
    monday.setDate(today.getDate() - today.getDay() + 1);
    monday.setHours(0, 0, 0, 0);
    setCurrentWeekStart(monday);
  };

  useEffect(() => {
    fetchData();
  }, [refreshTrigger]);

  const fetchData = async () => {
    try {
      // Fetch time entries
      const entriesResponse = await fetch('/api/time-entries');
      if (!entriesResponse.ok) throw new Error('Failed to fetch time entries');
      const entriesData = await entriesResponse.json();
      setTimeEntries(entriesData);

      // Fetch projects
      const projectsResponse = await fetch('/api/projects');
      if (!projectsResponse.ok) throw new Error('Failed to fetch projects');
      const projectsData = await projectsResponse.json();
      const projectsMap = projectsData.reduce((acc: any, project: Project) => {
        acc[project._id] = project;
        return acc;
      }, {});
      setProjects(projectsMap);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSuccess = () => {
    // Increment refresh trigger to fetch new data
    setRefreshTrigger(prev => prev + 1);
  };

  const getEntriesForDate = (date: Date) => {
    return timeEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      return (
        entryDate.getDate() === date.getDate() &&
        entryDate.getMonth() === date.getMonth() &&
        entryDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const formatDuration = (minutes: number) => {
    return (minutes / 60).toFixed(1);
  };

  const weekDates = getCurrentWeekDates();
  const weekTotal = timeEntries
    .filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= weekDates[0] && entryDate <= weekDates[6];
    })
    .reduce((sum, entry) => sum + entry.duration, 0);

  const handleDeleteEntry = async (entryId: string) => {
    if (confirm('Are you sure you want to delete this time entry?')) {
      await fetch(`/api/time-entries?id=${entryId}`, { method: 'DELETE' });
      setRefreshTrigger(prev => prev + 1);
    }
  };

  const handleEditEntry = (entry: TimeEntry) => {
    setEditingEntry(entry);
    setShowModal(true);
  };

  const handleAddNewEntry = () => {
    setEditingEntry(null);
    setShowModal(true);
  };

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setEditingEntry(null);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigateWeek('prev')}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigateWeek('next')}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <CardTitle className="text-lg font-medium">
            {weekDates[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {' '}
            {weekDates[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={goToToday}
            className="flex items-center"
          >
            <Calendar className="h-3 w-3 mr-1" />
            Today
          </Button>
          <Badge variant="secondary">
            Week Total: {formatDuration(weekTotal)}h
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-4">
          {weekDates.map((date) => {
            const entries = getEntriesForDate(date);
            const totalHours = entries.reduce((sum, entry) => sum + entry.duration, 0);
            const isToday = new Date().toDateString() === date.toDateString();
            const isSelected = selectedDate?.toDateString() === date.toDateString();

            return (
              <Card
                key={date.toISOString()}
                className={cn(
                  "cursor-pointer hover:border-primary transition-colors",
                  isToday && "border-blue-500",
                  isSelected && "bg-accent"
                )}
                onClick={() => handleDayClick(date)}
              >
                <CardContent className="p-4">
                  <div className="text-sm font-medium text-muted-foreground">
                    {date.toLocaleDateString('en-US', { weekday: 'short' })}
                  </div>
                  <div className="font-bold mb-2">
                    {date.toLocaleDateString('en-US', { day: 'numeric' })}
                  </div>
                  <div className="space-y-2">
                    {entries.map(entry => (
                      <div key={entry._id} className="text-sm">
                        <div className="font-medium text-primary">
                          {projects[entry.project]?.name}
                        </div>
                        <div className="text-muted-foreground">
                          {formatDuration(entry.duration)}h
                        </div>
                      </div>
                    ))}
                    <div className="text-sm font-medium text-muted-foreground pt-2 border-t">
                      Total: {formatDuration(totalHours)}h
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {selectedDate && (
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">
                Entries for {selectedDate.toLocaleDateString('en-US', { 
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric'
                })}
              </h3>
              <Button onClick={handleAddNewEntry}>
                <Plus className="h-4 w-4 mr-2" />
                Add Entry
              </Button>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Hours</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getEntriesForDate(selectedDate).map((entry) => (
                    <TableRow key={entry._id}>
                      <TableCell className="font-medium">
                        {projects[entry.project]?.name}
                      </TableCell>
                      <TableCell>{projects[entry.project]?.client}</TableCell>
                      <TableCell>{formatDuration(entry.duration)}h</TableCell>
                      <TableCell>{entry.notes}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditEntry(entry)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteEntry(entry._id)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {getEntriesForDate(selectedDate).length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">
                        No entries for this day. Click "Add Entry" to create one.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {showModal && selectedDate && (
          <TimeEntryModal
            date={selectedDate}
            onClose={() => setShowModal(false)}
            onSuccess={handleSuccess}
            editingEntry={editingEntry}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default WeeklyTimeEntry;

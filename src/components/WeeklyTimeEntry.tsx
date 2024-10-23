'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Plus, Pencil, Trash2 } from 'lucide-react';
import TimeEntryModal from './TimeEntryModal';

interface TimeEntry {
  _id: string;
  project: string;
  date: string;
  duration: number;
  notes: string;
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
    <div className="bg-white shadow-md rounded-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <button
              onClick={() => navigateWeek('prev')}
              className="p-1.5 hover:bg-gray-100 rounded-full"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => navigateWeek('next')}
              className="p-1.5 hover:bg-gray-100 rounded-full"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <h2 className="text-lg font-medium">
            {weekDates[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {' '}
            {weekDates[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </h2>
          <button
            onClick={goToToday}
            className="flex items-center px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
          >
            <Calendar className="h-3 w-3 mr-1" />
            Today
          </button>
          <span className="text-sm text-gray-500 ml-2">
            Week Total: {formatDuration(weekTotal)}h
          </span>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-4">
        {weekDates.map((date) => {
          const entries = getEntriesForDate(date);
          const totalHours = entries.reduce((sum, entry) => sum + entry.duration, 0);
          const isToday = new Date().toDateString() === date.toDateString();
          const isSelected = selectedDate?.toDateString() === date.toDateString();

          return (
            <div
              key={date.toISOString()}
              className={`border rounded-lg p-4 cursor-pointer hover:border-blue-500 transition-colors ${
                isToday ? 'border-blue-500' : ''
              } ${isSelected ? 'bg-blue-50' : ''}`}
              onClick={() => handleDayClick(date)}
            >
              <div className="text-sm font-medium text-gray-500">
                {date.toLocaleDateString('en-US', { weekday: 'short' })}
              </div>
              <div className="font-bold mb-2">
                {date.toLocaleDateString('en-US', { day: 'numeric' })}
              </div>
              <div className="space-y-2">
                {entries.map(entry => (
                  <div key={entry._id} className="text-sm">
                    <div className="font-medium text-blue-600">
                      {projects[entry.project]?.name}
                    </div>
                    <div className="text-gray-600">
                      {formatDuration(entry.duration)}h
                    </div>
                  </div>
                ))}
                <div className="text-sm font-medium text-gray-700 pt-2 border-t">
                  Total: {formatDuration(totalHours)}h
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Day Details */}
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
            <button
              onClick={handleAddNewEntry}
              className="bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Entry
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Project
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hours
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Notes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {getEntriesForDate(selectedDate).map((entry) => (
                  <tr key={entry._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">
                        {projects[entry.project]?.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-500">
                        {projects[entry.project]?.client}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {formatDuration(entry.duration)}h
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-500">
                        {entry.notes}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditEntry(entry)}
                          className="text-blue-500 hover:text-blue-600"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteEntry(entry._id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {getEntriesForDate(selectedDate).length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                      No entries for this day. Click "Add Entry" to create one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
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
    </div>
  );
};

export default WeeklyTimeEntry;

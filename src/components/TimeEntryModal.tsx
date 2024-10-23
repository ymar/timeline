'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface Project {
  _id: string;
  name: string;
  client: string;
}

interface TimeEntry {
  _id: string;
  project: string;
  date: string;
  duration: number;
  notes: string;
  task: string;
}

interface TimeEntryForm {
  project: string;
  hours: string;
  notes: string;
  task: string; // Add task to the form interface
}

interface Props {
  date: Date;
  onClose: () => void;
  onSuccess: () => void;
  editingEntry?: TimeEntry | null;
}

const TimeEntryModal = ({ date, onClose, onSuccess, editingEntry }: Props) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [formData, setFormData] = useState<TimeEntryForm>({
    project: '',
    hours: '',
    notes: '',
    task: '', // Initialize task field
  });

  useEffect(() => {
    const fetchProjects = async () => {
      const response = await fetch('/api/projects');
      const data = await response.json();
      setProjects(data);
    };
    fetchProjects();

    // If editing, populate form with existing data
    if (editingEntry) {
      setFormData({
        project: editingEntry.project,
        hours: (editingEntry.duration / 60).toFixed(1),
        notes: editingEntry.notes,
        task: editingEntry.task || '', // Include task in edit mode
      });
    }
  }, [editingEntry]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Convert hours input to decimal (handle both formats: 1,5 and 1:30)
      let hours = 0;
      if (formData.hours.includes(':')) {
        const [h, m] = formData.hours.split(':');
        hours = parseInt(h) + parseInt(m) / 60;
      } else {
        hours = parseFloat(formData.hours.replace(',', '.'));
      }

      const timeEntry = {
        project: formData.project,
        date: date.toISOString(),
        duration: Math.round(hours * 60), // Convert hours to minutes
        notes: formData.notes,
        user: 'default-user',
        task: formData.task, // Include task in the submission
      };

      if (editingEntry) {
        const response = await fetch('/api/time-entries', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...timeEntry, _id: editingEntry._id }),
        });
        if (!response.ok) throw new Error('Failed to update entry');
      } else {
        const response = await fetch('/api/time-entries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(timeEntry),
        });
        if (!response.ok) throw new Error('Failed to create entry');
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving time entry:', error);
      alert('Failed to save time entry. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="h-5 w-5" />
        </button>
        <h2 className="text-2xl font-semibold mb-4">
          {editingEntry ? 'Edit Time Entry' : 'Add Time Entry'} for {date.toLocaleDateString()}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="project" className="block text-sm font-medium text-gray-700">
              Project
            </label>
            <select
              id="project"
              required
              className="mt-1 block w-full p-2 border rounded-md bg-white"
              value={formData.project}
              onChange={(e) => setFormData({ ...formData, project: e.target.value })}
            >
              <option value="">Select a project</option>
              {projects.map((project) => (
                <option key={project._id} value={project._id}>
                  {project.name} ({project.client})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="task" className="block text-sm font-medium text-gray-700">
              Task (optional)
            </label>
            <input
              type="text"
              id="task"
              className="mt-1 block w-full p-2 border rounded-md"
              value={formData.task}
              onChange={(e) => setFormData({ ...formData, task: e.target.value })}
              placeholder="What did you work on?"
            />
          </div>
          <div>
            <label htmlFor="hours" className="block text-sm font-medium text-gray-700">
              Hours
            </label>
            <input
              type="text"
              id="hours"
              required
              placeholder="1,5 or 1:30"
              className="mt-1 block w-full p-2 border rounded-md"
              value={formData.hours}
              onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
              pattern="^(\d+([,\.]\d+)?|\d+:\d{2})$"
              title="Enter hours as 1,5 or 1:30"
            />
          </div>
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
              Notes
            </label>
            <textarea
              id="notes"
              rows={3}
              className="mt-1 block w-full p-2 border rounded-md"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>
          <div className="flex space-x-3">
            <button
              type="submit"
              className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Save Entry
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TimeEntryModal;

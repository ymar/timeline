'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface Project {
  _id: string;
  name: string;
  isActive?: boolean;
}

export function TimeEntryForm() {
  const { data: session } = useSession();
  const [projects, setProjects] = useState<Project[]>([]);
  const [formData, setFormData] = useState({
    project: '',
    description: '',
    date: '',
    duration: '',
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      const response = await fetch('/api/projects');
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
    }
    fetchProjects();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) {
      setMessage({ type: 'error', text: 'You must be logged in to add time entries.' });
      return;
    }

    try {
      const response = await fetch('/api/time-entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Time entry added successfully.' });
        setFormData({ project: '', description: '', date: '', duration: '' });
      } else {
        setMessage({ type: 'error', text: 'Failed to add time entry.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred while adding the time entry.' });
    }

    // Clear the message after 3 seconds
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {message && (
        <div className={`p-2 rounded ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message.text}
        </div>
      )}
      <select
        name="project"
        value={formData.project}
        onChange={handleInputChange}
        className="w-full p-2 border border-gray-300 rounded"
        required
      >
        <option value="">Select a project</option>
        {projects.map((project) => (
          <option key={project._id} value={project._id}>
            {project.name} {project.isActive === false ? '(Inactive)' : ''}
          </option>
        ))}
      </select>
      <Input
        type="text"
        name="description"
        value={formData.description}
        onChange={handleInputChange}
        placeholder="Description"
        required
      />
      <Input
        type="date"
        name="date"
        value={formData.date}
        onChange={handleInputChange}
        required
      />
      <Input
        type="number"
        name="duration"
        value={formData.duration}
        onChange={handleInputChange}
        placeholder="Duration (minutes)"
        required
      />
      <Button type="submit">Add Time Entry</Button>
    </form>
  );
}

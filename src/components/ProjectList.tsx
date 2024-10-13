'use client';

import { useState, useEffect } from 'react';
import { Project } from '@/models/Project';

export function ProjectList() {
  const [projects, setProjects] = useState<Project[]>([]);

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

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Project List</h2>
      <ul className="space-y-2">
        {projects.map((project) => (
          <li key={project._id} className="bg-white p-4 rounded shadow">
            <h3 className="font-bold">{project.name}</h3>
            <p className="text-gray-600">{project.description}</p>
            <p className="text-sm text-gray-500">
              Status: {project.isActive ? 'Active' : 'Inactive'}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

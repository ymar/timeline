'use client';

import { useEffect, useState } from 'react';
import { Trash2, Pencil } from 'lucide-react';

interface Project {
  _id: string;
  name: string;
  client: string;
  description: string;
  isActive: boolean;
}

interface Client {
  _id: string;
  name: string;
}

interface Props {
  refreshTrigger: number;
}

const ProjectList = ({ refreshTrigger }: Props) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  useEffect(() => {
    fetchProjects();
    fetchClients();
  }, [refreshTrigger]);

  const fetchProjects = async () => {
    const response = await fetch('/api/projects');
    const data = await response.json();
    setProjects(data);
  };

  const fetchClients = async () => {
    const response = await fetch('/api/clients');
    const data = await response.json();
    setClients(data);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      await fetch(`/api/projects?id=${id}`, { method: 'DELETE' });
      fetchProjects();
    }
  };

  const handleUpdate = async (project: Project) => {
    await fetch('/api/projects', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(project),
    });
    setEditingProject(null);
    fetchProjects();
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">Project List</h2>
      <div className="space-y-4">
        {projects.map((project) => (
          <div
            key={project._id}
            className="border rounded-lg p-4 flex justify-between items-start"
          >
            {editingProject?._id === project._id ? (
              <div className="space-y-2 w-full">
                <input
                  type="text"
                  value={editingProject.name}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, name: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                />
                <select
                  value={editingProject.client}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, client: e.target.value })
                  }
                  className="w-full p-2 border rounded bg-white"
                >
                  {clients.map((client) => (
                    <option key={client._id} value={client.name}>
                      {client.name}
                    </option>
                  ))}
                </select>
                <textarea
                  value={editingProject.description}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, description: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                />
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleUpdate(editingProject)}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingProject(null)}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div>
                  <h3 className="text-lg font-medium">{project.name}</h3>
                  <p className="text-blue-600 font-medium">{project.client}</p>
                  <p className="text-gray-500 mt-2">{project.description}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditingProject(project)}
                    className="text-blue-500 hover:text-blue-600"
                  >
                    <Pencil className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(project._id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectList;

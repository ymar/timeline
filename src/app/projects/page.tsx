'use client';

import { useState } from 'react';
import ProjectList from '@/components/ProjectList';
import NewProjectForm from '@/components/NewProjectForm';
import { Plus, X } from 'lucide-react';

export default function ProjectsPage() {
  const [showForm, setShowForm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleSuccess = () => {
    setShowSuccess(true);
    setRefreshTrigger(prev => prev + 1); // Increment refresh trigger
    setTimeout(() => setShowSuccess(false), 3000); // Hide after 3 seconds
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Projects</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          New Project
        </button>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg flex items-center justify-between">
          <span>Project created successfully!</span>
          <button
            onClick={() => setShowSuccess(false)}
            className="text-green-700 hover:text-green-900"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Project List */}
      <div className="grid grid-cols-1 gap-8">
        <ProjectList refreshTrigger={refreshTrigger} />
      </div>

      {/* New Project Form Modal */}
      {showForm && (
        <NewProjectForm
          onClose={() => setShowForm(false)}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}

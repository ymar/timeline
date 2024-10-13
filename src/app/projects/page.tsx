import { ProjectList } from '@/components/ProjectList';
import { ProjectForm } from '@/components/ProjectForm';

export default function ProjectsPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Projects</h1>
      <ProjectForm />
      <ProjectList />
    </div>
  );
}

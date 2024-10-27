'use client';

import { useEffect, useState } from 'react';
import { Trash2, Pencil } from 'lucide-react';
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

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
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Project Name</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <TableRow key={project._id}>
              {editingProject?._id === project._id ? (
                <>
                  <TableCell colSpan={4}>
                    <div className="space-y-2">
                      <Input
                        value={editingProject.name}
                        onChange={(e) =>
                          setEditingProject({ ...editingProject, name: e.target.value })
                        }
                        placeholder="Project name"
                      />
                      <Select
                        value={editingProject.client}
                        onValueChange={(value) =>
                          setEditingProject({ ...editingProject, client: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select client" />
                        </SelectTrigger>
                        <SelectContent>
                          {clients.map((client) => (
                            <SelectItem key={client._id} value={client.name}>
                              {client.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Textarea
                        value={editingProject.description}
                        onChange={(e) =>
                          setEditingProject({ ...editingProject, description: e.target.value })
                        }
                        placeholder="Project description"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => handleUpdate(editingProject)}
                      >
                        Save
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => setEditingProject(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </TableCell>
                </>
              ) : (
                <>
                  <TableCell>
                    <Link 
                      href={`/projects/${project._id}`}
                      className="font-medium text-blue-600 hover:text-blue-800"
                    >
                      {project.name}
                    </Link>
                  </TableCell>
                  <TableCell>{project.client}</TableCell>
                  <TableCell className="max-w-md truncate">
                    {project.description}
                  </TableCell>
                  <TableCell>
                    <Badge variant={project.isActive ? "success" : "secondary"}>
                      {project.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingProject(project)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(project._id)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </>
              )}
            </TableRow>
          ))}
          {projects.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground">
                No projects found. Click "New Project" to add one.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProjectList;

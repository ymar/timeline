import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Project {
  _id: string;
  name: string;
  description?: string;
}

interface ProjectListProps {
  projects: Project[];
}

export function ProjectList({ projects }: ProjectListProps) {
  return (
    <div className="space-y-4">
      {projects.map((project) => (
        <Card key={project._id} className="w-full">
          <CardHeader>
            <CardTitle>{project.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>{project.description}</CardDescription>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

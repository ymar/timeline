'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react'; // If you're using NextAuth
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Project {
  _id: string;  // Changed from 'id' to '_id' to match the MongoDB structure
  name: string;
}

export function TimeEntryForm() {
  const { data: session } = useSession(); // If using NextAuth
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    project: '',
    description: '',
    duration: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      setIsLoadingProjects(true);
      try {
        const response = await fetch('/api/projects');
        console.log('Project fetch response:', response.status, response.statusText);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Fetched projects data:', data);
          
          if (data && Array.isArray(data.projects) && data.projects.length > 0) {
            setProjects(data.projects);
            console.log('Projects set:', data.projects);
          } else {
            console.warn('Fetched data is empty or projects is not an array:', data);
            setProjects([]);
          }
        } else {
          console.error('Failed to fetch projects:', await response.text());
          setProjects([]);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
        setProjects([]);
      } finally {
        setIsLoadingProjects(false);
      }
    }

    fetchProjects();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProjectChange = (value: string) => {
    setFormData(prev => ({ ...prev, project: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!session?.user?.id) {
      toast({
        title: "Error",
        description: "User not authenticated",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch('/api/time-entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, userId: session.user.id }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Time entry created successfully",
        });
        // Reset form or navigate away
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.error || "Failed to create time entry",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error submitting time entry:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="project">Project</Label>
        <Select onValueChange={(value) => setFormData(prev => ({ ...prev, project: value }))} value={formData.project}>
          <SelectTrigger>
            <SelectValue placeholder="Select a project" />
          </SelectTrigger>
          <SelectContent>
            {isLoadingProjects ? (
              <SelectItem value="loading" disabled>Loading projects...</SelectItem>
            ) : projects.length > 0 ? (
              projects.map((project) => (
                <SelectItem key={project._id} value={project._id}>{project.name}</SelectItem>
              ))
            ) : (
              <SelectItem value="no-projects" disabled>No projects available</SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="duration">Duration (hours)</Label>
        <Input
          id="duration"
          name="duration"
          type="number"
          value={formData.duration}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          name="date"
          type="date"
          value={formData.date}
          onChange={handleChange}
          required
        />
      </div>
      <Button type="submit">Submit Time Entry</Button>
    </form>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft, Clock, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";

interface Project {
  _id: string;
  name: string;
  client: string;
  description: string;
  isActive: boolean;
  budgetHours: number;
  hourlyRate: number;
}

interface TimeEntry {
  _id: string;
  project: string;
  date: string;
  duration: number;
  notes: string;
  task: string;
}

export default function ProjectDetailPage() {
  const params = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    budgetHours: 0,
    hourlyRate: 0,
  });

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        // Fetch project details
        const projectResponse = await fetch(`/api/projects/${params.id}`);
        const projectData = await projectResponse.json();
        setProject(projectData);
        setEditForm({
          budgetHours: projectData.budgetHours,
          hourlyRate: projectData.hourlyRate,
        });

        // Fetch time entries for this project
        const entriesResponse = await fetch('/api/time-entries');
        const entriesData = await entriesResponse.json();
        setTimeEntries(entriesData.filter((entry: TimeEntry) => entry.project === params.id));
      } catch (error) {
        console.error('Error fetching project data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [params.id]);

  const handleUpdateBudget = async () => {
    try {
      const response = await fetch(`/api/projects/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          budgetHours: editForm.budgetHours,
          hourlyRate: editForm.hourlyRate,
        }),
      });

      if (response.ok) {
        const updatedProject = await response.json();
        setProject(updatedProject);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating budget:', error);
    }
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (!project) {
    return <div className="container mx-auto px-4 py-8">Project not found</div>;
  }

  const totalHours = timeEntries.reduce((sum, entry) => sum + entry.duration, 0) / 60;
  const remainingHours = project.budgetHours - totalHours;
  const totalBudget = project.budgetHours * project.hourlyRate;
  const spentBudget = totalHours * project.hourlyRate;
  const remainingBudget = totalBudget - spentBudget;
  const isOverBudget = remainingHours < 0;

  // Calculate monthly hours
  const monthlyHours = timeEntries.reduce((acc, entry) => {
    const month = new Date(entry.date).toLocaleString('default', { 
      month: 'long',
      year: 'numeric'
    });
    return acc.set(month, (acc.get(month) || 0) + entry.duration / 60);
  }, new Map<string, number>());

  // Sort monthly entries by date
  const sortedMonthlyEntries = Array.from(monthlyHours.entries())
    .sort((a, b) => {
      const dateA = new Date(a[0]);
      const dateB = new Date(b[0]);
      return dateB.getTime() - dateA.getTime();
    });

  return (
    <div className="container mx-auto max-w-7xl py-8">
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href="/projects" className="flex items-center text-muted-foreground">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <CardTitle className="text-3xl mb-2">{project.name}</CardTitle>
            <p className="text-lg text-primary">{project.client}</p>
            {project.description && (
              <p className="text-muted-foreground mt-2">{project.description}</p>
            )}
          </div>
          
          <Card className="w-[300px]">
            <CardHeader>
              <CardTitle>Budget Information</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Budget Hours</label>
                    <Input
                      type="number"
                      value={editForm.budgetHours}
                      onChange={(e) => setEditForm({ ...editForm, budgetHours: parseFloat(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Hourly Rate</label>
                    <Input
                      type="number"
                      value={editForm.hourlyRate}
                      onChange={(e) => setEditForm({ ...editForm, hourlyRate: parseFloat(e.target.value) })}
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={handleUpdateBudget}>Save</Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Budget Hours:</span>
                    <span className="font-medium">{project.budgetHours}h</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Hours Spent:</span>
                    <span className="font-medium">{totalHours.toFixed(1)}h</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Remaining:</span>
                    <Badge variant={isOverBudget ? "destructive" : "secondary"}>
                      {remainingHours.toFixed(1)}h
                    </Badge>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total Budget:</span>
                      <span className="font-medium">€{totalBudget.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Spent:</span>
                      <span className="font-medium">€{spentBudget.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Remaining:</span>
                      <Badge variant={remainingBudget < 0 ? "destructive" : "secondary"}>
                        €{remainingBudget.toFixed(2)}
                      </Badge>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full" onClick={() => setIsEditing(true)}>
                    Edit Budget
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Progress Bar */}
          <div>
            <Progress 
              value={Math.min((totalHours / project.budgetHours) * 100, 100)}
              className={isOverBudget ? "text-destructive" : undefined}
            />
            {isOverBudget && (
              <div className="flex items-center mt-2 text-destructive text-sm">
                <AlertCircle className="h-4 w-4 mr-1" />
                Over budget by {Math.abs(remainingHours).toFixed(1)} hours
              </div>
            )}
          </div>

          {/* Monthly Breakdown */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Monthly Breakdown</h2>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {sortedMonthlyEntries.map(([month, hours]) => (
                <Card key={month}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{month}</div>
                      <div className="text-muted-foreground">{hours.toFixed(1)}h</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {sortedMonthlyEntries.length === 0 && (
                <p className="col-span-full text-center text-muted-foreground py-4">
                  No time entries recorded yet
                </p>
              )}
            </div>
          </div>

          {/* Recent Time Entries */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Recent Time Entries</h2>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Task</TableHead>
                    <TableHead>Hours</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {timeEntries
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((entry) => (
                      <TableRow key={entry._id}>
                        <TableCell>
                          {new Date(entry.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{entry.task || '-'}</TableCell>
                        <TableCell>{(entry.duration / 60).toFixed(1)}h</TableCell>
                        <TableCell className="text-muted-foreground">
                          {entry.notes || '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

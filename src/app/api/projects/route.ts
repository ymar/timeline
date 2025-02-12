import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Project } from '@/models/Project';

export async function GET() {
  await connectToDatabase();
  const projects = await Project.find().sort({ createdAt: -1 });
  return NextResponse.json(projects);
}

export async function POST(request: Request) {
  const body = await request.json();
  await connectToDatabase();
  const newProject = new Project(body);
  await newProject.save();
  return NextResponse.json(newProject, { status: 201 });
}

export async function PUT(request: Request) {
  const body = await request.json();
  await connectToDatabase();
  const updatedProject = await Project.findByIdAndUpdate(
    body._id,
    { ...body, updatedAt: new Date() },
    { new: true }
  );
  return NextResponse.json(updatedProject);
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  await connectToDatabase();
  await Project.findByIdAndDelete(id);
  return NextResponse.json({ message: 'Project deleted successfully' });
}

import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/lib/db';
import { Project } from '@/models/Project';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-config';

export async function GET() {
  try {
    await connectToDatabase();
    // Fetch all projects, not just active ones
    const projects = await Project.find().select('_id name');
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const { name, description } = await req.json();

    const project = new Project({
      name,
      description,
    });

    await project.save();
    return NextResponse.json({ message: 'Project created successfully' });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Project } from '@/models/Project'; // Changed to named import

export async function GET() {
  try {
    await connectToDatabase();
    const projects = await Project.find({}).select('_id name');
    return NextResponse.json({ projects });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
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

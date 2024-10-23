import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Client } from '@/models/Client';

export async function GET() {
  await connectToDatabase();
  const clients = await Client.find().sort({ createdAt: -1 });
  return NextResponse.json(clients);
}

export async function POST(request: Request) {
  const body = await request.json();
  await connectToDatabase();
  const newClient = new Client(body);
  await newClient.save();
  return NextResponse.json(newClient, { status: 201 });
}

export async function PUT(request: Request) {
  const body = await request.json();
  await connectToDatabase();
  const updatedClient = await Client.findByIdAndUpdate(
    body._id,
    { ...body, updatedAt: new Date() },
    { new: true }
  );
  return NextResponse.json(updatedClient);
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  await connectToDatabase();
  await Client.findByIdAndDelete(id);
  return NextResponse.json({ message: 'Client deleted successfully' });
}

import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { User } from '@/models/User';

export async function GET() {
  try {
    await connectToDatabase();
    // For now, get the first user (we'll add authentication later)
    const user = await User.findOne({ email: 'ymar.frenken@wearebrite.nl' });
    
    if (!user) {
      // Create a default user if none exists
      const defaultUser = new User({
        firstName: 'Ymar',
        lastName: 'Frenken',
        email: 'ymar.frenken@wearebrite.nl',
        type: 'Employee',
        roles: [],
        weeklyCapacity: 40,
        timezone: 'Europe/Amsterdam',
      });
      await defaultUser.save();
      return NextResponse.json(defaultUser);
    }
    
    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json({ error: 'Failed to fetch user profile' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    await connectToDatabase();
    
    const user = await User.findOneAndUpdate(
      { email: 'ymar.frenken@wearebrite.nl' }, // For now, hardcode the email
      { 
        ...body,
        updatedAt: new Date()
      },
      { new: true, upsert: true }
    );

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json({ error: 'Failed to update user profile' }, { status: 500 });
  }
}

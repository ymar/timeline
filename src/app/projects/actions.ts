'use server'

import { connectToDatabase } from '@/lib/db'
import { Project } from '@/models/Project'
import { Client } from '@/models/Client'
import { getServerSession } from 'next-auth/next'
import authOptions from '@/app/api/auth/[...nextauth]/auth-config'
import { revalidatePath } from "next/cache"
import { redirect } from 'next/navigation'

interface SessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export async function createProject(name: string, clientId: string) {
  await connectToDatabase()
  const session = await getServerSession(authOptions)
  
  if (!session?.user || !(session.user as SessionUser).id) {
    throw new Error('User not authenticated')
  }

  console.log('Creating project with name:', name, 'and clientId:', clientId)

  // Verify that the client exists
  const client = await Client.findById(clientId)
  if (!client) {
    console.log('Client not found for id:', clientId)
    throw new Error('Invalid client ID')
  }

  console.log('Client found:', client)

  const project = new Project({
    name,
    client: clientId,
    user: (session.user as SessionUser).id,
  })

  console.log('Project object before save:', JSON.stringify(project.toObject(), null, 2))

  try {
    const savedProject = await project.save()
    console.log('Project saved successfully:', JSON.stringify(savedProject.toObject(), null, 2))
    revalidatePath('/projects')
    redirect('/projects')
  } catch (error) {
    console.error('Error saving project:', error)
    throw error
  }
}

export async function getProjects() {
  try {
    await connectToDatabase()
    const projects = await Project.find().lean()
    return JSON.parse(JSON.stringify(projects))
  } catch (error) {
    console.error('Failed to fetch projects:', error)
    throw new Error('Failed to fetch projects')
  }
}

export async function createClient(name: string) {
  await connectToDatabase()
  const session = await getServerSession(authOptions)
  
  if (!session?.user || !(session.user as SessionUser).id) {
    throw new Error('User not authenticated')
  }

  const client = new Client({
    name,
    user: (session.user as SessionUser).id,
  })

  await client.save()
  console.log('Created client:', JSON.stringify(client.toObject(), null, 2))
  
  // Return only serializable data
  return {
    id: client._id.toString(),
    name: client.name
  }
}

export async function getClients() {
  await connectToDatabase()
  const session = await getServerSession(authOptions)
  
  if (!session?.user || !(session.user as SessionUser).id) {
    throw new Error('User not authenticated')
  }

  console.log('Fetching clients for user:', (session.user as SessionUser).id)
  const clients = await Client.find({ user: (session.user as SessionUser).id }).sort({ name: 1 }).lean()
  console.log('Fetched clients:', JSON.stringify(clients, null, 2))
  
  return clients.map(client => ({
    id: client._id.toString(),
    name: client.name
  }))
}

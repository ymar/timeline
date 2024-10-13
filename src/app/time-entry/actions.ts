'use server'

import mongoose from 'mongoose'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { TimeEntry } from '@/models/TimeEntry'
import { connectToDatabase } from '@/app/lib/db'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-config"
import Project from '@/models/Project'

const schema = z.object({
  project: z.string().min(1, { message: "Project is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  date: z.string().min(1, { message: "Date is required" }),
  duration: z.string().min(1, { message: "Duration is required" }),
})

export async function getProjects(): Promise<{ id: string; name: string }[]> {
  await connectToDatabase()
  const projects = await Project.find().sort({ name: 1 }).lean()
  return projects.map(project => ({ id: project._id.toString(), name: project.name }))
}

export async function createTimeEntry(formData: FormData) {
  const validatedFields = schema.safeParse({
    project: formData.get('project'),
    description: formData.get('description'),
    date: formData.get('date'),
    duration: formData.get('duration'),
  })

  if (!validatedFields.success) {
    return { success: false, error: "Validation failed" }
  }

  const { project, description, date, duration } = validatedFields.data

  const projectId = project as string
  if (!projectId) {
    return { error: 'Project is required' }
  }

  try {
    await connectToDatabase()
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return { success: false, error: "User not authenticated" }
    }
    const newTimeEntry = new TimeEntry({
      user: session.user.id,
      project: new mongoose.Types.ObjectId(projectId),
      description,
      date: new Date(date),
      duration: parseInt(duration),
    })
    await newTimeEntry.save()
    revalidatePath('/dashboard')
    return { success: true }
  } catch (error) {
    console.error('Failed to create time entry:', error)
    return { success: false, error: "Failed to create time entry" }
  }
}

'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { Post } from '@/models/Post'
import { connectToDatabase } from '@/app/lib/db'

const schema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  content: z.string().min(1, { message: "Content is required" }),
})

export async function createPost(formData: FormData) {
  const validatedFields = schema.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
    content: formData.get('content'),
  })

  if (!validatedFields.success) {
    return { success: false, error: "Validation failed" }
  }

  const { title, description, content } = validatedFields.data

  try {
    await connectToDatabase()
    const newPost = new Post({ title, description, content })
    await newPost.save()
    revalidatePath('/post')
    return { success: true }
  } catch (error) {
    console.error('Failed to create post:', error)
    return { success: false, error: "Failed to create post" }
  }
}

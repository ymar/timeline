'use server'

import { dbConnect } from '@/app/lib/db'
import { Post } from '@/models/Post'

export async function getPosts() {
  await dbConnect()
  const posts = await Post.find().sort({ createdAt: -1 }).limit(10)
  return JSON.parse(JSON.stringify(posts))
}

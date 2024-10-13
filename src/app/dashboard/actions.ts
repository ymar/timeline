'use server'

import { connectToDatabase } from '@/app/lib/db'
import { TimeEntry } from '@/models/TimeEntry'

export async function getWeekTimeEntries(userId: string) {
  await connectToDatabase()
  
  const today = new Date()
  const currentDay = today.getDay()
  const diff = today.getDate() - currentDay + (currentDay === 0 ? -6 : 1) // Adjust when Sunday
  const startOfWeek = new Date(today.setDate(diff))
  startOfWeek.setHours(0, 0, 0, 0)
  
  const endOfWeek = new Date(startOfWeek)
  endOfWeek.setDate(startOfWeek.getDate() + 6)
  endOfWeek.setHours(23, 59, 59, 999)

  const entries = await TimeEntry.find({
    user: userId,
    date: {
      $gte: startOfWeek,
      $lte: endOfWeek
    }
  }).sort({ date: 1 })

  const weekEntries = Array.from({ length: 7 }, () => [])
  entries.forEach(entry => {
    const dayOfWeek = new Date(entry.date).getDay()
    const adjustedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1 // Adjust Sunday to be last
    weekEntries[adjustedDay].push(entry)
  })

  return {
    startOfWeek,
    endOfWeek,
    entries: weekEntries
  }
}

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { addTimeEntry } from '@/app/time-entry/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

interface Project {
  _id: string
  name: string
}

interface TimeEntryFormProps {
  projects: Project[]
  onSuccess?: () => void
}

export default function TimeEntryForm({ projects, onSuccess }: TimeEntryFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(event.currentTarget)
    const result = await addTimeEntry(formData)

    setIsSubmitting(false)

    if (result.success) {
      router.refresh()
      if (onSuccess) {
        onSuccess()
      }
      // Reset form
      event.currentTarget.reset()
    } else {
      // Handle error (e.g., show an error message)
      console.error(result.error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700">
          Date
        </label>
        <Input
          type="date"
          id="date"
          name="date"
          required
          className="mt-1"
        />
      </div>
      <div>
        <label htmlFor="project" className="block text-sm font-medium text-gray-700">
          Project
        </label>
        <Select id="project" name="project" required className="mt-1">
          <option value="">Select a project</option>
          {projects.map((project) => (
            <option key={project._id} value={project._id}>
              {project.name}
            </option>
          ))}
        </Select>
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <Textarea
          id="description"
          name="description"
          required
          className="mt-1"
        />
      </div>
      <div>
        <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
          Duration (minutes)
        </label>
        <Input
          type="number"
          id="duration"
          name="duration"
          required
          min="1"
          className="mt-1"
        />
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creating...' : 'Create Time Entry'}
      </Button>
    </form>
  )
}
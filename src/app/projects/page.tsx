import { getProjects } from './actions'
import ProjectList from "@/components/ProjectList"
import { Button } from "@/components/ui/button"
import Link from 'next/link'

export default async function ProjectsPage() {
  const projects = await getProjects()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Projects</h1>
        <Button asChild>
          <Link href="/projects/new">Add New Project</Link>
        </Button>
      </div>
      <ProjectList projects={projects} />
    </div>
  )
}

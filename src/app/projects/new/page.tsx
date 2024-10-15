'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createProject, getClients } from '../actions'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

interface Client {
  _id: string;
  name: string;
}

export default function NewProjectPage() {
  const [projectName, setProjectName] = useState('')
  const [clients, setClients] = useState<Client[]>([])
  const [selectedClientId, setSelectedClientId] = useState<string>('')
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    getClients().then(setClients).catch(console.error)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createProject(projectName, selectedClientId)
      toast({
        title: "Success",
        description: "Project created successfully",
      })
      router.push('/projects')
    } catch (error) {
      console.error('Error creating project:', error)
      toast({
        title: "Error",
        description: "Failed to create project",
        variant: "destructive",
      })
    }
  }

  const handleNewClient = () => {
    // Navigate to new client creation page
    router.push('/clients/new')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Create New Project</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="projectName" className="block text-sm font-medium text-gray-700">Project Name</label>
          <Input
            type="text"
            id="projectName"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="client" className="block text-sm font-medium text-gray-700">Client</label>
          <Select onValueChange={setSelectedClientId} value={selectedClientId}>
            <SelectTrigger>
              <SelectValue placeholder="Select a client" />
            </SelectTrigger>
            <SelectContent>
              {clients.map((client) => (
                <SelectItem key={client._id} value={client._id}>{client.name}</SelectItem>
              ))}
              <SelectItem value="new">
                <span className="text-blue-500 cursor-pointer" onClick={handleNewClient}>
                  + Create New Client
                </span>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" disabled={!selectedClientId || selectedClientId === 'new'}>Create Project</Button>
      </form>
    </div>
  )
}

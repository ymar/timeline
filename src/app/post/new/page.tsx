'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createPost } from './actions'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

export default function NewPostPage() {
	const [title, setTitle] = useState('')
	const [description, setDescription] = useState('')
	const [content, setContent] = useState('')
	const router = useRouter()

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		const formData = new FormData()
		formData.append('title', title)
		formData.append('description', description)
		formData.append('content', content)
		const result = await createPost(formData)
		if (result.success) {
			router.push('/post')
			router.refresh()
		} else {
			// Handle error
			console.error(result.error)
		}
	}

	return (
		<div className="max-w-2xl mx-auto">
			<Card>
				<CardHeader>
					<CardTitle>Create New Post</CardTitle>
				</CardHeader>
				<form onSubmit={handleSubmit}>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="title">Title</Label>
							<Input
								id="title"
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								required
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="description">Description</Label>
							<Input
								id="description"
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								required
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="content">Content</Label>
							<Textarea
								id="content"
								value={content}
								onChange={(e) => setContent(e.target.value)}
								required
							/>
						</div>
					</CardContent>
					<CardFooter>
						<Button type="submit">Create Post</Button>
					</CardFooter>
				</form>
			</Card>
		</div>
	)
}

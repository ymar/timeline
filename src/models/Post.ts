import mongoose from 'mongoose'

const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    description: { type: String, required: true },
}, { timestamps: true });

export const Post = mongoose.models.Post || mongoose.model('Post', postSchema, 'your_custom_posts_collection');

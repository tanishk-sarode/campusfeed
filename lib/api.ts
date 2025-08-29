import axios from 'axios'
import { Post, PostType } from '@/types/post'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000/api'

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
})

export async function fetchPosts(): Promise<Post[]> {
  const { data } = await api.get('/posts')
  return data as Post[]
}

export async function createPost(payload: any): Promise<Post> {
  const { data } = await api.post('/posts', payload)
  return data as Post
}

export async function deletePostApi(postId: string | number): Promise<void> {
  await api.delete(`/posts/${postId}`)
}

export async function addComment(postId: string | number, payload: { content: string; authorSession?: string; parentCommentId?: string | number }) {
  const { data } = await api.post(`/posts/${postId}/comments`, payload)
  return data
}

export async function deleteComment(commentId: string | number) {
  await api.delete(`/comments/${commentId}`)
}

export async function toggleReaction(payload: { targetType: 'post' | 'comment'; targetId: number | string; reactionType: string; userSession?: string }) {
  const { data } = await api.post('/reactions', payload)
  return data as { toggled: boolean }
}

export async function rsvp(postId: number | string, payload: { userSession: string; responseType?: 'going' | 'interested' | 'not_going' }) {
  const { data } = await api.post(`/events/${postId}/rsvp`, payload)
  return data as Record<string, number>
}

export async function classifyViaApi(text: string) {
  const { data } = await api.post('/classify-post', { text })
  return data
}

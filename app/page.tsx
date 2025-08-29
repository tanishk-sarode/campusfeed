'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import SmartPostCreator from '@/components/SmartPostCreator'
import Feed from '@/components/Feed'
import { Post, PostType } from '@/types/post'
import { generateUserId } from '@/utils/user'
import { samplePosts } from '@/data/sampleData'

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>(samplePosts)
  const [currentFilter, setCurrentFilter] = useState<PostType | 'all'>('all')
  const [userId] = useState(() => generateUserId())

  const filteredPosts = currentFilter === 'all' 
    ? posts 
    : posts.filter(post => post.type === currentFilter)

  const addPost = (newPost: Post) => {
    setPosts(prev => [newPost, ...prev])
  }

  const updatePost = (postId: string, updates: Partial<Post>) => {
    setPosts(prev => prev.map(post => 
      post.id === postId ? { ...post, ...updates } as Post : post
    ))
  }

  const deletePost = (postId: string) => {
    setPosts(prev => prev.filter(post => post.id !== postId))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        totalPosts={posts.length}
        currentFilter={currentFilter}
        onFilterChange={setCurrentFilter}
      />
      
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="space-y-6">
          <SmartPostCreator 
            onPostCreated={addPost}
            userId={userId}
          />
          
          <Feed 
            posts={filteredPosts}
            currentUserId={userId}
            onPostUpdate={updatePost}
            onPostDelete={deletePost}
          />
        </div>
      </main>
    </div>
  )
}

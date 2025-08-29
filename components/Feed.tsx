'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Post } from '@/types/post'
import PostCard from './PostCard'

interface FeedProps {
  posts: Post[]
  currentUserId: string
  onPostUpdate: (postId: string, updates: Partial<Post>) => void
  onPostDelete: (postId: string) => void
}

export default function Feed({ posts, currentUserId, onPostUpdate, onPostDelete }: FeedProps) {
  if (posts.length === 0) {
    return (
      <motion.div
        className="text-center py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">📝</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts yet</h3>
        <p className="text-gray-600">Be the first to share something with the campus community!</p>
      </motion.div>
    )
  }

  return (
    <div className="space-y-6">
      <motion.div
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-xl font-semibold text-gray-900">Campus Feed</h2>
        <span className="text-sm text-gray-600">{posts.length} posts</span>
      </motion.div>

      <AnimatePresence>
        {posts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ 
              duration: 0.3, 
              delay: index * 0.1,
              type: "spring",
              stiffness: 100
            }}
          >
            <PostCard
              post={post}
              currentUserId={currentUserId}
              onUpdate={onPostUpdate}
              onDelete={onPostDelete}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

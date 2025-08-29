'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Calendar, 
  MapPin, 
  Building, 
  Package, 
  MessageSquare, 
  Heart, 
  ThumbsUp, 
  Flame,
  Frown,
  Smile,
  MoreHorizontal,
  Trash2,
  Edit3,
  Clock,
  Users
} from 'lucide-react'
import { Post, ReactionType, EventResponse } from '@/types/post'
import { formatDistanceToNow } from 'date-fns'
import { hasUserReacted, saveUserReaction, getUserEventResponse, saveUserEventResponse } from '@/utils/user'
import toast from 'react-hot-toast'
import CommentSection from './CommentSection'
import { AnimatePresence } from 'framer-motion'

interface PostCardProps {
  post: Post
  currentUserId: string
  onUpdate: (postId: string, updates: Partial<Post>) => void
  onDelete: (postId: string) => void
}

export default function PostCard({ post, currentUserId, onUpdate, onDelete }: PostCardProps) {
  const [showComments, setShowComments] = useState(false)
  const [showOptions, setShowOptions] = useState(false)

  const handleReaction = (reactionType: ReactionType) => {
    const hasReacted = hasUserReacted(post.id, reactionType)
    const newReactions = { ...post.reactions }
    
    if (hasReacted) {
      newReactions[reactionType] = Math.max(0, newReactions[reactionType] - 1)
    } else {
      newReactions[reactionType] = (newReactions[reactionType] || 0) + 1
    }
    
    saveUserReaction(post.id, reactionType, !hasReacted)
    onUpdate(post.id, { reactions: newReactions })
  }

  const handleEventResponse = (response: EventResponse) => {
    if (post.type !== 'event') return
    
    const currentResponse = getUserEventResponse(post.id)
    const newResponses = { ...post.responses }
    
    // Remove previous response if exists
    if (currentResponse && currentResponse !== response) {
      newResponses[currentResponse as EventResponse] = Math.max(0, newResponses[currentResponse as EventResponse] - 1)
    }
    
    // Add new response if different from current
    if (currentResponse !== response) {
      newResponses[response] = (newResponses[response] || 0) + 1
      saveUserEventResponse(post.id, response)
    } else {
      // Remove response if clicking same button
      newResponses[response] = Math.max(0, newResponses[response] - 1)
      localStorage.removeItem(`event_response_${post.id}`)
    }
    
    onUpdate(post.id, { responses: newResponses })
  }

  const getTypeIcon = () => {
    switch (post.type) {
      case 'event':
        return <Calendar className="w-5 h-5 text-blue-600" />
      case 'lost_found':
        return <Package className="w-5 h-5 text-orange-600" />
      case 'announcement':
        return <Building className="w-5 h-5 text-purple-600" />
      default:
        return <Calendar className="w-5 h-5 text-gray-600" />
    }
  }

  const getTypeColor = () => {
    switch (post.type) {
      case 'event':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'lost_found':
        return 'bg-orange-50 text-orange-700 border-orange-200'
      case 'announcement':
        return 'bg-purple-50 text-purple-700 border-purple-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const getTypeLabel = () => {
    switch (post.type) {
      case 'event':
        return 'Event'
      case 'lost_found':
        return post.itemType === 'found' ? 'Found' : 'Lost'
      case 'announcement':
        return 'Announcement'
      default:
        return 'Post'
    }
  }

  const totalReactions = Object.values(post.reactions || {}).reduce((sum, count) => sum + count, 0)
  const totalComments = (post.comments || []).reduce((sum, comment) => sum + 1 + (comment.replies ? comment.replies.length : 0), 0)

  return (
    <motion.div
      className="card overflow-hidden"
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      {/* Post Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className={`p-2 rounded-lg ${getTypeColor()}`}>
              {getTypeIcon()}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-sm font-medium text-gray-900">{post.authorName}</span>
                <span className="text-xs text-gray-500">•</span>
                <span className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(post.timestamp), { addSuffix: true })}
                </span>
                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                  {getTypeLabel()}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{post.title}</h3>
              <p className="text-gray-700 leading-relaxed">{post.description}</p>
            </div>
          </div>

          {/* Options Menu */}
          <div className="relative">
            <button
              onClick={() => setShowOptions(!showOptions)}
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
            
            {showOptions && (
              <motion.div
                className="absolute right-0 top-full mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <button
                  onClick={() => {
                    setShowOptions(false)
                    // Edit functionality would go here
                    toast('Edit feature coming soon!')
                  }}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit</span>
                </button>
                {post.authorId === currentUserId && (
                  <button
                    onClick={() => {
                      setShowOptions(false)
                      onDelete(post.id)
                      toast.success('Post deleted')
                    }}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                )}
              </motion.div>
            )}
          </div>
        </div>

        {/* Type-specific content */}
        {post.type === 'event' && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{post.location}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{post.date} at {post.time}</span>
            </div>
            {post.department && (
              <div className="flex items-center space-x-2 text-gray-600">
                <Building className="w-4 h-4" />
                <span className="text-sm">{post.department}</span>
              </div>
            )}
          </div>
        )}

        {post.type === 'lost_found' && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2 text-gray-600">
              <Package className="w-4 h-4" />
              <span className="text-sm">{post.itemName}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{post.location}</span>
            </div>
          </div>
        )}

        {post.type === 'announcement' && (
          <div className="mt-4">
            <div className="flex items-center space-x-2 text-gray-600">
              <Building className="w-4 h-4" />
              <span className="text-sm">{post.department}</span>
            </div>
          </div>
        )}

        {/* Event Responses */}
        {post.type === 'event' && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">RSVP</span>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500">
                  <Users className="w-3 h-3 inline mr-1" />
                  {(() => {
                    const responses = post.responses || { going: 0, interested: 0, not_going: 0 }
                    return responses.going + responses.interested + responses.not_going
                  })()} responses
                </span>
              </div>
            </div>
            <div className="flex space-x-2 mt-2">
              {(['going', 'interested', 'not_going'] as EventResponse[]).map((response) => {
                const responses = post.responses || { going: 0, interested: 0, not_going: 0 }
                const count = responses[response]
                const isSelected = getUserEventResponse(post.id) === response
                const colors = {
                  going: 'bg-green-100 text-green-700 hover:bg-green-200',
                  interested: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200',
                  not_going: 'bg-red-100 text-red-700 hover:bg-red-200'
                }
                return (
                  <button
                    key={response}
                    onClick={() => handleEventResponse(response)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      isSelected ? colors[response] : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {response === 'going' ? 'Going' : response === 'interested' ? 'Interested' : 'Not Going'} ({count})
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Post Actions */}
      <div className="px-6 py-3 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Reactions */}
            <div className="flex items-center space-x-1">
              {(['👍', '❤️', '🔥', '😮', '🤔', '😢'] as ReactionType[]).map((reaction) => {
                const reactions = post.reactions || {}
                const count = reactions[reaction] || 0
                const isReacted = hasUserReacted(post.id, reaction)
                return (
                  <button
                    key={reaction}
                    onClick={() => handleReaction(reaction)}
                    className={`p-1 rounded-full transition-colors ${
                      isReacted ? 'bg-primary-100' : 'hover:bg-gray-200'
                    }`}
                  >
                    <span className="text-sm">{reaction}</span>
                    {count > 0 && (
                      <span className="ml-1 text-xs text-gray-600">{count}</span>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Comments */}
            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center space-x-1 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span className="text-sm">{totalComments}</span>
            </button>
          </div>

          {/* Total Reactions */}
          {totalReactions > 0 && (
            <div className="text-xs text-gray-500">
              {totalReactions} reactions
            </div>
          )}
        </div>
      </div>

      {/* Comments Section */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CommentSection
              post={post}
              currentUserId={currentUserId}
              onUpdate={onUpdate}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

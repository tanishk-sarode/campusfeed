'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Reply, MoreHorizontal, Trash2 } from 'lucide-react'
import { Post, Comment, ReactionType } from '@/types/post'
import { formatDistanceToNow } from 'date-fns'
import { getUserName } from '@/utils/user'
import { hasUserReacted, saveUserReaction } from '@/utils/user'
import toast from 'react-hot-toast'

interface CommentSectionProps {
  post: Post
  currentUserId: string
  onUpdate: (postId: string, updates: Partial<Post>) => void
}

export default function CommentSection({ post, currentUserId, onUpdate }: CommentSectionProps) {
  const [newComment, setNewComment] = useState('')
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAddComment = async () => {
    if (!newComment.trim()) return

    setIsSubmitting(true)
    try {
      const comment: Comment = {
        id: `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        content: newComment.trim(),
        authorId: currentUserId,
        authorName: getUserName(),
        timestamp: new Date().toISOString(),
        reactions: { '👍': 0, '❤️': 0, '🔥': 0, '😮': 0, '🤔': 0, '😢': 0 },
        replies: []
      }

      const updatedComments = [...post.comments, comment]
      onUpdate(post.id, { comments: updatedComments })
      setNewComment('')
      toast.success('Comment added!')
    } catch (error) {
      console.error('Failed to add comment:', error)
      toast.error('Failed to add comment')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddReply = async (parentCommentId: string) => {
    if (!replyText.trim()) return

    setIsSubmitting(true)
    try {
      const reply: Comment = {
        id: `reply_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        content: replyText.trim(),
        authorId: currentUserId,
        authorName: getUserName(),
        timestamp: new Date().toISOString(),
        reactions: { '👍': 0, '❤️': 0, '🔥': 0, '😮': 0, '🤔': 0, '😢': 0 },
        replies: [],
        parentId: parentCommentId
      }

      const updatedComments = post.comments.map(comment => {
        if (comment.id === parentCommentId) {
          return { ...comment, replies: [...comment.replies, reply] }
        }
        return comment
      })

      onUpdate(post.id, { comments: updatedComments })
      setReplyText('')
      setReplyingTo(null)
      toast.success('Reply added!')
    } catch (error) {
      console.error('Failed to add reply:', error)
      toast.error('Failed to add reply')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReaction = (targetId: string, reactionType: ReactionType, isReply = false) => {
    const hasReacted = hasUserReacted(targetId, reactionType)
    const newReactions = { ...post.reactions }
    
    if (isReply) {
      // Handle reply reactions
      const updatedComments = post.comments.map(comment => {
        if (comment.id === targetId) {
          const newCommentReactions = { ...comment.reactions }
          if (hasReacted) {
            newCommentReactions[reactionType] = Math.max(0, newCommentReactions[reactionType] - 1)
          } else {
            newCommentReactions[reactionType] = (newCommentReactions[reactionType] || 0) + 1
          }
          return { ...comment, reactions: newCommentReactions }
        }
        
        // Check replies
        const updatedReplies = comment.replies.map(reply => {
          if (reply.id === targetId) {
            const newReplyReactions = { ...reply.reactions }
            if (hasReacted) {
              newReplyReactions[reactionType] = Math.max(0, newReplyReactions[reactionType] - 1)
            } else {
              newReplyReactions[reactionType] = (newReplyReactions[reactionType] || 0) + 1
            }
            return { ...reply, reactions: newReplyReactions }
          }
          return reply
        })
        
        return { ...comment, replies: updatedReplies }
      })
      
      saveUserReaction(targetId, reactionType, !hasReacted)
      onUpdate(post.id, { comments: updatedComments })
    } else {
      // Handle comment reactions
      const updatedComments = post.comments.map(comment => {
        if (comment.id === targetId) {
          const newCommentReactions = { ...comment.reactions }
          if (hasReacted) {
            newCommentReactions[reactionType] = Math.max(0, newCommentReactions[reactionType] - 1)
          } else {
            newCommentReactions[reactionType] = (newCommentReactions[reactionType] || 0) + 1
          }
          return { ...comment, reactions: newCommentReactions }
        }
        return comment
      })
      
      saveUserReaction(targetId, reactionType, !hasReacted)
      onUpdate(post.id, { comments: updatedComments })
    }
  }

  const deleteComment = (commentId: string, isReply = false) => {
    if (isReply) {
      const updatedComments = post.comments.map(comment => ({
        ...comment,
        replies: comment.replies.filter(reply => reply.id !== commentId)
      }))
      onUpdate(post.id, { comments: updatedComments })
    } else {
      const updatedComments = post.comments.filter(comment => comment.id !== commentId)
      onUpdate(post.id, { comments: updatedComments })
    }
    toast.success('Comment deleted')
  }

  const CommentItem = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => {
    const [showOptions, setShowOptions] = useState(false)
    const totalReactions = Object.values(comment.reactions).reduce((sum, count) => sum + count, 0)

    return (
      <motion.div
        className={`${isReply ? 'ml-8 border-l-2 border-gray-200 pl-4' : ''} py-3`}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold">
              {comment.authorName.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-sm font-medium text-gray-900">{comment.authorName}</span>
              <span className="text-xs text-gray-500">•</span>
              <span className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(comment.timestamp), { addSuffix: true })}
              </span>
            </div>
            
            <p className="text-gray-700 text-sm mb-2">{comment.content}</p>
            
            {/* Reactions */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                {(['👍', '❤️', '🔥', '😮', '🤔', '😢'] as ReactionType[]).map((reaction) => {
                  const count = comment.reactions[reaction] || 0
                  const isReacted = hasUserReacted(comment.id, reaction)
                  
                  return (
                    <button
                      key={reaction}
                      onClick={() => handleReaction(comment.id, reaction, isReply)}
                      className={`p-1 rounded-full transition-colors ${
                        isReacted ? 'bg-primary-100' : 'hover:bg-gray-200'
                      }`}
                    >
                      <span className="text-xs">{reaction}</span>
                      {count > 0 && (
                        <span className="ml-1 text-xs text-gray-600">{count}</span>
                      )}
                    </button>
                  )
                })}
              </div>
              
              {!isReply && (
                <button
                  onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                  className="flex items-center space-x-1 text-xs text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <Reply className="w-3 h-3" />
                  <span>Reply</span>
                </button>
              )}
              
              {comment.authorId === currentUserId && (
                <div className="relative">
                  <button
                    onClick={() => setShowOptions(!showOptions)}
                    className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <MoreHorizontal className="w-3 h-3" />
                  </button>
                  
                  {showOptions && (
                    <motion.div
                      className="absolute right-0 top-full mt-1 w-24 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <button
                        onClick={() => {
                          setShowOptions(false)
                          deleteComment(comment.id, isReply)
                        }}
                        className="w-full flex items-center space-x-2 px-3 py-1 text-left text-xs text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete</span>
                      </button>
                    </motion.div>
                  )}
                </div>
              )}
            </div>
            
            {/* Reply Input */}
            {!isReply && replyingTo === comment.id && (
              <motion.div
                className="mt-3"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write a reply..."
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddReply(comment.id)}
                  />
                  <button
                    onClick={() => handleAddReply(comment.id)}
                    disabled={isSubmitting || !replyText.trim()}
                    className="px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
        
        {/* Nested Replies */}
        {!isReply && comment.replies.length > 0 && (
          <div className="mt-3 space-y-2">
            {comment.replies.map((reply) => (
              <CommentItem key={reply.id} comment={reply} isReply={true} />
            ))}
          </div>
        )}
      </motion.div>
    )
  }

  return (
    <div className="border-t border-gray-200">
      {/* Comment Input */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold">
              {getUserName().split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div className="flex-1">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
            />
          </div>
          <button
            onClick={handleAddComment}
            disabled={isSubmitting || !newComment.trim()}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Comments List */}
      <div className="p-4">
        {post.comments.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-gray-500 text-sm">No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {post.comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

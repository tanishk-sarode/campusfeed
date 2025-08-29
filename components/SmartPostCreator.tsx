'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Paperclip, X, Edit3, Calendar, MapPin, Building, Package } from 'lucide-react'
import { Post, PostPreview, EventPost, LostFoundPost, AnnouncementPost } from '@/types/post'
import { classifyPost, enhancePostContent } from '@/utils/ai'
import { getUserName } from '@/utils/user'
import toast from 'react-hot-toast'
import PostPreviewCard from './PostPreviewCard'

interface SmartPostCreatorProps {
  onPostCreated: (post: Post) => void
  userId: string
}

export default function SmartPostCreator({ onPostCreated, userId }: SmartPostCreatorProps) {
  const [inputText, setInputText] = useState('')
  const [isClassifying, setIsClassifying] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [preview, setPreview] = useState<PostPreview | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [inputText])

  // Handle input changes with debounced classification
  useEffect(() => {
    if (!inputText.trim()) {
      setShowPreview(false)
      setPreview(null)
      return
    }

    const timeoutId = setTimeout(async () => {
      if (inputText.trim().length > 10) {
        await classifyInput()
      }
    }, 1000)

    return () => clearTimeout(timeoutId)
  }, [inputText])

  const classifyInput = async () => {
    if (!inputText.trim()) return

    setIsClassifying(true)
    try {
      const result = await classifyPost(inputText)
      const enhancedPreview = await enhancePostContent(result.extractedData as PostPreview)
      
      setPreview(enhancedPreview)
      setShowPreview(true)
    } catch (error) {
      console.error('Classification failed:', error)
      toast.error('Failed to classify post. Please try again.')
    } finally {
      setIsClassifying(false)
    }
  }

  const handlePreviewUpdate = (updates: Partial<PostPreview>) => {
    if (preview) {
      setPreview({ ...preview, ...updates })
    }
  }

  const handleCreatePost = async () => {
    if (!preview) return

    setIsCreating(true)
    try {
      const basePost = {
        id: `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: preview.title,
        description: preview.description,
        authorId: userId,
        authorName: getUserName(),
        timestamp: new Date().toISOString(),
        reactions: { '👍': 0, '❤️': 0, '🔥': 0, '😮': 0, '🤔': 0, '😢': 0 },
        comments: [],
        imageUrl: preview.imageUrl,
      }

      let newPost: Post

      if (preview.type === 'event') {
        newPost = {
          ...basePost,
          type: 'event',
          location: preview.location || 'NIT Rourkela Campus',
          date: preview.date || new Date().toISOString().split('T')[0],
          time: preview.time || '17:00',
          department: preview.department || 'General',
          responses: { going: 0, interested: 0, not_going: 0 }
        } as EventPost
      } else if (preview.type === 'lost_found') {
        newPost = {
          ...basePost,
          type: 'lost_found',
          itemType: preview.itemType || 'lost',
          location: preview.location || 'NIT Rourkela Campus',
          itemName: preview.itemName || 'Item'
        } as LostFoundPost
      } else {
        newPost = {
          ...basePost,
          type: 'announcement',
          department: preview.department || 'General',
          attachmentUrl: preview.attachmentUrl
        } as AnnouncementPost
      }

      onPostCreated(newPost)
      toast.success('Post created successfully!')
      
      // Reset form
      setInputText('')
      setShowPreview(false)
      setPreview(null)
    } catch (error) {
      console.error('Failed to create post:', error)
      toast.error('Failed to create post. Please try again.')
    } finally {
      setIsCreating(false)
    }
  }

  const handleAttachFile = () => {
    // File attachment functionality would go here
    toast('File attachment feature coming soon!')
  }

  return (
    <div className="space-y-4">
      {/* Smart Input Section */}
      <motion.div
        className="card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">AI</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">What's happening on campus?</h3>
          </div>
          
          <p className="text-sm text-gray-600">
            Type naturally and let AI understand your intent. Examples: "Lost my wallet near library" or "Workshop tomorrow at 5 PM"
          </p>

          <div className="relative">
            <textarea
              ref={textareaRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Share what's on your mind..."
              className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent min-h-[120px]"
              disabled={isCreating}
            />
            
            <div className="absolute bottom-3 right-3 flex items-center space-x-2">
              <button
                onClick={handleAttachFile}
                className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                disabled={isCreating}
              >
                <Paperclip className="w-4 h-4" />
              </button>
              
              {isClassifying && (
                <div className="flex items-center space-x-2 text-primary-600">
                  <div className="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-xs">Analyzing...</span>
                </div>
              )}
            </div>
          </div>

          {/* Classification Indicator */}
          {isClassifying && (
            <motion.div
              className="flex items-center space-x-2 text-sm text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
              <span>AI is analyzing your post...</span>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Post Preview */}
      <AnimatePresence>
        {showPreview && preview && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <PostPreviewCard
              preview={preview}
              onUpdate={handlePreviewUpdate}
              onCreate={handleCreatePost}
              onCancel={() => {
                setShowPreview(false)
                setPreview(null)
              }}
              isCreating={isCreating}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Edit3, X, Calendar, MapPin, Building, Package, Check, AlertCircle } from 'lucide-react'
import { PostPreview } from '@/types/post'

interface PostPreviewCardProps {
  preview: PostPreview
  onUpdate: (updates: Partial<PostPreview>) => void
  onCreate: () => void
  onCancel: () => void
  isCreating: boolean
}

export default function PostPreviewCard({ 
  preview, 
  onUpdate, 
  onCreate, 
  onCancel, 
  isCreating 
}: PostPreviewCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState<PostPreview>(preview)

  const handleSave = () => {
    onUpdate(editData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditData(preview)
    setIsEditing(false)
  }

  const getTypeIcon = () => {
    switch (preview.type) {
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

  const getTypeLabel = () => {
    switch (preview.type) {
      case 'event':
        return 'Event Post'
      case 'lost_found':
        return `${preview.itemType === 'found' ? 'Found' : 'Lost'} & Found Post`
      case 'announcement':
        return 'Announcement Post'
      default:
        return 'Post'
    }
  }

  const getTypeColor = () => {
    switch (preview.type) {
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

  return (
    <motion.div
      className="card p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${getTypeColor()}`}>
              {getTypeIcon()}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{getTypeLabel()}</h3>
              <p className="text-sm text-gray-600">AI Preview - Review and edit</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
              disabled={isCreating}
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={onCancel}
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
              disabled={isCreating}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            {isEditing ? (
              <input
                type="text"
                value={editData.title}
                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                className="input"
                placeholder="Enter title..."
              />
            ) : (
              <p className="text-lg font-semibold text-gray-900">{preview.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            {isEditing ? (
              <textarea
                value={editData.description}
                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                className="textarea"
                rows={3}
                placeholder="Enter description..."
              />
            ) : (
              <p className="text-gray-700">{preview.description}</p>
            )}
          </div>

          {/* Type-specific fields */}
          {preview.type === 'event' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.location || ''}
                    onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                    className="input"
                    placeholder="Enter location..."
                  />
                ) : (
                  <div className="flex items-center space-x-2 text-gray-700">
                    <MapPin className="w-4 h-4" />
                    <span>{preview.location}</span>
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
                {isEditing ? (
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      value={editData.date || ''}
                      onChange={(e) => setEditData({ ...editData, date: e.target.value })}
                      className="input"
                    />
                    <input
                      type="time"
                      value={editData.time || ''}
                      onChange={(e) => setEditData({ ...editData, time: e.target.value })}
                      className="input"
                    />
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 text-gray-700">
                    <Calendar className="w-4 h-4" />
                    <span>{preview.date} at {preview.time}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {preview.type === 'lost_found' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Item</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.itemName || ''}
                    onChange={(e) => setEditData({ ...editData, itemName: e.target.value })}
                    className="input"
                    placeholder="Enter item name..."
                  />
                ) : (
                  <div className="flex items-center space-x-2 text-gray-700">
                    <Package className="w-4 h-4" />
                    <span>{preview.itemName}</span>
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.location || ''}
                    onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                    className="input"
                    placeholder="Enter location..."
                  />
                ) : (
                  <div className="flex items-center space-x-2 text-gray-700">
                    <MapPin className="w-4 h-4" />
                    <span>{preview.location}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {preview.type === 'announcement' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.department || ''}
                  onChange={(e) => setEditData({ ...editData, department: e.target.value })}
                  className="input"
                  placeholder="Enter department..."
                />
              ) : (
                <div className="flex items-center space-x-2 text-gray-700">
                  <Building className="w-4 h-4" />
                  <span>{preview.department}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <AlertCircle className="w-4 h-4" />
            <span>Review the details above before posting</span>
          </div>
          
          <div className="flex items-center space-x-3">
            {isEditing && (
              <>
                <button
                  onClick={handleCancel}
                  className="btn btn-outline"
                  disabled={isCreating}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="btn btn-primary"
                  disabled={isCreating}
                >
                  <Check className="w-4 h-4 mr-2" />
                  Save Changes
                </button>
              </>
            )}
            
            {!isEditing && (
              <button
                onClick={onCreate}
                className="btn btn-primary"
                disabled={isCreating}
              >
                {isCreating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Create Post
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

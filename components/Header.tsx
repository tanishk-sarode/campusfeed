'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Users, MessageSquare, Filter } from 'lucide-react'
import { PostType } from '@/types/post'

interface HeaderProps {
  totalPosts: number
  currentFilter: PostType | 'all'
  onFilterChange: (filter: PostType | 'all') => void
}

const filterOptions = [
  { value: 'all', label: 'All Posts', icon: MessageSquare },
  { value: 'event', label: 'Events', icon: Calendar },
  { value: 'lost_found', label: 'Lost & Found', icon: Users },
  { value: 'announcement', label: 'Announcements', icon: MessageSquare },
]

export default function Header({ totalPosts, currentFilter, onFilterChange }: HeaderProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <motion.div 
            className="flex items-center space-x-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">🎓</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">NIT Rourkela</h1>
              <p className="text-sm text-gray-600">Campus Feed</p>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div 
            className="hidden md:flex items-center space-x-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex items-center space-x-2 text-gray-600">
              <MessageSquare className="w-4 h-4" />
              <span className="text-sm font-medium">{totalPosts} Posts</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <Users className="w-4 h-4" />
              <span className="text-sm font-medium">1,247 Active</span>
            </div>
          </motion.div>

          {/* Filter Controls */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <Filter className="w-4 h-4" />
              <span className="text-sm font-medium">Filter</span>
            </button>

            {/* Filter Dropdown */}
            {isFilterOpen && (
              <motion.div
                className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {filterOptions.map((option) => {
                  const Icon = option.icon
                  return (
                    <button
                      key={option.value}
                      onClick={() => {
                        onFilterChange(option.value as PostType | 'all')
                        setIsFilterOpen(false)
                      }}
                      className={`w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-50 transition-colors ${
                        currentFilter === option.value ? 'bg-primary-50 text-primary-700' : 'text-gray-700'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{option.label}</span>
                    </button>
                  )
                })}
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Mobile Filter Pills */}
        <motion.div 
          className="md:hidden mt-4 flex space-x-2 overflow-x-auto pb-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onFilterChange(option.value as PostType | 'all')}
              className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                currentFilter === option.value
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {option.label}
            </button>
          ))}
        </motion.div>
      </div>
    </header>
  )
}

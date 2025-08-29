import { AIClassificationResult, PostType, PostPreview } from '@/types/post'

// Mock AI classification for demo purposes
// In production, this would call OpenAI API
export async function classifyPost(text: string): Promise<AIClassificationResult> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  const lowerText = text.toLowerCase()
  
  // Simple keyword-based classification
  if (lowerText.includes('lost') || lowerText.includes('found') || 
      lowerText.includes('wallet') || lowerText.includes('phone') || 
      lowerText.includes('keys') || lowerText.includes('book')) {
    return {
      type: 'lost_found',
      confidence: 0.95,
      extractedData: {
        type: 'lost_found',
        title: extractTitle(text),
        description: text,
        itemType: lowerText.includes('found') ? 'found' : 'lost',
        itemName: extractItemName(text),
        location: extractLocation(text)
      }
    }
  }
  
  if (lowerText.includes('workshop') || lowerText.includes('event') || 
      lowerText.includes('meeting') || lowerText.includes('seminar') ||
      lowerText.includes('tomorrow') || lowerText.includes('today') ||
      lowerText.includes('pm') || lowerText.includes('am')) {
    return {
      type: 'event',
      confidence: 0.92,
      extractedData: {
        type: 'event',
        title: extractTitle(text),
        description: text,
        location: extractLocation(text),
        date: extractDate(text),
        time: extractTime(text),
        department: extractDepartment(text)
      }
    }
  }
  
  if (lowerText.includes('announcement') || lowerText.includes('notice') || 
      lowerText.includes('department') || lowerText.includes('official') ||
      lowerText.includes('timetable') || lowerText.includes('schedule')) {
    return {
      type: 'announcement',
      confidence: 0.88,
      extractedData: {
        type: 'announcement',
        title: extractTitle(text),
        description: text,
        department: extractDepartment(text)
      }
    }
  }
  
  // Default to event if unclear
  return {
    type: 'event',
    confidence: 0.6,
    extractedData: {
      type: 'event',
      title: extractTitle(text),
      description: text
    }
  }
}

// Helper functions for data extraction
function extractTitle(text: string): string {
  const sentences = text.split(/[.!?]/)
  return sentences[0].trim() || 'New Post'
}

function extractLocation(text: string): string {
  const locationKeywords = ['at', 'in', 'near', 'location', 'place']
  const words = text.split(' ')
  
  for (let i = 0; i < words.length - 1; i++) {
    if (locationKeywords.includes(words[i].toLowerCase())) {
      return words.slice(i + 1).join(' ').split(/[.!?]/)[0].trim()
    }
  }
  
  return 'NIT Rourkela Campus'
}

function extractDate(text: string): string {
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  if (text.toLowerCase().includes('tomorrow')) {
    return tomorrow.toISOString().split('T')[0]
  }
  
  if (text.toLowerCase().includes('today')) {
    return today.toISOString().split('T')[0]
  }
  
  // Extract date patterns like "5th September" or "2025-09-05"
  const datePattern = /(\d{1,2})(?:st|nd|rd|th)?\s+(january|february|march|april|may|june|july|august|september|october|november|december)/i
  const match = text.match(datePattern)
  
  if (match) {
    const day = match[1]
    const month = match[2].toLowerCase()
    const monthMap: { [key: string]: number } = {
      january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
      july: 6, august: 7, september: 8, october: 9, november: 10, december: 11
    }
    
    const date = new Date(today.getFullYear(), monthMap[month], parseInt(day))
    return date.toISOString().split('T')[0]
  }
  
  return tomorrow.toISOString().split('T')[0]
}

function extractTime(text: string): string {
  const timePattern = /(\d{1,2}):?(\d{2})?\s*(am|pm)/i
  const match = text.match(timePattern)
  
  if (match) {
    let hour = parseInt(match[1])
    const minute = match[2] ? parseInt(match[2]) : 0
    const period = match[3].toLowerCase()
    
    if (period === 'pm' && hour !== 12) hour += 12
    if (period === 'am' && hour === 12) hour = 0
    
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
  }
  
  return '17:00'
}

function extractDepartment(text: string): string {
  const departments = [
    'Computer Science', 'CSE', 'Mechanical', 'Electrical', 'Civil',
    'Chemical', 'Metallurgy', 'Mining', 'Biotechnology', 'Physics',
    'Chemistry', 'Mathematics', 'Humanities', 'Management'
  ]
  
  for (const dept of departments) {
    if (text.toLowerCase().includes(dept.toLowerCase())) {
      return dept
    }
  }
  
  return 'General'
}

function extractItemName(text: string): string {
  const itemKeywords = ['wallet', 'phone', 'keys', 'book', 'laptop', 'bag', 'watch']
  
  for (const item of itemKeywords) {
    if (text.toLowerCase().includes(item)) {
      return item.charAt(0).toUpperCase() + item.slice(1)
    }
  }
  
  return 'Item'
}

// Generate enhanced post content using AI
export async function enhancePostContent(preview: PostPreview): Promise<PostPreview> {
  // In production, this would call OpenAI API to enhance the content
  await new Promise(resolve => setTimeout(resolve, 500))
  
  return {
    ...preview,
    title: preview.title || generateTitle(preview),
    description: preview.description || generateDescription(preview)
  }
}

function generateTitle(preview: PostPreview): string {
  switch (preview.type) {
    case 'event':
      return `${preview.title || 'New Event'} - ${preview.department || 'Campus Event'}`
    case 'lost_found':
      return `${preview.itemType === 'found' ? 'Found' : 'Lost'}: ${preview.itemName || 'Item'}`
    case 'announcement':
      return `${preview.department || 'General'} Announcement`
    default:
      return 'New Post'
  }
}

function generateDescription(preview: PostPreview): string {
  return preview.description || 'No description provided.'
}

export type PostType = 'event' | 'lost_found' | 'announcement'

export type ReactionType = '👍' | '❤️' | '😢' | '🤔' | '🔥' | '😮'

export type EventResponse = 'going' | 'interested' | 'not_going'

export interface Comment {
  id: string
  content: string
  authorId: string
  authorName: string
  timestamp: string
  reactions: PostReactions
  replies: Comment[]
  parentId?: string
}

export interface PostReactions {
  '👍': number
  '❤️': number
  '🔥': number
  '😮': number
  '🤔': number
  '😢': number
}

export interface EventResponses {
  going: number
  interested: number
  not_going: number
}

export interface BasePost {
  id: string
  type: PostType
  title: string
  description: string
  authorId: string
  authorName: string
  timestamp: string
  reactions: PostReactions
  comments: Comment[]
  imageUrl?: string
}

export interface EventPost extends BasePost {
  type: 'event'
  location: string
  date: string
  time: string
  department?: string
  responses: EventResponses
}

export interface LostFoundPost extends BasePost {
  type: 'lost_found'
  itemType: 'lost' | 'found'
  location: string
  itemName: string
}

export interface AnnouncementPost extends BasePost {
  type: 'announcement'
  department: string
  attachmentUrl?: string
}

export type Post = EventPost | LostFoundPost | AnnouncementPost

export interface PostPreview {
  type: PostType
  title: string
  description: string
  location?: string
  date?: string
  time?: string
  department?: string
  itemType?: 'lost' | 'found'
  itemName?: string
  imageUrl?: string
  attachmentUrl?: string
}

export interface AIClassificationResult {
  type: PostType
  confidence: number
  extractedData: Partial<PostPreview>
}

// Generate a unique user ID for session management
function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

function safeGet(key: string): string | null {
  if (!isBrowser()) return null
  try { return window.localStorage.getItem(key) } catch { return null }
}

function safeSet(key: string, value: string) {
  if (!isBrowser()) return
  try { window.localStorage.setItem(key, value) } catch {}
}

export function generateUserId(): string {
  const existingUserId = safeGet('campus_feed_user_id')
  if (existingUserId) return existingUserId

  const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  safeSet('campus_feed_user_id', userId)

  const userNames = [
    'Alex Chen', 'Priya Sharma', 'Rahul Kumar', 'Sarah Johnson',
    'Amit Patel', 'Emily Davis', 'Vikram Singh', 'Jessica Lee',
    'Arjun Reddy', 'Maya Thompson', 'Karan Malhotra', 'Sophie Wilson',
    'Rohan Gupta', 'Isabella Rodriguez', 'Aditya Verma', 'Emma Brown'
  ]
  const userName = userNames[Math.floor(Math.random() * userNames.length)]
  safeSet('campus_feed_user_name', userName)
  return userId
}

export function getUserName(): string {
  return safeGet('campus_feed_user_name') || 'Anonymous User'
}

export function getUserId(): string {
  return safeGet('campus_feed_user_id') || generateUserId()
}

export function hasUserReacted(targetId: string, reactionType: string): boolean {
  if (!isBrowser()) return false
  try {
    const reactions = JSON.parse(safeGet(`reactions_${targetId}`) || '{}')
    return reactions[reactionType] === true
  } catch { return false }
}

export function saveUserReaction(targetId: string, reactionType: string, hasReacted: boolean) {
  if (!isBrowser()) return
  try {
    const reactions = JSON.parse(safeGet(`reactions_${targetId}`) || '{}')
    reactions[reactionType] = hasReacted
    safeSet(`reactions_${targetId}`, JSON.stringify(reactions))
  } catch {}
}

export function getUserEventResponse(postId: string): string | null {
  return safeGet(`event_response_${postId}`)
}

export function saveUserEventResponse(postId: string, response: string) {
  safeSet(`event_response_${postId}`, response)
}

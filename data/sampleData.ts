import { Post } from '@/types/post'

export const samplePosts: Post[] = [
  {
    id: '1',
    type: 'event',
    title: 'Docker Workshop - Advanced Container Management',
    description: 'Join us for an intensive Docker workshop covering container orchestration, deployment strategies, and best practices for modern development workflows. Perfect for students interested in DevOps and cloud computing.',
    location: 'CSE Lab, NIT Rourkela',
    date: '2025-01-15',
    time: '17:00',
    department: 'Computer Science & Engineering',
    authorId: 'user_123',
    authorName: 'Dr. Amit Kumar',
    timestamp: '2025-01-10T10:30:00Z',
    responses: { going: 45, interested: 23, not_going: 5 },
    reactions: { '👍': 12, '❤️': 8, '🔥': 15, '😮': 3, '🤔': 2, '😢': 0 },
    comments: [
      {
        id: '101',
        content: 'This sounds amazing! Will there be hands-on practice sessions?',
        authorId: 'user_456',
        authorName: 'Priya Sharma',
        timestamp: '2025-01-10T11:00:00Z',
        reactions: { '👍': 5, '❤️': 2, '🔥': 0, '😮': 0, '🤔': 0, '😢': 0 },
        replies: [
          {
            id: '102',
            content: 'Yes! We\'ll have practical exercises with real-world scenarios.',
            authorId: 'user_123',
            authorName: 'Dr. Amit Kumar',
            timestamp: '2025-01-10T11:15:00Z',
            reactions: { '👍': 8, '❤️': 3, '🔥': 0, '😮': 0, '🤔': 0, '😢': 0 },
            replies: []
          }
        ]
      }
    ]
  },
  {
    id: '2',
    type: 'lost_found',
    title: 'Lost: Black Leather Wallet',
    description: 'Lost my black leather wallet near the central library yesterday evening around 6 PM. Contains important IDs, credit cards, and some cash. Please contact if found. Reward offered.',
    location: 'Central Library, NIT Rourkela',
    itemType: 'lost',
    itemName: 'Black Leather Wallet',
    authorId: 'user_789',
    authorName: 'Rahul Kumar',
    timestamp: '2025-01-09T18:30:00Z',
    reactions: { '😢': 3, '👍': 7, '❤️': 2, '🔥': 0, '😮': 0, '🤔': 0 },
    comments: [
      {
        id: '201',
        content: 'I\'ll keep an eye out for it. Which floor of the library were you on?',
        authorId: 'user_456',
        authorName: 'Sarah Johnson',
        timestamp: '2025-01-09T19:00:00Z',
        reactions: { '👍': 2, '❤️': 0, '🔥': 0, '😮': 0, '🤔': 0, '😢': 0 },
        replies: [
          {
            id: '202',
            content: 'Thanks! I was mostly on the 2nd floor in the reading section.',
            authorId: 'user_789',
            authorName: 'Rahul Kumar',
            timestamp: '2025-01-09T19:15:00Z',
            reactions: { '👍': 1, '❤️': 0, '🔥': 0, '😮': 0, '🤔': 0, '😢': 0 },
            replies: []
          }
        ]
      }
    ]
  },
  {
    id: '3',
    type: 'announcement',
    title: 'New Semester Timetable Released',
    description: 'The official timetable for the upcoming semester has been released. Please check the notice board and official website for your class schedules. All students are requested to verify their timetables and report any conflicts.',
    department: 'Academic Section',
    authorId: 'admin_001',
    authorName: 'Academic Office',
    timestamp: '2025-01-08T09:00:00Z',
    reactions: { '👍': 89, '😮': 12, '❤️': 5, '🔥': 0, '🤔': 3, '😢': 0 },
    comments: [
      {
        id: '301',
        content: 'When does the new semester start?',
        authorId: 'user_321',
        authorName: 'Vikram Singh',
        timestamp: '2025-01-08T10:00:00Z',
        reactions: { '👍': 5, '❤️': 0, '🔥': 0, '😮': 0, '🤔': 0, '😢': 0 },
        replies: [
          {
            id: '302',
            content: 'According to the academic calendar, classes begin on January 20th.',
            authorId: 'user_654',
            authorName: 'Emily Davis',
            timestamp: '2025-01-08T10:30:00Z',
            reactions: { '👍': 8, '❤️': 2, '🔥': 0, '😮': 0, '🤔': 0, '😢': 0 },
            replies: [
              {
                id: '303',
                content: 'Perfect! That gives us enough time to prepare.',
                authorId: 'user_321',
                authorName: 'Vikram Singh',
                timestamp: '2025-01-08T11:00:00Z',
                reactions: { '👍': 3, '❤️': 2, '🔥': 0, '😮': 0, '🤔': 0, '😢': 0 },
                replies: []
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: '4',
    type: 'event',
    title: 'Tech Fest 2025 - Innovation Challenge',
    description: 'Get ready for the biggest tech fest of the year! Participate in coding competitions, hackathons, and innovation challenges. Prizes worth ₹50,000 to be won. Register now!',
    location: 'Main Auditorium, NIT Rourkela',
    date: '2025-02-15',
    time: '09:00',
    department: 'Technical Clubs',
    authorId: 'user_555',
    authorName: 'Tech Club Committee',
    timestamp: '2025-01-07T14:20:00Z',
    responses: { going: 156, interested: 89, not_going: 12 },
    reactions: { '🔥': 67, '👍': 45, '❤️': 34, '😮': 23, '🤔': 5, '😢': 0 },
    comments: [
      {
        id: '401',
        content: 'What are the different competition categories?',
        authorId: 'user_888',
        authorName: 'Arjun Reddy',
        timestamp: '2025-01-07T15:00:00Z',
        reactions: { '👍': 12, '❤️': 3, '🔥': 0, '😮': 0, '🤔': 0, '😢': 0 },
        replies: []
      }
    ]
  },
  {
    id: '5',
    type: 'lost_found',
    title: 'Found: Silver iPhone 14',
    description: 'Found a silver iPhone 14 near the basketball court this morning. The phone is locked but has a distinctive case. Please contact me with the unlock pattern or any identifying details.',
    location: 'Basketball Court, NIT Rourkela',
    itemType: 'found',
    itemName: 'Silver iPhone 14',
    authorId: 'user_999',
    authorName: 'Maya Thompson',
    timestamp: '2025-01-06T08:45:00Z',
    reactions: { '👍': 23, '❤️': 15, '🔥': 0, '😮': 8, '🤔': 2, '😢': 0 },
    comments: [
      {
        id: '501',
        content: 'That\'s my phone! I lost it yesterday. The case has a red stripe on the back.',
        authorId: 'user_777',
        authorName: 'Karan Malhotra',
        timestamp: '2025-01-06T09:00:00Z',
        reactions: { '👍': 7, '❤️': 5, '🔥': 0, '😮': 0, '🤔': 0, '😢': 0 },
        replies: []
      }
    ]
  }
]

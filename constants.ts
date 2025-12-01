
import { ClubEvent, Task, TaskStatus, User, UserRole, TeamMember, Photo, ClubReport } from "./types";

export const MOCK_USERS: User[] = [
  { 
    id: 'admin_vyas', 
    name: 'Vyas Admin', 
    email: 'vyas.sk17@gmail.com', 
    role: UserRole.ADMIN, 
    avatar: 'https://i.pravatar.cc/150?u=99' 
  },
  { id: '1', name: 'Alice Johnson', email: 'alice@datanexus.com', role: UserRole.ADMIN, avatar: 'https://i.pravatar.cc/150?u=1' },
  { id: '2', name: 'Bob Smith', email: 'bob@datanexus.com', role: UserRole.MEMBER, avatar: 'https://i.pravatar.cc/150?u=2' },
  { id: '3', name: 'Charlie Davis', email: 'charlie@datanexus.com', role: UserRole.MEMBER, avatar: 'https://i.pravatar.cc/150?u=3' },
  { id: '4', name: 'Dana Lee', email: 'dana@datanexus.com', role: UserRole.MEMBER, avatar: 'https://i.pravatar.cc/150?u=4' },
];

export const MOCK_EVENTS: ClubEvent[] = [
  // Upcoming (2025 dates)
  {
    id: 'e1',
    title: 'Future of AI Summit 2025',
    date: '2025-06-15',
    description: 'Annual gathering of data enthusiasts to discuss the latest trends in Generative AI and LLMs.',
    location: 'Main Auditorium',
    imageUrl: 'https://picsum.photos/id/4/800/400'
  },
  {
    id: 'e2',
    title: 'Advanced Python Workshop',
    date: '2025-07-22',
    description: 'Deep dive into PyTorch and TensorFlow for building neural networks.',
    location: 'Lab 304',
    imageUrl: 'https://picsum.photos/id/20/800/400'
  },
  // Past (2023 dates)
  {
    id: 'e3',
    title: 'Data Visualization Hackathon 2023',
    date: '2023-11-10',
    description: 'Our biggest hackathon yet where students visualized climate change data.',
    location: 'Innovation Hub',
    imageUrl: 'https://picsum.photos/id/60/800/400'
  },
  {
    id: 'e4',
    title: 'Intro to SQL Bootcamp',
    date: '2023-09-05',
    description: 'A weekend crash course getting 50+ students certified in SQL basics.',
    location: 'Virtual',
    imageUrl: 'https://picsum.photos/id/180/800/400'
  }
];

export const MOCK_TASKS: Task[] = [
  {
    id: 't1',
    eventId: 'e1',
    title: 'Design Marketing Flyers',
    description: 'Create social media assets and physical flyers for the summit.',
    assigneeId: '2',
    status: TaskStatus.COMPLETED,
    deadline: '2025-06-01'
  },
  {
    id: 't2',
    eventId: 'e1',
    title: 'Guest Speaker Coordination',
    description: 'Confirm travel arrangements for keynote speakers.',
    assigneeId: 'admin_vyas',
    status: TaskStatus.IN_PROGRESS,
    deadline: '2025-06-10'
  },
  {
    id: 't3',
    eventId: 'e2',
    title: 'Prepare Workshop Datasets',
    description: 'Clean and package the housing prices dataset for the workshop.',
    assigneeId: '3',
    status: TaskStatus.PENDING,
    deadline: '2025-06-20'
  },
  {
    id: 't4',
    eventId: 'e3',
    title: 'Secure Sponsorships',
    description: 'Contact tech companies for prize sponsorships.',
    assigneeId: null,
    status: TaskStatus.PENDING,
    deadline: '2025-07-01'
  }
];

export const MOCK_MENTORS: TeamMember[] = [
  {
    id: 'ment1',
    name: 'Dr. L. Sherly Annabel',
    role: 'Head Of the Department',
    bio: 'PhD in Machine Learning with over 10 years of experience in AI research. Leading the department with a vision for innovation and academic excellence.',
    imageUrl: 'https://i.pravatar.cc/150?u=45',
    year: 'Department Head',
    skills: ['Machine Learning', 'AI Research', 'Academic Leadership', 'Deep Learning']
  },
  {
    id: 'ment2',
    name: 'Mrs. Arunmozhi B',
    role: 'Faculty Advisor',
    bio: 'Specialist in Machine Learning and AI research. Dedicated to mentoring students and bridging the gap between theory and application.',
    imageUrl: 'https://i.pravatar.cc/150?u=47',
    year: 'Faculty Advisor',
    skills: ['Machine Learning', 'Research', 'Student Mentoring', 'AI Development']
  },
  {
    id: 'ment3',
    name: 'Mr. Eneeyan Nanmaran',
    role: 'Industrial Expert',
    bio: 'Corporate Trainer & Expert in BI/Data Analytics. Skilled in SQL, Python, ML, & Power BI. Successfully cracked 23+ offers in the analytics domain.',
    imageUrl: '/eneeyan.png', 
    year: 'Corporate Trainer',
    skills: ['SQL', 'Python', 'Power BI', 'Machine Learning', 'Career Coaching']
  }
];

export const MOCK_TEAM: TeamMember[] = [
  { 
    id: 'm1', 
    name: 'Sarah Connor', 
    role: 'President', 
    bio: 'Passionate about bridging the gap between academia and industry in AI. Leading the club to new heights with a focus on collaborative projects.', 
    imageUrl: 'https://i.pravatar.cc/150?u=20',
    year: 'Final Year, CS',
    skills: ['Leadership', 'Python', 'Machine Learning', 'Public Speaking']
  },
  { 
    id: 'm2', 
    name: 'John Reese', 
    role: 'VP of Tech', 
    bio: 'AI Researcher with a focus on Computer Vision. organized 10+ workshops and hackathons.', 
    imageUrl: 'https://i.pravatar.cc/150?u=30',
    year: '3rd Year, AI & DS',
    skills: ['TensorFlow', 'PyTorch', 'Computer Vision', 'Docker']
  },
  { 
    id: 'm3', 
    name: 'Harold Finch', 
    role: 'Treasurer', 
    bio: 'Handling finances and logistics. Ensuring every event runs smoothly and under budget.', 
    imageUrl: 'https://i.pravatar.cc/150?u=40',
    year: '3rd Year, IT',
    skills: ['Financial Planning', 'Excel', 'SQL', 'Data Analytics']
  },
  { 
    id: 'm4', 
    name: 'Sameen Shaw', 
    role: 'Event Coordinator', 
    bio: 'Master of logistics and execution. If there is an event, Shaw makes it happen flawlessly.', 
    imageUrl: 'https://i.pravatar.cc/150?u=50',
    year: '2nd Year, AI & DS',
    skills: ['Event Management', 'Communication', 'Agile', 'Logistics']
  },
  { 
    id: 'm5', 
    name: 'Lionel Fusco', 
    role: 'Technical Lead', 
    bio: 'Full stack developer turned data enthusiast. Mentoring juniors in web scraping and data pipeline building.', 
    imageUrl: 'https://i.pravatar.cc/150?u=60',
    year: '3rd Year, CS',
    skills: ['React', 'Node.js', 'Web Scraping', 'Pandas']
  },
  { 
    id: 'm6', 
    name: 'Root', 
    role: 'Outreach Lead', 
    bio: 'Connecting the club with external sponsors and industry experts.', 
    imageUrl: 'https://i.pravatar.cc/150?u=70',
    year: '2nd Year, CS',
    skills: ['Networking', 'Marketing', 'Social Media', 'Content Creation']
  },
];

export const MOCK_PHOTOS: Photo[] = [
  { id: 'p1', url: 'https://picsum.photos/id/1/600/400', caption: 'Coding late into the night', eventId: 'e3' },
  { id: 'p2', url: 'https://picsum.photos/id/201/600/800', caption: 'Winner presentation', eventId: 'e3' },
  { id: 'p3', url: 'https://picsum.photos/id/101/800/600', caption: 'Networking session', eventId: 'e4' },
  { id: 'p4', url: 'https://picsum.photos/id/2/600/400', caption: 'Workshop brainstorming', eventId: 'e2' },
  { id: 'p5', url: 'https://picsum.photos/id/3/600/800', caption: 'Keynote Speaker', eventId: 'e1' },
  { id: 'p6', url: 'https://picsum.photos/id/4/800/600', caption: 'Team lunch', eventId: 'e1' },
];

export const MOCK_REPORTS: ClubReport[] = [
  {
    id: 'r1',
    title: 'Annual Activity Report 2024',
    date: '2024-12-20',
    description: 'A comprehensive summary of all workshops, hackathons, and guest lectures conducted in 2024.',
    thumbnailUrl: 'https://picsum.photos/id/5/400/300',
    fileUrl: '#'
  },
  {
    id: 'r2',
    title: 'Hackathon Impact Assessment',
    date: '2023-11-25',
    description: 'Detailed metrics on participant engagement and project outcomes from the Visualization Hackathon.',
    thumbnailUrl: 'https://picsum.photos/id/6/400/300',
    fileUrl: '#'
  }
];

export const LOGO_URL = '/logo.png';
export const MASCOT_URL = 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Owl.png';
    
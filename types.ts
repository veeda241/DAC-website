
export enum UserRole {
  ADMIN = 'ADMIN',
  FOUNDER = 'FOUNDER',
  PRESIDENT = 'PRESIDENT',
  VICE_PRESIDENT = 'VICE_PRESIDENT',
  EVENT_COORDINATOR = 'EVENT_COORDINATOR',
  CO_EVENT_COORDINATOR = 'CO_EVENT_COORDINATOR',
  TECHNICAL_LEAD = 'TECHNICAL_LEAD',
  CONTENT_WRITER = 'CONTENT_WRITER',
  SOCIAL_MEDIA_LEAD = 'SOCIAL_MEDIA_LEAD',
  DATASET_MANAGER = 'DATASET_MANAGER',
  MEMBER = 'MEMBER'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED'
}

export interface Task {
  id: string;
  eventId: string;
  title: string;
  description: string;
  assigneeId: string | null; // User ID
  status: TaskStatus;
  deadline: string;
}

export interface ClubEvent {
  id: string;
  title: string;
  date: string;
  description: string;
  location: string;
  imageUrl?: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  timestamp: Date;
  details?: string;
}

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
  year: string;
  skills: string[];
}

export interface Photo {
  id: string;
  url: string;
  caption: string;
  eventId: string;
}

export interface ClubReport {
  id: string;
  title: string;
  date: string;
  description: string;
  thumbnailUrl: string;
  fileUrl: string; // In a real app, this would be a link to S3/Cloud storage
}
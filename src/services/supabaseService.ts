import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ClubEvent, Task, ClubReport, Photo } from '../types';
import { MOCK_EVENTS } from '../constants';

// NOTE: You need to create a .env file with these variables
// VITE_SUPABASE_URL=your_project_url
// VITE_SUPABASE_ANON_KEY=your_anon_key

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase: SupabaseClient | null = null;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  console.error('Supabase URL or Anon Key is missing. Please check your .env file.');
}

export { supabase };

// Events
export const fetchEvents = async (): Promise<ClubEvent[]> => {
  // If Supabase is not connected, return MOCK_EVENTS as fallback
  if (!supabase) {
    console.log('Supabase not connected. Using MOCK_EVENTS as fallback.');
    return MOCK_EVENTS;
  }

  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('date', { ascending: true });

  if (error) {
    console.error('Error fetching events:', error);
    return MOCK_EVENTS; // Fallback to MOCK_EVENTS on error
  }

  // Custom mapping to handle potential snake_case (e.g. registration_link) from DB
  const dbEvents = (data || []).map((event: any) => ({
    ...event,
    // Map registration_link to registrationLink if it exists and registrationLink is missing
    registrationLink: event.registrationLink || event.registration_link || event.link || '',
    imageUrl: event.imageUrl || event.image_url
  })) as ClubEvent[];

  // Merge MOCK_EVENTS with database events, avoiding duplicates by id
  const mergedEvents = [...MOCK_EVENTS];
  dbEvents.forEach(dbEvent => {
    if (!mergedEvents.some(mockEvent => mockEvent.id === dbEvent.id || mockEvent.title.toLowerCase() === dbEvent.title.toLowerCase())) {
      mergedEvents.push(dbEvent);
    }
  });

  // Sort by date
  mergedEvents.sort((a, b) => a.date.localeCompare(b.date));

  return mergedEvents;
};

export const createEvent = async (event: Omit<ClubEvent, 'id'>): Promise<ClubEvent | null> => {
  if (!supabase) return null;

  // STRICT PAYLOAD: Only send columns that exist in the DB (snake_case)
  const payload = {
    title: event.title,
    date: event.date,
    description: event.description,
    location: event.location,
    registration_link: event.registrationLink,
    image_url: event.imageUrl
  };

  const { data, error } = await supabase
    .from('events')
    .insert([payload])
    .select()
    .single();

  if (error) {
    console.error('Error creating event:', error);
    return null;
  }
  return data;
};

export const updateEvent = async (event: ClubEvent): Promise<ClubEvent | null> => {
  if (!supabase) return null;

  // STRICT PAYLOAD: Only send columns that exist in the DB (snake_case)
  const payload = {
    title: event.title,
    date: event.date,
    description: event.description,
    location: event.location,
    registration_link: event.registrationLink,
    image_url: event.imageUrl
  };

  const { data, error } = await supabase
    .from('events')
    .update(payload)
    .eq('id', event.id)
    .select()
    .single();

  if (error) {
    console.error('Error updating event:', error);
    return null;
  }
  return data;
};

// Tasks
export const fetchTasks = async (): Promise<Task[]> => {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('deadline', { ascending: true });

  if (error) {
    console.error('Error fetching tasks:', error);
    return [];
  }
  return data || [];
};

export const createTask = async (task: Omit<Task, 'id'>): Promise<Task | null> => {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('tasks')
    .insert([task])
    .select()
    .single();

  if (error) {
    console.error('Error creating task:', error);
    return null;
  }
  return data;
};

export const updateTaskStatus = async (taskId: string, status: string): Promise<Task | null> => {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('tasks')
    .update({ status })
    .eq('id', taskId)
    .select()
    .single();

  if (error) {
    console.error('Error updating task status:', error);
    return null;
  }
  return data;
};

// Reports
export const fetchReports = async (): Promise<ClubReport[]> => {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching reports:', error);
    return [];
  }

  // Map Supabase snake_case to camelCase if necessary
  return (data || []).map((item: any) => ({
    ...item,
    thumbnailUrl: item.thumbnailUrl || item.thumbnail_url || item.thumbnail || '',
    fileUrl: item.fileUrl || item.file_url || item.file || item.url || ''
  })) as ClubReport[];
};

export const createReport = async (report: Omit<ClubReport, 'id'>): Promise<ClubReport | null> => {
  if (!supabase) {
    console.warn("Supabase not connected. Returning mock report.");
    return {
      id: `report-${Date.now()}`,
      ...report
    };
  }

  // Map to snake_case for Supabase if needed, or send as is if columns match
  // ERROR FIX: The previous error said "Could not find the 'file_url' column". 
  // This implies the column name might be 'fileUrl' (camelCase preserved) or 'file', or 'url'.
  // Based on common practices and the error, we will try to match the interface definition or a simpler schema.

  // NOTE: If you are the admin, please check your Supabase Table Definition for 'reports'.
  // We will assume the columns are named as per the Type definition if snake_case failed, 
  // or simple names like 'file' and 'thumbnail'.

  const payload = {
    title: report.title,
    date: report.date,
    description: report.description,
    // Try sending camelCase first if snake_case failed, OR try simpler names if you created the table manually
    // If the error persists, please check the actual column names in your Supabase Dashboard.
    thumbnailUrl: report.thumbnailUrl,
    fileUrl: report.fileUrl,
    // eventId: report.eventId 
  };

  console.log("Attempting to upload report with payload:", payload);

  const { data, error } = await supabase
    .from('reports')
    .insert([payload])
    .select()
    .single();

  if (error) {
    console.error('Error creating report in Supabase:', error);
    console.error('Error details:', error.details, error.message, error.hint);
    return null;
  }

  return data;
};

// Photos
export const fetchPhotos = async (): Promise<Photo[]> => {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('photos')
    .select('*');

  if (error) {
    console.error('Error fetching photos:', error);
    return [];
  }
  return data || [];
};

export const createPhoto = async (photo: Omit<Photo, 'id'>): Promise<Photo | null> => {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('photos')
    .insert([photo])
    .select()
    .single();

  if (error) {
    console.error('Error creating photo:', error);
    return null;
  }
  return data;
};
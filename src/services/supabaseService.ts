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
    // Check if this DB event matches a mock event ID
    const mockMatch = mergedEvents.find(m => m.id === dbEvent.id);
    if (!mockMatch) {
      // New event from DB, add it
      mergedEvents.push(dbEvent);
    } else {
      // Conflict: The event exists in both.
      // We usually prefer DB data, BUT for hardcoded local assets (like images in /public),
      // we might want to keep the local path if the DB one is just a placeholder.
      // For now, let's update the mock match with DB data, but preserve the image if DB has none.
      Object.assign(mockMatch, {
        ...dbEvent,
        imageUrl: dbEvent.imageUrl || mockMatch.imageUrl
      });
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

  if (data && data.length > 0) {
    console.log("Supabase Reports Schema (first item keys):", Object.keys(data[0]));
  }

  // Map Supabase snake_case to camelCase if necessary
  return (data || []).map((item: any) => ({
    ...item,
    thumbnailUrl: item.thumbnailUrl || item.thumbnail_url || item.thumbnail || '',
    fileUrl: item.fileUrl || item.file_url || item.file || item.url || '',
    // Handle eventId mapping if standard checks fail
    eventId: item.eventId || item.event_id
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

  // Schema Inference from Errors:
  // 1. 'file_url' not found -> Likely 'fileUrl' (CamelCase)
  // 2. 'eventId' not found -> Likely 'event_id' (SnakeCase, standard FK)
  const payload: any = {
    title: report.title,
    date: report.date,
    description: report.description,
    thumbnailUrl: report.thumbnailUrl,
    fileUrl: report.fileUrl
  };

  if (report.eventId) {
    // EVENT ID COLUMN MISSING IN DB
    // Supabase has confirmed neither 'eventId' nor 'event_id' exist in the reports table.
    // We are temporarily disabling this field to allow other updates to succeed.
    // Skip mock IDs
    // if (report.eventId.length > 20) {
    //   payload.event_id = report.eventId;
    // } else {
    //   console.warn(`Skipping eventId '${report.eventId}' (mock ID) during creation.`);
    //   payload.event_id = null;
    // }
    console.warn("Skipping eventId upload as column is missing in Supabase reports table.");
  }

  console.log("Attempting to upload report with payload:", payload);

  const { data, error } = await supabase
    .from('reports')
    .insert([payload])
    .select()
    .single();

  if (error) {
    console.error('Error creating report in Supabase:', error);
    return null;
  }

  if (data) {
    return {
      ...data,
      thumbnailUrl: data.thumbnailUrl || data.thumbnail_url,
      fileUrl: data.fileUrl || data.file_url,
      eventId: data.eventId || data.event_id
    } as ClubReport;
  }

  return null;
};


export const updateReport = async (report: ClubReport): Promise<ClubReport | null> => {
  if (!supabase) return null;

  const payload: any = {
    title: report.title,
    date: report.date,
    description: report.description,
    thumbnailUrl: report.thumbnailUrl,
    fileUrl: report.fileUrl
  };

  // Use event_id based on deduction
  if (report.eventId) {
    // EVENT ID COLUMN MISSING IN DB
    // console.warn("Skipping eventId update as column is missing in Supabase.");
    // if (report.eventId.length > 20) {
    //     payload.event_id = report.eventId;
    // } else {
    //     console.warn(`Skipping eventId '${report.eventId}' as it appears to be a mock ID.`);
    //     payload.event_id = null;
    // }
  } else if (report.eventId === '') {
    // payload.event_id = null;
  }

  console.log('Updating report with payload:', payload);

  const { data, error } = await supabase
    .from('reports')
    .update(payload)
    .eq('id', report.id)
    .select()
    .single();

  if (error) {
    console.error('Error updating report:', JSON.stringify(error, null, 2));
    return null;
  }

  if (data) {
    return {
      ...data,
      thumbnailUrl: data.thumbnailUrl || data.thumbnail_url || report.thumbnailUrl,
      fileUrl: data.fileUrl || data.file_url || report.fileUrl,
      eventId: data.eventId || data.event_id || report.eventId
    } as ClubReport;
  }

  return null;
};

export const deleteReport = async (reportId: string): Promise<boolean> => {
  if (!supabase) return false;

  const { error } = await supabase
    .from('reports')
    .delete()
    .eq('id', reportId);

  if (error) {
    console.error('Error deleting report:', error);
    return false;
  }

  return true;
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
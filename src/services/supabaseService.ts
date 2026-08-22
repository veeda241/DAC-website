import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ClubEvent, Task, ClubReport, Photo, TeamMember } from '../types';
import { MOCK_EVENTS, MOCK_TEAM, MOCK_MENTORS } from '../constants';
import { normalizeEventDate } from '../utils/eventDates';
import { parseEventMetadata, serializeEventDescription } from '../utils/eventMetadata';

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

  return (data || []).map((event: any) => {
    const metadata = parseEventMetadata(
      event.description || '',
      event.registrationLink || event.registration_link || ''
    );

    return {
      ...event,
      date: normalizeEventDate(event.date || event.event_date),
      endDate: metadata.endDate,
      description: metadata.description,
      imageUrl: event.image_url || event.imageUrl,
      registrationLink: metadata.registrationLink,
      time: event.time ?? '',
    };
  }) as ClubEvent[];
};

export const createEvent = async (event: Omit<ClubEvent, 'id'>): Promise<ClubEvent | null> => {
  if (!supabase) return null;

  const finalDescription = serializeEventDescription(
    event.description,
    event.endDate,
    event.registrationLink
  );

  const payload = {
    title: event.title,
    date: event.date,
    description: finalDescription,
    location: event.location,
    imageUrl: event.imageUrl,
    time: event.time ?? ''
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

  // Return clean object locally
  return {
    ...data,
    date: normalizeEventDate(data.date),
    endDate: event.endDate,
    description: event.description,
    registrationLink: event.registrationLink,
    imageUrl: data.imageUrl,
    time: data.time ?? event.time ?? ''
  };
};

export const updateEvent = async (event: ClubEvent): Promise<ClubEvent | null> => {
  if (!supabase) return null;

  const finalDescription = serializeEventDescription(
    event.description || '',
    event.endDate,
    event.registrationLink
  );

  const payload = {
    title: event.title,
    date: event.date,
    description: finalDescription,
    location: event.location,
    imageUrl: event.imageUrl,
    time: event.time ?? ''
  };

  // console.log('Updating event with payload:', payload);

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

  return {
    ...data,
    date: normalizeEventDate(data.date),
    endDate: event.endDate,
    description: event.description,
    registrationLink: event.registrationLink,
    imageUrl: data.imageUrl,
    time: data.time ?? event.time ?? ''
  };
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

// Team Members
const mapTeamMember = (row: any): TeamMember => ({
  id: row.id,
  name: row.name,
  role: row.role,
  bio: row.bio,
  imageUrl: row.image_url || row.imageUrl || '',
  year: row.year,
  skills: Array.isArray(row.skills) ? row.skills : (row.skills ? String(row.skills).split(',').map((s: string) => s.trim()) : []),
  memberType: (row.member_type as 'mentor' | 'team') || 'team',
  displayOrder: row.display_order ?? 0,
});

export const uploadTeamMemberImage = async (file: File): Promise<string> => {
  if (!supabase) throw new Error('Supabase not connected');

  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
  const filePath = `${fileName}`; // bucket root

  const { data, error } = await supabase.storage
    .from('team-members')
    .upload(filePath, file, { upsert: false });

  if (error) {
    console.error('Error uploading team member image:', error);
    throw error;
  }

  const { data: publicUrlData } = supabase.storage
    .from('team-members')
    .getPublicUrl(filePath);

  return publicUrlData.publicUrl;
};

export const fetchTeamMembers = async (): Promise<TeamMember[]> => {
  if (!supabase) {
    console.log('Supabase not connected. Using MOCK_TEAM/MOCK_MENTORS as fallback.');
    return [
      ...MOCK_MENTORS.map((m, i) => ({ ...m, memberType: 'mentor' as const, displayOrder: i })),
      ...MOCK_TEAM.map((m, i) => ({ ...m, memberType: 'team' as const, displayOrder: i })),
    ];
  }

  const { data, error } = await supabase
    .from('team_members')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching team members:', error);
    return [
      ...MOCK_MENTORS.map((m, i) => ({ ...m, memberType: 'mentor' as const, displayOrder: i })),
      ...MOCK_TEAM.map((m, i) => ({ ...m, memberType: 'team' as const, displayOrder: i })),
    ];
  }

  const dbMembers = (data || []).map(mapTeamMember);

  // Combine existing mock members with newly added database members
  const mockMembers = [
    ...MOCK_MENTORS.map((m, i) => ({ ...m, memberType: 'mentor' as const, displayOrder: i })),
    ...MOCK_TEAM.map((m, i) => ({ ...m, memberType: 'team' as const, displayOrder: i })),
  ];

  return [...mockMembers, ...dbMembers];
};

export const createTeamMember = async (member: Omit<TeamMember, 'id'>): Promise<TeamMember | null> => {
  if (!supabase) return null;

  const payload = {
    name: member.name,
    role: member.role,
    bio: member.bio,
    image_url: member.imageUrl,
    year: member.year,
    skills: member.skills,
    member_type: member.memberType || 'team',
    display_order: member.displayOrder ?? 0,
  };

  const { data, error } = await supabase
    .from('team_members')
    .insert([payload])
    .select()
    .single();

  if (error) {
    console.error('Error creating team member:', error);
    return null;
  }

  return mapTeamMember(data);
};

export const updateTeamMember = async (member: TeamMember): Promise<TeamMember | null> => {
  if (!supabase) return null;

  const payload = {
    name: member.name,
    role: member.role,
    bio: member.bio,
    image_url: member.imageUrl,
    year: member.year,
    skills: member.skills,
    member_type: member.memberType || 'team',
    display_order: member.displayOrder ?? 0,
  };

  const { data, error } = await supabase
    .from('team_members')
    .update(payload)
    .eq('id', member.id)
    .select()
    .single();

  if (error) {
    console.error('Error updating team member:', error);
    return null;
  }

  return mapTeamMember(data);
};

export const deleteTeamMember = async (id: string): Promise<boolean> => {
  if (!supabase) return false;

  const { error } = await supabase
    .from('team_members')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting team member:', error);
    return false;
  }

  return true;
};

export const reorderTeamMembers = async (
  id: string,
  direction: 'up' | 'down',
  siblings: TeamMember[]
): Promise<boolean> => {
  if (!supabase) return false;

  const sorted = [...siblings].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
  const idx = sorted.findIndex(m => m.id === id);
  if (idx < 0) return false;

  const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
  if (swapIdx < 0 || swapIdx >= sorted.length) return false;

  const a = sorted[idx];
  const b = sorted[swapIdx];
  const aOrder = a.displayOrder ?? idx;
  const bOrder = b.displayOrder ?? swapIdx;

  const { error: e1 } = await supabase
    .from('team_members')
    .update({ display_order: bOrder })
    .eq('id', a.id);

  const { error: e2 } = await supabase
    .from('team_members')
    .update({ display_order: aOrder })
    .eq('id', b.id);

  if (e1 || e2) {
    console.error('Error reordering team members:', e1 || e2);
    return false;
  }

  return true;
};
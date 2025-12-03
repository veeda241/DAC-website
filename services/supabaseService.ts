import { createClient } from '@supabase/supabase-js';

const supabaseUrl = `https://ffkmidestrmiwnjiixvy.supabase.co`;
const supabaseAnonKey = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZma21pZGVzdHJtaXduamlpeHZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2OTkwNDgsImV4cCI6MjA4MDI3NTA0OH0.znubXh4RAOFhFLhTMlLgjZMfPTBDms0CrEJbdZvt0m8`;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

-- 1. Create the team_members table
CREATE TABLE IF NOT EXISTS public.team_members (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  role text NOT NULL,
  bio text,
  image_url text,
  year text,
  skills text[] DEFAULT '{}'::text[],
  member_type text DEFAULT 'team'::text,
  display_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- 3. Create Database Policies (safely dropping them first if they exist)
DROP POLICY IF EXISTS "Public Read Access" ON public.team_members;
CREATE POLICY "Public Read Access" ON public.team_members FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin Insert Access" ON public.team_members;
CREATE POLICY "Admin Insert Access" ON public.team_members FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Admin Update Access" ON public.team_members;
CREATE POLICY "Admin Update Access" ON public.team_members FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin Delete Access" ON public.team_members;
CREATE POLICY "Admin Delete Access" ON public.team_members FOR DELETE TO authenticated USING (true);

-- 4. Create the storage bucket (idempotent)
insert into storage.buckets (id, name, public) 
values ('team-members', 'team-members', true)
on conflict (id) do nothing;

-- 5. Safely create storage policies
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
create policy "Public Access" 
on storage.objects for select 
using ( bucket_id = 'team-members' );

DROP POLICY IF EXISTS "Admin Upload Access" ON storage.objects;
create policy "Admin Upload Access" 
on storage.objects for insert 
to authenticated 
with check ( bucket_id = 'team-members' );

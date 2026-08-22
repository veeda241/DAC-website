import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const envContent = readFileSync('.env', 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const [key, ...val] = line.split('=');
  if (key && val) env[key.trim()] = val.join('=').trim();
});

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function main() {
  // Try to query pg_tables or information_schema? No, anon key doesn't have access.
  // I will just try 'members'.
  const { data, error } = await supabase.from('members').select('*').limit(1);
  if (error) {
    console.error('Error fetching members:', error);
  } else {
    console.log('Columns in members:', Object.keys(data[0] || {}));
  }
}
main();

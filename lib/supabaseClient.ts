import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://iuqntfgunvcemwngbcep.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1cW50Zmd1bnZjZW13bmdiY2VwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzMjM5NjYsImV4cCI6MjA3Njg5OTk2Nn0.SLzu57oTwh8v_1SHpoBwxuZbvL9-1qnly3Mq8F6mA1c';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL and Anon Key are required.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
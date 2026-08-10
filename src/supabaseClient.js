import { createClient } from "@supabase/supabase-js";

// Your Supabase project. The anon key is meant to live in front-end code —
// it only grants access allowed by your Row Level Security rules, which limit
// every user to their own rows. (The secret/service_role key must NEVER go here.)
const SUPABASE_URL = "https://mwlfcmudeitdsiaykxyl.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13bGZjbXVkZWl0ZHNpYXlreHlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYzNTg4NDYsImV4cCI6MjEwMTkzNDg0Nn0.48XC3YwbrCmlf1K7273M8GaotQOq7bbimsDA7Vc4jqc";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

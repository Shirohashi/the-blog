import { createClient } from '@supabase/supabase-js'; // Import the function to create a connection to Supabase

// Reads the Supabase URL and publishable key from .env file
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabasePubKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

// Creates the Supabase client to be available and used in the whole app
export const supabase = createClient(supabaseUrl, supabasePubKey);
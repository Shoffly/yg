// supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zkkjvqlrfaorjwwcnlkz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpra2p2cWxyZmFvcmp3d2NubGt6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTY0NDg5NjIsImV4cCI6MjAzMjAyNDk2Mn0.nrhg7Dd7Z7hNyd6RElwzY0URzYN-UW5BiMYdvOmzk2g'

export const supabase = createClient(supabaseUrl, supabaseKey);




            
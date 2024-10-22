
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fvksxvpglbddnutvvquq.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2a3N4dnBnbGJkZG51dHZ2cXVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk1ODc4NTEsImV4cCI6MjA0NTE2Mzg1MX0.oVMJXdT2DuXOE6myqnSnUDw95_6T4fv5B5w6BRqgCOo'
export const supabase = createClient(supabaseUrl, supabaseKey)
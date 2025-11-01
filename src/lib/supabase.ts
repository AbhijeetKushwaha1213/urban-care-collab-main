import { createClient } from '@supabase/supabase-js'

// Replace these with your actual Supabase project URL and anon key
const supabaseUrl = 'https://vzqtjhoevvjxdgocnfju.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6cXRqaG9ldnZqeGRnb2NuZmp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4MTk5MjksImV4cCI6MjA3NzM5NTkyOX0.Y_z1NwNMsGtgJk-0opVJv4ZHj0mCSc7taQsuwcA7jJ0'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Test Supabase connection
export const testSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('test').select('*').limit(1)
    if (error && error.code !== 'PGRST116') { // PGRST116 is "relation does not exist" which is expected
      console.error('Supabase connection failed:', error)
      return false
    }
    console.log('Supabase connection successful')
    return true
  } catch (error) {
    console.error('Supabase connection failed:', error)
    return false
  }
}

// Test Auth connection
export const testSupabaseAuth = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    console.log('Supabase Auth connection successful, current user:', user ? 'logged in' : 'not logged in')
    return true
  } catch (error) {
    console.error('Supabase Auth connection failed:', error)
    return false
  }
}
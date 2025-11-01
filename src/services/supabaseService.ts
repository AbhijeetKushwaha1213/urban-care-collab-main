import { supabase } from '@/lib/supabase'

// Type for event data
export interface EventData {
  id?: string
  title: string
  description: string
  location: string
  date: string
  time: string
  status?: string
  time_remaining?: string
  categories: string[]
  volunteers_count?: number
  created_by?: string
  created_at?: string
}

// Type for issue data
export interface IssueData {
  id?: string
  title: string
  description: string
  location: string
  category: string
  image?: string
  date?: string
  status?: string
  comments_count?: number
  volunteers_count?: number
  created_by?: string
  created_at?: string
}

// Get all events
export const getEvents = async () => {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching events:', error)
    throw error
  }
  
  return data as EventData[]
}

// Get event by ID
export const getEventById = async (id: string) => {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) {
    if (error.code === 'PGRST116') return null // Not found
    console.error('Error fetching event:', error)
    throw error
  }
  
  return data as EventData
}

// Create a new event
export const createEvent = async (eventData: EventData, userId: string) => {
  const { data, error } = await supabase
    .from('events')
    .insert([
      {
        ...eventData,
        created_by: userId,
        status: 'Upcoming',
        volunteers_count: 0,
        created_at: new Date().toISOString()
      }
    ])
    .select()
    .single()
  
  if (error) {
    console.error('Error creating event:', error)
    throw error
  }
  
  return data
}

// Update an event
export const updateEvent = async (id: string, eventData: Partial<EventData>) => {
  const { data, error } = await supabase
    .from('events')
    .update(eventData)
    .eq('id', id)
    .select()
    .single()
  
  if (error) {
    console.error('Error updating event:', error)
    throw error
  }
  
  return data
}

// Delete an event
export const deleteEvent = async (id: string) => {
  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', id)
  
  if (error) {
    console.error('Error deleting event:', error)
    throw error
  }
}

// Get all issues
export const getIssues = async () => {
  const { data, error } = await supabase
    .from('issues')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching issues:', error)
    throw error
  }
  
  return data as IssueData[]
}

// Get issue by ID
export const getIssueById = async (id: string) => {
  const { data, error } = await supabase
    .from('issues')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) {
    if (error.code === 'PGRST116') return null // Not found
    console.error('Error fetching issue:', error)
    throw error
  }
  
  return data as IssueData
}

// Create a new issue
export const createIssue = async (issueData: IssueData, userId: string) => {
  const { data, error } = await supabase
    .from('issues')
    .insert([
      {
        ...issueData,
        created_by: userId,
        status: 'reported',
        comments_count: 0,
        volunteers_count: 0,
        created_at: new Date().toISOString()
      }
    ])
    .select()
    .single()
  
  if (error) {
    console.error('Error creating issue:', error)
    throw error
  }
  
  return data
}

// Update an issue
export const updateIssue = async (id: string, issueData: Partial<IssueData>) => {
  const { data, error } = await supabase
    .from('issues')
    .update(issueData)
    .eq('id', id)
    .select()
    .single()
  
  if (error) {
    console.error('Error updating issue:', error)
    throw error
  }
  
  return data
}

// Delete an issue
export const deleteIssue = async (id: string) => {
  const { error } = await supabase
    .from('issues')
    .delete()
    .eq('id', id)
  
  if (error) {
    console.error('Error deleting issue:', error)
    throw error
  }
}

// Get events created by a specific user
export const getUserEvents = async (userId: string) => {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('created_by', userId)
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching user events:', error)
    throw error
  }
  
  return data as EventData[]
}

// Get issues created by a specific user
export const getUserIssues = async (userId: string) => {
  const { data, error } = await supabase
    .from('issues')
    .select('*')
    .eq('created_by', userId)
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching user issues:', error)
    throw error
  }
  
  return data as IssueData[]
}

// Get paginated events
export const getPaginatedEvents = async (limitCount: number, offset: number = 0) => {
  const { data, error, count } = await supabase
    .from('events')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limitCount - 1)
  
  if (error) {
    console.error('Error fetching paginated events:', error)
    throw error
  }
  
  return { 
    events: data as EventData[], 
    totalCount: count || 0,
    hasMore: (count || 0) > offset + limitCount
  }
}

// Upload file to Supabase Storage
export const uploadFile = async (file: File, bucket: string, path: string) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file)
  
  if (error) {
    console.error('Error uploading file:', error)
    throw error
  }
  
  return data
}

// Get public URL for uploaded file
export const getFileUrl = (bucket: string, path: string) => {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path)
  
  return data.publicUrl
}
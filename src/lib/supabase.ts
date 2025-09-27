import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://bnjthwrpigvchbhsmfec.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJuanRod3JwaWd2Y2hiaHNtZmVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc1MzE1OTksImV4cCI6MjA3MzEwNzU5OX0.okbuiEqTbdDEbkPFCT1w8-H46UrMHjm-4KXuyQ0PNBU'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'x-application-name': 'nelson-gpt'
    }
  }
})

// Medical database operations
export const medicalDB = {
  // Get medical embeddings for vector search
  async searchMedicalEmbeddings(query: string, limit: number = 5) {
    const { data, error } = await supabase
      .rpc('search_medical_embeddings', {
        query_text: query,
        match_count: limit
      })
    
    if (error) {
      console.error('Error searching medical embeddings:', error)
      return []
    }
    
    return data || []
  },

  // Get medical content by ID
  async getMedicalContent(id: string) {
    const { data, error } = await supabase
      .from('godzilla_medical_dataset')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      console.error('Error getting medical content:', error)
      return null
    }
    
    return data
  },

  // Save conversation to database
  async saveConversation(conversation: any) {
    const { data, error } = await supabase
      .from('conversations')
      .upsert(conversation)
    
    if (error) {
      console.error('Error saving conversation:', error)
      return null
    }
    
    return data
  },

  // Get user conversations
  async getUserConversations(userId: string) {
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
    
    if (error) {
      console.error('Error getting conversations:', error)
      return []
    }
    
    return data || []
  },

  // Audit logging for HIPAA compliance
  async logAuditEvent(event: {
    user_id?: string
    action: string
    resource: string
    details?: any
    ip_address?: string
  }) {
    const { error } = await supabase
      .from('audit_logs')
      .insert({
        ...event,
        timestamp: new Date().toISOString()
      })
    
    if (error) {
      console.error('Error logging audit event:', error)
    }
  }
}

// Type definitions for database tables
export interface MedicalEmbedding {
  id: string
  content: string
  metadata: {
    source: string
    chapter: string
    page?: number
    section?: string
    keywords?: string[]
  }
  embedding: number[]
}

export interface ConversationRecord {
  id: string
  user_id: string
  title: string
  messages: any[]
  created_at: string
  updated_at: string
  is_archived?: boolean
}

export interface AuditLog {
  id: string
  user_id?: string
  action: string
  resource: string
  details?: any
  ip_address?: string
  timestamp: string
}
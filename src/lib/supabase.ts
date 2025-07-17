import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://sjavsbnbtzzchjqggfpn.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNqYXZzYm5idHp6Y2hqcWdnZnBuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MTU0NjYsImV4cCI6MjA2ODI5MTQ2Nn0.IFN1tVWGK7R5Exh3lmSK-kb4N2XbwAC1fLkU_clN_DQ'

console.log('🔧 Supabase 설정:')
console.log('URL:', supabaseUrl)
console.log('Key:', supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : 'undefined')

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables')
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

console.log('✅ Supabase 클라이언트 초기화 완료')

// 데이터베이스 타입 정의
export interface Database {
  public: {
    Tables: {
      tickets: {
        Row: {
          id: string
          title: string
          description: string
          status: string
          priority: string
          assignee: string
          reporter: string
          created_at: string
          due_date: string
          comments_count: number
          category: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          status?: string
          priority: string
          assignee: string
          reporter: string
          created_at?: string
          due_date: string
          comments_count?: number
          category: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          status?: string
          priority?: string
          assignee?: string
          reporter?: string
          created_at?: string
          due_date?: string
          comments_count?: number
          category?: string
        }
      }
      documents: {
        Row: {
          id: string
          name: string
          type: string
          size: string
          uploaded_at: string
          uploaded_by: string
          path: string
        }
        Insert: {
          id?: string
          name: string
          type: string
          size: string
          uploaded_at?: string
          uploaded_by: string
          path: string
        }
        Update: {
          id?: string
          name?: string
          type?: string
          size?: string
          uploaded_at?: string
          uploaded_by?: string
          path?: string
        }
      }
      announcements: {
        Row: {
          id: string
          title: string
          content: string
          author: string
          created_at: string
          priority: string
          is_pinned: boolean
        }
        Insert: {
          id?: string
          title: string
          content: string
          author: string
          created_at?: string
          priority?: string
          is_pinned?: boolean
        }
        Update: {
          id?: string
          title?: string
          content?: string
          author?: string
          created_at?: string
          priority?: string
          is_pinned?: boolean
        }
      }
    }
  }
}

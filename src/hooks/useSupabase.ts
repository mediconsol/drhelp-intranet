import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'
import { Document, Announcement, UploadDocumentForm } from '@/types'

// 사용자 관련 훅
export function useUsers() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('name')

      if (error) throw error
      setUsers(data || [])
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const createUser = async (userData: { name: string; email: string }) => {
    try {
      // 먼저 이메일로 기존 사용자 확인
      const { data: existingUser, error: existingError } = await supabase
        .from('users')
        .select('id, name, email')
        .eq('email', userData.email)
        .single()

      if (existingUser) {
        toast({
          title: "알림",
          description: "이미 존재하는 이메일입니다.",
          variant: "destructive",
        })
        return existingUser
      }

      // 새 사용자 생성
      const { data, error } = await supabase
        .from('users')
        .insert([userData])
        .select()

      if (error) throw error

      if (data) {
        setUsers(prev => [...prev, data[0]])
        toast({
          title: "성공",
          description: "사용자가 생성되었습니다.",
        })
        return data[0]
      }
    } catch (error) {
      console.error('Error creating user:', error)
      toast({
        title: "오류",
        description: "사용자 생성 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  return { users, loading, createUser, refetch: fetchUsers }
}

// 티켓 관련 훅 제거됨

// 문서 관련 훅
export function useDocuments() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const fetchDocuments = async () => {
    try {
      setLoading(true)
      console.log('🔄 Fetching documents from Supabase...')

      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('❌ Supabase error:', error)
        throw error
      }

      console.log('✅ Documents fetched successfully:', data?.length || 0, 'items')
      setDocuments(data || [])
    } catch (error) {
      console.error('Error fetching documents:', error)
      toast({
        title: "오류",
        description: "문서를 불러오는 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const uploadDocument = async (formData: UploadDocumentForm) => {
    try {
      console.log('🔄 Uploading document:', formData)

      const documentData = {
        name: formData.name,
        type: formData.type,
        size: formData.size,
        url: `/documents/${formData.name}`, // 기본 경로 설정
        modified_by: formData.uploaded_by,
        tags: [], // 기본값
        is_starred: false, // 기본값
        folder_id: null // 기본값
      }

      const { data, error } = await supabase
        .from('documents')
        .insert([documentData])
        .select()

      if (error) {
        console.error('❌ Supabase error:', error)
        throw error
      }

      if (data) {
        console.log('✅ Document uploaded successfully:', data[0])
        setDocuments(prev => [data[0], ...prev])
        toast({
          title: "성공",
          description: "문서가 업로드되었습니다.",
        })
      }
    } catch (error) {
      console.error('Error uploading document:', error)
      toast({
        title: "오류",
        description: "문서 업로드 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    }
  }

  const deleteDocument = async (id: string) => {
    try {
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      setDocuments(prev => prev.filter(doc => doc.id !== id))
      toast({
        title: "성공",
        description: "문서가 삭제되었습니다.",
      })
    } catch (error) {
      console.error('Error deleting document:', error)
      toast({
        title: "오류",
        description: "문서 삭제 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    fetchDocuments()
  }, [])

  return {
    documents,
    loading,
    uploadDocument,
    deleteDocument,
    refetch: fetchDocuments
  }
}

// 공지사항 관련 훅
export function useAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const fetchAnnouncements = async () => {
    try {
      setLoading(true)
      console.log('🔄 Fetching announcements from Supabase...')

      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('❌ Supabase error:', error)
        throw error
      }

      console.log('✅ Announcements fetched successfully:', data?.length || 0, 'items')
      setAnnouncements(data || [])
    } catch (error) {
      console.error('Error fetching announcements:', error)
      toast({
        title: "오류",
        description: "공지사항을 불러오는 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const createAnnouncement = async (announcement: any) => {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .insert([announcement])
        .select()

      if (error) throw error
      
      if (data) {
        setAnnouncements(prev => [data[0], ...prev])
        toast({
          title: "성공",
          description: "공지사항이 생성되었습니다.",
        })
      }
    } catch (error) {
      console.error('Error creating announcement:', error)
      toast({
        title: "오류",
        description: "공지사항 생성 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    }
  }

  const updateAnnouncement = async (id: string, updates: any) => {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .update(updates)
        .eq('id', id)
        .select()

      if (error) throw error
      
      if (data) {
        setAnnouncements(prev => prev.map(announcement => 
          announcement.id === id ? data[0] : announcement
        ))
        toast({
          title: "성공",
          description: "공지사항이 업데이트되었습니다.",
        })
      }
    } catch (error) {
      console.error('Error updating announcement:', error)
      toast({
        title: "오류",
        description: "공지사항 업데이트 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    }
  }

  const deleteAnnouncement = async (id: string) => {
    try {
      const { error } = await supabase
        .from('announcements')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      setAnnouncements(prev => prev.filter(announcement => announcement.id !== id))
      toast({
        title: "성공",
        description: "공지사항이 삭제되었습니다.",
      })
    } catch (error) {
      console.error('Error deleting announcement:', error)
      toast({
        title: "오류",
        description: "공지사항 삭제 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    fetchAnnouncements()
  }, [])

  return {
    announcements,
    loading,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    refetch: fetchAnnouncements
  }
}

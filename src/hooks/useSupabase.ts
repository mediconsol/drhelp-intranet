import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'
import { Ticket, Document, Announcement, CreateTicketForm, UploadDocumentForm } from '@/types'

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

// 티켓 관련 훅
export function useTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const fetchTickets = async () => {
    try {
      setLoading(true)
      console.log('🔄 Fetching tickets from Supabase...')

      // 티켓 데이터 먼저 가져오기
      const { data: ticketsData, error } = await supabase
        .from('tickets')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('❌ Supabase error:', error)
        throw error
      }

      // 사용자 정보 별도로 가져와서 수동 조인
      const { data: usersData } = await supabase
        .from('users')
        .select('id, name, email')

      // 수동으로 조인
      const ticketsWithUsers = ticketsData?.map(ticket => ({
        ...ticket,
        assignee: usersData?.find(user => user.id === ticket.assignee_id) || null,
        reporter: usersData?.find(user => user.id === ticket.reporter_id) || null
      })) || []

      console.log('✅ Tickets fetched successfully:', ticketsWithUsers?.length || 0, 'items')
      setTickets(ticketsWithUsers || [])
    } catch (error) {
      console.error('Error fetching tickets:', error)
      toast({
        title: "오류",
        description: "티켓을 불러오는 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const createTicket = async (formData: CreateTicketForm) => {
    try {
      console.log('🔄 Creating ticket with form data:', formData)

      // 현재 로그인한 사용자 정보 가져오기
      const { data: { user: currentUser } } = await supabase.auth.getUser()

      // 사용자 이름으로 ID 찾기 또는 새 사용자 생성
      let assigneeId = null
      let reporterId = null

      // 담당자 처리
      if (formData.assignee && formData.assignee !== "미지정") {
        console.log('🔍 Looking for assignee:', formData.assignee)

        // 먼저 users 테이블에서 찾기
        const { data: assigneeUsers, error: assigneeError } = await supabase
          .from('users')
          .select('id')
          .eq('name', formData.assignee)

        if (assigneeError || !assigneeUsers || assigneeUsers.length === 0) {
          console.log('⚠️ Assignee not found, creating new user:', formData.assignee)
          // 새 사용자 생성
          const { data: newAssignee, error: createAssigneeError } = await supabase
            .from('users')
            .insert([{
              name: formData.assignee,
              email: `${formData.assignee.toLowerCase().replace(/\s+/g, '')}@mediconsol.com`,
              auth_id: null // 아직 인증되지 않은 사용자
            }])
            .select('id')
            .single()

          if (createAssigneeError) {
            console.error('❌ Failed to create assignee:', createAssigneeError)
            // 담당자 생성 실패 시 null로 설정 (미지정)
            assigneeId = null
          } else {
            assigneeId = newAssignee?.id
            console.log('✅ Created new assignee with ID:', assigneeId)
          }
        } else {
          assigneeId = assigneeUsers[0].id
          console.log('✅ Found existing assignee with ID:', assigneeId)
        }
      }

      // 보고자 처리 (현재 로그인한 사용자 우선 사용)
      if (currentUser) {
        console.log('🔍 Using current logged-in user as reporter:', currentUser.id)

        // 현재 사용자가 users 테이블에 있는지 확인
        const { data: existingUser, error: userCheckError } = await supabase
          .from('users')
          .select('id')
          .eq('auth_id', currentUser.id)
          .single()

        if (userCheckError || !existingUser) {
          console.log('⚠️ Current user not in users table, creating entry')
          // 현재 사용자를 users 테이블에 추가
          const { data: newUser, error: createUserError } = await supabase
            .from('users')
            .insert([{
              name: currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || '현재사용자',
              email: currentUser.email || 'unknown@mediconsol.com',
              auth_id: currentUser.id
            }])
            .select('id')
            .single()

          if (createUserError) {
            console.error('❌ Failed to create current user entry:', createUserError)
            // 폴백: 이름으로 찾기
            reporterId = await this.handleReporterByName(formData.reporter)
          } else {
            reporterId = newUser?.id
            console.log('✅ Created current user entry with ID:', reporterId)
          }
        } else {
          reporterId = existingUser.id
          console.log('✅ Found current user in users table with ID:', reporterId)
        }
      } else {
        // 로그인하지 않은 경우 이름으로 처리
        console.log('🔍 Looking for reporter by name:', formData.reporter)
        const { data: reporterUsers, error: reporterError } = await supabase
          .from('users')
          .select('id')
          .eq('name', formData.reporter)

        if (reporterError || !reporterUsers || reporterUsers.length === 0) {
          console.log('⚠️ Reporter not found, creating new user:', formData.reporter)
          // 새 사용자 생성
          const { data: newReporter, error: createReporterError } = await supabase
            .from('users')
            .insert([{
              name: formData.reporter,
              email: `${formData.reporter.toLowerCase().replace(/\s+/g, '')}@mediconsol.com`,
              auth_id: null
            }])
            .select('id')
            .single()

          if (createReporterError) {
            console.error('❌ Failed to create reporter:', createReporterError)
            throw new Error(`보고자 생성 실패: ${createReporterError.message}`)
          } else {
            reporterId = newReporter?.id
            console.log('✅ Created new reporter with ID:', reporterId)
          }
        } else {
          reporterId = reporterUsers[0].id
          console.log('✅ Found existing reporter with ID:', reporterId)
        }
      }

      // reporter_id가 필수이므로 확인
      if (!reporterId) {
        throw new Error('보고자 ID를 찾을 수 없습니다.')
      }

      const ticketData = {
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        assignee_id: assigneeId,
        reporter_id: reporterId,
        due_date: formData.due_date ? new Date(formData.due_date).toISOString() : null,
        category: formData.category,
        status: 'waiting'
      }

      console.log('📋 Final ticket data to insert:', ticketData)

      const { data, error } = await supabase
        .from('tickets')
        .insert([ticketData])
        .select()

      if (error) {
        console.error('❌ Supabase error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        })
        throw error
      }

      if (data) {
        console.log('✅ Ticket created successfully:', data[0])

        // 사용자 정보 추가해서 상태 업데이트
        const { data: usersData } = await supabase
          .from('users')
          .select('id, name, email')

        const ticketWithUsers = {
          ...data[0],
          assignee: usersData?.find(user => user.id === data[0].assignee_id) || null,
          reporter: usersData?.find(user => user.id === data[0].reporter_id) || null
        }

        setTickets(prev => [ticketWithUsers, ...prev])
        toast({
          title: "성공",
          description: "티켓이 생성되었습니다.",
        })
      }
    } catch (error) {
      console.error('Error creating ticket:', error)
      toast({
        title: "오류",
        description: "티켓 생성 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    }
  }

  const updateTicket = async (id: string, updates: any) => {
    try {
      const { data, error } = await supabase
        .from('tickets')
        .update(updates)
        .eq('id', id)
        .select()

      if (error) throw error
      
      if (data) {
        setTickets(prev => prev.map(ticket => 
          ticket.id === id ? data[0] : ticket
        ))
        toast({
          title: "성공",
          description: "티켓이 업데이트되었습니다.",
        })
      }
    } catch (error) {
      console.error('Error updating ticket:', error)
      toast({
        title: "오류",
        description: "티켓 업데이트 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    }
  }

  const deleteTicket = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tickets')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      setTickets(prev => prev.filter(ticket => ticket.id !== id))
      toast({
        title: "성공",
        description: "티켓이 삭제되었습니다.",
      })
    } catch (error) {
      console.error('Error deleting ticket:', error)
      toast({
        title: "오류",
        description: "티켓 삭제 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    fetchTickets()
  }, [])

  return {
    tickets,
    loading,
    createTicket,
    updateTicket,
    deleteTicket,
    refetch: fetchTickets
  }
}

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

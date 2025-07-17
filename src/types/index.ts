// 실제 Supabase 스키마에 맞는 타입 정의

export interface User {
  id: string;
  name: string;
  email: string;
  created_at: string;
  updated_at?: string;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  assignee_id: string | null;
  reporter_id: string | null;
  category: string;
  due_date: string;
  created_at: string;
  updated_at: string;

  // 조인된 사용자 정보 (선택적)
  assignee?: User;
  reporter?: User;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  url: string | null;
  last_modified: string;
  modified_by: string;
  tags: string[];
  is_starred: boolean;
  folder_id: string | null;
  created_at: string;
  updated_at: string;

  // UI에서 사용하는 아이콘 (런타임에 추가)
  icon?: React.ComponentType<{ className?: string }>;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  created_at: string;
  priority: string;
  is_pinned: boolean;
}

// 폼에서 사용하는 타입들
export interface CreateTicketForm {
  title: string;
  description: string;
  priority: string;
  assignee: string | null;  // 담당자 없음 (null)
  reporter: string;  // UI에서는 문자열로 받음
  due_date: string;
  category: string;
}

export interface UploadDocumentForm {
  name: string;
  type: string;
  size: string;
  uploaded_by: string;
  path?: string;
}

export interface FileItem {
  id: string;
  name: string;
  type: string;
  size: string;
  lastModified: string;
  modifiedBy: string;
  tags: string[];
  isStarred: boolean;
  icon: any; // Lucide icon component
}

export interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: string;
  file?: File;
  uploadedBy?: string;
}

// 인증 관련 타입들
export interface AuthUser {
  id: string;
  email: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
  created_at: string;
}

export interface LoginForm {
  email: string;
  password: string;
}

export interface SignUpForm {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
}

// 실제 Supabase 스키마에 맞는 타입 정의

export interface User {
  id: string;
  name: string;
  email: string;
  created_at: string;
  updated_at?: string;
}

// Ticket 인터페이스 제거됨

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

// CreateTicketForm 인터페이스 제거됨

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

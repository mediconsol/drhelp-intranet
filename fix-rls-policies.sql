-- RLS 정책 수정 및 공지사항 테이블 생성
-- Supabase SQL Editor에서 실행하세요

-- 1. 기존 RLS 정책 제거 (개발 단계)
DROP POLICY IF EXISTS "Enable read access for all users" ON tickets;
DROP POLICY IF EXISTS "Enable insert access for all users" ON tickets;
DROP POLICY IF EXISTS "Enable update access for all users" ON tickets;
DROP POLICY IF EXISTS "Enable delete access for all users" ON tickets;

DROP POLICY IF EXISTS "Enable read access for all users" ON documents;
DROP POLICY IF EXISTS "Enable insert access for all users" ON documents;
DROP POLICY IF EXISTS "Enable update access for all users" ON documents;
DROP POLICY IF EXISTS "Enable delete access for all users" ON documents;

-- 2. 임시로 RLS 비활성화 (개발 단계)
ALTER TABLE tickets DISABLE ROW LEVEL SECURITY;
ALTER TABLE documents DISABLE ROW LEVEL SECURITY;
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- 3. 공지사항 테이블 생성
CREATE TABLE IF NOT EXISTS announcements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  author VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  priority VARCHAR(50) DEFAULT '일반',
  is_pinned BOOLEAN DEFAULT FALSE
);

-- 공지사항 테이블도 RLS 비활성화
ALTER TABLE announcements DISABLE ROW LEVEL SECURITY;

-- 4. 샘플 사용자 데이터 삽입
INSERT INTO users (name, email) VALUES
('김개발', 'kim.dev@example.com'),
('이디자인', 'lee.design@example.com'),
('박기획', 'park.plan@example.com'),
('최테스터', 'choi.test@example.com'),
('정관리자', 'jung.admin@example.com')
ON CONFLICT (email) DO NOTHING;

-- 5. 샘플 공지사항 데이터 삽입
INSERT INTO announcements (title, content, author, priority, is_pinned) VALUES
('시스템 점검 안내', '2024년 7월 20일 오전 2시부터 4시까지 시스템 점검이 있을 예정입니다.', '정관리자', '중요', true),
('새로운 기능 출시', '티켓 관리 시스템에 새로운 필터 기능이 추가되었습니다.', '김개발', '일반', false),
('보안 업데이트 완료', '보안 취약점 패치가 완료되었습니다.', '정관리자', '중요', false),
('월례 회의 안내', '이번 달 월례 회의는 7월 25일 오후 2시에 진행됩니다.', '박기획', '일반', false)
ON CONFLICT DO NOTHING;

-- 6. 인덱스 생성 (성능 향상)
CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_priority ON tickets(priority);
CREATE INDEX IF NOT EXISTS idx_tickets_assignee_id ON tickets(assignee_id);
CREATE INDEX IF NOT EXISTS idx_tickets_reporter_id ON tickets(reporter_id);
CREATE INDEX IF NOT EXISTS idx_tickets_created_at ON tickets(created_at);

CREATE INDEX IF NOT EXISTS idx_documents_type ON documents(type);
CREATE INDEX IF NOT EXISTS idx_documents_is_starred ON documents(is_starred);
CREATE INDEX IF NOT EXISTS idx_documents_created_at ON documents(created_at);

CREATE INDEX IF NOT EXISTS idx_announcements_created_at ON announcements(created_at);
CREATE INDEX IF NOT EXISTS idx_announcements_is_pinned ON announcements(is_pinned);

CREATE INDEX IF NOT EXISTS idx_users_name ON users(name);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- 완료 메시지
SELECT 'RLS 정책 수정 및 테이블 설정 완료!' as message;

-- Dr Help Hub 데이터베이스 스키마
-- Supabase SQL Editor에서 실행하세요

-- 티켓 테이블
CREATE TABLE IF NOT EXISTS tickets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT '대기',
  priority VARCHAR(50) NOT NULL,
  assignee VARCHAR(100) NOT NULL,
  reporter VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  due_date DATE NOT NULL,
  comments_count INTEGER DEFAULT 0,
  category VARCHAR(100) NOT NULL
);

-- 문서 테이블
CREATE TABLE IF NOT EXISTS documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  size VARCHAR(20) NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  uploaded_by VARCHAR(100) NOT NULL,
  path TEXT NOT NULL
);

-- 공지사항 테이블
CREATE TABLE IF NOT EXISTS announcements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  author VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  priority VARCHAR(50) DEFAULT '일반',
  is_pinned BOOLEAN DEFAULT FALSE
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_priority ON tickets(priority);
CREATE INDEX IF NOT EXISTS idx_tickets_assignee ON tickets(assignee);
CREATE INDEX IF NOT EXISTS idx_tickets_created_at ON tickets(created_at);
CREATE INDEX IF NOT EXISTS idx_documents_type ON documents(type);
CREATE INDEX IF NOT EXISTS idx_documents_uploaded_at ON documents(uploaded_at);
CREATE INDEX IF NOT EXISTS idx_announcements_created_at ON announcements(created_at);
CREATE INDEX IF NOT EXISTS idx_announcements_is_pinned ON announcements(is_pinned);

-- RLS (Row Level Security) 정책 설정
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 읽기 가능하도록 설정 (개발 단계)
CREATE POLICY "Enable read access for all users" ON tickets FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON tickets FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON tickets FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON tickets FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON documents FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON documents FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON documents FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON documents FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON announcements FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON announcements FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON announcements FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON announcements FOR DELETE USING (true);

-- 샘플 데이터 삽입
INSERT INTO tickets (title, description, priority, assignee, reporter, due_date, category) VALUES
('시스템 로그인 오류', '사용자가 로그인할 수 없는 문제가 발생했습니다.', '높음', '김개발', '이사용자', CURRENT_DATE + INTERVAL '3 days', '버그'),
('새로운 기능 요청', '대시보드에 차트 기능을 추가해주세요.', '중간', '박디자인', '최기획', CURRENT_DATE + INTERVAL '7 days', '기능요청'),
('데이터베이스 성능 개선', '쿼리 속도가 느려서 최적화가 필요합니다.', '높음', '정DBA', '김팀장', CURRENT_DATE + INTERVAL '5 days', '개선');

INSERT INTO documents (name, type, size, uploaded_by, path) VALUES
('프로젝트 명세서.pdf', 'pdf', '2.5MB', '김기획', '/documents/project-spec.pdf'),
('API 문서.docx', 'doc', '1.2MB', '이개발', '/documents/api-docs.docx'),
('UI 디자인.png', 'image', '3.1MB', '박디자인', '/documents/ui-design.png');

INSERT INTO announcements (title, content, author, priority, is_pinned) VALUES
('시스템 점검 안내', '2024년 7월 20일 오전 2시부터 4시까지 시스템 점검이 있을 예정입니다.', '관리자', '중요', true),
('새로운 기능 출시', '티켓 관리 시스템에 새로운 필터 기능이 추가되었습니다.', '개발팀', '일반', false),
('보안 업데이트 완료', '보안 취약점 패치가 완료되었습니다.', '보안팀', '중요', false);

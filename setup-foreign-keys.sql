-- 외래 키 관계 설정 및 조인 테스트
-- Supabase SQL Editor에서 실행하세요

-- 1. 기존 외래 키 제약 조건 확인
SELECT 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
    AND tc.table_name IN ('tickets', 'documents');

-- 2. 외래 키 제약 조건이 없다면 추가
-- (이미 있을 수 있으므로 IF NOT EXISTS 사용)

-- tickets 테이블의 assignee_id 외래 키
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'tickets_assignee_id_fkey' 
        AND table_name = 'tickets'
    ) THEN
        ALTER TABLE tickets 
        ADD CONSTRAINT tickets_assignee_id_fkey 
        FOREIGN KEY (assignee_id) REFERENCES users(id);
    END IF;
END $$;

-- tickets 테이블의 reporter_id 외래 키
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'tickets_reporter_id_fkey' 
        AND table_name = 'tickets'
    ) THEN
        ALTER TABLE tickets 
        ADD CONSTRAINT tickets_reporter_id_fkey 
        FOREIGN KEY (reporter_id) REFERENCES users(id);
    END IF;
END $$;

-- 3. 조인 테스트 쿼리
-- 티켓과 사용자 정보를 함께 조회
SELECT 
    t.id,
    t.title,
    t.status,
    t.priority,
    t.category,
    t.due_date,
    t.created_at,
    assignee.name as assignee_name,
    assignee.email as assignee_email,
    reporter.name as reporter_name,
    reporter.email as reporter_email
FROM tickets t
LEFT JOIN users assignee ON t.assignee_id = assignee.id
LEFT JOIN users reporter ON t.reporter_id = reporter.id
ORDER BY t.created_at DESC;

-- 4. 기존 티켓의 사용자 ID 업데이트 (필요한 경우)
-- 기존 티켓에 유효한 사용자 ID 할당
UPDATE tickets 
SET 
    assignee_id = (SELECT id FROM users WHERE name = '김개발' LIMIT 1),
    reporter_id = (SELECT id FROM users WHERE name = '정관리자' LIMIT 1)
WHERE assignee_id IS NULL OR reporter_id IS NULL;

-- 5. 최종 확인
SELECT 'Foreign key setup completed!' as message;

-- 6. 조인된 티켓 데이터 확인
SELECT 
    t.title,
    assignee.name as assignee_name,
    reporter.name as reporter_name,
    t.status,
    t.created_at
FROM tickets t
LEFT JOIN users assignee ON t.assignee_id = assignee.id
LEFT JOIN users reporter ON t.reporter_id = reporter.id
ORDER BY t.created_at DESC
LIMIT 5;

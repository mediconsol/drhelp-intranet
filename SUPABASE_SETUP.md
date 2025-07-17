# Supabase 데이터베이스 연동 가이드

## 1. Supabase 프로젝트 생성

1. [Supabase](https://supabase.com)에 접속하여 계정을 생성하거나 로그인합니다.
2. "New Project" 버튼을 클릭하여 새 프로젝트를 생성합니다.
3. 프로젝트 이름을 입력하고 데이터베이스 비밀번호를 설정합니다.
4. 지역을 선택합니다 (한국의 경우 "Northeast Asia (Seoul)" 권장).

## 2. 데이터베이스 스키마 설정

1. Supabase 대시보드에서 "SQL Editor"로 이동합니다.
2. 프로젝트 루트의 `supabase-schema.sql` 파일 내용을 복사합니다.
3. SQL Editor에 붙여넣고 "Run" 버튼을 클릭하여 실행합니다.

이 스크립트는 다음을 생성합니다:
- `tickets` 테이블 (업무 티켓 관리)
- `documents` 테이블 (문서 관리)
- `announcements` 테이블 (공지사항 관리)
- 필요한 인덱스 및 RLS 정책
- 샘플 데이터

## 3. 환경 변수 설정

1. Supabase 대시보드에서 "Settings" > "API"로 이동합니다.
2. 다음 정보를 확인합니다:
   - **Project URL**: `https://your-project-ref.supabase.co`
   - **anon public key**: `eyJ...` (긴 JWT 토큰)

3. 프로젝트 루트의 `.env.local` 파일을 수정합니다:

```env
# Supabase 설정
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**주의**: 실제 값으로 교체해야 합니다!

## 4. 개발 서버 재시작

환경 변수를 설정한 후 개발 서버를 재시작합니다:

```bash
npm run dev
```

## 5. 연동 확인

1. 브라우저에서 `http://localhost:8080`에 접속합니다.
2. "업무 티켓" 페이지로 이동하여 샘플 데이터가 표시되는지 확인합니다.
3. 새 티켓을 생성해보고 데이터베이스에 저장되는지 확인합니다.
4. "문서 저장소" 페이지에서도 동일하게 확인합니다.

## 6. 문제 해결

### 연결 오류가 발생하는 경우:
1. `.env.local` 파일의 URL과 키가 정확한지 확인
2. Supabase 프로젝트가 활성 상태인지 확인
3. 브라우저 개발자 도구의 콘솔에서 오류 메시지 확인

### RLS 정책 오류가 발생하는 경우:
1. SQL Editor에서 RLS 정책이 올바르게 생성되었는지 확인
2. 필요시 정책을 비활성화하고 테스트:
```sql
ALTER TABLE tickets DISABLE ROW LEVEL SECURITY;
ALTER TABLE documents DISABLE ROW LEVEL SECURITY;
ALTER TABLE announcements DISABLE ROW LEVEL SECURITY;
```

## 7. 추가 기능

### 실시간 업데이트 (선택사항)
Supabase의 실시간 기능을 활용하여 데이터 변경사항을 실시간으로 반영할 수 있습니다:

```typescript
// 실시간 구독 예시
useEffect(() => {
  const subscription = supabase
    .channel('tickets')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'tickets' },
      (payload) => {
        console.log('Change received!', payload)
        // 데이터 새로고침
        refetch()
      }
    )
    .subscribe()

  return () => {
    subscription.unsubscribe()
  }
}, [])
```

### 파일 업로드 (선택사항)
Supabase Storage를 사용하여 실제 파일 업로드 기능을 구현할 수 있습니다.

## 8. 보안 고려사항

- 프로덕션 환경에서는 RLS 정책을 더 엄격하게 설정하세요.
- 사용자 인증을 구현하여 데이터 접근을 제한하세요.
- API 키를 안전하게 관리하세요 (환경 변수 사용).

## 완료!

이제 Dr Help Hub가 Supabase 데이터베이스와 연동되어 실제 데이터를 저장하고 관리할 수 있습니다! 🎉

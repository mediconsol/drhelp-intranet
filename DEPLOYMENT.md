# Dr Help Hub - Vercel 배포 가이드

## 🚀 Vercel 배포 단계

### 1. GitHub 저장소 준비
```bash
# Git 초기화 (아직 안했다면)
git init
git add .
git commit -m "Initial commit: Dr Help Hub Intranet"

# GitHub에 저장소 생성 후 연결
git remote add origin https://github.com/mediconsol/drhelp-intranet.git
git branch -M main
git push -u origin main
```

### 2. Vercel 계정 설정
1. [Vercel](https://vercel.com)에 GitHub 계정으로 로그인
2. "New Project" 클릭
3. GitHub 저장소 `mediconsol/drhelp-intranet` 선택

### 3. 프로젝트 설정
- **Project Name**: `drhelp-intranet`
- **Framework Preset**: `Vite`
- **Root Directory**: `./` (기본값)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### 4. 환경 변수 설정
Vercel Dashboard > Settings > Environment Variables에서 추가:

```
VITE_SUPABASE_URL = https://sjavsbnbtzzchjqggfpn.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNqYXZzYm5idHp6Y2hqcWdnZnBuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MTU0NjYsImV4cCI6MjA2ODI5MTQ2Nn0.IFN1tVWGK7R5Exh3lmSK-kb4N2XbwAC1fLkU_clN_DQ
```

### 5. Supabase 설정 업데이트
Supabase Dashboard > Authentication > URL Configuration에서 추가:
- **Site URL**: `https://drhelp-intranet.vercel.app`
- **Redirect URLs**: 
  - `https://drhelp-intranet.vercel.app/login`
  - `https://drhelp-intranet.vercel.app/signup`
  - `https://drhelp-intranet.vercel.app/reset-password`

## 🔧 배포 후 확인사항

### 1. 기능 테스트
- [ ] 회원가입/로그인
- [ ] 티켓 생성/조회
- [ ] 문서 업로드/조회
- [ ] 공지사항 관리
- [ ] 사용자 인증 플로우

### 2. 성능 최적화
- [ ] 이미지 최적화
- [ ] 번들 크기 확인
- [ ] 로딩 속도 측정

### 3. 보안 설정
- [ ] HTTPS 강제 적용
- [ ] CSP 헤더 설정
- [ ] 환경 변수 보안

## 📱 접속 정보

### 배포 URL
- **Production**: https://drhelp-intranet.vercel.app
- **Preview**: 각 PR마다 자동 생성

### 관리자 계정 (테스트용)
- **이메일**: admin@mediconsol.com
- **비밀번호**: (Supabase에서 설정)

## 🔄 자동 배포 설정

### GitHub Actions (선택사항)
```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install Vercel CLI
        run: npm install --global vercel@latest
      - name: Pull Vercel Environment Information
        run: vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}
      - name: Build Project Artifacts
        run: vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}
      - name: Deploy Project Artifacts to Vercel
        run: vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }}
```

## 🛠️ 문제 해결

### 빌드 오류
```bash
# 로컬에서 빌드 테스트
npm run build

# 타입 체크
npm run type-check
```

### 환경 변수 오류
- Vercel Dashboard에서 환경 변수 재확인
- 재배포 트리거: `vercel --prod`

### Supabase 연결 오류
- URL 설정 확인
- CORS 설정 확인
- RLS 정책 확인

## 📊 모니터링

### Vercel Analytics
- 페이지 뷰 추적
- 성능 메트릭
- 사용자 행동 분석

### 로그 확인
```bash
# Vercel CLI로 로그 확인
vercel logs drhelp-intranet
```

## 🚀 배포 완료!

배포가 완료되면 다음 URL에서 접속 가능합니다:
**https://drhelp-intranet.vercel.app**

팀원들과 공유하여 실제 환경에서 테스트해보세요!

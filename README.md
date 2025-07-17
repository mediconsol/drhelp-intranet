# Dr Help Hub - 의료진 업무 관리 시스템

> 의료진을 위한 통합 업무 관리 인트라넷 시스템

## 🌐 배포 정보

- **Production**: https://drhelp-intranet.vercel.app
- **Development**: http://localhost:8080
- **Lovable Project**: https://lovable.dev/projects/d2e7d463-70e0-424d-9cdf-b18ee229c357

## 🚀 주요 기능

- **🎫 업무 티켓 관리**: 업무 요청, 진행 상황 추적
- **📄 문서 저장소**: 파일 업로드, 관리, 공유
- **📅 일정 관리**: 팀 일정 및 개인 스케줄
- **📢 공지사항**: 중요 알림 및 공지사항 관리
- **👥 사용자 인증**: 회원가입, 로그인, 권한 관리

## 🛠️ 기술 스택

- **Frontend**: React 18, TypeScript, Vite
- **UI**: Tailwind CSS, shadcn/ui
- **Backend**: Supabase (Database, Auth, Storage)
- **Deployment**: Vercel
- **State Management**: React Query

## 🏃‍♂️ 빠른 시작

### 로컬 개발 환경 설정

```bash
# 저장소 클론
git clone https://github.com/mediconsol/drhelp-intranet.git
cd drhelp-intranet

# 의존성 설치
npm install

# 환경 변수 설정
cp .env.local.example .env.local
# .env.local 파일에 Supabase 정보 입력

# 개발 서버 시작
npm run dev
```

### 배포

```bash
# Vercel에 배포
npm run deploy

# 미리보기 배포
npm run deploy:preview
```

## 📝 개발 가이드

### 코드 편집 방법

**Lovable 사용**
- [Lovable Project](https://lovable.dev/projects/d2e7d463-70e0-424d-9cdf-b18ee229c357)에서 AI로 코드 편집
- 변경사항은 자동으로 이 저장소에 커밋됩니다

**로컬 IDE 사용**
- 선호하는 IDE로 로컬에서 개발
- 변경사항을 푸시하면 Lovable에도 반영됩니다

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/d2e7d463-70e0-424d-9cdf-b18ee229c357) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

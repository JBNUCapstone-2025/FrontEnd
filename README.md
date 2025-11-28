# 감정 일기 서비스 - Frontend

React와 Vite를 기반으로 한 감정 일기 작성 및 AI 추천 서비스의 프론트엔드 애플리케이션입니다.

## 프로젝트 소개

사용자의 감정을 기록하고, AI 기반 추천 시스템을 통해 도서, 음악, 음식을 추천받을 수 있는 감정 일기 플랫폼입니다. 사용자는 자신의 감정을 캐릭터와 함께 기록하고, 커뮤니티에서 다른 사용자들과 소통하며, 챌린지를 통해 일기 작성 습관을 형성할 수 있습니다.

## 주요 기능

### 1. 사용자 인증
- 로그인 / 회원가입
- 프로필 관리
- 캐릭터 선택 및 커스터마이징

### 2. 감정 일기 작성
- 일기 작성 및 수정
- 감정 선택 (기쁨, 슬픔, 분노, 불안, 설렘, 보통)
- 캘린더 뷰로 일기 관리
- 일기별 감정 시각화

### 3. AI 기반 추천 시스템
- 감정 분석 기반 맞춤형 추천
- 카테고리별 추천:
  - **도서**: 제목, 저자, 출판사, 표지 이미지, 상세 링크
  - **음악**: 제목, 아티스트, 앨범, 장르, DJ 태그, 앨범 커버
  - **음식**: 식당명, 메뉴, 위치, 영업시간, 평점, 이미지
- 추천 저장 및 관리

### 4. 챗봇
- AI 챗봇과 대화
- 감정 상담 및 조언
- 대화 기록 저장

### 5. 커뮤니티
- 게시글 작성 및 조회
- 댓글 시스템
- 게시글 검색
- 좋아요 기능

### 6. 챌린지 시스템
- 일기 작성 챌린지
- 챌린지 참여 및 관리
- 챌린지 지도 보기

### 7. 상점
- 캐릭터 아이템 구매
- 포인트 시스템

## 기술 스택

### Core
- **React** 19.1.1 - UI 라이브러리
- **Vite** 7.1.6 - 빌드 도구 및 개발 서버
- **React Router DOM** 7.9.1 - 라우팅

### 스타일링
- **Styled Components** 6.1.19 - CSS-in-JS
- **React Icons** 5.5.0 - 아이콘

### API & 상태 관리
- **Axios** 1.12.2 - HTTP 클라이언트
- **LocalStorage** - 사용자 정보 및 토큰 관리

### 개발 도구
- **ESLint** - 코드 품질 관리
- **Concurrently** - 멀티 프로세스 실행

## 프로젝트 구조

```
capstone_front/
├── src/
│   ├── api/                    # API 호출 함수
│   │   └── challengeApi.js
│   ├── approutes/              # 라우팅 설정
│   │   └── AppRoutes.jsx
│   ├── components/             # 재사용 가능한 컴포넌트
│   │   ├── Character.jsx       # 캐릭터 선택
│   │   ├── Chatcontent.jsx     # 챗봇 UI
│   │   ├── ClassModal.jsx      # 분류 모달
│   │   ├── DiaryContent.jsx    # 일기 캘린더
│   │   ├── DiaryDetailModal.jsx # 일기 상세 모달
│   │   ├── RecommendationModal.jsx # 추천 모달
│   │   ├── CommunityList.jsx   # 커뮤니티 목록
│   │   ├── CommunityPost.jsx   # 게시글 작성
│   │   ├── CommunityContent.jsx # 게시글 상세
│   │   ├── CommunitySearch.jsx # 게시글 검색
│   │   ├── ChallengeContent.jsx # 챌린지 상세
│   │   ├── ChallengeWrite.jsx  # 챌린지 작성
│   │   ├── Header.jsx          # 헤더
│   │   ├── IntroAnimation.jsx  # 인트로 애니메이션
│   │   ├── Loading.jsx         # 로딩 컴포넌트
│   │   └── Modal.jsx           # 기본 모달
│   ├── pages/                  # 페이지 컴포넌트
│   │   ├── Main.jsx            # 메인 페이지
│   │   ├── Login.jsx           # 로그인
│   │   ├── Join.jsx            # 회원가입
│   │   ├── Diary.jsx           # 일기 작성/수정
│   │   ├── Chat.jsx            # 챗봇
│   │   ├── Community.jsx       # 커뮤니티
│   │   ├── Challenge.jsx       # 챌린지 지도
│   │   ├── Profile.jsx         # 프로필
│   │   ├── Mypage.jsx          # 마이페이지
│   │   └── Shop.jsx            # 상점
│   ├── styles/                 # 스타일 설정
│   │   └── colors.jsx          # 색상 팔레트
│   ├── img/                    # 이미지 리소스
│   ├── icon/                   # 아이콘 리소스
│   ├── App.jsx                 # 메인 앱 컴포넌트
│   └── main.jsx                # 엔트리 포인트
├── vite.config.js              # Vite 설정
└── package.json                # 프로젝트 메타데이터
```

## 설치 및 실행

### 사전 요구사항
- Node.js (권장: 18.x 이상)
- npm 또는 yarn

### 설치

```bash
npm install
```

### 개발 서버 실행

```bash
# 프론트엔드만 실행
npm run dev

# 프론트엔드 + Validation 서버 동시 실행
npm run dev:all
```

### 빌드

```bash
npm run build
```

### 프리뷰

```bash
npm run preview
```

## 환경 변수

`.env` 파일을 생성하여 다음 환경 변수를 설정하세요:

```env
VITE_API_BASE_URL=http://your-api-server-url
```

## API 프록시 설정

개발 환경에서는 Vite의 프록시 기능을 사용하여 CORS 문제를 해결합니다.
`vite.config.js`에서 다음 엔드포인트를 프록시합니다:

- `/auth` - 인증 관련 API
- `/user` - 사용자 관련 API
- `/diary` - 일기 관련 API
- `/chat` - 챗봇 관련 API
- `/community/board` - 커뮤니티 게시판 API
- `/community/comment` - 댓글 API
- `/challenge` - 챌린지 API
- `/validate` - 검증 서버 API
- `/extract-moments` - 감정 추출 API

## 주요 컴포넌트 설명

### DiaryContent
- 캘린더 형식으로 일기 목록을 표시
- 날짜별 감정 캐릭터 아이콘 표시
- 일기 작성/수정/조회 기능

### RecommendationModal
- AI 추천 결과를 카테고리별로 표시
- 도서, 음악, 음식 추천 정보 제공
- 추천 저장 기능

### DiaryDetailModal
- 일기 상세 내용 조회
- 저장된 추천 내용 표시
- 감정별 색상 구분

### Chatcontent
- AI 챗봇과의 대화 인터페이스
- 메시지 송수신 및 표시
- 대화 기록 관리

## 감정 분류 및 색상

| 감정 | 색상 | 캐릭터 |
|------|------|--------|
| 기쁨 | 노란색 (#f5e796) | 강아지 |
| 슬픔 | 파란색 (#86bbf9) | 햄스터 |
| 분노 | 빨간색 (#fb7a6c) | 고양이 |
| 불안 | 보라색 (#c589dd) | 토끼 |
| 설렘 | 분홍색 (#e97bb2) | 라쿤 |
| 보통 | 회색 (#95A5A6) | 곰 |

## 라우트 구조

| 경로 | 컴포넌트 | 설명 |
|------|----------|------|
| `/` | Redirect → `/login` | 루트 경로 리다이렉트 |
| `/login` | Login | 로그인 페이지 |
| `/join` | Join | 회원가입 페이지 |
| `/main` | Main | 메인 페이지 |
| `/diary/write` | Diary | 일기 작성/수정 |
| `/chat` | Chat | AI 챗봇 |
| `/mypage` | Mypage | 마이페이지 |
| `/profile` | Profile | 프로필 설정 |
| `/shop` | Shop | 아이템 상점 |
| `/board` | Community | 커뮤니티 메인 |
| `/board/list` | CommunityList | 게시글 목록 |
| `/board/post` | CommunityPost | 게시글 작성 |
| `/board/content/:boardId` | CommunityContent | 게시글 상세 |
| `/board/search` | CommunitySearch | 게시글 검색 |
| `/challenge/map` | Challenge | 챌린지 지도 |
| `/challenge/content` | ChallengeContent | 챌린지 상세 |
| `/challenge/write` | ChallengeWrite | 챌린지 작성 |

## 주요 의존성

### 프로덕션
- `axios` - API 통신
- `react-router-dom` - 라우팅
- `styled-components` - 스타일링
- `react-icons` - 아이콘

### 개발
- `vite` - 빌드 도구
- `eslint` - 코드 품질
- `concurrently` - 동시 실행

## 브라우저 지원

- Chrome (최신 버전)
- Firefox (최신 버전)
- Safari (최신 버전)
- Edge (최신 버전)

## 라이선스

이 프로젝트는 비공개 프로젝트입니다.

## 팀 정보

Capstone 프로젝트 - 감정 일기 서비스

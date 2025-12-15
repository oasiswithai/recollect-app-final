# Task List: Recollect MVP - AI-Powered Knowledge Card Management

## Core vs Good-to-have Classification

### 🔴 Core Features (MVP - Must Have)
These features are essential for the minimum viable product and must be implemented first:
- **FR1**: 데이터 수집 기능 (웹 업로드)
- **FR2**: AI 기반 지식 카드 생성 (자동 태깅 & 분석)
- **FR3**: 지식 카드 뷰어 & 검색 (Masonry 레이아웃 + 필터 탭)
- **FR5**: 반응형 UI 최적화 (기본)

### 🟡 Good-to-have Features (Phase 2)
These features enhance the product but can be added after MVP:
- **FR4**: AI 기반 콜렉션 카드 자동 생성
- **Browser Extension** (데이터 수집 확장)
- **Advanced AI Features** (패턴 학습, 맞춤 추천)

---

## Relevant Files

> 📝 **Note**: 실제 프로젝트 구조에 따라 경로가 변경될 수 있습니다. Next.js App Router 구조를 가정합니다.

### Frontend Components
- `app/page.tsx` - 메인 페이지 (Masonry 레이아웃)
- `components/cards/Card.tsx` - 개별 지식 카드 컴포넌트
- `components/cards/CollectionCard.tsx` - 콜렉션 카드 컴포넌트
- `components/layout/FilterTabBar.tsx` - 상단 필터 탭/칩 바
- `components/layout/SearchBar.tsx` - 검색창 컴포넌트
- `components/upload/UploadZone.tsx` - 드래그앤드롭 업로드 영역
- `components/modals/CardDetailModal.tsx` - 카드 세부 정보 모달
- `components/layout/MasonryGrid.tsx` - Masonry 레이아웃 래퍼

### API Routes
- `app/api/cards/route.ts` - 카드 CRUD API
- `app/api/cards/[id]/route.ts` - 개별 카드 API
- `app/api/upload/route.ts` - 파일 업로드 API
- `app/api/ai/analyze/route.ts` - AI 분석 API
- `app/api/ai/tags/route.ts` - AI 태그 생성 API
- `app/api/collections/route.ts` - 콜렉션 API
- `app/api/search/route.ts` - 검색 API

### State Management
- `store/cardStore.ts` - 카드 상태 관리 (Zustand)
- `store/filterStore.ts` - 필터 상태 관리
- `store/uiStore.ts` - UI 상태 관리 (테마, 모달 등)

### Utilities & Lib
- `lib/ai/analyzer.ts` - AI 분석 로직
- `lib/ai/tagger.ts` - AI 태깅 로직
- `lib/ai/ocr.ts` - OCR 처리
- `lib/metadata/extractor.ts` - 메타데이터 추출
- `lib/storage/uploader.ts` - 파일 스토리지 업로드
- `lib/db/queries.ts` - 데이터베이스 쿼리 함수

### Database Schema
- `prisma/schema.prisma` - Prisma 스키마 정의
- `prisma/migrations/` - 마이그레이션 파일

### Styles
- `app/globals.css` - 전역 스타일
- `tailwind.config.ts` - Tailwind 설정 (다크 모드)

### Tests
- `__tests__/components/Card.test.tsx` - 카드 컴포넌트 테스트
- `__tests__/api/cards.test.ts` - 카드 API 테스트
- `__tests__/lib/ai/analyzer.test.ts` - AI 분석 테스트

### Notes
- Unit tests should typically be placed alongside the code files they are testing or in `__tests__/` directory
- Use `npm test` to run all tests

---

## Instructions for Completing Tasks

**IMPORTANT:** As you complete each task, you must check it off in this markdown file by changing `- [ ]` to `- [x]`. This helps track progress and ensures you don't skip any steps.

Example:
- `- [ ] 1.1 Read file` → `- [x] 1.1 Read file` (after completing)

Update the file after completing each sub-task, not just after completing an entire parent task.

---

## Tasks

### 🔴 CORE FEATURES (MVP)

- [ ] 0.0 **Create feature branch**
  - [ ] 0.1 Create and checkout a new branch (e.g., `git checkout -b feature/recollect-mvp`)

- [ ] 1.0 **Project Setup & Infrastructure (Core)**
  - [ ] 1.1 Initialize Next.js 14 project with TypeScript and App Router
  - [ ] 1.2 Install and configure Tailwind CSS with dark mode support
  - [ ] 1.3 Set up Prisma ORM and PostgreSQL connection
  - [ ] 1.4 Install and configure Zustand for state management
  - [ ] 1.5 Set up environment variables (.env.local) for API keys and database
  - [ ] 1.6 Configure ESLint and Prettier
  - [ ] 1.7 Set up basic folder structure (components, lib, store, app)
  - [ ] 1.8 Install necessary dependencies (react-masonry-css, AI SDK, etc.)

- [ ] 2.0 **Database Schema & Models (Core)**
  - [ ] 2.1 Design Prisma schema for Card model (id, title, content, summary, imageUrl, sourceUrl, tags, metadata, createdAt, updatedAt)
  - [ ] 2.2 Design Prisma schema for Tag model (id, name, frequency, lastUsed)
  - [ ] 2.3 Design Prisma schema for CardTag relation (many-to-many)
  - [ ] 2.4 Add User model for future authentication (optional for MVP)
  - [ ] 2.5 Run Prisma migration to create database tables
  - [ ] 2.6 Create seed data for testing (optional)
  - [ ] 2.7 Create database query helper functions in `lib/db/queries.ts`

- [ ] 3.0 **File Upload & Storage (Core - FR1)**
  - [ ] 3.1 Set up cloud storage (AWS S3 or Cloudinary) account and credentials
  - [ ] 3.2 Create `lib/storage/uploader.ts` for file upload logic
  - [ ] 3.3 Create API route `/api/upload` for handling file uploads
  - [ ] 3.4 Implement image optimization and compression before upload
  - [ ] 3.5 Create `UploadZone` component with drag-and-drop functionality
  - [ ] 3.6 Add file type validation (images, links, text)
  - [ ] 3.7 Add upload progress indicator
  - [ ] 3.8 Handle URL input for link uploads
  - [ ] 3.9 Test upload functionality with various file types

- [ ] 4.0 **AI Integration - Basic Analysis (Core - FR2)**
  - [ ] 4.1 Set up AI API (OpenAI GPT-4 or Anthropic Claude) credentials
  - [ ] 4.2 Create `lib/ai/analyzer.ts` for content analysis logic
  - [ ] 4.3 Implement OCR for images using Tesseract.js or Google Cloud Vision API
  - [ ] 4.4 Create `lib/ai/tagger.ts` for automatic tag generation
  - [ ] 4.5 Implement headline/title generation from content
  - [ ] 4.6 Implement content summarization (2-3 sentences)
  - [ ] 4.7 Create `lib/metadata/extractor.ts` for extracting URL metadata (Open Graph)
  - [ ] 4.8 Create API route `/api/ai/analyze` for AI analysis
  - [ ] 4.9 Create API route `/api/ai/tags` for tag generation
  - [ ] 4.10 Add error handling and fallback for AI failures
  - [ ] 4.11 Test AI analysis with sample images and links

- [ ] 5.0 **Knowledge Card Component (Core - FR2, FR3)**
  - [ ] 5.1 Create base `Card.tsx` component with thumbnail, title, summary, tags
  - [ ] 5.2 Style card with Tailwind CSS (light/dark mode compatible)
  - [ ] 5.3 Add hover effects and animations
  - [ ] 5.4 Implement tag chips display at bottom of card
  - [ ] 5.5 Add metadata display (date, source icon)
  - [ ] 5.6 Make card height flexible for Masonry layout
  - [ ] 5.7 Add click handler to open detail modal
  - [ ] 5.8 Add loading skeleton state for cards
  - [ ] 5.9 Create API route `/api/cards` for CRUD operations
  - [ ] 5.10 Create API route `/api/cards/[id]` for individual card operations
  - [ ] 5.11 Test card rendering with various content types

- [ ] 6.0 **Masonry Layout Implementation (Core - FR3)**
  - [ ] 6.1 Install and configure `react-masonry-css` library
  - [ ] 6.2 Create `MasonryGrid.tsx` wrapper component
  - [ ] 6.3 Implement responsive breakpoints (mobile: 1-2 columns, desktop: 3-4 columns)
  - [ ] 6.4 Add infinite scroll functionality using Intersection Observer API
  - [ ] 6.5 Implement lazy loading for images
  - [ ] 6.6 Update main `app/page.tsx` to use MasonryGrid
  - [ ] 6.7 Add empty state when no cards exist
  - [ ] 6.8 Test layout responsiveness on different screen sizes
  - [ ] 6.9 Optimize performance for large numbers of cards (virtualization if needed)

- [ ] 7.0 **Filter Tab Bar (Core - FR3)**
  - [ ] 7.1 Create `FilterTabBar.tsx` component
  - [ ] 7.2 Create `filterStore.ts` in Zustand for filter state
  - [ ] 7.3 Fetch frequently used tags from database
  - [ ] 7.4 Fetch recently used tags
  - [ ] 7.5 Implement horizontal scrollable tag chip list
  - [ ] 7.6 Style active/inactive tag chips
  - [ ] 7.7 Implement tag click handler to filter cards
  - [ ] 7.8 Make filter bar sticky on scroll (position: sticky)
  - [ ] 7.9 Add "Clear filters" button
  - [ ] 7.10 Integrate filter bar with main page card list
  - [ ] 7.11 Test filtering functionality with multiple tags

- [ ] 8.0 **Search Functionality (Core - FR3)**
  - [ ] 8.1 Create `SearchBar.tsx` component
  - [ ] 8.2 Create API route `/api/search` for search queries
  - [ ] 8.3 Implement full-text search in database (Prisma search or PostgreSQL full-text search)
  - [ ] 8.4 Add search debouncing (300ms delay)
  - [ ] 8.5 Implement autocomplete suggestions based on tags and titles
  - [ ] 8.6 Add search history (store in localStorage)
  - [ ] 8.7 Implement relevance sorting for search results
  - [ ] 8.8 Add search filters dropdown (by date, source, tag)
  - [ ] 8.9 Display search result count
  - [ ] 8.10 Add "No results" state with suggestions
  - [ ] 8.11 Test search with various keywords and filters

- [ ] 9.0 **Card Detail Modal (Core - FR3)**
  - [ ] 9.1 Create `CardDetailModal.tsx` component
  - [ ] 9.2 Implement modal open/close animations
  - [ ] 9.3 Display full card information (image, title, summary, tags, metadata)
  - [ ] 9.4 Add "Edit" functionality for title, tags, and summary
  - [ ] 9.5 Add "Delete" card functionality with confirmation
  - [ ] 9.6 Implement "Related Cards" section using vector similarity search
  - [ ] 9.7 Set up vector database (Pinecone or Weaviate) for similarity search
  - [ ] 9.8 Generate embeddings for card content using AI
  - [ ] 9.9 Create API route `/api/cards/[id]/related` for finding similar cards
  - [ ] 9.10 Display 3-6 related cards in a horizontal scroll
  - [ ] 9.11 Add keyboard shortcuts (ESC to close, arrow keys for navigation)
  - [ ] 9.12 Make modal responsive (full screen on mobile, centered on desktop)
  - [ ] 9.13 Test modal functionality and related cards display

- [ ] 10.0 **Responsive UI & Dark Mode (Core - FR5)**
  - [ ] 10.1 Configure Tailwind dark mode (class strategy)
  - [ ] 10.2 Create theme toggle component in header
  - [ ] 10.3 Implement system preference detection (prefers-color-scheme)
  - [ ] 10.4 Store theme preference in localStorage
  - [ ] 10.5 Apply dark mode styles to all components (Card, Modal, FilterBar, etc.)
  - [ ] 10.6 Test mobile responsiveness (320px - 768px)
  - [ ] 10.7 Test tablet responsiveness (768px - 1024px)
  - [ ] 10.8 Test desktop responsiveness (1024px+)
  - [ ] 10.9 Ensure filter tab bar is sticky on mobile
  - [ ] 10.10 Test touch interactions on mobile devices
  - [ ] 10.11 Optimize font sizes and spacing for different screen sizes

### 🟡 GOOD-TO-HAVE FEATURES (Phase 2)

- [ ] 11.0 **AI Collection Auto-generation (Good-to-have - FR4)**
  - [ ] 11.1 Create Collection model in Prisma schema
  - [ ] 11.2 Implement tag-based collection algorithm
  - [ ] 11.3 Implement topic-based collection using AI clustering
  - [ ] 11.4 Implement time-based collection (recent, this week, etc.)
  - [ ] 11.5 Create API route `/api/collections` for collection CRUD
  - [ ] 11.6 Create collection suggestion notification system
  - [ ] 11.7 Implement accept/reject/modify collection actions
  - [ ] 11.8 Track user's tag combination patterns
  - [ ] 11.9 Generate personalized collection suggestions based on patterns

- [ ] 12.0 **Collection Card Component (Good-to-have - FR4)**
  - [ ] 12.1 Create `CollectionCard.tsx` component
  - [ ] 12.2 Display collection preview with grid of card thumbnails (2x2 or 3x3)
  - [ ] 12.3 Show collection title, card count, and main tags
  - [ ] 12.4 Style collection card to differentiate from regular cards
  - [ ] 12.5 Implement click handler to view collection detail
  - [ ] 12.6 Mix collection cards with regular cards in Masonry layout
  - [ ] 12.7 Add collection-specific icons or badges

- [ ] 13.0 **Advanced AI - Pattern Learning (Good-to-have)**
  - [ ] 13.1 Track user search queries and click patterns
  - [ ] 13.2 Implement recommendation algorithm based on user behavior
  - [ ] 13.3 Create personalized tag recommendations
  - [ ] 13.4 Add "For You" section on main page
  - [ ] 13.5 Implement A/B testing for recommendation algorithms
  - [ ] 13.6 Add analytics tracking for AI recommendation accuracy

- [ ] 14.0 **Browser Extension (Good-to-have)**
  - [ ] 14.1 Create Chrome extension manifest.json (Manifest V3)
  - [ ] 14.2 Implement screenshot capture functionality
  - [ ] 14.3 Implement current page capture (URL + screenshot)
  - [ ] 14.4 Implement selected area capture
  - [ ] 14.5 Create popup UI for quick save
  - [ ] 14.6 Integrate with main app API for card creation
  - [ ] 14.7 Add authentication flow for extension
  - [ ] 14.8 Test extension on various websites
  - [ ] 14.9 Publish extension to Chrome Web Store

- [ ] 15.0 **Performance Optimization (Good-to-have)**
  - [ ] 15.1 Implement image lazy loading with blur placeholder
  - [ ] 15.2 Add CDN for static assets
  - [ ] 15.3 Implement Redis caching for search results and tags
  - [ ] 15.4 Optimize database queries with proper indexing
  - [ ] 15.5 Implement virtual scrolling for large card lists (if needed)
  - [ ] 15.6 Add service worker for offline support (optional)
  - [ ] 15.7 Run Lighthouse performance audit and fix issues
  - [ ] 15.8 Optimize bundle size (code splitting, tree shaking)
  - [ ] 15.9 Add loading states and skeleton screens throughout app
  - [ ] 15.10 Monitor and optimize AI API response times

---

## Summary

**Total Tasks**: 16 parent tasks
- **Core (MVP)**: 11 tasks (0.0 - 10.0) → **124 sub-tasks**
- **Good-to-have**: 5 tasks (11.0 - 15.0) → **36 sub-tasks**
- **Grand Total**: **160 sub-tasks**

**Estimated Timeline** (Core MVP): 1-2 weeks for a small team of 2-3 developers

### Task Breakdown by Effort
- **Setup & Infrastructure** (0.0-2.0): ~10-15 hours
- **Backend & API** (3.0-4.0): ~20-25 hours
- **Frontend Components** (5.0-7.0): ~25-30 hours
- **Features** (8.0-10.0): ~20-25 hours
- **Total Core MVP**: ~75-95 hours

---

## Next Steps

1. ✅ Review parent tasks and ensure they align with PRD requirements
2. ✅ Sub-tasks have been generated for all parent tasks
3. ⏭️ Begin implementation starting with task 0.0
4. ⏭️ Check off each sub-task as completed by changing `- [ ]` to `- [x]`

---

**🚀 Ready to start implementation! Begin with task 0.0: Create feature branch**

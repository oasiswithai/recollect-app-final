# Build Steps / Task List - Recollect

Based on `documents/prd-recollect.md`.

## Phase 1: Foundation & Setup (Core)
- [ ] **Project Initialization**
    - [ ] Initialize Next.js project with TypeScript
    - [ ] Setup Tailwind CSS & Global Styles
    - [ ] Configure Dark/Light mode support
    - [ ] Setup State Management (Zustand)
- [ ] **UI Component Setup**
    - [ ] Implement foundational UI components (Button, Input, Card container)
    - [ ] Setup Icons (lucide-react or similar)

## Phase 2: Core UI Layout (Core)
- [ ] **Main Layout**
    - [ ] Implement Responsive Header
    - [ ] Implement Filter Tab Bar (Sticky, Horizontal scroll)
- [ ] **Masonry Grid**
    - [ ] Implement Masonry Layout (using `react-masonry-css` etc.)
    - [ ] Create Basic Card Component Architecture

## Phase 3: Data Input & Processing (Core - FR1)
- [ ] **Upload Mechanism**
    - [ ] Implement Drag & Drop Zone
    - [ ] Implement File Selection (Link, Image, Text)
- [ ] **Data Processing**
    - [ ] Implement Metadata Extraction service (URL title, description)
    - [ ] Setup Content Storage simulation (or real integration)

## Phase 4: AI Analysis Integration (Core - FR2)
- [ ] **AI Service Setup**
    - [ ] Configure LLM Client (OpenAI/Claude)
    - [ ] Implement Text Summarization
    - [ ] Implement Auto-Tagging logic
- [ ] **Image Analysis**
    - [ ] Implement OCR / Image Description

## Phase 5: Viewer & Interaction (Core - FR3)
- [ ] **Card Details**
    - [ ] Implement Detail Modal/Panel
    - [ ] Show AI Summary & Tags
- [ ] **Search & Filter**
    - [ ] Implement Keyword Search
    - [ ] Implement Tag Filtering (Immediate update on click)

## Phase 6: Good-to-have Features (Post-MVP)
- [ ] **Advanced Organization (FR4)**
    - [ ] Implement AI Auto-Collection generation
    - [ ] Create Collection Card UI
- [ ] **Enhanced Discovery**
    - [ ] Implement "Similar Cards" connection suggestions
    - [ ] Implement Search Pattern Learning
- [ ] **Extensions**
    - [ ] Browser Extension POC

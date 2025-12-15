# Build Steps / Task List - Recollect

Based on `documents/prd-recollect.md`.

## Phase 1: Foundation & Setup (Core)
- [x] **Project Initialization**
    - [x] Initialize Next.js project with TypeScript
    - [x] Setup Tailwind CSS & Global Styles
    - [x] Configure Dark/Light mode support
    - [x] Setup State Management (Zustand)
- [x] **UI Component Setup**
    - [x] Implement foundational UI components (Button, Input, Card container)
    - [x] Setup Icons (lucide-react or similar)

## Phase 2: Core UI Layout (Core)
- [x] **Main Layout**
    - [x] Implement Responsive Header
    - [x] Implement Filter Tab Bar (Sticky, Horizontal scroll)
- [x] **Masonry Grid**
    - [x] Implement Masonry Layout (using `react-masonry-css` etc.)
    - [x] Create Basic Card Component Architecture

## Phase 3: Data Input & Processing (Core - FR1)
- [x] **Upload Mechanism**
    - [x] Implement Drag & Drop Zone
    - [x] Implement File Selection (Link, Image, Text)
- [x] **Data Processing**
    - [x] Implement Metadata Extraction service (URL title, description)
    - [x] Setup Content Storage simulation (or real integration)

## Phase 4: AI Analysis Integration (Core - FR2)
- [x] **AI Service Setup**
    - [x] Configure LLM Client (OpenAI/Claude)
    - [x] Implement Text Summarization
    - [x] Implement Auto-Tagging logic
- [x] **Image Analysis**
    - [x] Implement OCR / Image Description

## Phase 5: Viewer & Interaction (Core - FR3)
- [x] **Card Details**
    - [x] Implement Detail Modal/Panel
    - [x] Show AI Summary & Tags
    - [x] Smart Visual Crop (Focal Point)
    - [x] Aesthetic Covers for Text-Heavy content
- [ ] **Search & Filter**
    - [/] Implement Keyword Search
    - [/] Implement Tag Filtering (Immediate update on click)

## Phase 6: Good-to-have Features (Post-MVP)
- [ ] **Advanced Organization (FR4)**
    - [ ] Implement AI Auto-Collection generation
    - [ ] Create Collection Card UI
- [ ] **Enhanced Discovery**
    - [ ] Implement "Similar Cards" connection suggestions
    - [ ] Implement Search Pattern Learning
- [ ] **Extensions**
    - [ ] Browser Extension POC

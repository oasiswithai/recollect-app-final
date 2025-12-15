import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface IdeaCardType {
    id: string;
    title: string;
    summary: string;
    imageUrl?: string; // Cover image (abstract/aesthetic)
    contentImageUrl?: string; // Actual uploaded image (screenshot/text)
    visualFocalPoint?: { x: number; y: number }; // Smart crop coordinates (0-100)
    tags: string[];
    isFavorite?: boolean;
    isSecret?: boolean; // New: Locked card flag
    createdAt: Date;
}

interface AppState {
    cards: IdeaCardType[];
    collections: string[];
    addCard: (card: Omit<IdeaCardType, 'id' | 'createdAt'>) => void;
    deleteCard: (id: string) => void;
    toggleFavorite: (id: string) => void;
    setCollections: (collections: string[]) => void;
}

// Initial Dummy Data
const DUMMY_CARDS: IdeaCardType[] = Array.from({ length: 20 }).map((_, i) => ({
    id: `card-${i}`,
    title: [
        "Modern Interior Design Trends 2024",
        "The Future of AI in Web Development",
        "Minimalist Architecture",
        "Healthy Meal Prep Ideas",
        "Typography Inspiration",
        "Sustainable Fashion Guide",
        "React Performance Optimization",
        "Photography Composition Rules",
        "UX Case Study: Finance App",
        "Creative Writing Prompts",
        "Generative AI Tools"
    ][i % 11],
    summary: [
        "Explore the latest trends in interior design focusing on sustainable materials and biophilic elements.",
        "How artificial intelligence is reshaping the landscape of frontend development and what it means for engineers.",
        "A look into the clean lines and functional spaces of modern minimalist homes.",
        "Save time and eat healthier with these 5 easy meal prep recipes for the week.",
        "Collection of beautiful serif and sans-serif font pairings for your next project.",
        "Why eco-friendly fabrics are taking over the fashion industry.",
        "Tips and tricks to make your React applications faster and smoother.",
        "Rule of thirds, leading lines, and framing techniques to improve your shots.",
        "A deep dive into the user experience design of a modern fintech mobile application.",
        "Beat writer's block with these 50 creative writing prompts.",
        "A comprehensive guide to the best generative AI tools for text, image, and video creation in 2024."
    ][i % 11],
    imageUrl: [
        "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80",
        "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
        "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80",
        "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80",
        "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80",
        "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80",
        "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
        "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80",
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
        "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80",
        "https://images.unsplash.com/photo-1675271591211-126ad94e495d?w=800&q=80"
    ][i % 11],
    isFavorite: false,
    tags: [
        ["Interior", "Design", "Home"],
        ["Tech", "AI", "Code"],
        ["Arch", "Minimalism"],
        ["Food", "Health"],
        ["Design", "Type"],
        ["Fashion", "Eco"],
        ["Dev", "React"],
        ["Photo", "Art"],
        ["UX", "UI"],
        ["Writing", "Creative"],
        ["AI", "Tools", "Tech"]
    ][i % 11],
    createdAt: new Date(),
}));

// Default Static Collections (can be replaced by AI)
const DEFAULT_COLLECTIONS = ["All", "Design", "Development", "AI", "Marketing", "Productivity", "Inspiration", "Tutorials", "Tools", "Startup"];

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            cards: DUMMY_CARDS,
            collections: DEFAULT_COLLECTIONS,
            addCard: (card) => set((state) => ({
                cards: [{
                    ...card,
                    id: `card-${Date.now()}`,
                    createdAt: new Date(),
                    isFavorite: false,
                }, ...state.cards]
            })),
            deleteCard: (id) => set((state) => ({
                cards: state.cards.filter((c) => c.id !== id)
            })),
            toggleFavorite: (id: string) => set((state) => ({
                cards: state.cards.map((c) =>
                    c.id === id ? { ...c, isFavorite: !c.isFavorite } : c
                )
            })),
            setCollections: (collections) => set({ collections: ["All", ...collections.filter(c => c !== "All")] }),
        }),
        {
            name: 'recollect-storage-v2', // Bump version to force reload new dummy data
            storage: createJSONStorage(() => localStorage),
        }
    )
);

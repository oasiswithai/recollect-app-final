"use client";

import { useEffect, useRef } from "react";
import { X, Calendar, Tag, ExternalLink, Heart, Trash2, Sparkles } from "lucide-react";
import { IdeaCardType, useAppStore } from "@/store/useAppStore";
import { IdeaCard } from "@/components/ui/IdeaCard";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface DetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    card: IdeaCardType | null;
    onSelectCard?: (id: string) => void;
}

export function DetailModal({ isOpen, onClose, card, onSelectCard }: DetailModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);
    const { cards, deleteCard, toggleFavorite } = useAppStore();

    // Logic to find similar cards (simple tag overlap)
    const similarCards = card ? cards.filter(c => {
        if (c.id === card.id) return false; // Exclude self
        if (c.title === card.title) return false; // Exclude same content as current
        if (c.isSecret) return false; // Don't recommend secret cards
        const sharedTags = c.tags.filter(t => card.tags.includes(t));
        return sharedTags.length > 0;
    })
        .filter((c, index, self) =>
            // Deduplicate: only keep the first occurrence of a title
            index === self.findIndex((t) => t.title === c.title)
        )
        .slice(0, 5) : [];

    // Handle outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, onClose]);

    // Handle escape key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [isOpen, onClose]);

    if (!isOpen || !card) return null;

    const handleDelete = () => {
        if (confirm("Are you sure you want to delete this memory?")) {
            deleteCard(card.id);
            onClose();
        }
    };

    const handleFavorite = () => {
        toggleFavorite(card.id);
    };

    // Prefer contentImageUrl (original upload) over imageUrl (abstract cover) for detail view
    // If it's a link card without a specific content image, it might use imageUrl (og image)
    const displayImage = card.contentImageUrl || card.imageUrl;
    const isLink = card.summary.startsWith("http"); // Simple link detection or based on tag logic if we had it

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300 p-4">
            <div
                ref={modalRef}
                className="w-full max-w-4xl max-h-[90vh] bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col md:flex-row"
            >
                {/* Close Button (Mobile Absolute / Desktop Absolute) */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-2 text-white/80 hover:text-white bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>

                {/* Left: Image / Visual */}
                <div className="w-full md:w-1/2 bg-zinc-100 dark:bg-zinc-950 relative min-h-[300px] md:min-h-full flex items-center justify-center overflow-hidden">
                    {displayImage ? (
                        <div className="relative w-full h-full min-h-[300px]">
                            <Image
                                src={displayImage}
                                alt={card.title}
                                fill
                                className="object-contain" // Contain to show full original image
                            />
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center text-zinc-400 p-10">
                            <span className="text-lg font-medium">No Image</span>
                        </div>
                    )}
                </div>

                {/* Right: Content */}
                <div className="w-full md:w-1/2 flex flex-col h-full max-h-[90vh] overflow-y-auto">
                    <div className="p-8 flex flex-col gap-6 flex-1">

                        {/* Header Info */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-xs text-zinc-400 uppercase tracking-wider font-medium">
                                <Calendar className="w-3.5 h-3.5" />
                                <span>
                                    {new Date(card.createdAt).toLocaleDateString(undefined, {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </span>
                            </div>
                            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 leading-tight">
                                {card.title}
                            </h2>
                        </div>

                        {/* Tags */}
                        {card.tags && card.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {card.tags.map((tag) => (
                                    <span key={tag} className="px-2.5 py-0.5 text-xs font-medium text-purple-700 bg-purple-50 dark:bg-purple-900/30 dark:text-purple-300 rounded-full flex items-center gap-1.5">
                                        <Tag className="w-3 h-3" />
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        <div className="w-full h-px bg-zinc-100 dark:bg-zinc-800" />

                        {/* Summary / Content */}
                        <div className="prose prose-zinc dark:prose-invert max-w-none">
                            <p className="whitespace-pre-wrap text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
                                {card.summary}
                            </p>
                        </div>

                        {/* Link (if applicable) */}
                        {isLink && (
                            <a
                                href={card.summary} // Assuming summary doubles as link if strict link mode, but let's assume we might have a link field later. 
                                // Ideally we should store linkUrl separately in IdeaCardType, but for now user might have just pasted link in summary or title.
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline mt-2"
                            >
                                <ExternalLink className="w-4 h-4" />
                                Open Link
                            </a>
                        )}

                        {/* Similar Cards Section */}
                        {similarCards.length > 0 && (
                            <div className="mt-[40px] pt-[40px] border-t border-zinc-100 dark:border-zinc-800">
                                <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-200 mb-4 flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-purple-500" />
                                    Similar Ideas
                                </h4>
                                <div className="flex flex-col gap-3">
                                    {similarCards.map(similar => (
                                        <div key={similar.id} className="w-full">
                                            <IdeaCard
                                                id={similar.id}
                                                title={similar.title}
                                                summary={similar.summary}
                                                imageUrl={similar.imageUrl}
                                                tags={similar.tags}
                                                isFavorite={similar.isFavorite}
                                                isSecret={similar.isSecret}
                                                layout="horizontal"
                                                className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                                                onClick={() => {
                                                    if (onSelectCard) onSelectCard(similar.id);
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer Actions */}
                    <div className="p-6 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex justify-between items-center">
                        <button
                            onClick={handleDelete}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                            Delete
                        </button>
                        <button
                            onClick={handleFavorite}
                            className={cn(
                                "flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium transition-all shadow-sm",
                                card.isFavorite
                                    ? "bg-red-500 text-white hover:bg-red-600 border border-transparent"
                                    : "bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700"
                            )}
                        >
                            <Heart className={cn("w-4 h-4", card.isFavorite && "fill-current")} />
                            {card.isFavorite ? "Favorited" : "Favorite"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Trash2, Heart, Lock } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

export interface IdeaCardProps {
    id: string;
    title: string;
    summary: string;
    imageUrl?: string;
    tags?: string[];
    isFavorite?: boolean;
    className?: string;
    onClick?: () => void;
    visualFocalPoint?: { x: number; y: number };
    isSecret?: boolean; // New: Locked card flag
    layout?: 'vertical' | 'horizontal'; // New layout option
}

export function IdeaCard({
    id,
    title,
    summary,
    imageUrl,
    tags,
    isFavorite,
    className,
    onClick,
    visualFocalPoint,
    isSecret,
    layout = 'vertical'
}: IdeaCardProps) {
    const { deleteCard, toggleFavorite } = useAppStore();

    const isHorizontal = layout === 'horizontal';

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm('Are you sure you want to delete this card?')) {
            deleteCard(id);
        }
    };

    const handleFavorite = (e: React.MouseEvent) => {
        e.stopPropagation();
        toggleFavorite(id);
    };

    return (
        <div
            onClick={onClick}
            className={cn(
                "group relative flex rounded-3xl bg-white dark:bg-zinc-800/60 border border-zinc-100 dark:border-white/10 p-3 transition-all duration-500 hover:shadow-xl hover:-translate-y-1 overflow-hidden cursor-pointer backdrop-blur-md",
                isHorizontal ? "flex-row gap-4 items-center h-28" : "flex-col gap-3",
                className
            )}
        >
            {/* Image Section */}
            <div className={cn(
                "relative overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex-shrink-0",
                isHorizontal ? "w-20 h-20" : "w-full aspect-[4/3]"
            )}>
                {imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt={isSecret ? "Secret Content" : title}
                        fill
                        className={cn(
                            "object-cover transition-transform duration-500 group-hover:scale-105",
                            isSecret && "blur-xl scale-110 opacity-80"
                        )}
                        style={{
                            objectPosition: visualFocalPoint
                                ? `${visualFocalPoint.x}% ${visualFocalPoint.y}%`
                                : 'center'
                        }}
                    />
                ) : (
                    <div className={cn(
                        "w-full flex items-center justify-center text-zinc-400 bg-zinc-100 dark:bg-zinc-700",
                        isHorizontal ? "h-full" : "h-48"
                    )}>
                        <span className="text-xs">#</span>
                    </div>
                )}

                {/* Secret Overlay */}
                {isSecret && (
                    <div className="absolute inset-0 flex items-center justify-center z-20">
                        <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white/90 shadow-lg border border-white/10">
                            <Lock className="w-5 h-5" />
                        </div>
                    </div>
                )}

                {/* Hover Overlay Actions (Hidden if Secret) */}
                {!isSecret && (
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                        <button
                            onClick={handleFavorite}
                            className={cn(
                                "p-2 backdrop-blur-md rounded-full transition-colors",
                                isFavorite
                                    ? "bg-red-500 text-white hover:bg-red-600"
                                    : "bg-white/20 text-white hover:bg-white/40"
                            )}
                            title={isFavorite ? "Unlike" : "Like"}
                        >
                            <Heart className={cn("w-5 h-5", isFavorite && "fill-current")} />
                        </button>
                        <button
                            onClick={handleDelete}
                            className="p-2 backdrop-blur-md rounded-full transition-colors bg-white/20 text-white hover:bg-red-500"
                            title="Delete"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </div>
                )}

                {/* Always visible heart if favorite (Hidden if Secret) */}
                {isFavorite && !isSecret && (
                    <div className="absolute top-2 right-2 p-1.5 bg-red-500 rounded-full shadow-sm z-10">
                        <Heart className="w-3 h-3 text-white fill-current" />
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className={cn("flex flex-col gap-2 min-w-0 flex-1", isHorizontal && "justify-center gap-1")}>
                <h3 className={cn("font-semibold text-zinc-900 dark:text-zinc-100 leading-tight truncate", isSecret && "blur-sm select-none opacity-50")}>
                    {isSecret ? "Secret Memory" : title}
                </h3>
                <p className={cn("text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2", isSecret && "blur-sm select-none opacity-50")}>
                    {isSecret ? "This card is locked..." : summary}
                </p>

                {/* Tags (Hidden if Secret) */}
                {!isSecret && tags && tags.length > 0 && !isHorizontal && (
                    <div className="flex flex-wrap gap-1 mt-1">
                        {tags.map((tag) => (
                            <span key={tag} className="px-2 py-0.5 text-xs font-medium text-zinc-600 bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-300 rounded-md">
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

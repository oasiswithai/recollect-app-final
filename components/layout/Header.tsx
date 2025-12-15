"use client";

import { useEffect, useState } from 'react';
import { Search, Plus, Sun, Moon } from 'lucide-react';
import { UploadModal } from '@/components/ui/UploadModal';
import { useAppStore } from '@/store/useAppStore';
import { useTheme } from "next-themes";

interface HeaderProps {
    selectedTag: string;
    onSelectTag?: (tag: string) => void;
    onSearch?: (query: string) => void;
}

export function Header({ selectedTag, onSelectTag, onSearch }: HeaderProps) {
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const { cards, setCollections } = useAppStore();
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    const handleLogoClick = () => {
        onSelectTag?.("All"); // Assuming clicking logo resets filter
        onSearch?.(""); // Also clear search
    };

    if (!mounted) return null;

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800/50">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
                    {/* Left: Logo & Nav */}
                    <div className="flex items-center gap-8">
                        <div
                            onClick={handleLogoClick}
                            className="flex items-center gap-2 cursor-pointer group"
                        >
                            <div className="w-8 h-8 bg-zinc-900 dark:bg-white rounded-full flex items-center justify-center text-white dark:text-black font-bold text-lg shadow-sm transition-transform group-hover:scale-105">
                                R
                            </div>
                            <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white hidden sm:block">
                                Recollect
                            </span>
                        </div>

                        {/* Desktop Nav - Removed as per user request */}
                    </div>

                    {/* Center: Search Bar (Cosmos style) */}
                    <div className="flex-1 max-w-xl mx-4 hidden sm:block">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-zinc-400">
                                <Search className="w-4 h-4" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search your mind..."
                                onChange={(e) => onSearch?.(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-zinc-100 dark:bg-zinc-900 border-none rounded-full text-sm focus:ring-1 focus:ring-zinc-300 dark:focus:ring-zinc-700 transition-all text-zinc-900 dark:text-zinc-200 placeholder:text-zinc-500"
                            />
                            <div className="absolute inset-y-0 right-3 flex items-center gap-2 text-zinc-400">
                                <span className="text-xs border border-zinc-300 dark:border-zinc-700 rounded px-1.5 py-0.5 opacity-50">⌘K</span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-3">
                        {/* Mobile Search Toggle */}
                        <button className="sm:hidden p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                            <Search className="w-5 h-5" />
                        </button>

                        <button
                            onClick={() => setIsUploadOpen(true)}
                            className="hidden sm:flex items-center gap-2 px-5 py-2 rounded-full bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 transition-all shadow-sm font-medium text-sm"
                        >
                            <span>Create</span>
                            <Plus className="w-4 h-4" />
                        </button>

                        {/* Mobile Add */}
                        <button
                            onClick={() => setIsUploadOpen(true)}
                            className="sm:hidden p-2 rounded-full bg-black text-white dark:bg-white dark:text-black"
                        >
                            <Plus className="w-5 h-5" />
                        </button>

                        <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800 mx-1 hidden sm:block" />

                        <div className="flex items-center gap-1 sm:gap-2">
                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-all"
                            >
                                {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                            </button>

                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 ml-1 cursor-pointer hover:opacity-90 transition-opacity" />
                        </div>
                    </div>
                </div>

                {/* Sub-header Navigation (Back button or status) */}
                {selectedTag !== "All" && (
                    <div className="container mx-auto px-4 pb-3 -mt-1 flex items-center animate-in slide-in-from-top-2 fade-in">
                        <button
                            onClick={() => onSelectTag?.("All")}
                            className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors"
                        >
                            <span className="text-lg">←</span>
                            <span>Back to Library</span>
                        </button>
                        <div className="mx-3 h-4 w-px bg-zinc-200 dark:bg-zinc-800" />
                        <span className="text-sm font-medium text-black dark:text-white">{selectedTag}</span>
                    </div>
                )}
            </header>

            <UploadModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} />
        </>
    );
}

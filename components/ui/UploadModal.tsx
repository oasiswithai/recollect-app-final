"use client";

import { useState, useRef, useEffect } from "react";
import { X, Upload, Link as LinkIcon, FileText, Image as ImageIcon, Sparkles, Lock, Unlock } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";

interface UploadModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type UploadTab = "image" | "link" | "text";

export function UploadModal({ isOpen, onClose }: UploadModalProps) {
    const [activeTab, setActiveTab] = useState<UploadTab>("image");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [linkUrl, setLinkUrl] = useState("");
    const [textContent, setTextContent] = useState("");
    const [title, setTitle] = useState("");
    const [tags, setTags] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isTextHeavy, setIsTextHeavy] = useState(false);
    const [visualFocalPoint, setVisualFocalPoint] = useState<{ x: number, y: number } | undefined>(undefined);
    const [isSecret, setIsSecret] = useState(false);

    // Strictly Soft Pastel & Minimalist Covers
    const ABSTRACT_COVERS = [
        "https://images.unsplash.com/photo-1557683316-973673baf926?w=800&q=80", // Soft Gradient Blue/Purple
        "https://images.unsplash.com/photo-1557683304-673a23048d34?w=800&q=80", // Minimalist Gradient
        "https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=800&q=80", // Soft Purple
        "https://images.unsplash.com/photo-1557682224-5b8590cd1413?w=800&q=80", // Soft Rose
        "https://images.unsplash.com/photo-1557682260-96773eb01377?w=800&q=80", // Soft Orange/Peach
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80", // Abstract Fluid Pastel
        "https://images.unsplash.com/photo-1520121401995-928cd50d4e27?w=800&q=80", // Green/Pink Pastel
        "https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?w=800&q=80", // Rain/Cloud
    ];

    const getRandomCover = () => ABSTRACT_COVERS[Math.floor(Math.random() * ABSTRACT_COVERS.length)];

    const { addCard } = useAppStore();
    const modalRef = useRef<HTMLDivElement>(null);

    // Reset state when opening/closing
    useEffect(() => {
        if (!isOpen) {
            setTimeout(() => {
                setImageFile(null);
                setImagePreview(null);
                setLinkUrl("");
                setTextContent("");
                setTitle("");
                setTags("");
                setIsTextHeavy(false);
                setIsSecret(false);
                setActiveTab("image");
                setIsLoading(false);
            }, 300);
        }
    }, [isOpen]);

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

    const analyzeContent = async (content: string, type: UploadTab) => {
        if (!content) return;

        setIsAnalyzing(true);
        try {
            const res = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content,
                    type: type
                }),
            });

            if (res.ok) {
                const data = await res.json();
                if (data.summary) setTextContent(data.summary);
                if (data.title) setTitle(data.title);
                if (data.tags && Array.isArray(data.tags)) {
                    setTags(data.tags.join(', '));
                }
                if (data.isTextHeavy !== undefined) {
                    setIsTextHeavy(data.isTextHeavy);
                }
                if (data.visualFocalPoint) {
                    setVisualFocalPoint(data.visualFocalPoint);
                }
            }
        } catch (error) {
            console.error("AI Analysis Failed", error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setImagePreview(result);
                // Auto-analyze
                analyzeContent(result, "image");
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith("image/")) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setImagePreview(result);
                // Auto-analyze
                analyzeContent(result, "image");
            };
            reader.readAsDataURL(file);
        }
    };

    const fetchMetadata = async (url: string) => {
        if (!url) return;
        setIsLoading(true);
        try {
            const res = await fetch(`/api/link-preview?url=${encodeURIComponent(url)}`);
            if (res.ok) {
                const data = await res.json();
                if (data.title) setTitle(data.title);
                // If we don't have a user-entered summary yet, use the description
                if (data.description && !textContent) setTextContent(data.description);
                if (data.image) setImagePreview(data.image);
            }
        } catch (error) {
            console.error("Failed to fetch metadata", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLinkBlur = () => {
        if (linkUrl && activeTab === 'link') {
            fetchMetadata(linkUrl);
        }
    };

    const handleAnalyze = async () => {
        let content = "";
        if (activeTab === 'link') content = textContent || linkUrl;
        else if (activeTab === 'text') content = textContent;
        else if (activeTab === 'image') content = imagePreview || "";

        analyzeContent(content, activeTab);
    };

    const handleSubmit = () => {
        let summary = "";
        let finalImageUrl = undefined;
        let finalContentImageUrl = undefined;

        if (activeTab === "image") {
            if (!imagePreview) return; // Validation

            // Logic:
            // 1. If Text-Heavy (boring docs) -> Use Abstract Cover
            // 2. If Visual/Mixed -> Use Original Image (with smart crop)
            if (isTextHeavy) {
                finalImageUrl = getRandomCover();
                finalContentImageUrl = imagePreview; // Save original for detail view
            } else {
                finalImageUrl = imagePreview;
                finalContentImageUrl = imagePreview;
            }

            summary = textContent || "Uploaded Image";
        } else if (activeTab === "link") {
            if (!linkUrl) return;
            summary = textContent || linkUrl;
            finalImageUrl = imagePreview || getRandomCover(); // Use preview or random cover
            finalContentImageUrl = imagePreview || undefined;
        } else if (activeTab === "text") {
            if (!textContent) return;
            summary = textContent;
            finalImageUrl = getRandomCover(); // Assign random cover for pure text
        }

        addCard({
            title: title || "New Idea",
            summary: summary,
            tags: tags.split(",").map(t => t.trim()).filter(Boolean),
            imageUrl: finalImageUrl,
            contentImageUrl: finalContentImageUrl,
            visualFocalPoint: visualFocalPoint,
            isSecret: isSecret,
        });

        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-300">
            <div
                ref={modalRef}
                className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800">
                    <h2 className="text-lg font-semibold dark:text-white">Add New Memory</h2>
                    <button
                        onClick={onClose}
                        className="p-2 -mr-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex p-2 gap-1 bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-100 dark:border-zinc-800">
                    <button
                        onClick={() => setActiveTab("image")}
                        className={cn(
                            "flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-xl transition-all cursor-pointer",
                            activeTab === "image"
                                ? "bg-white dark:bg-zinc-800 text-black dark:text-white shadow-sm"
                                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300"
                        )}
                    >
                        <ImageIcon className="w-4 h-4" /> Image
                    </button>
                    <button
                        onClick={() => setActiveTab("link")}
                        className={cn(
                            "flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-xl transition-all cursor-pointer",
                            activeTab === "link"
                                ? "bg-white dark:bg-zinc-800 text-black dark:text-white shadow-sm"
                                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300"
                        )}
                    >
                        <LinkIcon className="w-4 h-4" /> Link
                    </button>
                    <button
                        onClick={() => setActiveTab("text")}
                        className={cn(
                            "flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-xl transition-all cursor-pointer",
                            activeTab === "text"
                                ? "bg-white dark:bg-zinc-800 text-black dark:text-white shadow-sm"
                                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300"
                        )}
                    >
                        <FileText className="w-4 h-4" /> Text
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">

                    {/* Main Input Area */}
                    <div className="min-h-[200px]">
                        {activeTab === "image" && (
                            <div className="space-y-4">
                                <div
                                    className="border-2 border-dashed border-zinc-200 dark:border-zinc-700 rounded-2xl h-[200px] flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer relative overflow-hidden"
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={handleDrop}
                                    onClick={() => document.getElementById('file-upload')?.click()}
                                >
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <>
                                            <div className="w-12 h-12 bg-white dark:bg-zinc-700 rounded-full flex items-center justify-center mb-3 shadow-sm">
                                                <Upload className="w-6 h-6 text-zinc-400" />
                                            </div>
                                            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-300">Click or drag image to upload</p>
                                            <p className="text-xs text-zinc-400 mt-1">PNG, JPG up to 10MB</p>
                                        </>
                                    )}
                                    <input
                                        id="file-upload"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleImageChange}
                                    />
                                </div>
                                <div>
                                    <textarea
                                        value={textContent}
                                        onChange={(e) => setTextContent(e.target.value)}
                                        placeholder={isAnalyzing ? "✨ AI is analyzing your image..." : "Description / extracted text..."}
                                        className={cn(
                                            "w-full h-24 p-3 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all text-sm resize-none",
                                            isAnalyzing && "animate-pulse"
                                        )}
                                    />
                                </div>
                            </div>
                        )}

                        {activeTab === "link" && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">URL Link</label>
                                    <div className="relative">
                                        <input
                                            type="url"
                                            value={linkUrl}
                                            onChange={(e) => setLinkUrl(e.target.value)}
                                            onBlur={handleLinkBlur}
                                            placeholder="Paste a link to save..."
                                            className="w-full h-12 px-4 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all text-sm pr-10"
                                            autoFocus
                                        />
                                        {isLoading && (
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                <div className="w-4 h-4 border-2 border-zinc-300 border-t-zinc-600 rounded-full animate-spin"></div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {imagePreview && (
                                    <div className="relative w-full h-32 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700">
                                        <img src={imagePreview} alt="Link Preview" className="w-full h-full object-cover" />
                                    </div>
                                )}
                                <div>
                                    <textarea
                                        value={textContent}
                                        onChange={(e) => setTextContent(e.target.value)}
                                        placeholder="Description / summary..."
                                        className="w-full h-24 p-3 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all text-sm resize-none"
                                    />
                                </div>
                            </div>
                        )}

                        {activeTab === "text" && (
                            <textarea
                                value={textContent}
                                onChange={(e) => setTextContent(e.target.value)}
                                placeholder="Write your thought..."
                                className="w-full h-[200px] p-4 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all text-sm resize-none"
                                autoFocus
                            />
                        )}
                    </div>

                    {/* Common Fields */}
                    <div className="space-y-3 pt-2">
                        <div>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Title (optional)"
                                className="w-full h-10 px-0 bg-transparent border-b border-zinc-200 dark:border-zinc-800 text-sm outline-none focus:border-black dark:focus:border-white transition-colors"
                            />
                        </div>
                        <div>
                            <input
                                type="text"
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                                placeholder="Tags (comma separated)"
                                className="w-full h-10 px-0 bg-transparent border-b border-zinc-200 dark:border-zinc-800 text-sm outline-none focus:border-black dark:focus:border-white transition-colors"
                            />
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="pt-4 flex justify-between gap-3">
                        <div className="flex gap-2">
                            <button
                                onClick={() => setIsSecret(!isSecret)}
                                className={cn(
                                    "px-3 py-2.5 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer border",
                                    isSecret
                                        ? "bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-900/30"
                                        : "bg-white text-zinc-500 border-zinc-200 hover:bg-zinc-50 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700 dark:hover:bg-zinc-700"
                                )}
                                title={isSecret ? "Card is locked" : "Make this card secret"}
                            >
                                {isSecret ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                                {isSecret ? "Secret" : "Public"}
                            </button>

                            {(activeTab === 'text' || activeTab === 'link' || activeTab === 'image') && (
                                <button
                                    onClick={handleAnalyze}
                                    disabled={isAnalyzing || (!textContent && !linkUrl && !imagePreview)}
                                    className="px-3 py-2.5 text-xs font-semibold text-purple-600 bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/20 dark:text-purple-300 dark:hover:bg-purple-900/30 rounded-xl transition-all flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                    title="Auto-generate summary and tags with AI"
                                >
                                    <Sparkles className={cn("w-4 h-4", isAnalyzing && "animate-spin")} />
                                    {isAnalyzing ? "Thinking..." : "AI Magic"}
                                </button>
                            )}
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                className="px-5 py-2.5 text-sm font-medium text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={activeTab === 'image' && !imagePreview || activeTab === 'link' && !linkUrl || activeTab === 'text' && !textContent}
                                className="px-6 py-2.5 text-sm font-semibold text-white bg-black dark:bg-white dark:text-black rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm cursor-pointer"
                            >
                                Save Recollection
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div >
    );
}

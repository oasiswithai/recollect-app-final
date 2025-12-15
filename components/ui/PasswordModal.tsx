"use client";

import { useState, useEffect, useRef } from "react";
import { Lock, X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUnlock: () => void;
}

export function PasswordModal({ isOpen, onClose, onUnlock }: PasswordModalProps) {
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setPassword("");
            setError(false);
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();

        // Simple Hardcoded Password for MVP
        if (password === "0000") {
            onUnlock();
            onClose();
        } else {
            setError(true);
            // Shake animation or visual feedback could be added here
            setTimeout(() => setError(false), 2000);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity">
            <div className="w-full max-w-sm bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-6 animate-in fade-in zoom-in-95 duration-200 relative">

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="flex flex-col items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center text-zinc-500 dark:text-zinc-400">
                        <Lock className="w-6 h-6" />
                    </div>
                    <div className="text-center">
                        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Unlock Memory</h3>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">Enter passcode to view this card.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <input
                            ref={inputRef}
                            type="password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                if (error) setError(false);
                            }}
                            className={cn(
                                "w-full h-12 text-center text-2xl tracking-widest bg-zinc-50 dark:bg-zinc-800 border rounded-xl outline-none transition-all placeholder:tracking-normal",
                                error
                                    ? "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-600 focus:ring-2 focus:ring-red-500/20"
                                    : "border-zinc-200 dark:border-zinc-700 focus:border-black dark:focus:border-white focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10"
                            )}
                            placeholder="••••"
                            maxLength={4}
                            autoComplete="off"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full h-11 bg-black dark:bg-white text-white dark:text-black font-medium rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                    >
                        Unlock <ArrowRight className="w-4 h-4" />
                    </button>
                </form>
            </div>
        </div>
    );
}

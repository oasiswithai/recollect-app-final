import { motion } from "framer-motion";
import Image from "next/image";

interface CollectionCardProps {
    name: string;
    count: number;
    previewImages: string[];
    onClick: () => void;
}

export function CollectionCard({ name, count, previewImages, onClick }: CollectionCardProps) {
    const image = previewImages[0] || null;

    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className="cursor-pointer relative flex items-center flex-shrink-0 h-14 pl-1 pr-6 rounded-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-zinc-300 dark:hover:border-white/20 bg-white/80 dark:bg-zinc-800/40 backdrop-blur-md border border-zinc-200 dark:border-white/10"
        >
            {/* Left Image Circle */}
            <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-zinc-100 dark:bg-zinc-700">
                {image ? (
                    <Image src={image} alt="" fill className="object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-400 opacity-50 text-xs">
                        #
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="ml-3 flex flex-col justify-center">
                <h3 className="text-sm font-bold leading-none text-zinc-900 dark:text-zinc-100">{name}</h3>
            </div>
        </motion.div>
    );
}

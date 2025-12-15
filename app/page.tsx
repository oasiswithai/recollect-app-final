"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { MasonryGrid } from "@/components/layout/MasonryGrid";
import { IdeaCard } from "@/components/ui/IdeaCard";
import { useAppStore, IdeaCardType } from "@/store/useAppStore";
import { DetailModal } from "@/components/ui/DetailModal";
import { CollectionCard } from "@/components/ui/CollectionCard";
import { PasswordModal } from "@/components/ui/PasswordModal";

export default function Home() {
  const [selectedTag, setSelectedTag] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [unlockedCards, setUnlockedCards] = useState<string[]>([]);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [secretCardIdToUnlock, setSecretCardIdToUnlock] = useState<string | null>(null);
  const { cards, collections } = useAppStore();

  // 1. Filter Logic
  const filteredCards = cards.filter(card => {
    // Tag Filter
    const matchesTag = selectedTag === "All" || card.tags.some(tag => tag.toLowerCase() === selectedTag.toLowerCase());

    // Search Filter
    const query = searchQuery.toLowerCase();
    const matchesSearch = query === "" ||
      card.title.toLowerCase().includes(query) ||
      card.summary.toLowerCase().includes(query) ||
      card.tags.some(tag => tag.toLowerCase().includes(query));

    return matchesTag && matchesSearch;
  });

  const selectedCard = cards.find(c => c.id === selectedCardId) || null;

  // 2. Collection Deck Logic
  const showCollections = selectedTag === "All" && collections.length > 1;

  const collectionStats = collections
    .filter(c => c !== "All")
    .map(name => {
      const matchingCards = cards.filter(c => c.tags.some(t => t.toLowerCase() === name.toLowerCase()));
      return {
        name,
        count: matchingCards.length,
        previewImages: matchingCards.map(c => c.imageUrl || "").filter(Boolean).slice(0, 3)
      };
    })
    .filter(stat => stat.count > 0);

  const handleUnlock = () => {
    if (secretCardIdToUnlock) {
      setUnlockedCards((prev) => [...prev, secretCardIdToUnlock]);
      setSelectedCardId(secretCardIdToUnlock);
      setSecretCardIdToUnlock(null);
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      <Header
        selectedTag={selectedTag}
        onSelectTag={setSelectedTag}
        onSearch={setSearchQuery}
      />

      <main className="container mx-auto px-4 pt-24 pb-6">
        {/* Collection Deck (Horizontal Scroll) */}
        {showCollections && (
          <div className="mb-6">
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {collectionStats.map((stat) => (
                <CollectionCard
                  key={stat.name}
                  name={stat.name}
                  count={stat.count}
                  previewImages={stat.previewImages}
                  onClick={() => setSelectedTag(stat.name)}
                />
              ))}
            </div>
          </div>
        )}

        {filteredCards.length > 0 ? (
          <MasonryGrid>
            {filteredCards.map((card) => {
              const isUnlocked = unlockedCards.includes(card.id);
              const isSecretEffectively = card.isSecret && !isUnlocked;

              return (
                <div key={card.id} className="mb-4">
                  <IdeaCard
                    id={card.id}
                    title={card.title}
                    summary={card.summary}
                    imageUrl={card.imageUrl}
                    tags={card.tags}
                    isFavorite={card.isFavorite}
                    isSecret={isSecretEffectively}
                    onClick={() => {
                      if (isSecretEffectively) {
                        setSecretCardIdToUnlock(card.id);
                        setPasswordModalOpen(true);
                      } else {
                        setSelectedCardId(card.id);
                      }
                    }}
                  />
                </div>
              );
            })}
          </MasonryGrid>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">No items found</h3>
            <p className="text-zinc-500 max-w-md">try selecting a different filter or add a new card.</p>
          </div>
        )}
      </main>

      <PasswordModal
        isOpen={passwordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
        onUnlock={handleUnlock}
      />

      {/* Detail Modal */}
      <DetailModal
        isOpen={!!selectedCardId && !passwordModalOpen}
        onClose={() => setSelectedCardId(null)}
        card={selectedCard}
        onSelectCard={setSelectedCardId}
      />
    </div>
  );
}

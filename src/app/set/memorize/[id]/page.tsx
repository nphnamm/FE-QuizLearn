"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Protected from "@/hooks/useProtected";
import { useSelector } from "react-redux";
import { useGetCardBySetIdQuery } from "../../../../../redux/features/cards/cardsApi";
import { FlashcardWithMemorization } from "@/components/flashcard/FlashcardWithMemorization";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useCreateOrUpdateUserSessionMutation } from "../../../../../redux/features/userSessions/userSessionsApi";
import { useUpdateProgressMutation } from "../../../../../redux/features/userProgresses/userProgressesApi";

interface Card {
  id: string;
  term: string;
  definition: string;
  setId?: string;
  position?: number;
  statusId?: number;
  createdAt?: string;
  updatedAt?: string;
  imageUrl?: string;
}

export default function MemorizePage() {
  const router = useRouter();
  const { user } = useSelector((state: any) => state.auth);
  const params = useParams();
  const id = params.id;
  const { data, isLoading } = useGetCardBySetIdQuery(id);
  const [createOrUpdateUserSession] = useCreateOrUpdateUserSessionMutation();
  const [updateProgress] = useUpdateProgressMutation();

  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [cards, setCards] = useState<Card[]>([]);
  const [memorizedCards, setMemorizedCards] = useState<Set<string>>(new Set());
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    if (data?.cards) {
      setCards(data.cards);
    }
  }, [data]);

  useEffect(() => {
    const initializeSession = async () => {
      if (user && id) {
        try {
          const response = await createOrUpdateUserSession({
            userId: user.id,
            setId: id,
            mode: "flashcard"
          }).unwrap();
          setSessionId(response.sessionId);
        } catch (error) {
          console.error("Failed to create session:", error);
        }
      }
    };

    initializeSession();
  }, [user, id, createOrUpdateUserSession]);

  const handleMemorizationResponse = async (isMemorized: boolean) => {
    const currentCard = cards[currentCardIndex];
    if (!currentCard) return;

    

    // Update progress in the backend
    if (sessionId) {
      try {
        await updateProgress({
          sessionId,
          cardId: currentCard.id,
          isCorrect: isMemorized
        });
      } catch (error) {
        console.error("Failed to update progress:", error);
      }
    }

    // Move to next card
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
    } else {
      // All cards have been reviewed
      router.push(`/set/${id}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (!cards || cards.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        No flashcards found in this set.
      </div>
    );
  }

  const progress = ((currentCardIndex + 1) / cards.length) * 100;

  return (
    <Protected>
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="mb-8">
            <Progress value={progress} className="h-2" />
            <div className="text-center mt-2 text-sm text-gray-500">
              Card {currentCardIndex + 1} of {cards.length}
            </div>
          </div>

          <FlashcardWithMemorization
            term={cards[currentCardIndex].term}
            definition={cards[currentCardIndex].definition}
            imageUrl={cards[currentCardIndex].imageUrl}
            onMemorizationResponse={handleMemorizationResponse}
          />

          <div className="mt-8 text-center">
            <Button
              variant="outline"
              onClick={() => router.push(`/set/${id}`)}
            >
              Exit Memorization Mode
            </Button>
          </div>
        </div>
      </div>
    </Protected>
  );
} 
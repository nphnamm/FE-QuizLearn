import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface FlashcardWithMemorizationProps {
  term: string;
  definition: string;
  imageUrl?: string;
  onMemorizationResponse: (isMemorized: boolean) => void;
  className?: string;
}

export const FlashcardWithMemorization: React.FC<FlashcardWithMemorizationProps> = ({
  term,
  definition,
  imageUrl,
  onMemorizationResponse,
  className
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showContent, setShowContent] = useState(true);

  const handleFlipCard = () => {
    setShowContent(false);
    setTimeout(() => {
      setIsFlipped(!isFlipped);
      setShowContent(true);
    }, 300);
  };

  const handleMemorizationResponse = (isMemorized: boolean) => {
    onMemorizationResponse(isMemorized);
  };

  return (
    <div className={cn("w-full max-w-2xl mx-auto", className)}>
      <Card
        className={cn(
          "w-full aspect-[3/2] cursor-pointer flex items-center justify-center p-8 text-2xl text-center",
          "transition-all duration-300 perspective-1000",
          showContent ? "opacity-100 scale-100" : "opacity-0 scale-95"
        )}
        onClick={handleFlipCard}
      >
        <CardContent className={cn(
          "flex items-center justify-center w-full h-full relative transition-transform duration-500 transform-style-3d",
          isFlipped ? "rotate-y-180" : ""
        )}>
          <div className="absolute backface-hidden w-full h-full flex items-center justify-center">
            <div className="flex flex-col items-center gap-4 w-full">
              <span>{term}</span>
              {imageUrl && (
                <div className="relative w-full max-w-md h-48 bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src={imageUrl}
                    alt={term}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const fallbackEl = document.createElement('div');
                      fallbackEl.className = 'flex items-center justify-center h-full text-gray-400';
                      fallbackEl.innerText = 'Image could not be loaded';
                      target.parentElement?.appendChild(fallbackEl);
                    }}
                  />
                </div>
              )}
            </div>
          </div>
          <div className="absolute backface-hidden w-full h-full flex items-center justify-center rotate-y-180">
            <span>{definition}</span>
          </div>
        </CardContent>
      </Card>

      {isFlipped && (
        <div className="flex justify-center gap-4 mt-6">
          <Button
            variant="outline"
            className="px-8 py-6 text-lg bg-red-50 hover:bg-red-100 text-red-600 border-red-200"
            onClick={() => handleMemorizationResponse(false)}
          >
            No, I need to review
          </Button>
          <Button
            variant="outline"
            className="px-8 py-6 text-lg bg-green-50 hover:bg-green-100 text-green-600 border-green-200"
            onClick={() => handleMemorizationResponse(true)}
          >
            Yes, I know this
          </Button>
        </div>
      )}
    </div>
  );
}; 
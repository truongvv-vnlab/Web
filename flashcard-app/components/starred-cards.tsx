"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChevronLeft,
  ChevronRight,
  Shuffle,
  Star,
  FolderOpen,
  Frown,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Mẫu dữ liệu cho các bộ thẻ
const cardDecks = [
  {
    id: "1",
    name: "Tiếng Anh cơ bản",
    cards: [
      {
        id: "1",
        front: "Hello",
        back: "Xin chào",
        starred: false,
        deckId: "1",
        deckName: "Tiếng Anh cơ bản",
      },
      {
        id: "2",
        front: "Goodbye",
        back: "Tạm biệt",
        starred: true,
        deckId: "1",
        deckName: "Tiếng Anh cơ bản",
      },
      {
        id: "5",
        front: "Yes",
        back: "Có",
        starred: true,
        deckId: "1",
        deckName: "Tiếng Anh cơ bản",
      },
    ],
  },
  {
    id: "2",
    name: "Toán học",
    cards: [
      {
        id: "3",
        front: "3²",
        back: "9",
        starred: true,
        deckId: "2",
        deckName: "Toán học",
      },
    ],
  },
  {
    id: "3",
    name: "Lịch sử Việt Nam",
    cards: [
      {
        id: "4",
        front: "Năm giành độc lập của Việt Nam",
        back: "1945",
        starred: true,
        deckId: "3",
        deckName: "Lịch sử Việt Nam",
      },
      {
        id: "5",
        front: "Năm kết thúc chiến tranh Việt Nam",
        back: "1975",
        starred: true,
        deckId: "3",
        deckName: "Lịch sử Việt Nam",
      },
    ],
  },
];

type Card = {
  id: string;
  front: string;
  back: string;
  starred: boolean;
  deckId: string;
  deckName: string;
};

export function StarredCards() {
  const [starredCards, setStarredCards] = useState<Card[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching starred cards
    const fetchStarredCards = () => {
      setIsLoading(true);

      // Collect all starred cards from all decks
      const allStarredCards = cardDecks.flatMap((deck) =>
        deck.cards.filter((card) => card.starred)
      );

      setStarredCards(allStarredCards);
      setIsLoading(false);
    };

    fetchStarredCards();
  }, []);

  const handlePrevious = () => {
    if (starredCards.length === 0) return;
    setIsFlipped(false);
    setCurrentIndex((prev) =>
      prev === 0 ? starredCards.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    if (starredCards.length === 0) return;
    setIsFlipped(false);
    setCurrentIndex((prev) =>
      prev === starredCards.length - 1 ? 0 : prev + 1
    );
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleShuffle = () => {
    if (starredCards.length === 0) return;
    setIsFlipped(false);
    const shuffled = [...starredCards].sort(() => Math.random() - 0.5);
    setStarredCards(shuffled);
    setCurrentIndex(0);
  };

  const handleToggleStar = () => {
    if (starredCards.length === 0) return;

    const updatedCards = [...starredCards];
    updatedCards[currentIndex] = {
      ...updatedCards[currentIndex],
      starred: !updatedCards[currentIndex].starred,
    };

    // If card is unstarred, remove it from the list
    if (!updatedCards[currentIndex].starred) {
      const newCards = updatedCards.filter(
        (_, index) => index !== currentIndex
      );
      setStarredCards(newCards);

      // Adjust current index if necessary
      if (currentIndex >= newCards.length) {
        setCurrentIndex(Math.max(0, newCards.length - 1));
      }
    } else {
      setStarredCards(updatedCards);
    }
  };

  // If there are no starred cards
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">Đang tải...</div>
    );
  }

  if (starredCards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="flex flex-col items-center text-center space-y-2">
          <Frown className="h-16 w-16 text-muted-foreground" />
          <h3 className="text-xl font-semibold">
            Không có thẻ nào được đánh dấu sao
          </h3>
          <p className="text-muted-foreground">
            Bạn chưa đánh dấu sao cho thẻ nào. Hãy đánh dấu sao cho các thẻ yêu
            thích để xem chúng ở đây.
          </p>
        </div>
        <Button asChild>
          <a href="/dashboard">
            <FolderOpen className="mr-2 h-4 w-4" />
            Xem tất cả bộ thẻ
          </a>
        </Button>
      </div>
    );
  }

  const currentCard = starredCards[currentIndex];

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Hiển thị tên bộ thẻ */}
      <Badge variant="outline" className="mb-2">
        {currentCard.deckName}
      </Badge>

      {/* Khu vực hiển thị flip card */}
      <div className="w-full max-w-md">
        <div
          className="relative h-64 w-full cursor-pointer perspective-1000"
          onClick={handleFlip}
        >
          <div
            className={`absolute inset-0 transform-style-3d transition-transform duration-500 ${
              isFlipped ? "rotate-y-180" : ""
            }`}
          >
            <Card className="absolute inset-0 backface-hidden">
              <CardContent className="flex h-full items-center justify-center p-6">
                <p className="text-2xl font-semibold">{currentCard.front}</p>
              </CardContent>
            </Card>
            <Card className="absolute inset-0 backface-hidden rotate-y-180">
              <CardContent className="flex h-full items-center justify-center p-6">
                <p className="text-2xl font-semibold">{currentCard.back}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Khu vực action */}
      <div className="flex w-full max-w-md justify-between">
        <Button variant="outline" size="icon" onClick={handlePrevious}>
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Trước</span>
        </Button>
        <Button variant="outline" size="icon" onClick={handleShuffle}>
          <Shuffle className="h-4 w-4" />
          <span className="sr-only">Tráo đổi</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleToggleStar}
          className="text-yellow-500"
        >
          <Star className="h-4 w-4" fill="currentColor" />
          <span className="sr-only">Bỏ đánh dấu sao</span>
        </Button>
        <Button variant="outline" size="icon" onClick={handleNext}>
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Sau</span>
        </Button>
      </div>

      {/* Thông tin thẻ */}
      <div className="text-center text-sm text-muted-foreground">
        Thẻ {currentIndex + 1} / {starredCards.length}
      </div>
    </div>
  );
}

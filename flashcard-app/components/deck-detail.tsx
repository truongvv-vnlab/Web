"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import {
  ChevronLeft,
  ChevronRight,
  Edit,
  Plus,
  Star,
  Trash2,
  Frown,
  Settings,
} from "lucide-react";

// Mẫu dữ liệu cho các bộ thẻ
const cardDecks = [
  {
    id: "1",
    name: "Tiếng Anh cơ bản",
    description: "Các từ vựng tiếng Anh cơ bản hàng ngày",
    count: 50,
    cards: [
      { id: "1", front: "Hello", back: "Xin chào", starred: false },
      { id: "2", front: "Goodbye", back: "Tạm biệt", starred: true },
      { id: "3", front: "Thank you", back: "Cảm ơn", starred: false },
      { id: "4", front: "Sorry", back: "Xin lỗi", starred: false },
      { id: "5", front: "Yes", back: "Có", starred: true },
    ],
  },
  {
    id: "2",
    name: "Toán học",
    description: "Các công thức toán học cơ bản",
    count: 30,
    cards: [
      { id: "1", front: "1 + 1", back: "2", starred: false },
      { id: "2", front: "2 × 2", back: "4", starred: false },
      { id: "3", front: "3²", back: "9", starred: true },
      { id: "4", front: "√16", back: "4", starred: false },
      { id: "5", front: "log₁₀(100)", back: "2", starred: false },
    ],
  },
  {
    id: "3",
    name: "Lịch sử Việt Nam",
    description: "Các sự kiện lịch sử quan trọng của Việt Nam",
    count: 45,
    cards: [
      {
        id: "1",
        front: "Năm giành độc lập của Việt Nam",
        back: "1945",
        starred: true,
      },
      {
        id: "2",
        front: "Vua Lê nào trị vì lâu nhất?",
        back: "Lê Thánh Tông",
        starred: false,
      },
      {
        id: "3",
        front: "Ai là người sáng lập ra nhà Trần?",
        back: "Trần Thủ Độ",
        starred: false,
      },
      {
        id: "4",
        front: "Năm kết thúc chiến tranh Việt Nam",
        back: "1975",
        starred: true,
      },
      {
        id: "5",
        front: "Triều đại cuối cùng của Việt Nam",
        back: "Nhà Nguyễn",
        starred: false,
      },
    ],
  },
  // Bộ thẻ trống để test
  {
    id: "4",
    name: "Khoa học",
    description: "Các khái niệm khoa học cơ bản",
    count: 0,
    cards: [],
  },
];

type CardType = {
  id: string;
  front: string;
  back: string;
  starred: boolean;
};

type Deck = {
  id: string;
  name: string;
  description?: string;
  count: number;
  cards: CardType[];
};

export function DeckDetail({ deckId }: { deckId: string }) {
  const [deck, setDeck] = useState<Deck | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeckSettingsOpen, setIsDeckSettingsOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<CardType | null>(null);
  const [newCard, setNewCard] = useState<{ front: string; back: string }>({
    front: "",
    back: "",
  });
  const [deletingCardId, setDeletingCardId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deckSettings, setDeckSettings] = useState<{
    name: string;
    description: string;
  }>({
    name: "",
    description: "",
  });

  useEffect(() => {
    // Simulate fetching deck data
    setIsLoading(true);
    const foundDeck = cardDecks.find((deck) => deck.id === deckId);

    setTimeout(() => {
      if (foundDeck) {
        setDeck(foundDeck);
        setDeckSettings({
          name: foundDeck.name,
          description: foundDeck.description || "",
        });
      }
      setIsLoading(false);
    }, 500);
  }, [deckId]);

  const handlePrevious = () => {
    if (!deck || deck.cards.length === 0) return;
    setIsFlipped(false);
    setCurrentCardIndex((prev) =>
      prev === 0 ? deck.cards.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    if (!deck || deck.cards.length === 0) return;
    setIsFlipped(false);
    setCurrentCardIndex((prev) =>
      prev === deck.cards.length - 1 ? 0 : prev + 1
    );
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleToggleStar = () => {
    if (!deck || deck.cards.length === 0) return;
    const updatedCards = [...deck.cards];
    updatedCards[currentCardIndex] = {
      ...updatedCards[currentCardIndex],
      starred: !updatedCards[currentCardIndex].starred,
    };
    setDeck({
      ...deck,
      cards: updatedCards,
    });
  };

  const handleEditCard = (card: CardType) => {
    setEditingCard({ ...card });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (!deck || !editingCard) return;

    const updatedCards = deck.cards.map((card) =>
      card.id === editingCard.id ? editingCard : card
    );

    setDeck({
      ...deck,
      cards: updatedCards,
    });

    setIsEditDialogOpen(false);
    setEditingCard(null);
  };

  const handleDeleteCard = (cardId: string) => {
    setDeletingCardId(cardId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!deck || !deletingCardId) return;

    const updatedCards = deck.cards.filter(
      (card) => card.id !== deletingCardId
    );

    setDeck({
      ...deck,
      cards: updatedCards,
      count: updatedCards.length,
    });

    setIsDeleteDialogOpen(false);
    setDeletingCardId(null);

    // Reset current index if needed
    if (currentCardIndex >= updatedCards.length) {
      setCurrentCardIndex(Math.max(0, updatedCards.length - 1));
    }
  };

  const handleFullscreenToggle = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleAddCard = () => {
    if (!deck || !newCard.front.trim() || !newCard.back.trim()) return;

    const newCardObj: CardType = {
      id: Date.now().toString(),
      front: newCard.front,
      back: newCard.back,
      starred: false,
    };

    const updatedCards = [...deck.cards, newCardObj];

    setDeck({
      ...deck,
      cards: updatedCards,
      count: updatedCards.length,
    });

    setNewCard({ front: "", back: "" });
    setIsAddDialogOpen(false);
  };

  const handleOpenDeckSettings = () => {
    if (!deck) return;
    setDeckSettings({
      name: deck.name,
      description: deck.description || "",
    });
    setIsDeckSettingsOpen(true);
  };

  const handleSaveDeckSettings = () => {
    if (!deck || !deckSettings.name.trim()) return;

    setDeck({
      ...deck,
      name: deckSettings.name,
      description: deckSettings.description,
    });

    setIsDeckSettingsOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">Đang tải...</div>
    );
  }

  if (!deck) {
    return <div>Không tìm thấy bộ thẻ</div>;
  }

  // Hiển thị giao diện khi không có thẻ nào
  if (deck.cards.length === 0) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">{deck.name}</h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleOpenDeckSettings}
              title="Cài đặt bộ thẻ"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">0 thẻ</span>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <div className="flex flex-col items-center text-center space-y-2">
            <Frown className="h-16 w-16 text-muted-foreground" />
            <h3 className="text-xl font-semibold">
              Không có thẻ nào trong bộ thẻ này
            </h3>
            <p className="text-muted-foreground">
              Bạn chưa có thẻ nào trong bộ thẻ này. Bạn có muốn tạo thẻ mới
              không?
            </p>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Tạo thẻ mới
          </Button>
        </div>

        {/* Dialog thêm thẻ mới */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Thêm thẻ mới</DialogTitle>
              <DialogDescription>
                Thêm thẻ mới vào bộ thẻ "{deck.name}".
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="new-front">Mặt trước</Label>
                <Textarea
                  id="new-front"
                  value={newCard.front}
                  onChange={(e) =>
                    setNewCard({ ...newCard, front: e.target.value })
                  }
                  placeholder="Nhập nội dung mặt trước"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-back">Mặt sau</Label>
                <Textarea
                  id="new-back"
                  value={newCard.back}
                  onChange={(e) =>
                    setNewCard({ ...newCard, back: e.target.value })
                  }
                  placeholder="Nhập nội dung mặt sau"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
              >
                Hủy
              </Button>
              <Button
                onClick={handleAddCard}
                disabled={!newCard.front.trim() || !newCard.back.trim()}
              >
                Thêm thẻ
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog cài đặt bộ thẻ */}
        <Dialog open={isDeckSettingsOpen} onOpenChange={setIsDeckSettingsOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cài đặt bộ thẻ</DialogTitle>
              <DialogDescription>
                Chỉnh sửa thông tin bộ thẻ của bạn.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="deck-name">Tên bộ thẻ</Label>
                <Input
                  id="deck-name"
                  value={deckSettings.name}
                  onChange={(e) =>
                    setDeckSettings({ ...deckSettings, name: e.target.value })
                  }
                  placeholder="Nhập tên bộ thẻ"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deck-description">Mô tả (tùy chọn)</Label>
                <Textarea
                  id="deck-description"
                  value={deckSettings.description}
                  onChange={(e) =>
                    setDeckSettings({
                      ...deckSettings,
                      description: e.target.value,
                    })
                  }
                  placeholder="Nhập mô tả cho bộ thẻ"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDeckSettingsOpen(false)}
              >
                Hủy
              </Button>
              <Button
                onClick={handleSaveDeckSettings}
                disabled={!deckSettings.name.trim()}
              >
                Lưu thay đổi
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  const currentCard = deck.cards[currentCardIndex];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">{deck.name}</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleOpenDeckSettings}
            title="Cài đặt bộ thẻ"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            {deck.cards.length} thẻ
          </span>
          <Button variant="outline" onClick={handleFullscreenToggle}>
            {isFullscreen ? "Thu nhỏ" : "Xem toàn màn hình"}
          </Button>
        </div>
      </div>

      {/* Hiển thị mô tả nếu có */}
      {deck.description && (
        <p className="text-muted-foreground">{deck.description}</p>
      )}

      {/* Khu vực hiển thị flip card */}
      <div
        className={`mx-auto transition-all duration-300 ${
          isFullscreen ? "w-full max-w-4xl" : "w-full max-w-md"
        }`}
      >
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
      <div className="flex w-full max-w-md mx-auto justify-between">
        <Button variant="outline" size="icon" onClick={handlePrevious}>
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Trước</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleToggleStar}
          className={currentCard.starred ? "text-yellow-500" : ""}
        >
          <Star
            className="h-4 w-4"
            fill={currentCard.starred ? "currentColor" : "none"}
          />
          <span className="sr-only">Đánh dấu sao</span>
        </Button>
        <Button variant="outline" size="icon" onClick={handleNext}>
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Sau</span>
        </Button>
      </div>

      {/* Thông tin thẻ */}
      <div className="text-center text-sm text-muted-foreground">
        Thẻ {currentCardIndex + 1} / {deck.cards.length}
      </div>

      {/* Danh sách thẻ */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Danh sách thẻ</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAddDialogOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Thêm thẻ mới
          </Button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">#</TableHead>
                <TableHead>Mặt trước</TableHead>
                <TableHead>Mặt sau</TableHead>
                <TableHead className="w-[100px] text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deck.cards.map((card, index) => (
                <TableRow key={card.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{card.front}</TableCell>
                  <TableCell>{card.back}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditCard(card)}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Chỉnh sửa</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteCard(card.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Xóa</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Dialog chỉnh sửa thẻ */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa thẻ</DialogTitle>
            <DialogDescription>
              Chỉnh sửa nội dung mặt trước và mặt sau của thẻ.
            </DialogDescription>
          </DialogHeader>
          {editingCard && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="front">Mặt trước</Label>
                <Textarea
                  id="front"
                  value={editingCard.front}
                  onChange={(e) =>
                    setEditingCard({ ...editingCard, front: e.target.value })
                  }
                  placeholder="Nhập nội dung mặt trước"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="back">Mặt sau</Label>
                <Textarea
                  id="back"
                  value={editingCard.back}
                  onChange={(e) =>
                    setEditingCard({ ...editingCard, back: e.target.value })
                  }
                  placeholder="Nhập nội dung mặt sau"
                  rows={3}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Hủy
            </Button>
            <Button onClick={handleSaveEdit}>Lưu thay đổi</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog thêm thẻ mới */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm thẻ mới</DialogTitle>
            <DialogDescription>
              Thêm thẻ mới vào bộ thẻ "{deck.name}".
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-front">Mặt trước</Label>
              <Textarea
                id="new-front"
                value={newCard.front}
                onChange={(e) =>
                  setNewCard({ ...newCard, front: e.target.value })
                }
                placeholder="Nhập nội dung mặt trước"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-back">Mặt sau</Label>
              <Textarea
                id="new-back"
                value={newCard.back}
                onChange={(e) =>
                  setNewCard({ ...newCard, back: e.target.value })
                }
                placeholder="Nhập nội dung mặt sau"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Hủy
            </Button>
            <Button
              onClick={handleAddCard}
              disabled={!newCard.front.trim() || !newCard.back.trim()}
            >
              Thêm thẻ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog cài đặt bộ thẻ */}
      <Dialog open={isDeckSettingsOpen} onOpenChange={setIsDeckSettingsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cài đặt bộ thẻ</DialogTitle>
            <DialogDescription>
              Chỉnh sửa thông tin bộ thẻ của bạn.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="deck-name">Tên bộ thẻ</Label>
              <Input
                id="deck-name"
                value={deckSettings.name}
                onChange={(e) =>
                  setDeckSettings({ ...deckSettings, name: e.target.value })
                }
                placeholder="Nhập tên bộ thẻ"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deck-description">Mô tả (tùy chọn)</Label>
              <Textarea
                id="deck-description"
                value={deckSettings.description}
                onChange={(e) =>
                  setDeckSettings({
                    ...deckSettings,
                    description: e.target.value,
                  })
                }
                placeholder="Nhập mô tả cho bộ thẻ"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeckSettingsOpen(false)}
            >
              Hủy
            </Button>
            <Button
              onClick={handleSaveDeckSettings}
              disabled={!deckSettings.name.trim()}
            >
              Lưu thay đổi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog xác nhận xóa thẻ */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Bạn có chắc chắn muốn xóa thẻ này?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Thẻ này sẽ bị xóa vĩnh viễn khỏi
              bộ thẻ của bạn.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

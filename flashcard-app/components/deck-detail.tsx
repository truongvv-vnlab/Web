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
import { AppDispatch, RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteSoftDeck,
  fetchDecks,
  selectDeckById,
  updateDeck,
} from "@/store/deckSlice";
import { CardType, DeckType } from "@/store/type";
import {
  addCard,
  deleteSoftCard,
  fetchCards,
  selectAllActiveCardsByDeckId,
  updateCard,
} from "@/store/cardSlice";
import {
  generateUUID,
  incrementVersionInLocalStorage,
} from "@/store/indexedDB";
import { useRouter } from "next/navigation";

export function DeckDetail({ deckId }: { deckId: string }) {
  const deck: DeckType | undefined = useSelector((state: RootState) =>
    selectDeckById(deckId)(state)
  );
  const cards: CardType[] = useSelector((state: RootState) =>
    selectAllActiveCardsByDeckId(deckId)(state)
  );
  const dispatch = useDispatch<AppDispatch>();
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteCardDialogOpen, setIsDeleteCardDialogOpen] = useState(false);
  const [isDeleteDeckDialogOpen, setIsDeleteDeckDialogOpen] = useState(false);
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
  const router = useRouter();

  const handlePrevious = () => {
    if (!deck || cards.length === 0) return;
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev === 0 ? cards.length - 1 : prev - 1));
  };

  const handleNext = () => {
    if (!deck || cards.length === 0) return;
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev === cards.length - 1 ? 0 : prev + 1));
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleToggleStar = () => {
    if (!deck || cards.length === 0) return;
    const updatedCard = {
      ...cards[currentCardIndex],
      starred: !cards[currentCardIndex].starred,
      version: incrementVersionInLocalStorage(),
      updatedAt: new Date().toISOString(),
    };

    dispatch(updateCard(updatedCard));
  };

  const handleEditCard = (card: CardType) => {
    setEditingCard({ ...card });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (!deck || !editingCard) return;
    dispatch(updateCard(editingCard));
    setIsEditDialogOpen(false);
    setEditingCard(null);
  };

  const handleDeleteCard = (cardId: string) => {
    setDeletingCardId(cardId);
    setIsDeleteCardDialogOpen(true);
  };

  const handleDeleteDeck = () => {
    setIsDeleteDeckDialogOpen(true);
  };

  const confirmDeleteCard = () => {
    if (!deck || !deletingCardId) return;

    dispatch(deleteSoftCard(deletingCardId));

    setIsDeleteCardDialogOpen(false);
    setDeletingCardId(null);

    if (currentCardIndex >= cards.length - 1) {
      setCurrentCardIndex(Math.max(0, cards.length - 2));
    }
  };

  const confirmDeleteDeck = () => {
    if (!deck) return;
    dispatch(deleteSoftDeck(deckId));
    setIsDeleteDeckDialogOpen(false);
    router.push("/dashboard");
  };

  const handleAddCard = async () => {
    if (!deck || !newCard.front.trim() || !newCard.back.trim()) return;
    const version = await incrementVersionInLocalStorage();
    const card: CardType = {
      _id: generateUUID(),
      front: newCard.front,
      back: newCard.back,
      deckId: deck._id,
      isDelete: false,
      starred: false,
      version: version,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    dispatch(addCard(card));
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

  const handleSaveDeckSettings = async () => {
    if (!deck || !deckSettings.name.trim()) return;
    const version = await incrementVersionInLocalStorage();
    dispatch(
      updateDeck({
        ...deck,
        name: deckSettings.name,
        description: deckSettings.description,
        version: version,
      })
    );
    setIsDeckSettingsOpen(false);
  };

  useEffect(() => {
    dispatch(fetchDecks());
    dispatch(fetchCards());
    setIsLoading(false);
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">Đang tải...</div>
    );
  }

  if (!deck) {
    return <div>Không tìm thấy bộ thẻ</div>;
  }

  const currentCard = cards[currentCardIndex];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div>
            <h1 className="text-2xl font-bold">{deck.name}</h1>
            {deck.description && (
              <p className="text-muted-foreground">{deck.description}</p>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleOpenDeckSettings}
            title="Cài đặt bộ thẻ"
          >
            <Settings className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDeleteDeck()}
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Xóa</span>
          </Button>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            {cards.length} thẻ
          </span>
        </div>
      </div>

      {cards.length === 0 ? (
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
      ) : (
        <>
          <div
            className={`mx-auto transition-all duration-300 w-full max-w-2xl`}
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
                    <p className="text-2xl font-semibold">
                      {currentCard.front}
                    </p>
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
          <div>
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
            <div className="text-center text-sm text-muted-foreground">
              Thẻ {currentCardIndex + 1} / {cards.length}
            </div>
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
                      <TableHead className="w-[100px] text-right">
                        Thao tác
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cards.map((card, index) => (
                      <TableRow key={card._id}>
                        <TableCell className="font-medium">
                          {index + 1}
                        </TableCell>
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
                              onClick={() => handleDeleteCard(card._id)}
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
                          setEditingCard({
                            ...editingCard,
                            front: e.target.value,
                          })
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
                          setEditingCard({
                            ...editingCard,
                            back: e.target.value,
                          })
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
          </div>
        </>
      )}

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
        open={isDeleteCardDialogOpen}
        onOpenChange={setIsDeleteCardDialogOpen}
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
              onClick={confirmDeleteCard}
              className="bg-destructive text-destructive-foreground"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog xác nhận xóa bộ thẻ */}
      <AlertDialog
        open={isDeleteDeckDialogOpen}
        onOpenChange={setIsDeleteDeckDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Bạn có chắc chắn muốn xóa bộ thẻ này?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteDeck}
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

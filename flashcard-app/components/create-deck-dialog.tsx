'use client';

import type React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { addDeck } from '@/store/deckSlice';
import { DeckType } from '@/store/type';
import { generateUUID } from '@/store/indexedDB';
import { AppDispatch } from '@/store';

type CreateDeckDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CreateDeckDialog({
  open,
  onOpenChange,
}: CreateDeckDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [deckData, setDeckData] = useState({
    name: '',
    description: '',
  });

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setDeckData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!deckData.name.trim()) return;

    setIsLoading(true);

    // Tạo ID giả định
    const newDeck: DeckType = {
      _id: generateUUID(),
      name: deckData.name.trim(),
      description: deckData.description.trim(),
      isDelete: false,
      starred: false,
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    dispatch(addDeck(newDeck));

    setTimeout(() => {
      setIsLoading(false);
      onOpenChange(false);
      setDeckData({ name: '', description: '' });
      router.push(`/dashboard/deck/${newDeck._id}`);
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tạo bộ thẻ mới</DialogTitle>
          <DialogDescription>
            Tạo một bộ thẻ mới để bắt đầu học tập.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Tên bộ thẻ</Label>
            <Input
              id="name"
              name="name"
              value={deckData.name}
              onChange={handleChange}
              placeholder="Nhập tên bộ thẻ"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Mô tả (tùy chọn)</Label>
            <Textarea
              id="description"
              name="description"
              value={deckData.description}
              onChange={handleChange}
              placeholder="Nhập mô tả cho bộ thẻ"
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading || !deckData.name.trim()}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang tạo...
              </>
            ) : (
              'Tạo bộ thẻ'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

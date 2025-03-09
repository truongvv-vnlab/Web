// 'use client';

// import { useState } from 'react';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Textarea } from '@/components/ui/textarea';
// import {
//   ChevronLeft,
//   ChevronRight,
//   Shuffle,
//   Star,
//   Plus,
//   X,
// } from 'lucide-react';

// // Mẫu dữ liệu cho các thẻ
// const initialCards = [
//   { id: '1', front: 'Hello', back: 'Xin chào', starred: false },
//   { id: '2', front: 'Goodbye', back: 'Tạm biệt', starred: true },
//   { id: '3', front: 'Thank you', back: 'Cảm ơn', starred: false },
//   { id: '4', front: 'Sorry', back: 'Xin lỗi', starred: false },
//   { id: '5', front: 'Yes', back: 'Có', starred: true },
// ];

// export function FlashcardDeck() {
//   const [cards, setCards] = useState(initialCards);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [isFlipped, setIsFlipped] = useState(false);
//   const [isAdding, setIsAdding] = useState(false);
//   const [newCardFront, setNewCardFront] = useState('');
//   const [newCardBack, setNewCardBack] = useState('');

//   const currentCard = cards[currentIndex];

//   const handlePrevious = () => {
//     setIsFlipped(false);
//     setCurrentIndex((prev) => (prev === 0 ? cards.length - 1 : prev - 1));
//   };

//   const handleNext = () => {
//     setIsFlipped(false);
//     setCurrentIndex((prev) => (prev === cards.length - 1 ? 0 : prev + 1));
//   };

//   const handleFlip = () => {
//     setIsFlipped(!isFlipped);
//   };

//   const handleShuffle = () => {
//     setIsFlipped(false);
//     const shuffled = [...cards].sort(() => Math.random() - 0.5);
//     setCards(shuffled);
//     setCurrentIndex(0);
//   };

//   const handleToggleStar = () => {
//     const updatedCards = [...cards];
//     updatedCards[currentIndex] = {
//       ...updatedCards[currentIndex],
//       starred: !updatedCards[currentIndex].starred,
//     };
//     setCards(updatedCards);
//   };

//   const handleAddCard = () => {
//     if (newCardFront.trim() && newCardBack.trim()) {
//       const newCard = {
//         id: Date.now().toString(),
//         front: newCardFront,
//         back: newCardBack,
//         starred: false,
//       };
//       setCards([...cards, newCard]);
//       setNewCardFront('');
//       setNewCardBack('');
//       setIsAdding(false);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center space-y-6">
//       {/* Khu vực hiển thị flip card */}
//       <div className="w-full max-w-md">
//         <div
//           className="relative h-64 w-full cursor-pointer perspective-1000"
//           onClick={handleFlip}
//         >
//           <div
//             className={`absolute inset-0 transform-style-3d transition-transform duration-500 ${
//               isFlipped ? 'rotate-y-180' : ''
//             }`}
//           >
//             <Card className="absolute inset-0 backface-hidden">
//               <CardContent className="flex h-full items-center justify-center p-6">
//                 <p className="text-2xl font-semibold">{currentCard.front}</p>
//               </CardContent>
//             </Card>
//             <Card className="absolute inset-0 backface-hidden rotate-y-180">
//               <CardContent className="flex h-full items-center justify-center p-6">
//                 <p className="text-2xl font-semibold">{currentCard.back}</p>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </div>

//       {/* Khu vực action */}
//       <div className="flex w-full max-w-md justify-between">
//         <Button variant="outline" size="icon" onClick={handlePrevious}>
//           <ChevronLeft className="h-4 w-4" />
//           <span className="sr-only">Trước</span>
//         </Button>
//         <Button variant="outline" size="icon" onClick={handleShuffle}>
//           <Shuffle className="h-4 w-4" />
//           <span className="sr-only">Tráo đổi</span>
//         </Button>
//         <Button
//           variant="outline"
//           size="icon"
//           onClick={handleToggleStar}
//           className={currentCard.starred ? 'text-yellow-500' : ''}
//         >
//           <Star
//             className="h-4 w-4"
//             fill={currentCard.starred ? 'currentColor' : 'none'}
//           />
//           <span className="sr-only">Đánh dấu sao</span>
//         </Button>
//         <Button variant="outline" size="icon" onClick={handleNext}>
//           <ChevronRight className="h-4 w-4" />
//           <span className="sr-only">Sau</span>
//         </Button>
//       </div>

//       {/* Thông tin thẻ */}
//       <div className="text-center text-sm text-muted-foreground">
//         Thẻ {currentIndex + 1} / {cards.length}
//       </div>

//       {/* Khu vực input card */}
//       <div className="w-full max-w-md">
//         {!isAdding ? (
//           <Button
//             variant="outline"
//             className="w-full"
//             onClick={() => setIsAdding(true)}
//           >
//             <Plus className="mr-2 h-4 w-4" />
//             Thêm thẻ mới
//           </Button>
//         ) : (
//           <Card className="w-full">
//             <CardContent className="p-4 space-y-4">
//               <div className="flex justify-between items-center">
//                 <h3 className="font-medium">Thêm thẻ mới</h3>
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   onClick={() => setIsAdding(false)}
//                 >
//                   <X className="h-4 w-4" />
//                 </Button>
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="front">Mặt trước</Label>
//                 <Input
//                   id="front"
//                   value={newCardFront}
//                   onChange={(e) => setNewCardFront(e.target.value)}
//                   placeholder="Nhập nội dung mặt trước"
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="back">Mặt sau</Label>
//                 <Textarea
//                   id="back"
//                   value={newCardBack}
//                   onChange={(e) => setNewCardBack(e.target.value)}
//                   placeholder="Nhập nội dung mặt sau"
//                   rows={3}
//                 />
//               </div>
//               <Button onClick={handleAddCard} className="w-full">
//                 Thêm thẻ
//               </Button>
//             </CardContent>
//           </Card>
//         )}
//       </div>
//     </div>
//   );
// }

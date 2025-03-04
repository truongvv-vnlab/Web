import { FlashcardDeck } from "@/components/flashcard-deck"

export default function DashboardPage() {
  return (
    <div className="h-full flex-1 overflow-auto p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-6">Bộ thẻ của tôi</h1>
      <FlashcardDeck />
    </div>
  )
}


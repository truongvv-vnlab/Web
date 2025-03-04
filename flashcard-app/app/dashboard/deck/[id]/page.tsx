import { DeckDetail } from "@/components/deck-detail";

export default function DeckDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="h-full flex-1 overflow-auto p-4 md:p-6">
      <DeckDetail deckId={params.id} />
    </div>
  );
}

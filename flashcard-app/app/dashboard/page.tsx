import { StarredCards } from "@/components/starred-cards";

export default function StarredPage() {
  return (
    <div className="h-full flex-1 overflow-auto p-4 md:p-6 ">
      <h1 className="text-2xl font-bold mb-6 bg-background">
        Thẻ đã đánh dấu sao
      </h1>
      <StarredCards />
    </div>
  );
}

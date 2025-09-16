export default function Loading() {
  return (
    <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {[...Array(16)].map((_, i) => (
        <div
          key={i}
          className="divide-y divide-[#898989]/10 overflow-hidden border border-[#898989]/20"
        >
          <div className="group aspect-video animate-pulse bg-[#1F1F20]" />
          <div className="h-[97px] space-y-1 p-2">
            <div className="h-3 w-full animate-pulse bg-[#898989]/10" />
            <div className="h-3 w-full animate-pulse bg-[#898989]/10" />
            <div className="h-3 w-full animate-pulse bg-[#898989]/10" />
            <div className="h-3 w-full animate-pulse bg-[#898989]/10" />
            <div className="h-3 w-full animate-pulse bg-[#898989]/10" />
          </div>
        </div>
      ))}
    </div>
  );
}

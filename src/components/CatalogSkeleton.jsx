export default function CatalogSkeleton() {
  const cards = [1, 2, 3];

  return (
    <div className="space-y-16">
      {cards.map((i) => (
        <div key={i} className="flex flex-col md:flex-row bg-white border border-outline-variant/30 overflow-hidden rounded-lg">
          <div className="md:w-3/5 h-[300px] md:h-[500px] skeleton-shimmer" />
          <div className="md:w-2/5 p-8 md:p-12 flex flex-col justify-between space-y-6">
            <div className="space-y-6">
              <div className="h-3 w-24 skeleton-shimmer rounded" />
              <div className="h-6 w-3/4 skeleton-shimmer rounded" />
              <div className="space-y-4 pt-4">
                {[1, 2, 3, 4].map((s) => (
                  <div key={s} className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
                    <div className="h-3 w-20 skeleton-shimmer rounded" />
                    <div className="h-3 w-16 skeleton-shimmer rounded" />
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-5">
              <div className="h-3 w-28 skeleton-shimmer rounded" />
              <div className="h-5 w-36 skeleton-shimmer rounded" />
              <div className="h-14 w-full skeleton-shimmer rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

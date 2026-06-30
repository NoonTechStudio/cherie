export default function DashboardLoading() {
  return (
    <div className="space-y-5 animate-pulse">
      {/* Stat cards skeleton */}
      <div className="grid grid-cols-2 gap-3">
        {[0, 1].map((i) => (
          <div key={i} className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="w-8 h-8 rounded-full bg-gray-100 mb-3" />
            <div className="h-8 w-12 bg-gray-100 rounded mb-2" />
            <div className="h-3 w-16 bg-gray-100 rounded" />
          </div>
        ))}
      </div>

      {/* Upcoming skeleton */}
      <div>
        <div className="h-5 w-24 bg-gray-100 rounded mb-3" />
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3.5 border-b border-[#E5E5EA] last:border-0">
              <div className="w-10 h-10 rounded-full bg-gray-100 shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3.5 w-32 bg-gray-100 rounded" />
                <div className="h-3 w-24 bg-gray-100 rounded" />
              </div>
              <div className="h-3 w-12 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

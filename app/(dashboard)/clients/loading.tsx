export default function ClientsLoading() {
  return (
    <div className="space-y-3 animate-pulse">
      <div className="h-10 w-full bg-gray-100 rounded-xl" />
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-100 shrink-0" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3.5 w-32 bg-gray-100 rounded" />
            <div className="h-3 w-20 bg-gray-100 rounded" />
          </div>
          <div className="h-3 w-8 bg-gray-100 rounded" />
        </div>
      ))}
    </div>
  )
}

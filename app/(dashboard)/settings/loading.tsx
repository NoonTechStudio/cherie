export default function SettingsLoading() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-5 w-24 bg-gray-100 rounded" />
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-2xl shadow-sm p-4 space-y-3">
          <div className="h-3.5 w-28 bg-gray-100 rounded" />
          <div className="h-10 w-full bg-gray-100 rounded-xl" />
        </div>
      ))}
      <div className="h-12 w-full bg-gray-100 rounded-2xl" />
    </div>
  )
}

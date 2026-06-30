import Image from 'next/image'

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 text-center">
      <Image src="/icons/icon-192x192.png" alt="Chérie" width={80} height={80} className="mb-6 rounded-2xl" />
      <h1 className="text-[22px] font-bold text-[#1C1C1E] mb-2">You're offline</h1>
      <p className="text-[14px] text-[#8E8E93] max-w-xs">
        No internet connection. Please check your network and try again.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="mt-6 bg-[#6B0F1A] text-white text-[15px] font-semibold px-6 py-3 rounded-2xl"
      >
        Try again
      </button>
    </div>
  )
}

'use client'

import { Search, X } from 'lucide-react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative flex items-center">
      <Search className="absolute left-3 w-4 h-4 text-[#8E8E93] pointer-events-none" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by name or mobile"
        className="w-full bg-white rounded-xl pl-9 pr-9 py-2.5 text-[14px] text-[#1C1C1E] placeholder:text-[#C7C7CC] shadow-sm outline-none"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 w-4 h-4 text-[#8E8E93] flex items-center justify-center"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  )
}

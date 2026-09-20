import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiSearch } from 'react-icons/fi'

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const q = query.trim()
    if (q.length > 0) {
      navigate(`/browse?query=${encodeURIComponent(q)}`)
    } else {
      navigate('/browse')
    }
  }

  return (
    <form onSubmit={onSubmit} className="relative">
      <input
        className="w-full rounded-md border border-gray-300 bg-white px-10 py-2 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:black"
        placeholder="Search by title, author, or ISBN"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button type="submit" className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-soil-700">
        <FiSearch />
      </button>
    </form>
  )
}



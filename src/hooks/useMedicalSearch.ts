import { useState, useCallback } from 'react'
import { MedicalKnowledgeEntry, SearchResult } from '../types'
import useDebounce from './useDebounce'

interface MedicalSearchOptions {
  specialty?: string
  minRelevanceScore?: number
  maxResults?: number
}

/**
 * Custom hook for searching medical knowledge base
 * @param initialQuery - Initial search query
 * @param options - Search options
 * @returns Search state and functions
 */
const useMedicalSearch = (initialQuery = '', options: MedicalSearchOptions = {}) => {
  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const debouncedQuery = useDebounce(query, 300)

  const searchMedicalDatabase = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // This would typically make a call to your medical search API
      // For now, we'll simulate the search functionality
      const response = await fetch('/api/medical/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: searchQuery,
          ...options
        })
      })

      if (!response.ok) {
        throw new Error('Search failed')
      }

      const searchResults: SearchResult[] = await response.json()
      setResults(searchResults)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed')
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }, [options])

  // Perform search when debounced query changes
  React.useEffect(() => {
    if (debouncedQuery) {
      searchMedicalDatabase(debouncedQuery)
    }
  }, [debouncedQuery, searchMedicalDatabase])

  const clearSearch = useCallback(() => {
    setQuery('')
    setResults([])
    setError(null)
  }, [])

  return {
    query,
    setQuery,
    results,
    isLoading,
    error,
    clearSearch,
    searchMedicalDatabase
  }
}

export default useMedicalSearch
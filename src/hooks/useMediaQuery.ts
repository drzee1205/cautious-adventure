import { useState, useEffect } from 'react'

/**
 * Custom hook for responsive design with media queries
 * @param query - The media query string
 * @returns Boolean indicating if the media query matches
 */
const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState<boolean>(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    
    if (media.matches !== matches) {
      setMatches(media.matches)
    }
    
    const listener = () => setMatches(media.matches)
    
    // Modern browsers
    if (media.addEventListener) {
      media.addEventListener('change', listener)
    } else {
      // Legacy browsers
      media.addListener(listener)
    }
    
    return () => {
      if (media.removeEventListener) {
        media.removeEventListener('change', listener)
      } else {
        media.removeListener(listener)
      }
    }
  }, [matches, query])

  return matches
}

export default useMediaQuery
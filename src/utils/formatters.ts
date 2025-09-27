import { format, formatDistanceToNow, isToday, isYesterday, parseISO } from 'date-fns'

/**
 * Format date for chat timestamps
 */
export const formatChatTimestamp = (date: Date | string): string => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date
  
  if (isToday(parsedDate)) {
    return format(parsedDate, 'HH:mm')
  } else if (isYesterday(parsedDate)) {
    return `Yesterday ${format(parsedDate, 'HH:mm')}`
  } else {
    return format(parsedDate, 'MMM dd, yyyy HH:mm')
  }
}

/**
 * Format relative time (e.g., "2 minutes ago")
 */
export const formatRelativeTime = (date: Date | string): string => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date
  return formatDistanceToNow(parsedDate, { addSuffix: true })
}

/**
 * Format medical confidence score as percentage
 */
export const formatConfidence = (confidence: number): string => {
  return `${Math.round(confidence * 100)}%`
}

/**
 * Format response time in appropriate units
 */
export const formatResponseTime = (timeMs: number): string => {
  if (timeMs < 1000) {
    return `${timeMs}ms`
  } else if (timeMs < 60000) {
    return `${(timeMs / 1000).toFixed(1)}s`
  } else {
    const minutes = Math.floor(timeMs / 60000)
    const seconds = ((timeMs % 60000) / 1000).toFixed(0)
    return `${minutes}m ${seconds}s`
  }
}

/**
 * Format file size in human-readable format
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength - 3) + '...'
}

/**
 * Format medical citation
 */
export const formatCitation = (citation: {
  source: string
  chapter: string
  page?: number
}): string => {
  const page = citation.page ? `, p. ${citation.page}` : ''
  return `${citation.source}, ${citation.chapter}${page}`
}
import { describe, it, expect } from 'vitest'
import {
  formatChatTimestamp,
  formatRelativeTime,
  formatConfidence,
  formatResponseTime,
  formatFileSize,
  truncateText,
  formatCitation
} from '../../utils/formatters'

describe('Formatters', () => {
  describe('formatChatTimestamp', () => {
    it('should format today\'s timestamp with time only', () => {
      const today = new Date()
      const result = formatChatTimestamp(today)
      expect(result).toMatch(/^\d{2}:\d{2}$/)
    })

    it('should format yesterday\'s timestamp with "Yesterday" prefix', () => {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const result = formatChatTimestamp(yesterday)
      expect(result).toMatch(/^Yesterday \d{2}:\d{2}$/)
    })

    it('should format older dates with full date', () => {
      const oldDate = new Date('2023-01-15T10:30:00Z')
      const result = formatChatTimestamp(oldDate)
      expect(result).toMatch(/^Jan \d{2}, \d{4} \d{2}:\d{2}$/)
    })
  })

  describe('formatConfidence', () => {
    it('should format confidence as percentage', () => {
      expect(formatConfidence(0.85)).toBe('85%')
      expect(formatConfidence(0.1)).toBe('10%')
      expect(formatConfidence(1)).toBe('100%')
    })
  })

  describe('formatResponseTime', () => {
    it('should format milliseconds', () => {
      expect(formatResponseTime(500)).toBe('500ms')
    })

    it('should format seconds', () => {
      expect(formatResponseTime(2500)).toBe('2.5s')
    })

    it('should format minutes and seconds', () => {
      expect(formatResponseTime(125000)).toBe('2m 5s')
    })
  })

  describe('formatFileSize', () => {
    it('should format bytes', () => {
      expect(formatFileSize(0)).toBe('0 Bytes')
      expect(formatFileSize(512)).toBe('512 Bytes')
    })

    it('should format kilobytes', () => {
      expect(formatFileSize(1024)).toBe('1 KB')
      expect(formatFileSize(1536)).toBe('1.5 KB')
    })

    it('should format megabytes', () => {
      expect(formatFileSize(1048576)).toBe('1 MB')
      expect(formatFileSize(2621440)).toBe('2.5 MB')
    })
  })

  describe('truncateText', () => {
    it('should return original text if shorter than limit', () => {
      const text = 'Short text'
      expect(truncateText(text, 20)).toBe(text)
    })

    it('should truncate text and add ellipsis', () => {
      const text = 'This is a very long text that should be truncated'
      expect(truncateText(text, 20)).toBe('This is a very lo...')
    })
  })

  describe('formatCitation', () => {
    it('should format citation with page number', () => {
      const citation = {
        source: 'Nelson Textbook of Pediatrics',
        chapter: 'Chapter 12: Cardiovascular System',
        page: 145
      }
      expect(formatCitation(citation)).toBe(
        'Nelson Textbook of Pediatrics, Chapter 12: Cardiovascular System, p. 145'
      )
    })

    it('should format citation without page number', () => {
      const citation = {
        source: 'Nelson Textbook of Pediatrics',
        chapter: 'Chapter 8: Neurology'
      }
      expect(formatCitation(citation)).toBe(
        'Nelson Textbook of Pediatrics, Chapter 8: Neurology'
      )
    })
  })
})
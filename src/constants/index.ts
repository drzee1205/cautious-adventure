// Application constants
export const APP_NAME = 'Nelson-GPT'
export const APP_DESCRIPTION = 'Smart Pediatric Medical Assistant'
export const APP_VERSION = '1.0.0'

// API endpoints
export const API_ENDPOINTS = {
  MEDICAL_SEARCH: '/api/medical/search',
  CONVERSATIONS: '/api/conversations',
  MEDICAL_DATA: '/api/medical/data',
  EMBEDDINGS: '/api/medical/embeddings'
} as const

// Medical specialties
export const MEDICAL_SPECIALTIES = [
  { value: 'general', label: 'General Pediatrics' },
  { value: 'cardiology', label: 'Pediatric Cardiology' },
  { value: 'neurology', label: 'Pediatric Neurology' },
  { value: 'endocrinology', label: 'Pediatric Endocrinology' },
  { value: 'emergency', label: 'Pediatric Emergency Medicine' },
  { value: 'infectious_disease', label: 'Pediatric Infectious Disease' },
  { value: 'gastroenterology', label: 'Pediatric Gastroenterology' },
  { value: 'pulmonology', label: 'Pediatric Pulmonology' },
  { value: 'hematology', label: 'Pediatric Hematology' },
  { value: 'oncology', label: 'Pediatric Oncology' },
  { value: 'nephrology', label: 'Pediatric Nephrology' },
  { value: 'rheumatology', label: 'Pediatric Rheumatology' },
  { value: 'dermatology', label: 'Pediatric Dermatology' },
  { value: 'psychiatry', label: 'Pediatric Psychiatry' }
] as const

// User roles
export const USER_ROLES = [
  { value: 'pediatrician', label: 'Pediatrician' },
  { value: 'specialist', label: 'Pediatric Specialist' },
  { value: 'resident', label: 'Pediatric Resident' },
  { value: 'student', label: 'Medical Student' },
  { value: 'nurse', label: 'Pediatric Nurse' },
  { value: 'admin', label: 'Administrator' }
] as const

// Response styles
export const RESPONSE_STYLES = [
  { value: 'detailed', label: 'Detailed', description: 'Comprehensive explanations with full context' },
  { value: 'concise', label: 'Concise', description: 'Brief, direct answers' },
  { value: 'educational', label: 'Educational', description: 'Teaching-focused with explanations' },
  { value: 'clinical', label: 'Clinical', description: 'Protocol-focused, actionable guidance' }
] as const

// Theme options
export const THEME_OPTIONS = [
  { value: 'light', label: 'Light', description: 'Clean, bright interface' },
  { value: 'dark', label: 'Dark', description: 'Dark theme for low-light environments' },
  { value: 'system', label: 'System', description: 'Follow system preference' }
] as const

// Font sizes
export const FONT_SIZES = [
  { value: 12, label: 'Small' },
  { value: 14, label: 'Default' },
  { value: 16, label: 'Medium' },
  { value: 18, label: 'Large' },
  { value: 20, label: 'Extra Large' }
] as const

// Language options
export const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
  { value: 'fr', label: 'Français' },
  { value: 'de', label: 'Deutsch' },
  { value: 'pt', label: 'Português' },
  { value: 'zh', label: '中文' }
] as const

// Keyboard shortcuts
export const KEYBOARD_SHORTCUTS = {
  NEW_CHAT: 'ctrl+shift+o',
  SEARCH: 'ctrl+k',
  SETTINGS: 'ctrl+comma',
  TOGGLE_THEME: 'ctrl+shift+l',
  TOGGLE_SIDEBAR: 'ctrl+shift+s',
  FOCUS_INPUT: 'ctrl+shift+i'
} as const

// Local storage keys
export const STORAGE_KEYS = {
  THEME: 'nelson-gpt-theme',
  SETTINGS: 'nelson-gpt-settings',
  CONVERSATIONS: 'nelson-gpt-conversations',
  USER_PREFERENCES: 'nelson-gpt-user-preferences',
  DRAFT_MESSAGE: 'nelson-gpt-draft-message'
} as const

// Chat limits
export const CHAT_LIMITS = {
  MAX_MESSAGE_LENGTH: 4000,
  MAX_CONVERSATIONS: 100,
  MAX_MESSAGES_PER_CONVERSATION: 1000,
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  SUPPORTED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf', 'text/plain']
} as const

// Animation durations (ms)
export const ANIMATION_DURATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  TYPING_INDICATOR: 1500
} as const

// Breakpoints (matching Tailwind CSS defaults)
export const BREAKPOINTS = {
  SM: '640px',
  MD: '768px',
  LG: '1024px',
  XL: '1280px',
  '2XL': '1536px'
} as const

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  AUTH_REQUIRED: 'Authentication required. Please log in.',
  PERMISSION_DENIED: 'Permission denied. Contact administrator.',
  FILE_TOO_LARGE: 'File size exceeds maximum limit.',
  INVALID_FILE_TYPE: 'File type not supported.',
  MESSAGE_TOO_LONG: 'Message exceeds maximum length.',
  RATE_LIMIT_EXCEEDED: 'Rate limit exceeded. Please try again later.',
  GENERIC_ERROR: 'An unexpected error occurred. Please try again.'
} as const
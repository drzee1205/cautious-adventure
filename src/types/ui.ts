export type Theme = 'light' | 'dark' | 'system'

export interface ThemeState {
  theme: Theme
  systemPreference: 'light' | 'dark'
}

export interface ThemeActions {
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

export interface LoadingState {
  isLoading: boolean
  loadingText?: string
  progress?: number
}

export interface ErrorState {
  error: string | null
  errorCode?: string
  timestamp?: Date
}

export interface ToastMessage {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
  action?: ToastAction
}

export interface ToastAction {
  label: string
  onClick: () => void
}

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  className?: string
}

export interface ButtonVariant {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

export interface InputProps {
  label?: string
  error?: string
  helperText?: string
  required?: boolean
  disabled?: boolean
  placeholder?: string
}

export interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
  width?: number
}

export interface NavigationItem {
  id: string
  label: string
  href: string
  icon?: React.ComponentType
  badge?: string | number
  children?: NavigationItem[]
}

export interface SearchResult {
  id: string
  type: 'conversation' | 'message' | 'medical_content'
  title: string
  content: string
  highlights?: string[]
  relevanceScore: number
  metadata?: Record<string, any>
}
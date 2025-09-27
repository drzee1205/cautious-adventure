export interface User {
  id: string
  email: string
  name?: string
  avatar?: string
  role: UserRole
  medicalCredentials?: MedicalCredentials
  preferences?: UserPreferences
  createdAt: Date
  lastLoginAt?: Date
}

export enum UserRole {
  PEDIATRICIAN = 'pediatrician',
  SPECIALIST = 'specialist',
  RESIDENT = 'resident',
  STUDENT = 'student',
  NURSE = 'nurse',
  ADMIN = 'admin'
}

export interface MedicalCredentials {
  licenseNumber?: string
  specialty?: string
  institution?: string
  verificationStatus: 'pending' | 'verified' | 'rejected'
  verifiedAt?: Date
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  language: string
  fontSize: number
  responseStyle: 'detailed' | 'concise' | 'educational'
  medicalSpecialty?: string
  notifications: NotificationSettings
  accessibility: AccessibilitySettings
}

export interface NotificationSettings {
  emailNotifications: boolean
  pushNotifications: boolean
  medicalUpdates: boolean
  systemAlerts: boolean
  newsletterSubscription: boolean
}

export interface AccessibilitySettings {
  highContrast: boolean
  reducedMotion: boolean
  screenReaderOptimized: boolean
  keyboardNavigation: boolean
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  error: string | null
}

export interface AuthActions {
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  signup: (email: string, password: string, userData: Partial<User>) => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updateProfile: (updates: Partial<User>) => Promise<void>
  setUser: (user: User | null) => void
  setError: (error: string | null) => void
  setLoading: (loading: boolean) => void
}
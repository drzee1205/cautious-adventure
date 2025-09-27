import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface MedicalSettings {
  responseStyle: 'detailed' | 'concise' | 'educational'
  showCitations: boolean
  citationFormat: 'inline' | 'footnote' | 'end'
  disclaimerFrequency: 'always' | 'first' | 'never'
  specialization: 'general' | 'cardiology' | 'neurology' | 'endocrinology' | 'emergency'
  autoSave: boolean
  exportFormat: 'markdown' | 'pdf' | 'json'
}

export interface AccessibilitySettings {
  fontSize: number // 12-20px range
  fontFamily: 'inter' | 'system' | 'atkinson' | 'opendyslexic'
  highContrast: boolean
  reducedMotion: boolean
  focusIndicators: boolean
  screenReaderOptimized: boolean
}

export interface NotificationSettings {
  newFeatures: boolean
  updates: boolean
  medicalReminders: boolean
  emailNotifications: boolean
}

export interface SettingsStore {
  medical: MedicalSettings
  accessibility: AccessibilitySettings
  notifications: NotificationSettings
  
  updateMedicalSettings: (settings: Partial<MedicalSettings>) => void
  updateAccessibilitySettings: (settings: Partial<AccessibilitySettings>) => void
  updateNotificationSettings: (settings: Partial<NotificationSettings>) => void
  resetToDefaults: () => void
  importSettings: (settings: any) => void
  exportSettings: () => any
}

const defaultMedicalSettings: MedicalSettings = {
  responseStyle: 'detailed',
  showCitations: true,
  citationFormat: 'inline',
  disclaimerFrequency: 'first',
  specialization: 'general',
  autoSave: true,
  exportFormat: 'markdown'
}

const defaultAccessibilitySettings: AccessibilitySettings = {
  fontSize: 16,
  fontFamily: 'inter',
  highContrast: false,
  reducedMotion: false,
  focusIndicators: true,
  screenReaderOptimized: false
}

const defaultNotificationSettings: NotificationSettings = {
  newFeatures: true,
  updates: true,
  medicalReminders: false,
  emailNotifications: false
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      medical: defaultMedicalSettings,
      accessibility: defaultAccessibilitySettings,
      notifications: defaultNotificationSettings,
      
      updateMedicalSettings: (settings) => {
        set((state) => ({
          medical: { ...state.medical, ...settings }
        }))
      },
      
      updateAccessibilitySettings: (settings) => {
        set((state) => ({
          accessibility: { ...state.accessibility, ...settings }
        }))
      },
      
      updateNotificationSettings: (settings) => {
        set((state) => ({
          notifications: { ...state.notifications, ...settings }
        }))
      },
      
      resetToDefaults: () => {
        set({
          medical: defaultMedicalSettings,
          accessibility: defaultAccessibilitySettings,
          notifications: defaultNotificationSettings
        })
      },
      
      importSettings: (settings) => {
        if (settings.medical) {
          set((state) => ({
            medical: { ...state.medical, ...settings.medical }
          }))
        }
        if (settings.accessibility) {
          set((state) => ({
            accessibility: { ...state.accessibility, ...settings.accessibility }
          }))
        }
        if (settings.notifications) {
          set((state) => ({
            notifications: { ...state.notifications, ...settings.notifications }
          }))
        }
      },
      
      exportSettings: () => {
        const state = get()
        return {
          medical: state.medical,
          accessibility: state.accessibility,
          notifications: state.notifications,
          exportDate: new Date().toISOString(),
          version: '1.0.0'
        }
      }
    }),
    {
      name: 'nelson-gpt-settings'
    }
  )
)
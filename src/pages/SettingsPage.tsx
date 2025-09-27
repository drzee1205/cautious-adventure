import React, { useState } from 'react'
import { 
  Settings, 
  User, 
  Bell, 
  Eye, 
  Download, 
  Upload, 
  RefreshCw,
  Shield,
  Info,
  LogOut
} from 'lucide-react'
import { useSettingsStore } from '../stores/settingsStore'
import { useThemeStore } from '../stores/themeStore'
import { useAuthStore } from '../stores/authStore'
import { motion, AnimatePresence } from 'framer-motion'

const SettingsPage: React.FC = () => {
  const { 
    medical, 
    accessibility, 
    notifications,
    updateMedicalSettings,
    updateAccessibilitySettings,
    updateNotificationSettings,
    resetToDefaults,
    exportSettings,
    importSettings
  } = useSettingsStore()
  
  const { theme, setTheme } = useThemeStore()
  const { user, logout } = useAuthStore()
  const [activeSection, setActiveSection] = useState('general')
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  const sections = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'medical', label: 'Medical', icon: User },
    { id: 'accessibility', label: 'Accessibility', icon: Eye },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security & Privacy', icon: Shield },
    { id: 'about', label: 'About', icon: Info }
  ]

  const handleExportSettings = () => {
    const settings = exportSettings()
    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `nelson-gpt-settings-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImportSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const settings = JSON.parse(e.target?.result as string)
          importSettings(settings)
          alert('Settings imported successfully!')
        } catch (error) {
          alert('Error importing settings. Please check the file format.')
        }
      }
      reader.readAsText(file)
    }
  }

  const handleResetSettings = () => {
    resetToDefaults()
    setShowResetConfirm(false)
    alert('Settings have been reset to defaults.')
  }

  const renderSection = () => {
    switch (activeSection) {
      case 'general':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gpt-text-primary-light dark:text-gpt-text-primary-dark mb-4">
                General Settings
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gpt-text-primary-light dark:text-gpt-text-primary-dark mb-2">
                    Theme
                  </label>
                  <select
                    value={theme}
                    onChange={(e) => setTheme(e.target.value as any)}
                    className="w-full p-3 bg-gpt-bg-light dark:bg-gpt-bg-dark border border-gpt-border-light dark:border-gpt-border-dark rounded-lg text-gpt-text-primary-light dark:text-gpt-text-primary-dark focus:outline-none focus:ring-2 focus:ring-gpt-primary"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="system">System</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gpt-text-primary-light dark:text-gpt-text-primary-dark mb-2">
                    Auto-save conversations
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={medical.autoSave}
                      onChange={(e) => updateMedicalSettings({ autoSave: e.target.checked })}
                      className="rounded border-gpt-border-light dark:border-gpt-border-dark text-gpt-primary focus:ring-gpt-primary"
                    />
                    <span className="text-sm text-gpt-text-secondary-light dark:text-gpt-text-secondary-dark">
                      Automatically save conversations locally
                    </span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gpt-text-primary-light dark:text-gpt-text-primary-dark mb-2">
                    Default export format
                  </label>
                  <select
                    value={medical.exportFormat}
                    onChange={(e) => updateMedicalSettings({ exportFormat: e.target.value as any })}
                    className="w-full p-3 bg-gpt-bg-light dark:bg-gpt-bg-dark border border-gpt-border-light dark:border-gpt-border-dark rounded-lg text-gpt-text-primary-light dark:text-gpt-text-primary-dark focus:outline-none focus:ring-2 focus:ring-gpt-primary"
                  >
                    <option value="markdown">Markdown</option>
                    <option value="pdf">PDF</option>
                    <option value="json">JSON</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Data Management */}
            <div>
              <h3 className="text-lg font-semibold text-gpt-text-primary-light dark:text-gpt-text-primary-dark mb-4">
                Data Management
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gpt-hover-light dark:bg-gpt-hover-dark rounded-lg">
                  <div>
                    <h4 className="font-medium text-gpt-text-primary-light dark:text-gpt-text-primary-dark">
                      Export Settings
                    </h4>
                    <p className="text-sm text-gpt-text-secondary-light dark:text-gpt-text-secondary-dark">
                      Download your settings as a JSON file
                    </p>
                  </div>
                  <button
                    onClick={handleExportSettings}
                    className="flex items-center gap-2 px-4 py-2 bg-gpt-primary text-white rounded-lg hover:bg-gpt-primary-hover transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Export
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gpt-hover-light dark:bg-gpt-hover-dark rounded-lg">
                  <div>
                    <h4 className="font-medium text-gpt-text-primary-light dark:text-gpt-text-primary-dark">
                      Import Settings
                    </h4>
                    <p className="text-sm text-gpt-text-secondary-light dark:text-gpt-text-secondary-dark">
                      Upload settings from a JSON file
                    </p>
                  </div>
                  <label className="flex items-center gap-2 px-4 py-2 bg-gpt-primary text-white rounded-lg hover:bg-gpt-primary-hover transition-colors cursor-pointer">
                    <Upload className="w-4 h-4" />
                    Import
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportSettings}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gpt-hover-light dark:bg-gpt-hover-dark rounded-lg">
                  <div>
                    <h4 className="font-medium text-gpt-text-primary-light dark:text-gpt-text-primary-dark">
                      Reset Settings
                    </h4>
                    <p className="text-sm text-gpt-text-secondary-light dark:text-gpt-text-secondary-dark">
                      Restore all settings to default values
                    </p>
                  </div>
                  <button
                    onClick={() => setShowResetConfirm(true)}
                    className="px-4 py-2 bg-gpt-error text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </div>
        )

      case 'medical':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gpt-text-primary-light dark:text-gpt-text-primary-dark mb-4">
                Medical Preferences
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gpt-text-primary-light dark:text-gpt-text-primary-dark mb-2">
                    Response Style
                  </label>
                  <select
                    value={medical.responseStyle}
                    onChange={(e) => updateMedicalSettings({ responseStyle: e.target.value as any })}
                    className="w-full p-3 bg-gpt-bg-light dark:bg-gpt-bg-dark border border-gpt-border-light dark:border-gpt-border-dark rounded-lg text-gpt-text-primary-light dark:text-gpt-text-primary-dark focus:outline-none focus:ring-2 focus:ring-gpt-primary"
                  >
                    <option value="detailed">Detailed (comprehensive information)</option>
                    <option value="concise">Concise (brief summaries)</option>
                    <option value="educational">Educational (teaching-focused)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gpt-text-primary-light dark:text-gpt-text-primary-dark mb-2">
                    Medical Specialization
                  </label>
                  <select
                    value={medical.specialization}
                    onChange={(e) => updateMedicalSettings({ specialization: e.target.value as any })}
                    className="w-full p-3 bg-gpt-bg-light dark:bg-gpt-bg-dark border border-gpt-border-light dark:border-gpt-border-dark rounded-lg text-gpt-text-primary-light dark:text-gpt-text-primary-dark focus:outline-none focus:ring-2 focus:ring-gpt-primary"
                  >
                    <option value="general">General Pediatrics</option>
                    <option value="cardiology">Pediatric Cardiology</option>
                    <option value="neurology">Pediatric Neurology</option>
                    <option value="endocrinology">Pediatric Endocrinology</option>
                    <option value="emergency">Pediatric Emergency Medicine</option>
                  </select>
                </div>

                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={medical.showCitations}
                      onChange={(e) => updateMedicalSettings({ showCitations: e.target.checked })}
                      className="rounded border-gpt-border-light dark:border-gpt-border-dark text-gpt-primary focus:ring-gpt-primary"
                    />
                    <span className="text-sm text-gpt-text-primary-light dark:text-gpt-text-primary-dark">
                      Show medical citations
                    </span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gpt-text-primary-light dark:text-gpt-text-primary-dark mb-2">
                    Citation Format
                  </label>
                  <select
                    value={medical.citationFormat}
                    onChange={(e) => updateMedicalSettings({ citationFormat: e.target.value as any })}
                    className="w-full p-3 bg-gpt-bg-light dark:bg-gpt-bg-dark border border-gpt-border-light dark:border-gpt-border-dark rounded-lg text-gpt-text-primary-light dark:text-gpt-text-primary-dark focus:outline-none focus:ring-2 focus:ring-gpt-primary"
                  >
                    <option value="inline">Inline citations</option>
                    <option value="footnote">Footnote citations</option>
                    <option value="end">End of response</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gpt-text-primary-light dark:text-gpt-text-primary-dark mb-2">
                    Medical Disclaimer Frequency
                  </label>
                  <select
                    value={medical.disclaimerFrequency}
                    onChange={(e) => updateMedicalSettings({ disclaimerFrequency: e.target.value as any })}
                    className="w-full p-3 bg-gpt-bg-light dark:bg-gpt-bg-dark border border-gpt-border-light dark:border-gpt-border-dark rounded-lg text-gpt-text-primary-light dark:text-gpt-text-primary-dark focus:outline-none focus:ring-2 focus:ring-gpt-primary"
                  >
                    <option value="always">Show on every response</option>
                    <option value="first">Show on first response only</option>
                    <option value="never">Hide disclaimers</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )

      case 'accessibility':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gpt-text-primary-light dark:text-gpt-text-primary-dark mb-4">
                Accessibility Settings
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gpt-text-primary-light dark:text-gpt-text-primary-dark mb-2">
                    Font Size: {accessibility.fontSize}px
                  </label>
                  <input
                    type="range"
                    min="12"
                    max="20"
                    value={accessibility.fontSize}
                    onChange={(e) => updateAccessibilitySettings({ fontSize: parseInt(e.target.value) })}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gpt-text-secondary-light dark:text-gpt-text-secondary-dark mt-1">
                    <span>Small</span>
                    <span>Large</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gpt-text-primary-light dark:text-gpt-text-primary-dark mb-2">
                    Font Family
                  </label>
                  <select
                    value={accessibility.fontFamily}
                    onChange={(e) => updateAccessibilitySettings({ fontFamily: e.target.value as any })}
                    className="w-full p-3 bg-gpt-bg-light dark:bg-gpt-bg-dark border border-gpt-border-light dark:border-gpt-border-dark rounded-lg text-gpt-text-primary-light dark:text-gpt-text-primary-dark focus:outline-none focus:ring-2 focus:ring-gpt-primary"
                  >
                    <option value="inter">Inter (default)</option>
                    <option value="system">System font</option>
                    <option value="atkinson">Atkinson Hyperlegible</option>
                    <option value="opendyslexic">OpenDyslexic</option>
                  </select>
                </div>

                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={accessibility.highContrast}
                      onChange={(e) => updateAccessibilitySettings({ highContrast: e.target.checked })}
                      className="rounded border-gpt-border-light dark:border-gpt-border-dark text-gpt-primary focus:ring-gpt-primary"
                    />
                    <span className="text-sm text-gpt-text-primary-light dark:text-gpt-text-primary-dark">
                      High contrast mode
                    </span>
                  </label>
                </div>

                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={accessibility.reducedMotion}
                      onChange={(e) => updateAccessibilitySettings({ reducedMotion: e.target.checked })}
                      className="rounded border-gpt-border-light dark:border-gpt-border-dark text-gpt-primary focus:ring-gpt-primary"
                    />
                    <span className="text-sm text-gpt-text-primary-light dark:text-gpt-text-primary-dark">
                      Reduce motion and animations
                    </span>
                  </label>
                </div>

                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={accessibility.focusIndicators}
                      onChange={(e) => updateAccessibilitySettings({ focusIndicators: e.target.checked })}
                      className="rounded border-gpt-border-light dark:border-gpt-border-dark text-gpt-primary focus:ring-gpt-primary"
                    />
                    <span className="text-sm text-gpt-text-primary-light dark:text-gpt-text-primary-dark">
                      Enhanced focus indicators
                    </span>
                  </label>
                </div>

                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={accessibility.screenReaderOptimized}
                      onChange={(e) => updateAccessibilitySettings({ screenReaderOptimized: e.target.checked })}
                      className="rounded border-gpt-border-light dark:border-gpt-border-dark text-gpt-primary focus:ring-gpt-primary"
                    />
                    <span className="text-sm text-gpt-text-primary-light dark:text-gpt-text-primary-dark">
                      Screen reader optimization
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )

      case 'notifications':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gpt-text-primary-light dark:text-gpt-text-primary-dark mb-4">
                Notification Preferences
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={notifications.newFeatures}
                      onChange={(e) => updateNotificationSettings({ newFeatures: e.target.checked })}
                      className="rounded border-gpt-border-light dark:border-gpt-border-dark text-gpt-primary focus:ring-gpt-primary"
                    />
                    <span className="text-sm text-gpt-text-primary-light dark:text-gpt-text-primary-dark">
                      New features and updates
                    </span>
                  </label>
                </div>

                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={notifications.updates}
                      onChange={(e) => updateNotificationSettings({ updates: e.target.checked })}
                      className="rounded border-gpt-border-light dark:border-gpt-border-dark text-gpt-primary focus:ring-gpt-primary"
                    />
                    <span className="text-sm text-gpt-text-primary-light dark:text-gpt-text-primary-dark">
                      Application updates
                    </span>
                  </label>
                </div>

                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={notifications.medicalReminders}
                      onChange={(e) => updateNotificationSettings({ medicalReminders: e.target.checked })}
                      className="rounded border-gpt-border-light dark:border-gpt-border-dark text-gpt-primary focus:ring-gpt-primary"
                    />
                    <span className="text-sm text-gpt-text-primary-light dark:text-gpt-text-primary-dark">
                      Medical reminders and alerts
                    </span>
                  </label>
                </div>

                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={notifications.emailNotifications}
                      onChange={(e) => updateNotificationSettings({ emailNotifications: e.target.checked })}
                      className="rounded border-gpt-border-light dark:border-gpt-border-dark text-gpt-primary focus:ring-gpt-primary"
                    />
                    <span className="text-sm text-gpt-text-primary-light dark:text-gpt-text-primary-dark">
                      Email notifications
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )

      case 'security':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gpt-text-primary-light dark:text-gpt-text-primary-dark mb-4">
                Security & Privacy
              </h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-gpt-hover-light dark:bg-gpt-hover-dark rounded-lg">
                  <h4 className="font-medium text-gpt-text-primary-light dark:text-gpt-text-primary-dark mb-2">
                    HIPAA Compliance
                  </h4>
                  <p className="text-sm text-gpt-text-secondary-light dark:text-gpt-text-secondary-dark mb-3">
                    Nelson-GPT is designed with healthcare data protection in mind. All conversations are encrypted and stored securely.
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gpt-success">
                    <div className="w-2 h-2 bg-gpt-success rounded-full" />
                    <span>HIPAA compliant encryption enabled</span>
                  </div>
                </div>

                <div className="p-4 bg-gpt-hover-light dark:bg-gpt-hover-dark rounded-lg">
                  <h4 className="font-medium text-gpt-text-primary-light dark:text-gpt-text-primary-dark mb-2">
                    Data Retention
                  </h4>
                  <p className="text-sm text-gpt-text-secondary-light dark:text-gpt-text-secondary-dark">
                    Conversations are stored locally in your browser and can be deleted at any time. 
                    No personal health information is transmitted to external servers.
                  </p>
                </div>

                <div className="p-4 bg-gpt-hover-light dark:bg-gpt-hover-dark rounded-lg">
                  <h4 className="font-medium text-gpt-text-primary-light dark:text-gpt-text-primary-dark mb-2">
                    Audit Logging
                  </h4>
                  <p className="text-sm text-gpt-text-secondary-light dark:text-gpt-text-secondary-dark">
                    All interactions are logged for security and compliance purposes. 
                    You can request access to your audit logs at any time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )

      case 'about':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gpt-text-primary-light dark:text-gpt-text-primary-dark mb-4">
                About Nelson-GPT
              </h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-gpt-hover-light dark:bg-gpt-hover-dark rounded-lg">
                  <h4 className="font-medium text-gpt-text-primary-light dark:text-gpt-text-primary-dark mb-2">
                    Version 1.0.0
                  </h4>
                  <p className="text-sm text-gpt-text-secondary-light dark:text-gpt-text-secondary-dark">
                    Smart Pediatric Medical Assistant powered by Nelson Textbook of Pediatrics and advanced AI technology.
                  </p>
                </div>

                <div className="p-4 bg-gpt-hover-light dark:bg-gpt-hover-dark rounded-lg">
                  <h4 className="font-medium text-gpt-text-primary-light dark:text-gpt-text-primary-dark mb-2">
                    Medical Knowledge Base
                  </h4>
                  <p className="text-sm text-gpt-text-secondary-light dark:text-gpt-text-secondary-dark mb-2">
                    Based on the comprehensive Nelson Textbook of Pediatrics, providing evidence-based medical information for healthcare professionals.
                  </p>
                  <p className="text-sm text-gpt-text-secondary-light dark:text-gpt-text-secondary-dark">
                    Regularly updated with the latest pediatric medical guidelines and research.
                  </p>
                </div>

                <div className="p-4 bg-gpt-hover-light dark:bg-gpt-hover-dark rounded-lg">
                  <h4 className="font-medium text-gpt-text-primary-light dark:text-gpt-text-primary-dark mb-2">
                    Intended Use
                  </h4>
                  <p className="text-sm text-gpt-text-secondary-light dark:text-gpt-text-secondary-dark">
                    This tool is designed for healthcare professionals and provides educational information. 
                    It should not replace professional medical judgment or direct patient care.
                  </p>
                </div>

                <div className="p-4 bg-gpt-hover-light dark:bg-gpt-hover-dark rounded-lg">
                  <h4 className="font-medium text-gpt-text-primary-light dark:text-gpt-text-primary-dark mb-2">
                    Support & Feedback
                  </h4>
                  <p className="text-sm text-gpt-text-secondary-light dark:text-gpt-text-secondary-dark">
                    For technical support or to provide feedback, please contact the development team.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gpt-bg-light dark:bg-gpt-bg-dark">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gpt-text-primary-light dark:text-gpt-text-primary-dark">
              Settings
            </h1>
            <p className="text-gpt-text-secondary-light dark:text-gpt-text-secondary-dark mt-2">
              Customize your Nelson-GPT experience
            </p>
          </div>
          
          {user && (
            <button
              onClick={() => {
                if (confirm('Are you sure you want to log out?')) {
                  logout()
                }
              }}
              className="flex items-center gap-2 px-4 py-2 bg-gpt-error text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Log Out
            </button>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <nav className="space-y-1">
              {sections.map((section) => {
                const Icon = section.icon
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeSection === section.id
                        ? 'bg-gpt-primary text-white'
                        : 'text-gpt-text-primary-light dark:text-gpt-text-primary-dark hover:bg-gpt-hover-light dark:hover:bg-gpt-hover-dark'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{section.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-gpt-bg-light dark:bg-gpt-bg-dark border border-gpt-border-light dark:border-gpt-border-dark rounded-xl p-6"
            >
              {renderSection()}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Reset confirmation modal */}
      <AnimatePresence>
        {showResetConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gpt-bg-light dark:bg-gpt-bg-dark rounded-xl p-6 max-w-md w-full"
            >
              <h3 className="text-lg font-semibold text-gpt-text-primary-light dark:text-gpt-text-primary-dark mb-4">
                Reset All Settings?
              </h3>
              <p className="text-gpt-text-secondary-light dark:text-gpt-text-secondary-dark mb-6">
                This will restore all settings to their default values. This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 px-4 py-2 bg-gpt-hover-light dark:bg-gpt-hover-dark text-gpt-text-primary-light dark:text-gpt-text-primary-dark rounded-lg hover:bg-gpt-border-light dark:hover:bg-gpt-border-dark transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleResetSettings}
                  className="flex-1 px-4 py-2 bg-gpt-error text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Reset
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default SettingsPage
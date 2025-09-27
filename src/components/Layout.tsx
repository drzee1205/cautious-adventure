import React, { useState, useEffect } from 'react'
import { Menu, X, Settings, User, LogOut, Plus, Search } from 'lucide-react'
import { useChatStore } from '../stores/chatStore'
import { useThemeStore } from '../stores/themeStore'
import { useAuthStore } from '../stores/authStore'
import Sidebar from './Sidebar'
import ChatInput from './ChatInput'
import { motion, AnimatePresence } from 'framer-motion'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const { conversations, currentConversationId } = useChatStore()
  const { theme, toggleTheme } = useThemeStore()
  const { user, logout } = useAuthStore()

  // Close sidebar on mobile when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById('sidebar')
      if (sidebarOpen && sidebar && !sidebar.contains(event.target as Node)) {
        setSidebarOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [sidebarOpen])

  return (
    <div className="flex h-screen bg-gpt-bg-light dark:bg-gpt-bg-dark">
      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        id="sidebar"
        initial={false}
        animate={{
          x: sidebarOpen ? 0 : -260,
          opacity: sidebarOpen ? 1 : 0
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={`fixed md:relative md:translate-x-0 md:opacity-100 z-50 w-sidebar h-full bg-gpt-sidebar-light dark:bg-gpt-sidebar-dark border-r border-gpt-border-light dark:border-gpt-border-dark`}
      >
        <Sidebar 
          onClose={() => setSidebarOpen(false)}
          isMobile={sidebarOpen}
        />
      </motion.aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-gpt-bg-light dark:bg-gpt-bg-dark border-b border-gpt-border-light dark:border-gpt-border-dark">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-4">
              {/* Mobile menu button */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gpt-hover-light dark:hover:bg-gpt-hover-dark transition-colors focus-visible"
                aria-label="Toggle sidebar"
              >
                {sidebarOpen ? (
                  <X className="w-5 h-5 text-gpt-text-primary-light dark:text-gpt-text-primary-dark" />
                ) : (
                  <Menu className="w-5 h-5 text-gpt-text-primary-light dark:text-gpt-text-primary-dark" />
                )}
              </button>

              {/* Current conversation title */}
              <div className="hidden md:block">
                <h1 className="text-lg font-semibold text-gpt-text-primary-light dark:text-gpt-text-primary-dark">
                  {conversations.find(c => c.id === currentConversationId)?.title || 'Nelson-GPT'}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Search button */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 rounded-lg hover:bg-gpt-hover-light dark:hover:bg-gpt-hover-dark transition-colors focus-visible"
                aria-label="Search conversations"
              >
                <Search className="w-5 h-5 text-gpt-text-primary-light dark:text-gpt-text-primary-dark" />
              </button>

              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-gpt-hover-light dark:hover:bg-gpt-hover-dark transition-colors focus-visible"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <svg className="w-5 h-5 text-gpt-text-primary-light dark:text-gpt-text-primary-dark" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-gpt-text-primary-light dark:text-gpt-text-primary-dark" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>

              {/* Settings */}
              <button
                onClick={() => window.location.href = '/settings'}
                className="p-2 rounded-lg hover:bg-gpt-hover-light dark:hover:bg-gpt-hover-dark transition-colors focus-visible"
                aria-label="Settings"
              >
                <Settings className="w-5 h-5 text-gpt-text-primary-light dark:text-gpt-text-primary-dark" />
              </button>

              {/* User menu */}
              <div className="relative">
                <button
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-gpt-hover-light dark:hover:bg-gpt-hover-dark transition-colors focus-visible"
                  aria-label="User menu"
                >
                  <User className="w-5 h-5 text-gpt-text-primary-light dark:text-gpt-text-primary-dark" />
                </button>
              </div>
            </div>
          </div>

          {/* Search bar */}
          <AnimatePresence>
            {searchOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-t border-gpt-border-light dark:border-gpt-border-dark px-4 py-3"
              >
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gpt-text-secondary-light dark:text-gpt-text-secondary-dark" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    className="w-full pl-10 pr-4 py-2 bg-gpt-hover-light dark:bg-gpt-hover-dark border border-gpt-border-light dark:border-gpt-border-dark rounded-lg text-gpt-text-primary-light dark:text-gpt-text-primary-dark placeholder-gpt-text-secondary-light dark:placeholder-gpt-text-secondary-dark focus:outline-none focus:ring-2 focus:ring-gpt-primary"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout
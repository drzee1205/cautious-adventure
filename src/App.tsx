import React, { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useThemeStore } from './stores/themeStore'
import { useAuthStore } from './stores/authStore'
import Layout from './components/Layout'
import ChatPage from './pages/ChatPage'
import SettingsPage from './pages/SettingsPage'
import LoginPage from './pages/LoginPage'
import { supabase } from './lib/supabase'
// @ts-ignore
import { registerSW } from 'virtual:pwa-register'

// Register service worker
const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm('A new version of Nelson-GPT is available. Update now?')) {
      updateSW(true)
    }
  },
  onOfflineReady() {
    console.log('Nelson-GPT is ready for offline use')
  }
})

function App() {
  const { theme } = useThemeStore()
  const { user, setUser } = useAuthStore()

  useEffect(() => {
    // Set theme class on document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  useEffect(() => {
    // Check auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [setUser])

  // Protected route wrapper
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (!user) {
      return <Navigate to="/login" replace />
    }
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-gpt-bg-light dark:bg-gpt-bg-dark">
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage />} />
        <Route path="/*" element={
          <ProtectedRoute>
            <Layout>
              <Routes>
                <Route path="/" element={<ChatPage />} />
                <Route path="/chat/:id" element={<ChatPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        } />
      </Routes>
    </div>
  )
}

export default App
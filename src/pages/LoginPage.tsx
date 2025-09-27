import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  Shield, 
  Heart, 
  Brain,
  Activity,
  Baby
} from 'lucide-react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../stores/authStore'

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { setUser } = useAuthStore()
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      setUser(data.user)
      navigate('/')
    } catch (error: any) {
      setError(error.message || 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoLogin = async () => {
    setIsLoading(true)
    try {
      // Demo login for healthcare professionals
      const demoEmail = 'demo.healthcare@nelson-gpt.com'
      const demoPassword = 'DemoPass123!'
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: demoEmail,
        password: demoPassword,
      })

      if (error) {
        // If demo account doesn't exist, create it
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: demoEmail,
          password: demoPassword,
        })

        if (signUpError) throw signUpError
        
        setUser(signUpData.user)
      } else {
        setUser(data.user)
      }
      
      navigate('/')
    } catch (error: any) {
      setError(error.message || 'Demo login failed')
    } finally {
      setIsLoading(false)
    }
  }

  const medicalSpecialties = [
    { icon: Brain, label: 'Neurology' },
    { icon: Heart, label: 'Cardiology' },
    { icon: Activity, label: 'Emergency' },
    { icon: Baby, label: 'Neonatology' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gpt-primary/10 to-gpt-primary-hover/10 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-12 items-center">
        {/* Left side - Hero content */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center lg:text-left"
        >
          <div className="w-20 h-20 mx-auto lg:mx-0 mb-6 bg-gradient-to-br from-gpt-primary to-gpt-primary-hover rounded-2xl flex items-center justify-center">
            <Brain className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-bold text-gpt-text-primary-light dark:text-gpt-text-primary-dark mb-4">
            Nelson-GPT
          </h1>
          
          <p className="text-xl text-gpt-text-secondary-light dark:text-gpt-text-secondary-dark mb-6">
            Smart Pediatric Medical Assistant
          </p>
          
          <p className="text-gpt-text-secondary-light dark:text-gpt-text-secondary-dark mb-8 max-w-md">
            Powered by Nelson Textbook of Pediatrics, providing evidence-based medical guidance for healthcare professionals.
          </p>

          {/* Medical specialties showcase */}
          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto lg:mx-0">
            {medicalSpecialties.map((specialty, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="flex items-center gap-3 p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg backdrop-blur-sm"
              >
                <specialty.icon className="w-6 h-6 text-gpt-primary" />
                <span className="text-sm font-medium text-gpt-text-primary-light dark:text-gpt-text-primary-dark">
                  {specialty.label}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Medical disclaimer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 p-4 bg-gpt-warning/10 border border-gpt-warning/20 rounded-lg"
          >
            <p className="text-sm text-gpt-warning">
              <strong>Healthcare Professional Use Only:</strong> This tool is designed for licensed healthcare professionals and provides educational medical information.
            </p>
          </motion.div>
        </motion.div>

        {/* Right side - Login form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gpt-text-primary-light dark:text-gpt-text-primary-dark mb-2">
              Healthcare Professional Login
            </h2>
            <p className="text-gpt-text-secondary-light dark:text-gpt-text-secondary-dark">
              Access evidence-based pediatric medical guidance
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gpt-text-primary-light dark:text-gpt-text-primary-dark mb-2">
                Professional Email
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gpt-text-secondary-light dark:text-gpt-text-secondary-dark" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@healthcare.org"
                  className="w-full pl-10 pr-4 py-3 bg-gpt-bg-light dark:bg-gpt-bg-dark border border-gpt-border-light dark:border-gpt-border-dark rounded-lg text-gpt-text-primary-light dark:text-gpt-text-primary-dark placeholder-gpt-text-secondary-light dark:placeholder-gpt-text-secondary-dark focus:outline-none focus:ring-2 focus:ring-gpt-primary"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gpt-text-primary-light dark:text-gpt-text-primary-dark mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gpt-text-secondary-light dark:text-gpt-text-secondary-dark" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your secure password"
                  className="w-full pl-10 pr-12 py-3 bg-gpt-bg-light dark:bg-gpt-bg-dark border border-gpt-border-light dark:border-gpt-border-dark rounded-lg text-gpt-text-primary-light dark:text-gpt-text-primary-dark placeholder-gpt-text-secondary-light dark:placeholder-gpt-text-secondary-dark focus:outline-none focus:ring-2 focus:ring-gpt-primary"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gpt-hover-light dark:hover:bg-gpt-hover-dark rounded transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-gpt-text-secondary-light dark:text-gpt-text-secondary-dark" />
                  ) : (
                    <Eye className="w-5 h-5 text-gpt-text-secondary-light dark:text-gpt-text-secondary-dark" />
                  )}
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-gpt-error/10 border border-gpt-error/20 text-gpt-error rounded-lg text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Login buttons */}
            <div className="space-y-3">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3 bg-gpt-primary text-white rounded-lg hover:bg-gpt-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Logging in...
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5" />
                    Secure Healthcare Login
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleDemoLogin}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3 bg-gpt-hover-light dark:bg-gpt-hover-dark text-gpt-text-primary-light dark:text-gpt-text-primary-dark rounded-lg hover:bg-gpt-border-light dark:hover:bg-gpt-border-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                <Brain className="w-5 h-5" />
                Try Demo (Healthcare Professional)
              </button>
            </div>
          </form>

          {/* Additional info */}
          <div className="mt-8 pt-6 border-t border-gpt-border-light dark:border-gpt-border-dark">
            <div className="flex items-center justify-center gap-2 text-sm text-gpt-text-secondary-light dark:text-gpt-text-secondary-dark mb-4">
              <Shield className="w-4 h-4 text-gpt-success" />
              <span>HIPAA Compliant • End-to-End Encrypted</span>
            </div>
            
            <div className="text-center">
              <p className="text-xs text-gpt-text-secondary-light dark:text-gpt-text-secondary-dark">
                By logging in, you agree to our{' '}
                <a href="#" className="text-gpt-primary hover:underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-gpt-primary hover:underline">
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default LoginPage
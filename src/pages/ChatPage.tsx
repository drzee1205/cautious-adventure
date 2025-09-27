import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useChatStore } from '../stores/chatStore'
import { useAuthStore } from '../stores/authStore'
import ChatMessage from '../components/ChatMessage'
import ChatInput from '../components/ChatInput'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Brain, 
  Stethoscope, 
  Heart, 
  Activity, 
  Baby,
  Plus,
  Send
} from 'lucide-react'

const ChatPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { 
    conversations, 
    currentConversationId, 
    setCurrentConversation, 
    getCurrentConversation,
    createConversation,
    updateMessage,
    deleteMessage,
    isLoading,
    isStreaming 
  } = useChatStore()
  
  const { user } = useAuthStore()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [showExamples, setShowExamples] = useState(true)

  const currentConversation = getCurrentConversation()
  const messages = currentConversation?.messages || []

  // Set current conversation from URL param
  useEffect(() => {
    if (id) {
      setCurrentConversation(id)
    }
  }, [id, setCurrentConversation])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  // Hide examples when there are messages
  useEffect(() => {
    setShowExamples(messages.length === 0)
  }, [messages.length])

  const handleNewConversation = () => {
    const newConv = createConversation()
    setCurrentConversation(newConv.id)
  }

  const handleRegenerateMessage = (messageId: string) => {
    // Implementation for regenerating a specific message
    console.log('Regenerating message:', messageId)
  }

  const handleEditMessage = (messageId: string, newContent: string) => {
    if (currentConversationId) {
      updateMessage(currentConversationId, messageId, { content: newContent })
    }
  }

  const handleDeleteMessage = (messageId: string) => {
    if (currentConversationId && confirm('Are you sure you want to delete this message?')) {
      deleteMessage(currentConversationId, messageId)
    }
  }

  const medicalExamples = [
    {
      icon: Brain,
      title: "Pediatric Neurology",
      prompt: "What are the differential diagnoses for a 5-year-old with recurrent headaches and vomiting?",
      description: "Neurological assessment guidance"
    },
    {
      icon: Heart,
      title: "Cardiac Assessment",
      prompt: "Interpret this pediatric ECG findings and recommend next steps",
      description: "Cardiac evaluation protocols"
    },
    {
      icon: Stethoscope,
      title: "Respiratory Cases",
      prompt: "Management of acute asthma exacerbation in a 3-year-old",
      description: "Respiratory emergency protocols"
    },
    {
      icon: Activity,
      title: "Growth & Development",
      prompt: "Normal developmental milestones for a 12-month-old infant",
      description: "Developmental assessment"
    },
    {
      icon: Baby,
      title: "Neonatal Care",
      prompt: "Initial assessment of a newborn with respiratory distress",
      description: "Neonatal emergency care"
    }
  ]

  const handleExampleClick = (prompt: string) => {
    // This would typically trigger the ChatInput to send this message
    console.log('Selected example:', prompt)
  }

  return (
    <div className="h-full flex flex-col bg-gpt-bg-light dark:bg-gpt-bg-dark">
      {/* Welcome screen or chat interface */}
      <AnimatePresence mode="wait">
        {showExamples ? (
          <motion.div
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center p-8"
          >
            <div className="text-center max-w-4xl">
              {/* Hero section */}
              <motion.div
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-8"
              >
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gpt-primary to-gpt-primary-hover rounded-2xl flex items-center justify-center">
                  <Brain className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-4xl font-bold text-gpt-text-primary-light dark:text-gpt-text-primary-dark mb-4">
                  Nelson-GPT
                </h1>
                <p className="text-xl text-gpt-text-secondary-light dark:text-gpt-text-secondary-dark mb-2">
                  Smart Pediatric Medical Assistant
                </p>
                <p className="text-gpt-text-secondary-light dark:text-gpt-text-secondary-dark">
                  Powered by Nelson Textbook of Pediatrics
                </p>
              </motion.div>

              {/* Medical examples */}
              <motion.div
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8"
              >
                {medicalExamples.map((example, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    onClick={() => handleExampleClick(example.prompt)}
                    className="p-6 bg-gpt-hover-light dark:bg-gpt-hover-dark rounded-xl border border-gpt-border-light dark:border-gpt-border-dark hover:border-gpt-primary hover:shadow-lg transition-all duration-200 text-left group"
                  >
                    <div className="w-12 h-12 bg-gpt-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-gpt-primary/20 transition-colors">
                      <example.icon className="w-6 h-6 text-gpt-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-gpt-text-primary-light dark:text-gpt-text-primary-dark mb-2">
                      {example.title}
                    </h3>
                    <p className="text-sm text-gpt-text-secondary-light dark:text-gpt-text-secondary-dark mb-3">
                      {example.description}
                    </p>
                    <p className="text-xs text-gpt-text-secondary-light dark:text-gpt-text-secondary-dark italic">
                      {example.prompt}
                    </p>
                  </motion.button>
                ))}
              </motion.div>

              {/* Quick start */}
              <motion.div
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.8 }}
                className="text-center"
              >
                <p className="text-gpt-text-secondary-light dark:text-gpt-text-secondary-dark mb-4">
                  Or start a new conversation about any pediatric topic
                </p>
                <button
                  onClick={handleNewConversation}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gpt-primary text-white rounded-lg hover:bg-gpt-primary-hover transition-colors focus-visible"
                >
                  <Plus className="w-5 h-5" />
                  New Medical Consultation
                </button>
              </motion.div>

              {/* Medical disclaimer */}
              <motion.div
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.9 }}
                className="mt-8 p-4 bg-gpt-warning/10 border border-gpt-warning/20 rounded-lg max-w-2xl mx-auto"
              >
                <p className="text-sm text-gpt-warning">
                  <strong>Medical Professional Use Only:</strong> This tool is designed for healthcare professionals and provides educational information based on the Nelson Textbook of Pediatrics. Always consult with qualified healthcare professionals and use your clinical judgment for medical decisions.
                </p>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="chat"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col"
          >
            {/* Messages */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <div className="max-w-content mx-auto px-4 py-6">
                {messages.map((message, index) => (
                  <ChatMessage
                    key={message.id}
                    message={message}
                    isLastMessage={index === messages.length - 1}
                    onRegenerate={() => handleRegenerateMessage(message.id)}
                    onEdit={(newContent) => handleEditMessage(message.id, newContent)}
                    onDelete={() => handleDeleteMessage(message.id)}
                    onRate={(rating) => console.log('Rate message:', message.id, rating)}
                  />
                ))}
                
                {/* Loading indicator */}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2 p-4 text-gpt-text-secondary-light dark:text-gpt-text-secondary-dark"
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gpt-hover-light dark:bg-gpt-hover-dark">
                      <Brain className="w-5 h-5 text-gpt-primary animate-pulse" />
                    </div>
                    <span className="text-sm">Nelson-GPT is analyzing your query...</span>
                  </motion.div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input area */}
            <div className="sticky bottom-0 bg-gpt-bg-light dark:bg-gpt-bg-dark border-t border-gpt-border-light dark:border-gpt-border-dark p-4">
              <div className="max-w-content mx-auto">
                <ChatInput 
                  disabled={isLoading || isStreaming}
                  onSendMessage={(message) => {
                    console.log('Message sent:', message)
                  }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ChatPage
import React, { useState, useRef, useEffect } from 'react'
import { Send, Paperclip, Mic, StopCircle } from 'lucide-react'
import { useChatStore } from '../stores/chatStore'
import { useSettingsStore } from '../stores/settingsStore'
import { aiService } from '../services/aiService'
import { motion } from 'framer-motion'

interface ChatInputProps {
  onSendMessage?: (message: string) => void
  disabled?: boolean
  placeholder?: string
}

const ChatInput: React.FC<ChatInputProps> = ({ 
  onSendMessage, 
  disabled = false, 
  placeholder = "Message Nelson-GPT..." 
}) => {
  const [inputValue, setInputValue] = useState('')
  const [isComposing, setIsComposing] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { addMessage, setLoading, setStreaming, currentConversationId, createConversation } = useChatStore()
  const settings = useSettingsStore()

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`
    }
  }, [inputValue])

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    
    const trimmedValue = inputValue.trim()
    if (!trimmedValue || disabled || isComposing) return

    // Clear input
    setInputValue('')
    
    // Create or get current conversation
    let conversationId = currentConversationId
    if (!conversationId) {
      const newConv = createConversation()
      conversationId = newConv.id
    }

    // Add user message
    const userMessage = addMessage(conversationId, {
      role: 'user',
      content: trimmedValue
    })

    // Call external handler if provided
    if (onSendMessage) {
      onSendMessage(trimmedValue)
      return
    }

    // Generate AI response
    setLoading(true)
    setStreaming(true)
    setIsStreaming(true)

    try {
      const conversation = useChatStore.getState().getCurrentConversation()
      if (!conversation) return

      const aiResponse = await aiService.generateMedicalResponse(
        conversation.messages,
        trimmedValue,
        settings
      )

      // Add AI response
      addMessage(conversationId, {
        role: 'assistant',
        content: aiResponse.content,
        citations: aiResponse.citations
      })
    } catch (error) {
      console.error('Error generating response:', error)
      addMessage(conversationId, {
        role: 'assistant',
        content: 'I apologize, but I encountered an error while processing your request. Please try again.'
      })
    } finally {
      setLoading(false)
      setStreaming(false)
      setIsStreaming(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Handle file upload (images, PDFs, etc.)
      console.log('File uploaded:', file.name)
      // Implementation for file processing would go here
    }
  }

  const startRecording = () => {
    setIsRecording(true)
    // Implementation for voice recording would go here
  }

  const stopRecording = () => {
    setIsRecording(false)
    // Implementation for stopping voice recording would go here
  }

  const characterCount = inputValue.length
  const maxCharacters = 4000
  const isNearLimit = characterCount > maxCharacters * 0.9

  return (
    <div className="relative">
      {/* Medical Disclaimer */}
      <div className="mb-4 medical-disclaimer">
        <p className="text-sm">
          <strong>Medical Disclaimer:</strong> This AI assistant provides educational information based on the Nelson Textbook of Pediatrics. 
          Always consult with qualified healthcare professionals for medical decisions.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="relative">
        {/* Input container */}
        <div className="relative flex items-end gap-2 p-4 bg-gpt-bg-light dark:bg-gpt-bg-dark border border-gpt-border-light dark:border-gpt-border-dark rounded-2xl shadow-lg">
          {/* File upload button */}
          <button
            type="button"
            onClick={() => document.getElementById('file-input')?.click()}
            className="p-2 rounded-lg hover:bg-gpt-hover-light dark:hover:bg-gpt-hover-dark transition-colors focus-visible"
            aria-label="Attach file"
            disabled={disabled}
          >
            <Paperclip className="w-5 h-5 text-gpt-text-secondary-light dark:text-gpt-text-secondary-dark" />
          </button>
          
          <input
            id="file-input"
            type="file"
            className="hidden"
            onChange={handleFileUpload}
            accept="image/*,.pdf,.txt,.md"
          />

          {/* Textarea */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onCompositionStart={() => setIsComposing(true)}
              onCompositionEnd={() => setIsComposing(false)}
              placeholder={placeholder}
              disabled={disabled || isStreaming}
              className="w-full resize-none bg-transparent text-gpt-text-primary-light dark:text-gpt-text-primary-dark placeholder-gpt-text-secondary-light dark:placeholder-gpt-text-secondary-dark focus:outline-none min-h-[24px] max-h-[200px] py-2"
              rows={1}
              style={{ fontSize: '16px', lineHeight: '1.5' }}
            />
            
            {/* Character counter */}
            {inputValue && (
              <div className={`absolute bottom-0 right-0 text-xs ${
                isNearLimit ? 'text-gpt-warning' : 'text-gpt-text-secondary-light dark:text-gpt-text-secondary-dark'
              }`}>
                {characterCount}/{maxCharacters}
              </div>
            )}
          </div>

          {/* Voice recording button */}
          <button
            type="button"
            onClick={isRecording ? stopRecording : startRecording}
            className={`p-2 rounded-lg transition-colors focus-visible ${
              isRecording 
                ? 'bg-gpt-error text-white hover:bg-red-600' 
                : 'hover:bg-gpt-hover-light dark:hover:bg-gpt-hover-dark'
            }`}
            aria-label={isRecording ? 'Stop recording' : 'Start voice recording'}
            disabled={disabled}
          >
            {isRecording ? (
              <StopCircle className="w-5 h-5" />
            ) : (
              <Mic className="w-5 h-5 text-gpt-text-secondary-light dark:text-gpt-text-secondary-dark" />
            )}
          </button>

          {/* Send button */}
          <button
            type="submit"
            disabled={disabled || !inputValue.trim() || isStreaming || characterCount > maxCharacters}
            className="p-2 rounded-lg bg-gpt-primary hover:bg-gpt-primary-hover disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors focus-visible"
            aria-label="Send message"
          >
            {isStreaming ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 text-white"
              >
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
              </motion.div>
            ) : (
              <Send className="w-5 h-5 text-white" />
            )}
          </button>
        </div>

        {/* Keyboard shortcuts hint */}
        <div className="mt-2 text-xs text-gpt-text-secondary-light dark:text-gpt-text-secondary-dark text-center">
          Press <kbd className="px-1 py-0.5 bg-gpt-hover-light dark:bg-gpt-hover-dark rounded text-xs">Shift</kbd> + <kbd className="px-1 py-0.5 bg-gpt-hover-light dark:bg-gpt-hover-dark rounded text-xs">Enter</kbd> for new line
        </div>
      </form>
    </div>
  )
}

export default ChatInput
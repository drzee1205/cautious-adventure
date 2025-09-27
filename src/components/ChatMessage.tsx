import React, { useState, useRef, useEffect } from 'react'
import { 
  User, 
  Bot, 
  Copy, 
  Check, 
  RefreshCw, 
  ThumbsUp, 
  ThumbsDown, 
  Edit3, 
  MoreVertical,
  ExternalLink,
  BookOpen
} from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { motion, AnimatePresence } from 'framer-motion'
import { Message, MedicalCitation } from '../stores/chatStore'
import { formatDistanceToNow } from 'date-fns'

interface ChatMessageProps {
  message: Message
  isLastMessage?: boolean
  onRegenerate?: () => void
  onEdit?: (newContent: string) => void
  onDelete?: () => void
  onRate?: (rating: 'up' | 'down') => void
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  isLastMessage = false,
  onRegenerate,
  onEdit,
  onDelete,
  onRate
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(message.content)
  const [copied, setCopied] = useState(false)
  const [showCitations, setShowCitations] = useState(false)
  const [showActions, setShowActions] = useState(false)
  const editTextareaRef = useRef<HTMLTextAreaElement>(null)

  const isUser = message.role === 'user'
  const hasCitations = message.citations && message.citations.length > 0

  // Auto-focus edit textarea
  useEffect(() => {
    if (isEditing && editTextareaRef.current) {
      editTextareaRef.current.focus()
      editTextareaRef.current.setSelectionRange(-1, -1)
    }
  }, [isEditing])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleSaveEdit = () => {
    if (editContent.trim() && editContent !== message.content) {
      onEdit?.(editContent.trim())
    }
    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    setEditContent(message.content)
    setIsEditing(false)
  }

  const renderCitation = (citation: MedicalCitation, index: number) => (
    <motion.div
      key={citation.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-gpt-hover-light dark:bg-gpt-hover-dark rounded-lg p-3 border border-gpt-border-light dark:border-gpt-border-dark"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="w-4 h-4 text-gpt-primary" />
            <span className="text-sm font-medium text-gpt-text-primary-light dark:text-gpt-text-primary-dark">
              {citation.source}
            </span>
            <span className="text-xs text-gpt-text-secondary-light dark:text-gpt-text-secondary-dark">
              ({(citation.relevanceScore * 100).toFixed(0)}% match)
            </span>
          </div>
          <p className="text-sm text-gpt-text-secondary-light dark:text-gpt-text-secondary-dark mb-1">
            Chapter: {citation.chapter}
            {citation.page && `, Page ${citation.page}`}
          </p>
          {citation.quote && (
            <blockquote className="text-xs text-gpt-text-secondary-light dark:text-gpt-text-secondary-dark italic border-l-2 border-gpt-border-light dark:border-gpt-border-dark pl-2">
              "{citation.quote}"
            </blockquote>
          )}
        </div>
        {citation.url && (
          <a
            href={citation.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1 rounded hover:bg-gpt-hover-light dark:hover:bg-gpt-hover-dark transition-colors"
            aria-label="View source"
          >
            <ExternalLink className="w-4 h-4 text-gpt-primary" />
          </a>
        )}
      </div>
    </motion.div>
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`group relative ${isUser ? 'bg-gpt-bg-light dark:bg-gpt-bg-dark' : 'bg-gpt-hover-light dark:bg-gpt-hover-dark'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="max-w-content mx-auto px-4 py-6">
        <div className="flex gap-4">
          {/* Avatar */}
          <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gpt-hover-light dark:bg-gpt-hover-dark">
            {isUser ? (
              <User className="w-5 h-5 text-gpt-text-secondary-light dark:text-gpt-text-secondary-dark" />
            ) : (
              <Bot className="w-5 h-5 text-gpt-primary" />
            )}
          </div>

          {/* Message content */}
          <div className="flex-1 min-w-0">
            {/* Message header */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gpt-text-primary-light dark:text-gpt-text-primary-dark">
                  {isUser ? 'You' : 'Nelson-GPT'}
                </span>
                <span className="text-xs text-gpt-text-secondary-light dark:text-gpt-text-secondary-dark">
                  {formatDistanceToNow(message.timestamp, { addSuffix: true })}
                </span>
              </div>

              {/* Actions dropdown */}
              <AnimatePresence>
                {(isHovered || showActions) && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="relative"
                  >
                    <button
                      onClick={() => setShowActions(!showActions)}
                      className="p-1 rounded hover:bg-gpt-hover-light dark:hover:bg-gpt-hover-dark transition-colors"
                      aria-label="Message actions"
                    >
                      <MoreVertical className="w-4 h-4 text-gpt-text-secondary-light dark:text-gpt-text-secondary-dark" />
                    </button>

                    {showActions && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 top-full mt-1 bg-gpt-bg-light dark:bg-gpt-bg-dark border border-gpt-border-light dark:border-gpt-border-dark rounded-lg shadow-lg py-1 z-10"
                      >
                        {isUser && (
                          <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gpt-text-primary-light dark:text-gpt-text-primary-dark hover:bg-gpt-hover-light dark:hover:bg-gpt-hover-dark transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                            Edit
                          </button>
                        )}
                        <button
                          onClick={handleCopy}
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gpt-text-primary-light dark:text-gpt-text-primary-dark hover:bg-gpt-hover-light dark:hover:bg-gpt-hover-dark transition-colors"
                        >
                          {copied ? (
                            <>
                              <Check className="w-4 h-4 text-gpt-success" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4" />
                              Copy
                            </>
                          )}
                        </button>
                        {!isUser && onRegenerate && (
                          <button
                            onClick={onRegenerate}
                            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gpt-text-primary-light dark:text-gpt-text-primary-dark hover:bg-gpt-hover-light dark:hover:bg-gpt-hover-dark transition-colors"
                          >
                            <RefreshCw className="w-4 h-4" />
                            Regenerate
                          </button>
                        )}
                        {!isUser && (
                          <div className="border-t border-gpt-border-light dark:border-gpt-border-dark">
                            <button
                              onClick={() => onRate?.('up')}
                              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gpt-text-primary-light dark:text-gpt-text-primary-dark hover:bg-gpt-hover-light dark:hover:bg-gpt-hover-dark transition-colors"
                            >
                              <ThumbsUp className="w-4 h-4" />
                              Good response
                            </button>
                            <button
                              onClick={() => onRate?.('down')}
                              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gpt-text-primary-light dark:text-gpt-text-primary-dark hover:bg-gpt-hover-light dark:hover:bg-gpt-hover-dark transition-colors"
                            >
                              <ThumbsDown className="w-4 h-4" />
                              Poor response
                            </button>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Message content */}
            {isEditing ? (
              <div className="space-y-3">
                <textarea
                  ref={editTextareaRef}
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full p-3 bg-gpt-bg-light dark:bg-gpt-bg-dark border border-gpt-border-light dark:border-gpt-border-dark rounded-lg text-gpt-text-primary-light dark:text-gpt-text-primary-dark focus:outline-none focus:ring-2 focus:ring-gpt-primary resize-none"
                  rows={6}
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveEdit}
                    className="px-4 py-2 bg-gpt-primary text-white rounded-lg hover:bg-gpt-primary-hover transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="px-4 py-2 bg-gpt-hover-light dark:bg-gpt-hover-dark text-gpt-text-primary-light dark:text-gpt-text-primary-dark rounded-lg hover:bg-gpt-border-light dark:hover:bg-gpt-border-dark transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Message text */}
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  <ReactMarkdown
                    components={{
                      code({ node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '')
                        return !inline && match ? (
                          <SyntaxHighlighter
                            style={oneDark}
                            language={match[1]}
                            PreTag="div"
                            className="rounded-lg"
                            {...props}
                          >
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        ) : (
                          <code className="bg-gpt-hover-light dark:bg-gpt-hover-dark px-1 py-0.5 rounded text-sm" {...props}>
                            {children}
                          </code>
                        )
                      },
                      blockquote({ children }) {
                        return (
                          <blockquote className="border-l-4 border-gpt-primary bg-gpt-hover-light dark:bg-gpt-hover-dark p-4 my-4 rounded-r-lg">
                            {children}
                          </blockquote>
                        )
                      }
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>

                {/* Citations */}
                {hasCitations && (
                  <div className="space-y-2">
                    <button
                      onClick={() => setShowCitations(!showCitations)}
                      className="flex items-center gap-2 text-sm text-gpt-primary hover:text-gpt-primary-hover transition-colors"
                    >
                      <BookOpen className="w-4 h-4" />
                      {showCitations ? 'Hide' : 'Show'} {message.citations?.length} medical reference{message.citations?.length !== 1 ? 's' : ''}
                    </button>

                    <AnimatePresence>
                      {showCitations && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-2 overflow-hidden"
                        >
                          {message.citations?.map((citation, index) => renderCitation(citation, index))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* Medical disclaimer for AI messages */}
                {!isUser && (
                  <div className="bg-gpt-warning/10 border border-gpt-warning/20 text-gpt-warning p-3 rounded-lg text-sm">
                    <p>
                      <strong>Medical Disclaimer:</strong> This information is for educational purposes only and should not replace professional medical judgment. 
                      Always consult with qualified healthcare professionals for medical decisions.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default ChatMessage
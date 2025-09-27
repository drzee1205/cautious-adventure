import React, { useState, useMemo } from 'react'
import { Plus, MessageSquare, Trash2, Edit3, X, Search, Archive, Clock, Star } from 'lucide-react'
import { useChatStore, Conversation } from '../stores/chatStore'
import { motion, AnimatePresence } from 'framer-motion'

interface SidebarProps {
  onClose: () => void
  isMobile: boolean
}

const Sidebar: React.FC<SidebarProps> = ({ onClose, isMobile }) => {
  const { 
    conversations, 
    currentConversationId, 
    createConversation, 
    setCurrentConversation, 
    deleteConversation, 
    archiveConversation,
    updateConversationTitle 
  } = useChatStore()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState('')

  // Filter conversations based on search query
  const filteredConversations = useMemo(() => {
    if (!searchQuery) return conversations
    
    return conversations.filter(conv => 
      conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.messages.some(msg => 
        msg.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    )
  }, [conversations, searchQuery])

  // Separate active and archived conversations
  const activeConversations = filteredConversations.filter(conv => !conv.isArchived)
  const archivedConversations = filteredConversations.filter(conv => conv.isArchived)

  const handleNewChat = () => {
    const newConv = createConversation()
    setCurrentConversation(newConv.id)
    if (isMobile) onClose()
  }

  const handleSelectConversation = (id: string) => {
    setCurrentConversation(id)
    if (isMobile) onClose()
  }

  const handleEditTitle = (conv: Conversation) => {
    setEditingId(conv.id)
    setEditingTitle(conv.title)
  }

  const handleSaveTitle = () => {
    if (editingId && editingTitle.trim()) {
      updateConversationTitle(editingId, editingTitle.trim())
    }
    setEditingId(null)
    setEditingTitle('')
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    if (days < 7) return `${days} days ago`
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`
    return `${Math.floor(days / 30)} months ago`
  }

  return (
    <div className={`w-full h-full flex flex-col bg-gpt-sidebar-light dark:bg-gpt-sidebar-dark ${isMobile ? 'p-4' : ''}`}>
      {/* Header */}
      <div className="p-4 border-b border-gpt-border-light dark:border-gpt-border-dark">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gpt-text-primary-light dark:text-gpt-text-primary-dark">
            Nelson-GPT
          </h2>
          {isMobile && (
            <button
              onClick={onClose}
              className="p-1 rounded hover:bg-gpt-hover-light dark:hover:bg-gpt-hover-dark transition-colors"
            >
              <X className="w-5 h-5 text-gpt-text-secondary-light dark:text-gpt-text-secondary-dark" />
            </button>
          )}
        </div>
        
        {/* New Chat Button */}
        <button
          onClick={handleNewChat}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-gpt-border-light dark:border-gpt-border-dark hover:bg-gpt-hover-light dark:hover:bg-gpt-hover-dark transition-colors focus-visible"
        >
          <Plus className="w-5 h-5 text-gpt-text-primary-light dark:text-gpt-text-primary-dark" />
          <span className="text-gpt-text-primary-light dark:text-gpt-text-primary-dark font-medium">
            New Chat
          </span>
        </button>

        {/* Search */}
        <div className="mt-4 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gpt-text-secondary-light dark:text-gpt-text-secondary-dark" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gpt-bg-light dark:bg-gpt-bg-dark border border-gpt-border-light dark:border-gpt-border-dark rounded-lg text-gpt-text-primary-light dark:text-gpt-text-primary-dark placeholder-gpt-text-secondary-light dark:placeholder-gpt-text-secondary-dark focus:outline-none focus:ring-2 focus:ring-gpt-primary"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {activeConversations.length > 0 && (
          <div className="p-4">
            <h3 className="text-xs font-semibold text-gpt-text-secondary-light dark:text-gpt-text-secondary-dark uppercase tracking-wide mb-2">
              Recent Conversations
            </h3>
            <div className="space-y-1">
              {activeConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`group relative rounded-lg transition-colors ${
                    currentConversationId === conversation.id
                      ? 'bg-gpt-primary/10 border border-gpt-primary/20'
                      : 'hover:bg-gpt-hover-light dark:hover:bg-gpt-hover-dark'
                  }`}
                >
                  <button
                    onClick={() => handleSelectConversation(conversation.id)}
                    className="w-full text-left p-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        {editingId === conversation.id ? (
                          <input
                            type="text"
                            value={editingTitle}
                            onChange={(e) => setEditingTitle(e.target.value)}
                            onBlur={handleSaveTitle}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveTitle()
                              if (e.key === 'Escape') {
                                setEditingId(null)
                                setEditingTitle('')
                              }
                            }}
                            className="w-full bg-transparent border-b border-gpt-primary text-gpt-text-primary-light dark:text-gpt-text-primary-dark focus:outline-none"
                            autoFocus
                          />
                        ) : (
                          <h4 className="text-sm font-medium text-gpt-text-primary-light dark:text-gpt-text-primary-dark truncate">
                            {conversation.title}
                          </h4>
                        )}
                        <p className="text-xs text-gpt-text-secondary-light dark:text-gpt-text-secondary-dark mt-1">
                          {formatDate(conversation.updatedAt)}
                        </p>
                        {conversation.messages.length > 0 && (
                          <p className="text-xs text-gpt-text-secondary-light dark:text-gpt-text-secondary-dark mt-1 line-clamp-2">
                            {conversation.messages[conversation.messages.length - 1].content.substring(0, 100)}...
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEditTitle(conversation)
                          }}
                          className="p-1 rounded hover:bg-gpt-hover-light dark:hover:bg-gpt-hover-dark transition-colors"
                        >
                          <Edit3 className="w-3 h-3 text-gpt-text-secondary-light dark:text-gpt-text-secondary-dark" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            archiveConversation(conversation.id)
                          }}
                          className="p-1 rounded hover:bg-gpt-hover-light dark:hover:bg-gpt-hover-dark transition-colors"
                        >
                          <Archive className="w-3 h-3 text-gpt-text-secondary-light dark:text-gpt-text-secondary-dark" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            if (confirm('Are you sure you want to delete this conversation?')) {
                              deleteConversation(conversation.id)
                            }
                          }}
                          className="p-1 rounded hover:bg-gpt-hover-light dark:hover:bg-gpt-hover-dark transition-colors"
                        >
                          <Trash2 className="w-3 h-3 text-gpt-error" />
                        </button>
                      </div>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Archived Conversations */}
        {archivedConversations.length > 0 && (
          <div className="p-4 border-t border-gpt-border-light dark:border-gpt-border-dark">
            <h3 className="text-xs font-semibold text-gpt-text-secondary-light dark:text-gpt-text-secondary-dark uppercase tracking-wide mb-2">
              Archived
            </h3>
            <div className="space-y-1">
              {archivedConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className="group relative rounded-lg hover:bg-gpt-hover-light dark:hover:bg-gpt-hover-dark transition-colors"
                >
                  <button
                    onClick={() => handleSelectConversation(conversation.id)}
                    className="w-full text-left p-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gpt-text-secondary-light dark:text-gpt-text-secondary-dark truncate">
                          {conversation.title}
                        </h4>
                        <p className="text-xs text-gpt-text-secondary-light dark:text-gpt-text-secondary-dark mt-1">
                          {formatDate(conversation.updatedAt)}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          if (confirm('Are you sure you want to delete this archived conversation?')) {
                            deleteConversation(conversation.id)
                          }
                        }}
                        className="p-1 rounded hover:bg-gpt-hover-light dark:hover:bg-gpt-hover-dark transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-3 h-3 text-gpt-error" />
                      </button>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {activeConversations.length === 0 && archivedConversations.length === 0 && (
          <div className="p-8 text-center">
            <MessageSquare className="w-12 h-12 text-gpt-text-secondary-light dark:text-gpt-text-secondary-dark mx-auto mb-4 opacity-50" />
            <p className="text-gpt-text-secondary-light dark:text-gpt-text-secondary-dark text-sm">
              No conversations yet. Start a new chat to begin.
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gpt-border-light dark:border-gpt-border-dark">
        <div className="text-xs text-gpt-text-secondary-light dark:text-gpt-text-secondary-dark text-center">
          <p className="font-medium">Nelson-GPT</p>
          <p className="mt-1">Powered by Nelson Textbook of Pediatrics</p>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
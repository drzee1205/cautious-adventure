export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  citations?: MedicalCitation[]
  isEditing?: boolean
  regenerateCount?: number
}

export interface MedicalCitation {
  id: string
  source: string
  chapter: string
  page?: number
  url?: string
  relevanceScore: number
  quote?: string
}

export interface Conversation {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
  isArchived?: boolean
}

export interface ChatState {
  conversations: Conversation[]
  currentConversationId: string | null
  isLoading: boolean
  isStreaming: boolean
}

export interface ChatActions {
  createConversation: (title?: string) => Conversation
  setCurrentConversation: (id: string | null) => void
  addMessage: (conversationId: string, message: Omit<Message, 'id' | 'timestamp'>) => Message
  updateMessage: (conversationId: string, messageId: string, updates: Partial<Message>) => void
  deleteMessage: (conversationId: string, messageId: string) => void
  updateConversationTitle: (conversationId: string, title: string) => void
  deleteConversation: (conversationId: string) => void
  archiveConversation: (conversationId: string) => void
  setLoading: (loading: boolean) => void
  setStreaming: (streaming: boolean) => void
  clearAllConversations: () => void
  exportConversation: (conversationId: string, format: 'markdown' | 'pdf') => Promise<void>
  searchConversations: (query: string) => Conversation[]
}
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'

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

interface ChatStore {
  conversations: Conversation[]
  currentConversationId: string | null
  isLoading: boolean
  isStreaming: boolean
  
  // Actions
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
  
  // Getters
  getCurrentConversation: () => Conversation | undefined
  getConversationMessages: (conversationId: string) => Message[]
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      conversations: [],
      currentConversationId: null,
      isLoading: false,
      isStreaming: false,
      
      createConversation: (title = 'New Chat') => {
        const conversation: Conversation = {
          id: uuidv4(),
          title,
          messages: [],
          createdAt: new Date(),
          updatedAt: new Date()
        }
        
        set((state) => ({
          conversations: [conversation, ...state.conversations],
          currentConversationId: conversation.id
        }))
        
        return conversation
      },
      
      setCurrentConversation: (id) => {
        set({ currentConversationId: id })
      },
      
      addMessage: (conversationId, messageData) => {
        const message: Message = {
          ...messageData,
          id: uuidv4(),
          timestamp: new Date()
        }
        
        set((state) => ({
          conversations: state.conversations.map(conv =>
            conv.id === conversationId
              ? {
                  ...conv,
                  messages: [...conv.messages, message],
                  updatedAt: new Date()
                }
              : conv
          )
        }))
        
        return message
      },
      
      updateMessage: (conversationId, messageId, updates) => {
        set((state) => ({
          conversations: state.conversations.map(conv =>
            conv.id === conversationId
              ? {
                  ...conv,
                  messages: conv.messages.map(msg =>
                    msg.id === messageId ? { ...msg, ...updates } : msg
                  ),
                  updatedAt: new Date()
                }
              : conv
          )
        }))
      },
      
      deleteMessage: (conversationId, messageId) => {
        set((state) => ({
          conversations: state.conversations.map(conv =>
            conv.id === conversationId
              ? {
                  ...conv,
                  messages: conv.messages.filter(msg => msg.id !== messageId),
                  updatedAt: new Date()
                }
              : conv
          )
        }))
      },
      
      updateConversationTitle: (conversationId, title) => {
        set((state) => ({
          conversations: state.conversations.map(conv =>
            conv.id === conversationId
              ? { ...conv, title, updatedAt: new Date() }
              : conv
          )
        }))
      },
      
      deleteConversation: (conversationId) => {
        set((state) => ({
          conversations: state.conversations.filter(conv => conv.id !== conversationId),
          currentConversationId: state.currentConversationId === conversationId 
            ? null 
            : state.currentConversationId
        }))
      },
      
      archiveConversation: (conversationId) => {
        set((state) => ({
          conversations: state.conversations.map(conv =>
            conv.id === conversationId
              ? { ...conv, isArchived: true, updatedAt: new Date() }
              : conv
          )
        }))
      },
      
      setLoading: (loading) => set({ isLoading: loading }),
      setStreaming: (streaming) => set({ isStreaming: streaming }),
      
      getCurrentConversation: () => {
        const state = get()
        return state.conversations.find(conv => conv.id === state.currentConversationId)
      },
      
      getConversationMessages: (conversationId) => {
        const state = get()
        const conversation = state.conversations.find(conv => conv.id === conversationId)
        return conversation?.messages || []
      }
    }),
    {
      name: 'nelson-gpt-chats',
      partialize: (state) => ({
        conversations: state.conversations,
        currentConversationId: state.currentConversationId
      })
    }
  )
)
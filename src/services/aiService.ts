import { medicalDB } from '../lib/supabase'
import { Message, MedicalCitation } from '../stores/chatStore'
import { useSettingsStore } from '../stores/settingsStore'

export interface AIResponse {
  content: string
  citations: MedicalCitation[]
  confidence: number
  responseTime: number
}

class MedicalAIService {
  private mistralApiKey = import.meta.env.VITE_MISTRAL_API_KEY || 'SSdeSpCABLM3gPBJJQZ79T1dpmrqBvj3'
  private baseURL = 'https://api.mistral.ai/v1'

  async generateMedicalResponse(
    messages: Message[],
    query: string,
    settings: any
  ): Promise<AIResponse> {
    const startTime = Date.now()
    
    try {
      // Step 1: Search medical knowledge base
      const relevantContent = await this.searchMedicalKnowledge(query)
      
      // Step 2: Prepare context for AI
      const context = this.buildMedicalContext(relevantContent, query)
      
      // Step 3: Generate AI response
      const response = await this.callMistralAPI(messages, context, settings)
      
      // Step 4: Extract and format citations
      const citations = this.extractCitations(relevantContent)
      
      const responseTime = Date.now() - startTime
      
      return {
        content: response,
        citations,
        confidence: this.calculateConfidence(relevantContent),
        responseTime
      }
    } catch (error) {
      console.error('Error generating medical response:', error)
      throw new Error('Failed to generate medical response')
    }
  }

  private async searchMedicalKnowledge(query: string): Promise<any[]> {
    try {
      // Search medical embeddings
      const embeddings = await medicalDB.searchMedicalEmbeddings(query, 10)
      
      // Get full content for top results
      const contentPromises = embeddings.slice(0, 5).map(async (embedding: any) => {
        const content = await medicalDB.getMedicalContent(embedding.id)
        return {
          ...content,
          similarity: embedding.similarity
        }
      })
      
      return Promise.all(contentPromises)
    } catch (error) {
      console.error('Error searching medical knowledge:', error)
      return []
    }
  }

  private buildMedicalContext(content: any[], query: string): string {
    const contextSections = content.map(item => `
      Source: ${item.metadata?.source || 'Nelson Textbook of Pediatrics'}
      Chapter: ${item.metadata?.chapter || 'Unknown'}
      Page: ${item.metadata?.page || 'N/A'}
      Content: ${item.content}
      Relevance: ${item.similarity?.toFixed(2) || 'N/A'}
    `).join('\n---\n')

    return `
      Medical Context from Nelson Textbook of Pediatrics:
      ${contextSections}
      
      User Query: ${query}
      
      Instructions:
      1. Provide evidence-based medical information
      2. Include relevant citations from the Nelson Textbook
      3. Add appropriate medical disclaimers
      4. Use clear, professional medical language
      5. Structure response for clinical utility
    `
  }

  private async callMistralAPI(
    messages: Message[],
    context: string,
    settings: any
  ): Promise<string> {
    const response = await fetch(`${this.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.mistralApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'mistral-medium',
        messages: [
          {
            role: 'system',
            content: this.buildSystemPrompt(settings)
          },
          {
            role: 'user',
            content: context
          },
          ...messages.slice(-5).map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        ],
        temperature: 0.3,
        max_tokens: 2000,
        stream: false
      })
    })

    if (!response.ok) {
      throw new Error(`Mistral API error: ${response.status}`)
    }

    const data = await response.json()
    return data.choices[0].message.content
  }

  private buildSystemPrompt(settings: any): string {
    const responseStyle = settings.medical?.responseStyle || 'detailed'
    const specialization = settings.medical?.specialization || 'general'
    
    return `
      You are Nelson-GPT, an AI-powered pediatric medical assistant based on the Nelson Textbook of Pediatrics.
      
      Your role is to:
      1. Provide accurate, evidence-based pediatric medical information
      2. Assist healthcare professionals with clinical decision-making
      3. Reference specific chapters and pages from Nelson Textbook
      4. Maintain professional medical communication standards
      
      Response Style: ${responseStyle}
      Specialization Focus: ${specialization}
      
      Important Guidelines:
      - Always include medical disclaimers
      - Cite specific sources from Nelson Textbook
      - Use appropriate medical terminology
      - Structure responses for clinical utility
      - Include differential diagnoses when relevant
      - Suggest appropriate diagnostic workup
      - Recommend treatment protocols based on evidence
      
      Disclaimer: This information is for educational purposes only and should not replace professional medical judgment.
    `
  }

  private extractCitations(content: any[]): MedicalCitation[] {
    return content.slice(0, 3).map((item, index) => ({
      id: `citation-${index}`,
      source: item.metadata?.source || 'Nelson Textbook of Pediatrics',
      chapter: item.metadata?.chapter || 'General Pediatrics',
      page: item.metadata?.page,
      url: item.metadata?.url,
      relevanceScore: item.similarity || 0,
      quote: this.extractRelevantQuote(item.content)
    }))
  }

  private extractRelevantQuote(content: string): string {
    // Extract a relevant quote from the content (first 200 chars)
    return content.substring(0, 200) + (content.length > 200 ? '...' : '')
  }

  private calculateConfidence(content: any[]): number {
    if (content.length === 0) return 0
    
    const avgSimilarity = content.reduce((sum, item) => sum + (item.similarity || 0), 0) / content.length
    return Math.min(avgSimilarity * 100, 95) // Cap at 95% for medical safety
  }

  async *streamMedicalResponse(
    messages: Message[],
    query: string,
    settings: any
  ): AsyncGenerator<string> {
    const response = await fetch(`${this.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.mistralApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'mistral-medium',
        messages: [
          {
            role: 'system',
            content: this.buildSystemPrompt(settings)
          },
          {
            role: 'user',
            content: query
          }
        ],
        temperature: 0.3,
        max_tokens: 2000,
        stream: true
      })
    })

    const reader = response.body?.getReader()
    if (!reader) throw new Error('No response body')

    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6)
          if (data === '[DONE]') continue
          
          try {
            const parsed = JSON.parse(data)
            const content = parsed.choices?.[0]?.delta?.content
            if (content) {
              yield content
            }
          } catch (e) {
            // Ignore parsing errors for malformed chunks
          }
        }
      }
    }
  }
}

// Export singleton instance
export const aiService = new MedicalAIService()

// Utility functions for medical content processing
export const medicalUtils = {
  formatMedicalResponse: (content: string, citations: MedicalCitation[]) => {
    let formatted = content
    
    // Add citations
    if (citations.length > 0) {
      formatted += '\n\n**Medical References:**\n'
      citations.forEach((citation, index) => {
        formatted += `${index + 1}. ${citation.source}, Chapter: ${citation.chapter}`
        if (citation.page) formatted += `, Page ${citation.page}`
        formatted += '\n'
      })
    }
    
    // Add disclaimer
    formatted += '\n\n*This information is for educational purposes only and should not replace professional medical judgment. Always consult with qualified healthcare professionals for medical decisions.*'
    
    return formatted
  },
  
  extractMedicalEntities: (text: string) => {
    // Simple entity extraction for medical terms
    const medicalTerms = [
      'diagnosis', 'treatment', 'symptom', 'condition', 'disease',
      'medication', 'dosage', 'protocol', 'guideline', 'reference'
    ]
    
    const found = medicalTerms.filter(term => 
      text.toLowerCase().includes(term)
    )
    
    return found
  },
  
  validateMedicalContent: (content: string) => {
    // Basic validation for medical content
    const requiredElements = [
      'disclaimer', 'reference', 'professional'
    ]
    
    const hasDisclaimer = requiredElements.some(element =>
      content.toLowerCase().includes(element)
    )
    
    return {
      isValid: hasDisclaimer,
      warnings: hasDisclaimer ? [] : ['Missing medical disclaimer']
    }
  }
}
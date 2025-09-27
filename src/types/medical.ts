import { MedicalCitation } from './chat'

export interface AIResponse {
  content: string
  citations: MedicalCitation[]
  confidence: number
  responseTime: number
}

export interface MedicalKnowledgeEntry {
  id: string
  content: string
  chapter: string
  section: string
  page?: number
  embedding?: number[]
  tags: string[]
  medicalSpecialty: MedicalSpecialty
  lastUpdated: Date
}

export enum MedicalSpecialty {
  GENERAL = 'general',
  CARDIOLOGY = 'cardiology',
  NEUROLOGY = 'neurology',
  ENDOCRINOLOGY = 'endocrinology',
  EMERGENCY = 'emergency',
  INFECTIOUS_DISEASE = 'infectious_disease',
  GASTROENTEROLOGY = 'gastroenterology',
  PULMONOLOGY = 'pulmonology',
  HEMATOLOGY = 'hematology',
  ONCOLOGY = 'oncology',
  NEPHROLOGY = 'nephrology',
  RHEUMATOLOGY = 'rheumatology',
  DERMATOLOGY = 'dermatology',
  PSYCHIATRY = 'psychiatry'
}

export enum ResponseStyle {
  DETAILED = 'detailed',
  CONCISE = 'concise',
  EDUCATIONAL = 'educational',
  CLINICAL = 'clinical'
}

export interface MedicalContext {
  patientAge?: string
  patientWeight?: string
  symptoms?: string[]
  currentMedications?: string[]
  allergies?: string[]
  medicalHistory?: string[]
  specialty?: MedicalSpecialty
  urgency?: 'low' | 'medium' | 'high' | 'emergency'
}

export interface DiagnosticSuggestion {
  id: string
  condition: string
  icd10Code?: string
  probability: number
  supportingEvidence: string[]
  requiredTests?: string[]
  differentialDiagnoses?: string[]
}

export interface TreatmentRecommendation {
  id: string
  intervention: string
  dosage?: string
  frequency?: string
  duration?: string
  contraindications?: string[]
  monitoringRequired?: string[]
  alternativeOptions?: string[]
}
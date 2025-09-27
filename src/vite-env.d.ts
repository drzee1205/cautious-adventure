/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_MISTRAL_API_KEY: string
  readonly VITE_ENCRYPTION_KEY: string
  readonly VITE_MEDICAL_DATASET_TABLE: string
  readonly VITE_EMBEDDINGS_TABLE: string
  readonly VITE_ENABLE_OFFLINE_MODE: string
  readonly VITE_ENABLE_PUSH_NOTIFICATIONS: string
  readonly VITE_ENABLE_ANALYTICS: string
  readonly VITE_DEV_MODE: string
  readonly VITE_MOCK_AI_RESPONSES: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
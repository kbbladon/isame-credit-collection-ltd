import { createServerFeature } from '@payloadcms/richtext-lexical'

export const GroqAIFeature = createServerFeature({
  key: 'groqAI',
  feature: {
    ClientFeature: '@/features/GroqAI/feature.client#GroqAIClientFeature',
  },
})

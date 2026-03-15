import { lexicalEditor } from '@payloadcms/richtext-lexical'
import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
} from '@payloadcms/richtext-lexical'
import {
  TextColorFeature,
  TextSizeFeature,
  TextLetterSpacingFeature,
  TextLineHeightFeature,
  TextFontFamilyFeature,
} from 'payload-lexical-typography'
import { GroqAIFeature } from '@/features/GroqAI/feature.server'

export const richTextEditor = lexicalEditor({
  features: ({ rootFeatures }) => [
    ...rootFeatures,
    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
    BlocksFeature({ blocks: [] }), // Blocks will be added per collection
    TextColorFeature({
      colors: [
        '#000000',
        '#FFFFFF',
        '#FF0000',
        '#00FF00',
        '#0000FF',
        '#FFA500',
        '#800080',
        '#FFC0CB',
        '#A52A2A',
        '#808080',
      ],
    }),
    TextSizeFeature({
      sizes: [
        { label: 'Small', value: '12px' },
        { label: 'Normal', value: '16px' },
        { label: 'Large', value: '20px' },
        { label: 'Huge', value: '24px' },
      ],
    }),
    TextLetterSpacingFeature(),
    TextLineHeightFeature(),
    TextFontFamilyFeature({
      fontFamilies: [
        { label: 'System Default', value: 'sans-serif' },
        { label: 'Serif', value: 'Georgia, serif' },
        { label: 'Monospace', value: 'Courier New, monospace' },
        { label: 'Arial', value: 'Arial, sans-serif' },
        { label: 'Helvetica', value: 'Helvetica, sans-serif' },
      ],
    }),
    GroqAIFeature(),
    FixedToolbarFeature(),
    InlineToolbarFeature(),
    HorizontalRuleFeature(),
  ],
})

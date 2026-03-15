import type { TextFieldSingleValidation } from 'payload'
import {
  BoldFeature,
  ItalicFeature,
  LinkFeature,
  ParagraphFeature,
  lexicalEditor,
  UnderlineFeature,
  EXPERIMENTAL_TableFeature,
  AlignFeature,
  UploadFeature,
  UnorderedListFeature,
  OrderedListFeature,
  HeadingFeature,
  FixedToolbarFeature,
  InlineToolbarFeature,
} from '@payloadcms/richtext-lexical'

import { GroqAIFeature } from '@/features/GroqAI/feature.server'

// Import typography plugin features
import {
  TextColorFeature,
  TextSizeFeature,
  TextLetterSpacingFeature,
  TextLineHeightFeature,
  TextFontFamilyFeature,
} from 'payload-lexical-typography'

export const defaultLexical = lexicalEditor({
  features: [
    // Basic formatting
    ParagraphFeature(),
    UnderlineFeature(),
    BoldFeature(),
    ItalicFeature(),
    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),

    // Links
    LinkFeature({
      enabledCollections: ['pages', 'posts'],
      fields: ({ defaultFields }) => {
        const defaultFieldsWithoutUrl = defaultFields.filter((field) => {
          if ('name' in field && field.name === 'url') return false
          return true
        })

        return [
          ...defaultFieldsWithoutUrl,
          {
            name: 'url',
            type: 'text',
            admin: {
              condition: (_data, siblingData) => siblingData?.linkType !== 'internal',
            },
            label: ({ t }) => t('fields:enterURL'),
            required: true,
            validate: ((value, options) => {
              // 👇 Inline type assertion instead of imported LinkFields
              const siblingData = options?.siblingData as { linkType?: string }
              if (siblingData?.linkType === 'internal') {
                return true
              }
              return value ? true : 'URL is required'
            }) as TextFieldSingleValidation,
          },
        ]
      },
    }),

    // Text alignment
    AlignFeature(),

    // Image upload
    UploadFeature({
      collections: {
        media: {
          fields: [],
        },
      },
    }),

    // Lists
    UnorderedListFeature(),
    OrderedListFeature(),

    // Tables (experimental)
    EXPERIMENTAL_TableFeature(),

    // Typography features
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

    // Toolbar features
    FixedToolbarFeature(),
    InlineToolbarFeature(),

    // Your custom AI feature
    GroqAIFeature(),
  ],
})

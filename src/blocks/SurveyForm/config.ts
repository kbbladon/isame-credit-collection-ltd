import type { Block } from 'payload'

export const SurveyForm: Block = {
  slug: 'surveyForm',
  interfaceName: 'SurveyFormBlock',
  fields: [
    {
      name: 'survey',
      type: 'relationship',
      relationTo: 'surveys',
      required: true,
      filterOptions: {
        isActive: { equals: true },
      },
    },
    {
      name: 'title',
      type: 'text',
      label: 'Override Title (optional)',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Override Description (optional)',
    },
  ],
}

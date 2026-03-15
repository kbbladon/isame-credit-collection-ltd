import type { CollectionConfig } from 'payload'
import { authenticated } from '@/access/authenticated'

export const SurveyResponses: CollectionConfig = {
  slug: 'survey-responses',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['survey', 'createdAt', 'displayAsTestimonial'],
  },
  access: {
    read: authenticated, // only logged‑in users can view responses
    create: () => true, // anyone can submit (public)
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: 'survey',
      type: 'relationship',
      relationTo: 'surveys',
      required: true,
    },
    {
      name: 'answers',
      type: 'json',
      required: true,
    },
    {
      name: 'displayAsTestimonial',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'testimonialName',
      type: 'text',
      admin: {
        condition: (data, siblingData) => siblingData?.displayAsTestimonial === true,
      },
    },
  ],
}

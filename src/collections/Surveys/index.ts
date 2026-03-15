import type { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'
export const Surveys: CollectionConfig = {
  slug: 'surveys',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'isActive', 'createdAt'],
  },
  access: {
    read: () => true,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'questions',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'questionText',
          type: 'text',
          required: true,
        },
        {
          name: 'questionType',
          type: 'select',
          required: true,
          options: [
            { label: 'Text (single line)', value: 'text' },
            { label: 'Textarea', value: 'textarea' },
            { label: 'Rating (1-5 stars)', value: 'rating' },
            { label: 'Yes/No', value: 'yesno' },
          ],
          defaultValue: 'text',
        },
        {
          name: 'required',
          type: 'checkbox',
          defaultValue: true,
        },
      ],
    },
    {
      name: 'thankYouMessage',
      type: 'richText',
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}

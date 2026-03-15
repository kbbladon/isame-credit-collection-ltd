import type { Field } from 'payload'
import { linkGroup } from '@/fields/linkGroup'
import { defaultLexical } from '@/fields/defaultLexical'

export const hero: Field = {
  name: 'hero',
  type: 'group',
  fields: [
    {
      name: 'type',
      type: 'select',
      defaultValue: 'lowImpact',
      options: [
        { label: 'None', value: 'none' },
        { label: 'High Impact', value: 'highImpact' },
        { label: 'Medium Impact', value: 'mediumImpact' },
        { label: 'Low Impact', value: 'lowImpact' },
        { label: 'Video', value: 'video' },
        { label: 'Slideshow', value: 'slideshow' },
      ],
      required: true,
    },
    {
      name: 'richText',
      type: 'richText',
      editor: defaultLexical,
      label: false,
    },
    linkGroup({ overrides: { maxRows: 2 } }),
    {
      name: 'media',
      type: 'upload',
      admin: {
        condition: (_, { type } = {}) => ['highImpact', 'mediumImpact'].includes(type),
      },
      relationTo: 'media',
      required: true,
    },
    // Video-specific fields (unchanged)
    {
      name: 'videoType',
      type: 'radio',
      admin: {
        condition: (_, { type } = {}) => type === 'video',
        layout: 'horizontal',
      },
      options: [
        { label: 'YouTube', value: 'youtube' },
        { label: 'MP4 Upload', value: 'mp4' },
      ],
      defaultValue: 'youtube',
    },
    {
      name: 'youtubeUrl',
      type: 'text',
      admin: {
        condition: (_, { type, videoType } = {}) => type === 'video' && videoType === 'youtube',
      },
      label: 'YouTube URL',
      required: true,
    },
    {
      name: 'mp4Video',
      type: 'upload',
      relationTo: 'media',
      admin: {
        condition: (_, { type, videoType } = {}) => type === 'video' && videoType === 'mp4',
      },
      label: 'MP4 Video File',
      required: true,
    },
    {
      name: 'placeholderImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        condition: (_, { type } = {}) => type === 'video',
        description:
          'Shows while video loads. For YouTube, if not provided, video thumbnail will be used.',
      },
      label: 'Placeholder Image (optional)',
    },
    {
      name: 'overlayColor',
      type: 'text',
      admin: {
        condition: (_, { type } = {}) => type === 'video',
        description:
          'Enter a CSS color (e.g., rgba(0,0,0,0.5), #00000080, or a hex). Leave empty for no overlay.',
      },
      label: 'Overlay Color',
    },
    {
      name: 'videoHeight',
      type: 'select',
      admin: {
        condition: (_, { type } = {}) => type === 'video',
      },
      options: [
        { label: 'Full Screen', value: 'min-h-screen' },
        { label: 'Large', value: 'min-h-[80vh]' },
        { label: 'Medium', value: 'min-h-[60vh]' },
        { label: 'Small', value: 'min-h-[40vh]' },
      ],
      defaultValue: 'min-h-screen',
    },
    {
      name: 'contentAlignment',
      type: 'select',
      admin: {
        condition: (_, { type } = {}) => type === 'video',
      },
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' },
      ],
      defaultValue: 'center',
    },
    {
      name: 'animationPreset',
      type: 'select',
      admin: {
        condition: (_, { type } = {}) => type === 'video',
      },
      options: [
        { label: 'Fade Up', value: 'fade' },
        { label: 'Slide from Left', value: 'slide-left' },
        { label: 'Slide from Right', value: 'slide-right' },
        { label: 'Slide from Bottom', value: 'slide-up' },
        { label: 'Skew', value: 'skew' },
      ],
      defaultValue: 'fade',
    },
    {
      name: 'linkAlignment',
      type: 'select',
      admin: {
        condition: (_, { type } = {}) => type === 'video',
      },
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' },
      ],
      defaultValue: 'center',
    },
    {
      name: 'linkGap',
      type: 'select',
      admin: {
        condition: (_, { type } = {}) => type === 'video',
      },
      options: [
        { label: 'Small', value: '2' },
        { label: 'Medium', value: '4' },
        { label: 'Large', value: '6' },
      ],
      defaultValue: '4',
    },
    // Slideshow-specific fields
    {
      name: 'slideshowImages',
      type: 'array',
      admin: {
        condition: (_, { type } = {}) => type === 'slideshow',
        description: 'Add images for the slideshow.',
      },
      label: 'Slideshow Images',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'caption',
          type: 'text',
          admin: {
            description: 'Optional caption for this slide.',
          },
        },
        // 👇 NEW: toggle to enable/disable link
        {
          name: 'hasLink',
          type: 'checkbox',
          label: 'Add link to this slide?',
          defaultValue: false,
        },
        // 👇 link group (conditionally visible)
        {
          name: 'link',
          type: 'group',
          label: 'Slide Link',
          admin: {
            condition: (_, siblingData) => siblingData?.hasLink === true,
          },
          fields: [
            {
              name: 'type',
              type: 'radio',
              options: [
                { label: 'Internal Page', value: 'reference' },
                { label: 'Custom URL', value: 'custom' },
              ],
              defaultValue: 'custom',
            },
            {
              name: 'reference',
              type: 'relationship',
              relationTo: ['pages', 'posts'],
              admin: {
                condition: (_, siblingData) => siblingData?.type === 'reference',
              },
            },
            {
              name: 'url',
              type: 'text',
              admin: {
                condition: (_, siblingData) => siblingData?.type === 'custom',
              },
            },
            {
              name: 'label',
              type: 'text',
              required: true,
              label: 'Link Label (for accessibility)',
            },
            {
              name: 'newTab',
              type: 'checkbox',
              label: 'Open in new tab',
            },
          ],
        },
      ],
    },
    {
      name: 'slideshowEffect',
      type: 'select',
      admin: {
        condition: (_, { type } = {}) => type === 'slideshow',
      },
      options: [
        { label: 'Slide', value: 'slide' },
        { label: 'Fade', value: 'fade' },
        { label: 'Cube', value: 'cube' },
        { label: 'Coverflow', value: 'coverflow' },
        { label: 'Flip', value: 'flip' },
      ],
      defaultValue: 'slide',
    },
    {
      name: 'slideshowSpeed',
      type: 'number',
      admin: {
        condition: (_, { type } = {}) => type === 'slideshow',
        description: 'Autoplay speed in milliseconds (0 to disable).',
        step: 500,
      },
      label: 'Autoplay Speed (ms)',
      defaultValue: 5000,
    },
    {
      name: 'slideshowNavigation',
      type: 'checkbox',
      admin: {
        condition: (_, { type } = {}) => type === 'slideshow',
      },
      label: 'Show navigation arrows',
      defaultValue: true,
    },
    {
      name: 'slideshowPagination',
      type: 'checkbox',
      admin: {
        condition: (_, { type } = {}) => type === 'slideshow',
      },
      label: 'Show pagination dots',
      defaultValue: true,
    },
    // Mobile-specific slideshow fields
    {
      name: 'slideshowUseMobileImages',
      type: 'checkbox',
      admin: {
        condition: (_, { type } = {}) => type === 'slideshow',
        description: 'Use different images on mobile devices.',
      },
      label: 'Use different images on mobile',
    },
    {
      name: 'slideshowMobileImages',
      type: 'array',
      admin: {
        condition: (_, { type, slideshowUseMobileImages } = {}) =>
          type === 'slideshow' && slideshowUseMobileImages === true,
      },
      label: 'Mobile Slideshow Images',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'caption',
          type: 'text',
        },
        // 👇 NEW: toggle for mobile slides
        {
          name: 'hasLink',
          type: 'checkbox',
          label: 'Add link to this slide?',
          defaultValue: false,
        },
        // 👇 link group for mobile (conditionally visible)
        {
          name: 'link',
          type: 'group',
          label: 'Slide Link',
          admin: {
            condition: (_, siblingData) => siblingData?.hasLink === true,
          },
          fields: [
            {
              name: 'type',
              type: 'radio',
              options: [
                { label: 'Internal Page', value: 'reference' },
                { label: 'Custom URL', value: 'custom' },
              ],
              defaultValue: 'custom',
            },
            {
              name: 'reference',
              type: 'relationship',
              relationTo: ['pages', 'posts'],
              admin: {
                condition: (_, siblingData) => siblingData?.type === 'reference',
              },
            },
            {
              name: 'url',
              type: 'text',
              admin: {
                condition: (_, siblingData) => siblingData?.type === 'custom',
              },
            },
            {
              name: 'label',
              type: 'text',
              required: true,
              label: 'Link Label (for accessibility)',
            },
            {
              name: 'newTab',
              type: 'checkbox',
              label: 'Open in new tab',
            },
          ],
        },
      ],
    },
    {
      name: 'slideshowMobileHeight',
      type: 'select',
      admin: {
        condition: (_, { type } = {}) => type === 'slideshow',
      },
      options: [
        { label: 'Full Screen', value: 'min-h-screen' },
        { label: 'Large', value: 'min-h-[80vh]' },
        { label: 'Medium', value: 'min-h-[60vh]' },
        { label: 'Small', value: 'min-h-[40vh]' },
      ],
      defaultValue: 'min-h-screen',
    },
  ],
  label: false,
}

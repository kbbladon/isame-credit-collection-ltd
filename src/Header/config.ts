import type { GlobalConfig } from 'payload'
import { link } from '@/fields/link'
import { revalidateHeader } from './hooks/revalidateHeader'

export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'navItems',
      type: 'array',
      fields: [
        link({
          appearances: false,
        }),
        {
          name: 'children',
          type: 'array',
          label: 'Dropdown Items',
          fields: [
            link({
              appearances: false,
            }),
          ],
          maxRows: 5,
        },
      ],
      maxRows: 6,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Header/RowLabel#RowLabel',
        },
      },
    },
    {
      name: 'ctaButton',
      type: 'group',
      label: 'Header CTA Button',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          defaultValue: 'Get Started',
        },
        {
          name: 'url',
          type: 'text',
          required: true,
          defaultValue: '/contact',
        },
      ],
    },
    // Appearance settings
    {
      name: 'backgroundColor',
      type: 'text',
      label: 'Header Background Color',
      defaultValue: 'rgba(0,0,0,0.3)',
      admin: {
        description: 'Enter any valid CSS color (hex, rgb, rgba). Leave empty for transparent.',
      },
    },
    {
      name: 'textColor',
      type: 'text',
      label: 'Text Color',
      defaultValue: '#ffffff',
      admin: {
        description: 'Main text color for navigation and icons (hex, rgb, etc.).',
      },
    },
    {
      name: 'hoverColor',
      type: 'text',
      label: 'Hover Color',
      defaultValue: '#D4AF37',
      admin: {
        description: 'Color when hovering over navigation links.',
      },
    },
    // Sticky behavior
    {
      name: 'stickyHeader',
      type: 'checkbox',
      label: 'Enable Sticky Header',
      defaultValue: true,
    },
    {
      name: 'transparentOnTop',
      type: 'checkbox',
      label: 'Transparent when at top',
      defaultValue: true,
      admin: {
        condition: (data) => data?.stickyHeader === true,
        description: 'Header starts transparent and becomes solid after scrolling.',
      },
    },
    {
      name: 'scrollThreshold',
      type: 'number',
      label: 'Scroll Threshold (px)',
      defaultValue: 50,
      min: 0,
      max: 500,
      admin: {
        condition: (data) => data?.stickyHeader === true && data?.transparentOnTop === true,
        description: 'Number of pixels to scroll before header becomes solid.',
      },
    },
    {
      name: 'blurIntensity',
      type: 'number',
      label: 'Backdrop Blur (px)',
      defaultValue: 8,
      min: 0,
      max: 20,
      admin: {
        description: 'Blur effect on the header background (0 = no blur).',
      },
    },
    {
      name: 'overlayHero',
      type: 'checkbox',
      label: 'Overlay header on hero',
      defaultValue: true,
      admin: {
        description:
          'If enabled, the header will be fixed over the hero area. Otherwise, it will sit above it.',
      },
    },
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
}

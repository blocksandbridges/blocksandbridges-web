import type { ReactNode } from 'react';

export const contentPage = {
  name: 'contentPage',
  title: 'Content Page',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Page Title',
      type: 'string',
      validation: (Rule: { required: () => unknown }) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule: { required: () => unknown }) => Rule.required(),
      description: 'Used to map this document to a route (e.g. mission-and-vision).',
    },
    {
      name: 'heroImage',
      title: 'Hero Banner Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          title: 'Alt text',
          type: 'string',
        },
      ],
      description:
        'Optional. Upload an image or choose one from Unsplash. If provided, the image is shown in the hero banner with a dark-blue tint overlay.',
    },
    {
      name: 'content',
      title: 'Main Content',
      type: 'array',
      of: [{ type: 'block' }],
      validation: (Rule: { required: () => unknown }) => Rule.required(),
      description: 'Single Portable Text block area for page body content.',
    },
    {
      name: 'showInNavigation',
      title: 'Show in Navigation',
      type: 'boolean',
      initialValue: false,
      description: 'Enable to place this page in the site navigation.',
    },
    {
      name: 'navigationGroup',
      title: 'Navigation Group',
      type: 'string',
      options: {
        list: [
          { title: 'Top-level navigation', value: 'main' },
          { title: 'About Us submenu', value: 'about-us' },
          { title: 'About FASD submenu', value: 'about-fasd' },
          { title: 'Events submenu', value: 'events' },
        ],
        layout: 'radio',
      },
      hidden: ({ document }: { document?: { showInNavigation?: boolean } }) => !document?.showInNavigation,
      validation: (Rule: { custom: (fn: (value: unknown, context: { document?: { showInNavigation?: boolean } }) => true | string) => unknown }) =>
        Rule.custom((value, context) => {
          if (!context.document?.showInNavigation) return true;
          return typeof value === 'string' && value.length > 0
            ? true
            : 'Navigation Group is required when Show in Navigation is enabled.';
        }),
    },
    {
      name: 'navigationLabel',
      title: 'Navigation Label',
      type: 'string',
      description: 'Optional. Overrides the page title in the navigation.',
      hidden: ({ document }: { document?: { showInNavigation?: boolean } }) => !document?.showInNavigation,
    },
    {
      name: 'navigationOrder',
      title: 'Navigation Order',
      type: 'number',
      initialValue: 100,
      description: 'Lower numbers appear earlier in the selected navigation group.',
      hidden: ({ document }: { document?: { showInNavigation?: boolean } }) => !document?.showInNavigation,
      validation: (Rule: { integer: () => { min: (n: number) => unknown } }) => Rule.integer().min(0),
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'slug.current',
      media: 'heroImage',
    },
    prepare({
      title,
      subtitle,
      media,
    }: {
      title?: string | null;
      subtitle?: string | null;
      media?: unknown;
    }) {
      return {
        title: title || 'Untitled content page',
        subtitle: subtitle ? `/${subtitle}` : 'No slug',
        media: (media as ReactNode) || ('📄' as unknown as ReactNode),
      };
    },
  },
};

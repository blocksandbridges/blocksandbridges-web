import type { ReactNode } from 'react';

export const contributor = {
  name: 'contributor',
  title: 'Contributor',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'Display name for this project contributor (e.g. in blog author dropdown).',
      validation: (Rule: { required: () => unknown }) => Rule.required(),
    },
    {
      name: 'image',
      title: 'Profile picture',
      type: 'image',
      options: { hotspot: true },
      description: 'Profile photo for this contributor.',
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      description: 'Optional URL-friendly identifier for author pages or links.',
    },
  ],
  preview: {
    select: { title: 'name', media: 'image' },
    prepare({ title, media }: { title?: string | null; media?: unknown }) {
      return {
        title: title || 'Unnamed contributor',
        media: media as ReactNode,
      };
    },
  },
};

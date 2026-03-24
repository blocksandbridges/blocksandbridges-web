import type { ReactNode } from 'react';

export const missionVisionPage = {
  name: 'missionVisionPage',
  title: 'Mission and Vision Page',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Page Title',
      type: 'string',
      initialValue: 'Mission and Vision',
      validation: (Rule: { required: () => unknown }) => Rule.required(),
    },
    {
      name: 'content',
      title: 'Main Content',
      type: 'array',
      of: [{ type: 'block' }],
      validation: (Rule: { required: () => unknown }) => Rule.required(),
      description: 'Single Portable Text content area for the Mission and Vision page body.',
    },
  ],
  preview: {
    select: {
      title: 'title',
    },
    prepare({ title }: { title?: string | null }) {
      return {
        title: title || 'Mission and Vision',
        subtitle: 'Page Content',
        media: '📘' as unknown as ReactNode,
      };
    },
  },
};

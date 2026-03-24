import type { ReactNode } from 'react';

export const teamMember = {
  name: 'teamMember',
  title: 'Team Member',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule: { required: () => unknown }) => Rule.required(),
    },
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule: { required: () => unknown }) => Rule.required(),
    },
    {
      name: 'bio',
      title: 'Bio',
      type: 'array',
      of: [{ type: 'block' }],
      validation: (Rule: { required: () => unknown }) => Rule.required(),
    },
    {
      name: 'image',
      title: 'Photo',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          title: 'Alt text',
          type: 'string',
          description: 'Accessible image description. Defaults to the team member name if left blank.',
        },
      ],
    },
    {
      name: 'sortOrder',
      title: 'Sort order',
      type: 'number',
      description: 'Lower numbers appear first on the Team page.',
      initialValue: 0,
      validation: (Rule: { integer: () => { required: () => unknown } }) => Rule.integer().required(),
    },
  ],
  orderings: [
    {
      title: 'Sort order (ascending)',
      name: 'sortOrderAsc',
      by: [{ field: 'sortOrder', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'title',
      media: 'image',
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
        title: title || 'Unnamed team member',
        subtitle: subtitle || 'No role set',
        media: media as ReactNode,
      };
    },
  },
};

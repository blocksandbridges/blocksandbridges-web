import type { ReactNode } from 'react';

export const blogPost = {
  name: 'blogPost',
  title: 'Blog Post',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'publishedAt',
      title: 'Published date',
      type: 'datetime',
      description: 'Date and time the post was (or will be) published.',
    },
    {
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'contributor' }],
      description: 'Post author. Add contributors in the Contributors section to see them here.',
    },
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
      description: 'Tags for filtering and search (e.g. crafts, tutorial, news).',
    },
    {
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [{ type: 'block' }],
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'caption',
          title: 'Caption',
          type: 'string',
          description: 'Optional caption shown below the image.',
        },
      ],
    },
  ],
  preview: {
    select: { title: 'title', media: 'image', publishedAt: 'publishedAt' },
    prepare({ title, media, publishedAt }: { title?: string | null; media?: unknown; publishedAt?: string | null }) {
      const date = publishedAt ? new Date(publishedAt).toLocaleDateString() : '';
      return {
        title: title || 'Untitled',
        subtitle: date,
        media: media as ReactNode,
      };
    },
  },
};
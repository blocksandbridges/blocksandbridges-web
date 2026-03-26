export const homeHeroSlide = {
  name: 'homeHeroSlide',
  title: 'Hero slide',
  type: 'object',
  fields: [
    {
      name: 'image',
      title: 'Background image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          title: 'Alt text',
          type: 'string',
          description: 'Describe the image for screen readers.',
        },
      ],
      validation: (Rule: { required: () => unknown }) => Rule.required(),
    },
    {
      name: 'title',
      title: 'Headline',
      type: 'string',
    },
    {
      name: 'subtitle',
      title: 'Subheadline',
      type: 'text',
      rows: 3,
    },
    {
      name: 'linkUrl',
      title: 'Button link (optional)',
      type: 'url',
    },
    {
      name: 'linkLabel',
      title: 'Button label',
      type: 'string',
      description: 'Shown when a button link is set.',
    },
  ],
};

export const homePage = {
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  fields: [
    {
      name: 'slides',
      title: 'Hero slides',
      type: 'array',
      of: [{ type: 'homeHeroSlide' }],
      description:
        'Full-width hero banners on the home page. They advance automatically; order is the order shown.',
    },
    {
      name: 'slideIntervalSeconds',
      title: 'Seconds per slide',
      type: 'number',
      initialValue: 6,
      validation: (Rule: { min: (n: number) => { max: (n: number) => unknown } }) => Rule.min(3).max(120),
    },
  ],
};

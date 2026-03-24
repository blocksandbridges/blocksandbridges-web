import Image from 'next/image';
import { PortableText, type PortableTextComponents } from '@portabletext/react';
import type { PortableTextBlock } from '@portabletext/types';
import { client } from '@/sanity/lib/client';

type TeamMember = {
  _id: string;
  name: string;
  title: string;
  bio: PortableTextBlock[];
  imageUrl: string | null;
  imageAlt: string | null;
};

const teamMembersQuery = `
  *[_type == "teamMember"] | order(sortOrder asc, _createdAt asc) {
    _id,
    name,
    title,
    bio,
    "imageUrl": image.asset->url,
    "imageAlt": image.alt
  }
`;

const portableTextComponents: PortableTextComponents = {
  block: {
    h1: ({ children }) => <h1 className="text-4xl md:text-5xl font-merriweather text-bnb-dark-blue mb-4">{children}</h1>,
    h2: ({ children }) => <h2 className="text-3xl md:text-4xl font-merriweather text-bnb-dark-blue mb-4">{children}</h2>,
    h3: ({ children }) => <h3 className="text-2xl md:text-3xl font-merriweather text-bnb-dark-blue mb-3">{children}</h3>,
    h4: ({ children }) => <h4 className="text-xl md:text-2xl font-merriweather text-bnb-dark-blue mb-3">{children}</h4>,
    normal: ({ children }) => <p className="mb-4">{children}</p>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-bnb-light-blue pl-4 italic mb-4">{children}</blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc pl-6 mb-4">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal pl-6 mb-4">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li className="mb-1">{children}</li>,
    number: ({ children }) => <li className="mb-1">{children}</li>,
  },
};

export default async function Team() {
  const teamMembers = await client.fetch<TeamMember[]>(teamMembersQuery);
  return (
    <div className="bnb-content-page-root">
      <section className="bnb-hero-banner">
        <div className="container mx-auto relative z-10">
          <h1 className="bnb-hero-banner-title">Team</h1>
        </div>
      </section>

      <section className="container mx-auto py-10 md:py-14">
        <div className="space-y-12">
          {teamMembers.map((member, index) => {
            const isImageLeft = index % 2 === 0;
            return (
              <div key={member._id}>
                <section
                  className={`grid grid-cols-1 md:grid-cols-2 gap-8 items-center ${
                    isImageLeft ? '' : 'md:[&>*:first-child]:order-2 md:[&>*:last-child]:order-1'
                  }`}
                >
                  <div className="flex justify-center md:justify-start">
                    {member.imageUrl != null && (
                      <Image
                        src={member.imageUrl}
                        alt={member.imageAlt || member.name}
                        className="bnb-team-image bnb-team-image-fade-all"
                        width={800}
                        height={800}
                      />
                    )}
                  </div>
                  <div className="bnb-body-text">
                    <h2 className="bnb-section-header mb-2">{member.name}</h2>
                    <h3 className="text-bnb-light-blue text-xl md:text-2xl mb-4">{member.title}</h3>
                    <div className="[&_p]:mb-4 [&_p:last-child]:mb-0">
                      <PortableText value={member.bio} components={portableTextComponents} />
                    </div>
                  </div>
                </section>
                <hr className="my-12 border-bnb-light-blue opacity-50" />
              </div>
            );
          })}

          {teamMembers.length === 0 && (
            <div className="bnb-body-text">
              <p>No team members found in Sanity yet.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

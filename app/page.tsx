import { client } from '@/sanity/lib/client';
import { homePageQuery, type HomePagePayload } from '@/app/lib/homePageQuery';
import { HomeView } from '@/components/HomeView';

/** Revalidate home page periodically so new hero slides appear without a full redeploy. */
export const revalidate = 60;

export default async function Home() {
  const data = await client.fetch<HomePagePayload | null>(homePageQuery);
  return <HomeView data={data} />;
}

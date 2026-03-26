export type HomeSlidePayload = {
  imageUrl: string | null;
  alt: string | null;
  title: string | null;
  subtitle: string | null;
  linkUrl: string | null;
  linkLabel: string | null;
};

export type HomePagePayload = {
  slides: HomeSlidePayload[] | null;
  slideIntervalSeconds: number | null;
};

/** Singleton document id — create “Home Page” in Studio (singleton) with this id. */
export const homePageQuery = `
  *[_type == "homePage" && _id == "homePage"][0] {
    slideIntervalSeconds,
    slides[] {
      "imageUrl": image.asset->url,
      "alt": coalesce(image.alt, ""),
      title,
      subtitle,
      linkUrl,
      linkLabel
    }
  }
`;

import Image from 'next/image';
import Link from 'next/link';
import { logoTypes } from '@/app/lib/constants';
import type { HomePagePayload } from '@/app/lib/homePageQuery';
import { HomeHeroSlideshow } from '@/components/HomeHeroSlideshow';

function HomeFallback() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-4 w-full items-center">
      <div className="flex items-center justify-center md:justify-start w-full px-2 md:pl-12">
        <Image
          src={logoTypes.colorComboMark}
          alt="Blocks and Bridges logo"
          className="w-full max-w-xs sm:max-w-md mt-6 sm:mt-10 md:mt-[100px]"
          width={400}
          height={400}
        />
      </div>
      <div
        className="flex justify-center md:justify-end items-center text-center md:text-right
          font-merriweather text-2xl sm:text-3xl md:text-[40px] leading-snug md:leading-none
          mt-4 sm:mt-8 md:mt-[100px] px-2 md:px-0"
      >
        <p>
          Blocks and Bridges is a Fetal Alcohol Spectrum Disorder (FASD) Support and Awareness Organization.
        </p>
      </div>
    </div>
  );
}

export function HomeView({ data }: { data: HomePagePayload | null }) {
  const slides = data?.slides?.filter((s) => s.imageUrl != null && s.imageUrl.length > 0) ?? [];
  const intervalSec = data?.slideIntervalSeconds ?? 6;
  const intervalMs = Math.max(3000, Math.min(120000, intervalSec * 1000));

  if (slides.length === 0) {
    return <HomeFallback />;
  }

  return (
    <>
      <HomeHeroSlideshow slides={slides} intervalMs={intervalMs} />
      <section
        className="mt-12 md:mt-16 mb-10 w-full"
        aria-labelledby="home-fasd-intro-heading"
      >
        <div className="mx-auto w-[75%] max-w-5xl px-2">
          <h1
            id="home-fasd-intro-heading"
            className="font-merriweather text-2xl sm:text-3xl md:text-4xl text-bnb-dark-blue text-center leading-tight mb-6"
          >
            Fetal Alcohol Spectrum Disorder (FASD) affects an estimated 1.5 million people in
            Canada.
          </h1>
          <h2 className="font-merriweather text-xl sm:text-2xl md:text-3xl text-bnb-dark-blue text-center leading-snug font-normal">
            But that is an underestimation; many cases of FASD are never diagnosed.
          </h2>
        </div>
      </section>

      <section
        className="mt-12 md:mt-16 mb-10 w-full"
        aria-labelledby="home-how-you-can-help-heading"
      >
        <div className="mx-auto w-[75%] max-w-5xl px-2">
          <h1
            id="home-how-you-can-help-heading"
            className="font-merriweather text-2xl sm:text-3xl md:text-4xl text-bnb-dark-blue text-center leading-tight mb-6"
          >
            How You Can Help
          </h1>
          <h2 className="font-merriweather text-xl sm:text-2xl md:text-3xl text-bnb-dark-blue text-center leading-snug font-normal">
            There are three main ways you can help us to support our families: you can donate
            money, you can donate time, and you can learn more about Fetal Alcohol Spectrum
            Disorder.
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
            <Link
              href="/"
              className="bnb-form-button inline-block text-center no-underline sm:min-w-0"
            >
              Donate
            </Link>
            <Link
              href="/"
              className="bnb-form-button inline-block text-center no-underline sm:min-w-0"
            >
              Volunteer
            </Link>
            <Link
              href="/"
              className="bnb-form-button inline-block text-center no-underline sm:min-w-0"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

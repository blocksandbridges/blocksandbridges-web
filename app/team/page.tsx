import Image from "next/image";
import { asset_base_url } from "@/app/lib/constants";

export default function Team() {
  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="flex justify-start items-start">
          <Image
            src={`${asset_base_url}/kayt-and-ryan.png`}
            alt="Kayt and Ryan"
            className="bnb-circular-image"
            width={500}
            height={500}
          />
        </div>
        <div className="bnb-body-text">
          <p>
            <strong className="bnb-section-header">Who We Are</strong>
            <br /><br />
            Hi! We&apos;re Kayt and Ryan!<br />
            Co-Founders of <strong className="text-red-600"><em>Dragon&apos;s Purr Crafts and Sundry!</em></strong> 
            <br /><br />
            We started Dragon&apos;s Purr for a bunch of different reasons, but chief among them was a desire to share our creativity with the world, and to make dorky little trinkets that folks like us would find funny, charming, and above all, inclusive; it&apos;s our hope that you&apos;ll find a bit of yourselves in our quirky designs.
            <br /><br />
            Beyond that, we believe in helping out where we can, and championing causes close to our hearts, both through the art we make, and through direct support in the form of charitable donations which come from the sale of that same art.
            <br />
          </p>
        </div>
        <div className="bnb-body-text">
          <p>
            <strong className="bnb-section-header">What We Make</strong>
            <br /><br />
            If you can slap vinyl on it, we can make it. From t-shirts to stickers, to mugs, keychains, and much more. Beyond the custom die-cut vinyl, we also offer small-scale custom engravings, and our own in-house designs on apparel courtesy of our sister brand, Hipster Donut Apparel. Check our portfolio page for some of our past work!
            <br /><br />
          </p>
        </div>
      </div>
    </div>
  );
}

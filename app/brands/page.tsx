import { logoTypes, externalLinkAttributes } from "@/app/lib/constants";
import Image from 'next/image';

const brands = [
  {
    href: "https://dragonspurr.ca",
    img: logoTypes.colorComboMarkWide,
    alt: "Dragon's Purr Crafts and Sundry",
    title: "Dragon's Purr Crafts and Sundry",
    description: "Dragon's Purr is our main brand. We make a variety of things, from t-shirts to stickers to mugs to keychains. All of which are made with die-cut vinyl.",
  },
  {
    href: "https://hipsterdonut.myspreadshop.ca",
    img: logoTypes.colorComboMark,
    alt: "Hipster Donut Apparel",
    title: "Hipster Donut Apparel",
    description: "Hipster Donut Apparel is our sister brand. In-house designs on apparel of all kinds. Nerdy, snarky, sarcastic, topical, and above all, fun.",
  },
];

export default function Brands() {
  return (
    <div className="container mx-auto">
      <div className="space-y-8 mb-6">
        {brands.map((brand) => (
          <div
            key={brand.href}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center"
          >
            <a href={brand.href} className="block"{...externalLinkAttributes}>
              <Image 
                src={brand.img} 
                alt={brand.alt} 
                width={400} 
                height={400} 
                className="max-w-full h-auto" 
              />
            </a>
            <div>
              <h3 className="bnb-section-header">
                <strong>{brand.title}</strong>
              </h3>
              <br /><br />
              <p className="bnb-body-text">{brand.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

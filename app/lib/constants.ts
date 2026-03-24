const envConfig = {
  emailjs: {
    serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
    templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
    userId: process.env.NEXT_PUBLIC_EMAILJS_USER_ID,
  },
  googleAnalyticsId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
  logrocketId: process.env.NEXT_PUBLIC_LOGROCKET_ID,
};

const asset_base_url = "https://assets.blocksandbridges.ca";

const externalLinkAttributes = { target: "_blank", rel: "noreferrer" as const };

const siteInfo = {
  name: "Blocks and Bridges",
  url: "https://blocksandbridges.ca",
  email: "info@blocksandbridges.ca",
  phone: "+1 (416) 555-1234",
  address: "608-26 Carluke Crescent, Toronto, ON M2L 2J2",
  hours: "Monday - Friday: 9:00 AM - 5:00 PM",
  description: "Dragon's Purr Crafts and Sundry is a Toronto-Based Creative Duo that makes things",
};

const socialMedia = {
  bluesky: "https://bsky.app/profile/dragonspurr.bsky.social",
  heycafe: "https://hey.cafe/@dragonspurr",
  eh: "https://ehnw.ca/u/dragonspurr",
  instagram: "https://www.instagram.com/dragonspurr",
  facebook: "https://www.facebook.com/dragonspurr",
};

const logoTypes = {
  colorComboMark: `${asset_base_url}/brand/color-combo-mark.png`,
  colorComboMarkWide: `${asset_base_url}/brand/color-combo-mark-wide.png`,
  colorSymbol: `${asset_base_url}/brand/color-symbol.png`,
};

export { asset_base_url, externalLinkAttributes, logoTypes, siteInfo, socialMedia, envConfig };

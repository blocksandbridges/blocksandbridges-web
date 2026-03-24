import { externalLinkAttributes } from "@/app/lib/constants";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bnb-footer">
      <div className="bnb-footer-text">
        Site design by{' '}
        <a href="https://boxingoctop.us" 
          className="bnb-link" {...externalLinkAttributes}>
          Boxing Octopus Creative
        </a>{' '}
        | All content and assets are Copyright © {year}{' '}
        <a href="https://blocksandbridges.ca" 
           className="bnb-link" {...externalLinkAttributes}>
          Blocks and Bridges Ltd.
        </a>
      </div>
    </footer>
  );
}

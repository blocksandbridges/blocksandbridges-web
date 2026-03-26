# Sanity content

Schemas live in `sanity/schemas/`. Run Studio from the project root:

```bash
npx sanity dev
```

Set `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET` in `.env.local` (and deploy the schema when it changes).

## Home page hero slideshow

The **Home Page** singleton (`_id`: `homePage`) drives the autoscrolling hero on `/`:

- **Slides** — ordered list of hero slides (image required; headline, subheadline, optional button link).
- **Seconds per slide** — autoplay interval (3–120 seconds).

Open **Home Page** in the Studio sidebar, add slides, and publish. If the document is missing or has no slides with images, the site falls back to the static logo + tagline block.

## Other types

- **`contentPage`** — dynamic routes under `/[slug]` with optional hero image and Portable Text body.
- **`teamMember`** — team bios and photos for `/team`.

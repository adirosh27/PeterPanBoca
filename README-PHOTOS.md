# Gallery photos

Gallery photos are stored in **Vercel Blob** (store `peter-pan-boca-photos`), not in this repo.
Keeping them out of `public/` keeps each Vercel deployment small. When the photos were in the
repo, every deployment carried a full copy of them and used up the account's Deployment Storage.

**Don't add gallery photos under `public/images/`.** That folder is git-ignored for year folders
(`public/images/20*/`) and only holds site assets like `PP_Logo.png`.

## How it works

- Photos live in Blob at `images/<year>/<event name>/<file>`.
- `public/image-manifest.json` maps each `<year>/<event name>` to its photo URLs. It is committed
  to the repo, and `/api/photos` serves it to the galleries page.
- `next.config.js` allows `next/image` to load and optimize images from
  `*.public.blob.vercel-storage.com`.

## Adding a new gallery

1. One-time setup: pull the Blob token into `.env.local`:

   ```bash
   vercel env pull .env.local
   ```

2. Put the photos in a folder named `<year>/<event name>/`, for example
   `photos-to-upload/2026/שייט - אפריל 2026/`. `photos-to-upload/` is git-ignored.

3. Upload them. Files already in Blob are skipped, and the manifest is regenerated:

   ```bash
   npm run photos:upload -- "photos-to-upload/2026/שייט - אפריל 2026"
   ```

4. Add the event to `src/lib/data.ts` as before, then commit `public/image-manifest.json` and the
   data change.

To rebuild the manifest from what's in Blob (for example after deleting photos in the Vercel
dashboard), run `npm run photos:manifest`.

## Limits (Hobby plan)

Vercel Blob on Hobby includes 1 GB of storage, 2,000 uploads/lists and 10 GB of transfer per
month, shared with the account's other projects. If you go over, Blob is blocked for 30 days.
The galleries use about 635 MB, so keep an eye on the Blob usage page, and consider resizing very
large camera photos (for example to 2400px wide) before uploading.

## Deleting photos

Use the admin page at `/admin/photos`. It deletes the photos from Blob and commits the updated
manifest to GitHub (needs `GITHUB_TOKEN`), which redeploys the site.

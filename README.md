# Crittermino

A browser puzzle that plays like Fillomino, with animal homes instead of numbers.

- Mouse homes are 2 cells
- Cat homes are 3
- Dog homes are 4
- Panda homes are 5
- Lion homes are 6

Fill every cell. A home must be exactly that size and connected edge to edge. Two homes of the same size cannot share a wall. The same level number is the same puzzle for everyone.

## Play locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The first five levels are a short tutorial. Progress, best scores, sound, and the daily streak are stored in `localStorage`.

Node 20.19+ matches the toolchain. On Node 20.14, `package.json` pins `magic-string` to a CommonJS build so Tailwind can load.

Node 20.14 cannot `require()` the ESM-only `magic-string` that current Tailwind pulls in. `package.json` pins `magic-string` to 0.30.17, which still ships a CommonJS build. Node 20.19 or newer does not need that pin.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the Next.js app |
| `npm run lint` | Run ESLint |
| `npm run build` | Production build |
| `npm run generate` | Rebuild `data/levels.json` (pass a count, e.g. `npm run generate -- 60`) |
| `npm run verify` | Check every banked level is uniquely solvable and matches the generator |
| `npm run assets` | Redraw the PWA icons and Open Graph image |

`npm run verify` regenerates each puzzle, so a 60-level check takes a couple of minutes.

## How puzzles are made

`lib/generator.ts` seeds a random number generator with the level number, tiles the grid into connected homes, then removes clues while `lib/solver.ts` can still prove there is exactly one solution. Levels 1 and 2 are handmade lessons. Level 3 is a fixed lesson about same-size homes. Levels 1–300 ship in `data/levels.json` so they open instantly. Clearing level 300 shows a coming-soon screen instead of building another puzzle.

Grid sizes:

- 1–5: tutorial, 3×3 then 4×4
- 6–20: 5×5, mouse, cat, and dog
- 21–50: 6×6, panda joins at 21 and lion at 36
- 51–300: 7×7

Mouse and cat alone cannot tile these squares without two homes of the same size touching, so dog is in the palette from the first lesson.

## Deploy

The app is a standard Next.js project and deploys to Vercel with no extra config. Point the project at this directory, leave the build command as `next build`, and serve it over HTTPS so the web app manifest and service worker can be installed.

`lib/site.ts` is the canonical origin. It is `https://crittermino.vercel.app` because `crittermino.com` is not registered yet. `app/sitemap.ts` and `app/robots.ts` follow that URL. When the custom domain resolves, change `SITE.url` and add the domain in the Vercel project.

## Google Search Console

The live sitemap is `https://crittermino.vercel.app/sitemap.xml`. `robots.txt` points at it.

1. In [Google Search Console](https://search.google.com/search-console), add the URL-prefix property `https://crittermino.vercel.app`.
2. Choose the HTML tag method. The `content` value lives in `app/layout.tsx` and is printed as `<meta name="google-site-verification">`. `GOOGLE_SITE_VERIFICATION` overrides it when set.
3. After that tag is on the live site, click Verify, then submit `sitemap.xml`.

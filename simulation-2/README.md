# Simulation #2

A self-hosted, walletless 3D gallery for the white and black rooms — kiosk and
online, no ID or wallet, replacing the oncyber.io embed for the white room
eventually and standing in for a "black room" that never had a digital form
before.

## What's here

- **`src/gallery/`** — the walking, looking-around, walls-and-paintings engine.
  Vendored from [KilledByAPixel/fxhashArchive](https://github.com/KilledByAPixel/fxhashArchive)
  (MIT licensed — see `THIRD_PARTY_LICENSES/`), mostly unmodified: `engine.ts`,
  `scene.ts`, `geometry.ts`, `controls.ts`, `collide.ts`, `load.ts`, `labels.ts`,
  `approach.ts`, `mirror.ts`, `palette.ts`, `pools.ts`, `query.ts`, `sculpture.ts`
  carry an attribution header and are otherwise as published. Two files were
  adapted, not just copied — see their own file headers for exactly what changed
  and why: `GalleryView.tsx` (drops the Viewer overlay — fxhash's run-the-
  generator UI, no equivalent for a photograph) and `Hud.tsx` (flat room list
  instead of an Eras/Artists split, and copy that doesn't assume a browsable
  archive exists to leave to).
- **`src/gallery/types.ts`** — the data shape the engine renders from. Matches the
  vendored engine's original shape field-for-field (so it still compiles) plus
  what this year adds: a `Naming` record with a kiosk-stamped timestamp, credit,
  and optional description, a `namingWindow` gate, and forward-compatible
  `tokenId`/`contract`/`chain` fields for the white cube port later.
- **`src/gallery/floorplan.ts`** — ours, not vendored (named to avoid colliding
  with the engine's own `geometry.ts`, which does something else — mesh
  building). Turns a room's floor polygon into wall segments, with an open,
  frameless doorway left between two rooms. `POINTS_WHITE` / `POINTS_BLACK` are a
  first-pass approximation from measurements given in conversation, not a
  survey — replace them when you have real ones; `public/data/gallery.json`'s
  `walls` were computed from these exact points, so regenerate that too if you do.
- **`src/lib/data.ts`, `src/lib/links.ts`** — the one loader the engine actually
  needs (fxhashArchive's own `lib/data.ts` also handles tokens/artists/market data
  this app has no use for), and the repo/site links shown in the About panel.
- **`src/App.tsx`, `src/main.tsx`, `src/pages/GalleryPage.tsx`** — the smallest
  app shell that mounts the gallery as the only route. `GalleryPage`'s WebGL
  check and lazy-import of the engine are kept from the source, since they're
  what stops three.js from loading on a device that can't run it.
- **`public/data/gallery.json`** — a placeholder: real wall geometry (matching
  `floorplan.ts`), zero paintings. Enough for `npm run dev` / `npm run build` to
  actually work today. The atlas-packing script that will turn a folder of mark
  photos into painting entries + a texture atlas, mirroring fxhashArchive's
  `scripts/build-gallery.mjs`, doesn't exist yet — next thing to build, once a
  photo selection is in the repo.

## Deliberately not here yet

The naming UI (the kiosk form, the `namingWindow` check, the "who named this"
plaque) and the atlas-build script — both waiting on a photo selection landing in
the repo first, per your own sequencing. Tests weren't ported either (the source
repo's `*.test.ts(x)` files and `vitest` setup) — worth pulling over if useful,
just left out of this pass to keep it lean.

## Running it

```
cd simulation-2
npm install
npm run dev        # local dev server
npm run build       # production build, output in dist/
npm run typecheck    # tsc --noEmit
```

## One thing to know about the license

This repo is EUPL-1.2. The vendored engine files are MIT — a permissive license
with no copyleft, so they can sit in an EUPL repo as their own thing without
relicensing anything, as long as their license notice travels with them (which
`THIRD_PARTY_LICENSES/fxhashArchive-LICENSE` and each file's header do). I'm not
a lawyer and this isn't legal advice — if it matters for how "open" you want this
repo to read, worth a real look.

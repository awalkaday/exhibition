# Simulation #2 — digital foundations

Four files, meant to drop into the existing `exhibition` repo at these paths:

```
.github/workflows/deploy.yml
simulation-2/vite.config.ts
simulation-2/src/gallery/types.ts
simulation-2/src/gallery/geometry.ts
```

## What's here

- **types.ts** — the data shape the whole app renders from. It's the fxhashArchive
  `Gallery`/`Room`/`Wall`/`Painting` shape (github.com/KilledByAPixel/fxhashArchive) plus
  what this year adds: a `Naming` record with a kiosk-stamped timestamp (the temporal
  signature), an optional `namer` credit and `description`, and forward-compatible
  `tokenId`/`contract`/`chain` fields for the white cube port later.
- **geometry.ts** — turns a room's floor polygon into wall segments, with support for
  leaving a gap for the open, frameless doorway between the two rooms. `POINTS_WHITE` and
  `POINTS_BLACK` are a first-pass approximation from the measurements given in
  conversation, not a survey — replace them once you have real numbers or a sketch;
  everything else derives from those points.
- **vite.config.ts** — sets `base: '/simulation-2/'` so the built app's asset paths
  resolve correctly when served from that path under the existing domain.
- **deploy.yml** — builds the Jekyll site and the Vite app separately, merges them, and
  deploys both together. Requires one manual switch in the repo's Settings > Pages, from
  "Deploy from a branch" to "GitHub Actions" — noted in the workflow file itself.

## Deliberately not here

The actual 3D engine — `engine.ts`, `scene.ts`, `controls.ts`, `collide.ts`, `load.ts`,
`labels.ts`, `approach.ts`, `Hud.tsx`, `Viewer.tsx`, `GalleryView.tsx` — isn't reproduced
in this scaffold. That code already exists, is MIT-licensed, and is best pulled directly
from github.com/KilledByAPixel/fxhashArchive rather than retyped here. It's also generic:
none of it knows about fxhash specifically, so it should drop in with little more than the
data layer (this scaffold) wired underneath it. Also left out: the naming UI itself (the
kiosk form, the window check against `namingWindow`, the "who named this" plaque
rendering) and the script that packs your mark photos and Photo Collection images into
the atlas + `gallery.json`, mirroring `scripts/build-gallery.mjs` — next things to build,
once the shape above is confirmed.

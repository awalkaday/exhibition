// simulation-2/src/lib/data.ts
//
// The one loader the vendored engine actually calls. fxhashArchive's own
// src/lib/data.ts also loads tokens, artists, collaborations, and market data for
// its browsable archive pages — none of which this app has, since it's just the
// gallery. This is that file's `loadGallery`, on its own.

import type { Gallery } from '../gallery/types'

const BASE = `${import.meta.env.BASE_URL}data/`
let cache: Promise<Gallery> | null = null

/** The building: rooms, walls, and every painting's place and atlas tile. Fetched once, then cached for the session. */
export const loadGallery = (): Promise<Gallery> => {
  if (!cache) {
    cache = fetch(`${BASE}gallery.json`)
      .then((res) => {
        if (!res.ok) throw new Error(`gallery.json: HTTP ${res.status}`)
        return res.json() as Promise<Gallery>
      })
      .catch((err) => { cache = null; throw err })
  }
  return cache
}

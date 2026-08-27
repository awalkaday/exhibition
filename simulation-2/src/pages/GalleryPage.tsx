// simulation-2/src/pages/GalleryPage.tsx
//
// Adapted from KilledByAPixel/fxhashArchive's src/pages/GalleryPage.tsx (MIT
// licensed — see simulation-2/THIRD_PARTY_LICENSES/fxhashArchive-LICENSE). Kept
// as-is: the WebGL probe and the lazy import, so three.js is never fetched on a
// device that can't run it — worth keeping since this runs on visitors' own
// phones as much as the kiosk laptop. Changed: the no-WebGL fallback no longer
// points at a browsable grid, since this app has no second view to offer instead.

import { lazy, Suspense, useState } from 'react'

// three.js lives behind this import and is only fetched once WebGL is known to exist.
const GalleryView = lazy(() => import('../gallery/GalleryView'))

export function hasWebGL(): boolean {
  try {
    const c = document.createElement('canvas')
    return Boolean(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

/**
 * The white and black rooms. Full-bleed, outside any site chrome: the page is
 * the building, and a site header over a building reads as a bug.
 */
export default function GalleryPage() {
  const [supported] = useState(hasWebGL)
  if (!supported) {
    return (
      <div className="gallery gallery-unsupported">
        <p>This browser doesn't offer WebGL, which the gallery needs to run.</p>
      </div>
    )
  }
  return (
    <Suspense fallback={<div className="gallery"><p className="gallery-loading">Loading the gallery…</p></div>}>
      <GalleryView />
    </Suspense>
  )
}
